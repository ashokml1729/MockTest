import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ResultPage() {
  const { testId, attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/tests/${testId}/results/${attemptId}`)
      .then(res => setResult(res.data.result))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [testId, attemptId]);

  if (loading) return <LoadingSpinner />;
  if (!result) return <div className="page"><div className="empty-state"><h3>Result not found</h3></div></div>;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="page">
      <div className="result-hero">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 16 }}>
          {result.mockTest?.title}
        </h2>
        <div className="result-score">{result.score}</div>
        <div className="result-max-score">out of {result.mockTest?.totalMarks}</div>

        <div className="result-stats">
          <div className="result-stat-card correct">
            <div className="result-stat-number">{result.totalCorrect}</div>
            <div className="result-stat-label">Correct</div>
          </div>
          <div className="result-stat-card incorrect">
            <div className="result-stat-number">{result.totalIncorrect}</div>
            <div className="result-stat-label">Incorrect</div>
          </div>
          <div className="result-stat-card skipped">
            <div className="result-stat-number">{result.totalSkipped}</div>
            <div className="result-stat-label">Skipped</div>
          </div>
          <div className="result-stat-card rank">
            <div className="result-stat-number">#{result.rank}</div>
            <div className="result-stat-label">Rank (of {result.totalAttempts})</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to={`/test/${testId}/solutions/${attemptId}`} className="btn btn-primary">View Solutions</Link>
        <Link to={`/test/${testId}/leaderboard`} className="btn btn-secondary">Leaderboard</Link>
        <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      <div style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        Time taken: {formatTime(result.timeTaken)}
      </div>
    </div>
  );
}
