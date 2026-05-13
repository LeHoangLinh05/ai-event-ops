# AI Event Operation Assistant

## Setup

1. **Environment Variables**:
   - The `.env` file has been created in the root directory.
   - Make sure to add your `GEMINI_API_KEY` to the `.env` file.
   - MongoDB should be running at `mongodb://localhost:27017/ai-event-ops`.

2. **Installation**:
   - Run `npm install` in the root directory.
   - Run `npm install` in the `frontend` directory.

3. **Running the App**:
   - From the root directory, run `npm run dev` to start both the backend (port 5000) and frontend (port 3000) concurrently.

## Configuration Details
- **Backend Port**: 5000 (Set in `.env`)
- **Frontend Port**: 3000 (Set in `frontend/vite.config.ts`)
- **Proxy**: Frontend proxies `/api` to `http://localhost:5000/api`.