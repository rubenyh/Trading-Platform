## Trading Platform

## Overview

This repo contains a small trading dashboard with a Next.js frontend and a FastAPI backend. The UI renders interactive price charts, indicators, and prediction overlays, while the API serves stock candle data and mock prediction results.

## Stack

- Frontend: Next.js (React, TypeScript, Tailwind)
- Backend: FastAPI (Python)

## Local setup

### Frontend

1. Open a terminal at [app/](app/).
2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

The app runs at http://localhost:3000.

### Backend

1. Open a terminal at [backend/](backend/).
2. Create and activate a virtual environment:

```bash
python -m venv .venv
```

```bash
.venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Start the API server:

```bash
uvicorn app.main:app --reload --port 8000
```

The API runs at http://localhost:8000 and exposes:

- `GET /api/health`
- `GET /api/stocks/{ticker}?timeframe=1m&limit=200`
- `POST /api/predict`

## Running both

Run the frontend and backend in separate terminals. The backend is CORS-enabled for http://localhost:3000.
