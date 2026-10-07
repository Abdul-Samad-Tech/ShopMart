import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Trash2, ExternalLink } from 'lucide-react';
import { apiEndpoints } from '../../services/api';
import Loader from '../../components/common/Loader';

const statusColors = {
  new: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
  read: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
  replied: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
};

const formatId = (m) => {
  const id = m.id || m._id;
  return id ? `#${String(id).slice(-6).toUpperCase()}` : '—';
};

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = useCallback(() => {
    setError(null);
    return apiEndpoints
      .getAdminMessages(filter === 'all' ? {} : { status: filter })
      .then(({ data }) => setMessages(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const openMessage = async (msg) => {
    const id = msg.id || msg._id;
    if (!id) return;
    setDetailLoading(true);
    try {
      const { data } = await apiEndpoints.getAdminMessage(id);
      setSelected(data);
      setMessages((prev) =>
        prev.map((m) => {
          const mid = m.id || m._id;
          if (String(mid) !== String(id)) return m;
          return { ...m, status: data.status || 'read' };
        })
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load message');
    } finally {
      setDetailLoading(false);
    }
  };

  const updateStatus = async (status) => {
    if (!selected) return;
    const id = selected.id || selected._id;
    try {
      const { data } = await apiEndpoints.updateAdminMessage(id, { status });
      setSelected(data);
      setMessages((prev) =>
        prev.map((m) => (String(m.id || m._id) === String(id) ? { ...m, ...data } : m))
      );
      toast.success(`Marked as ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const removeMessage = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await apiEndpoints.deleteAdminMessage(id);
      setMessages((prev) => prev.filter((m) => String(m.id || m._id) !== String(id)));
      if (selected && String(selected.id || selected._id) === String(id)) setSelected(null);
      toast.success('Message deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <Loader label="Loading messages" />;

  if (error) {
    return (
      <div className="admin-glass p-8 text-center">
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white mb-1">Contact Messages</h1>
          <p className="text-white/50 text-sm">All inquiries from the contact form</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'new', 'read', 'replied'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide ${
                filter === s ? 'bg-white/20 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </header>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 admin-glass overflow-hidden">
          {messages.length === 0 ? (
            <p className="p-8 text-center text-white/50 text-sm">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-white/10 max-h-[70vh] overflow-y-auto">
              {messages.map((msg) => {
                const id = msg.id || msg._id;
                const active = selected && String(selected.id || selected._id) === String(id);
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => openMessage(msg)}
                      className={`w-full text-left p-4 hover:bg-white/5 transition-colors ${
                        active ? 'bg-white/10' : ''
                      }`}
                    >
                      <div className="flex justify-between gap-2 mb-1">
                        <span className="font-semibold text-white text-sm truncate">{msg.name}</span>
                        <span
                          className={`text-[10px] uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                            statusColors[msg.status] || statusColors.read
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                      <p className="text-xs text-white/70 truncate">{msg.subject}</p>
                      <p className="text-[10px] text-white/40 mt-1">
                        {new Date(msg.createdAt).toLocaleString()}
                        {msg.emailSent && ' · email sent'}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="lg:col-span-3 admin-glass p-6 lg:p-8 min-h-[320px]">
          {detailLoading ? (
            <p className="text-white/50 text-sm">Loading…</p>
          ) : !selected ? (
            <p className="text-white/50 text-sm">Select a message to view full details.</p>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wide mb-1">{formatId(selected)}</p>
                  <h2 className="font-display text-xl text-white">{selected.subject}</h2>
                </div>
                <span
                  className={`text-xs uppercase px-3 py-1 rounded-full border h-fit ${
                    statusColors[selected.status] || statusColors.read
                  }`}
                >
                  {selected.status}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/40 text-xs uppercase mb-1">Name</p>
                  <p className="text-white">{selected.name}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase mb-1">Email</p>
                  <a href={`mailto:${selected.email}`} className="text-brand hover:underline">
                    {selected.email}
                  </a>
                </div>
                {selected.userName && (
                  <div>
                    <p className="text-white/40 text-xs uppercase mb-1">Account</p>
                    <p className="text-white">{selected.userName}</p>
                  </div>
                )}
                <div>
                  <p className="text-white/40 text-xs uppercase mb-1">Received</p>
                  <p className="text-white">{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-white/40 text-xs uppercase mb-2">Message</p>
                <div className="bg-white/5 rounded-xl p-4 text-sm text-white/90 whitespace-pre-wrap leading-relaxed">
                  {selected.message}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand text-white text-xs font-semibold uppercase tracking-wide hover:bg-brand"
                >
                  <Mail className="w-4 h-4" />
                  Reply via email
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
                {selected.status !== 'replied' && (
                  <button
                    type="button"
                    onClick={() => updateStatus('replied')}
                    className="px-4 py-2 rounded-full bg-emerald-600/80 text-white text-xs font-semibold uppercase tracking-wide hover:bg-emerald-500"
                  >
                    Mark replied
                  </button>
                )}
                {selected.status === 'new' && (
                  <button
                    type="button"
                    onClick={() => updateStatus('read')}
                    className="px-4 py-2 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wide hover:bg-white/20"
                  >
                    Mark read
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeMessage(selected.id || selected._id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-200 text-xs font-semibold uppercase tracking-wide hover:bg-red-500/30 ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
