import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { JobApplicationProvider } from './context/JobApplicationContext';
import AppLayout from './components/AppLayout';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import React, { lazy, Suspense } from 'react';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const Analyze = lazy(() => import('./pages/Analyze'));
const Questions = lazy(() => import('./pages/Questions'));
const QuizLauncher = lazy(() => import('./pages/QuizLauncher'));
const Quiz = lazy(() => import('./pages/Quiz'));
const WeakSpots = lazy(() => import('./pages/WeakSpots'));
const StudyPlan = lazy(() => import('./pages/StudyPlan'));
const Profile = lazy(() => import('./pages/Profile'));
const ChangelogPage = lazy(() => import('./pages/Changelog'));
import { ThemeProvider } from './context/ThemeContext';

// Spinner shown while Firebase resolves auth state
function AuthSpinner() {
  return (
    <div className="fixed inset-0 bg-[#F8FAFC] dark:bg-slate-900 flex items-center justify-center z-50 transition-colors">
      <div className="w-6 h-6 rounded-full border-2 border-[#6366F1] border-t-transparent animate-spin" />
    </div>
  );
}

// Wait for Firebase to resolve auth state before making a routing decision.
// Without this guard, auth init (~300-800ms) causes a false redirect.
function AuthGate({ children, require: requireAuth }: { children: React.ReactNode; require: 'auth' | 'guest' }) {
  const { user, loading } = useAuth();
  if (loading) return <AuthSpinner />;
  if (requireAuth === 'auth') return user ? children : <Navigate to="/login" replace />;
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
            <Suspense fallback={<AuthSpinner />}>
              <Routes>
                <Route path="/" element={<AuthGate require="guest"><Landing /></AuthGate>} />
                <Route path="/login" element={<AuthGate require="guest"><Login /></AuthGate>} />
                <Route path="/changelog" element={<ChangelogPage />} />

                <Route
                  path="/dashboard"
                  element={
                    <AuthGate require="auth">
                      <JobApplicationProvider>
                        {/* Level 2 — catches layout/sidebar crashes without losing the whole app */}
                        <ErrorBoundary variant="page" label="Dashboard">
                          <AppLayout />
                        </ErrorBoundary>
                      </JobApplicationProvider>
                    </AuthGate>
                  }
                >
                  <Route index element={<DashboardHome />} />
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
            </Suspense>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
