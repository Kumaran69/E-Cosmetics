import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const categories = [
  'Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Bath & Body', 'Nail Care', 'Tools & Accessories', "Men's Grooming",
];

const sorts = [
  { value: '', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name_asc', label: 'Name: A-Z' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page')) || 1;

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (category) params.category = category;
    if (sort) params.sort = sort;
    if (searchParams.get('keyword')) params.keyword = searchParams.get('keyword');

    api
      .get('/products', { params })
      .then((res) => {
        setProducts(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, sort, page, searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParam('keyword', keyword);
  };

  return (
    <div className="container page-section">
      <span className="eyebrow"><span className="swatch-dot" /> The full collection</span>
      <h1>Shop All Products</h1>

      <form onSubmit={handleSearch} className="flex" style={{ gap: '0.8rem', marginBottom: '1.5rem', maxWidth: 420 }}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search products..."
          style={{ flex: 1, padding: '0.7rem 0.9rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)' }}
        />
        <button className="btn btn-primary btn-sm">Search</button>
      </form>

      <div className="chip-row" style={{ marginBottom: '1.2rem' }}>
        <button className={`chip ${!category ? 'active' : ''}`} onClick={() => updateParam('category', '')}>
          <span className="swatch-dot" /> All
        </button>
        {categories.map((c) => (
          <button key={c} className={`chip ${category === c ? 'active' : ''}`} onClick={() => updateParam('category', c)}>
            <span className="swatch-dot" /> {c}
          </button>
        ))}
      </div>

      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <span className="muted" style={{ fontSize: '0.85rem' }}>
          {pagination.total ?? products.length} product{(pagination.total ?? products.length) !== 1 ? 's' : ''}
        </span>
        <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} style={{ padding: '0.6rem 0.9rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)' }}>
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <div className="empty-state">No products match your filters. Try a different search or category.</div>
      ) : (
        <>
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          {pagination.pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={p === page ? 'active' : ''} onClick={() => updateParam('page', p)}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
