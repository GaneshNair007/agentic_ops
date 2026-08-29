# AI SRE Operation Console — Backend

FastAPI backend powering the AI SRE Operation Console.

## Deploy on Render

| Field | Value |
|---|---|
| **Root Directory** | `backend` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn api_server:app --host 0.0.0.0 --port $PORT` |
| **Python Version** | 3.11 (auto-detected via `.python-version`) |

## Run Locally

```bash
cd backend
python -m venv venv
# Windows:
.\\venv\\Scripts\\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn api_server:app --reload --port 8000
```

API available at `http://localhost:8000`
