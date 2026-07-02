<div align="center">

#███████╗███╗   ███╗███████╗███╗   ██╗██████╗  █████╗ ████████╗ ██████╗ ██████╗
 ██╔════╝████╗ ████║██╔════╝████╗  ██║██╔══██╗██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
 █████╗  ██╔████╔██║█████╗  ██╔██╗ ██║██║  ██║███████║   ██║   ██║   ██║██████╔╝
 ██╔══╝  ██║╚██╔╝██║██╔══╝  ██║╚██╗██║██║  ██║██╔══██║   ██║   ██║   ██║██╔══██╗
 ███████╗██║ ╚═╝ ██║███████╗██║ ╚████║██████╔╝██║  ██║   ██║   ╚██████╔╝██║  ██║
 ╚══════╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝

### AI-Powered, Multi-Model Consensus Code Review Platform

Emendator sends your code to three independent LLMs in parallel, merges their findings into a single high-confidence review, and gives you back a scored, annotated, and improved version of your code — through a clean, editor-grade web interface.

<br/>

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![OpenRouter](https://img.shields.io/badge/AI-OpenRouter-8A2BE2?style=for-the-badge&logo=openai&logoColor=white)

</div>

---

## 📖 Overview

**Emendator** is a full-stack SaaS application that automates code review using a **multi-model AI consensus pipeline**. Instead of relying on a single LLM (which can hallucinate or miss issues), Emendator queries **three different models simultaneously** through [OpenRouter](https://openrouter.ai/), then runs their outputs through a custom **consensus engine** that deduplicates findings, resolves conflicting suggestions, and scores overall confidence — producing one trustworthy, well-reasoned review per submission.

Users can sign up (email/password, Google, or GitHub), paste or write code in a Monaco-powered editor, request a review, and receive:

- An overall **quality score**
- Categorized **issues** (bugs, security, performance, style)
- Concrete **suggestions** and **line-level fixes**
- An AI-**improved version** of the code with a side-by-side diff viewer
- A saved **history** of past reviews they can revisit or edit

---

## ⚙️ How It Works

```
┌─────────────┐      ┌──────────────┐      ┌───────────────────────────────────────┐
│   React      │ ──▶  │   Express     │ ──▶  │        OpenRouter Review Pipeline       │
│  Frontend    │ HTTP │   Backend     │      │                                         │
│ (Vite/Tailwind)     │  (REST API)   │      │  ┌────────┐ ┌───────────┐ ┌──────────┐  │
└─────────────┘      └──────┬───────┘      │  │ Gemma  │ │ Nemotron  │ │ GPT-OSS  │  │
                             │              │  └───┬────┘ └─────┬─────┘ └────┬─────┘  │
                     ┌───────▼────────┐     │      └─────────────┼────────────┘        │
                     │  PostgreSQL     │     │           (run in parallel)              │
                     │  via Prisma ORM │     │                    ▼                     │
                     └────────────────┘     │        Consensus Engine (dedupe,          │
                                              │        conflict resolution, scoring)     │
                                              └───────────────────────────────────────┘
```

**Step by step:**

1. **Authentication** – Users register/login with email + password (bcrypt-hashed, JWT access + refresh tokens in HTTP-only cookies) or via **Google/GitHub OAuth**.
2. **Submitting code** – From the Review page, the user pastes code into a **Monaco Editor** and selects a language (18+ supported languages).
3. **Parallel AI dispatch** – The backend fans the code out to **three independent models** at once via `Promise.allSettled`, so total latency is bound by the *slowest* model, not the sum of all three.
4. **Consensus building** – The `consensus.engine.js` module:
   - Deduplicates overlapping findings using **Levenshtein similarity** (short strings) and **trigram Jaccard similarity** (longer strings)
   - Detects and resolves conflicting recommendations, keeping the majority view
   - Aggregates individual model scores into one confidence-weighted score
   - Selects the strongest candidate for the "improved code" output
5. **Persistence** – The final review (score, issues, suggestions, line fixes, improved code, metadata) is saved to **PostgreSQL** via **Prisma**, scoped to the authenticated user.
6. **Review & History UI** – Results are rendered with a score ring, categorized issue cards, and a **diff editor** comparing original vs. AI-improved code. Past reviews are listed on the History page and can be reopened or edited.
7. **Resilience** – If a model has no API key configured or fails, it's automatically excluded from the run (via `Promise.allSettled`) rather than failing the whole request; rate limiting and caching protect the AI layer from abuse.

---

## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **Vite** | Build tool / dev server |
| **Tailwind CSS** | Utility-first styling |
| **Zustand** | Lightweight state management (auth & review stores) |
| **React Router DOM** | Client-side routing & protected routes |
| **Monaco Editor** (`@monaco-editor/react`) | In-browser code editor + diff viewer |
| **Axios** | HTTP client |
| **React Hot Toast** | Toast notifications |
| **Lucide React** | Icon set |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **Prisma ORM** | Type-safe database access & migrations |
| **PostgreSQL** | Primary data store (Users, Reviews) |
| **JWT (jsonwebtoken)** | Access + refresh token authentication |
| **bcryptjs** | Password hashing |
| **Passport-style OAuth** (Google & GitHub) | Social login |
| **express-validator** | Request payload validation |
| **express-rate-limit** | Global & AI-specific rate limiting |
| **Helmet, CORS, cookie-parser, morgan** | Security headers, cross-origin handling, request logging |
| **Winston + winston-daily-rotate-file** | Structured, rotating application logs |

### AI / Review Pipeline
| Technology | Purpose |
|---|---|
| **OpenRouter API** | Unified gateway to multiple LLMs |
| **Gemma, Nemotron, GPT-OSS** (via OpenRouter) | The three models queried in parallel for each review |
| **Custom Consensus Engine** | Deduplicates & merges multi-model output into one verdict |
| **Confidence Scorer** | Produces an aggregated confidence/quality score |
| **In-memory Review Cache** | Avoids re-querying models for identical code submissions |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Docker & Docker Compose** | Containerized Postgres, backend, and frontend services |
| **Nginx** (frontend container) | Serves the built React app |

---

## 📁 Project Structure

```
emendator/
├── backend/
│   ├── src/
│   │   ├── config/            # DB, logger, OAuth, OpenRouter/OpenAI config
│   │   ├── controllers/       # auth, review, history controllers
│   │   ├── middleware/        # auth, rate limiting, validation, error handling
│   │   ├── routes/            # /api/auth, /api/review, /api/history
│   │   ├── services/
│   │   │   ├── openrouter/
│   │   │   │   ├── models/        # gemma, nemotron, gptoss clients
│   │   │   │   ├── consensus/     # multi-model consensus engine
│   │   │   │   ├── scoring/       # confidence scorer
│   │   │   │   ├── prompts/       # system/user prompt builders
│   │   │   │   └── cache/         # review response cache
│   │   │   ├── ai.service.js
│   │   │   ├── auth.service.js
│   │   │   ├── review.service.js
│   │   │   └── history.service.js
│   │   └── utils/              # JWT helpers, response formatting
│   └── prisma/schema.prisma    # User & Review data models
│
├── frontend/
│   ├── src/
│   │   ├── pages/               # Login, Signup, Dashboard, Review, History, Edit, OAuth callback
│   │   ├── components/          # CodeEditor, DiffEditor, ReviewResult, ScoreRing, Navigation, etc.
│   │   ├── store/                # Zustand auth & review stores
│   │   └── api/                  # Axios API clients
│
└── docker-compose.yml           # Postgres + backend + frontend orchestration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js **18+**
- PostgreSQL **15** (or use the provided Docker service)
- OpenRouter API keys (free tier available at [openrouter.ai](https://openrouter.ai/))
- (Optional) Google & GitHub OAuth app credentials

### 1. Clone & configure environment
```bash
git clone <your-repo-url>
cd emendator
cp .env.example .env   # then fill in your own secrets — see note below
```

> ⚠️ **Security note:** Never commit real API keys, database passwords, JWT secrets, or OAuth client secrets to version control. Generate fresh, unique values for `JWT_SECRET`, `JWT_REFRESH_SECRET`, `POSTGRES_PASSWORD`, and your OpenRouter/Google/GitHub credentials, and keep your `.env` file out of git (it's already listed in `.gitignore`).

### 2. Run with Docker (recommended)
```bash
docker compose up --build
```
This starts:
- `postgres` on `:5432`
- `backend` (Express API) on `:5000`
- `frontend` (Vite build served via Nginx) on `:5173`

### 3. Run manually (without Docker)
```bash
# Backend
cd backend
npm install
npx prisma migrate dev
npm run dev            # http://localhost:5000

# Frontend
cd frontend
npm install
npm run dev             # http://localhost:5173
```

---

## 🔑 Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register with email/password |
| `POST` | `/api/auth/login` | Login and receive JWT tokens |
| `GET` | `/api/auth/google`, `/api/auth/github` | Start OAuth flow |
| `GET` | `/api/auth/me` | Get current authenticated user |
| `POST` | `/api/review` | Submit code for multi-model AI review |
| `GET` | `/api/review/:id` | Get a single review |
| `GET` | `/api/history` | List a user's review history |
| `DELETE` | `/api/history/:id` | Delete a review |

---

## 🗄️ Data Model (Prisma)

- **User** — id, email, name, password (nullable for OAuth users), avatar, OAuth provider/providerId, related `Review[]`
- **Review** — id, userId, code, language, score, issues, suggestions, lineFixes, improvedCode, metadata (JSON), timestamps

---

## 🛡️ Security Features

- Passwords hashed with **bcrypt**
- **JWT access + refresh token** rotation via HTTP-only cookies
- **Helmet** security headers & strict **CORS** policy
- **Rate limiting** on global traffic and separately on AI-heavy endpoints
- Input validation on every mutating route via **express-validator**
- Centralized error handling middleware

---

## 📌 Notes

- The AI pipeline gracefully degrades: if one or two model API keys are missing or a model call fails, the review still completes using whichever models succeeded.
- Review results are cached in-memory to avoid redundant model calls for identical submissions.
- `cre.py` in the repo root is a developer utility script used to flatten the project into a single Markdown file (like the one this README was generated from) — it is not part of the running application.

---

<div align="center">

Built with a Node.js/Express + React stack, PostgreSQL, and a multi-model AI consensus pipeline powered by OpenRouter.

</div>
