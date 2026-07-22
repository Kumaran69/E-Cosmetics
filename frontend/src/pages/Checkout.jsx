import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import axios from '../api/axios'; // adjust path if your axios instance lives elsewhere

const emptyAddress = {
  fullName: '',
  phone: '',
  addressLine: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
};

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const shippingPrice = subtotal > 999 ? 0 : 49;
  const total = subtotal + shippingPrice;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container page-section empty-state">
        <h2>Nothing to check out</h2>
        <p className="muted">Your cart is empty — add something first.</p>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>
          Browse products
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const items = cart.items.map((item) => ({
        product: item.product?._id || item._id,
        name: item.name,
        image: item.image,
        shade: item.shade,
        price: item.price,
        quantity: item.quantity,
      }));

      const { data } = await axios.post('/orders', {
        items,
        shippingAddress: address,
        paymentMethod,
      });

      // Clear the cart if your CartContext exposes this — safe no-op if it doesn't.
      if (typeof clearCart === 'function') {
        await clearCart();
      }

      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${data.order._id}`, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Could not place order';
      setError(message);
      toast.error(message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container page-section">
      <span className="eyebrow"><span className="swatch-dot" /> Almost there</span>
      <h1>Checkout</h1>
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handlePlaceOrder}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
          {/* Shipping details */}
          <div className="form-card">
            <h3>Shipping details</h3>

            <div className="field-row">
              <div className="field">
                <label htmlFor="fullName">Full name</label>
                <input id="fullName" name="fullName" value={address.fullName} onChange={handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" value={address.phone} onChange={handleChange} required />
              </div>
            </div>

            <div className="field">
              <label htmlFor="addressLine">Address</label>
              <input id="addressLine" name="addressLine" value={address.addressLine} onChange={handleChange} required />
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="city">City</label>
                <input id="city" name="city" value={address.city} onChange={handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="state">State</label>
                <input id="state" name="state" value={address.state} onChange={handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="postalCode">Postal code</label>
                <input id="postalCode" name="postalCode" value={address.postalCode} onChange={handleChange} required />
              </div>
            </div>

            <div className="field">
              <label htmlFor="country">Country</label>
              <input id="country" name="country" value={address.country} onChange={handleChange} required />
            </div>

            <div className="swatch-divider"><span><span className="swatch-dot" /><span className="swatch-dot" /><span className="swatch-dot" /></span></div>

            <h3>Payment method</h3>
            <div className="chip-row">
              {[
                { value: 'cod', label: 'Cash on delivery' },
                { value: 'upi', label: 'UPI' },
                { value: 'card', label: 'Card' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  className={`chip ${paymentMethod === opt.value ? 'active' : ''}`}
                  onClick={() => setPaymentMethod(opt.value)}
                >
                  <span className="swatch-dot" /> {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            {cart.items.map((item) => (
              <div className="row" key={item._id}>
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="row muted" style={{ fontSize: '0.8rem' }}>
              <span>Shipping</span>
              <span>{shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`}</span>
            </div>
            <div className="row total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            <button className="btn btn-primary btn-block" style={{ marginTop: '1rem' }} disabled={placing}>
              {placing ? 'Placing order…' : 'Place order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}