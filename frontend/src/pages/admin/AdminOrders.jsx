import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../../utils/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [updatingId, setUpdatingId] = useState('');
  const [tempStatus, setTempStatus] = useState({});
  const [toast, setToast] = useState({ show: false, text: '', type: 'success' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.admin.listOrders();
        if (mounted) setOrders(data || []);
      } catch (e) {
        setError(e.message || 'Failed to load orders');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const StatusBadge = ({ paymentStatus }) => {
    const cls = paymentStatus === 'paid'
      ? 'bg-teal-100 text-teal-800 border-teal-200'
      : paymentStatus === 'failed'
      ? 'bg-red-100 text-red-800 border-red-200'
      : 'bg-slate-100 text-slate-700 border-slate-200';
    return (
      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${cls}`}>
        {paymentStatus || 'pending'}
      </span>
    );
  };

  const renderAddress = (a) => {
    if (!a) return <span className="text-slate-400">No address</span>;
    return (
      <div className="max-w-xs text-sm">
        <div className="font-medium text-slate-800">{a.fullName}</div>
        <div className="text-slate-500 text-xs">{a.mobileNumber || a.alternatePhone}</div>
        <div className="text-slate-600 line-clamp-2">{a.address}{a.landmark ? `, ${a.landmark}` : ''}</div>
        <div className="text-slate-500 text-xs">{a.city}, {a.state} – {a.pincode}</div>
      </div>
    );
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = orders;
    if (status !== 'all') arr = arr.filter(o => String(o.status || '').toLowerCase() === status);
    if (q) arr = arr.filter(o =>
      String(o.user?.name || '').toLowerCase().includes(q) ||
      String(o.user?.email || '').toLowerCase().includes(q) ||
      String(o._id || '').toLowerCase().includes(q)
    );
    return arr;
  }, [orders, query, status]);
  const totalPages = Math.max(1, Math.ceil((filtered.length || 0) / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);
  useEffect(() => { setPage(1); }, [query, status, pageSize]);

  const statusOptions = [
    { value: 'created', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'on_the_way', label: 'On the way' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'failed', label: 'Failed' },
    { value: 'paid', label: 'Paid' },
  ];

  const getTemp = (id, fallback) => (tempStatus[id] ?? fallback ?? 'created');
  const changeTemp = (id, v) => setTempStatus(prev => ({ ...prev, [id]: v }));

  const saveStatus = async (id) => {
    const order = orders.find(o => o._id === id);
    const newStatus = getTemp(id, order?.status);
    if (!order || String(order.status) === String(newStatus)) return;
    setUpdatingId(id);
    const prev = order.status;
    setOrders(os => os.map(o => o._id === id ? { ...o, status: newStatus } : o));
    try {
      await api.admin.updateOrderStatus(id, newStatus);
      setToast({ show: true, text: 'Status updated', type: 'success' });
    } catch (e) {
      setOrders(os => os.map(o => o._id === id ? { ...o, status: prev } : o));
      setToast({ show: true, text: e.message || 'Failed to update status', type: 'error' });
    } finally {
      setUpdatingId('');
      setTimeout(() => setToast(t => ({ ...t, show: false })), 2000);
    }
  };

  const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Paid', value: 'paid' },
    { label: 'Pending', value: 'created' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'On the way', value: 'on_the_way' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Failed', value: 'failed' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'error' ? 'bg-red-500' : 'bg-teal-600'}`}>
          {toast.text}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl bg-white border border-slate-200 p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-slate-600">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-red-700 font-medium">{error}</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-semibold text-slate-800">Orders</h2>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setStatus(tab.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    status === tab.value
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by customer, email, or order id"
                className="w-full sm:max-w-sm rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Rows</span>
                <select
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-slate-100">
            {pageItems.map((o) => (
              <div key={o._id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-slate-800">#{String(o._id).slice(-6)}</span>
                  <span className="text-sm font-medium">₹{Number(o.amount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="text-sm text-slate-600">{o.user?.name || '—'}</div>
                <div className="text-xs text-slate-500">{o.user?.email || ''}</div>
                <div className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString()}</div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Status</label>
                    <select
                      className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm"
                      value={getTemp(o._id, o.status)}
                      onChange={(e) => changeTemp(o._id, e.target.value)}
                    >
                      {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Payment</label>
                    <StatusBadge paymentStatus={o.status === 'failed' ? 'failed' : o.razorpayPaymentId ? 'paid' : 'pending'} />
                  </div>
                </div>
                <button
                  onClick={() => saveStatus(o._id)}
                  disabled={updatingId === o._id || String(getTemp(o._id, o.status)) === String(o.status)}
                  className="w-full py-2.5 rounded-xl font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingId === o._id ? 'Saving...' : 'Save'}
                </button>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-600 bg-slate-50/80">
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Address</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Items</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((o) => (
                  <tr key={o._id} className="border-t border-slate-100 hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-800">#{String(o._id).slice(-6)}</td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <div className="truncate">{o.user?.name || '—'}</div>
                      <div className="text-slate-500 text-xs truncate">{o.user?.email || ''}</div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell max-w-[280px]">{renderAddress(o.address)}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{o.items?.length || 0}</td>
                    <td className="px-4 py-3 font-medium">₹{Number(o.amount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <select
                        className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                        value={getTemp(o._id, o.status)}
                        onChange={(e) => changeTemp(o._id, e.target.value)}
                      >
                        {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge paymentStatus={o.status === 'failed' ? 'failed' : o.razorpayPaymentId ? 'paid' : 'pending'} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => saveStatus(o._id)}
                        disabled={updatingId === o._id || String(getTemp(o._id, o.status)) === String(o.status)}
                        className="px-3 py-1.5 rounded-lg font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-xs"
                      >
                        {updatingId === o._id ? 'Saving...' : 'Save'}
                      </button>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-slate-600 whitespace-nowrap">{new Date(o.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <p className="text-sm text-slate-600">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
