import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiBox, FiShoppingBag, FiLogOut, FiSearch, FiUser, FiMapPin, FiMenu, FiX } from 'react-icons/fi';

const Title = () => {
  const { pathname } = useLocation();
  if (pathname === '/admin') return 'Dashboard';
  if (pathname.startsWith('/admin/products')) return 'Products';
  if (pathname.startsWith('/admin/orders')) return 'Orders';
  if (pathname.startsWith('/admin/addresses')) return 'Addresses';
  return 'Admin';
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_is_admin');
    } catch {}
    navigate('/signin', { replace: true });
  };

  const navItem = (to, label, Icon) => (
    <NavLink
      to={to}
      end={to === '/admin'}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ' +
        (isActive
          ? 'bg-teal-500/20 text-teal-100 border border-teal-400/30'
          : 'text-slate-300 hover:bg-white/10 hover:text-white border border-transparent')
      }
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span>{label}</span>
    </NavLink>
  );

  const sidebarContent = (
    <>
      <div className="px-4 pt-2 pb-4 border-b border-slate-600/50">
        <span className="text-xl font-bold text-white tracking-tight">TickNTrack</span>
        <span className="block text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">Admin Panel</span>
      </div>
      <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto">
        {navItem('/admin', 'Dashboard', FiGrid)}
        {navItem('/admin/products', 'Products', FiBox)}
        {navItem('/admin/orders', 'Orders', FiShoppingBag)}
        {navItem('/admin/addresses', 'Addresses', FiMapPin)}
      </nav>
      <div className="pt-4 border-t border-slate-600/50">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-red-500/20 hover:text-red-200 border border-transparent hover:border-red-400/30 transition-all duration-200"
        >
          <FiLogOut className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col bg-gradient-to-b from-slate-800 to-slate-900 text-white p-4 shadow-2xl">
          {sidebarContent}
        </aside>

        {/* Mobile overlay + sidebar */}
        {open && (
          <div className="md:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
            <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] flex flex-col bg-gradient-to-b from-slate-800 to-slate-900 text-white p-4 shadow-2xl">
              <div className="flex items-center justify-between px-2 py-2 border-b border-slate-600/50">
                <span className="text-lg font-bold">Menu</span>
                <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-white/10 text-slate-300">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              {sidebarContent}
            </aside>
          </div>
        )}

        {/* Main */}
        <div className="flex-1 min-w-0 md:ml-64 min-h-screen flex flex-col">
          <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center gap-3 shadow-sm">
            <button
              type="button"
              className="md:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-slate-800 mr-auto">{<Title />}</h1>
            <div className="hidden sm:flex items-center bg-slate-100 rounded-xl px-3 py-2 w-48 max-w-xs">
              <FiSearch className="text-slate-400 w-4 h-4 flex-shrink-0" />
              <input
                type="search"
                className="bg-transparent px-2 py-0.5 outline-none text-sm text-slate-700 placeholder-slate-400 w-full"
                placeholder="Search..."
              />
            </div>
            <div className="h-9 w-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <FiUser className="w-4 h-4" />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
