import { useState } from 'react';
import api from '../api/axios';

const types = [
  { value: 'distributor', label: 'Distributor' },
  { value: 'retail_partner', label: 'Retail Partner' },
  { value: 'bulk_order', label: 'Bulk Order' },
  { value: 'career', label: 'Career' },
];

export default function Application() {
  const [form, setForm] = useState({
    type: 'distributor',
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    city: '',
    state: '',
    message: '',
  });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });
    try {
      const res = await api.post('/applications', form);
      setStatus({ loading: false, error: '', success: res.data.message });
      setForm({ ...form, fullName: '', email: '', phone: '', companyName: '', city: '', state: '', message: '' });
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: '' });
    }
  };

  return (
    <div className="container page-section">
      <span className="eyebrow"><span className="swatch-dot" /> Partner with us</span>
      <h1>Distributor &amp; Partner Application</h1>
      <p className="muted" style={{ maxWidth: '60ch', marginBottom: '2rem' }}>
        Interested in becoming a distributor, retail partner, placing a bulk order, or joining our
        team? Tell us a bit about yourself below.
      </p>

      <div className="form-card" style={{ maxWidth: 620 }}>
        {status.error && <div className="form-error">{status.error}</div>}
        {status.success && <div className="form-success">{status.success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="type">I'm applying as a</label>
            <select id="type" name="type" value={form.type} onChange={handleChange}>
              {types.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="fullName">Full name</label>
              <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
            </div>
            <div className="field">
              <label htmlFor="companyName">Company name (if any)</label>
              <input id="companyName" name="companyName" value={form.companyName} onChange={handleChange} />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="city">City</label>
              <input id="city" name="city" value={form.city} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="state">State</label>
              <input id="state" name="state" value={form.state} onChange={handleChange} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="message">Tell us more</label>
            <textarea id="message" name="message" value={form.message} onChange={handleChange} />
          </div>
          <button className="btn btn-primary btn-block" disabled={status.loading}>
            {status.loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
