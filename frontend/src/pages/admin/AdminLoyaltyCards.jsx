import { useState, useEffect } from 'react';
import { apiEndpoints } from '../../services/api';
import { Trash2, Edit2, Plus } from 'lucide-react';

const AdminLoyaltyCards = () => {
  const [loyaltyCards, setLoyaltyCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({
    user: '',
    tier: 'Silver',
    points: ''
  });

  useEffect(() => {
    fetchLoyaltyCards();
  }, []);

  const fetchLoyaltyCards = async () => {
    try {
      const res = await apiEndpoints.getAdminLoyaltyCards();
      setLoyaltyCards(res.data);
    } catch (err) {
      console.error('Failed to fetch loyalty cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        points: formData.points ? Number(formData.points) : 0
      };
      
      if (editingCard) {
        await apiEndpoints.updateAdminLoyaltyCard(editingCard._id, submitData);
      } else {
        await apiEndpoints.createAdminLoyaltyCard(submitData);
      }
      setShowForm(false);
      setEditingCard(null);
      setFormData({ user: '', tier: 'Silver', points: '' });
      fetchLoyaltyCards();
    } catch (err) {
      console.error('Failed to save loyalty card:', err);
      alert('Failed to save loyalty card: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (card) => {
    setEditingCard(card);
    setFormData({
      user: card.user?._id || '',
      tier: card.tier,
      points: card.points
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this loyalty card?')) return;
    try {
      await apiEndpoints.deleteAdminLoyaltyCard(id);
      fetchLoyaltyCards();
    } catch (err) {
      console.error('Failed to delete loyalty card:', err);
      alert('Failed to delete loyalty card');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold text-white">Loyalty Cards</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-strong"
        >
          <Plus className="w-4 h-4" />
          Add Loyalty Card
        </button>
      </div>

      {showForm && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingCard ? 'Edit Loyalty Card' : 'Add New Loyalty Card'}
          </h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">User ID</label>
              <input
                type="text"
                value={formData.user}
                onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Tier</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
              >
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
                <option value="Diamond">Diamond</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Initial Points</label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
              />
            </div>
            <div className="md:col-span-3 flex gap-2">
              <button type="submit" className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-strong">
                {editingCard ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCard(null);
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
              <th className="text-left p-4 text-white/70">Card Number</th>
              <th className="text-left p-4 text-white/70">User</th>
              <th className="text-left p-4 text-white/70">Tier</th>
              <th className="text-left p-4 text-white/70">Points Balance</th>
              <th className="text-left p-4 text-white/70">Total Earned</th>
              <th className="text-left p-4 text-white/70">Status</th>
              <th className="text-right p-4 text-white/70">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loyaltyCards.map((card) => (
              <tr key={card._id} className="border-b border-white/10">
                <td className="p-4 text-white font-mono">{card.cardNumber}</td>
                <td className="p-4 text-white">{card.user?.name || 'N/A'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    card.tier === 'Diamond' ? 'bg-brand/20 text-brand-text' :
                    card.tier === 'Platinum' ? 'bg-cyan-500/20 text-cyan-300' :
                    card.tier === 'Gold' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {card.tier}
                  </span>
                </td>
                <td className="p-4 text-white">{card.pointsBalance}</td>
                <td className="p-4 text-white">{card.totalEarned}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${card.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {card.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleEdit(card)}
                    className="p-2 text-white/70 hover:text-white mr-2"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(card._id)}
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

export default AdminLoyaltyCards;
