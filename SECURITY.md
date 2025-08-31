AI on FHIR – Security & HIPAA Compliance Plan

1. Authentication & Authorization
SMART on FHIR OAuth 2.0 for user log-in (clinician, researcher, admin).
Role-Based Access Control (RBAC)
– viewer (read-only), editor (create/update), admin (all).
Fine-grained scopes per FHIR resource (patient/*.read, Condition.write, etc.).
2. Data Privacy
Encryption in transit – TLS 1.3 everywhere (ngrok → backend).
Encryption at rest – AES-256 on database and file storage.
PII minimisation – only store resource IDs; actual PHI stays in the upstream FHIR server.
3. Audit & Logging
Central audit log (PostgreSQL table) recording:
– user ID, IP, timestamp, resource accessed, action (read/create/update/delete).
Log retention 6 years (HIPAA requirement).
Immutable logs via append-only S3 bucket with lifecycle rules.
4. Network & Infrastructure
Zero-trust – backend runs in private subnet, exposed only via HTTPS reverse proxy.
Rate limiting (100 req/min per user) to prevent abuse.
CORS whitelist – only the allowed frontend domain(s).
5. Business Associate Agreement (BAA)
Execute a BAA with any cloud vendor (AWS, GCP, Azure) before production use.
