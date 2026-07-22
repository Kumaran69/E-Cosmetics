import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios'; // adjust path if your axios instance lives elsewhere

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/orders/my');
        if (!cancelled) setOrders(data.orders);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || 'Could not load your orders');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrders();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="loader-wrap">
        <div className="loader-swatch" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page-section empty-state">
        <h2>Couldn't load your orders</h2>
        <p className="muted">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container page-section empty-state">
        <h2>No orders yet</h2>
        <p className="muted">Once you place an order, it'll show up here.</p>
        <Link to="/products" className="btn btn-primary">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="container page-section">
      <span className="eyebrow"><span className="swatch-dot" /> Your account</span>
      <h1>My Orders</h1>

      <div className="stack">
        {orders.map((order) => (
          <Link
            to={`/order-confirmation/${order._id}`}
            key={order._id}
            className="dash-link-card fade-slide-up"
            style={{ textDecoration: 'none' }}
          >
            <div className="icon">📦</div>
            <div style={{ flex: 1 }}>
              <div className="flex-between">
                <h4 style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--ink)' }}>
                  Order #{order._id.slice(-8).toUpperCase()}
                </h4>
                <span className={`status-pill status-${order.status}`}>{order.status}</span>
              </div>
              <p className="muted" style={{ margin: '0.3rem 0 0', fontSize: '0.82rem' }}>
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
                {' · '}
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                {' · '}
                <strong style={{ color: 'var(--wine)' }}>₹{order.totalPrice}</strong>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}