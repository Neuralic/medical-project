from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .nlp import parse_query_to_fhir
from .fhir_real import search_patients

app = FastAPI(title="AI on FHIR - NLP to FHIR (Live HAPI)", version="1.1.0")

class QueryIn(BaseModel):
    query: str

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://fhr-project.netlify.app",               # Netlify deploy preview
        "https://aaab47e97a31.ngrok-free.app"     # ngrok URL (change when it updates)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/parse")
def parse(q: QueryIn):
    mapping = parse_query_to_fhir(q.query)
    try:
        bundle = search_patients(mapping["searchParams"])
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch from FHIR server: {str(e)}")
    return {"mapping": mapping, "results": bundle}
