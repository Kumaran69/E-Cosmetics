import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });
    try {
      const res = await api.put(`/auth/reset-password/${token}`, { password });
      setStatus({ loading: false, error: '', success: res.data.message });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: '' });
    }
  };

  return (
    <div className="container page-section center">
      <div className="form-card" style={{ maxWidth: 440, margin: '0 auto', textAlign: 'left' }}>
        <span className="eyebrow"><span className="swatch-dot" /> Account recovery</span>
        <h1 style={{ fontSize: '1.8rem' }}>Reset your password</h1>
        {status.error && <div className="form-error">{status.error}</div>}
        {status.success && <div className="form-success">{status.success} Redirecting to log in...</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="password">New password</label>
            <input id="password" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary btn-block" disabled={status.loading}>
            {status.loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>
        <p className="muted center" style={{ marginTop: '1.2rem', fontSize: '0.85rem' }}>
          <Link to="/login" style={{ color: 'var(--wine)', fontWeight: 600 }}>Back to log in</Link>
        </p>
      </div>
    </div>
  );
}
