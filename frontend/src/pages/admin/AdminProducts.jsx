import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const categories = [
  'Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Bath & Body', 'Nail Care', 'Tools & Accessories', "Men's Grooming",
];

const emptyForm = {
  name: '', description: '', category: 'Skincare', price: '', discountPrice: '', stock: '', images: '', shades: '',
  isFeatured: false, isBestSeller: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    api
      .get('/products', { params: { limit: 50 } })
      .then((res) => setProducts(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(loadProducts, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      discountPrice: p.discountPrice || '',
      stock: p.stock,
      images: (p.images || []).join(', '),
      shades: (p.shades || []).join(', '),
      isFeatured: !!p.isFeatured,
      isBestSeller: !!p.isBestSeller,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      category: form.category,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : 0,
      stock: Number(form.stock),
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
      shades: form.shades.split(',').map((s) => s.trim()).filter(Boolean),
      isFeatured: form.isFeatured,
      isBestSeller: form.isBestSeller,
    };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product created');
      }
      setShowForm(false);
      loadProducts();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      loadProducts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <span className="eyebrow"><span className="swatch-dot" /> Catalog</span>
          <h1 style={{ fontSize: '1.9rem' }}>Products</h1>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Product</button>
      </div>

      {showForm && (
        <div className="form-card" style={{ marginBottom: '2rem', maxWidth: 640 }}>
          <h3>{editingId ? 'Edit product' : 'New product'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Stock</label>
                <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Price (₹)</label>
                <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="field">
                <label>Discount price (₹, optional)</label>
                <input type="number" min="0" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label>Image URLs (comma-separated)</label>
              <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="https://..." />
            </div>
            <div className="field">
              <label>Shades (comma-separated, optional)</label>
              <input value={form.shades} onChange={(e) => setForm({ ...form, shades: e.target.value })} placeholder="Rose Nude, Wine Red" />
            </div>
            <div className="field-row" style={{ alignItems: 'center' }}>
              <div className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.6rem' }}>
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  style={{ width: 'auto' }}
                />
                <label htmlFor="isFeatured" style={{ margin: 0 }}>Featured on homepage</label>
              </div>
              <div className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.6rem' }}>
                <input
                  type="checkbox"
                  id="isBestSeller"
                  checked={form.isBestSeller}
                  onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
                  style={{ width: 'auto' }}
                />
                <label htmlFor="isBestSeller" style={{ margin: 0 }}>Best seller</label>
              </div>
            </div>
            <div className="flex" style={{ gap: '0.8rem' }}>
              <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>₹{p.discountPrice > 0 ? p.discountPrice : p.price}</td>
                  <td>{p.stock}</td>
                  <td>{p.ratingsAverage ? `${p.ratingsAverage.toFixed(1)} (${p.ratingsCount})` : '—'}</td>
                  <td>
                    <button className="btn-ghost btn-sm" onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn-ghost btn-sm" style={{ color: '#a33' }} onClick={() => handleDelete(p._id)}>Delete</button>
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
