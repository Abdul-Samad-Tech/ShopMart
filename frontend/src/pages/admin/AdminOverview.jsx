import { useEffect, useState } from 'react';
import { DollarSign, Package, ShoppingBag, Users, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { apiEndpoints } from '../../services/api';
import StatCard from '../../components/admin/StatCard';
import Loader from '../../components/common/Loader';

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiEndpoints
      .getAdminStats()
      .then(({ data }) => setStats(data))
      .catch((e) => setError(e.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading admin dashboard" />;
  if (error) {
    return (
      <div className="admin-glass p-8 text-center">
        <p className="text-red-300">{error}</p>
        <p className="text-sm text-white/50 mt-2">Sign in as admin@shophub.com after running npm run seed</p>
      </div>
    );
  }

  const statusData = stats.ordersByStatus || [];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl text-white mb-1">Dashboard</h1>
        <p className="text-white/50 text-sm">Store performance at a glance</p>
      </header>

      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard label="Revenue" value={`$${stats.revenue?.toFixed(0) || 0}`} icon={DollarSign} />
        <StatCard label="Orders" value={stats.orders} sub={`${stats.ordersLast30} last 30 days`} icon={ShoppingBag} />
        <StatCard label="Products" value={stats.products} icon={Package} />
        <StatCard label="Customers" value={stats.users} icon={Users} />
        <Link to="/admin/messages" className="block">
          <StatCard
            label="Messages"
            value={stats.contactMessages ?? 0}
            sub={stats.unreadMessages ? `${stats.unreadMessages} unread` : 'Contact inbox'}
            icon={MessageSquare}
          />
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="admin-glass p-6">
          <h2 className="font-display text-lg mb-4 text-white">Revenue (30 days)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.salesByDay || []}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#1a1816', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#a78bfa" fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-glass p-6">
          <h2 className="font-display text-lg mb-4 text-white">Orders by status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="status" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#1a1816', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                />
                <Bar dataKey="count" fill="#c9a227" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="admin-glass p-6 overflow-x-auto">
        <h2 className="font-display text-lg mb-4 text-white">Recent orders</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {(stats.recentOrders || []).map((o) => (
              <tr key={o.id}>
                <td>#{o.orderId || o.id?.slice(-6).toUpperCase()}</td>
                <td>{o.userName || o.userEmail}</td>
                <td className="capitalize">{o.status}</td>
                <td>${o.total?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOverview;
