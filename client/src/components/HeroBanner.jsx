import React, { useState } from 'react';
import { Sparkles, Clock, Flame, ShieldCheck, Check } from 'lucide-react';

export const HeroBanner = () => {
  const [copied, setCopied] = useState(false);

  const copyCoupon = () => {
    navigator.clipboard.writeText('CRAVE20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-50 border border-slate-200/80 text-slate-900 p-6 sm:p-10 my-6 shadow-lg">
      {/* Soft Glow */}
      <div className="absolute -right-16 -top-16 w-72 h-72 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-xs font-semibold text-red-500 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Envie d'un repas d'exception ?</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4 text-slate-900">
          Plats Gourmands d'Artisans, <br className="hidden sm:inline" />
          <span className="text-red-500">
            Livrés Chauds chez Vous.
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
          Savourez nos burgers smash, pizzas au feu de bois et pâtes fraîches préparées avec soin par nos chefs locaux. Ingrédients certifiés frais du jour.
        </p>

        {/* Promo Coupon Card */}
        <div className="inline-flex flex-wrap items-center gap-3 p-2 bg-slate-100/80 rounded-2xl border border-slate-200">
          <div className="px-3 py-1 bg-red-600/20 text-red-600 border border-red-600/30 text-xs font-bold rounded-xl uppercase tracking-wider">
            Offre Spéciale
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-700">
            -20% sur votre commande avec le code :
          </span>
          <button
            onClick={copyCoupon}
            className="flex items-center gap-1.5 px-3.5 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-950" /> : <Flame className="w-3.5 h-3.5 text-white" />}
            <span>CRAVE20</span>
            <span className="text-[10px] text-slate-800 font-semibold">
              {copied ? '(Copié !)' : '(Copier)'}
            </span>
          </button>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-slate-200/80 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-500 shrink-0" />
            <span>Livraison 25-35 Min</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500 shrink-0" />
            <span>Chaud & Frais</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Gratuit dès 45$</span>
          </div>
        </div>
      </div>
    </div>
  );
};
