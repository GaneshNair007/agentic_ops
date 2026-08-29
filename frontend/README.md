# AI SRE Incident Risk Triage System

An autonomous AI agent operations dashboard featuring an incident simulator, evidence retrieval, safety bounds, and an immutable audit timeline.

## Tech Stack
* **Frontend:** React, Vite, Tailwind CSS v4, Framer Motion (GSAP), Lucide React.
* **Backend:** Python, FastAPI, ChromaDB (for RAG memory), Uvicorn.

## Setup & Run Instructions

### 1. Environment Configuration
Create a `.env` or `.env.local` file in the root directory (using `.env.example` as a template):
```env
GEMINI_API_KEY="your-gemini-api-key"
```

### 2. Backend (FastAPI) Setup
The backend runs the RAG memory system, the action executor, and the event pipeline.

```bash
# 1. (Optional but recommended) Create a virtual environment
python -m venv venv
venv\Scripts\activate   # (Windows)
# source venv/bin/activate # (Mac/Linux)

# 2. Install Python dependencies
pip install fastapi uvicorn pydantic chromadb

# 3. Start the backend server
python api_server.py
```
*The backend will be available at http://localhost:8000*

### 3. Frontend (React) Setup
The frontend provides the visual operations console.

```bash
# 1. Install Node.js dependencies
npm install

# 2. Start the Vite development server
npm run dev
```
*The frontend will be available at http://localhost:3000*

## Architecture Overview
- `api_server.py`: Main FastAPI application, routing API requests.
- `tools/`: Python backend logic for action execution and event bus.
- `rag/`: Python backend logic for retrieval-augmented generation.
- `src/`: React frontend source code.
  - `src/services/api.ts`: API client interfacing with the backend.
  - `src/components/sections/`: UI modules comprising the full-width cinematic design.
