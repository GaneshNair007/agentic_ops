"""Frozen interface contract between orchestrator/ (llm side) and rag/ + tools/ (partner side).

These four signatures must never change without both partners agreeing first.
orchestrator/agent.py imports and calls exactly these; rag/store.py and
tools/actions.py provide the real implementations.
"""


def retrieve(query: str, k: int) -> list[dict]:
    """Return up to k relevant documents (runbooks / past incidents).

    Each dict has at least: {"id": str, "kind": "runbook"|"incident",
    "title": str, "text": str, "score": float}.
    """
    raise NotImplementedError("implemented in rag/store.py")


def remember(record: dict) -> None:
    """Persist a resolved incident record into the memory store."""
    raise NotImplementedError("implemented in rag/store.py")


def execute_action(action_type: str, params: dict) -> dict:
    """Execute a (mock) remediation action. Returns {"status": str, ...}."""
    raise NotImplementedError("implemented in tools/actions.py")


def emit_event(event: dict) -> None:
    """Append a structured event to the audit/event log."""
    raise NotImplementedError("implemented in tools/actions.py")
