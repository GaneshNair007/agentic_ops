import os
import json
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

base_dir = r"c:\Users\Ganesh Nair\OneDrive\Desktop\agentic_ops"
incidents_dir = os.path.join(base_dir, "rag", "data", "incidents")
runbooks_dir = os.path.join(base_dir, "rag", "data", "runbooks")

# 1. Count files
incident_files = [f for f in os.listdir(incidents_dir) if f.endswith(".json")]
runbook_files = [f for f in os.listdir(runbooks_dir) if f.endswith(".md")]

print(f"Count Check:")
print(f"  Incidents JSON count: {len(incident_files)} (Expected: 20)")
print(f"  Runbooks Markdown count: {len(runbook_files)} (Expected: 15)")

assert len(incident_files) == 20, f"Expected 20 incident JSON files, got {len(incident_files)}"
assert len(runbook_files) == 15, f"Expected 15 runbook Markdown files, got {len(runbook_files)}"

# 2. Validate JSON structure
required_incident_keys = {
    "incident_id", "title", "severity", "affected_service",
    "symptoms", "root_cause", "resolution", "tags", "timestamp"
}

all_incident_tags = set()
incident_tag_map = {}

for f in sorted(incident_files):
    filepath = os.path.join(incidents_dir, f)
    with open(filepath, "r", encoding="utf-8") as file:
        data = json.load(file)
        missing = required_incident_keys - set(data.keys())
        assert not missing, f"File {f} missing keys: {missing}"
        assert data["severity"] in ["P1", "P2", "P3"], f"Invalid severity in {f}: {data['severity']}"
        tags = set(data["tags"])
        all_incident_tags.update(tags)
        incident_tag_map[f] = tags

print("PASSED: All 20 Incident JSON files parsed cleanly and passed schema validation.")

# 3. Validate Runbooks Markdown structure and tags
required_sections = [
    "description", "prerequisites", "diagnosis steps",
    "recovery steps", "verification steps", "related tags"
]

all_runbook_tags = set()
runbook_tag_map = {}

for f in sorted(runbook_files):
    filepath = os.path.join(runbooks_dir, f)
    with open(filepath, "r", encoding="utf-8") as file:
        content = file.read().lower()
        for sec in required_sections:
            assert sec in content, f"Runbook {f} missing section '{sec}'"
        
        # Extract tags from Related Tags section
        tags_section = content.split("related tags")[-1]
        tags = set(re.findall(r"-\s*([a-z0-9\-_]+)", tags_section))
        all_runbook_tags.update(tags)
        runbook_tag_map[f] = tags

print("PASSED: All 15 Runbook Markdown files parsed cleanly and passed section validation.")

# 4. Check tag cross-consistency & coverage
print("\n--- Tag Cross-Coverage Verification ---")

unmatched_incidents = []
for inc_file, inc_tags in incident_tag_map.items():
    matched = False
    for rb_file, rb_tags in runbook_tag_map.items():
        if inc_tags.intersection(rb_tags):
            matched = True
            break
    if not matched:
        unmatched_incidents.append(inc_file)

unmatched_runbooks = []
for rb_file, rb_tags in runbook_tag_map.items():
    matched = False
    for inc_file, inc_tags in incident_tag_map.items():
        if rb_tags.intersection(inc_tags):
            matched = True
            break
    if not matched:
        unmatched_runbooks.append(rb_file)

print(f"Unmatched Incidents: {len(unmatched_incidents)}")
print(f"Unmatched Runbooks: {len(unmatched_runbooks)}")

assert len(unmatched_incidents) == 0, f"Found unmatched incidents: {unmatched_incidents}"
assert len(unmatched_runbooks) == 0, f"Found unmatched runbooks: {unmatched_runbooks}"

print("PASSED: Verification Success! Every incident has at least one matching runbook and vice versa.")
