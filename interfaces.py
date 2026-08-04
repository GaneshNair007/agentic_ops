"""Frozen interface contract between orchestrator/ (llm side) and rag/ + tools/ (partner side).

These four signatures must never change without both partners agreeing first.
This module is the stable facade: callers may import retrieve/remember/
execute_action/emit_event from here and stay decoupled from where the real
implementations live (currently rag/store.py and tools/actions.py).

Implementations are imported lazily at call time so this file always imports
cleanly, even in a checkout where the implementation modules are absent; a
missing implementation surfaces as a clear ImportError only when called.
"""


def retrieve(query: str, k: int) -> list[dict]:
    """Return up to k relevant documents (runbooks / past incidents).

    Each dict has at least: {"id": str, "kind": "runbook"|"incident",
    "title": str, "text": str, "score": float}.
    """
    from rag.store import retrieve as _impl
    return _impl(query, k)


def remember(record: dict) -> None:
    """Persist a resolved incident record into the memory store."""
    from rag.store import remember as _impl
    _impl(record)


def execute_action(action_type: str, params: dict) -> dict:
    """Execute a (mock) remediation action. Returns {"status": str, ...}."""
    from tools.actions import execute_action as _impl
    return _impl(action_type, params)


def emit_event(event: dict) -> None:
    """Append a structured event to the audit/event log."""
    from tools.actions import emit_event as _impl
    _impl(event)
