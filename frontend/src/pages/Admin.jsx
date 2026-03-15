import React, { useState, useEffect } from 'react'
import { Package, ShoppingBag, Users, IndianRupee, Plus, Edit2, Trash2, Eye, EyeOff, LogOut, BarChart2, RefreshCw, X, Image as ImageIcon, CheckCircle, Truck } from 'lucide-react'
import { formatPrice } from '../utils/products'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'GharAdmin@2026'

const STATUS_STYLES = {
  pending:   'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-blue-50 text-blue-700',
  shipped:   'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
}

// ── Admin Login Gate ─────────────────────────────
const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASS) {
      sessionStorage.setItem('gs_admin', '1')
      sessionStorage.setItem('gs_admin_pass', password)
      onLogin()
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-brown/20 flex items-center justify-center mx-auto mb-4">
            <BarChart2 size={28} className="text-gold" />
          </div>
          <h1 className="font-heading text-2xl text-white font-semibold italic">Admin Dashboard</h1>
          <p className="font-body text-sm text-white/40 mt-2">Ghar Sajaoo Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              placeholder="Enter admin password"
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/30 px-4 py-3 pr-12 font-body text-sm focus:outline-none focus:border-gold transition-colors"
              aria-label="Admin password"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p className="font-body text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            className="w-full bg-brown text-white py-3 font-body text-xs tracking-widest uppercase hover:bg-brown-dark transition-colors"
          >
            Sign In to Dashboard
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Product Modal ────────────────────────────────
const ProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    original_price: '',
    category: 'Wall Decor',
    stock: '',
    image_url: '',
    badge: '',
    description: '',
  })

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name || '',
        slug: product.slug || '',
        price: product.price || '',
        original_price: product.original_price || '',
        category: product.category || 'Wall Decor',
        stock: product.stock || '',
        image_url: product.image_url || '',
        badge: product.badge || '',
        description: product.description || '',
      })
    } else {
      setFormData({
        name: '',
        slug: '',
        price: '',
        original_price: '',
        category: 'Wall Decor',
        stock: '',
        image_url: '',
        badge: '',
        description: '',
      })
    }
  }, [product, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-heading text-xl font-semibold text-dark">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-dark">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block font-body text-[10px] uppercase tracking-widest text-textbrown/60 mb-1.5">Product Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-2 font-body text-sm focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block font-body text-[10px] uppercase tracking-widest text-textbrown/60 mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-2 font-body text-sm focus:outline-none focus:border-gold"
                >
                  {['Wall Decor', 'Canvas Art', 'Vases', 'Lighting', 'Textiles'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-body text-[10px] uppercase tracking-widest text-textbrown/60 mb-1.5">Price (₹)</label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border border-gray-200 px-4 py-2 font-body text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block font-body text-[10px] uppercase tracking-widest text-textbrown/60 mb-1.5">Stock</label>
                  <input
                    required
                    type="number"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full border border-gray-200 px-4 py-2 font-body text-sm focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-body text-[10px] uppercase tracking-widest text-textbrown/60 mb-1.5">Image URL</label>
                <input
                  required
                  type="text"
                  value={formData.image_url}
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-2 font-body text-sm focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block font-body text-[10px] uppercase tracking-widest text-textbrown/60 mb-1.5">Badge (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Popular, Luxury"
                  value={formData.badge}
                  onChange={e => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-2 font-body text-sm focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block font-body text-[10px] uppercase tracking-widest text-textbrown/60 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-2 font-body text-sm focus:outline-none focus:border-gold resize-none"
                />
              </div>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 font-body text-xs uppercase tracking-widest text-gray-500 hover:text-dark">
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-brown text-white px-8 py-2 font-body text-xs uppercase tracking-widest hover:bg-brown-dark">
            Save Product
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Admin Component ─────────────────────────
const Admin = () => {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem('gs_admin'))
  const [activeTab, setActiveTab] = useState('dashboard')
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [statsData, setStatsData] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showProductModal, setShowProductModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const adminPass = sessionStorage.getItem('gs_admin_pass') || ADMIN_PASS

  useEffect(() => {
    if (authed) fetchData()
  }, [authed, activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      const headers = { 'X-Admin-Password': adminPass }
      const [s, o, p] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers }),
        fetch(`${API_URL}/api/admin/orders`, { headers }),
        fetch(`${API_URL}/api/admin/products`, { headers })
      ])
      const [sj, oj, pj] = await Promise.all([s.json(), o.json(), p.json()])
      setStatsData(sj)
      setOrders(oj.orders || [])
      setProducts(pj.products || [])
    } catch (err) {
      toast.error('Sync failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('gs_admin')
    sessionStorage.removeItem('gs_admin_pass')
    setAuthed(false)
  }

  const saveProduct = async (data) => {
    try {
      const method = data.id ? 'PUT' : 'POST'
      const url = data.id ? `${API_URL}/api/admin/products/${data.id}` : `${API_URL}/api/admin/products`
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-Admin-Password': adminPass },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Save failed')
      toast.success('Product saved')
      setShowProductModal(false)
      fetchData()
    } catch (err) { toast.error(err.message) }
  }

  const deleteProduct = async (id) => {
    if (!confirm('Are you sure? This will PERMANENTLY delete the product from the database.')) return
    try {
      await fetch(`${API_URL}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Password': adminPass }
      })
      toast.success('Product Deleted')
      fetchData()
    } catch (err) { toast.error('Delete failed') }
  }

  const dispatchOrder = async (orderId) => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/api/admin/shiprocket/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Password': adminPass },
        body: JSON.stringify({ order_id: orderId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch')
      
      toast.success(`Dispatched via Delhivery! AWB: ${data.awb_code}`)
      fetchData() // Refresh orders list
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />

  const stats = {
    totalRevenue: statsData?.totalRevenue || 0,
    totalOrders: statsData?.totalOrders || 0,
    totalProducts: statsData?.totalProducts || 0,
    pendingOrders: statsData?.pendingOrders || 0,
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-dark flex flex-col fixed left-0 top-0 bottom-0 z-40 shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-white/5">
          <p className="font-heading text-white font-semibold text-lg italic tracking-wide">Ghar Sajaoo</p>
          <p className="font-body text-[10px] text-gold/60 tracking-[0.2em] uppercase mt-1 font-medium">Admin Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'logistics', label: 'Logistics', icon: Truck },
            { id: 'products', label: 'Products', icon: Package },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 font-body text-xs tracking-widest uppercase transition-all duration-300 ${activeTab === id ? 'bg-brown text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 font-body text-xs tracking-widest uppercase text-white/30 hover:text-red-400 transition-colors">
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="ml-56 flex-1 p-10">
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="font-heading text-3xl text-dark font-semibold italic mb-2">Executive Summary</h1>
            <p className="font-body text-sm text-textbrown/50 mb-10">Real-time performance analytics and operational health.</p>
            <div className="grid grid-cols-4 gap-6 mb-12">
              {[
                { label: 'Revenue', value: formatPrice(stats.totalRevenue), icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Inventory', value: stats.totalProducts, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Attention', value: stats.pendingOrders, icon: RefreshCw, color: 'text-amber', bg: 'bg-amber/5' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 ${bg} flex items-center justify-center mb-6`}>
                    <Icon size={18} className={color} />
                  </div>
                  <p className="font-body text-3xl font-bold text-dark tracking-tight">{value}</p>
                  <p className="font-body text-[10px] uppercase tracking-widest text-textbrown/40 mt-2 font-semibold">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-end mb-10">
              <div>
                <h1 className="font-heading text-3xl text-dark font-semibold italic">Catalog Control</h1>
                <p className="font-body text-sm text-textbrown/50 mt-1">Manage artisanal products and inventory levels.</p>
              </div>
              <button 
                onClick={() => { setSelectedProduct(null); setShowProductModal(true) }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={14} />
                Add Product
              </button>
            </div>
            <div className="bg-white border border-gray-100 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      {['Product Details', 'Category', 'Price', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left font-body text-[10px] uppercase tracking-[0.2em] text-textbrown/50 px-6 py-4 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      <tr><td colSpan="5" className="px-6 py-20 text-center font-body text-sm text-textbrown/40">Synchronizing database...</td></tr>
                    ) : products.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-6 font-body text-sm text-dark font-medium">{p.name}</td>
                        <td className="px-6 py-6 font-body text-[10px] uppercase tracking-widest text-amber font-semibold">{p.category}</td>
                        <td className="px-6 py-6 font-body text-sm font-bold text-dark tracking-tight">{formatPrice(p.price)}</td>
                        <td className="px-6 py-6 uppercase font-body text-[10px] tracking-widest font-bold">
                          {p.stock > 0 ? <span className="text-green-600">In Stock ({p.stock})</span> : <span className="text-red-500">OOS</span>}
                        </td>
                        <td className="px-6 py-6 flex gap-4">
                          <button onClick={() => { setSelectedProduct(p); setShowProductModal(true) }} className="text-textbrown/40 hover:text-brown transition-colors"><Edit2 size={16}/></button>
                          <button onClick={() => deleteProduct(p.id)} className="text-textbrown/40 hover:text-red-400 transition-colors"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
           <div>
            <h1 className="font-heading text-3xl text-dark font-semibold italic mb-10">Order History</h1>
            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    {['ID', 'Customer', 'Amount', 'Date', 'Status'].map(h => (
                      <th key={h} className="text-left font-body text-[10px] uppercase tracking-[0.2em] text-textbrown/50 px-6 py-4 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-6 font-body text-[10px] font-bold text-brown">{o.id}</td>
                      <td className="px-6 py-6"><p className="font-body text-sm text-dark font-medium">{o.customer_name}</p><p className="font-body text-[10px] text-textbrown/40">{o.customer_email}</p></td>
                      <td className="px-6 py-6 font-body text-sm font-bold text-dark tracking-tight">{formatPrice(o.total)}</td>
                      <td className="px-6 py-6 font-body text-xs text-textbrown/50">{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-6"><span className={`${STATUS_STYLES[o.status] || 'bg-gray-100 text-gray-700'} px-3 py-1 font-body text-[10px] tracking-widest uppercase font-bold`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'logistics' && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-brown text-white p-2 rounded"><Truck size={20} /></div>
              <h1 className="font-heading text-3xl text-dark font-semibold italic">Shiprocket Dispatch</h1>
            </div>
            <p className="font-body text-sm text-textbrown/50 mb-10">Manage unfulfilled orders and dispatch seamlessly via Delhivery.</p>
            
            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    {['Order ID', 'Shipping Addr', 'Date', 'Status', 'Action'].map(h => (
                      <th key={h} className="text-left font-body text-[10px] uppercase tracking-[0.2em] text-textbrown/50 px-6 py-4 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.filter(o => ['pending', 'confirmed'].includes(o.status)).length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-10 text-center font-body text-sm text-textbrown/40">No pending orders to dispatch. All caught up!</td></tr>
                  ) : orders.filter(o => ['pending', 'confirmed'].includes(o.status)).map(o => (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-6 font-body text-[10px] font-bold text-brown">{o.id}</td>
                      <td className="px-6 py-6">
                        <p className="font-body text-sm text-dark font-medium">{o.customer_name}</p>
                        <p className="font-body text-[10px] text-textbrown/60 max-w-[250px] truncate">{o.shipping_address || 'No address'}</p>
                      </td>
                      <td className="px-6 py-6 font-body text-xs text-textbrown/50">{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-6"><span className={`${STATUS_STYLES[o.status]} px-3 py-1 font-body text-[10px] tracking-widest uppercase font-bold`}>{o.status}</span></td>
                      <td className="px-6 py-6">
                        <button 
                          onClick={() => dispatchOrder(o.id)}
                          disabled={loading}
                          className="bg-brown text-white px-4 py-2 font-body text-[10px] tracking-widest uppercase hover:bg-brown-dark transition-colors disabled:opacity-50"
                        >
                          Dispatch via Delhivery
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <ProductModal 
        isOpen={showProductModal} 
        product={selectedProduct} 
        onClose={() => setShowProductModal(false)} 
        onSave={saveProduct} 
      />
    </div>
  )
}

export default Admin
