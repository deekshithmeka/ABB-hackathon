# Smart HMI Dashboard

An AI-powered Next-Generation Control System Interface that thinks with the operator

<!-- Badges -->
![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?logo=react&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white) ![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white) ![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?logo=scikit-learn&logoColor=white) ![License: MIT](https://img.shields.io/badge/License-MIT-green)

## Problem statement

Traditional HMIs flood operators with hundreds of alarms. Operators manually filter them, leading to alarm fatigue, missed critical alerts, and slower response times. No intelligence, no context, no explanation.

## Solution

Smart HMI Dashboard uses AI to auto-prioritize alarms, map dependencies between machines, and explain faults in plain English — so operators respond faster and engineers configure less.

## Key features

- Real-time sensor monitoring (live charts updating every second via WebSocket)
- AI alarm prioritization (scikit-learn ML model classifies Critical, Warning, Info)
- Alarm knowledge graph (interactive dependency map showing which machines affect each other)
- Plain English explanations (Gemini AI explains why each alarm is critical)
- Role-based views (Operator view vs Engineer view with different UI and data)

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS, Recharts, React Flow |
| Backend | Python, FastAPI, WebSocket, APScheduler |
| AI Layer | scikit-learn, NetworkX, Google Gemini API |
| Database | SQLite, SQLAlchemy |
| Tools | Vite, Axios, Joblib |

## Project structure

```
hmi-project/
├── backend/
│   ├── main.py
│   ├── simulator.py
│   ├── ai_engine.py
│   ├── database.py
│   ├── models.py
│   ├── roles.json
│   ├── alarm_data.csv
│   ├── .env
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
+│   │   │   ├── Dashboard.jsx
│   │   │   ├── AlarmPanel.jsx
│   │   │   ├── GraphView.jsx
│   │   │   └── RoleSelector.jsx
│   │   ├── hooks/
│   │   │   └── useWebSocket.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
└── README.md
```

## Getting started

### Backend setup

```bash
cd backend
pip install -r requirements.txt
# Add your Gemini API key to .env
# GEMINI_API_KEY=your_key_here
# Get free API key from aistudio.google.com
uvicorn main:app --reload
```

Open: `http://localhost:8000/docs`

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open: `http://localhost:5173`

## How it works

1. Python simulator generates fake sensor data for 10 industrial machines every 2 seconds
2. FastAPI backend processes each reading through the AI engine
3. scikit-learn model classifies alarm severity as Critical, Warning, or Info
4. NetworkX graph maps which machines are affected downstream
5. Gemini API generates a plain English explanation for critical and warning alarms
6. WebSocket broadcasts live dashboard data to all connected browser clients
7. React frontend renders live charts, sorted alarm panel, and interactive dependency graph

## Live demo

1. Start backend — `uvicorn main:app --reload`
2. Start frontend — `npm run dev`
3. Open `http://localhost:5173`
4. Watch live sensor charts update every 2 seconds
5. When a sensor spikes, see the alarm appear at top of panel with AI explanation
6. Click a node in the graph to see which machines are affected

## Environment variables

- `GEMINI_API_KEY` — Get free from aistudio.google.com

## Built for

ABB Accelerator 2026 — Pan India Innovation Hackathon
Theme: Next-Gen Control System Interface
Team: [Your team name here]
Event date: June 25, 2026 — Bengaluru

## License

MIT License

