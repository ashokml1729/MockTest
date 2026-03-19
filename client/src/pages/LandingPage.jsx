import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Ace Your Government Exams</h1>
          <p>
            Practice with 660 mock tests across 33 CBTs covering SSC, Railway, and Banking exams.
            Track your progress, analyze performance, and climb the leaderboard.
          </p>
          <div className="hero-buttons">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
                <Link to="/dashboard" className="btn btn-secondary btn-lg">Explore Tests</Link>
              </>
            )}
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number">17</div>
              <div className="hero-stat-label">Exams</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">33</div>
              <div className="hero-stat-label">CBTs</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">660</div>
              <div className="hero-stat-label">Mock Tests</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">Free</div>
              <div className="hero-stat-label">First Test / CBT</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
