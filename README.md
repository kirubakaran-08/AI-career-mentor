# AI Career Mentor

An AI-assisted technical career guidance web application designed to help job seekers, students, and engineers identify skill gaps, analyze resumes, practice technical interviews, and follow structured role roadmaps.

---

## 📌 Problem

Early-career developers and technical job seekers frequently navigate recruitment cycles with limited feedback:

- **Resume Screening**: Resumes are often rejected by automated applicant tracking systems (ATS) without transparent guidance on formatting flaws or missing keywords.
- **Unstructured Learning**: Broad technology landscapes can be overwhelming without step-by-step milestone roadmaps tailored to specific technical roles.
- **Interview Practice**: Finding structured, interactive technical and behavioral interview preparation with actionable feedback is difficult without expensive coaching.

AI Career Mentor provides an open-source, local-first platform to address these challenges using the Google Gemini API for personalized guidance and an installable PWA with an offline-capable application shell and local browser storage.

---

## ✨ Key Features

- **ATS Resume Analyzer**: Analyzes plain-text resumes for keyword density, formatting structure, impact phrasing, and actionable improvement recommendations.
- **ATS Job Description Matcher**: Compares candidate resumes directly against pasted job descriptions to identify missing skills and match alignment.
- **Curated Learning Roadmaps**: 10 comprehensive domain roadmaps (Full-Stack, AI Engineer, Cloud Architect, DevOps, Cybersecurity, Data Science, etc.) with beginner, intermediate, and advanced checkpoints.
- **AI Mock Interview Simulator**: Interactive interview simulator supporting question customization, speech recognition/audio controls, and qualitative feedback on answer clarity and technical accuracy.
- **Skill Gap Matrix**: Evaluates current technical competencies against benchmark target roles to highlight high-priority learning areas.
- **Career Comparison Tool**: Side-by-side comparison of tech tracks evaluating daily responsibilities, market trends, and learning curves.
- **Portfolio Project Idea Generator**: Generates realistic project blueprints with problem statements, architectural components, and implementation guides.
- **AI Career Assistant Chat**: Contextual chat interface answering career and recruitment questions.
- **Local Profile & Goal Tracking**: Track personal learning goals, certifications, and streaks with all personal data stored locally in your browser.
- **Single-File Data Backup**: Export and restore your full career profile, certificates, and goals as a single JSON file.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4, Lucide React
- **Backend**: Node.js, Express, tsx / esbuild
- **AI Engine**: Google GenAI SDK (`@google/genai`) using the Google Gemini API
- **PWA & Storage**: Web App Manifest, Service Worker offline app shell, browser LocalStorage

---

## 📦 Prerequisites & Installation

### Prerequisites

- Node.js 20.x or later
- Bun (for dependency installation and lockfile consistency)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kirubakaran-08/AI-career-mentor.git
cd AI-career-mentor
   ```

2. Install dependencies:
   ```bash
   bun install --frozen-lockfile
   ```

---

## ⚙️ Environment Configuration

Copy the example environment file and configure your API key:

```bash
cp .env.example .env
```

Available variables (see `.env.example`):

| Variable | Description | Required |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Your Google Gemini API key from Google AI Studio | Yes (for AI features) |
| `GEMINI_MODEL` | Primary model identifier (defaults to `gemini-3.8-flash`) | Optional |
| `APP_URL` | Application URL for self-referential links | Optional |
| `VITE_CONTACT_EMAIL` | Recipient email used by the contact form; set this to an address you control | Optional |

---

## 🚀 Running Locally & Building

### Development Mode

Starts the combined Express backend and Vite development middleware on port 3000:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Type Check & Linting

```bash
bun run lint
```

### Production Build

Builds the frontend client into `dist/` and bundles `server.ts` into `dist/server.cjs`:

```bash
bun run build
```

### Production Start

```bash
bun run start
```

---

## 🔒 Privacy, Data Storage, PWA & Offline Scope

- **Local-First Data**: Personal career profiles, habit streaks, goals, certificates, and saved resume drafts are stored strictly on the user's local machine in browser `LocalStorage`. No external database, tracking server, or remote user account is used.
- **PWA Installation**: Installable to desktop and mobile home screens via standard Web App Manifest (`manifest.json`) and app-owned SVG icons (`icon-192.svg`, `icon-512.svg`).
- **Offline Shell & Local Features**: The service worker (`service-worker.js`) caches the core application shell, built JavaScript and CSS bundles, Web App Manifest, and local SVG icons. When offline or when network connectivity is lost, users can:
  - Open and navigate the application shell.
  - Explore all 10 curated tech career roadmaps and track milestone progress.
  - Create, edit, and locally print ATS resumes with live side-by-side paper previews.
  - Manage daily learning goals, streaks, and tracked certifications.
  - Run deterministic, benchmark-based skill gap evaluations against standard role matrices.
  - Export and restore career portfolio backups via JSON.
- **Online Requirements for AI Services**: Generating live AI assessments (Gemini AI career chat, live ATS resume keyword analysis, AI mock interview grading, AI project idea generation, and ATS job description matching) proxies through `/api/ai/*` to the Google Gemini API and requires an active internet connection. Live generative AI does not execute offline.
- **No Push Notifications**: The application does not register push notification subscriptions or background sync workers.
- **No ATS Guarantee**: Automated resume analysis provides qualitative feedback based on common recruitment keywords and readability heuristics; it cannot guarantee employment outcomes or proprietary corporate screening decisions.

---

## ⚠️ Known Limitations

- Live AI features depend on an active internet connection, server accessibility, and valid Google Gemini API quota.
- The contact form prepares a `mailto:` draft; users must send the prepared draft via their chosen email client.

---

## 📄 Licence

This project is open-source and available under the terms of the [MIT License](LICENSE).

---

