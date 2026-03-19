import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function AnalyticsPage() {
  const [exams, setExams] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    api.get('/exams')
      .then(res => {
        setExams(res.data.exams);
        const allExams = [...(res.data.exams.SSC || []), ...(res.data.exams.Railway || []), ...(res.data.exams.Banking || [])];
        if (allExams.length > 0) {
          setSelectedExam(allExams[0].slug);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedExam) {
      setLoadingAnalytics(true);
      api.get(`/user/analytics/${selectedExam}`)
        .then(res => setAnalytics(res.data))
        .catch(console.error)
        .finally(() => setLoadingAnalytics(false));
    }
  }, [selectedExam]);

  if (loading) return <LoadingSpinner />;

  const allExams = [...(exams?.SSC || []), ...(exams?.Railway || []), ...(exams?.Banking || [])];

  const scoreChartData = analytics?.attempts ? {
    labels: analytics.attempts.map((_, i) => `Test ${i + 1}`),
    datasets: [{
      label: 'Score',
      data: analytics.attempts.map(a => a.score),
      backgroundColor: 'rgba(34, 211, 238, 0.6)',
      borderColor: 'rgba(34, 211, 238, 1)',
      borderWidth: 1,
      borderRadius: 6,
    }],
  } : null;

  const topicData = analytics?.topicPerformance ? {
    labels: Object.keys(analytics.topicPerformance),
    datasets: [{
      data: Object.values(analytics.topicPerformance).map(t => t.correct),
      backgroundColor: ['#22d3ee', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb923c'],
      borderWidth: 0,
    }],
  } : null;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📊 Performance Analytics</h1>
        <p className="page-subtitle">Track your progress across exams</p>
      </div>

      <div className="form-group">
        <label>Select Exam</label>
        <select
          className="form-input"
          value={selectedExam || ''}
          onChange={e => setSelectedExam(e.target.value)}
        >
          {allExams.map(exam => (
            <option key={exam.slug} value={exam.slug}>{exam.name}</option>
          ))}
        </select>
      </div>

      {loadingAnalytics ? <LoadingSpinner /> : analytics?.totalAttempts === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3>No data yet</h3>
          <p>Take some tests for this exam to see analytics.</p>
        </div>
      ) : analytics && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginTop: 24 }}>
            {scoreChartData && (
              <div className="chart-container">
                <h3 style={{ marginBottom: 16, fontSize: '1rem', fontWeight: 700 }}>Score Trend</h3>
                <Bar data={scoreChartData} options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { grid: { display: false } },
                  },
                }} />
              </div>
            )}

            {topicData && (
              <div className="chart-container">
                <h3 style={{ marginBottom: 16, fontSize: '1rem', fontWeight: 700 }}>Topic-wise Correct Answers</h3>
                <Doughnut data={topicData} options={{
                  responsive: true,
                  plugins: { legend: { position: 'bottom', labels: { padding: 16 } } },
                }} />
              </div>
            )}
          </div>

          {analytics.topicPerformance && (
            <div className="card" style={{ marginTop: 20 }}>
              <h3 style={{ marginBottom: 16, fontSize: '1rem', fontWeight: 700 }}>Topic Breakdown</h3>
              <table className="history-table">
                <thead>
                  <tr><th>Topic</th><th>Correct</th><th>Incorrect</th><th>Skipped</th><th>Accuracy</th></tr>
                </thead>
                <tbody>
                  {Object.entries(analytics.topicPerformance).map(([topic, data]) => (
                    <tr key={topic}>
                      <td style={{ fontWeight: 600 }}>{topic}</td>
                      <td style={{ color: 'var(--success)' }}>{data.correct}</td>
                      <td style={{ color: 'var(--danger)' }}>{data.incorrect}</td>
                      <td style={{ color: 'var(--warning)' }}>{data.skipped}</td>
                      <td style={{ fontWeight: 700, color: 'var(--accent)' }}>
                        {data.total > 0 ? ((data.correct / data.total) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
