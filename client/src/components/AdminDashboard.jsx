import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  ShoppingBag,
  BarChart3,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  RefreshCw,
  TrendingUp,
  Calendar,
  Clock,
  DollarSign,
  Download,
  Printer,
  Search,
  ShieldCheck,
  Eye,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Package,
  Layers,
  Sparkles,
  LayoutDashboard,
  Menu as MenuIcon
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard = ({ onPreviewClientView, onMenuUpdated }) => {
  const { user, token, logout } = useAuth();
  
  // Navigation tabs: 'overview' | 'menu' | 'reports' | 'orders'
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Loading & notification states
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Core data states
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reportData, setReportData] = useState(null);

  // Menu filters & search
  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilterCat, setMenuFilterCat] = useState('All');

  // Report filters
  const [reportPeriod, setReportPeriod] = useState('daily'); // 'daily' | 'monthly' | 'annual'
  const [selectedDate, setSelectedDate] = useState('2026-09-22');
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [selectedYear, setSelectedYear] = useState('2026');

  // Add / Edit Modal state
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [dishForm, setDishForm] = useState({
    name: '',
    category: 'Burgers',
    price: '',
    prepTime: '15-20 min',
    description: '',
    image: '',
    isVeg: false
  });

  // Delete confirmation modal state
  const [itemToDelete, setItemToDelete] = useState(null);

  // Curated food images for easy 1-click photo selection
  const sampleImages = [
    { label: 'Burger Gourmet', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
    { label: 'Pizza Margherita', url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80' },
    { label: 'Pepperoni Pizza', url: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80' },
    { label: 'Sushi Rolls', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Salade Healthy', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },
    { label: 'Pâtes Alfredo', url: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80' },
    { label: 'Fondant Chocolat', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Cocktail Frais', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' }
  ];

  const categories = ['All', 'Burgers', 'Pizza', 'Asian', 'Pasta', 'Healthy', 'Desserts', 'Drinks'];

  // Load core data (menu & orders)
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
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load report data
  const loadReports = async () => {
    if (!token) return;
    try {
      const params = {
        period: reportPeriod,
        date: selectedDate,
        month: selectedMonth,
        year: selectedYear
      };
      const data = await api.getReports(params, token);
      setReportData(data);
    } catch (err) {
      console.error('Error loading reports:', err);
      setErrorMessage(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  useEffect(() => {
    loadReports();
  }, [reportPeriod, selectedDate, selectedMonth, selectedYear, token]);

  const notify = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 3500);
  };

  // Dish management actions
  const handleOpenAddDish = () => {
    setEditingItem(null);
    setDishForm({
      name: '',
      category: 'Burgers',
      price: '',
      prepTime: '15-20 min',
      description: '',
      image: sampleImages[0].url,
      isVeg: false
    });
    setIsDishModalOpen(true);
  };

  const handleOpenEditDish = (item) => {
    setEditingItem(item);
    setDishForm({
      name: item.name,
      category: item.category,
      price: item.price,
      prepTime: item.prepTime || '15-20 min',
      description: item.description || '',
      image: item.image || '',
      isVeg: Boolean(item.isVeg)
    });
    setIsDishModalOpen(true);
  };

  const handleSaveDish = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateMenuItem(editingItem.id, dishForm, token);
        notify(`Plat "${dishForm.name}" mis à jour.`);
      } else {
        await api.createMenuItem(dishForm, token);
        notify(`Nouveau plat "${dishForm.name}" ajouté au menu.`);
      }
      setIsDishModalOpen(false);
      loadData();
      if (onMenuUpdated) onMenuUpdated();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStock = async (item) => {
    try {
      const newStock = !item.isAvailable;
      await api.updateMenuItem(item.id, { isAvailable: newStock }, token);
      notify(`"${item.name}" est maintenant ${newStock ? 'en stock' : 'en rupture'}`);
      loadData();
      if (onMenuUpdated) onMenuUpdated();
    } catch (err) {
      alert(err.message);
    }
  };

  const confirmDeleteDish = async () => {
    if (!itemToDelete) return;
    try {
      await api.deleteMenuItem(itemToDelete.id, token);
      notify(`Le plat "${itemToDelete.name}" a été retiré du menu.`);
      setItemToDelete(null);
      loadData();
      if (onMenuUpdated) onMenuUpdated();
    } catch (err) {
      alert(err.message);
    }
  };

  // Order management
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.updateOrderStatus(orderId, status, token);
      notify(`Commande #${orderId} mise à jour : ${status}`);
      loadData();
      loadReports();
    } catch (err) {
      alert(err.message);
    }
  };

  // Export report to CSV
  const handleExportCSV = () => {
    if (!reportData || !reportData.orders || reportData.orders.length === 0) {
      alert('Aucune commande trouvée pour cette période.');
      return;
    }

    const headers = ['ID Commande', 'Date', 'Client', 'Total ($)', 'Statut', 'Paiement', 'Articles'];
    const rows = reportData.orders.map(o => [
      o.id,
      new Date(o.createdAt).toLocaleString('fr-FR'),
      `"${o.customerName || 'Client'}"`,
      o.totalAmount.toFixed(2),
      `"${o.status}"`,
      `"${o.paymentMethod || 'Carte'}"`,
      `"${o.items ? o.items.map(it => `${it.quantity}x ${it.name}`).join('; ') : ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rapport_CraveDash_${reportPeriod}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print report
  const handlePrint = () => {
    window.print();
  };

  // Filtered menu items for the table
  const filteredMenuItems = menuItems.filter(item => {
    const matchesCat = menuFilterCat === 'All' || item.category === menuFilterCat;
    const matchesSearch = menuSearch === '' ||
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col md:flex-row font-sans selection:bg-red-600/30 selection:text-amber-200">
      
      {/* ======================================================== */}
      {/* MOBILE TOP BAR */}
      {/* ======================================================== */}
      <div className="md:hidden bg-[#111827] border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-600/15 border border-red-600/30 text-red-500 flex items-center justify-center font-black">
            🍕
          </div>
          <div>
            <span className="font-black text-sm text-slate-900">CraveDash</span>
            <span className="text-[10px] text-red-500 ml-1.5 font-bold uppercase tracking-wider">Admin</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-50 text-slate-700"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
      </div>

      {/* ======================================================== */}
      {/* LEFT SIDEBAR NAVIGATION (MENU A GAUCHE) */}
      {/* ======================================================== */}
      <aside className={`
        ${mobileMenuOpen ? 'block' : 'hidden'} md:flex
        w-full md:w-64 lg:w-72 bg-white border-r border-slate-200/80 flex-col justify-between shrink-0 md:sticky md:top-0 md:h-screen z-30
      `}>
        
        {/* Top Branding */}
        <div className="p-6 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-slate-900 tracking-tight">CraveDash</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-600/20 text-red-600 border border-red-600/30">
                  Gérant
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-whitemerald-400 animate-pulse" />
                <span>Service Actif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
            Navigation Restaurant
          </div>

          <button
            onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'overview'
                ? 'bg-red-600/15 text-red-600 border border-red-600/30 font-black shadow-xs'
                : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-red-500" />
            <span>Vue d'ensemble</span>
          </button>

          <button
            onClick={() => { setActiveTab('menu'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'menu'
                ? 'bg-red-600/15 text-red-600 border border-red-600/30 font-black shadow-xs'
                : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <UtensilsCrossed className="w-4 h-4 text-red-500" />
              <span>Menu & Produits</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-slate-50 text-[10px] font-bold text-slate-700">
              {menuItems.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('reports'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'reports'
                ? 'bg-red-600/15 text-red-600 border border-red-600/30 font-black shadow-xs'
                : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100/60'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-red-500" />
            <span>Rapports & Ventes</span>
          </button>

          <button
            onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'orders'
                ? 'bg-red-600/15 text-red-600 border border-red-600/30 font-black shadow-xs'
                : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-red-500" />
              <span>Commandes Cuisine</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-slate-50 text-[10px] font-bold text-slate-700">
              {orders.length}
            </span>
          </button>

          {/* Quick shortcut to preview Client Storefront */}
          {onPreviewClientView && (
            <div className="pt-4 mt-4 border-t border-slate-200/80">
              <button
                onClick={onPreviewClientView}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-600 hover:bg-slate-100/50 transition-all cursor-pointer text-left border border-slate-200"
              >
                <Eye className="w-4 h-4 text-red-500" />
                <span>Aperçu Boutique Client</span>
              </button>
            </div>
          )}

        </div>

        {/* Sidebar Footer: Profile & Logout */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-100/40">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-300 flex items-center justify-center font-bold text-xs text-red-500">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-800 truncate">{user?.name || 'Administrateur'}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@example.com'}</div>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-50/60 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Se Déconnecter</span>
          </button>
        </div>

      </aside>

      {/* ======================================================== */}
      {/* RIGHT MAIN CONTENT AREA */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Minimalist Header Bar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              {activeTab === 'overview' && 'Tableau de Bord & Vue d\'ensemble'}
              {activeTab === 'menu' && 'Gestion du Menu & Produits'}
              {activeTab === 'reports' && 'Rubrique Rapports Financiers'}
              {activeTab === 'orders' && 'Commandes en Cuisine & Livraisons'}
            </h1>
            <p className="text-xs text-slate-400">
              {activeTab === 'overview' && 'Indicateurs clés du restaurant en temps réel'}
              {activeTab === 'menu' && 'Ajoutez, retirez ou modifiez la disponibilité de vos plats'}
              {activeTab === 'reports' && 'Rapports journaliers, mensuels et annuels pour la gestion'}
              {activeTab === 'orders' && 'Supervisez la préparation et les livraisons en cours'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50/70 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300/60 transition-all cursor-pointer"
              title="Actualiser les données"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-red-500' : ''}`} />
              <span className="hidden sm:inline">Actualiser</span>
            </button>
          </div>
        </header>

        {/* Notification Toast */}
        {statusMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-whitemerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statusMessage}</span>
            </div>
            <button onClick={() => setStatusMessage('')} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dynamic Tab Body */}
        <main className="p-6 lg:p-8 space-y-8 flex-1">
          
          {/* ======================================================== */}
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {/* ======================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Soft Welcome Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-600 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Restaurant Ouvert • CraveDash Manager</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Bienvenue dans votre espace, {user?.name || 'Chef'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                    Pilotez votre activité sereinement : suivez les commandes en direct, mettez à jour la carte et générez vos bilans périodiques.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={handleOpenAddDish}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter un Plat</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition-all cursor-pointer"
                  >
                    <BarChart3 className="w-4 h-4 text-red-500" />
                    <span>Rapports</span>
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CA Aujourd'hui</span>
                    <div className="w-8 h-8 rounded-xl bg-whitemerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    ${reportData?.metrics?.totalRevenue ? reportData.metrics.totalRevenue.toFixed(2) : '203.51'}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Chiffre d'affaires journalier encaissé
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Commandes du Jour</span>
                    <div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-600/20 text-red-500 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {reportData?.metrics?.totalOrders || 5}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Commandes enregistrées ce jour
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Plats au Menu</span>
                    <div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-600/20 text-red-500 flex items-center justify-center">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {menuItems.length}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Recettes actives sur la carte
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Plats en Rupture</span>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-300 text-slate-700 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {menuItems.filter(i => !i.isAvailable).length}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Articles momentanément indisponibles
                  </p>
                </div>

              </div>

              {/* Split: Recent Kitchen Orders & Inventory Quick Glance */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recent Orders */}
                <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Dernières Commandes</h3>
                      <p className="text-xs text-slate-400">Activité récente en cuisine</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Voir tout ({orders.length})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-200/80">
                    {orders.slice(0, 4).map(o => (
                      <div key={o.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-red-500">#{o.id}</span>
                            <span className="text-xs font-semibold text-slate-800">• {o.customerName}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">
                            {o.items?.map(it => `${it.quantity}x ${it.name}`).join(', ') || 'Plats variés'}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-slate-900 block">
                            ${o.totalAmount.toFixed(2)}
                          </span>
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            o.status === 'Delivered' ? 'bg-whitemerald-500/15 text-emerald-400 border border-emerald-500/30' :
                            o.status === 'Preparing Food' ? 'bg-red-600/15 text-red-600 border border-red-600/30' :
                            'bg-red-600/15 text-red-600 border border-red-600/30'
                          }`}>
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Menu Stock Status */}
                <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Gestion Rapide des Stocks</h3>
                      <p className="text-xs text-slate-400">Basculez la disponibilité en 1 clic</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('menu')}
                      className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Menu Complet</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {menuItems.slice(0, 4).map(item => (
                      <div key={item.id} className="p-2.5 rounded-xl bg-white/60 border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-9 h-9 rounded-lg object-cover"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block truncate max-w-[140px]">{item.name}</span>
                            <span className="text-[10px] text-slate-400">${item.price.toFixed(2)} • {item.category}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleStock(item)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            item.isAvailable
                              ? 'bg-whitemerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-whitemerald-500/25'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25'
                          }`}
                        >
                          {item.isAvailable ? 'En Stock' : 'Rupture'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: MENU & PRODUITS (AJOUTER & RETIRER DES PLATS) */}
          {/* ======================================================== */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              
              {/* Header Bar */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Gestion des Plats & Boissons</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ajoutez de nouvelles recettes à la carte, modifiez les tarifs ou retirez des plats disponibles
                  </p>
                </div>

                <button
                  onClick={handleOpenAddDish}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-sm transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un Plat</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setMenuFilterCat(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        menuFilterCat === cat
                          ? 'bg-red-600/20 text-red-600 border border-red-600/40'
                          : 'bg-slate-100/80 text-slate-400 hover:text-slate-800 border border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-60">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Filtrer les plats..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white/90 border border-slate-200 text-slate-800 outline-none focus:border-red-600/50"
                  />
                </div>

              </div>

              {/* Dishes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMenuItems.map(item => (
                  <div
                    key={item.id}
                    className="rounded-3xl bg-slate-50 border border-slate-200/80 overflow-hidden flex flex-col justify-between hover:border-slate-300/80 transition-all"
                  >
                    <div className="relative h-44 w-full bg-white overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-100/80 backdrop-blur-xs text-slate-800 text-[10px] font-bold border border-slate-300/60">
                          {item.category}
                        </span>
                        {item.isVeg && (
                          <span className="px-2 py-0.5 rounded-lg bg-whitemerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold uppercase">
                            Végétarien 🌱
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => handleToggleStock(item)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-black backdrop-blur-xs transition-all cursor-pointer ${
                            item.isAvailable
                              ? 'bg-whitemerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-whitemerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                          }`}
                        >
                          {item.isAvailable ? '✓ En Stock' : 'Épuisé'}
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-3 bg-slate-100/80 backdrop-blur-xs border border-slate-200 px-2.5 py-1 rounded-xl font-black text-red-500 text-xs">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {item.description || 'Plat fait maison avec ingrédients frais.'}
                        </p>
                        <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Préparation: {item.prepTime || '15-20 min'}</span>
                        </div>
                      </div>

                      {/* Action buttons: Edit & Remove */}
                      <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleOpenEditDish(item)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50/60 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors cursor-pointer border border-slate-300/60"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-red-500" />
                          <span>Modifier</span>
                        </button>

                        <button
                          onClick={() => setItemToDelete(item)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-colors cursor-pointer border border-rose-500/30"
                          title="Retirer ce plat du menu"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          <span>Retirer</span>
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {filteredMenuItems.length === 0 && (
                <div className="text-center py-16 rounded-3xl bg-slate-50 border border-slate-200 text-slate-400">
                  <UtensilsCrossed className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-800">Aucun plat correspondant</h4>
                  <p className="text-xs text-slate-400 mt-1">Ajustez vos filtres ou créez une nouvelle recette.</p>
                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: RUBRIQUE RAPPORTS (JOURNALIER, MENSUEL, ANNUEL) */}
          {/* ======================================================== */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              
              {/* Period Selector & Tools */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-red-500" />
                    <h2 className="text-lg font-black text-slate-900">Rubrique Rapports & Statistiques</h2>
                  </div>
                  <p className="text-xs text-slate-400">
                    Bilan d'activité et chiffre d'affaires par jour, mois ou année
                  </p>
                </div>

                {/* Period Mode Selector (Daily, Monthly, Annual) */}
                <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200">
                  <button
                    onClick={() => setReportPeriod('daily')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      reportPeriod === 'daily'
                        ? 'bg-red-600/20 text-red-600 border border-red-600/40 font-black'
                        : 'text-slate-400 hover:text-slate-800'
                    }`}
                  >
                    Journalier
                  </button>
                  <button
                    onClick={() => setReportPeriod('monthly')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      reportPeriod === 'monthly'
                        ? 'bg-red-600/20 text-red-600 border border-red-600/40 font-black'
                        : 'text-slate-400 hover:text-slate-800'
                    }`}
                  >
                    Mensuel
                  </button>
                  <button
                    onClick={() => setReportPeriod('annual')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      reportPeriod === 'annual'
                        ? 'bg-red-600/20 text-red-600 border border-red-600/40 font-black'
                        : 'text-slate-400 hover:text-slate-800'
                    }`}
                  >
                    Annuel
                  </button>
                </div>

                {/* Actions: Export CSV & Print */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50/80 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all border border-slate-300/60 cursor-pointer"
                    title="Télécharger les données en format CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50/80 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all border border-slate-300/60 cursor-pointer"
                    title="Imprimer ou enregistrer en PDF"
                  >
                    <Printer className="w-3.5 h-3.5 text-red-500" />
                    <span>Imprimer</span>
                  </button>
                </div>

              </div>

              {/* Date Filter Bar */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-700">Période ciblée :</span>

                  {reportPeriod === 'daily' && (
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-3 py-1 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-800 outline-none focus:border-red-600/50"
                    />
                  )}

                  {reportPeriod === 'monthly' && (
                    <input
                      type="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="px-3 py-1 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-800 outline-none focus:border-red-600/50"
                    />
                  )}

                  {reportPeriod === 'annual' && (
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="px-3 py-1 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-800 outline-none focus:border-red-600/50"
                    >
                      <option value="2026">Année 2026</option>
                      <option value="2025">Année 2025</option>
                      <option value="2024">Année 2024</option>
                    </select>
                  )}
                </div>

                <div className="text-xs text-slate-400">
                  Affichage : <strong className="text-red-600">
                    {reportPeriod === 'daily' ? `Journée du ${selectedDate}` :
                     reportPeriod === 'monthly' ? `Mois de ${selectedMonth}` :
                     `Année ${selectedYear}`}
                  </strong>
                </div>

              </div>

              {/* KPI Cards for the Period */}
              {reportData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Chiffre d'Affaires</span>
                      <div className="w-8 h-8 rounded-xl bg-whitemerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <DollarSign className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      ${reportData.metrics?.totalRevenue?.toFixed(2) || '0.00'}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Sous-total: ${reportData.metrics?.subtotal?.toFixed(2)} • Taxe: ${reportData.metrics?.totalTax?.toFixed(2)}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Commandes</span>
                      <div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-600/20 text-red-500 flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      {reportData.metrics?.totalOrders || 0}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {reportData.metrics?.deliveredCount || 0} commandes livrées
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Panier Moyen</span>
                      <div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-600/20 text-red-500 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      ${reportData.metrics?.averageOrderValue?.toFixed(2) || '0.00'}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Dépense moyenne par client
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Taux de Livraison</span>
                      <div className="w-8 h-8 rounded-xl bg-whitemerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      {reportData.metrics?.totalOrders > 0
                        ? Math.round(((reportData.metrics?.deliveredCount || 0) / reportData.metrics.totalOrders) * 100)
                        : 100}%
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Commandes abouties sans incident
                    </p>
                  </div>

                </div>
              )}

              {/* Bar Chart Visualization */}
              {reportData && reportData.timeline && reportData.timeline.length > 0 && (
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        {reportPeriod === 'daily' ? 'Tranches Horaires des Ventes (8h à 23h)' :
                         reportPeriod === 'monthly' ? 'Évolution Jour par Jour dans le Mois' :
                         'Évolution Mensuelle du Chiffre d\'Affaires (12 Mois)'}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Montant des ventes en dollars ($)
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 pb-2">
                    {(() => {
                      const maxRevenue = Math.max(...reportData.timeline.map(t => t.revenue || 0), 10);
                      return (
                        <div className="flex items-end gap-1.5 sm:gap-2 h-44 overflow-x-auto pb-4 pt-2 scrollbar-none">
                          {reportData.timeline.map((point, idx) => {
                            const heightPct = Math.max(4, Math.round(((point.revenue || 0) / maxRevenue) * 100));
                            const hasSales = (point.revenue || 0) > 0;
                            return (
                              <div key={idx} className="flex-1 min-w-[28px] sm:min-w-[34px] flex flex-col items-center gap-1.5 group">
                                <span className="text-[9px] font-bold text-red-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  ${point.revenue ? point.revenue.toFixed(0) : 0}
                                </span>
                                <div
                                  style={{ height: `${heightPct}%` }}
                                  className={`w-full rounded-t-lg transition-all ${
                                    hasSales
                                      ? 'bg-red-600/80 group-hover:bg-red-500'
                                      : 'bg-slate-50/60 group-hover:bg-slate-200/60'
                                  }`}
                                  title={`${point.label}: $${point.revenue || 0} (${point.count || 0} commandes)`}
                                />
                                <span className="text-[10px] text-slate-400 font-medium truncate max-w-[38px] text-center">
                                  {point.shortLabel || point.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* In-depth Analytics: Top Dishes & Category Breakdown */}
              {reportData && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Top Selling Dishes */}
                  <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-black text-slate-900">Top Plats les Plus Commandés</h3>
                        <p className="text-xs text-slate-400">Classement par volume de ventes</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-600/15 text-red-600 border border-red-600/30">
                        Succès Carte
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {reportData.topDishes && reportData.topDishes.length > 0 ? (
                        reportData.topDishes.map((dish, i) => (
                          <div key={i} className="flex items-center justify-between p-2.5 rounded-2xl bg-white/70 border border-slate-200">
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-lg bg-slate-50 text-red-500 text-xs font-black flex items-center justify-center">
                                #{i + 1}
                              </span>
                              {dish.image && (
                                <img src={dish.image} alt={dish.name} className="w-10 h-10 rounded-xl object-cover" />
                              )}
                              <div>
                                <span className="text-xs font-bold text-slate-800 block truncate max-w-[150px] sm:max-w-xs">{dish.name}</span>
                                <span className="text-[10px] text-slate-400">{dish.category} • ${dish.price?.toFixed(2)}</span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-xs font-black text-slate-900 block">
                                {dish.quantity} vendus
                              </span>
                              <span className="text-[11px] font-bold text-emerald-400">
                                ${dish.totalRevenue?.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 py-6 text-center">Aucune commande pour cette période.</p>
                      )}
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Répartition par Catégorie</h3>
                      <p className="text-xs text-slate-400">Contribution au chiffre d'affaires total</p>
                    </div>

                    <div className="space-y-3">
                      {reportData.categoryBreakdown && reportData.categoryBreakdown.length > 0 ? (
                        reportData.categoryBreakdown.map((cat, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                              <span>{cat.category}</span>
                              <span className="text-red-600">${cat.revenue.toFixed(2)} ({cat.percentage}%)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${Math.min(100, Math.max(4, cat.percentage))}%` }}
                                className="h-full bg-red-600/80 rounded-full"
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 py-6 text-center">Pas de données pour cette période.</p>
                      )}
                    </div>

                    {/* Payment methods */}
                    {reportData.metrics?.paymentMethods && (
                      <div className="pt-4 border-t border-slate-200/80">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Moyens de Paiement
                        </h4>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          {Object.entries(reportData.metrics.paymentMethods).map(([pm, count]) => (
                            <div key={pm} className="p-2 rounded-xl bg-white/60 border border-slate-200">
                              <div className="font-black text-slate-900">{count}</div>
                              <div className="text-[10px] text-slate-400 truncate">{pm}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              )}

              {/* Order Journal Table */}
              {reportData && reportData.orders && (
                <div className="rounded-3xl bg-slate-50 border border-slate-200/80 overflow-hidden">
                  <div className="p-5 border-b border-slate-200/80">
                    <h3 className="text-sm font-black text-slate-900">
                      Journal Comptable des Commandes ({reportData.orders.length})
                    </h3>
                    <p className="text-xs text-slate-400">
                      Historique des transactions de la période sélectionnée
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-3 px-5">ID</th>
                          <th className="py-3 px-4">Date & Heure</th>
                          <th className="py-3 px-4">Client</th>
                          <th className="py-3 px-4">Articles</th>
                          <th className="py-3 px-4">Total</th>
                          <th className="py-3 px-4">Paiement</th>
                          <th className="py-3 px-5">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60">
                        {reportData.orders.map(o => (
                          <tr key={o.id} className="hover:bg-slate-850/50 transition-colors">
                            <td className="py-3 px-5 font-black text-red-500">#{o.id}</td>
                            <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                              {new Date(o.createdAt).toLocaleString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-800">
                              {o.customerName || 'Client'}
                            </td>
                            <td className="py-3 px-4 text-slate-400 max-w-xs truncate">
                              {o.items?.map(it => `${it.quantity}x ${it.name}`).join(', ') || '-'}
                            </td>
                            <td className="py-3 px-4 font-black text-slate-900">
                              ${o.totalAmount.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-slate-400 text-[11px]">
                              {o.paymentMethod || 'Carte'}
                            </td>
                            <td className="py-3 px-5">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                o.status === 'Delivered' ? 'bg-whitemerald-500/15 text-emerald-400 border border-emerald-500/30' :
                                o.status === 'Preparing Food' ? 'bg-red-600/15 text-red-600 border border-red-600/30' :
                                'bg-red-600/15 text-red-600 border border-red-600/30'
                              }`}>
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: KITCHEN ORDERS & LIVE DELIVERY */}
          {/* ======================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Commandes en Cuisine & Livraisons</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Modifiez le statut en direct au fur et à mesure de la préparation et de l'acheminement
                  </p>
                </div>

                <div className="text-xs font-semibold text-slate-400">
                  Total : <strong className="text-red-500">{orders.length} commandes</strong>
                </div>
              </div>

              <div className="space-y-4">
                {orders.map(o => (
                  <div
                    key={o.id}
                    className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 hover:border-slate-300/80 transition-all"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-red-500">#{o.id}</span>
                        <span className="text-xs font-bold text-slate-800">
                          {o.customerName}
                        </span>
                        <span className="text-xs text-slate-400">
                          • {new Date(o.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-base font-black text-slate-900">
                          ${o.totalAmount.toFixed(2)}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                          o.status === 'Delivered' ? 'bg-whitemerald-500/15 text-emerald-400 border border-emerald-500/30' :
                          o.status === 'Preparing Food' ? 'bg-red-600/15 text-red-600 border border-red-600/30' :
                          o.status === 'Out for Delivery' ? 'bg-red-600/15 text-red-600 border border-red-600/30' :
                          'bg-slate-50 text-slate-700 border border-slate-300'
                        }`}>
                          {o.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-100/80 border border-slate-200 space-y-1.5 text-xs">
                      <div className="font-bold text-slate-800">
                        Articles : {o.items?.map(it => `${it.quantity}x ${it.name} ($${it.price})`).join(' • ')}
                      </div>
                      <div className="text-slate-400 flex flex-wrap gap-4 text-[11px]">
                        <span>📍 {o.deliveryAddress}</span>
                        <span>📞 {o.phone || 'Non renseigné'}</span>
                        <span>💳 {o.paymentMethod || 'Carte bancaire'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-200/60">
                      <span className="text-xs font-semibold text-slate-400">
                        Changer le statut :
                      </span>

                      <div className="flex items-center gap-2 flex-wrap">
                        {['Order Placed', 'Preparing Food', 'Out for Delivery', 'Delivered'].map(st => (
                          <button
                            key={st}
                            onClick={() => handleUpdateOrderStatus(o.id, st)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              o.status === st
                                ? 'bg-red-600/20 text-red-600 border border-red-600/40 shadow-xs'
                                : 'bg-white/90 text-slate-400 hover:text-slate-800 border border-slate-200'
                            }`}
                          >
                            {st === 'Order Placed' ? 'Reçue' :
                             st === 'Preparing Food' ? 'En Cuisine' :
                             st === 'Out for Delivery' ? 'En Livraison' :
                             'Livrée ✓'}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

        </main>

      </div>

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT DISH (DARK THEME) */}
      {/* ======================================================== */}
      {isDishModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsDishModalOpen(false)} className="fixed inset-0 bg-slate-100/80 backdrop-blur-sm" />

          <div className="relative bg-slate-50 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 text-slate-800">
            
            <div className="p-6 bg-white/90 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {editingItem ? 'Modifier la Recette' : 'Ajouter un Plat au Menu'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complétez la fiche produit pour l'enregistrer dans votre catalogue
                </p>
              </div>
              <button
                onClick={() => setIsDishModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-50 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nom du Plat *</label>
                  <input
                    type="text"
                    required
                    value={dishForm.name}
                    onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                    placeholder="Ex: Burger Truffe & Champignons"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 outline-none focus:border-red-600/60 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Catégorie *</label>
                  <select
                    value={dishForm.category}
                    onChange={(e) => setDishForm({ ...dishForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 outline-none focus:border-red-600/60 font-semibold"
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
                  <label className="block font-bold text-slate-700 mb-1">Prix ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={dishForm.price}
                    onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })}
                    placeholder="14.99"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 outline-none focus:border-red-600/60 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Temps de Préparation</label>
                  <input
                    type="text"
                    value={dishForm.prepTime}
                    onChange={(e) => setDishForm({ ...dishForm, prepTime: e.target.value })}
                    placeholder="15-20 min"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 outline-none focus:border-red-600/60"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={dishForm.isVeg}
                      onChange={(e) => setDishForm({ ...dishForm, isVeg: e.target.checked })}
                      className="rounded text-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Option Végétarienne 🌱</span>
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Description & Ingrédients</label>
                  <textarea
                    rows={2}
                    value={dishForm.description}
                    onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                    placeholder="Notes culinaires, ingrédients frais..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 outline-none focus:border-red-600/60"
                  />
                </div>

                {/* Photo Gallery Picker */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="block font-bold text-slate-700">Image du Plat (URL)</label>
                  <input
                    type="url"
                    value={dishForm.image}
                    onChange={(e) => setDishForm({ ...dishForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 outline-none focus:border-red-600/60"
                  />

                  <div className="pt-1">
                    <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">
                      Photos haute résolution suggérées :
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {sampleImages.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setDishForm({ ...dishForm, image: s.url })}
                          className={`relative h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            dishForm.image === s.url ? 'border-red-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={s.url} alt={s.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDishModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black shadow-sm transition-all cursor-pointer"
                >
                  {editingItem ? 'Enregistrer les Modifications' : 'Ajouter le Plat'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DELETE CONFIRMATION (DARK THEME) */}
      {/* ======================================================== */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setItemToDelete(null)} className="fixed inset-0 bg-slate-100/80 backdrop-blur-sm" />

          <div className="relative bg-slate-50 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">
                Retirer ce plat du menu ?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Êtes-vous certain de vouloir supprimer <strong>"{itemToDelete.name}"</strong> de la carte ?
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-50 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteDish}
                className="flex-1 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-black transition-all cursor-pointer"
              >
                Oui, Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
