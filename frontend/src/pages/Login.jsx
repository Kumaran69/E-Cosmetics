import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/GoogleAuthButton';

export default function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '' });

  const redirectAfterLogin = (data) => {
    const redirectTo = location.state?.from || (data.role === 'admin' ? '/admin' : '/dashboard');
    navigate(redirectTo, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '' });
    try {
      const data = await login(form.email, form.password);
      redirectAfterLogin(data);
    } catch (err) {
      setStatus({ loading: false, error: err.message });
    }
  };

  const handleGoogleSuccess = async (credential) => {
    const data = await googleLogin(credential);
    redirectAfterLogin(data);
  };

  return (
    <div className="container page-section center">
      <div className="form-card" style={{ maxWidth: 440, margin: '0 auto', textAlign: 'left' }}>
        <span className="eyebrow"><span className="swatch-dot" /> Welcome back</span>
        <h1 style={{ fontSize: '1.8rem' }}>Log in</h1>
        {status.error && <div className="form-error">{status.error}</div>}

        <GoogleAuthButton onSuccess={handleGoogleSuccess} />
        <div className="oauth-divider"><span>or log in with email</span></div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="flex-between" style={{ marginBottom: '1.2rem' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.82rem', color: 'var(--rose)' }}>
              Forgot password?
            </Link>
          </div>
          <button className="btn btn-primary btn-block" disabled={status.loading}>
            {status.loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className="muted center" style={{ marginTop: '1.2rem', fontSize: '0.85rem' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--wine)', fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
