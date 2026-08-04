"""Incident-response agent loop: retrieve -> hypothesize -> self-critique ->
confidence-gated action -> memory write-back.

Calls ONLY the frozen contract functions from rag/store.py and tools/actions.py
(signatures declared in interfaces.py).
"""

import datetime
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from llm.client import LLMClient  # noqa: E402
from rag.store import remember, retrieve  # noqa: E402
from tools.actions import emit_event, execute_action  # noqa: E402

CONFIDENCE_AUTO_EXECUTE = 0.6  # below this we only recommend, never act

# risk levels for the mock action set; high-risk always requires human approval
ACTION_RISK = {
    "restart_service": "low",
    "open_ticket": "low",
    "draft_postmortem": "low",
    "rollback_deploy": "high",
}

SYSTEM_PROMPT = (
    "You are an on-prem incident-response copilot for SRE teams. Be concise, "
    "structured, and evidence-driven. Never invent metrics not present in the "
    "provided context."
)


def _now() -> str:
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def _extract_confidence(text: str, default: float = 0.5) -> float:
    matches = re.findall(r"CONFIDENCE[:\s]+([01](?:\.\d+)?)", text, flags=re.IGNORECASE)
    if not matches:
        return default
    try:
        return max(0.0, min(1.0, float(matches[-1])))
    except ValueError:
        return default


class IncidentAgent:
    def __init__(self, llm: LLMClient | None = None):
        self.llm = llm or LLMClient()

    def handle_incident(self, incident: dict) -> dict:
        """Run the full pipeline for one incident dict {"id", "title", "description"}."""
        emit_event({"ts": _now(), "stage": "start", "incident_id": incident["id"],
                    "llm_mode": self.llm.mode})

        # 1. Retrieve relevant runbooks / past incidents
        query = f"{incident['title']} {incident['description']}"
        docs = retrieve(query, k=3)
        emit_event({"ts": _now(), "stage": "retrieve", "incident_id": incident["id"],
                    "doc_ids": [d["id"] for d in docs]})
        context = "\n\n".join(
            f"[{d['kind']}] {d['title']}\n{d['text']}" for d in docs
        ) or "(no relevant documents found)"

        # 2. Root-cause hypothesis
        hyp = self.llm.generate(
            f"INCIDENT: {incident['title']}\n{incident['description']}\n\n"
            f"RELEVANT CONTEXT (runbooks and similar past incidents):\n{context}\n\n"
            "State your single most likely root-cause hypothesis with supporting "
            "evidence from the context. End with a line exactly of the form "
            "'CONFIDENCE: <0.0-1.0>'.",
            system=SYSTEM_PROMPT,
        )
        hypothesis = hyp["text"].strip()
        confidence = _extract_confidence(hypothesis)
        emit_event({"ts": _now(), "stage": "hypothesis", "incident_id": incident["id"],
                    "confidence": confidence})

        # 3. Self-critique: actively try to disprove the hypothesis before acting
        crit = self.llm.generate(
            f"INCIDENT: {incident['title']}\n{incident['description']}\n\n"
            f"CONTEXT:\n{context}\n\n"
            f"PROPOSED HYPOTHESIS:\n{hypothesis}\n\n"
            "Act as a skeptical senior engineer. Try to disprove this hypothesis: "
            "list evidence that contradicts it and at least one plausible "
            "alternative cause. Then state whether the hypothesis survives. End "
            "with a line exactly of the form 'REVISED CONFIDENCE: <0.0-1.0>'.",
            system=SYSTEM_PROMPT,
        )
        critique = crit["text"].strip()
        revised = _extract_confidence(critique, default=confidence)
        emit_event({"ts": _now(), "stage": "self_critique", "incident_id": incident["id"],
                    "revised_confidence": revised})

        # 4. Confidence-gated action
        action_type, params = self._decide_action(incident, hypothesis)
        risk = ACTION_RISK.get(action_type, "high")
        if risk == "high":
            action_result = {"status": "approval_required",
                             "reason": f"{action_type} is high-risk; human must approve"}
            emit_event({"ts": _now(), "stage": "action_gated", "incident_id": incident["id"],
                        "action": action_type, "risk": risk})
        elif revised >= CONFIDENCE_AUTO_EXECUTE:
            action_result = execute_action(action_type, params)
            emit_event({"ts": _now(), "stage": "action_executed", "incident_id": incident["id"],
                        "action": action_type, "risk": risk, "result": action_result})
        else:
            action_result = {"status": "recommended_only",
                             "reason": f"confidence {revised:.2f} below "
                                       f"{CONFIDENCE_AUTO_EXECUTE} auto-execute threshold"}
            emit_event({"ts": _now(), "stage": "action_withheld", "incident_id": incident["id"],
                        "action": action_type, "confidence": revised})

        # 5. Memory write-back so future similar incidents resolve faster
        record = {
            "id": incident["id"],
            "title": incident["title"],
            "description": incident["description"],
            "hypothesis": hypothesis,
            "critique": critique,
            "confidence": revised,
            "action": {"type": action_type, "params": params, "result": action_result},
            "resolved_at": _now(),
        }
        remember(record)
        emit_event({"ts": _now(), "stage": "remember", "incident_id": incident["id"]})

        return record

    def _decide_action(self, incident: dict, hypothesis: str) -> tuple[str, dict]:
        """Heuristic action selection (native tool-calling is a stretch goal)."""
        text = f"{incident['description']} {hypothesis}".lower()
        service = incident.get("service", "payments-api")
        if "rollback" in text or "bad deploy" in text or "revert" in text:
            return "rollback_deploy", {"service": service}
        if any(w in text for w in ("restart", "pool exhaust", "connection pool",
                                   "memory leak", "hung")):
            return "restart_service", {"service": service}
        return "open_ticket", {"service": service,
                               "summary": incident["title"],
                               "hypothesis": hypothesis[:400]}
