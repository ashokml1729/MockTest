import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSun, FiMoon, FiUser, FiLogOut, FiBarChart2, FiClock, FiMessageSquare } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-brand-icon">📝</span>
        MockTest
      </Link>

      <div className="navbar-links">
        {user && (
          <>
            <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
            <Link to="/history" className={isActive('/history')}>History</Link>
          </>
        )}
        {!user && (
          <Link to="/dashboard" className={isActive('/dashboard')}>Explore</Link>
        )}

        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>

        {user ? (
          <div className="user-menu" ref={dropdownRef}>
            <div
              className="user-avatar"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {user.avatar ? (
                <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                user.username?.[0]?.toUpperCase() || 'U'
              )}
            </div>
            {dropdownOpen && (
              <div className="user-dropdown">
                <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.username}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                </div>
                <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                  <FiUser /> Profile
                </Link>
                <Link to="/history" onClick={() => setDropdownOpen(false)}>
                  <FiClock /> History
                </Link>
                <Link to="/analytics" onClick={() => setDropdownOpen(false)}>
                  <FiBarChart2 /> Analytics
                </Link>
                <Link to="/feedback" onClick={() => setDropdownOpen(false)}>
                  <FiMessageSquare /> Feedback
                </Link>
                <button className="danger" onClick={() => { logout(); setDropdownOpen(false); }}>
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className={`btn btn-outline btn-sm ${isActive('/login')}`}>Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
