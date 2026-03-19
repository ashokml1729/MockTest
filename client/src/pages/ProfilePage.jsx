import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/user/profile')
      .then(res => {
        setProfile(res.data.profile);
        setUsername(res.data.profile.username);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/user/profile', { username });
      setProfile(prev => ({ ...prev, username }));
      setEditing(false);
      setMessage('Profile updated!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Your Profile</h1>
      </div>

      {message && <div className="toast success" style={{ position: 'relative', top: 0, right: 0, marginBottom: 16 }}>{message}</div>}

      <div className="profile-header">
        <div className="profile-avatar-large">
          {profile?.avatar ? (
            <img src={profile.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            profile?.username?.[0]?.toUpperCase()
          )}
        </div>
        <div className="profile-info">
          {editing ? (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ width: 200 }}
              />
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>Save</button>
              <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(false); setUsername(profile.username); }}>Cancel</button>
            </div>
          ) : (
            <>
              <h2>{profile?.username} <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)} style={{ marginLeft: 8 }}>Edit</button></h2>
            </>
          )}
          <p>{profile?.email}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Joined {new Date(profile?.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            {' · '}
            {profile?.authProvider === 'google' ? 'Google Account' : 'Email Account'}
          </p>
        </div>
      </div>

      <div className="profile-stats-grid">
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>{profile?.totalAttempts}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tests Taken</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>{profile?.avgScore}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Average Score</div>
        </div>
      </div>
    </div>
  );
}
