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
| Auth / Database | Firebase 12 (Auth + Firestore) |
| AI | Google Gemini AI |
| Linting | Oxlint |
| Hosting | Firebase Hosting |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Firebase project (Auth + Firestore enabled)
- A Google Gemini API key

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

### Running the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint for code quality checks |

---

## 📁 Project Structure

```
prepiq-react/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/                       # Static images and icons
│   ├── components/
│   │   ├── AppLayout.tsx             # Shared dashboard layout wrapper ├── ErrorBoundary.tsx         # Error Boundary
│   │   ├── EmptyState.tsx            # Reusable empty state 
component
│   │   └── LegalModal.tsx            # Privacy / Terms modal dialog
│   ├── config/
│   │   ├── changelog.ts              # Typed changelog entries
│   │   ├── firebase.ts               # Firebase initialization
│   │   └── smokeTest.ts              # Firebase connection test
│   ├── context/
│   │   └── AuthContext.tsx           # Auth state and provider
│   ├── hooks/
│   │   └── useGemini.ts              # Gemini AI integration hook
│   ├── pages/
│   │   ├── Landing/
│   │   │   ├── index.tsx             # Orchestrator — composes all sections
│   │   │   ├── Navbar.tsx            # Sticky frosted navbar
│   │   │   ├── Hero.tsx              # Headline, CTAs, app preview, stats
│   │   │   ├── HowItWorks.tsx        # 4-step workflow section
│   │   │   ├── Features.tsx          # 6-feature grid
│   │   │   ├── CTA.tsx               # Full-width CTA banner
│   │   │   ├── AboutDeveloper.tsx    # Developer bio and tech tags
│   │   │   └── Footer.tsx            # Footer, changelog modal, legal modal
│   │   ├── Analyze/
│   │   │   ├── index.tsx             # Orchestrator — state and Firebase logic
│   │   │   ├── InputPanel.tsx        # Company input, JD textarea, analyze button
│   │   │   └── ResultsPanel.tsx      # Extracted skills, focus areas, save button
│   │   ├── Weaknesses/
│   │   │   ├── index.tsx             # Orchestrator — Firestore sync and aggregation
│   │   │   ├── types.ts              # TopicStats interface and getStatusConfig()
│   │   │   ├── AppSelector.tsx       # Job track selector pills
│   │   │   ├── SummaryCards.tsx      # Score, gaps, and mastered metric cards
│   │   │   └── TopicRail.tsx         # Per-topic confidence bars
│   │   ├── DashboardHome.tsx
│   │   ├── Login.tsx
│   │   ├── Questions.tsx
│   │   ├── QuizLauncher.tsx
│   │   ├── Quiz.tsx
│   │   └── StudyPlan.tsx
│   ├── App.tsx                       # Route definitions
│   ├── main.tsx                      # App entry point
│   ├── index.css
│   └── App.css
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🏗️ Architecture Notes

**Serverless by design.** There is no backend. Auth runs through Firebase Authentication (Google OAuth), and all user data — job applications, question banks, confidence scores — lives in Firestore under isolated per-user document paths enforced by Security Rules.

**Gemini as a schema engine.** The `useGemini` hook prompts the model to return strict JSON rather than conversational output, making parsed results predictable and safe to render directly.

**Component-first page structure.** Large pages (`Landing`, `Analyze`, `Weaknesses`) are split into focused sub-components, each owning its own data and UI. Orchestrator `index.tsx` files handle state and wire props down — keeping business logic separate from presentation.

---

## 📋 Changelog

| Version | Date | Summary |
|---|---|---|
| v0.5.0 | Jun 29, 2026 | Legal modals, component refactor, landing refinements |
| v0.4.0 | Jun 28, 2026 | Landing and login page redesign |
| v0.3.2 | Jun 27, 2026 | Firebase Hosting target configured |
| v0.3.1 | Jun 27, 2026 | SEO meta tags and smooth scrolling |
| v0.3.0 | Jun 26, 2026 | TypeScript errors resolved |
| v0.2.0 | Jun 25, 2026 | README and project documentation |
| v0.1.0 | Jun 24, 2026 | Initial release |

Full release notes are available in [`src/config/changelog.ts`](src/config/changelog.ts) and in the in-app changelog modal.

---

## 🤝 Contributing

This is a personal project but issues and suggestions are welcome. Open a GitHub issue or fork and submit a PR.

---

## 📄 License

Private project. All rights reserved.

---

> Built by [Aakash Kapoor](https://github.com/aakash-kapoor)
