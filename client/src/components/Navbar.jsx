import React from 'react';
import { ShoppingBag, Search, User, ShieldCheck, MapPin, Compass } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({
  searchTerm,
  setSearchTerm,
  vegOnly,
  setVegOnly,
  onOpenCart,
  onOpenAuth,
  onOpenAdmin,
  onOpenTracker,
  activeOrderId,
  onLogout
}) => {
  const { totalCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/95 backdrop-blur-md border-b border-slate-800/80 shadow-sm text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
              <span className="text-2xl select-none">🍕</span>
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-100 flex items-center gap-1.5">
                Crave<span className="text-amber-400">Dash</span>
              </span>
              <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>Centre-Ville • Livraison Rapide</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher burgers, pizzas artisanales, sushis..."
                className="w-full pl-10 pr-4 py-2 bg-[#131b2e] hover:bg-[#162238] focus:bg-[#162238] text-sm text-slate-100 placeholder-slate-500 rounded-full border border-slate-800 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 rounded-full px-2 py-0.5"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Pure Veg Toggle */}
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                vegOnly
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-[#131b2e] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${vegOnly ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              <span>100% Végé</span>
            </button>

            {/* Live Track Order button (if any order is active) */}
            {activeOrderId && (
              <button
                onClick={() => onOpenTracker(activeOrderId)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all cursor-pointer"
                title="Suivre la commande en cours"
              >
                <Compass className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Suivi</span> #{activeOrderId.slice(-4)}
              </button>
            )}

            {/* Admin Dashboard button */}
            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Admin Hub</span>
              </button>
            )}

            {/* User Account / Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-1">
                <div className="hidden lg:block text-right">
                  <div className="text-xs font-bold text-slate-200 leading-tight">{user.name}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{user.role === 'admin' ? 'Gérant Admin' : 'Client'}</div>
                </div>
                <button
                  onClick={onLogout || logout}
                  className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition-all border border-slate-800 cursor-pointer"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <button
                onClick={onLogout || onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#131b2e] hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all cursor-pointer"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>Connexion</span>
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center justify-center p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Ouvrir le panier"
            >
              <ShoppingBag className="w-5 h-5 text-slate-950" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-amber-300 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-amber-400/50 shadow-xs">
                  {totalCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un plat..."
              className="w-full pl-10 pr-4 py-2 bg-[#131b2e] text-sm text-slate-100 rounded-xl border border-slate-800 outline-none"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
