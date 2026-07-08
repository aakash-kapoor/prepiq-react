# ⚡ PrepIQ

**Next-Gen AI Technical Interview Prep Platform**

PrepIQ reverse-engineers job descriptions using Gemini AI to isolate your exact knowledge gaps, simulate adaptive flashcard drills, and compile a personalized day-by-day study timeline — so you walk into every interview fully prepared.

![PrepIQ Tech Stack](https://img.shields.io/badge/React-19-6366F1?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

🌐 **Live:** [prep-iq.web.app](https://prep-iq.web.app)

---

## ✨ Features

- **AI-Powered Job Description Analysis** — Paste any engineering job description and Gemini AI extracts the exact skills, priorities, and red flags you need to know.
- **Precision Knowledge Gap Detection** — Pinpoints what you don't know, not just what the role requires.
- **Adaptive AI Quiz Sessions** — Dynamic interview questions generated from the analyzed job description with confidence tracking.
- **Weak Spots Radar** — Visual confidence charts surface your blind spots across every topic you've practised.
- **Automated Study Timelines** — Generates a day-by-day sprint schedule tailored to your lowest-confidence areas and interview date.
- **Delete Job Applications** — Remove individual roles from the dashboard at any time; all nested questions and confidence data are fully wiped from Firestore.
- **User Profile & Account Management** — Edit your display name, sign out, or permanently delete your account with a secure email-confirmation gate that wipes all associated Firestore data.
- **Zero Setup** — Sign in with Google and go. No backend, no API key wrangling — fully serverless on Firebase.

---

## 🔄 How It Works

1. Paste a job description.
2. Gemini AI extracts required skills and generates targeted questions.
3. Complete adaptive quizzes to build confidence.
4. Review Weak Spots analytics.
5. View/export a personalized PDF study plan.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 |
| Language | TypeScript ~6.0 |
| Build Tool | Vite 8 |
| Routing | React Router DOM 7 |
| Styling | Tailwind CSS 3 |
| Animations | Motion (motion/react) v12 |
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
VITE_GEMINI_PROXY_URL=https://your-worker-subdomain.workers.dev/
```

Firebase configuration is read from [src/config/firebase.ts](src/config/firebase.ts). Gemini requests are proxied via a Cloudflare Worker using [src/hooks/useGemini.ts](src/hooks/useGemini.ts).

#### ☁️ Cloudflare Worker Proxy Setup

To keep the `GEMINI_API_KEY` hidden from client-side network inspectors, configure a Cloudflare Worker as a serverless proxy:

1. Create a new Worker in your **Cloudflare Dashboard** (under **Workers & Pages**).
2. Paste the following proxy code:
   ```javascript
   export default {
     async fetch(request, env) {
       const corsHeaders = {
         "Access-Control-Allow-Origin": "*", // Lock down to your domain in production
         "Access-Control-Allow-Methods": "POST, OPTIONS",
         "Access-Control-Allow-Headers": "Content-Type",
       };
       if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
       if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });

       try {
         const body = await request.json();
         const apiKey = env.GEMINI_API_KEY;
         if (!apiKey) return new Response("Missing GEMINI_API_KEY secret", { status: 500, headers: corsHeaders });

         const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
         const response = await fetch(geminiUrl, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(body)
         });
         const data = await response.json();
         return new Response(JSON.stringify(data), { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
       } catch (err) {
         return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
       }
     }
   };
   ```
3. Set your secure `GEMINI_API_KEY` secret under the **Settings** → **Variables** tab of your Worker in the Cloudflare Dashboard.
4. Update `VITE_GEMINI_PROXY_URL` in your `.env` file to point to your deployed Worker URL.

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
src/
├── components/     # Shared UI components
├── pages/          # Route-level pages and feature modules
├── hooks/          # Custom React hooks
├── context/        # Global state providers
├── config/         # App configuration
├── lib/            # Utilities and helpers
└── assets/         # Static assets
```

---

## 🏗️ Architecture Notes

**Serverless by design.** There is no backend. Auth runs through Firebase Authentication (Google OAuth), and all user data — job applications, question banks, confidence scores — lives in Firestore under isolated per-user document paths enforced by Security Rules.

**Secure API proxying.** The frontend calls a serverless Cloudflare Worker proxy instead of fetching the Google Generative Language API directly. This protects the `GEMINI_API_KEY` from exposure in the client's network inspectors.

**Gemini as a schema engine.** The `useGemini` hook prompts the model to return strict JSON rather than conversational output, making parsed results predictable and safe to render directly.

**Component-first page structure.** Large pages (`Landing`, `Analyze`, `WeakSpots`) are split into focused sub-components, each owning its own data and UI. Orchestrator `index.tsx` files handle state and wire props down — keeping business logic separate from presentation.

**Layered error boundaries.** `ErrorBoundary` wraps the app at three levels — the whole app, the dashboard shell, and each individual dashboard route — so a crash on one page doesn't take down the whole workspace.

**Cascading deletes.** All delete operations (single job application or full account) batch-delete nested Firestore subcollections before removing the parent document, ensuring no orphaned data is left behind.

**Native PDF rendering.** Study plans are rendered using `@react-pdf/renderer` instead of DOM screenshot libraries, producing searchable, selectable, print-ready PDFs with consistent A4 layouts, automatic pagination, and page numbering across all devices.

**Responsive-first interface.** Layouts are designed mobile-first with dedicated desktop and mobile navigation components, responsive scaling, and shared layout primitives to ensure a consistent experience across screen sizes.

**Perceived performance.** Skeleton loaders, minimum loading durations, and route-level loading states create smooth transitions while avoiding layout shifts and flickering during asynchronous operations.

---

## 📋 Changelog

| Version | Date | Summary |
|---|---|---|
| v0.16.0 | Jul 7, 2026 | Custom Dropdowns, Collapsible Job Blueprints & Layout Enhancements |
| v0.15.0 | Jul 6, 2026 | Native PDF Study Plan Export |
| v0.14.0 | Jul 6, 2026 | Quiz Session Tracking & Dashboard Trends |
| v0.13.0 | Jul 5, 2026 | Consistent terminology — renamed Weaknesses → Weak Spots, removed jargon, standardised all labels |
| v0.12.0 | Jul 5, 2026 | Delete individual job applications from the dashboard |
| v0.11.0 | Jul 5, 2026 | Global dark mode support |
| v0.10.0 | Jul 4, 2026 | Collapsible sidebar, scroll restoration, Profile fixes |
| v0.9.0 | Jul 3, 2026 | Animated track selector, smoother loading skeletons, motion improvements |
| v0.8.0 | Jul 2, 2026 | User profile page, display name editing, account deletion |
| v0.7.0 | Jul 1, 2026 | UI hardening, modular routing, liquid glass mobile nav |
| v0.6.0 | Jun 30, 2026 | Error boundaries, loading states, toast notifications |
| v0.5.0 | Jun 29, 2026 | Legal modals, component refactor, landing refinements |
| v0.4.0 | Jun 28, 2026 | Landing and login page redesign |
| v0.3.2 | Jun 27, 2026 | Firebase Hosting target configured |
| v0.3.1 | Jun 27, 2026 | SEO meta tags and smooth scrolling |
| v0.3.0 | Jun 26, 2026 | TypeScript errors resolved |
| v0.2.0 | Jun 25, 2026 | README and project documentation |
| v0.1.0 | Jun 24, 2026 | Initial release |

Full release notes are available in [Changelogs](https://prep-iq.web.app/changelog) and [`src/config/changelog.ts`](src/config/changelog.ts)

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