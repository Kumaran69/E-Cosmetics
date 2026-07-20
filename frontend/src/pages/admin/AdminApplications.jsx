import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const statuses = ['pending', 'reviewing', 'approved', 'rejected'];
const types = [
  { value: '', label: 'All types' },
  { value: 'distributor', label: 'Distributor' },
  { value: 'retail_partner', label: 'Retail Partner' },
  { value: 'bulk_order', label: 'Bulk Order' },
  { value: 'career', label: 'Career' },
];

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get('/applications', { params: type ? { type } : {} })
      .then((res) => setApplications(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [type]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}`, { status });
      toast.success('Application updated');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await api.delete(`/applications/${id}`);
      toast.success('Application deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <span className="eyebrow"><span className="swatch-dot" /> Partnerships</span>
          <h1 style={{ fontSize: '1.9rem' }}>Applications</h1>
        </div>
        <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: '0.6rem 0.9rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)' }}>
          {types.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : applications.length === 0 ? (
        <div className="empty-state">No applications found.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Type</th><th>Contact</th><th>Company</th><th>Location</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr key={a._id}>
                  <td>{a.fullName}</td>
                  <td style={{ textTransform: 'capitalize' }}>{a.type.replace('_', ' ')}</td>
                  <td>{a.email}<br /><span className="muted" style={{ fontSize: '0.78rem' }}>{a.phone}</span></td>
                  <td>{a.companyName || '—'}</td>
                  <td>{[a.city, a.state].filter(Boolean).join(', ') || '—'}</td>
                  <td>
                    <select
                      value={a.status}
                      onChange={(ev) => updateStatus(a._id, ev.target.value)}
                      className={`status-pill status-${a.status}`}
                      style={{ border: 'none' }}
                    >
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <button className="btn-ghost btn-sm" style={{ color: '#a33' }} onClick={() => handleDelete(a._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
