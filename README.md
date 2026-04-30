# AI CI/CD Gate — Demo

Developer opens PR → Jenkins runs → n8n sends diff to Claude AI → AI passes or blocks the build.

## Demo Scenarios

### Scenario A — Safe change (AI passes ✅)
Edit any line in `frontend/src/components/LoginForm.css`, push a branch, open a PR.

### Scenario B — Dangerous change (AI blocks ❌)
Copy `backend/src/routes/auth.DANGEROUS_DEMO.js` and rename it to `auth.js` (replacing the good one).
Push a branch, open a PR. AI will catch:
- Hardcoded Stripe API secret key
- Auth middleware removed from protected routes
- Password being logged to console

## Test Login Credentials
- FE Dev: fe@demo.com / password123
- BE Dev: be@demo.com / password123

## Folder Structure
```
ai-cicd-demo/
├── Jenkinsfile                              ← Pipeline (calls n8n for AI)
├── frontend/
│   ├── public/index.html
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── components/
│       │   ├── LoginForm.js                 ← React login form
│       │   └── LoginForm.css                ← Edit this for Scenario A
│       ├── services/authService.js
│       └── tests/LoginForm.test.js
└── backend/
    └── src/
        ├── index.js
        ├── routes/
        │   ├── auth.js                      ← Safe routes (normal)
        │   └── auth.DANGEROUS_DEMO.js       ← Bad routes (for Scenario B)
        ├── middleware/authMiddleware.js
        ├── controllers/authController.js
        └── tests/auth.test.js
```
