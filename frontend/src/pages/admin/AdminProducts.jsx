import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Power } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiEndpoints } from '../../services/api';
import Loader from '../../components/common/Loader';

const emptyForm = {
  name: '',
  price: '',
  category: 'Electronics',
  brand: 'ShopHub',
  image: '',
  stock: 100,
  isLuxury: false,
  isFeatured: false,
  isActive: true,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [useFileUpload, setUseFileUpload] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const load = () =>
    apiEndpoints
      .getAdminProducts()
      .then(({ data }) => setProducts(data))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      isActive: form.isActive !== false,
    };
    try {
      if (editingId) {
        await apiEndpoints.updateAdminProduct(editingId, payload);
        toast.success('Product updated');
      } else {
        await apiEndpoints.createAdminProduct(payload);
        toast.success('Product created');
      }
      setForm(emptyForm);
      setEditingId(null);
      setImagePreview('');
      setUseFileUpload(false);
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id || p._id);
    setForm({
      name: p.name,
      price: p.price,
      category: p.category,
      brand: p.brand || 'ShopHub',
      image: p.image,
      stock: p.stock ?? 100,
      isLuxury: !!p.isLuxury,
      isFeatured: !!p.isFeatured,
      isActive: p.isActive !== false,
    });
    setImagePreview(p.image || '');
    setShowForm(true);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setImagePreview(base64);
        setForm({ ...form, image: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImagePreview('');
    setUseFileUpload(false);
    setShowForm(false);
  };

  const handleToggleActive = async (product) => {
    const id = product.id || product._id;
    const nextActive = product.isActive === false;
    setStatusUpdatingId(id);
    try {
      await apiEndpoints.updateAdminProductStatus(id, { isActive: nextActive });
      toast.success(nextActive ? 'Product activated' : 'Product set inactive');
      setProducts((prev) =>
        prev.map((item) =>
          (item.id || item._id) === id ? { ...item, isActive: nextActive } : item
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Status update failed');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleDelete = async (product) => {
    const id = product.id || product._id;
    if (product.hasOrders) {
      toast.error('Ordered products cannot be deleted. Set inactive instead.');
      return;
    }
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await apiEndpoints.deleteAdminProduct(id);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <Loader label="Loading products" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Products</h1>
          <p className="text-white/50 text-sm">{products.length} items</p>
          <p className="text-white/40 text-xs mt-1">
            Ordered products can only be set active/inactive — delete is blocked.
          </p>
        </div>
        <button
          type="button"
          className="btn-gold text-sm !py-2.5 !px-5"
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setImagePreview('');
            setUseFileUpload(false);
            setShowForm(true);
          }}
        >
          <Plus className="w-4 h-4 inline mr-1" />
          Add product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-glass p-6 grid sm:grid-cols-2 gap-4">
          <input
            className="input-premium bg-white/5 border-white/20 text-white sm:col-span-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="input-premium bg-white/5 border-white/20 text-white"
            placeholder="Price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            className="input-premium bg-white/5 border-white/20 text-white"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
          <div className="sm:col-span-2 space-y-3">
            <div className="flex gap-4 mb-2">
              <button
                type="button"
                className={`text-sm px-3 py-1 rounded ${!useFileUpload ? 'bg-primary-600 text-white' : 'bg-white/10 text-white/70'}`}
                onClick={() => setUseFileUpload(false)}
              >
                URL
              </button>
              <button
                type="button"
                className={`text-sm px-3 py-1 rounded ${useFileUpload ? 'bg-primary-600 text-white' : 'bg-white/10 text-white/70'}`}
                onClick={() => setUseFileUpload(true)}
              >
                Upload File
              </button>
            </div>

            {!useFileUpload ? (
              <input
                className="input-premium bg-white/5 border-white/20 text-white w-full"
                placeholder="Image URL"
                value={form.image}
                onChange={(e) => {
                  setForm({ ...form, image: e.target.value });
                  setImagePreview(e.target.value);
                }}
                required
              />
            ) : (
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="input-premium bg-white/5 border-white/20 text-white w-full"
                />
                <p className="text-xs text-white/50">Upload an image file (JPG, PNG, WebP)</p>
              </div>
            )}

            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-white/20" />
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={form.isLuxury}
              onChange={(e) => setForm({ ...form, isLuxury: e.target.checked })}
            />
            Luxury
          </label>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-white/70 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.isActive !== false}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Active (visible in store)
          </label>
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" className="btn-premium !text-xs" disabled={submitting}>
              {submitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}
            </button>
            <button type="button" className="btn-outline !text-xs border-white/30 text-white" onClick={resetForm} disabled={submitting}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="admin-glass overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const id = p.id || p._id;
              const isActive = p.isActive !== false;
              return (
                <tr key={id} className={!isActive ? 'opacity-60' : undefined}>
                  <td className="flex items-center gap-3 min-w-[200px]">
                    <img src={p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p>{p.name}</p>
                      {p.hasOrders ? (
                        <p className="text-[10px] uppercase tracking-wide text-amber-300/90">Ordered — delete locked</p>
                      ) : null}
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>${p.price?.toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-right whitespace-nowrap">
                    <button
                      type="button"
                      className="p-2 text-white/60 hover:text-white"
                      title={isActive ? 'Set inactive' : 'Set active'}
                      disabled={statusUpdatingId === id}
                      onClick={() => handleToggleActive(p)}
                    >
                      <Power className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-white/40'}`} />
                    </button>
                    <button type="button" className="p-2 text-white/60 hover:text-white" onClick={() => startEdit(p)}>
                      <Pencil className="w-4 h-4" />
                    </button>
                    {!p.hasOrders ? (
                      <button
                        type="button"
                        className="p-2 text-red-400/80 hover:text-red-300"
                        onClick={() => handleDelete(p)}
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
