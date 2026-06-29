import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';
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
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="analyze" element={<Analyze />} />
            <Route path="questions" element={<Questions />} />
            <Route path="quiz" element={<QuizLauncher />} />
            <Route path="quiz-session" element={<Quiz />} />
            <Route path="weaknesses" element={<Weaknesses />} />
            <Route path="study-plan" element={<StudyPlan />} />
          </Route>

          {/* Catch All Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;