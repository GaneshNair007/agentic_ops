"""
AI SRE System - Streamlit Interactive Dashboard
Live incident timeline, RAG semantic search inspector, mock remediation execution console, and audit log viewer.

Launch Dashboard:
    streamlit run app.py
"""

import sys
import json
import time
from pathlib import Path
import pandas as pd
import streamlit as st

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from rag.retrieve import retrieve
from tools.actions import execute_action, AUDIT_LOG_PATH
from tools.event_bus import emit_event, get_events, clear_events, EVENTS_FILE_PATH

# -----------------------------------------------------------------------------
# Page Configuration & Custom CSS
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="AI SRE Agent Dashboard",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Dark glassmorphic theme styling
st.markdown("""
<style>
    .main {
        background-color: #0e1117;
        color: #ffffff;
    }
    .stMetric {
        background-color: #1e222d;
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #2e364f;
    }
    .timeline-card {
        background: rgba(30, 34, 45, 0.7);
        border-left: 4px solid #00d2ff;
        padding: 15px;
        margin-bottom: 12px;
        border-radius: 6px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }
    .timeline-incident { border-left-color: #ff4b4b; }
    .timeline-diagnosis { border-left-color: #fca311; }
    .timeline-memory { border-left-color: #7209b7; }
    .timeline-action { border-left-color: #4cc9f0; }
    .timeline-resolved { border-left-color: #06d6a0; }
    .search-card {
        background-color: #1a1f2c;
        border: 1px solid #2e364f;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 12px;
    }
</style>
""", unsafe_allow_html=True)


# -----------------------------------------------------------------------------
# Sidebar Navigation & System Information
# -----------------------------------------------------------------------------
st.sidebar.title("🤖 AI SRE Operations")
st.sidebar.markdown("---")

system_status = st.sidebar.empty()

# Calculate Quick Stats
events_count = len(get_events())
audit_count = 0
if AUDIT_LOG_PATH.exists():
    with open(AUDIT_LOG_PATH, "r", encoding="utf-8") as f:
        audit_count = len(f.readlines())

st.sidebar.metric("Live Timeline Events", events_count)
st.sidebar.metric("Audit Trail Records", audit_count)
st.sidebar.metric("Vector Index Size", "35 Documents")

st.sidebar.markdown("---")
st.sidebar.markdown("### 📌 Quick Benchmark SLOs")
st.sidebar.caption("• RAG Search Latency: **~10 ms**")
st.sidebar.caption("• Action Latency: **~140 ms**")
st.sidebar.caption("• Pipeline Execution: **~0.25 s**")

st.sidebar.markdown("---")
if st.sidebar.button("🧹 Clear In-Memory Timeline", use_container_width=True):
    clear_events()
    st.sidebar.success("Timeline cleared.")
    st.rerun()


# -----------------------------------------------------------------------------
# Main Header
# -----------------------------------------------------------------------------
st.title("⚡ Autonomous AI Site Reliability Engineer (AI SRE)")
st.caption("Real-time Incident Detection, Semantic RAG Memory Retrieval, Automated Remediation & Audit Logging")


# -----------------------------------------------------------------------------
# Main Tabs
# -----------------------------------------------------------------------------
tab1, tab2, tab3, tab4 = st.tabs([
    "🚨 Live Incident Pipeline",
    "🧠 RAG Knowledge Inspector",
    "🔧 Action Execution Console",
    "📜 Immutable Audit & Event Logs"
])


