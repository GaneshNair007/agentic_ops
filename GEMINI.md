# agentic_ops — Agent Rules

## Shell (PowerShell)
- NEVER use `&&` to chain commands — use `;` instead.
- NEVER use `2>$null` inline — use `2>&1` or separate statements.
- Use `Remove-Item -Recurse -Force` instead of `rmdir /S /Q`.
- Use `Copy-Item -Recurse -Force` instead of `cp -r`.

## Git
- When running `git rm --cached` to clean tracked files, list every path explicitly. `.gitignore` alone cannot remove already-tracked files.
- After `git rm --cached`, always `git commit` to finalize the removal.
- Never commit `node_modules/`, `dist/`, `__pycache__/`, `rag/chroma_db/`, `.agents/`.

## Project Structure
- The repo root must contain exactly: `frontend/`, `backend/`, `README.md`, `.gitignore`.
- `backend/` contains ONLY Python files: `api_server.py`, `app.py`, `interfaces.py`, `main.py`, `rag/`, `tools/`, `orchestrator/`, `llm/`, `requirements.txt`, `.python-version`.
- `frontend/` contains the React/Vite app with `src/`, `package.json`, `vercel.json`.
- NEVER put `node_modules/`, `dist/`, React source files, or TypeScript/Vite configs inside `backend/`.

## Deployment
- **Vercel (frontend):** Always include `frontend/vercel.json` with `outputDirectory: "dist"`. Set `VITE_API_URL` fallback in `src/services/api.ts` as `import.meta.env.VITE_API_URL ?? 'https://agentic-ops-1.onrender.com'`.
- **Render (backend):** Pin `.python-version` to `3.11.9`. Do NOT include `torch` or `sentence-transformers` in `requirements.txt` — too large for free tier. Start command: `uvicorn api_server:app --host 0.0.0.0 --port $PORT`. Root Directory on Render = `backend`.
- **Live backend URL:** `https://agentic-ops-1.onrender.com`
- **Vercel project:** `agentic-ops` under account `nairganesh134-5909`.

## Backend Preservation
- NEVER modify `api_server.py`, `app.py`, `interfaces.py`, `rag/`, `tools/`, or `orchestrator/` unless the user explicitly asks for backend changes.
- All UI changes must be limited to `frontend/src/`.
