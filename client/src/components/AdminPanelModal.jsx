import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, ShoppingBag, UtensilsCrossed, Plus, Check, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminPanelModal = ({ isOpen, onClose, onMenuUpdated }) => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu'
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // New item form state
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Burgers',
    price: '',
    description: '',
    image: '',
    isVeg: false,
    prepTime: '15-20 min'
  });

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [orderRes, menuRes] = await Promise.all([
        api.getAllOrders(token),
        api.getMenu()
      ]);
      setOrders(orderRes.orders || []);
      setMenuItems(menuRes.items || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      loadData();
    }
  }, [isOpen, token]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus, token);
      setStatusMessage(`Order #${orderId} updated to "${newStatus}"`);
      setTimeout(() => setStatusMessage(''), 3000);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await api.updateMenuItem(item.id, { isAvailable: !item.isAvailable }, token);
      loadData();
      if (onMenuUpdated) onMenuUpdated();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateDish = async (e) => {
    e.preventDefault();
    try {
      await api.createMenuItem(newItem, token);
      setStatusMessage(`Dish "${newItem.name}" added successfully!`);
      setTimeout(() => setStatusMessage(''), 3000);
      setNewItem({
        name: '',
        category: 'Burgers',
        price: '',
        description: '',
        image: '',
        isVeg: false,
        prepTime: '15-20 min'
      });
      loadData();
      if (onMenuUpdated) onMenuUpdated();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-white/60 backdrop-blur-xs" />

      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600/30 border border-red-500/30 rounded-2xl">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Restaurant Management Hub</h2>
              <p className="text-xs text-red-600">Oversee live orders and manage kitchen dishes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-red-700 text-indigo-700'
                : 'border-transparent text-slate-400 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Kitchen Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'menu'
                ? 'border-red-700 text-indigo-700'
                : 'border-transparent text-slate-400 hover:text-slate-800'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Menu Catalog ({menuItems.length})</span>
          </button>
        </div>

        {/* Status Toast Notification */}
        {statusMessage && (
          <div className="bg-whitemerald-500 text-white px-6 py-2 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: Kitchen Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No orders placed yet.
                </div>
              ) : (
                orders.map((o) => (
                  <div
                    key={o.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-xs font-black text-indigo-700">#{o.id}</span>
                        <span className="text-xs text-slate-400 ml-2 font-medium">
                          {o.customerName} • {o.phone || 'No phone'}
                        </span>
                      </div>
                      <span className="text-sm font-black text-slate-900">
                        ${o.totalAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                      <div className="font-semibold text-slate-800 mb-1">
                        Items: {o.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                      </div>
                      <div className="text-slate-400">📍 {o.deliveryAddress}</div>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                      <div className="text-xs text-slate-400 font-medium">
                        Current Status: <strong className="text-slate-800">{o.status}</strong>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {['Order Placed', 'Preparing Food', 'Out for Delivery', 'Delivered'].map((st) => (
                          <button
                            key={st}
                            onClick={() => handleUpdateStatus(o.id, st)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                              o.status === st
                                ? 'bg-red-700 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Menu Management */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              
              {/* Add New Dish Form */}
              <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-indigo-900 mb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-red-700" />
                  <span>Add New Menu Item</span>
                </h3>

                <form onSubmit={handleCreateDish} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Dish Name *</label>
                    <input
                      type="text"
                      required
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="e.g. Buffalo Crisp Wings"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category *</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white outline-none"
                    >
                      <option value="Burgers">Burgers</option>
                      <option value="Pizza">Pizza</option>
                      <option value="Asian">Asian</option>
                      <option value="Pasta">Pasta</option>
                      <option value="Healthy">Healthy</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Drinks">Drinks</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      placeholder="12.99"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Preparation Time</label>
                    <input
                      type="text"
                      value={newItem.prepTime}
                      onChange={(e) => setNewItem({ ...newItem, prepTime: e.target.value })}
                      placeholder="15-20 min"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Description</label>
                    <input
                      type="text"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      placeholder="Ingredients and culinary notes..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={newItem.isVeg}
                        onChange={(e) => setNewItem({ ...newItem, isVeg: e.target.checked })}
                        className="rounded text-emerald-600"
                      />
                      <span>Pure Vegetarian</span>
                    </label>
                  </div>

                  <div className="sm:col-span-2 pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-700 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors"
                    >
                      Save Dish to Menu
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Dishes List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Existing Dishes
                </h4>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {menuItems.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-100"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block">{item.name}</span>
                          <span className="text-slate-400">${item.price.toFixed(2)} • {item.category}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleAvailability(item)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                          item.isAvailable
                            ? 'bg-whitemerald-100 text-emerald-800 hover:bg-whitemerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {item.isAvailable ? 'In Stock' : 'Sold Out'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
