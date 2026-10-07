import { useState, useEffect } from 'react';
import { apiEndpoints } from '../../services/api';
import { Trash2, Edit2 } from 'lucide-react';

const AdminGiftCards = () => {
  const [giftCards, setGiftCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({
    status: ''
  });

  useEffect(() => {
    fetchGiftCards();
  }, []);

  const fetchGiftCards = async () => {
    try {
      const res = await apiEndpoints.getAdminGiftCards();
      setGiftCards(res.data);
    } catch (err) {
      console.error('Failed to fetch gift cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiEndpoints.updateAdminGiftCard(editingCard._id, formData);
      setEditingCard(null);
      setFormData({ status: '' });
      fetchGiftCards();
    } catch (err) {
      console.error('Failed to update gift card:', err);
      alert('Failed to update gift card: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this gift card?')) return;
    try {
      await apiEndpoints.deleteAdminGiftCard(id);
      fetchGiftCards();
    } catch (err) {
      console.error('Failed to delete gift card:', err);
      alert('Failed to delete gift card');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-white">Gift Cards</h1>

      {editingCard && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Edit Gift Card</h2>
          <form onSubmit={handleSubmit} className="max-w-md">
            <div className="mb-4">
              <label className="block text-sm text-white/70 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                required
              >
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="redeemed">Redeemed</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
                Update
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingCard(null);
                  setFormData({ status: '' });
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
              <th className="text-left p-4 text-white/70">Amount</th>
              <th className="text-left p-4 text-white/70">Balance</th>
              <th className="text-left p-4 text-white/70">Purchaser</th>
              <th className="text-left p-4 text-white/70">Recipient</th>
              <th className="text-left p-4 text-white/70">Status</th>
              <th className="text-left p-4 text-white/70">Expiry</th>
              <th className="text-right p-4 text-white/70">Actions</th>
            </tr>
          </thead>
          <tbody>
            {giftCards.map((card) => (
              <tr key={card._id} className="border-b border-white/10">
                <td className="p-4 text-white font-mono">{card.cardNumber}</td>
                <td className="p-4 text-white">PKR {card.amount.toFixed(2)}</td>
                <td className="p-4 text-white">PKR {card.balance.toFixed(2)}</td>
                <td className="p-4 text-white">{card.purchaser?.name || 'N/A'}</td>
                <td className="p-4 text-white">{card.recipient?.name || card.recipientEmail || 'N/A'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    card.status === 'active' ? 'bg-green-500/20 text-green-300' :
                    card.status === 'redeemed' ? 'bg-blue-500/20 text-blue-300' :
                    card.status === 'expired' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {card.status}
                  </span>
                </td>
                <td className="p-4 text-white text-sm">{new Date(card.expiryDate).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      setEditingCard(card);
                      setFormData({ status: card.status });
                    }}
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

export default AdminGiftCards;
