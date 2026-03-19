import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import DashboardPage from './pages/DashboardPage';
import MockTestListPage from './pages/MockTestListPage';
import TestPage from './pages/TestPage';
import ResultPage from './pages/ResultPage';
import SolutionPage from './pages/SolutionPage';
import LeaderboardPage from './pages/LeaderboardPage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import FeedbackPage from './pages/FeedbackPage';

function AppContent() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/exams/:slug" element={<MockTestListPage />} />
        <Route path="/test/:testId" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
        <Route path="/test/:testId/results/:attemptId" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
        <Route path="/test/:testId/solutions/:attemptId" element={<ProtectedRoute><SolutionPage /></ProtectedRoute>} />
        <Route path="/test/:testId/leaderboard" element={<LeaderboardPage />} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
