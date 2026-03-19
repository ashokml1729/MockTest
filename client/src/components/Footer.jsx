import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/feedback">Feedback</Link>
          <Link to="/profile">Profile</Link>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} MockTest Platform. Built for exam preparation.</p>
      </div>
    </footer>
  );
}
