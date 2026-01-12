Backend API contract (placeholder)

This `backend/` folder contains a minimal API contract and an Express stub to help frontend developers and AI agents understand the expected server endpoints. The real backend is not provided in the repo.

Endpoints (summary):
- `POST /api/auth/login` — body: `{ email, password }` -> returns `{ token, user }`.
- `POST /api/auth/signup` — body: `{ name, email, password }` -> returns `{ token, user }`.
- `GET /api/lessons` — returns list of lessons: `[{ id, title, excerpt, images[], sources[] }]`.
- `GET /api/lessons/:id` — returns lesson detail including assessments.
- `POST /api/assessments/submit` — submit answers and receive score/progress.
- `GET /api/progress` — user progress, saved assessments, resume points.

Run the stub server (requires Node + npm):
```bash
cd backend
npm install express
node server.js
```

