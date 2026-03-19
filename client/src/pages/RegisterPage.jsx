import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', { email, username });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const otpString = otp.join('');
      const res = await api.post('/auth/verify-otp', { email, otp: otpString });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="subtitle">{step === 1 ? 'Start your exam preparation journey' : 'Verify your email'}</p>

        {error && <div className="toast error" style={{ position: 'relative', top: 0, right: 0, marginBottom: 16 }}>{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="Choose a username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            <div className="auth-divider">or</div>

            <button type="button" className="google-btn" onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}>
              <FcGoogle size={20} /> Continue with Google
            </button>

            <p className="auth-link">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 8 }}>
              We sent a 6-digit OTP to <strong>{email}</strong>
            </p>
            <div className="otp-inputs">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOTPChange(i, e.target.value)}
                  onKeyDown={e => handleOTPKeyDown(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>
            <p className="auth-link">
              <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'var(--font-family)' }}>
                ← Back to email
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
