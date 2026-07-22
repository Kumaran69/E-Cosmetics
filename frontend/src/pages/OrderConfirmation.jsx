import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios'; // adjust path if your axios instance lives elsewhere

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/orders/${id}`);
        if (!cancelled) setOrder(data.order);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || 'Could not load this order');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrder();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="loader-wrap">
        <div className="loader-swatch" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container page-section empty-state">
        <h2>Couldn't find that order</h2>
        <p className="muted">{error || 'It may have been removed, or the link is incorrect.'}</p>
        <Link to="/dashboard" className="btn btn-primary">Go to your account</Link>
      </div>
    );
  }

  return (
    <div className="container page-section" style={{ maxWidth: 760, margin: '0 auto' }}>
      <div className="center scale-in" style={{ marginBottom: '2.5rem' }}>
        <span className="eyebrow"><span className="swatch-dot pulse" /> Order confirmed</span>
        <h1>Thank you, {order.shippingAddress.fullName.split(' ')[0]}!</h1>
        <p className="muted">
          Your order <strong>#{order._id.slice(-8).toUpperCase()}</strong> has been placed and is being prepared.
        </p>
        <span className={`status-pill status-${order.status}`} style={{ marginTop: '0.5rem', display: 'inline-block' }}>
          {order.status}
        </span>
      </div>

      <div className="form-card fade-slide-up" style={{ marginBottom: '1.5rem' }}>
        <h3>Items</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    {item.name}
                    {item.shade && <span className="muted" style={{ display: 'block', fontSize: '0.78rem' }}>Shade: {item.shade}</span>}
                  </td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
                  <td>₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="swatch-divider"><span><span className="swatch-dot" /><span className="swatch-dot" /><span className="swatch-dot" /></span></div>

        <div className="row">
          <span>Items total</span>
          <span>₹{order.itemsPrice}</span>
        </div>
        <div className="row muted" style={{ fontSize: '0.85rem' }}>
          <span>Shipping</span>
          <span>{order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice}`}</span>
        </div>
        <div className="row total">
          <span>Total paid</span>
          <span>₹{order.totalPrice}</span>
        </div>
      </div>

      <div className="dash-link-card fade-slide-up" style={{ marginBottom: '1.5rem' }}>
        <div className="icon">📦</div>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--ink)' }}>
            Shipping to
          </h4>
          <p className="muted" style={{ margin: '0.2rem 0 0', fontSize: '0.85rem' }}>
            {order.shippingAddress.fullName} · {order.shippingAddress.phone}<br />
            {order.shippingAddress.addressLine}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
        </div>
      </div>

      <div className="flex" style={{ gap: '1rem', justifyContent: 'center' }}>
        <Link to="/products" className="btn btn-outline">Continue shopping</Link>
        <Link to="/dashboard/orders" className="btn btn-primary">View my orders</Link>
      </div>
    </div>
  );
}