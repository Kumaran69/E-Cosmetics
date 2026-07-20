import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((res) => setStats(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (!stats) return <p className="muted">Could not load dashboard stats.</p>;

  return (
    <div>
      <span className="eyebrow"><span className="swatch-dot" /> Overview</span>
      <h1 style={{ fontSize: '1.9rem' }}>Dashboard</h1>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="num">{stats.totalProducts}</div>
          <div className="label">Active Products</div>
        </div>
        <div className="stat-card">
          <div className="num">{stats.totalCustomers}</div>
          <div className="label">Customers</div>
        </div>
        <div className="stat-card">
          <div className="num">{stats.newEnquiries}</div>
          <div className="label">New Enquiries</div>
        </div>
        <div className="stat-card">
          <div className="num">{stats.pendingApplications}</div>
          <div className="label">Pending Applications</div>
        </div>
      </div>

      <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <div className="form-card">
          <h3>Low stock products</h3>
          {stats.lowStockProducts.length === 0 ? (
            <p className="muted">Nothing running low right now.</p>
          ) : (
            <ul style={{ paddingLeft: '1.1rem' }}>
              {stats.lowStockProducts.map((p) => (
                <li key={p._id} style={{ marginBottom: '0.4rem' }}>
                  {p.name} — <strong style={{ color: 'var(--wine)' }}>{p.stock} left</strong>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-card">
          <h3>Top rated products</h3>
          {stats.topRatedProducts.length === 0 ? (
            <p className="muted">No ratings yet.</p>
          ) : (
            <ul style={{ paddingLeft: '1.1rem' }}>
              {stats.topRatedProducts.map((p) => (
                <li key={p._id} style={{ marginBottom: '0.4rem' }}>
                  {p.name} — {p.ratingsAverage.toFixed(1)}★ ({p.ratingsCount})
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-card">
          <h3>Category breakdown</h3>
          <ul style={{ paddingLeft: '1.1rem' }}>
            {stats.categoryBreakdown.map((c) => (
              <li key={c._id} style={{ marginBottom: '0.4rem' }}>
                {c._id}: {c.count}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
