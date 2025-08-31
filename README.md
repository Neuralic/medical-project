# AI on FHIR – Assessment

A lightweight **full-stack** demo that turns natural-language questions into FHIR queries.

- **Backend**: FastAPI + spaCy → live HAPI FHIR server  
- **Frontend**: Next.js 14 + Tailwind + Recharts  

---

## Quick Start (local)

### Backend
```bash
cd backend
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app.main:app --reload
# API docs → http://localhost:8000/docs
```
### Frontend
```bash
cd frontend
npm install
npm run dev
# UI → http://localhost:3000
```
Example queries
| Natural-language input             | Generated FHIR call                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------ |
| “female diabetic patients over 50” | `/Patient?gender=female&birthdate=lt1974-05-30&has:Condition:patient:code=E11` |
| “men with asthma”                  | `/Patient?gender=male&has:Condition:patient:code=J45`                          |

Deployment (optional)
Backend: any Python host (Render, Fly, etc.)
Frontend: npm run build && next export → static site (Netlify, Vercel, GitHub Pages)

License
MIT – feel free to fork and extend.

