import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiClock, FiBookmark, FiChevronLeft, FiChevronRight, FiGrid } from 'react-icons/fi';
import api from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const questionStartRef = useRef(Date.now());
  const [questionTimes, setQuestionTimes] = useState({});

  useEffect(() => {
    api.get(`/tests/${testId}/start`)
      .then(res => {
        setTest(res.data.test);
        setQuestions(res.data.questions);
        setTimeLeft(res.data.test.duration * 60);
      })
      .catch(err => {
        if (err.response?.data?.requiresPayment) {
          setError('Payment required. Please purchase this test first.');
          setTimeout(() => navigate(-1), 2000);
        } else {
          setError(err.response?.data?.error || 'Failed to load test');
        }
      })
      .finally(() => setLoading(false));

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [testId]);

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timeLeft > 0]);

  const trackQuestionTime = useCallback(() => {
    if (!questions[currentQ]) return;
    const qId = questions[currentQ].id;
    const elapsed = Math.round((Date.now() - questionStartRef.current) / 1000);
    setQuestionTimes(prev => ({
      ...prev,
      [qId]: (prev[qId] || 0) + elapsed,
    }));
    questionStartRef.current = Date.now();
  }, [currentQ, questions]);

  const handleOptionSelect = (option) => {
    const qId = questions[currentQ].id;
    setAnswers(prev => ({
      ...prev,
      [qId]: { ...prev[qId], selectedOption: option },
    }));
  };

  const handleToggleReview = () => {
    const qId = questions[currentQ].id;
    setMarkedForReview(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleNavigate = (index) => {
    trackQuestionTime();
    setCurrentQ(index);
    questionStartRef.current = Date.now();
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit) setShowConfirm(false);
    setSubmitting(true);
    trackQuestionTime();

    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    const formattedAnswers = {};
    questions.forEach(q => {
      formattedAnswers[q.id] = {
        selectedOption: answers[q.id]?.selectedOption || null,
        isMarkedForReview: markedForReview.has(q.id),
        timeSpent: questionTimes[q.id] || 0,
      };
    });

    try {
      const res = await api.post(`/tests/${testId}/submit`, {
        answers: formattedAnswers,
        timeTaken,
      });
      navigate(`/test/${testId}/results/${res.data.result.attemptId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getQuestionStatus = (index) => {
    const q = questions[index];
    if (!q) return '';
    if (index === currentQ) return 'current';
    if (markedForReview.has(q.id)) return 'review';
    if (answers[q.id]?.selectedOption) return 'answered';
    return '';
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="page"><div className="empty-state"><h3>{error}</h3></div></div>;

  const currentQuestion = questions[currentQ];
  const answeredCount = Object.values(answers).filter(a => a?.selectedOption).length;
  const reviewCount = markedForReview.size;

  return (
    <>
      <div className="test-interface">
        {/* Top Bar */}
        <div className="test-topbar">
          <span className="test-topbar-title">{test?.title}</span>
          <div className={`test-timer ${timeLeft < 300 ? 'danger' : timeLeft < 600 ? 'warning' : ''}`}>
            <FiClock /> {formatTime(timeLeft)}
          </div>
          <button
            className="palette-toggle-btn"
            onClick={() => setShowPalette(prev => !prev)}
            title="Question Palette"
          >
            <FiGrid /> <span>{answeredCount}/{questions.length}</span>
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => setShowConfirm(true)}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Test'}
          </button>
        </div>

        {/* Main Question Area */}
        <div className="test-main">
          <div className="question-container">
            <div className="question-header">
              <span className="question-number">Question {currentQ + 1} of {questions.length}</span>
              {currentQuestion?.topic && (
                <span className="question-topic">{currentQuestion.topic}</span>
              )}
            </div>
            <div className="question-text">{currentQuestion?.questionText}</div>
            <div className="question-options">
              {['A', 'B', 'C', 'D'].map(opt => (
                <div
                  key={opt}
                  className={`option-item ${answers[currentQuestion?.id]?.selectedOption === opt ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(opt)}
                >
                  <span className="option-letter">{opt}</span>
                  <span>{currentQuestion?.[`option${opt}`]}</span>
                </div>
              ))}
            </div>

            <div className="question-nav">
              <button
                className="btn btn-secondary"
                disabled={currentQ === 0}
                onClick={() => handleNavigate(currentQ - 1)}
              >
                <FiChevronLeft /> Previous
              </button>
              <button
                className={`btn ${markedForReview.has(currentQuestion?.id) ? 'btn-primary' : 'btn-outline'}`}
                onClick={handleToggleReview}
              >
                <FiBookmark /> {markedForReview.has(currentQuestion?.id) ? 'Unmark Review' : 'Mark for Review'}
              </button>
              {currentQ < questions.length - 1 ? (
                <button
                  className="btn btn-primary"
                  onClick={() => handleNavigate(currentQ + 1)}
                >
                  Next <FiChevronRight />
                </button>
              ) : (
                <button
                  className="btn btn-danger"
                  onClick={() => setShowConfirm(true)}
                >
                  Finish Test
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Overlay backdrop for mobile palette */}
        {showPalette && <div className="palette-overlay" onClick={() => setShowPalette(false)} />}

        {/* Sidebar — Question Palette */}
        <div className={`test-sidebar ${showPalette ? 'palette-open' : ''}`}>
          <div>
            <div className="palette-title">
              Question Palette
              <button className="palette-close-btn" onClick={() => setShowPalette(false)}>✕</button>
            </div>
            <div className="palette-grid">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`palette-item ${getQuestionStatus(i)}`}
                  onClick={() => { handleNavigate(i); setShowPalette(false); }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="palette-legend">
            <div className="palette-legend-item">
              <div className="palette-legend-dot" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}></div>
              Not Visited
            </div>
            <div className="palette-legend-item">
              <div className="palette-legend-dot" style={{ background: 'var(--success)' }}></div>
              Answered ({answeredCount})
            </div>
            <div className="palette-legend-item">
              <div className="palette-legend-dot" style={{ background: 'var(--warning)' }}></div>
              Review ({reviewCount})
            </div>
          </div>

          <div style={{ marginTop: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>{answeredCount}</strong>/{questions.length} answered
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmDialog
          title="Submit Test?"
          message={`You have answered ${answeredCount} out of ${questions.length} questions. ${questions.length - answeredCount} questions are unanswered. Are you sure you want to submit?`}
          onConfirm={() => handleSubmit(false)}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
