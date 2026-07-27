# PathPilot AI — Production Deployment Guide

**Live Preview URL:** [https://pathpilot-ai-rust-phi.vercel.app](https://pathpilot-ai-rust-phi.vercel.app)  
**Target Runtimes:** Vercel (Production Serverless SPA) & Google Cloud Run (Containerized Express + Vite)  
**Database Infrastructure:** Supabase PostgreSQL & Supabase Auth  
**Node Version:** Node.js 18 LTS or higher  

---

## 1. Prerequisites & Tooling

Before deploying PathPilot AI to production, ensure you have installed and configured:
- [Google Cloud SDK (`gcloud`)](https://cloud.google.com/sdk/docs/install)
- [Docker Engine](https://docs.docker.com/get-docker/)
- Node.js v18+ and `npm` v9+
- A Supabase Project ([supabase.com](https://supabase.com))
- A Google Gemini API Key ([ai.google.dev](https://ai.google.dev))

---

## 2. Environment Configuration

Define production secrets in Google Cloud Secret Manager or directly in the Cloud Run environment settings. Never commit `.env` files containing real secrets to Git.

### Environment Variable Matrix
| Variable | Scope | Required | Description |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Server | Yes | Set to `production` |
| `PORT` | Server | Yes | Defaults to `3000` (required for Cloud Run container ingress) |
| `GEMINI_API_KEY` | Server | Yes | Google Gemini API Secret Key |
| `VITE_SUPABASE_URL` | Client & Server | Yes | Supabase Project HTTPS Endpoint |
| `VITE_SUPABASE_ANON_KEY` | Client & Server | Yes | Supabase Public Anonymous API Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Only | Optional | Supabase Admin Service Role Key |

---

## 3. Local Production Build Testing

Validate the full-stack production build locally prior to containerizing:

```bash
# 1. Clean build directory & compile client + server
npm run build

# 2. Test running compiled CJS server
npm start
```

Confirm that the application starts on `http://localhost:3000` and all static assets load properly from `/dist`.

---

## 4. Google Cloud Run Deployment

PathPilot AI is designed for single-command zero-downtime deployment to Google Cloud Run.

### Step 1: Initialize Google Cloud Project
```bash
gcloud config set project YOUR_GCP_PROJECT_ID
gcloud services enable run.googleapis.com cloudbuild.googleapis.com containerregistry.googleapis.com
```

### Step 2: Build & Submit Docker Image
Submit the project codebase to Google Cloud Build:

```bash
gcloud builds submit --tag gcr.io/YOUR_GCP_PROJECT_ID/pathpilot-ai:v1.0.0
```

### Step 3: Deploy to Cloud Run
Deploy the container with environment variables attached:

```bash
gcloud run deploy pathpilot-ai \
  --image gcr.io/YOUR_GCP_PROJECT_ID/pathpilot-ai:v1.0.0 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars="NODE_ENV=production,GEMINI_API_KEY=YOUR_KEY,VITE_SUPABASE_URL=YOUR_URL,VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY"
```

Cloud Run will output the live service URL upon completion (e.g., `https://pathpilot-ai-23129924445.us-central1.run.app`).

---

## 5. Supabase Database Migration

Execute the database schema setup script inside the Supabase SQL Editor:

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard).
2. Open **SQL Editor** -> **New Query**.
3. Paste the contents of `supabase-schema.sql` (found in project root).
4. Click **Run**.
5. Verify that `profiles`, `resumes`, `roadmaps`, `applications`, `tasks`, and `documents` tables are created with RLS enabled.

---

## 6. Custom Domain & SSL Setup

To attach a custom domain (e.g., `app.pathpilot.ai`):

1. Go to **Cloud Run** -> **Domain Mappings** -> **Add Mapping**.
2. Select `pathpilot-ai` service and enter `app.pathpilot.ai`.
3. Add the generated `CNAME` or `A` DNS records to your DNS provider (e.g., Cloudflare, Namecheap).
4. Managed TLS/SSL certificates will be automatically provisioned within 15 minutes.

---

## 7. Production Verification Checklist

- [ ] `/api/health` returns status `200 OK` with `healthy` status.
- [ ] User Sign Up and Login function via Supabase Auth without console errors.
- [ ] Resume Analyzer dispatches requests to Gemini API server-side and renders match scores.
- [ ] Career Mentor Chat streams assistant responses and updates conversation history.
- [ ] Page navigation works smoothly with dynamic lazy loading.
- [ ] Homing page reloads stay on active route (`/dashboard`, `/roadmap`, etc.) without 404 errors.
