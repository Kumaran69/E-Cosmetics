import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, subtotal, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  const handleQtyChange = async (itemId, quantity) => {
    try {
      await updateItem(itemId, quantity);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeItem(itemId);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container page-section empty-state">
        <h2>Your cart is empty</h2>
        <p className="muted">Browse our collection and add something you'll love.</p>
        <Link to="/products" className="btn btn-primary">Shop now</Link>
      </div>
    );
  }

  return (
    <div className="container page-section">
      <span className="eyebrow"><span className="swatch-dot" /> Your bag</span>
      <h1>Shopping Cart</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
        <div>
          {cart.items.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div style={{ flex: 1 }}>
                <div className="flex-between">
                  <div>
                    <h3 style={{ fontSize: '1rem', margin: 0 }}>{item.name}</h3>
                    {item.shade && <span className="muted" style={{ fontSize: '0.8rem' }}>Shade: {item.shade}</span>}
                  </div>
                  <button className="btn-ghost" onClick={() => handleRemove(item._id)} aria-label="Remove item">
                    <FiTrash2 />
                  </button>
                </div>
                <div className="flex-between" style={{ marginTop: '0.8rem' }}>
                  <div className="qty-control">
                    <button onClick={() => handleQtyChange(item._id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQtyChange(item._id, item.quantity + 1)}>+</button>
                  </div>
                  <span className="price">₹{item.price * item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="row muted" style={{ fontSize: '0.8rem' }}>
            <span>Shipping &amp; taxes</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="row total">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>
          <button className="btn btn-primary btn-block" style={{ marginTop: '1rem' }} onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}