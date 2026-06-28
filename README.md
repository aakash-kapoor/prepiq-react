# ⚡ PrepIQ

**Next-Gen AI Technical Interview Prep Platform**

PrepIQ reverse-engineers job descriptions using Gemini AI to isolate your precision knowledge gaps, simulate adaptive flashcard drills, and compile automated day-by-day study timelines — so you walk into every interview fully prepared.

---

## ✨ Features

- **AI-Powered Job Description Analysis** — Paste any job description and Gemini AI extracts the exact skills and concepts you need to master.
- **Precision Knowledge Gap Detection** — Pinpoints what you don't know, not just what the job requires.
- **Adaptive Flashcard Drills** — Interactive study cards that adapt to your weak areas for smarter repetition.
- **Automated Study Timelines** — Generates a day-by-day prep schedule tailored to your target role and available time.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite 8 |
| Routing | React Router DOM 7 |
| Styling | Tailwind CSS 3 |
| Backend / Auth / DB | Firebase 12 |
| AI | Google Gemini AI |
| Linting | Oxlint |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Firebase project
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

Create a `.env` file in the root directory and add the following variables:

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
# Start the development server
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
│   ├── assets/                  # Static images and icons
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   └── AppLayout.tsx        # Shared layout wrapper
│   ├── config/
│   │   ├── firebase.ts          # Firebase initialization
│   │   └── smokeTest.ts         # Firebase connection test
│   ├── context/
│   │   └── AuthContext.tsx      # Auth state and provider
│   ├── hooks/
│   │   └── useGemini.ts         # Gemini AI integration hook
│   ├── pages/
│   │   ├── Landing.tsx          # Marketing / home page
│   │   ├── Login.tsx            # Authentication page
│   │   ├── DashboardHome.tsx    # User dashboard
│   │   ├── Analyze.tsx          # Job description analysis
│   │   ├── Questions.tsx        # Generated interview questions
│   │   ├── Quiz.tsx             # Adaptive flashcard drills
│   │   ├── StudyPlan.tsx        # Day-by-day study timeline
│   │   └── Weaknesses.tsx       # Knowledge gap summary
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx                 # App entry point
│   └── index.css
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 📄 License

This project is private. All rights reserved.

---

> Built with ❤️ by [Aakash Kapoor](https://github.com/aakash-kapoor)