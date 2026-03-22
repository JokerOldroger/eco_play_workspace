
# EcoPlay Campus Energy App

This is a code bundle for EcoPlay Campus Energy App. The original project is available at https://www.figma.com/design/TDACCq6A1FlJXi0vctFhCA/EcoPlay-Campus-Energy-App.

## Local development

Install frontend dependencies:

```bash
npm i
```

Start the backend from the workspace root:

```bash
cd /Users/zhouyuyan/Documents/eco_play_workspace
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
python3 backend/src/app.py
```

The Flask API runs on `http://127.0.0.1:5001`.

To enable the real OpenAI smart chat backend, create `backend/.env` from `backend/.env.example` and set:

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_CHAT_MODEL=gpt-5-mini
```

In a second terminal, start the frontend:

```bash
cd "/Users/zhouyuyan/Documents/eco_play_workspace/frontend/EcoPlay Campus Energy App"
npm run dev
```

The Vite dev server runs on `http://localhost:5173` and proxies `/api/*` requests to the Flask backend on port `5001`, so you should open only the frontend URL in the browser when testing.

## Environment variables

The frontend uses same-origin `/api` requests by default. If you need to bypass the Vite proxy, copy `.env.example` to `.env` and set `VITE_API_BASE_URL`.
  
