import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import Landing from './pages/Landing';
import Login from './pages/Login';
import DashboardHome from './pages/DashboardHome';
import Analyze from './pages/Analyze';
import Questions from './pages/Questions';
import QuizLauncher from './pages/QuizLauncher';
import Quiz from './pages/Quiz';
import WeakSpots from './pages/WeakSpots';
import StudyPlan from './pages/StudyPlan';
import Profile from './pages/Profile';
import ChangelogPage from './pages/Changelog';
import React from 'react';
import { ThemeProvider } from './context/ThemeContext';

// Spinner shown while Firebase resolves auth state
function AuthSpinner() {
  return (
    <div className="fixed inset-0 bg-[#F8FAFC] dark:bg-slate-900 flex items-center justify-center z-50 transition-colors">
      <div className="w-6 h-6 rounded-full border-2 border-[#6366F1] border-t-transparent animate-spin" />
    </div>
  );
}

// Redirects unauthenticated users to /login
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  // Wait for Firebase to resolve auth state before making a routing decision.
  // Without this guard, auth init (~300-800ms) causes a false redirect to /login.
  if (loading) return <AuthSpinner />;

  return user ? children : <Navigate to="/login" replace />;
}

// Redirects already-authenticated users to /dashboard
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <AuthSpinner />;

  return user ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  return (
    // Level 1 — catches anything that escapes all inner boundaries
    <ErrorBoundary variant="page">
      <Toaster
        position="top-center"
        gutter={8}
        containerStyle={{ top: 16, left: 16, right: 16 }}
        toastOptions={{
          style: { maxWidth: '420px' },
          error: {
            style: {
              background: '#FEF2F2',
              color: '#B91C1C',
              border: '1px solid #FECACA',
            },
          },
        }}
      />
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Public Marketing Landing Root — redirects to dashboard if already logged in */}
              <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />

              {/* Dedicated Authentication Access Node — same redirect behaviour */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

              {/* Public Changelog Page — accessible whether logged in or out */}
              <Route path="/changelog" element={<ChangelogPage />} />

              {/* Secure Protected Dashboard App Scope */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    {/* Level 2 — catches layout/sidebar crashes without losing the whole app */}
                    <ErrorBoundary variant="page" label="Dashboard">
                      <AppLayout />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardHome />} />

                {/* Level 3 — per-route section boundaries for Gemini-heavy pages */}
                <Route
                  path="analyze"
                  element={
                    <ErrorBoundary variant="section" label="Analyze">
                      <Analyze />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="questions"
                  element={
                    <ErrorBoundary variant="section" label="Question Bank">
                      <Questions />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="quiz"
                  element={
                    <ErrorBoundary variant="section" label="Quiz Launcher">
                      <QuizLauncher />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="quiz-session"
                  element={
                    <ErrorBoundary variant="section" label="Quiz">
                      <Quiz />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="weak-spots"
                  element={
                    <ErrorBoundary variant="section" label="Weak Spots">
                      <WeakSpots />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="study-plan"
                  element={
                    <ErrorBoundary variant="section" label="Study Plan">
                      <StudyPlan />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <ErrorBoundary variant="section" label="Profile">
                      <Profile />
                    </ErrorBoundary>
                  }
                />
              </Route>

              {/* Catch All Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
