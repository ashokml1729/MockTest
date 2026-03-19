import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/user/history')
      .then(res => setHistory(res.data.history))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Test History</h1>
        <p className="page-subtitle">Your past test attempts</p>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No tests taken yet</h3>
          <p>Start taking mock tests to see your history here.</p>
          <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Tests</Link>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="history-table">
            <thead>
              <tr>
                <th>Exam</th>
                <th>Test</th>
                <th>Score</th>
                <th>Correct</th>
                <th>Time</th>
                <th>Rank</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {history.map(attempt => (
                <tr key={attempt.id}>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {attempt.mockTest?.exam?.icon} {attempt.mockTest?.exam?.name}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{attempt.mockTest?.title}</td>
                  <td>
                    <strong style={{ color: 'var(--accent)' }}>{attempt.score}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>/{attempt.mockTest?.totalMarks}</span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--success)' }}>{attempt.totalCorrect}</span>
                    {' / '}
                    <span style={{ color: 'var(--danger)' }}>{attempt.totalIncorrect}</span>
                    {' / '}
                    <span style={{ color: 'var(--warning)' }}>{attempt.totalSkipped}</span>
                  </td>
                  <td>{formatTime(attempt.timeTaken)}</td>
                  <td>#{attempt.rank}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(attempt.createdAt)}</td>
                  <td>
                    <Link to={`/test/${attempt.mockTestId}/results/${attempt.id}`} className="btn btn-outline btn-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
