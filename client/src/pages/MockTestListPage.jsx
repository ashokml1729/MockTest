import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiClock, FiHelpCircle, FiAward, FiLock, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import loadRazorpay from '../utils/loadRazorpay';

export default function MockTestListPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCbt, setExpandedCbt] = useState(null);
  const [payingTestId, setPayingTestId] = useState(null);

  useEffect(() => {
    api.get(`/exams/${slug}`)
      .then(res => {
        setExam(res.data.exam);
        if (res.data.exam.cbts?.length > 0) {
          setExpandedCbt(res.data.exam.cbts[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner />;
  if (!exam) return <div className="page"><div className="empty-state"><h3>Exam not found</h3></div></div>;

  const handlePayAndStart = async (test) => {
    if (!user) { navigate('/login'); return; }

    setPayingTestId(test.id);

    const loaded = await loadRazorpay();
    if (!loaded) {
      alert('Failed to load Razorpay. Check your internet connection.');
      setPayingTestId(null);
      return;
    }

    try {
      const { data } = await api.post('/payment/create-order', {
        mockTestId: test.id,
      });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'MockTest Platform',
        description: test.title,
        handler: async function (response) {
          try {
            const { data: verifyData } = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyData.testUnlocked) {
              navigate(`/test/${test.id}`);
            }
          } catch (err) {
            alert('Payment verification failed. Please contact support.');
          }
        },
        theme: { color: '#6366f1' },
        modal: {
          ondismiss: () => setPayingTestId(null),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        alert(`Payment failed: ${response.error.description}`);
        setPayingTestId(null);
      });
      rzp.open();

    } catch (err) {
      const errMsg = err.response?.data?.error;
      if (errMsg === 'Already purchased') {
        navigate(`/test/${test.id}`);
      } else {
        alert(errMsg || 'Could not initiate payment. Try again.');
        setPayingTestId(null);
      }
    }
  };

  const handleStartTest = (test) => {
    if (!user) { navigate('/login'); return; }

    if (test.isFree || test.isPurchased) {
      navigate(`/test/${test.id}`);
    } else {
      handlePayAndStart(test);
    }
  };

  const toggleCbt = (cbtId) => {
    setExpandedCbt(expandedCbt === cbtId ? null : cbtId);
  };

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/dashboard">Dashboard</Link>
        <span className="breadcrumb-sep">›</span>
        <span>{exam.category}</span>
        <span className="breadcrumb-sep">›</span>
        <span>{exam.name}</span>
      </div>

      <div className="page-header">
        <h1 className="page-title">{exam.icon} {exam.name}</h1>
        <p className="page-subtitle">{exam.description} — {exam.cbts?.length || 0} CBT(s) Available</p>
      </div>

      {exam.cbts?.map(cbt => (
        <div key={cbt.id} className="cbt-section">
          <div className="cbt-header" onClick={() => toggleCbt(cbt.id)}>
            <div className="cbt-header-info">
              <h2 className="cbt-title">{cbt.name}</h2>
              <div className="cbt-meta">
                <span><FiClock /> {cbt.duration} min</span>
                <span><FiHelpCircle /> {cbt.totalQuestions} Qs</span>
                <span><FiAward /> {cbt.totalMarks} marks</span>
                <span>📄 {cbt.mockTests?.length || 0} Tests</span>
              </div>
            </div>
            <span className="cbt-toggle">
              {expandedCbt === cbt.id ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
            </span>
          </div>

          {expandedCbt === cbt.id && (
            <>
              <div className="cbt-subjects">
                <table className="subject-table">
                  <thead>
                    <tr><th>Subject</th><th>Questions</th><th>Marks</th></tr>
                  </thead>
                  <tbody>
                    {cbt.subjects?.map((subj, i) => (
                      <tr key={i}>
                        <td>{subj.name}</td>
                        <td>{subj.questions}</td>
                        <td>{subj.marks}</td>
                      </tr>
                    ))}
                    <tr className="subject-total">
                      <td><strong>Total</strong></td>
                      <td><strong>{cbt.totalQuestions}</strong></td>
                      <td><strong>{cbt.totalMarks}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="test-grid">
                {cbt.mockTests?.map(test => (
                  <div key={test.id} className="test-card">
                    <div className="test-card-header">
                      <span className="test-card-title">{test.title}</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {test.isAttempted && <span className="test-badge attempted">Attempted</span>}
                        <span className={`test-badge ${test.isFree ? 'free' : 'paid'}`}>
                          {test.isFree ? 'Free' : '₹10'}
                        </span>
                      </div>
                    </div>
                    <div className="test-card-meta">
                      <span><FiClock /> {test.duration} min</span>
                      <span><FiHelpCircle /> {test.totalQuestions} Qs</span>
                      <span><FiAward /> {test.totalMarks} marks</span>
                    </div>
                    <div className="test-card-actions">
                      {/* ✅ updated button */}
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleStartTest(test)}
                        disabled={payingTestId === test.id}
                      >
                        {payingTestId === test.id
                          ? 'Processing...'
                          : test.isFree || test.isPurchased
                          ? 'Start Test'
                          : <><FiLock /> Unlock & Start</>
                        }
                      </button>
                      {test.isAttempted && (
                        <Link to={`/test/${test.id}/leaderboard`} className="btn btn-secondary btn-sm">
                          Leaderboard
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}