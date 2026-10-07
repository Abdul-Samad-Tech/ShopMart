import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiEndpoints } from '../../services/api';
import Loader from '../../components/common/Loader';

const emptyForm = {
  name: '',
  slug: '',
  icon: '',
  image: '',
  href: '/products',
  itemCount: '',
  order: 0,
  subCategories: [],
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [useFileUpload, setUseFileUpload] = useState(false);
  const [subCategoryInput, setSubCategoryInput] = useState({ name: '', slug: '', href: '/products', icon: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () =>
    apiEndpoints
      .getAdminCategories()
      .then(({ data }) => setCategories(data))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...form,
      order: Number(form.order),
    };
    try {
      if (editingId) {
        await apiEndpoints.updateAdminCategory(editingId, payload);
        toast.success('Category updated');
      } else {
        await apiEndpoints.createAdminCategory(payload);
        toast.success('Category created');
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setForm({
      name: c.name,
      slug: c.slug,
      icon: c.icon || '',
      image: c.image || '',
      href: c.href || '/products',
      itemCount: c.itemCount || '',
      order: c.order || 0,
      subCategories: c.subCategories || [],
    });
    setImagePreview(c.image || '');
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
    setSubCategoryInput({ name: '', slug: '', href: '/products', icon: '' });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await apiEndpoints.deleteAdminCategory(id);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const addSubCategory = () => {
    if (subCategoryInput.name && subCategoryInput.slug) {
      setForm({
        ...form,
        subCategories: [...form.subCategories, { ...subCategoryInput }],
      });
      setSubCategoryInput({ name: '', slug: '', href: '/products', icon: '' });
    }
  };

  const removeSubCategory = (index) => {
    setForm({
      ...form,
      subCategories: form.subCategories.filter((_, i) => i !== index),
    });
  };

  if (loading) return <Loader label="Loading categories" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Categories</h1>
          <p className="text-white/50 text-sm">{categories.length} items</p>
        </div>
        <button
          type="button"
          className="btn-gold text-sm !py-2.5 !px-5"
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setImagePreview('');
            setUseFileUpload(false);
            setSubCategoryInput({ name: '', slug: '', href: '/products', icon: '' });
            setShowForm(true);
          }}
        >
          <Plus className="w-4 h-4 inline mr-1" />
          Add category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-glass p-6 grid sm:grid-cols-2 gap-4">
          <input
            className="input-premium bg-white/5 border-white/20 text-white"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="input-premium bg-white/5 border-white/20 text-white"
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />
          <input
            className="input-premium bg-white/5 border-white/20 text-white"
            placeholder="Icon (emoji or icon name)"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
          />
          <input
            className="input-premium bg-white/5 border-white/20 text-white"
            placeholder="Order"
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
          />
          <input
            className="input-premium bg-white/5 border-white/20 text-white"
            placeholder="Item Count (e.g., 500+ items)"
            value={form.itemCount}
            onChange={(e) => setForm({ ...form, itemCount: e.target.value })}
          />
          <input
            className="input-premium bg-white/5 border-white/20 text-white"
            placeholder="Href (e.g., /products?category=X)"
            value={form.href}
            onChange={(e) => setForm({ ...form, href: e.target.value })}
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

          <div className="sm:col-span-2">
            <h3 className="text-white font-medium mb-2">Sub Categories</h3>
            <div className="space-y-2 mb-3">
              {form.subCategories.map((sub, index) => (
                <div key={index} className="flex items-center gap-2 bg-white/5 p-2 rounded">
                  <span className="text-white text-sm flex-1">{sub.name}</span>
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-300"
                    onClick={() => removeSubCategory(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              <input
                className="input-premium bg-white/5 border-white/20 text-white text-sm"
                placeholder="Sub category name"
                value={subCategoryInput.name}
                onChange={(e) => setSubCategoryInput({ ...subCategoryInput, name: e.target.value })}
              />
              <input
                className="input-premium bg-white/5 border-white/20 text-white text-sm"
                placeholder="Slug"
                value={subCategoryInput.slug}
                onChange={(e) => setSubCategoryInput({ ...subCategoryInput, slug: e.target.value })}
              />
            </div>
            <button
              type="button"
              className="mt-2 text-sm px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20"
              onClick={addSubCategory}
            >
              Add Sub Category
            </button>
          </div>

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
              <th>Category</th>
              <th>Slug</th>
              <th>Order</th>
              <th>Sub Categories</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id}>
                <td className="flex items-center gap-3 min-w-[200px]">
                  {c.image && <img src={c.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                  <div>
                    <div className="font-medium">{c.name}</div>
                    {c.icon && <span className="text-xs text-white/50">{c.icon}</span>}
                  </div>
                </td>
                <td>{c.slug}</td>
                <td>{c.order}</td>
                <td>{c.subCategories?.length || 0}</td>
                <td className="text-right whitespace-nowrap">
                  <button type="button" className="p-2 text-white/60 hover:text-white" onClick={() => startEdit(c)}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-2 text-red-400/80 hover:text-red-300" onClick={() => handleDelete(c._id)}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories;
