import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const emptyForm = { title: '', excerpt: '', content: '', coverImage: '', tags: '', isPublished: true };

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadPosts = () => {
    setLoading(true);
    api
      .get('/blog/admin/all')
      .then((res) => setPosts(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(loadPosts, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: p.coverImage || '',
      tags: (p.tags || []).join(', '),
      isPublished: p.isPublished,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      coverImage: form.coverImage,
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
      isPublished: form.isPublished,
    };
    try {
      if (editingId) {
        await api.put(`/blog/${editingId}`, payload);
        toast.success('Post updated');
      } else {
        await api.post('/blog', payload);
        toast.success('Post created');
      }
      setShowForm(false);
      loadPosts();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/blog/${id}`);
      toast.success('Post deleted');
      loadPosts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <span className="eyebrow"><span className="swatch-dot" /> Content</span>
          <h1 style={{ fontSize: '1.9rem' }}>Beauty Blog</h1>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ New Post</button>
      </div>

      {showForm && (
        <div className="form-card" style={{ marginBottom: '2rem', maxWidth: 680 }}>
          <h3>{editingId ? 'Edit post' : 'New post'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="field">
              <label>Excerpt</label>
              <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required />
            </div>
            <div className="field">
              <label>Content (separate paragraphs with a blank line)</label>
              <textarea style={{ minHeight: 200 }} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            </div>
            <div className="field">
              <label>Cover image URL</label>
              <input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} placeholder="https://..." />
            </div>
            <div className="field">
              <label>Tags (comma-separated)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="skincare, tutorial" />
            </div>
            <div className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.6rem' }}>
              <input
                type="checkbox"
                id="isPublished"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                style={{ width: 'auto' }}
              />
              <label htmlFor="isPublished" style={{ margin: 0 }}>Published</label>
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
            <thead><tr><th>Title</th><th>Tags</th><th>Status</th><th>Published</th><th></th></tr></thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>{(p.tags || []).join(', ') || '—'}</td>
                  <td>
                    <span className={`status-pill status-${p.isPublished ? 'resolved' : 'pending'}`}>
                      {p.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{new Date(p.publishedAt).toLocaleDateString()}</td>
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
