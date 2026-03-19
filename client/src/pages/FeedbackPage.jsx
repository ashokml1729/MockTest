import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function FeedbackPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/feedback', { name, email, message });
      setSuccess(true);
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">💬 Feedback</h1>
        <p className="page-subtitle">We'd love to hear from you</p>
      </div>

      {success ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
          <h3 style={{ marginBottom: 8 }}>Thank you for your feedback!</h3>
          <p style={{ color: 'var(--text-secondary)' }}>We'll review it and get back to you if needed.</p>
          <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => setSuccess(false)}>
            Send Another
          </button>
        </div>
      ) : (
        <div className="feedback-form">
          <form onSubmit={handleSubmit}>
            {error && <div className="toast error" style={{ position: 'relative', top: 0, right: 0, marginBottom: 16 }}>{error}</div>}
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                className="form-input"
                rows={6}
                placeholder="Tell us what you think..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                style={{ resize: 'vertical' }}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
