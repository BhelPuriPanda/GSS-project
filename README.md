# DAPS — Digital Asset Protection System

A production-style full-stack platform for protecting digital assets using **machine-learning fingerprinting**, **automated piracy detection**, and **AI-assisted enforcement workflows**.

---

## Overview

DAPS helps creators and rights holders register original media, generate unique fingerprints, monitor potential infringements, and respond with faster legal and operational workflows.

The platform combines:

- a **React/Vite frontend** for dashboards and analyst tooling
- a **Node.js/Express API** for authentication, orchestration, and persistence
- a **FastAPI ML microservice** for image/video fingerprinting and similarity checks
- a **background scraper** for identifying and reporting potential piracy events
- **MongoDB** for storing users, protected assets, and violations

---

## Core Capabilities

- **Responsive Cyberpunk UI** with modern dark mode aesthetics and data-rich analyst toolsets
- **Secure media registration** with upload, storage, and ownership mapping
- **Visual fingerprint generation** using perceptual hashes and CNN embeddings
- **Image/video comparison** for duplicate and infringement detection
- **Hybrid hit-and-run scraper (Cheerio + Puppeteer)** for fast, memory-efficient background scanning and reporting
- **Violation intelligence dashboard** for reviewing detected breaches
- **Robust AI Legal Assistant** using a multi-model fallback system (OpenRouter) to generate legal strategies and copyright takedown requests
- **ML sandbox** for side-by-side diagnostic comparison during demos and testing

---

## System Architecture

| Layer | Stack | Responsibility |
|---|---|---|
| Frontend | React, Vite, Tailwind | Cyberpunk UI, auth views, ML sandbox, violation dashboard |
| Backend API | Node.js, Express, Mongoose | Auth, uploads, AI fallback routing, orchestration |
| ML Service | FastAPI, PyTorch, TorchVision, OpenCV | Fingerprinting, embedding generation, similarity scoring |
| Scraper Node | Node.js, Axios, Puppeteer, Cheerio | Hybrid hit-and-run asset scanning and reporting |
| Database | MongoDB Atlas / Docker | Users, media records, violation records |

---

## Repository Structure

```text
GSS/
├── backend-node/      # Express API, auth, uploads, AI endpoints, MongoDB integration
├── backend-python/    # FastAPI ML service for hashing, embeddings, and comparisons
├── frontend/          # React frontend variant
├── frontend-react/    # Primary Vite/React UI used for dashboard and demo flows
├── node-scrapper/     # Background scraper and reporting pipeline
├── combined_architecture_flow.md
├── backend_architecture_flow.md
├── frontend_architecture_flow.md
├── python_architecture_flow.md
└── scraper_architecture_flow.md
```

---

## End-to-End Workflow

1. **User uploads an original asset** through the frontend.
2. The **Node backend** accepts the file and sends it to the **Python ML service**.
3. The ML service generates a **fingerprint profile** using hashes and embeddings.
4. The backend stores the media and metadata in **MongoDB**.
5. The **scraper service** scans external sources for likely matches.
6. Suspect files are verified by the ML service and reported back as **violations**.
7. The frontend displays violations and exposes **AI-assisted response tools**.

---

## Local Development Setup

### Run with Docker Compose (Recommended)

To run the entire stack seamlessly and avoid local environment configuration issues, use the provided Docker Compose setup:

1. **Configure Environment Variables**: Ensure you have created the necessary `.env` files locally before running Docker.
   - `backend-node/.env` (See the Node backend `.env` example below)
   - `node-scrapper/.env` (Requires `BACKEND_URL=http://backend-node:5000` and `SCRAPER_API_KEY`)

2. **Start the Stack**:
```bash
docker-compose up --build
```
This builds and starts the **Frontend** (accessible at `http://localhost`), **Node API**, **Python ML Service**, **Scraper**, and a **local MongoDB** container, automatically linking internal networks and environment variables.

### Manual Setup (Without Docker)

If you prefer to run services individually:

#### Prerequisites

- **Node.js** 18+
- **Python** 3.10+
- **MongoDB Atlas** or local MongoDB
- npm / pip

### 1) Start the Node backend

```bash
cd backend-node
npm install
npm start
```

Example `.env` for `backend-node/.env`:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
OPENROUTER_API_KEY=your_openrouter_api_key
SCRAPER_API_KEY=daps-internal-key-2026
PYTHON_SERVICE_URL=http://localhost:8000
BACKEND_URL=http://localhost:5000
```

### 2) Start the Python ML service

```bash
cd backend-python
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

### 3) Start the frontend

```bash
cd frontend-react
npm install
npm run dev
```

### 4) Optional: run the scraper

```bash
cd node-scrapper
npm install
node index.js --run-now
```

### Local service URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- Python ML Service: `http://localhost:8000`

---

## Major API Groups

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/sendotp`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Media
- `POST /api/media/upload`
- `GET /api/media/me`
- `GET /api/media/violations/me`
- `GET /api/media/all`
- `POST /api/media/report`

### AI Assistance
- `POST /api/ai/analyze`
- `POST /api/ai/summarize`
- `POST /api/ai/draft-takedown`

### ML Service
- `POST /compare/image`
- `POST /compare/video`
- `POST /compare/two-images`

---

## Deployment Note

The project can be deployed to services such as **Render**, but the **Python ML service may be noticeably slower on free-tier hosting** because:

- the service can **sleep and cold-start** after inactivity
- `torch` / `torchvision` model loading is heavier in cloud CPU environments
- fingerprint generation happens during real-time upload and comparison flows

For smooth live demonstrations, the **local environment provides the best real-time experience**.

---

## Project Highlights

- Clean separation of concerns via **microservice-style architecture**
- Real-world combination of **security, computer vision, and AI-assisted legal tooling**
- Designed for **demo readiness**, experimentation, and future productization
- Extensible structure for adding new detectors, models, or enforcement workflows

---

## Status

This repository is an advanced prototype / demo system for digital asset protection and piracy monitoring. It is ideal for showcasing:

- full-stack system design
- ML service integration
- media fingerprinting workflows
- AI-enhanced operational tooling
- multi-service deployment patterns

---

## License

This project is intended for educational, prototype, and demonstration use unless otherwise specified by the repository owner.
