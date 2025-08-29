import re
import json
import spacy
from datetime import date
from pathlib import Path

# -------------------------------------------------
# 1. Load spaCy English model once
# -------------------------------------------------
nlp = spacy.load("en_core_web_sm")

# -------------------------------------------------
# 2. Load ICD-10 synonym map
# -------------------------------------------------
DATA_DIR = Path(__file__).resolve().parents[1] / "data"

with open(DATA_DIR / "icd10_map.json", encoding="utf-8") as f:
    ICD10 = json.load(f)

# quick reverse lookup: "diabetes" -> (key, entry)
SYN_TO_KEY = {}
for key, entry in ICD10.items():
    for s in entry.get("synonyms", []):
        SYN_TO_KEY[s.lower()] = key

# -------------------------------------------------
# 3. Helper: extract age, gender, condition
# -------------------------------------------------
def _extract_with_spacy(text: str):
    """Return dict with age, gender, condition extracted by spaCy."""
    doc = nlp(text.lower())

    age, gender, condition = None, None, None

    # Age: CARDINAL entity first, then regex fallback
    for ent in doc.ents:
        if ent.label_ == "CARDINAL" and ent.text.isdigit():
            age = int(ent.text)
            break
    if age is None:
        m = re.search(r"\b(\d{1,3})\b", text)
        age = int(m.group(1)) if m else None

    # Gender
    for t in doc:
        if t.text in {"female", "woman", "women"}:
            gender = "female"
            break
        elif t.text in {"male", "man", "men"}:
            gender = "male"
            break

    # Condition via synonym map
    for t in doc:
        if t.text in SYN_TO_KEY:
            key = SYN_TO_KEY[t.text]
            condition = {
                "text": t.text,
                "icd10": ICD10[key]["code"],
                "display": ICD10[key]["display"],
                "system": ICD10[key]["system"],
            }
            break

    return {"age": age, "gender": gender, "condition": condition}

# -------------------------------------------------
# 4. Convert query → FHIR search parameters
# -------------------------------------------------
def parse_query_to_fhir(query: str):
    info = _extract_with_spacy(query)
    params = []

    # Age → birthdate parameter
    if info.get("age"):
        y = info["age"]
        boundary = date.today().replace(year=date.today().year - y)
        params.append(("birthdate", f"lt{boundary.isoformat()}"))

    # Gender
    if info.get("gender"):
        params.append(("gender", info["gender"]))

    # Condition
    cond = info.get("condition")
    if cond and "icd10" in cond:
        params.append(("has:Condition:patient:code", cond["icd10"]))

    # Build simulated URL for display
    base = "/Patient"
    url = f"{base}?{'&'.join(f'{k}={v}' for k, v in params)}" if params else base

    return {
        "resource": "Patient",
        "searchParams": [{"name": k, "value": v} for k, v in params],
        "simulatedURL": url,
        "detected": info,
    }