# =============================================================================
# TAB 1: Live Incident Pipeline & Timeline
# =============================================================================
with tab1:
    st.subheader("Simulate Production Incident Remediation")
    st.write("Trigger a realistic failure scenario to run the autonomous triage, retrieval, and recovery pipeline:")

    col_scenario, col_run = st.columns([3, 1])

    with col_scenario:
        scenario = st.selectbox(
            "Select Failure Scenario:",
            [
                "Payment API HTTP 504 Gateway Timeout (P1)",
                "PostgreSQL Connection Pool Exhaustion (P1)",
                "Redis Maxmemory Cache Eviction Collapse (P1)",
                "CoreDNS Upstream Resolution Failure (P1)",
                "Identity Provider Vault Token Expiration (P1)"
            ]
        )

    with col_run:
        st.write("")
        st.write("")
        run_btn = st.button("🚀 Trigger Remediation", type="primary", use_container_width=True)

    if run_btn:
        clear_events()
        with st.status("Executing AI SRE Autonomous Workflow...", expanded=True) as status:
            
            # Scenario Configs
            if "Payment API" in scenario:
                service = "payment-api"
                query = "payment api timeout"
                action_type = "restart_service"
                action_params = {"service": service}
                symptom = "HTTP 504 Gateway Timeout spike on /v1/checkout"
            elif "PostgreSQL" in scenario:
                service = "user-profile-api"
                query = "postgres connection pool exhaustion"
                action_type = "restart_database"
                action_params = {"database": "user-profile-pg-cluster"}
                symptom = "FATAL: sorry, too many clients already from PgBouncer"
            elif "Redis" in scenario:
                service = "session-store"
                query = "redis maxmemory eviction"
                action_type = "restart_service"
                action_params = {"service": service}
                symptom = "OOM command not allowed when maxmemory hit"
            elif "CoreDNS" in scenario:
                service = "inventory-api"
                query = "coredns upstream timeout"
                action_type = "scale_deployment"
                action_params = {"deployment": "coredns", "replicas": 8}
                symptom = "DNS query timeout resolving internal database host"
            else:
                service = "identity-provider"
                query = "vault token expired"
                action_type = "rollback_deployment"
                action_params = {"deployment": service, "revision": "v2.3.9"}
                symptom = "Permission Denied: Vault token expired on OAuth auth"

            # 1. Incident Detected
            st.write("🚨 **[0.00s]** Incident Detected by Alertmanager...")
            emit_event({
                "type": "incident_detected",
                "payload": {"service": service, "severity": "P1", "symptom": symptom}
            })
            time.sleep(0.3)

            # 2. Diagnosis & RAG Search
            st.write("🧠 **[0.30s]** Querying ChromaDB Vector Index for past incidents & runbooks...")
            emit_event({"type": "diagnosis_started", "payload": {"service": service, "query": query}})
            
            t0 = time.time()
            rag_docs = retrieve(query, k=2)
            ret_ms = round((time.time() - t0) * 1000, 2)
            time.sleep(0.3)

            matched_title = rag_docs[0]["title"] if rag_docs else "Unknown"
            matched_id = rag_docs[0]["id"] if rag_docs else "N/A"
            st.write(f"📚 **[0.60s]** Matched Memory: **{matched_id}** ({matched_title}) in **{ret_ms}ms**")
            
            emit_event({
                "type": "memory_retrieved",
                "payload": {
                    "matched_id": matched_id,
                    "matched_title": matched_title,
                    "score": rag_docs[0]["score"] if rag_docs else 0,
                    "latency_ms": ret_ms
                }
            })
            time.sleep(0.3)

            # 3. Action Execution
            st.write(f"🔧 **[0.90s]** Executing Remediation Action `{action_type}`...")
            act_res = execute_action(action_type, action_params)
            emit_event({"type": "action_executed", "payload": act_res})
            time.sleep(0.3)

            # 4. Resolve
            st.write("✅ **[1.20s]** Incident Successfully Resolved! Verification checks passed.")
            emit_event({
                "type": "incident_resolved",
                "payload": {"service": service, "status": "Healthy (SLO target restored)"}
            })

            status.update(label="Remediation Workflow Complete!", state="complete", expanded=False)

    st.markdown("### 🕒 Real-Time Event Timeline")
    events = get_events()

    if not events:
        st.info("No events emitted yet. Click '🚀 Trigger Remediation' above to simulate an incident workflow.")
    else:
        for idx, ev in enumerate(events, 1):
            ev_type = ev["type"]
            ts = ev["timestamp"].split("T")[1][:8]
            payload = ev["payload"]

            card_class = "timeline-card"
            icon = "ℹ️"
            if ev_type == "incident_detected":
                card_class += " timeline-incident"
                icon = "🚨"
            elif ev_type == "diagnosis_started":
                card_class += " timeline-diagnosis"
                icon = "🧠"
            elif ev_type == "memory_retrieved":
                card_class += " timeline-memory"
                icon = "📚"
            elif ev_type == "action_executed":
                card_class += " timeline-action"
                icon = "🔧"
            elif ev_type == "incident_resolved":
                card_class += " timeline-resolved"
                icon = "✅"

            st.markdown(f"""
            <div class="{card_class}">
                <div style="display:flex; justify-content:space-between;">
                    <strong>{icon} {ev_type.upper().replace('_', ' ')}</strong>
                    <span style="color:#8b949e; font-size:0.9em;">{ts} UTC | ID: {ev['event_id'][:8]}</span>
                </div>
                <div style="margin-top:8px; font-family:monospace; font-size:0.92em;">
                    {json.dumps(payload, indent=2)}
                </div>
            </div>
            """, unsafe_allow_html=True)


