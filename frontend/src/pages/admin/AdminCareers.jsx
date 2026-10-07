import { useState, useEffect } from 'react';
import { apiEndpoints } from '../../services/api';
import { Trash2, Edit2, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const AdminCareers = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingApplication, setEditingApplication] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    notes: ''
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await apiEndpoints.getAdminCareerApplications();
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch career applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiEndpoints.updateAdminCareerApplication(editingApplication._id, formData);
      setEditingApplication(null);
      setFormData({ status: '', notes: '' });
      fetchApplications();
    } catch (err) {
      console.error('Failed to update application:', err);
      alert('Failed to update application: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      await apiEndpoints.deleteAdminCareerApplication(id);
      fetchApplications();
    } catch (err) {
      console.error('Failed to delete application:', err);
      alert('Failed to delete application');
    }
  };

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-300',
    under_review: 'bg-blue-500/20 text-blue-300',
    shortlisted: 'bg-green-500/20 text-green-300',
    rejected: 'bg-red-500/20 text-red-300',
    hired: 'bg-brand/20 text-brand-text'
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold text-white">Career Applications</h1>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>
        </div>
      </div>

      {editingApplication && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Edit Application</h2>
          <form onSubmit={handleSubmit} className="max-w-md">
            <div className="mb-4">
              <label className="block text-sm text-white/70 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                required
              >
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-white/70 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                rows={3}
                placeholder="Add notes about this application..."
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-strong">
                Update
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingApplication(null);
                  setFormData({ status: '', notes: '' });
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
              <th className="text-left p-4 text-white/70">Name</th>
              <th className="text-left p-4 text-white/70">Position</th>
              <th className="text-left p-4 text-white/70">Contact</th>
              <th className="text-left p-4 text-white/70">Experience</th>
              <th className="text-left p-4 text-white/70">City</th>
              <th className="text-left p-4 text-white/70">Applied Date</th>
              <th className="text-left p-4 text-white/70">Status</th>
              <th className="text-right p-4 text-white/70">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app._id} className="border-b border-white/10">
                <td className="p-4 text-white">
                  <div className="font-medium">{app.firstName} {app.lastName}</div>
                  <div className="text-sm text-white/60">{app.email}</div>
                </td>
                <td className="p-4 text-white">{app.position}</td>
                <td className="p-4 text-white">
                  {app.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4" />
                      {app.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Mail className="w-4 h-4" />
                    {app.email}
                  </div>
                </td>
                <td className="p-4 text-white">{app.experience || 'N/A'}</td>
                <td className="p-4 text-white">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {app.city || 'N/A'}
                  </div>
                </td>
                <td className="p-4 text-white">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    {new Date(app.appliedDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${statusColors[app.status]}`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      setEditingApplication(app);
                      setFormData({ status: app.status, notes: app.notes || '' });
                    }}
                    className="p-2 text-white/70 hover:text-white mr-2"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(app._id)}
                    className="p-2 text-white/70 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredApplications.length === 0 && (
          <div className="p-8 text-center text-white/60">
            No applications found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCareers;
