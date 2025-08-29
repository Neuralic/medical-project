# Fallback simulator (kept for reference)
import json
from pathlib import Path
DATA_DIR = Path(__file__).resolve().parents[1] / "data"
def load_patients():
    with open(DATA_DIR / "patients.json") as f:
        return json.load(f)
def to_bundle(patients):
    entries = []
    for p in patients:
        entries.append({
            "resource": {"resourceType": "Patient", "id": p["id"], "name":[{"given":[p["name"]["given"]],"family":p["name"]["family"]}], "gender":p["gender"], "birthDate":p["birthDate"]}
        })
    return {"resourceType":"Bundle","type":"searchset","total":len(entries),"entry":entries}