import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setStatus({ loading: false, error: '', success: res.data.message });
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: '' });
    }
  };

  return (
    <div className="container page-section center">
      <div className="form-card" style={{ maxWidth: 440, margin: '0 auto', textAlign: 'left' }}>
        <span className="eyebrow"><span className="swatch-dot" /> Account recovery</span>
        <h1 style={{ fontSize: '1.8rem' }}>Forgot password</h1>
        <p className="muted" style={{ fontSize: '0.88rem' }}>
          Enter your account email and we'll send a link to reset your password.
        </p>
        {status.error && <div className="form-error">{status.error}</div>}
        {status.success && <div className="form-success">{status.success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button className="btn btn-primary btn-block" disabled={status.loading}>
            {status.loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
        <p className="muted center" style={{ marginTop: '1.2rem', fontSize: '0.85rem' }}>
          <Link to="/login" style={{ color: 'var(--wine)', fontWeight: 600 }}>Back to log in</Link>
        </p>
      </div>
    </div>
  );
}
