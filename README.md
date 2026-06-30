# ⚡ PrepIQ

**Next-Gen AI Technical Interview Prep Platform**

PrepIQ reverse-engineers job descriptions using Gemini AI to isolate your exact knowledge gaps, simulate adaptive flashcard drills, and compile a personalized day-by-day study timeline — so you walk into every interview fully prepared.

🌐 **Live:** [prep-iq.web.app](https://prep-iq.web.app)

---

## ✨ Features

- **AI-Powered JD Analysis** — Paste any engineering job description and Gemini AI extracts the exact skills, priorities, and red flags you need to know.
- **Precision Knowledge Gap Detection** — Pinpoints what you don't know, not just what the role requires.
- **Adaptive Flashcard Drills** — Interactive study cards that target your weakest areas for smarter repetition.
- **Weakness Radar** — Visual confidence charts surface your blind spots across every topic you've practised.
- **Automated Study Timelines** — Generates a day-by-day sprint schedule tailored to your lowest-confidence areas and interview date.
- **Zero Setup** — Sign in with Google and go. No backend, no API key wrangling — fully serverless on Firebase.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 |
| Language | TypeScript ~6.0 |
| Build Tool | Vite 8 |
| Routing | React Router DOM 7 |
| Styling | Tailwind CSS 3 |
| Notifications | react-hot-toast |
| Auth / Database | Firebase 12 (Auth + Firestore) |
| AI | Google Gemini AI |
| Linting | Oxlint |
| Hosting | Firebase Hosting |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Firebase project with Authentication and Firestore enabled
- Google sign-in enabled in Firebase Authentication
- A Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/aakash-kapoor/prepiq-react.git
cd prepiq-react

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Firebase configuration is read from [src/config/firebase.ts](src/config/firebase.ts). Gemini requests are made from [src/hooks/useGemini.ts](src/hooks/useGemini.ts).

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

---

## 📁 Project Structure

```text
prepiq/
|-- public/
|   |-- favicon.svg
|   `-- icons.svg
|-- src/
|   |-- assets/
|   |   |-- hero.png
|   |   |-- react.svg
|   |   `-- vite.svg
|   |-- components/
|   |   |-- AppLayout.tsx
|   |   |-- EmptyState.tsx
|   |   |-- ErrorBoundary.tsx
|   |   |-- LegalModal.tsx
|   |   |-- LoadingState.tsx
|   |   |-- ProgressBar.tsx
|   |   `-- Spinner.tsx
|   |-- config/
|   |   |-- changelog.ts
|   |   |-- firebase.ts
|   |   `-- smokeTest.ts
|   |-- context/
|   |   `-- AuthContext.tsx
|   |-- hooks/
|   |   `-- useGemini.ts
|   |-- lib/
|   |   `-- toast.ts
|   |-- pages/
|   |   |-- Analyze/
|   |   |   |-- index.tsx
|   |   |   |-- InputPanel.tsx
|   |   |   `-- ResultsPanel.tsx
|   |   |-- Landing/
|   |   |   |-- index.tsx
|   |   |   |-- Navbar.tsx
|   |   |   |-- Hero.tsx
|   |   |   |-- HowItWorks.tsx
|   |   |   |-- Features.tsx
|   |   |   |-- CTA.tsx
|   |   |   |-- AboutDeveloper.tsx
|   |   |   `-- Footer.tsx
|   |   |-- Weaknesses/
|   |   |   |-- index.tsx
|   |   |   |-- types.ts
|   |   |   |-- AppSelector.tsx
|   |   |   |-- SummaryCards.tsx
|   |   |   `-- TopicRail.tsx
|   |   |-- DashboardHome.tsx
|   |   |-- Login.tsx
|   |   |-- Questions.tsx
|   |   |-- Quiz.tsx
|   |   |-- QuizLauncher.tsx
|   |   `-- StudyPlan.tsx
|   |-- App.tsx
|   |-- App.css
|   |-- index.css
|   `-- main.tsx
|-- firebase.json
|-- index.html
|-- package.json
|-- tailwind.config.js
|-- tsconfig.json
`-- vite.config.ts
```

---

## 🏗️ Architecture Notes

**Serverless by design.** There is no backend. Auth runs through Firebase Authentication (Google OAuth), and all user data — job applications, question banks, confidence scores — lives in Firestore under isolated per-user document paths enforced by Security Rules.

**Gemini as a schema engine.** The `useGemini` hook prompts the model to return strict JSON rather than conversational output, making parsed results predictable and safe to render directly.

**Component-first page structure.** Large pages (`Landing`, `Analyze`, `Weaknesses`) are split into focused sub-components, each owning its own data and UI. Orchestrator `index.tsx` files handle state and wire props down — keeping business logic separate from presentation.

**Layered error boundaries.** `ErrorBoundary` wraps the app at three levels — the whole app, the dashboard shell, and each individual dashboard route — so a crash on one page doesn't take down the whole workspace.

---

## 📋 Changelog

| Version | Date | Summary |
|---|---|---|
| v0.6.0 | Jun 30, 2026 | Error boundaries, loading states, toast notifications, difficulty badge fix |
| v0.5.0 | Jun 29, 2026 | Legal modals, component refactor, landing refinements |
| v0.4.0 | Jun 28, 2026 | Landing and login page redesign |
| v0.3.2 | Jun 27, 2026 | Firebase Hosting target configured |
| v0.3.1 | Jun 27, 2026 | SEO meta tags and smooth scrolling |
| v0.3.0 | Jun 26, 2026 | TypeScript errors resolved |
| v0.2.0 | Jun 25, 2026 | README and project documentation |
| v0.1.0 | Jun 24, 2026 | Initial release |

Full release notes are available in [`src/config/changelog.ts`](src/config/changelog.ts) and in the in-app changelog modal.

---

## Deployment

The app is configured for Firebase Hosting in [firebase.json](firebase.json). Production builds are emitted to `dist/`.

```bash
npm run build
firebase deploy
```

---

## 🤝 Contributing

This is a personal project, but issues and suggestions are welcome. Open a GitHub issue or fork the project and submit a pull request.

---

## 📄 License

Private project. All rights reserved.

---

> Built by [Aakash Kapoor](https://github.com/aakash-kapoor)