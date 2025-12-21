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
    const paymentCls = paymentStatus === 'paid' 
      ? 'bg-green-100 text-green-700 border border-green-200'
      : paymentStatus === 'failed'
      ? 'bg-red-100 text-red-700 border border-red-200'
      : 'bg-gray-100 text-gray-700 border border-gray-200';
    
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${paymentCls} text-center`}>
        {paymentStatus || 'pending'}
      </span>
    );
  };

  const renderAddress = (a) => {
    if (!a) return <span className="text-gray-400">No address</span>;
    return (
      <div className="max-w-xs">
        <div className="font-medium">{a.fullName}</div>
        <div className="text-gray-600 text-xs">{a.mobileNumber || a.alternatePhone}</div>
        <div className="text-gray-700 text-sm line-clamp-2">{a.address}{a.landmark ? `, ${a.landmark}` : ''}</div>
        <div className="text-gray-500 text-xs">{a.city}, {a.state} - {a.pincode}</div>
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

  return (
    <div className="max-w-7xl mx-auto p-4">
      {toast.show && (
        <div className={`${toast.type==='error' ? 'bg-rose-600' : 'bg-amber-600'} fixed bottom-4 right-4 z-50 text-white px-4 py-2 rounded shadow-lg`}>{toast.text}</div>
      )}
      {loading ? (
        <div className="p-4">Loading...</div>
      ) : error ? (
        <div className="p-4 text-red-600">{error}</div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm ring-1 ring-rose-50">
          <div className="px-4 py-3 border-b font-semibold">Orders</div>
          <div className="p-4 space-y-3">
            <div className="-mx-1 overflow-x-auto">
              <div className="flex gap-2 px-1 min-w-max whitespace-nowrap">
                {[
                  { label: 'All Orders', value: 'all' },
                  { label: 'On the way', value: 'on_the_way' },
                  { label: 'Pending', value: 'created' },
                  { label: 'Confirmed', value: 'confirmed' },
                  { label: 'Delivered', value: 'delivered' },
                  { label: 'Failed', value: 'failed' },
                  { label: 'Paid', value: 'paid' },
                ].map(tab => (
                  <button
                    key={tab.value}
                    onClick={() => setStatus(tab.value)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      status === tab.value
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-rose-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search by customer, email, or order id" className="w-full sm:max-w-sm border rounded px-3 py-2" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows</span>
                <select className="border rounded px-2 py-1" value={pageSize} onChange={(e)=>setPageSize(Number(e.target.value))}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>
          </div>
          <div className="sm:hidden divide-y">
            {pageItems.map((o) => (
              <div key={o._id} className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">#{String(o._id).slice(-6)}</div>
                  <div className="text-sm text-gray-600">₹{Number(o.amount || 0).toLocaleString('en-IN')}</div>
                </div>
                <div className="text-sm text-gray-700">{o.user?.name || ''}</div>
                <div className="text-xs text-gray-500">{o.user?.email || ''}</div>
                <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Order Status</div>
                    <div className="flex items-center gap-2">
                      <select
                        className="border rounded px-2 py-1 text-sm w-full"
                        value={getTemp(o._id, o.status)}
                        onChange={(e)=>changeTemp(o._id, e.target.value)}
                      >
                        {statusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Payment Status</div>
                    <div className="flex items-center h-[34px]">
                      <StatusBadge 
                        paymentStatus={o.status === 'failed' ? 'failed' : o.razorpayPaymentId ? 'paid' : 'pending'}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={()=>saveStatus(o._id)}
                    disabled={updatingId===o._id || String(getTemp(o._id, o.status))===String(o.status)}
                    className={`px-3 py-1 rounded text-white text-sm ${updatingId===o._id ? 'bg-gray-400' : 'bg-rose-600 hover:bg-rose-700'} disabled:opacity-60`}
                  >
                    {updatingId===o._id ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-rose-50/60 text-rose-700">
                <tr className="text-left border-b border-rose-100">
                  <th className="p-2 whitespace-nowrap">Order</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2 hidden lg:table-cell">Address</th>
                  <th className="p-2 hidden md:table-cell">Items</th>
                  <th className="p-2 whitespace-nowrap">Amount</th>
                  <th className="p-2">Order Status</th>
                  <th className="p-2">Payment Status</th>
                  <th className="p-2">Actions</th>
                  <th className="p-2 hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
              {pageItems.map((o) => (
                <tr key={o._id} className="border-b hover:bg-rose-50/40">
                  <td className="p-2 whitespace-nowrap">#{String(o._id).slice(-6)}</td>
                  <td className="p-2 max-w-[220px]">
                    <div className="truncate">{o.user?.name || ''}</div>
                    <div className="text-gray-500 text-xs truncate">{o.user?.email || ''}</div>
                  </td>
                  <td className="p-2 hidden lg:table-cell max-w-[320px]">
                    <div className="text-sm text-gray-700 line-clamp-1">{renderAddress(o.address)}</div>
                  </td>
                  <td className="p-2 hidden md:table-cell">{o.items?.length || 0}</td>
                  <td className="p-2 whitespace-nowrap">₹{Number(o.amount || 0).toLocaleString('en-IN')}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={getTemp(o._id, o.status)}
                        onChange={(e)=>changeTemp(o._id, e.target.value)}
                      >
                        {statusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        getTemp(o._id, o.status) === 'created' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        getTemp(o._id, o.status) === 'confirmed' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                        getTemp(o._id, o.status) === 'on_the_way' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                        getTemp(o._id, o.status) === 'delivered' ? 'bg-green-100 text-green-700 border border-green-200' :
                        getTemp(o._id, o.status) === 'failed' ? 'bg-rose-200 text-rose-800 border border-rose-300' :
                        'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {String(getTemp(o._id, o.status) || '').replace(/_/g, ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="p-2">
                    <StatusBadge 
                      paymentStatus={o.status === 'failed' ? 'failed' : o.razorpayPaymentId ? 'paid' : 'pending'}
                    />
                  </td>
                  <td className="p-2">
                    <button
                      onClick={()=>saveStatus(o._id)}
                      disabled={updatingId===o._id || String(getTemp(o._id, o.status))===String(o.status)}
                      className={`px-3 py-1 rounded text-white ${updatingId===o._id ? 'bg-gray-400' : 'bg-rose-600 hover:bg-rose-700'} disabled:opacity-60`}
                    >
                      {updatingId===o._id ? 'Saving...' : 'Save'}
                    </button>
                  </td>
                  <td className="p-2 hidden lg:table-cell whitespace-nowrap">{new Date(o.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
            <div className="flex gap-2">
              <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className={`px-3 py-1 rounded border ${page<=1? 'text-gray-400 bg-gray-50' : 'hover:bg-gray-50'}`}>Prev</button>
              <button disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className={`px-3 py-1 rounded border ${page>=totalPages? 'text-gray-400 bg-gray-50' : 'hover:bg-gray-50'}`}>Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
