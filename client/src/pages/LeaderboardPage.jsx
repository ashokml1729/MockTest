import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LeaderboardPage() {
  const { testId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/tests/${testId}/leaderboard`)
      .then(res => setLeaderboard(res.data.leaderboard))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [testId]);

  if (loading) return <LoadingSpinner />;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🏆 Leaderboard</h1>
        <p className="page-subtitle">Top performers on this mock test</p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏆</div>
          <h3>No attempts yet</h3>
          <p>Be the first to take this test!</p>
        </div>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Score</th>
              <th>Correct</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map(entry => (
              <tr key={entry.rank} className={entry.isCurrentUser ? 'current-user' : ''}>
                <td>
                  <span className={`rank-badge ${entry.rank === 1 ? 'gold' : entry.rank === 2 ? 'silver' : entry.rank === 3 ? 'bronze' : ''}`}>
                    {entry.rank}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="user-avatar" style={{ width: 28, height: 28, fontSize: '0.7rem' }}>
                      {entry.username?.[0]?.toUpperCase()}
                    </div>
                    {entry.username} {entry.isCurrentUser && <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>(You)</span>}
                  </div>
                </td>
                <td style={{ fontWeight: 700 }}>{entry.score}</td>
                <td>{entry.totalCorrect}</td>
                <td>{formatTime(entry.timeTaken)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>
    </div>
  );
}
