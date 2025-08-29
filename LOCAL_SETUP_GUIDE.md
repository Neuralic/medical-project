AI on FHIR - Medical Project
Project Overview
This project is an AI-powered system designed to process natural language medical 
queries and integrate with FHIR (Fast Healthcare Interoperability Resources) servers. It 
features a robust backend for data processing and an interactive frontend for user 
interaction and data visualization.
Key Features
Natural Language Processing (NLP): Converts natural language queries into
structured FHIR search parameters.
FHIR Integration: Connects to live FHIR servers (e.g., HAPI FHIR) to retrieve patient
data.
RESTful API: A FastAPI-based backend providing endpoints for health checks and
query parsing.
Modular Architecture: Clear separation of concerns for NLP, FHIR integration, and
API layers.
Interactive Frontend: (Planned/Under Development) A React/Next.js application
for user input, data visualization (charts, tables), and filtering of patient data.
Project Architecture
The project consists of two main components:
Backend: Developed using Python with FastAPI, responsible for NLP processing,
FHIR server communication, and exposing a RESTful API.
Frontend: A Next.js application (TypeScript, React) for the user interface, designed
to consume data from the backend API and present it visually.
Prerequisites
Before setting up the project, ensure you have the following installed:
Python 3.8+: Download Python
Git: Download Git
Node.js (LTS recommended): Download Node.js
npm, yarn, or pnpm: Package managers for Node.js (npm is included with
Node.js)
Backend Setup
Follow these steps to set up and run the backend:
Clone the Repository:
bash
git clone https://github.com/Neuralic/medical-project.git
cd medical-project
Create and Activate a Virtual Environment (Recommended):
```bash
python -m venv venv
On Windows:
.\venv\Scripts\activate
On macOS/Linux:
source venv/bin/activate
```
Install Backend Dependencies:
bash
pip install -r requirements.txt
Run Backend Tests (Optional, but recommended):
```bash
python run_demo.py "female diabetic patients over 50"

Expected output will show detected
entities and simulated FHIR results.
```
Start the Backend API Server:
bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
The backend API will be accessible at http://localhost:8000 .
Test API Endpoints (Optional):
Health Check: Open http://localhost:8000/health in your browser. You
should see {"status": "ok"} .
Interactive Documentation: Visit http://localhost:8000/docs for FastAPI's
interactive Swagger UI, where you can test the /parse endpoint.
Frontend Setup
Follow these steps to set up and run the frontend:
Navigate to the Frontend Directory:
bash
cd frontend
Install Frontend Dependencies:
```bash
npm install
or yarn install
or pnpm install
```
Start the Frontend Development Server:
```bash
npm run dev
or yarn dev
or pnpm dev
```
The frontend application will be accessible at http://localhost:3000 .
Running the Full Application
To run both the backend and frontend simultaneously:
Open two separate terminal windows.
In the first terminal, follow the Backend Setup steps (1-5) to start the backend API
server.
In the second terminal, follow the Frontend Setup steps (1-3) to start the frontend
development server.
Once both are running, open http://localhost:3000 in your web browser to interact
with the full application.
Troubleshooting
"Module not found" (Python): Ensure your virtual environment is activated and
all dependencies are installed ( pip install -r requirements.txt ).
"Port already in use": If uvicorn or npm run dev fails due to a port conflict, you
can change the port. For the backend, modify the --port argument (e.g., uvicorn
app.main:app --host 0.0.0.0 --port 8001 --reload ). For the frontend, you might need
to adjust the next.config.ts or run with a different port command (e.g., 
PORT=3001 npm run dev ).
FHIR Connection Errors: The backend uses a public FHIR test server. Ensure you
have an active internet connection. If issues persist, the public server might be
temporarily down.
This README provides a comprehensive guide for setting up and running the AI on FHIR 
project.