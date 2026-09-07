import { useState, useEffect } from 'react';
import { apiEndpoints } from '../../services/api';
import { Trash2, Edit2, Plus } from 'lucide-react';

const AdminPromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    usageLimit: '',
    validFrom: '',
    validUntil: ''
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const res = await apiEndpoints.getAdminPromoCodes();
      setPromoCodes(res.data);
    } catch (err) {
      console.error('Failed to fetch promo codes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : 0,
        maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        validFrom: new Date(formData.validFrom).toISOString(),
        validUntil: new Date(formData.validUntil).toISOString(),
        isActive: true
      };
      
      if (editingCode) {
        await apiEndpoints.updateAdminPromoCode(editingCode._id, submitData);
      } else {
        await apiEndpoints.createAdminPromoCode(submitData);
      }
      setShowForm(false);
      setEditingCode(null);
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderAmount: '',
        maxDiscountAmount: '',
        usageLimit: '',
        validFrom: '',
        validUntil: ''
      });
      fetchPromoCodes();
    } catch (err) {
      console.error('Failed to save promo code:', err);
      alert('Failed to save promo code: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (code) => {
    setEditingCode(code);
    setFormData({
      code: code.code,
      description: code.description || '',
      discountType: code.discountType,
      discountValue: code.discountValue,
      minOrderAmount: code.minOrderAmount || '',
      maxDiscountAmount: code.maxDiscountAmount || '',
      usageLimit: code.usageLimit || '',
      validFrom: code.validFrom?.split('T')[0] || '',
      validUntil: code.validUntil?.split('T')[0] || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;
    try {
      await apiEndpoints.deleteAdminPromoCode(id);
      fetchPromoCodes();
    } catch (err) {
      console.error('Failed to delete promo code:', err);
      alert('Failed to delete promo code');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold text-white">Promo Codes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-4 h-4" />
          Add Promo Code
        </button>
      </div>

      {showForm && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingCode ? 'Edit Promo Code' : 'Add New Promo Code'}
          </h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Discount Type</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Discount Value</label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Min Order Amount</label>
              <input
                type="number"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Max Discount Amount</label>
              <input
                type="number"
                value={formData.maxDiscountAmount}
                onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Usage Limit</label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Valid From</label>
              <input
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Valid Until</label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                required
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
                {editingCode ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCode(null);
                }}
                className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left p-4 text-white/70">Code</th>
              <th className="text-left p-4 text-white/70">Discount</th>
              <th className="text-left p-4 text-white/70">Usage</th>
              <th className="text-left p-4 text-white/70">Valid</th>
              <th className="text-left p-4 text-white/70">Status</th>
              <th className="text-right p-4 text-white/70">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promoCodes.map((code) => (
              <tr key={code._id} className="border-b border-white/10">
                <td className="p-4 text-white font-mono">{code.code}</td>
                <td className="p-4 text-white">
                  {code.discountType === 'percentage' ? code.discountValue + '%' : 'PKR ' + code.discountValue}
                </td>
                <td className="p-4 text-white">{code.usedCount}/{code.usageLimit || '∞'}</td>
                <td className="p-4 text-white text-sm">
                  {new Date(code.validFrom).toLocaleDateString()} - {new Date(code.validUntil).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${code.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {code.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleEdit(code)}
                    className="p-2 text-white/70 hover:text-white mr-2"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(code._id)}
                    className="p-2 text-white/70 hover:text-red-300"
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

export default AdminPromoCodes;
