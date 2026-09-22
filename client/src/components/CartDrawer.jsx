import React from 'react';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer = ({ isOpen, onClose, onProceedCheckout }) => {
  const {
    cartItems,
    subtotal,
    discount,
    tax,
    deliveryFee,
    grandTotal,
    totalCount,
    updateQuantity,
    removeFromCart,
    couponCode,
    setCouponCode,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#131b2e] border-l border-slate-800 text-slate-200 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0f172a]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-100 leading-tight">Votre Panier</h2>
                <p className="text-xs text-slate-400 font-medium">
                  {totalCount} {totalCount === 1 ? 'article sélectionné' : 'articles sélectionnés'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-800/80">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl mb-4 text-amber-400">
                  🛒
                </div>
                <h3 className="text-sm font-bold text-slate-200 mb-1">Votre panier est vide</h3>
                <p className="text-xs text-slate-400 max-w-xs mb-6">
                  Découvrez les spécialités de nos chefs et ajoutez vos plats favoris !
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Découvrir le Menu
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 flex items-center gap-3.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-slate-900"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                      {item.name}
                    </h4>
                    <span className="text-xs font-black text-amber-400 block mt-0.5">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      ${item.price.toFixed(2)} l'unité
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer"
                      aria-label="Diminuer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-slate-200 w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center hover:bg-amber-400 transition-colors cursor-pointer font-bold"
                      aria-label="Augmenter"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-400 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
                    aria-label="Supprimer l'article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer with Calculations & Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-[#0f172a] space-y-4">
              
              {/* Coupon Code Box */}
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Code promo (ex: CRAVE20)"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 uppercase font-bold text-slate-100 placeholder:normal-case placeholder:font-normal outline-none focus:border-amber-500/60"
                    />
                  </div>
                  <button
                    onClick={() => applyCoupon(couponCode)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700 cursor-pointer"
                  >
                    Appliquer
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                    <span>Coupon '{appliedCoupon.code}' activé (-20%)</span>
                    <button onClick={removeCoupon} className="text-slate-400 hover:text-rose-400">
                      Retirer
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-400 font-medium">{couponError}</p>
                )}
              </div>

              {/* Bill Breakdown */}
              <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>Sous-total articles</span>
                  <span className="font-semibold text-slate-200">${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Réduction promo</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Taxes (8%)</span>
                  <span className="font-semibold text-slate-200">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Frais de livraison</span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-400 font-bold uppercase text-[10px] bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      Livraison Offerte
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-200">${deliveryFee.toFixed(2)}</span>
                  )}
                </div>

                {subtotal < 45 && subtotal > 0 && (
                  <p className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg font-medium">
                    💡 Plus que ${(45 - subtotal).toFixed(2)} pour la <strong>livraison gratuite</strong> !
                  </p>
                )}

                <div className="flex justify-between text-base font-black text-slate-100 pt-2 border-t border-slate-800">
                  <span>Total Commande</span>
                  <span className="text-amber-400">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <button
                onClick={onProceedCheckout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-black rounded-2xl shadow-sm transition-all text-xs cursor-pointer"
              >
                <span>Passer à la Caisse</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
