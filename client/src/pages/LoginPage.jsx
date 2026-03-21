import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const { user } = useAuth();

  if (user) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to continue your preparation</p>
        <button
          type="button"
          className="google-btn"
          onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}
        >
          <FcGoogle size={20} /> Continue with Google
        </button>
      </div>
    </div>
  );
}