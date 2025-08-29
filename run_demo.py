import json, sys
from app.nlp import parse_query_to_fhir
from app.fhir_real import search_patients

def run(query: str):
    mapping = parse_query_to_fhir(query)
    print("=== Input ===")
    print(query)
    print("\n=== Simulated FHIR Request ===")
    print(mapping["simulatedURL"])
    print("\n=== Detected ===")
    print(json.dumps(mapping["detected"], indent=2))
    print("\n=== Live FHIR Results (Bundle) ===")
    try:
        bundle = search_patients(mapping["searchParams"])
        print(json.dumps(bundle, indent=2))
    except Exception as e:
        print("Failed to fetch live FHIR results:", str(e))
        print("If you see a network error, verify internet access and FHIR_BASE env var.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python run_demo.py \"query\"")
    else:
        run(" ".join(sys.argv[1:]))