import { useState } from 'react';
import api from '../api/axios';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });
    try {
      const res = await api.post('/enquiries', form);
      setStatus({ loading: false, error: '', success: res.data.message });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: '' });
    }
  };

  return (
    <div className="container page-section">
      <span className="eyebrow"><span className="swatch-dot" /> Get in touch</span>
      <h1>Contact Us</h1>
      <p className="muted" style={{ maxWidth: '60ch', marginBottom: '2rem' }}>
        Questions about a product, an order, or anything else? Send us a note and our team will
        get back to you within 1-2 business days.
      </p>

      <div className="form-card" style={{ maxWidth: 560 }}>
        {status.error && <div className="form-error">{status.error}</div>}
        {status.success && <div className="form-success">{status.success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="phone">Phone (optional)</label>
            <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="subject">Subject</label>
            <input id="subject" name="subject" value={form.subject} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" value={form.message} onChange={handleChange} required />
          </div>
          <button className="btn btn-primary btn-block" disabled={status.loading}>
            {status.loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
