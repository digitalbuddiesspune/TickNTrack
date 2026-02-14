import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { FiDollarSign, FiShoppingBag, FiBox, FiActivity, FiArrowRight } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.admin.stats();
        const orders = await api.admin.listOrders();
        if (mounted) {
          setStats(data || { totalRevenue: 0, totalOrders: 0, totalProducts: 0 });
          setRecentOrders(Array.isArray(orders) ? orders.slice(0, 6) : []);
        }
      } catch (e) {
        setError(e.message || 'Failed to load dashboard');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  const StatusBadge = ({ status }) => {
    const s = String(status || '').toLowerCase();
    const map = {
      created: 'bg-amber-100 text-amber-800 border-amber-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      on_the_way: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      paid: 'bg-teal-100 text-teal-800 border-teal-200',
      cancelled: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    const cls = map[s] || 'bg-slate-100 text-slate-700 border-slate-200';
    return <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${cls}`}>{status}</span>;
  };

  const StatCard = ({ icon: Icon, label, value, colorClass }) => (
    <div className={`rounded-2xl p-5 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow ${colorClass}`}>
      <div className="flex items-start justify-between">
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${colorClass.includes('teal') ? 'bg-teal-100 text-teal-600' : colorClass.includes('slate') ? 'bg-slate-100 text-slate-600' : 'bg-slate-100 text-slate-600'}`}>
          <Icon className="h-6 w-6" />
        </div>
        <span className="text-2xl font-bold text-slate-800">{value}</span>
      </div>
      <p className="mt-3 text-sm font-medium text-slate-600">{label}</p>
    </div>
  );

  const activity = recentOrders.map(o => ({
    id: o._id,
    text: `${o.user?.name || 'Customer'} placed order #${String(o._id).slice(-6)}`,
    time: new Date(o.createdAt).toLocaleString()
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Welcome, Admin!</h1>
        <div className="flex gap-3">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors shadow-sm"
          >
            Manage Products
            <FiArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm"
          >
            View Orders
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white border border-slate-200 p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-slate-600">Loading dashboard...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-red-700 font-medium">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={FiDollarSign} label="Total Revenue" value={formatINR(stats.totalRevenue)} colorClass="border-teal-100" />
            <StatCard icon={FiShoppingBag} label="Total Orders" value={stats.totalOrders} colorClass="border-slate-100" />
            <StatCard icon={FiBox} label="Total Products" value={stats.totalProducts} colorClass="border-slate-100" />
            <StatCard icon={FiActivity} label="Recent (sample)" value={recentOrders.length} colorClass="border-slate-100" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="font-semibold text-slate-800">Recent Orders</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {recentOrders.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No orders yet</div>
                ) : (
                  <>
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-600 bg-slate-50/80">
                            <th className="px-4 py-3 font-medium">Order</th>
                            <th className="px-4 py-3 font-medium">Customer</th>
                            <th className="px-4 py-3 font-medium">Items</th>
                            <th className="px-4 py-3 font-medium">Amount</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map(o => (
                            <tr key={o._id} className="border-t border-slate-100 hover:bg-slate-50/50">
                              <td className="px-4 py-3 font-medium text-slate-800">#{String(o._id).slice(-6)}</td>
                              <td className="px-4 py-3">
                                <div>{o.user?.name || '—'}</div>
                                <div className="text-slate-500 text-xs">{o.user?.email || ''}</div>
                              </td>
                              <td className="px-4 py-3">{o.items?.length || 0}</td>
                              <td className="px-4 py-3 font-medium">{formatINR(o.amount)}</td>
                              <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                              <td className="px-4 py-3 text-slate-600">{new Date(o.createdAt).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="sm:hidden divide-y divide-slate-100">
                      {recentOrders.map(o => (
                        <div key={o._id} className="p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-slate-800">#{String(o._id).slice(-6)}</span>
                            <StatusBadge status={o.status} />
                          </div>
                          <div className="text-sm text-slate-600">{o.user?.name || '—'}</div>
                          <div className="text-sm font-medium">{formatINR(o.amount)}</div>
                          <div className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="font-semibold text-slate-800">Activity</h2>
              </div>
              <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                {activity.length === 0 ? (
                  <p className="text-sm text-slate-500">No recent activity</p>
                ) : (
                  activity.map(a => (
                    <div key={a.id} className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-slate-700">{a.text}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
