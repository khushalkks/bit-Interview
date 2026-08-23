# 🚀 Production Deployment Guide

This guide details the steps to deploy the **Bit-Interview** platform:
- **React Frontend**: Deployed to [Vercel](https://vercel.com)
- **FastAPI Backend**: Deployed to [Render](https://render.com)

---

## 🎨 1. Backend Deployment (Render)

### Step 1: Create a Render Web Service
1. Log in to [Render](https://render.com) and click **New > Web Service**.
2. Connect your GitHub repository (`bit-Interview`).
3. Configure the following parameters:
   - **Name**: `bit-interview-backend`
   - **Environment**: `Python 3`
   - **Root Directory**: `intervue-ai/backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Step 2: Configure Environment Variables
In the Render dashboard, go to the **Environment** tab and add the following keys:
- `MONGODB_URI`: Your MongoDB Atlas URI connection string (e.g. `mongodb+srv://...`).
- `JWT_SECRET`: A secure random string for JWT token generation.
- `REDIS_URL`: Your Redis connection string (e.g. `redis://...` from Redis Labs or Render Redis).
- `GEMINI_API_KEY`: Your Google Gemini API Key.
- `CORS_ORIGIN`: Your deployed Vercel frontend URL (e.g. `https://your-app-name.vercel.app`).
- `OPENAI_API_KEY`: (Optional) Your OpenAI API Key.
- `JUDGE0_URL`: (Optional) Remote Judge0 API Host.

Click **Save Changes** and wait for the service to deploy. Copy the deployed service URL (e.g., `https://bit-interview-backend.onrender.com`).

---

## 🖥️ 2. Frontend Deployment (Vercel)

### Step 1: Create a Vercel Project
1. Log in to [Vercel](https://vercel.com) and click **Add New > Project**.
2. Import your GitHub repository (`bit-Interview`).
3. Configure the following parameters:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `intervue-ai/frontend`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist` (default)

### Step 2: Configure Environment Variables
Expand the **Environment Variables** section and add:
- `VITE_API_URL`: Your deployed Render backend API URL with the `/api` suffix (e.g., `https://bit-interview-backend.onrender.com/api`).

Click **Deploy**. Vercel will automatically build the bundle and host it at a production URL.

---

## ⚙️ 3. Post-Deployment Verification
1. Access the deployed Vercel URL.
2. Verify that manual page reloads (e.g. on `/dashboard` or `/interview`) load correctly without 404s (handled automatically by `vercel.json` rewrites).
3. Log in to verify candidate credentials, session setup wizards, and live analytics radar charts.
