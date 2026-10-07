import { useState, useEffect } from 'react';
import { apiEndpoints } from '../../services/api';
import { Trash2, Edit2, Plus, Eye } from 'lucide-react';

const AdminPageContent = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewingPage, setViewingPage] = useState(null);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    key: '',
    title: '',
    subtitle: '',
    description: '',
    heroImage: '',
    sections: []
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await apiEndpoints.getAdminPageContent();
      setPages(res.data);
    } catch (err) {
      console.error('Failed to fetch page content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPage) {
        await apiEndpoints.updateAdminPageContent(editingPage.key, formData);
      } else {
        await apiEndpoints.createAdminPageContent(formData);
      }
      setShowForm(false);
      setEditingPage(null);
      setFormData({
        key: '',
        title: '',
        subtitle: '',
        description: '',
        heroImage: '',
        sections: []
      });
      fetchPages();
    } catch (err) {
      console.error('Failed to save page content:', err);
      alert('Failed to save page content');
    }
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData({
      key: page.key,
      title: page.title,
      subtitle: page.subtitle || '',
      description: page.description || '',
      heroImage: page.heroImage || '',
      sections: page.sections || []
    });
    setShowForm(true);
  };

  const handleDelete = async (key) => {
    if (!confirm('Are you sure you want to delete this page content?')) return;
    try {
      await apiEndpoints.deleteAdminPageContent(key);
      fetchPages();
    } catch (err) {
      console.error('Failed to delete page content:', err);
      alert('Failed to delete page content');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold text-white">Page Content</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-strong"
        >
          <Plus className="w-4 h-4" />
          Add Page
        </button>
      </div>

      {showForm && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingPage ? 'Edit Page Content' : 'Add New Page Content'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Key (unique identifier)</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  disabled={!!editingPage}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Hero Image URL</label>
                <input
                  type="text"
                  value={formData.heroImage}
                  onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-strong">
                {editingPage ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingPage(null);
                }}
                className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {viewingPage && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">{viewingPage.title}</h2>
            <button
              onClick={() => setViewingPage(null)}
              className="text-white/70 hover:text-white"
            >
              Close
            </button>
          </div>
          <div className="space-y-4 text-white">
            <div>
              <span className="text-white/70">Key:</span> {viewingPage.key}
            </div>
            <div>
              <span className="text-white/70">Subtitle:</span> {viewingPage.subtitle || 'N/A'}
            </div>
            <div>
              <span className="text-white/70">Description:</span> {viewingPage.description || 'N/A'}
            </div>
            <div>
              <span className="text-white/70">Hero Image:</span> {viewingPage.heroImage || 'N/A'}
            </div>
            <div>
              <span className="text-white/70">Sections:</span> {viewingPage.sections?.length || 0}
            </div>
            <div>
              <span className="text-white/70">Status:</span>{' '}
              <span className={`px-2 py-1 rounded text-xs ${viewingPage.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                {viewingPage.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left p-4 text-white/70">Key</th>
              <th className="text-left p-4 text-white/70">Title</th>
              <th className="text-left p-4 text-white/70">Sections</th>
              <th className="text-left p-4 text-white/70">Status</th>
              <th className="text-right p-4 text-white/70">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page._id} className="border-b border-white/10">
                <td className="p-4 text-white font-mono">{page.key}</td>
                <td className="p-4 text-white">{page.title}</td>
                <td className="p-4 text-white">{page.sections?.length || 0}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${page.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {page.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setViewingPage(page)}
                    className="p-2 text-white/70 hover:text-white mr-2"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(page)}
                    className="p-2 text-white/70 hover:text-white mr-2"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(page.key)}
                    className="p-2 text-white/70 hover:text-red-300"
                    title="Delete"
                  >
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

export default AdminPageContent;
