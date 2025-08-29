import requests
import os
import logging

FHIR_BASE = os.getenv("FHIR_BASE", "https://hapi.fhir.org/baseR4")
logger = logging.getLogger(__name__)

def _build_params(search_params):
    params = {}
    for p in search_params:
        params[p["name"]] = p["value"]
    return params

def _has_condition_param(search_params):
    """Check if search params contain condition-related parameters."""
    for p in search_params:
        if "has:Condition" in p["name"] or "condition" in p["name"].lower():
            return True
    return False

def search_patients(search_params, timeout=15):
    """Search for patients with fallback strategy for condition queries."""
    params = _build_params(search_params)
    url = f"{FHIR_BASE}/Patient"
    
    try:
        # Try original query first
        resp = requests.get(url, params=params, timeout=timeout)
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 400 and _has_condition_param(search_params):
            # Fallback: Remove condition parameters and query basic demographics only
            logger.warning(f"FHIR server doesn't support condition queries. Falling back to basic search.")
            fallback_params = {}
            for p in search_params:
                if not ("has:Condition" in p["name"] or "condition" in p["name"].lower()):
                    fallback_params[p["name"]] = p["value"]
            
            resp = requests.get(url, params=fallback_params, timeout=timeout)
            resp.raise_for_status()
            result = resp.json()
            
            # Add a note about the fallback
            if "meta" not in result:
                result["meta"] = {}
            result["meta"]["note"] = "Condition filtering not supported by this FHIR server. Results show all patients matching other criteria."
            
            return result
        else:
            # Re-raise if it's not a condition-related error
            raise