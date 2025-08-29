import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.nlp import parse_query_to_fhir

def test_parse_basic():
    """Test basic query parsing with gender, condition, and age."""
    m = parse_query_to_fhir("female diabetic patients over 50")
    assert m["resource"] == "Patient"
    assert any(p["name"]=="gender" and p["value"]=="female" for p in m["searchParams"])
    assert m["detected"]["gender"] == "female"
    assert m["detected"]["condition"]["icd10"] == "E11"
    assert m["detected"]["age"]["op"] == "gt"
    assert m["detected"]["age"]["value"] == 50

def test_gender_detection():
    """Test gender detection variations."""
    # Female variations
    assert parse_query_to_fhir("women with diabetes")["detected"]["gender"] == "female"
    assert parse_query_to_fhir("female patients")["detected"]["gender"] == "female"
    
    # Male variations  
    assert parse_query_to_fhir("men with hypertension")["detected"]["gender"] == "male"
    assert parse_query_to_fhir("male patients")["detected"]["gender"] == "male"

def test_condition_detection():
    """Test medical condition detection."""
    # Diabetes
    result = parse_query_to_fhir("diabetic patients")
    assert result["detected"]["condition"]["icd10"] == "E11"
    assert result["detected"]["condition"]["text"] == "diabetic"
    
    # Hypertension
    result = parse_query_to_fhir("patients with hypertension")
    assert result["detected"]["condition"]["icd10"] == "I10"
    
    # Asthma
    result = parse_query_to_fhir("asthmatic patients")
    assert result["detected"]["condition"]["icd10"] == "J45"

def test_age_detection():
    """Test age constraint detection."""
    # Over/above
    result = parse_query_to_fhir("patients over 65")
    assert result["detected"]["age"]["op"] == "gt"
    assert result["detected"]["age"]["value"] == 65
    
    # Under/below
    result = parse_query_to_fhir("patients under 30") 
    assert result["detected"]["age"]["op"] == "lt"
    assert result["detected"]["age"]["value"] == 30
    
    # At least
    result = parse_query_to_fhir("patients at least 18")
    assert result["detected"]["age"]["op"] == "ge"
    assert result["detected"]["age"]["value"] == 18

def test_complex_queries():
    """Test complex multi-entity queries."""
    result = parse_query_to_fhir("male hypertensive patients under 40")
    assert result["detected"]["gender"] == "male"
    assert result["detected"]["condition"]["icd10"] == "I10"
    assert result["detected"]["age"]["op"] == "lt"
    assert result["detected"]["age"]["value"] == 40

if __name__ == "__main__":
    test_parse_basic()
    test_gender_detection()
    test_condition_detection()
    test_age_detection()
    test_complex_queries()
    print("All tests passed! ✅")