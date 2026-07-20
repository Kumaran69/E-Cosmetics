import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });
  const [pwStatus, setPwStatus] = useState({ loading: false, error: '', success: '' });

  const saveProfile = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });
    try {
      const res = await api.put('/auth/profile', form);
      updateUser(res.data.data);
      setStatus({ loading: false, error: '', success: 'Profile updated successfully' });
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: '' });
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwStatus({ loading: true, error: '', success: '' });
    try {
      await api.put('/auth/change-password', pwForm);
      setPwStatus({ loading: false, error: '', success: 'Password updated successfully' });
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPwStatus({ loading: false, error: err.message, success: '' });
    }
  };

  return (
    <div className="container page-section">
      <span className="eyebrow"><span className="swatch-dot" /> Account</span>
      <h1>My Profile</h1>

      <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', alignItems: 'start' }}>
        <div className="form-card">
          <h3>Personal details</h3>
          {status.error && <div className="form-error">{status.error}</div>}
          {status.success && <div className="form-success">{status.success}</div>}
          <form onSubmit={saveProfile}>
            <div className="field">
              <label>Email</label>
              <input value={user?.email || ''} disabled />
            </div>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <button className="btn btn-primary" disabled={status.loading}>
              {status.loading ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>

        <div className="form-card">
          <h3>Change password</h3>
          {pwStatus.error && <div className="form-error">{pwStatus.error}</div>}
          {pwStatus.success && <div className="form-success">{pwStatus.success}</div>}
          <form onSubmit={changePassword}>
            <div className="field">
              <label htmlFor="currentPassword">Current password</label>
              <input
                id="currentPassword"
                type="password"
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="newPassword">New password</label>
              <input
                id="newPassword"
                type="password"
                minLength={6}
                value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                required
              />
            </div>
            <button className="btn btn-primary" disabled={pwStatus.loading}>
              {pwStatus.loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
