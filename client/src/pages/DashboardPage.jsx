import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DashboardPage() {
  const [exams, setExams] = useState(null);
  const [activeTab, setActiveTab] = useState('SSC');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/exams')
      .then(res => setExams(res.data.exams))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const categories = ['SSC', 'Railway', 'Banking'];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Exam Dashboard</h1>
        <p className="page-subtitle">Choose your exam category and start practicing</p>
      </div>

      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-tab ${activeTab === cat ? 'active' : ''}`}
            onClick={() => setActiveTab(cat)}
          >
            {cat === 'SSC' && '🏛️ '}{cat === 'Railway' && '🚂 '}{cat === 'Banking' && '🏦 '}
            {cat}
          </button>
        ))}
      </div>

      <div className="exam-grid">
        {exams && exams[activeTab]?.map(exam => (
          <Link to={`/exams/${exam.slug}`} key={exam.id} className="exam-card">
            <div className="exam-card-icon">{exam.icon}</div>
            <div className="exam-card-info">
              <h3>{exam.name}</h3>
              <p>{exam.description}</p>
            </div>
            <div className="exam-card-tests">levels: {exam.totalTests}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
