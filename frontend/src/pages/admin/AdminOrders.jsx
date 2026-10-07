import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { apiEndpoints } from '../../services/api';
import { formatPrice } from '../../utils/helpers';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColors = {
  pending: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
  processing: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
  shipped: 'bg-violet-500/20 text-violet-200 border-violet-400/30',
  delivered: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
  cancelled: 'bg-red-500/20 text-red-200 border-red-400/30',
};

const formatOrderId = (o) => {
  const id = o.orderId || o.id || o._id;
  if (!id) return '—';
  return `#${String(id)}`;
};

const formatCustomer = (o) => {
  if (o.userName) return o.userName;
  if (o.userEmail) return o.userEmail;
  if (o.shipping?.email) return o.shipping.email;
  if (o.shipping?.fullName) return o.shipping.fullName;
  return 'Guest';
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setError(null);
    return apiEndpoints
      .getAdminOrders()
      .then(({ data }) => setOrders(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (order, status) => {
    const id = order.id || order._id;
    if (!id || status === order.status) return;

    setUpdatingId(String(id));
    try {
      const { data } = await apiEndpoints.updateAdminOrder(id, { status });
      setOrders((prev) =>
        prev.map((o) => {
          const oid = o.id || o._id;
          if (String(oid) !== String(id)) return o;
          return {
            ...o,
            ...data,
            id: data.id || data._id?.toString() || String(id),
            userName: data.userName ?? o.userName,
            userEmail: data.userEmail ?? o.userEmail,
            status: data.status ?? status,
          };
        })
      );
      toast.success(`Order ${formatOrderId(order)} → ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
      load();
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader label="Loading orders" />;

  if (error) {
    return (
      <div className="admin-glass p-8 text-center">
        <p className="text-red-300">{error}</p>
        <button type="button" onClick={load} className="btn-primary text-sm mt-4">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl !text-white">Orders</h1>
        <p className="text-white/60 text-sm">{orders.length} total</p>
      </header>

      {orders.length === 0 ? (
        <div className="admin-glass p-12 text-center text-white/60">
          No orders yet. Orders appear here after customers checkout.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="admin-glass overflow-x-auto hidden md:block">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const id = o.id || o._id;
                  const busy = updatingId === String(id);
                  return (
                    <tr key={id}>
                      <td className="font-mono text-white">{formatOrderId(o)}</td>
                      <td>
                        <span className="block text-white font-medium">{formatCustomer(o)}</span>
                        {o.userEmail && o.userName && (
                          <span className="text-xs text-white/50">{o.userEmail}</span>
                        )}
                      </td>
                      <td className="text-white/80">{o.items?.length || 0}</td>
                      <td className="text-white font-semibold">{formatPrice(o.total || 0)}</td>
                      <td>
                        <select
                          value={o.status || 'pending'}
                          disabled={busy}
                          onChange={(e) => updateStatus(o, e.target.value)}
                          className={`admin-select capitalize ${statusColors[o.status] || statusColors.pending}`}
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="text-white/60 text-xs whitespace-nowrap">
                        {o.createdAt ? new Date(o.createdAt).toLocaleString() : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {orders.map((o) => {
              const id = o.id || o._id;
              const busy = updatingId === String(id);
              return (
                <div key={id} className="admin-glass p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-mono text-white font-semibold">{formatOrderId(o)}</p>
                      <p className="text-white/90 text-sm mt-1">{formatCustomer(o)}</p>
                    </div>
                    <p className="text-accent font-semibold">{formatPrice(o.total || 0)}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-white/50">
                      {o.items?.length || 0} items ·{' '}
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}
                    </span>
                    <select
                      value={o.status || 'pending'}
                      disabled={busy}
                      onChange={(e) => updateStatus(o, e.target.value)}
                      className={`admin-select capitalize text-sm ${statusColors[o.status] || statusColors.pending}`}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;
