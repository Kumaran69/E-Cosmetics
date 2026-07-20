import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import Loader from '../../components/Loader';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get('/admin/customers')
      .then((res) => setCustomers(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleStatus = async (id) => {
    try {
      await api.put(`/admin/customers/${id}/status`);
      toast.success('Customer status updated');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <span className="eyebrow"><span className="swatch-dot" /> Community</span>
      <h1 style={{ fontSize: '1.9rem' }}>Customers</h1>

      {loading ? (
        <Loader />
      ) : customers.length === 0 ? (
        <div className="empty-state">No customers yet.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone || '—'}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-pill status-${c.isActive ? 'resolved' : 'rejected'}`}>
                      {c.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-ghost btn-sm" onClick={() => toggleStatus(c._id)}>
                      {c.isActive ? 'Deactivate' : 'Reactivate'}
                    </button>
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