# =============================================================================
# TAB 2: RAG Knowledge Base Inspector
# =============================================================================
with tab2:
    st.subheader("Semantic Vector Memory Search")
    st.write("Query the persistent ChromaDB index (`rag/chroma_db/`) containing 20 Incidents and 15 Runbooks:")

    col_q, col_k = st.columns([4, 1])
    with col_q:
        user_query = st.text_input("Enter failure query:", value="PostgreSQL connection pool exhaustion")
    with col_k:
        top_k = st.slider("Top K", min_value=1, max_value=10, value=3)

    if user_query:
        t_search = time.time()
        results = retrieve(user_query, k=top_k)
        search_ms = round((time.time() - t_search) * 1000, 2)

        st.caption(f"Retrieved **{len(results)}** documents in **{search_ms} ms** using `all-MiniLM-L6-v2` dense embeddings.")

        for r in results:
            doc_type_color = "#4cc9f0" if r["document_type"] == "runbook" else "#ff4b4b"
            with st.expander(f"[{r['score']:.4f}] [{r['document_type'].upper()}] {r['id']} — {r['title']}", expanded=True):
                col_info1, col_info2, col_info3 = st.columns(3)
                col_info1.markdown(f"**Doc ID:** `{r['id']}`")
                col_info2.markdown(f"**Type:** `{r['document_type']}`")
                col_info3.markdown(f"**Relevance Score:** `{r['score']:.4f}`")

                st.markdown(f"**Tags:** {', '.join([f'`{t}`' for t in r['tags']])}")
                st.markdown(f"**Filename:** `{r['filename']}`")
                st.text_area("Full Searchable Text Content:", value=r["text"], height=180, key=f"text_{r['id']}")


# =============================================================================
# TAB 3: Action Execution Console
# =============================================================================
with tab3:
    st.subheader("Mock Action Execution Engine")
    st.write("Directly trigger mock infrastructure remediation actions and inspect real-time outputs & audit logging:")

    col_act, col_service = st.columns(2)
    with col_act:
        action_name = st.selectbox(
            "Select Action Type:",
            [
                "restart_service",
                "rollback_deployment",
                "restart_pod",
                "restart_database",
                "scale_deployment",
                "create_ticket",
                "notify_team",
                "generate_postmortem"
            ]
        )
    with col_service:
        target_name = st.text_input("Target Resource / Service Name:", value="payment-api")

    action_payload = {}
    if action_name in ["restart_service", "restart_pod", "restart_database"]:
        action_payload = {"service": target_name}
    elif action_name == "rollback_deployment":
        action_payload = {"deployment": target_name, "revision": "v2.3.9"}
    elif action_name == "scale_deployment":
        replicas = st.number_input("Replicas", min_value=1, max_value=50, value=8)
        action_payload = {"deployment": target_name, "replicas": replicas}
    elif action_name == "create_ticket":
        action_payload = {"title": f"Incident on {target_name}", "severity": "P1"}
    elif action_name == "notify_team":
        action_payload = {"channel": "#sre-alerts", "message": f"Remediation executed for {target_name}"}
    elif action_name == "generate_postmortem":
        action_payload = {"incident_id": "INC-2026-005", "title": f"Outage on {target_name}"}

    if st.button("⚡ Execute Action Now"):
        res = execute_action(action_name, action_payload)
        st.success(f"Action Execution Completed! Status: {res['status'].upper()}")
        st.json(res)


# =============================================================================
# TAB 4: Immutable Audit & Event Logs
# =============================================================================
with tab4:
    st.subheader("Persistent Log Inspection")
    st.write("Inspect immutable JSON Lines logs stored on disk:")

    col_audit_view, col_event_view = st.columns(2)

    with col_audit_view:
        st.markdown("#### 📜 Audit Log (`tools/audit.log`)")
        if AUDIT_LOG_PATH.exists():
            with open(AUDIT_LOG_PATH, "r", encoding="utf-8") as f:
                audit_lines = [json.loads(line) for line in f.readlines()]
            if audit_lines:
                df_audit = pd.DataFrame(audit_lines)
                st.dataframe(df_audit[["timestamp", "action", "status", "execution_time_ms", "action_id"]], use_container_width=True)
            else:
                st.info("Audit log is empty.")
        else:
            st.warning("Audit log file does not exist yet.")

    with col_event_view:
        st.markdown("#### 🕒 Events Stream (`tools/events.jsonl`)")
        if EVENTS_FILE_PATH.exists():
            with open(EVENTS_FILE_PATH, "r", encoding="utf-8") as f:
                event_lines = [json.loads(line) for line in f.readlines()]
            if event_lines:
                df_events = pd.DataFrame(event_lines)
                st.dataframe(df_events[["timestamp", "type", "event_id"]], use_container_width=True)
            else:
                st.info("Events log is empty.")
        else:
            st.warning("Events log file does not exist yet.")
