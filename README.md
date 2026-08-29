# AI SRE Operation Console

An autonomous AI-powered Site Reliability Engineering console that triages incidents, retrieves vector-memory evidence, enforces deterministic safety policies, and maintains immutable audit logs.

## Repository Structure

```
agentic_ops/
├── frontend/     # React/Vite UI — deploy to Vercel
├── backend/      # FastAPI Python server — deploy to Render
└── README.md
```

## Quick Start (Local)

### Backend (FastAPI)
```bash
cd backend
python -m venv venv && source venv/bin/activate  # or .\\venv\\Scripts\\activate on Windows
pip install -r requirements.txt
uvicorn api_server:app --reload --port 8000
```

### Frontend (React/Vite)
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000` and proxies API calls to `http://localhost:8000`.

## Deployment

### Frontend → Vercel
1. Import `GaneshNair007/agentic_ops` on [vercel.com](https://vercel.com)
2. Set **Root Directory** = `frontend`
3. Add env var: `VITE_API_URL=https://your-backend.onrender.com`
4. Deploy

### Backend → Render
1. New Web Service from `GaneshNair007/agentic_ops`
2. Set **Root Directory** = `backend`
3. **Build Command** = `pip install -r requirements.txt`
4. **Start Command** = `uvicorn api_server:app --host 0.0.0.0 --port $PORT`
5. Deploy

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, GSAP, Framer Motion |
| Backend | FastAPI, Uvicorn, ChromaDB, Pydantic |
| AI | Vector RAG retrieval, deterministic action guardrails |
| Infra | Vercel (frontend), Render (backend) |
