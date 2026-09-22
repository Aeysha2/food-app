import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { FoodCard } from './components/FoodCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AuthModal } from './components/AuthModal';
import { AuthPage } from './components/AuthPage';
import { AdminDashboard } from './components/AdminDashboard';
import { api } from './services/api';
import { RefreshCw, ArrowLeft, ShieldCheck } from 'lucide-react';

function AppContent() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  
  // App view control: allows guests to preview storefront, or admin to preview client view
  const [isGuest, setIsGuest] = useState(false);
  const [adminPreview, setAdminPreview] = useState(false);

  // Menu items & filtering
  const [menuItems, setMenuItems] = useState([]);
  const [categories] = useState(['All', 'Burgers', 'Pizza', 'Asian', 'Pasta', 'Healthy', 'Desserts', 'Drinks']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modals for client portal
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  
  // Tracked Order
  const [trackedOrderId, setTrackedOrderId] = useState(() => {
    return localStorage.getItem('crave_last_order_id') || 'ORD-9201';
  });

  const loadMenu = async () => {
    setLoading(true);
    try {
      const data = await api.getMenu({
        category: selectedCategory,
        search: searchTerm,
        vegOnly
      });
      setMenuItems(data.items || []);
    } catch (err) {
      console.error('Failed to load menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, [selectedCategory, searchTerm, vegOnly]);

  const handleOrderPlaced = (newOrder) => {
    setTrackedOrderId(newOrder.id);
    localStorage.setItem('crave_last_order_id', newOrder.id);
    setIsTrackerOpen(true);
  };

  const handleOpenTrackerForId = (id) => {
    setTrackedOrderId(id);
    setIsTrackerOpen(true);
  };

  const handleFullLogout = () => {
    setIsGuest(false);
    setAdminPreview(false);
    logout();
  };

  // 1. If not authenticated and has not clicked guest: SHOW AUTHENTICATION PAGE FIRST
  if (!isAuthenticated && !isGuest) {
    return (
      <AuthPage
        onContinueAsGuest={() => setIsGuest(true)}
      />
    );
  }

  // 2. If authenticated as ADMIN (and not in preview mode): SHOW ADMIN DASHBOARD
  if (isAdmin && !adminPreview) {
    return (
      <AdminDashboard
        onPreviewClientView={() => setAdminPreview(true)}
        onMenuUpdated={loadMenu}
      />
    );
  }

  // 3. Otherwise: SHOW CLIENT STOREFRONT (Customer view or Admin Preview)
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Admin Preview Floating Header if admin is previewing client site */}
      {isAdmin && adminPreview && (
        <div className="sticky top-0 z-50 bg-[#131b2e] text-slate-200 px-4 py-2.5 text-xs flex items-center justify-between border-b border-slate-800 shadow-md">
          <div className="flex items-center gap-2 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Mode Aperçu Client • Vous naviguez avec la vue client</span>
          </div>
          <button
            onClick={() => setAdminPreview(false)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xs transition-all cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Revenir au Dashboard Admin &rarr;</span>
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        vegOnly={vegOnly}
        setVegOnly={setVegOnly}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => setAdminPreview(false)}
        onOpenTracker={handleOpenTrackerForId}
        activeOrderId={trackedOrderId}
        onLogout={handleFullLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* Hero Section */}
        <HeroBanner />

        {/* Category Horizontal Selector */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Menu Section Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-100 flex items-center gap-2">
              <span>Carte des Plats Gourmands</span>
              <span className="text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                {menuItems.length} spécialités
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Plats artisanaux préparés à la commande avec des ingrédients frais du terroir
            </p>
          </div>

          <button
            onClick={loadMenu}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-[#131b2e] hover:bg-slate-800 text-slate-300 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Actualiser</span>
          </button>
        </div>

        {/* Menu Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-80 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800"
              />
            ))}
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-16 bg-[#131b2e] rounded-3xl border border-slate-800 shadow-xs">
            <div className="w-16 h-16 bg-slate-900 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl">
              🔍
            </div>
            <h3 className="text-base font-bold text-slate-100">Aucun plat correspondant trouvé</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Nous n'avons pas trouvé de spécialité correspondant à vos filtres. Réinitialisez la recherche ou changez de catégorie.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchTerm(''); setVegOnly(false); }}
              className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Réinitialiser les Filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {menuItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-slate-400 text-xs py-10 border-t border-slate-800/80 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🍕</span>
            <span className="font-black text-slate-200 text-sm">CraveDash Food Delivery</span>
            <span className="text-slate-600">|</span>
            <span>Plateforme Complète Full-Stack</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Serveur: <strong className="text-emerald-400">Express :5001</strong></span>
            <span>Client: <strong className="text-amber-400">React + Vite :5173</strong></span>
          </div>
        </div>
      </footer>

      {/* Modals and Overlays */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orderId={trackedOrderId}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
