import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../../utils/api';
import { FiEdit, FiTrash2, FiX, FiPlus } from 'react-icons/fi';
import { CATEGORIES } from '../../constants/categories.js';

const AdminProducts = () => {
  const [form, setForm] = useState({
    title: '',
    mrp: '',
    discountPercent: 0,
    description: '',
    category: '',
    images: { image1: '' },
    product_info: { brand: '', manufacturer: '', SareeLength: '', SareeMaterial: '', SareeColor: '', IncludedComponents: '' },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    _id: '',
    mrp: '',
    discountPercent: 0,
    price: ''
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, text: '', type: 'success' });

  const load = async (options = {}) => {
    const showLoading = options.showLoading !== false;
    try {
      if (showLoading) setLoading(true);
      const data = await api.admin.listProducts();
      setList(data || []);
      if (!showLoading) setError('');
    } catch (e) {
      setError(e.message || 'Failed to load products');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeNested = (section, key) => (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [section]: { ...(prev[section] || {}), [key]: value } }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        mrp: Number(form.mrp),
        discountPercent: Number(form.discountPercent) || 0,
        description: form.description,
        category: form.category,
        images: form.images,
        product_info: form.product_info,
      };
      await api.admin.createProduct(payload);
      setToast({ show: true, text: 'Product created', type: 'success' });
      setForm({ title: '', mrp: '', discountPercent: 0, description: '', category: '', images: { image1: '' }, product_info: { brand: '', manufacturer: '', SareeLength: '', SareeMaterial: '', SareeColor: '', IncludedComponents: '' } });
      setIsCreateModalOpen(false);
      await load({ showLoading: false });
    } catch (e2) {
      setError(e2.message || 'Failed to create product');
      setToast({ show: true, text: e2.message || 'Failed to create product', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(t => ({ ...t, show: false })), 2000);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.admin.deleteProduct(id);
      setList((prev) => prev.filter((p) => p._id !== id));
      setToast({ show: true, text: 'Product deleted', type: 'success' });
    } catch (e) {
      setError(e.message || 'Failed to delete product');
      setToast({ show: true, text: e.message || 'Failed to delete product', type: 'error' });
    }
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2000);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditForm({
      _id: product._id,
      mrp: product.mrp,
      discountPercent: product.discountPercent || 0,
      price: Math.round(product.mrp - (product.mrp * (product.discountPercent || 0)) / 100)
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setEditForm({ _id: '', mrp: '', discountPercent: 0, price: '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => {
      const updated = { ...prev, [name]: value };
      // Auto-calculate price if MRP or discount changes
      if ((name === 'mrp' || name === 'discountPercent') && updated.mrp) {
        const mrp = name === 'mrp' ? parseFloat(value) || 0 : parseFloat(prev.mrp) || 0;
        const discount = name === 'discountPercent' ? parseFloat(value) || 0 : parseFloat(prev.discountPercent) || 0;
        updated.price = Math.round(mrp - (mrp * discount) / 100);
      }
      return updated;
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.admin.updateProduct(editForm._id, {
        mrp: Number(editForm.mrp),
        discountPercent: Number(editForm.discountPercent) || 0
      });
      setToast({ show: true, text: 'Product updated', type: 'success' });
      await load({ showLoading: false });
      closeEditModal();
    } catch (e) {
      setError(e.message || 'Failed to update product');
      setToast({ show: true, text: e.message || 'Failed to update product', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(t => ({ ...t, show: false })), 2000);
    }
  };

  const priceFor = (p) => {
    if (p.price !== undefined) return p.price;
    return Math.round((p.mrp || 0) - (p.mrp || 0) * ((p.discountPercent || 0) / 100));
  };

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSubcategory, setFilterSubcategory] = useState('');
  const [filterSort, setFilterSort] = useState('newest');
  const [filterType, setFilterType] = useState('');

  const selectedCategory = useMemo(
    () => CATEGORIES.find((c) => (c.name || '').trim() === (filterCategory || '').trim()),
    [filterCategory]
  );
  const subcategoriesForDropdown = useMemo(
    () => (selectedCategory?.subcategories || []),
    [selectedCategory]
  );

  const uniqueTypes = useMemo(() => {
    const set = new Set();
    (list || []).forEach(p => {
      const info = p.product_info || {};
      const t = info.shoeType || info.watchType || info.watchBrand || info.brand || '';
      const s = (typeof t === 'string' ? t : '').trim();
      if (s) set.add(s);
    });
    return ['', ...Array.from(set).sort()];
  }, [list]);

  const filtered = useMemo(() => {
    let arr = list || [];
    const q = query.trim().toLowerCase();
    if (q) {
      arr = arr.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      );
    }
    if (filterCategory) {
      const cat = CATEGORIES.find((c) => (c.name || '').trim().toLowerCase() === filterCategory.trim().toLowerCase());
      const subNames = (cat?.subcategories || []).map((s) => (s.name || '').trim().toLowerCase());
      const matchNames = [filterCategory.trim().toLowerCase(), ...subNames];
      arr = arr.filter((p) => matchNames.includes((p.category || '').trim().toLowerCase()));
    }
    if (filterSubcategory) {
      arr = arr.filter((p) => (p.category || '').trim().toLowerCase() === filterSubcategory.trim().toLowerCase());
    }
    if (filterType) {
      arr = arr.filter((p) => {
        const info = p.product_info || {};
        const t = (info.shoeType || info.watchType || info.watchBrand || info.brand || '').toString().toLowerCase();
        return t === filterType.toLowerCase();
      });
    }
    if (filterSort === 'newest') {
      arr = [...arr].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (filterSort === 'oldest') {
      arr = [...arr].sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    }
    return arr;
  }, [list, query, filterCategory, filterSubcategory, filterSort, filterType]);

  const totalPages = Math.max(1, Math.ceil((filtered.length || 0) / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const hasActiveFilters = filterCategory || filterSubcategory || filterSort !== 'newest' || filterType;
  const clearFilters = () => {
    setFilterCategory('');
    setFilterSubcategory('');
    setFilterSort('newest');
    setFilterType('');
    setQuery('');
    setPage(1);
  };

  useEffect(() => { setPage(1); }, [query, pageSize, filterCategory, filterSubcategory, filterSort, filterType]);

  return (
    <div className="max-w-7xl mx-auto">
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${toast.type === 'error' ? 'bg-red-500' : 'bg-teal-600'}`}>{toast.text}</div>
      )}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="font-semibold text-slate-800">Products</h2>
            <button
              type="button"
              onClick={() => { setError(''); setIsCreateModalOpen(true); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white bg-teal-600 hover:bg-teal-700 shadow-sm"
            >
              <FiPlus className="w-5 h-5" />
              Create Product
            </button>
          </div>
          <div className="p-4 flex flex-col flex-1 min-h-0">
            <div className="flex flex-col gap-4 pb-4 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search by title or category" className="w-full sm:max-w-xs border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-slate-600">Rows</span>
                  <select className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" value={pageSize} onChange={(e)=>setPageSize(Number(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  {hasActiveFilters && (
                    <button type="button" onClick={clearFilters} className="px-3 py-2 text-sm font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-xl hover:bg-teal-100">
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none min-w-[140px]" value={filterCategory} onChange={(e)=>{ setFilterCategory(e.target.value); setFilterSubcategory(''); }}>
                  <option value="">Category: All</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.name} value={(c.name || '').trim()}>{(c.name || '').trim()}</option>
                  ))}
                </select>
                <select className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none min-w-[140px]" value={filterSubcategory} onChange={(e)=>setFilterSubcategory(e.target.value)}>
                  <option value="">Subcategory: All</option>
                  {subcategoriesForDropdown.map((s) => (
                    <option key={s.name} value={(s.name || '').trim()}>{(s.name || '').trim()}</option>
                  ))}
                </select>
                <select className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none min-w-[140px]" value={filterSort} onChange={(e)=>setFilterSort(e.target.value)}>
                  <option value="newest">Newest added</option>
                  <option value="oldest">Oldest added</option>
                </select>
                <select className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none min-w-[140px]" value={filterType} onChange={(e)=>setFilterType(e.target.value)}>
                  <option value="">Type: All</option>
                  {uniqueTypes.filter(Boolean).map(t => <option key={t} value={t}>Type: {t}</option>)}
                </select>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <p className="mt-3 text-slate-600 text-sm">Loading products...</p>
              </div>
            ) : (
              <>
                <div className="sm:hidden divide-y divide-slate-100">
                  {pageItems.map((p) => (
                    <div key={p._id} className="p-4 flex gap-4">
                      <img src={p?.images?.image1} alt="" className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-slate-500">{p.category || 'Uncategorized'}</div>
                        <div className="font-medium text-slate-800 line-clamp-2">{p.title}</div>
                        <div className="mt-1 text-sm flex items-center gap-2 flex-wrap">
                          <span className="font-medium">₹{priceFor(p).toLocaleString('en-IN')}</span>
                          <span className="text-slate-400 line-through">₹{(p.mrp || 0).toLocaleString('en-IN')}</span>
                          <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-teal-100 text-teal-800 border border-teal-200">{p.discountPercent || 0}% off</span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => openEditModal(p)} className="px-3 py-1.5 text-teal-700 border border-teal-200 rounded-lg text-sm font-medium hover:bg-teal-50">Edit</button>
                          <button onClick={() => remove(p._id)} className="px-3 py-1.5 text-white bg-red-500 rounded-lg text-sm font-medium hover:bg-red-600">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-600 bg-slate-50/80">
                        <th className="px-4 py-3 font-medium">Image</th>
                        <th className="px-4 py-3 font-medium">Title</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">Price</th>
                        <th className="px-4 py-3 font-medium hidden md:table-cell whitespace-nowrap">MRP</th>
                        <th className="px-4 py-3 font-medium hidden md:table-cell">Discount</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((p) => (
                        <tr key={p._id} className="border-t border-slate-100 hover:bg-slate-50/50">
                          <td className="px-4 py-3"><img src={p?.images?.image1} alt="" className="w-12 h-12 object-cover rounded-lg" /></td>
                          <td className="px-4 py-3 max-w-[280px]"><div className="truncate text-slate-800">{p.title}</div></td>
                          <td className="px-4 py-3 font-medium whitespace-nowrap">₹{priceFor(p).toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 hidden md:table-cell whitespace-nowrap text-slate-600">₹{(p.mrp || 0).toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 hidden md:table-cell">{p.discountPercent || 0}%</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => openEditModal(p)} className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg" title="Edit"><FiEdit className="w-4 h-4" /></button>
                              <button onClick={() => remove(p._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><FiTrash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between py-4 border-t border-slate-100 mt-2">
                  <p className="text-sm text-slate-600">Page {page} of {totalPages}</p>
                  <div className="flex gap-2">
                    <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium disabled:opacity-50 hover:bg-slate-50">Prev</button>
                    <button disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium disabled:opacity-50 hover:bg-slate-50">Next</button>
                  </div>
                </div>
              </>
            )}
            </div>
          </div>
      </div>

      {/* Create Product Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl my-8">
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Create Product</h3>
              <button type="button" onClick={() => { setIsCreateModalOpen(false); setError(''); }} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submit} className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
              <input name="title" value={form.title} onChange={onChange} placeholder="Title" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" required />
              <input name="mrp" type="number" value={form.mrp} onChange={onChange} placeholder="MRP" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required />
              <input name="discountPercent" type="number" value={form.discountPercent} onChange={onChange} placeholder="Discount %" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
              <input name="category" value={form.category} onChange={onChange} placeholder="Category" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required />
              <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none resize-none" rows="2" />
              <input value={form.images.image1} onChange={onChangeNested('images','image1')} placeholder="Image URL" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none" required />
              <div className="grid grid-cols-2 gap-2">
                <input value={form.product_info.brand} onChange={onChangeNested('product_info','brand')} placeholder="Brand" className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                <input value={form.product_info.manufacturer} onChange={onChangeNested('product_info','manufacturer')} placeholder="Manufacturer" className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                <input value={form.product_info.SareeMaterial} onChange={onChangeNested('product_info','SareeMaterial')} placeholder="Material" className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                <input value={form.product_info.SareeColor} onChange={onChangeNested('product_info','SareeColor')} placeholder="Color" className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                <input value={form.product_info.SareeLength} onChange={onChangeNested('product_info','SareeLength')} placeholder="Length" className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                <input value={form.product_info.IncludedComponents} onChange={onChangeNested('product_info','IncludedComponents')} placeholder="Included" className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setIsCreateModalOpen(false); setError(''); }} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50">{saving ? 'Saving...' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Edit Product</h3>
              <button onClick={closeEditModal} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateProduct} className="p-5 space-y-4">
              {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">MRP (₹)</label>
                <input type="number" name="mrp" value={editForm.mrp} onChange={handleEditChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none" required min="1" step="0.01" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Discount (%)</label>
                <input type="number" name="discountPercent" value={editForm.discountPercent} onChange={handleEditChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none" min="0" max="100" step="1" />
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-sm text-slate-600">Selling Price</p>
                <p className="text-xl font-bold text-slate-800">₹{editForm.price ? editForm.price.toLocaleString('en-IN') : '0'}</p>
                <p className="text-xs text-slate-500 mt-0.5">MRP − {editForm.discountPercent}%</p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeEditModal} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50" disabled={saving}>Cancel</button>
                <button type="submit" className="px-4 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 disabled:opacity-50" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
