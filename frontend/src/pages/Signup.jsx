import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/GoogleAuthButton';

export default function Signup() {
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '' });
    try {
      await signup(form.name, form.email, form.password, form.phone);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setStatus({ loading: false, error: err.message });
    }
  };

  const handleGoogleSuccess = async (credential) => {
    const data = await googleLogin(credential);
    navigate(data.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
  };

  return (
    <div className="container page-section center">
      <div className="form-card" style={{ maxWidth: 440, margin: '0 auto', textAlign: 'left' }}>
        <span className="eyebrow"><span className="swatch-dot" /> Join us</span>
        <h1 style={{ fontSize: '1.8rem' }}>Create an account</h1>
        {status.error && <div className="form-error">{status.error}</div>}

        <GoogleAuthButton onSuccess={handleGoogleSuccess} />
        <div className="oauth-divider"><span>or sign up with email</span></div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone (optional)</label>
            <input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn btn-primary btn-block" disabled={status.loading}>
            {status.loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <p className="muted center" style={{ marginTop: '1.2rem', fontSize: '0.85rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--wine)', fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
