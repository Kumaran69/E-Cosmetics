import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const statuses = ['new', 'in_progress', 'resolved'];

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get('/enquiries', { params: filter ? { status: filter } : {} })
      .then((res) => setEnquiries(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/enquiries/${id}`, { status });
      toast.success('Enquiry updated');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await api.delete(`/enquiries/${id}`);
      toast.success('Enquiry deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <span className="eyebrow"><span className="swatch-dot" /> Support inbox</span>
          <h1 style={{ fontSize: '1.9rem' }}>Enquiries</h1>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '0.6rem 0.9rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)' }}>
          <option value="">All statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : enquiries.length === 0 ? (
        <div className="empty-state">No enquiries found.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Contact</th><th>Subject</th><th>Message</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e._id}>
                  <td>{e.name}</td>
                  <td>{e.email}<br /><span className="muted" style={{ fontSize: '0.78rem' }}>{e.phone}</span></td>
                  <td>{e.subject}</td>
                  <td style={{ maxWidth: 260 }}>{e.message}</td>
                  <td>
                    <select
                      value={e.status}
                      onChange={(ev) => updateStatus(e._id, ev.target.value)}
                      className={`status-pill status-${e.status}`}
                      style={{ border: 'none' }}
                    >
                      {statuses.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                  </td>
                  <td>
                    <button className="btn-ghost btn-sm" style={{ color: '#a33' }} onClick={() => handleDelete(e._id)}>Delete</button>
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
