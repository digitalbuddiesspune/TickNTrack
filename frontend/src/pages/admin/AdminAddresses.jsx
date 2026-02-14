import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';

const AdminAddresses = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.admin.listAddresses();
        if (mounted) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || 'Failed to load addresses');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-semibold text-slate-800">User Addresses</h2>
        </div>
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-slate-600 text-sm">Loading addresses...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-red-600 font-medium">{error}</div>
        ) : (
          <>
            <div className="sm:hidden divide-y divide-slate-100">
              {rows.map(a => (
                <div key={a._id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{a.userId?.name || a.fullName}</span>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 border border-teal-200">{a.addressType}</span>
                  </div>
                  <p className="text-xs text-slate-500">{a.userId?.email || ''}</p>
                  <p className="text-sm text-slate-600">{a.mobileNumber || a.alternatePhone || '—'}</p>
                  <p className="text-sm text-slate-700">{a.address}{a.landmark ? `, ${a.landmark}` : ''}</p>
                  <p className="text-xs text-slate-500">{a.city}, {a.state} – {a.pincode}</p>
                  <p className="text-xs text-slate-400">{a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}</p>
                </div>
              ))}
            </div>
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-600 bg-slate-50/80">
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Address</th>
                    <th className="px-4 py-3 font-medium">City / State</th>
                    <th className="px-4 py-3 font-medium">Pincode</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(a => (
                    <tr key={a._id} className="border-t border-slate-100 hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{a.userId?.name || a.fullName}</div>
                        <div className="text-slate-500 text-xs">{a.userId?.email || ''}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{a.mobileNumber || a.alternatePhone || '—'}</td>
                      <td className="px-4 py-3 max-w-[240px] text-slate-700">{a.address}{a.landmark ? `, ${a.landmark}` : ''}</td>
                      <td className="px-4 py-3 text-slate-600">{a.city}, {a.state}</td>
                      <td className="px-4 py-3 text-slate-600">{a.pincode}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">{a.addressType}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{a.createdAt ? new Date(a.createdAt).toLocaleString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAddresses;
