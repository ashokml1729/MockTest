import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SolutionPage() {
  const { testId, attemptId } = useParams();
  const [solutions, setSolutions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/tests/${testId}/solutions/${attemptId}`)
      .then(res => setSolutions(res.data.solutions))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [testId, attemptId]);

  if (loading) return <LoadingSpinner />;

  const filtered = solutions.filter(s => {
    if (filter === 'correct') return s.isCorrect === true;
    if (filter === 'incorrect') return s.isCorrect === false;
    if (filter === 'skipped') return s.userAnswer === null;
    return true;
  });

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/dashboard">Dashboard</Link>
        <span className="breadcrumb-sep">›</span>
        <Link to={`/test/${testId}/results/${attemptId}`}>Results</Link>
        <span className="breadcrumb-sep">›</span>
        <span>Solutions</span>
      </div>

      <div className="page-header">
        <h1 className="page-title">Solutions</h1>
        <p className="page-subtitle">Review your answers and explanations</p>
      </div>

      <div className="category-tabs" style={{ marginBottom: 24 }}>
        {['all', 'correct', 'incorrect', 'skipped'].map(f => (
          <button
            key={f}
            className={`category-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && ` (${solutions.filter(s =>
              f === 'correct' ? s.isCorrect === true :
              f === 'incorrect' ? s.isCorrect === false :
              s.userAnswer === null
            ).length})`}
          </button>
        ))}
      </div>

      {filtered.map(q => (
        <div
          key={q.id}
          className={`solution-card ${q.isCorrect === true ? 'correct' : q.isCorrect === false ? 'incorrect' : 'skipped'}`}
        >
          <div className="question-header">
            <span className="question-number">Q{q.questionNumber}</span>
            <span className="question-topic">{q.topic}</span>
          </div>
          <div className="question-text" style={{ fontSize: '1rem', marginBottom: 16 }}>{q.questionText}</div>
          <div className="question-options" style={{ gap: 8 }}>
            {['A', 'B', 'C', 'D'].map(opt => {
              let cls = '';
              if (opt === q.correctOption) cls = 'correct';
              else if (opt === q.userAnswer && !q.isCorrect) cls = 'incorrect';
              return (
                <div key={opt} className={`option-item ${cls}`} style={{ cursor: 'default', padding: '12px 16px' }}>
                  <span className="option-letter">{opt}</span>
                  <span>{q[`option${opt}`]}</span>
                  {opt === q.correctOption && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--success)' }}>✓ Correct</span>}
                  {opt === q.userAnswer && opt !== q.correctOption && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--danger)' }}>✗ Your answer</span>}
                </div>
              );
            })}
          </div>
          {q.solutionText && (
            <div className="solution-text">
              <strong>Solution:</strong> {q.solutionText}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
