import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import ErrorBoundary from './components/ErrorBoundary';
import Landing from './pages/Landing';
import Login from './pages/Login';
import DashboardHome from './pages/DashboardHome';
import Analyze from './pages/Analyze';
import Questions from './pages/Questions';
import QuizLauncher from './pages/QuizLauncher';
import Quiz from './pages/Quiz';
import Weaknesses from './pages/Weaknesses';
import StudyPlan from './pages/StudyPlan';
import React from 'react';

// Component Route Guard
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
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
        }}
      />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Marketing Landing Root */}
            <Route path="/" element={<Landing />} />

            {/* Dedicated Authentication Access Node */}
            <Route path="/login" element={<Login />} />

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
                  <ErrorBoundary variant="section" label="JD Analyzer">
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
                path="weaknesses"
                element={
                  <ErrorBoundary variant="section" label="Weak Spots">
                    <Weaknesses />
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
            </Route>

            {/* Catch All Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
