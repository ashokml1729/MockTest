import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('mocktest_token', token);
      api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          login(token, res.data.user);
          navigate('/dashboard');
        })
        .catch(() => navigate('/login'));
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div className="spinner-container" style={{ minHeight: '80vh' }}>
      <div className="spinner"></div>
    </div>
  );
}
