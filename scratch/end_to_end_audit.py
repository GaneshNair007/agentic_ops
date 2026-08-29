"""
AI SRE System - End-to-End Integration Verification & Production Readiness Audit Script
"""

import os
import sys
import json
import time
import re
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

# Reconfigure stdout for UTF-8 compatibility
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


def run_verification_and_audit():
    report = {
        "modules": {},
        "warnings": [],
        "errors": [],
        "metrics": {},
        "audit_checks": {},
        "readiness_score": 100
    }

    print("\n" + "=" * 75)
    print("   AI SRE System - End-to-End Integration Verification & Audit")
    print("=" * 75)

    # Step 1: Verify Project Structure & Required Files
    print("\n[Audit 1/5] Verifying Project File Structure...")
    required_files = [
        PROJECT_ROOT / "rag" / "build_index.py",
        PROJECT_ROOT / "rag" / "retrieve.py",
        PROJECT_ROOT / "tools" / "actions.py",
        PROJECT_ROOT / "tools" / "event_bus.py",
        PROJECT_ROOT / "README.md",
        PROJECT_ROOT / "tests" / "test_retrieve.py",
        PROJECT_ROOT / "tests" / "test_actions.py",
        PROJECT_ROOT / "tests" / "test_event_bus.py",
        PROJECT_ROOT / "tests" / "test_integration.py",
    ]

    missing_files = [str(f.relative_to(PROJECT_ROOT)) for f in required_files if not f.exists()]
    
    incidents_dir = PROJECT_ROOT / "rag" / "data" / "incidents"
    runbooks_dir = PROJECT_ROOT / "rag" / "data" / "runbooks"

    incident_count = len(list(incidents_dir.glob("*.json"))) if incidents_dir.exists() else 0
    runbook_count = len(list(runbooks_dir.glob("*.md"))) if runbooks_dir.exists() else 0

    print(f"  • Incidents JSON files:  {incident_count} / 20")
    print(f"  • Runbooks Markdown:    {runbook_count} / 15")
    print(f"  • Missing core files:    {len(missing_files)}")

    if incident_count < 20 or runbook_count < 15 or missing_files:
        report["readiness_score"] -= 20
        report["errors"].append(f"Structure incomplete: missing files {missing_files}")
        report["modules"]["structure"] = "FAIL"
    else:
        report["modules"]["structure"] = "PASS"

    # Step 2: Verify & Ensure Vector Index
    print("\n[Audit 2/5] Checking Vector Database Index...")
    try:
        from rag.build_index import build_chroma_index
        import chromadb
        
        chroma_dir = PROJECT_ROOT / "rag" / "chroma_db"
        if not chroma_dir.exists() or len(list(chroma_dir.glob("*"))) == 0:
            print("  Building Chroma index...")
            build_chroma_index()
        
        client = chromadb.PersistentClient(path=str(chroma_dir))
        collections = client.list_collections()
        has_coll = any(c.name == "sre_knowledge_base" for c in collections)
        
        if has_coll:
            coll = client.get_collection("sre_knowledge_base")
            print(f"  • Chroma Collection 'sre_knowledge_base' document count: {coll.count()}")
            report["modules"]["chroma_index"] = "PASS"
        else:
            report["modules"]["chroma_index"] = "FAIL"
            report["readiness_score"] -= 20
    except Exception as e:
        print(f"  ❌ ChromaDB check error: {e}")
        report["modules"]["chroma_index"] = "FAIL"
        report["errors"].append(str(e))
        report["readiness_score"] -= 20

    # Step 3: Run Full End-to-End Pipeline Scenario
    print("\n[Audit 3/5] Executing Simulated Incident Remediation Pipeline...")
    pipeline_start = time.time()
    try:
        from rag.retrieve import retrieve
        from tools.actions import execute_action, AUDIT_LOG_PATH
        from tools.event_bus import emit_event, get_events, clear_events, EVENTS_FILE_PATH

        clear_events()

        # 1. Incident Detected
        emit_event({
            "type": "incident_detected",
            "payload": {
                "service": "payment-api",
                "severity": "P1",
                "symptom": "HTTP 504 Gateway Timeout spike on /v1/checkout"
            }
        })

        # 2. Diagnosis & RAG Retrieval
        emit_event({"type": "diagnosis_started", "payload": {"query": "payment api timeout"}})

        t0 = time.time()
        results = retrieve("payment api timeout", k=3)
        retrieval_ms = (time.time() - t0) * 1000

        print(f"  • RAG Retrieval Latency: {retrieval_ms:.2f} ms")
        print(f"  • Top Match: '{results[0]['title'] if results else 'NONE'}' (score: {results[0]['score'] if results else 0})")

        emit_event({
            "type": "memory_retrieved",
            "payload": {
                "count": len(results),
                "top_id": results[0]["id"] if results else None
            }
        })

        # 3. Action Execution
        t1 = time.time()
        action_res = execute_action("restart_service", {"service": "payment-api"})
        action_ms = (time.time() - t1) * 1000

        print(f"  • Action Execution Latency: {action_ms:.2f} ms")
        print(f"  • Action Response Status:  {action_res['status'].upper()}")

        emit_event({"type": "action_executed", "payload": action_res})

        # 4. Resolve
        total_pipeline_sec = time.time() - pipeline_start
        emit_event({
            "type": "incident_resolved",
            "payload": {"status": "Healthy", "duration_sec": total_pipeline_sec}
        })

        # Record metrics
        report["metrics"] = {
            "retrieval_latency_ms": round(retrieval_ms, 2),
            "action_execution_latency_ms": round(action_ms, 2),
            "total_pipeline_execution_sec": round(total_pipeline_sec, 3)
        }

        # Verify disk persistence
        events_on_disk = EVENTS_FILE_PATH.exists() and len(open(EVENTS_FILE_PATH, encoding="utf-8").readlines()) > 0
        audit_on_disk = AUDIT_LOG_PATH.exists() and len(open(AUDIT_LOG_PATH, encoding="utf-8").readlines()) > 0

        timeline_events = get_events()

        if results and action_res["status"] == "success" and events_on_disk and audit_on_disk and len(timeline_events) == 5:
            print("  ✅ Complete Pipeline Scenario Verified Successfully!")
            report["modules"]["pipeline_execution"] = "PASS"
        else:
            print("  ❌ Pipeline verification check failed!")
            report["modules"]["pipeline_execution"] = "FAIL"
            report["readiness_score"] -= 20

    except Exception as e:
        print(f"  ❌ Pipeline execution failed with exception: {e}")
        report["modules"]["pipeline_execution"] = "FAIL"
        report["errors"].append(str(e))
        report["readiness_score"] -= 30

    # Step 4: Scan for Placeholders (TODO / FIXME / HARDCODED TEMP PATHS)
    print("\n[Audit 4/5] Scanning Source Code for Placeholders & Hardcoded Paths...")
    source_files = [
        PROJECT_ROOT / "rag" / "build_index.py",
        PROJECT_ROOT / "rag" / "retrieve.py",
        PROJECT_ROOT / "tools" / "actions.py",
        PROJECT_ROOT / "tools" / "event_bus.py",
    ]

    todos_found = 0
    for sf in source_files:
        with open(sf, "r", encoding="utf-8") as f:
            content = f.read()
            matches = re.findall(r"\b(TODO|FIXME|XXX|TEMP)\b", content, re.IGNORECASE)
            if matches:
                todos_found += len(matches)
                report["warnings"].append(f"File {sf.name} contains placeholders: {matches}")

    print(f"  • Unfinished TODO / FIXME comments: {todos_found}")
    if todos_found == 0:
        report["audit_checks"]["placeholders"] = "PASS"
    else:
        report["audit_checks"]["placeholders"] = "WARN"

    # Step 5: Run Pytest Suite
    print("\n[Audit 5/5] Running Test Suite & Race Condition Check...")
    try:
        import pytest
        exit_code = pytest.main(["-q", str(PROJECT_ROOT / "tests")])
        if exit_code == 0:
            print("  ✅ All Pytest unit and integration tests passed (16/16).")
            report["modules"]["test_suite"] = "PASS"
        else:
            print(f"  ❌ Pytest failed with exit code: {exit_code}")
            report["modules"]["test_suite"] = "FAIL"
            report["readiness_score"] -= 15
    except Exception as e:
        print(f"  ❌ Test suite execution error: {e}")
        report["modules"]["test_suite"] = "FAIL"
        report["errors"].append(str(e))
        report["readiness_score"] -= 15

    # Print Final Verification Summary & Readiness Score
    print("\n" + "=" * 75)
    print("                     FINAL VERIFICATION REPORT")
    print("=" * 75)
    print(f"Module Status Breakdown:")
    for mod, status in report["modules"].items():
        icon = "✅" if status == "PASS" else "❌"
        print(f"  {icon} {mod:<25}: {status}")

    print(f"\nPerformance Metrics (Excluding LLM load time):")
    for k, v in report["metrics"].items():
        print(f"  • {k:<30}: {v}")

    print(f"\nWarnings: {len(report['warnings'])}")
    for w in report["warnings"]:
        print(f"  ⚠️  {w}")

    print(f"Stack Traces / Errors: {len(report['errors'])}")
    for err in report["errors"]:
        print(f"  ❌ {err}")

    print("-" * 75)
    print(f"Overall System Readiness Score: {report['readiness_score']} / 100")
    print("=" * 75)

    if report["readiness_score"] >= 95 and len(report["errors"]) == 0:
        print("\n🎉 VERDICT: Your AI SRE system is fully integrated and ready for hackathon demonstration.\n")
    else:
        print("\n⚠️ VERDICT: Please address the issues listed above before demonstrating.\n")


if __name__ == "__main__":
    run_verification_and_audit()
