"""Mock remediation actions + event/audit log — MINIMAL STUB honoring interfaces.py.

Owner: partner. All actions are mocks; nothing touches real infrastructure.
"""

import datetime
import json
from pathlib import Path

EVENTS_FILE = Path(__file__).resolve().parents[1] / "events.log"


def execute_action(action_type: str, params: dict) -> dict:
    ts = datetime.datetime.now(datetime.timezone.utc).isoformat()
    if action_type == "restart_service":
        return {"status": "ok", "detail": f"[mock] restarted {params.get('service')}", "ts": ts}
    if action_type == "open_ticket":
        return {"status": "ok", "detail": "[mock] ticket INC-4021 opened", "ts": ts}
    if action_type == "draft_postmortem":
        return {"status": "ok", "detail": "[mock] postmortem draft saved", "ts": ts}
    if action_type == "rollback_deploy":
        return {"status": "ok", "detail": f"[mock] rolled back {params.get('service')}", "ts": ts}
    return {"status": "error", "detail": f"unknown action {action_type!r}", "ts": ts}


def emit_event(event: dict) -> None:
    with EVENTS_FILE.open("a", encoding="utf-8") as f:
        f.write(json.dumps(event) + "\n")
