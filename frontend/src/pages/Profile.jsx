import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, User, LogOut, ChevronRight, ShoppingBag, Clock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../utils/supabase'
import { formatPrice } from '../utils/products'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  pending:    { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Pending' },
  confirmed:  { bg: 'bg-blue-50',   text: 'text-blue-700',   label: 'Confirmed' },
  shipped:    { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Shipped' },
  delivered:  { bg: 'bg-green-50',  text: 'text-green-700',  label: 'Delivered' },
  cancelled:  { bg: 'bg-red-50',    text: 'text-red-700',    label: 'Cancelled' },
}

const Profile = () => {
  const { user, signOut, loading } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [user, loading, navigate])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`*, order_items(*, products(name, image_url, price))`)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (!error) setOrders(data || [])
      } catch {
        // Silently handle — orders will be empty if table doesn't exist yet
      } finally {
        setLoadingOrders(false)
      }
    }
    fetchOrders()
  }, [user])

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
      toast.success('Signed out successfully')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brown/30 border-t-brown rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 p-6 bg-white shadow-card">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-cream-dark flex-shrink-0">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={36} className="text-brown/40" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="font-heading text-2xl text-dark font-semibold">
              {user.user_metadata?.full_name || 'My Account'}
            </h1>
            <p className="font-body text-sm text-textbrown/60 mt-1">{user.email}</p>
            <p className="font-body text-xs text-amber mt-1 uppercase tracking-wider">
              Member since {new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 font-body text-sm text-textbrown/60 hover:text-red-500 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: ShoppingBag, label: 'Total Orders', value: orders.length },
            { icon: Package, label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length },
            { icon: Clock, label: 'In Progress', value: orders.filter(o => ['pending','confirmed','shipped'].includes(o.status)).length },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white shadow-card p-5 text-center">
              <Icon size={20} className="text-brown mx-auto mb-2" />
              <p className="font-heading text-2xl font-bold text-dark">{value}</p>
              <p className="font-body text-xs text-textbrown/60 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gold/20 mb-8">
          {['orders', 'account'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-body text-sm uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-brown text-brown'
                  : 'text-textbrown/60 hover:text-brown'
              }`}
            >
              {tab === 'orders' ? 'My Orders' : 'Account Details'}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {loadingOrders ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 border-2 border-brown/30 border-t-brown rounded-full animate-spin mx-auto" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-white shadow-card">
                <ShoppingBag size={48} className="text-gold/30 mx-auto mb-4" />
                <h3 className="font-heading text-xl text-dark mb-2">No orders yet</h3>
                <p className="font-body text-sm text-textbrown/60 mb-6">
                  Start shopping to see your orders here.
                </p>
                <button onClick={() => navigate('/shop')} className="btn-primary">
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => {
                  const status = STATUS_COLORS[order.status] || STATUS_COLORS.pending
                  return (
                    <div key={order.id} className="bg-white shadow-card p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                          <p className="font-body text-xs text-textbrown/50 uppercase tracking-wider">
                            Order #{order.id?.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="font-body text-xs text-textbrown/40 mt-0.5">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'long', year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`${status.bg} ${status.text} font-body text-xs px-3 py-1 uppercase tracking-wider`}>
                            {status.label}
                          </span>
                          <span className="font-heading text-base font-semibold text-brown">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>

                      {/* Order items preview */}
                      {order.order_items && order.order_items.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {order.order_items.slice(0, 3).map(item => (
                            <div key={item.id} className="w-12 h-12 bg-softgray overflow-hidden flex-shrink-0">
                              {item.products?.image_url && (
                                <img
                                  src={item.products.image_url}
                                  alt={item.products?.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                          ))}
                          {order.order_items.length > 3 && (
                            <div className="w-12 h-12 bg-softgray flex items-center justify-center font-body text-xs text-textbrown/60">
                              +{order.order_items.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="bg-white shadow-card p-8">
            <h2 className="font-heading text-lg text-dark mb-6">Account Information</h2>
            <div className="space-y-5">
              {[
                { label: 'Full Name', value: user.user_metadata?.full_name || '—' },
                { label: 'Email Address', value: user.email },
                { label: 'Account Type', value: 'Google Account' },
                { label: 'Member Since', value: new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 py-3 border-b border-gold/10 last:border-0">
                  <p className="font-body text-xs uppercase tracking-wider text-textbrown/50 sm:w-36 flex-shrink-0">{label}</p>
                  <p className="font-body text-sm text-dark">{value}</p>
                </div>
              ))}
            </div>
            <p className="font-body text-xs text-textbrown/40 mt-6">
              Account information is managed through Google. To update your name or profile picture, edit your Google account.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
