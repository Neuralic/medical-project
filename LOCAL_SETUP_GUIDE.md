# 🚀 Local Setup Guide - AI on FHIR Backend

## Prerequisites

Before you start, make sure you have:
- **Python 3.8+** installed ([Download here](https://python.org/downloads/))
- **Git** installed (to clone/download the project)
- **Internet connection** (for FHIR server access)

## Step-by-Step Setup

### 1. Download Your Project Files
```bash
# If you have the project as a zip file, extract it
# Or if you have it in a git repository:
git clone <your-repository-url>
cd ai-on-fhir-backend
```

### 2. Create Virtual Environment (Recommended)
```bash
# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Activate it (Mac/Linux)
source venv/bin/activate
```

### 3. Install Dependencies
```bash
# Install required packages
pip install -r requirements.txt

# If you get errors, try upgrading pip first:
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Verify Project Structure
Your project should look like this:
```
ai-on-fhir-backend/
├── app/
│   ├── __init__.py (create empty file if missing)
│   ├── main.py
│   ├── nlp.py
│   ├── fhir_real.py
│   └── fhir_sim.py
├── data/
│   ├── icd10_map.json
│   └── patients.json
├── tests/
│   └── test_nlp.py
├── requirements.txt
├── run_demo.py
└── README.md
```

**Important**: Create an empty `__init__.py` file in the `app/` directory if it doesn't exist:
```bash
# Windows
type nul > app\__init__.py

# Mac/Linux
touch app/__init__.py
```

## Testing Your Setup

### Test 1: Run NLP Tests
```bash
python tests/test_nlp.py
```
**Expected output:** `All tests passed! ✅`

### Test 2: Run Demo Script
```bash
# Test with different queries
python run_demo.py "female diabetic patients over 50"
python run_demo.py "male patients under 30"
python run_demo.py "women with hypertension"
```

**Expected output:** You should see:
- Input query
- Simulated FHIR request URL
- Detected entities (gender, condition, age)
- Live FHIR results from the server

### Test 3: Start the API Server
```bash
# Start the FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Test 4: Test API Endpoints
Open a new terminal/command prompt and test:

```bash
# Test health endpoint
curl http://127.0.0.1:8000/health

# Test parse endpoint (Windows - use double quotes)
curl -X POST http://127.0.0.1:8000/parse -H "Content-Type: application/json" -d "{\"query\":\"female diabetic patients over 50\"}"

# Test parse endpoint (Mac/Linux - use single quotes)
curl -X POST http://127.0.0.1:8000/parse -H 'Content-Type: application/json' -d '{"query":"female diabetic patients over 50"}'
```

**Alternative: Test with Browser**
1. Go to http://127.0.0.1:8000/docs
2. You'll see the FastAPI interactive documentation
3. Click on `/parse` endpoint
4. Click "Try it out"
5. Enter: `{"query": "female diabetic patients over 50"}`
6. Click "Execute"

## Troubleshooting Common Issues

### Issue 1: "Module not found" error
```bash
# Make sure you're in the right directory and venv is activated
cd path/to/your/project
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Create missing __init__.py files
echo. > app\__init__.py  # Windows
touch app/__init__.py  # Mac/Linux
```

### Issue 2: "Permission denied" or "pip install fails"
```bash
# Try with --user flag
pip install --user -r requirements.txt

# Or upgrade pip first
python -m pip install --upgrade pip
```

### Issue 3: "Port already in use"
```bash
# Use a different port
uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

### Issue 4: FHIR connection errors
The app uses a public FHIR test server. If you get connection errors:
- Check your internet connection
- The public server might be down temporarily
- Try again in a few minutes

## Environment Configuration (Optional)

You can customize the FHIR server:
```bash
# Windows
set FHIR_BASE=https://your-fhir-server.com/baseR4
uvicorn app.main:app --reload

# Mac/Linux
export FHIR_BASE=https://your-fhir-server.com/baseR4
uvicorn app.main:app --reload
```

## Next Steps

Once everything is working:

1. **Explore the API**: Visit http://127.0.0.1:8000/docs for interactive documentation
2. **Test different queries**: Try various natural language queries
3. **Check the code**: Examine `app/nlp.py` to understand how NLP works
4. **Build frontend**: Create a React/Next.js frontend to consume this API
5. **Add security**: Implement authentication and HIPAA compliance

## Quick Reference Commands

```bash
# Start development
cd your-project-folder
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
uvicorn app.main:app --reload

# Run tests
python tests/test_nlp.py
python run_demo.py "your query here"

# Stop server
Ctrl+C
```

## Need Help?

If you run into issues:
1. Check that Python 3.8+ is installed: `python --version`
2. Ensure virtual environment is activated (you should see `(venv)` in terminal)
3. Verify all files are in the right place
4. Check the error messages carefully
5. Make sure you have internet access for FHIR server connection

Your backend is professionally built and should work smoothly! 🎉