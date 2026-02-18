import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { getMyAddress, getMyOrders, cancelOrder } from '../services/api';
import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', mobile: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (['orders', 'profile', 'addresses'].includes(tab)) setActiveTab(tab);
  }, [location.search]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await api.me();
      if (!userData?.user) throw new Error('No user data');
      const fullName = userData.user?.name || '';
      const parts = fullName.trim().split(/\s+/);
      setUser({
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        email: userData.user?.email || '',
        mobile: userData.user?.phone || ''
      });
      setIsAdmin(userData.user?.isAdmin || localStorage.getItem('auth_is_admin') === 'true');
    } catch (e) {
      navigate('/signin');
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const data = await getMyAddress();
      setAddresses(data?._id ? [data] : []);
    } catch {
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') {
      setLoadingOrders(true);
      getMyOrders().then((data) => {
        setOrders(Array.isArray(data) ? data : []);
      }).finally(() => setLoadingOrders(false));
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_is_admin');
    window.dispatchEvent(new Event('authStateChanged'));
    navigate('/signin');
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Cancel this order?')) return;
    try {
      await cancelOrder(orderId);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (e) {
      alert(e.message || 'Failed to cancel');
    }
  };

  const StatusBadge = ({ status }) => {
    const s = String(status || '').toLowerCase();
    const styles = {
      created: 'bg-amber-100 text-amber-700',
      confirmed: 'bg-blue-100 text-blue-700',
      on_the_way: 'bg-indigo-100 text-indigo-700',
      delivered: 'bg-emerald-100 text-emerald-700',
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[s] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
  };

  const canCancel = (s) => ['pending', 'created', 'paid'].includes(String(s || '').toLowerCase());

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const displayName = user.firstName || user.email || user.mobile || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'orders', label: 'Orders' },
    { id: 'addresses', label: 'Addresses' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-teal-600 flex items-center justify-center text-white text-xl md:text-2xl font-semibold shrink-0">
            {initial}
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white rounded-lg shadow-sm mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === t.id ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Admin Link */}
        {isAdmin && (
          <Link
            to="/admin"
            className="flex items-center gap-2 mb-6 py-3 px-4 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Admin Dashboard
          </Link>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <section className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">First Name</label>
                  <div className="px-3 py-2.5 bg-gray-50 rounded-lg text-sm text-gray-900">{user.firstName || '—'}</div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Last Name</label>
                  <div className="px-3 py-2.5 bg-gray-50 rounded-lg text-sm text-gray-900">{user.lastName || '—'}</div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Address
              </h2>
              <div className="px-3 py-2.5 bg-gray-50 rounded-lg text-sm text-gray-900">{user.email || '—'}</div>
            </section>

            <section className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Mobile Number
              </h2>
              <div className="px-3 py-2.5 bg-gray-50 rounded-lg text-sm text-gray-900">{user.mobile || '—'}</div>
            </section>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Your Orders</h2>
            {loadingOrders ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs text-gray-500">ID: {String(order._id).slice(-8)}</span>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={order.status} />
                        <span className="font-semibold text-gray-900">₹{order.amount}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{new Date(order.createdAt).toLocaleString()}</p>
                    <div className="space-y-2 mb-3">
                      {order.items?.map((it, i) => (
                        <div key={i} className="flex gap-3 text-sm">
                          <img src={it.product?.images?.image1} alt="" className="w-12 h-12 object-cover rounded" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{it.product?.title}</p>
                            <p className="text-gray-500">Qty: {it.quantity}{it.size && ` • Size: ${it.size}`}</p>
                          </div>
                          <span className="font-medium">₹{(it.price || 0) * (it.quantity || 1)}</span>
                        </div>
                      ))}
                    </div>
                    {canCancel(order.status) && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="w-full py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No orders yet.</p>
                <button onClick={() => navigate('/')} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium">
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">My Addresses</h2>
            {loadingAddresses ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
              </div>
            ) : addresses.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {addresses.map((addr, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">{addr.fullName}</span>
                      {addr.addressType && <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded capitalize">{addr.addressType}</span>}
                    </div>
                    <p className="text-sm text-gray-600">{addr.locality}, {addr.address}</p>
                    {addr.landmark && <p className="text-sm text-gray-600">{addr.landmark}</p>}
                    <p className="text-sm text-gray-600 mt-1">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-sm text-gray-600 mt-1">{addr.mobileNumber}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No addresses saved.</p>
                <Link to="/checkout/address" className="inline-block px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium">
                  Add Address
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 py-3 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}
