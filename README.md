# Smart HMI (ABB Hackathon)

Lightweight HMI demo combining a FastAPI backend and a Vite + React frontend.

## Prerequisites
- Python 3.11+ and a virtual environment
- Node.js 18+ and npm

## Quick start (local)

1. Activate Python virtualenv (created at `.venv`):

```bash
source .venv/bin/activate
```

2. Install backend deps and start the API:

```bash
cd backend
pip install -r requirements.txt
../.venv/bin/python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

3. Start the frontend dev server:

```bash
cd frontend
npm install
npm run dev -- --host
```

4. Open the app in your browser: `http://localhost:5173`.

## Notes
- The backend serves a WebSocket at `ws://localhost:8000/ws` and REST endpoints under `/`.
- A small SQLite DB (`hmi.db`) is included for demo alarm persistence.

## Pushed to GitHub
Repository: https://github.com/deekshithmeka/ABB-hackathon

---
If you want, I can add a single script to start both services, or a GitHub Actions workflow.
