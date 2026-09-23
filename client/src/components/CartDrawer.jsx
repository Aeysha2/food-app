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
        className="absolute inset-0 bg-slate-100/80 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-50 border-l border-slate-200 text-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-red-600/10 border border-red-600/20 rounded-xl text-red-500">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 leading-tight">Votre Panier</h2>
                <p className="text-xs text-slate-400 font-medium">
                  {totalCount} {totalCount === 1 ? 'article sélectionné' : 'articles sélectionnés'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-200/80">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 flex items-center justify-center text-3xl mb-4 text-red-500">
                  🛒
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Votre panier est vide</h3>
                <p className="text-xs text-slate-400 max-w-xs mb-6">
                  Découvrez les spécialités de nos chefs et ajoutez vos plats favoris !
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer"
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
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-white"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <span className="text-xs font-black text-red-500 block mt-0.5">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      ${item.price.toFixed(2)} l'unité
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
                      aria-label="Diminuer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-slate-800 w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer font-bold"
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
            <div className="p-5 border-t border-slate-200 bg-white space-y-4">
              
              {/* Coupon Code Box */}
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Code promo (ex: CRAVE20)"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white uppercase font-bold text-slate-900 placeholder:normal-case placeholder:font-normal outline-none focus:border-red-600/60"
                    />
                  </div>
                  <button
                    onClick={() => applyCoupon(couponCode)}
                    className="px-3 py-2 bg-slate-50 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all border border-slate-300 cursor-pointer"
                  >
                    Appliquer
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 bg-whitemerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
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
              <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>Sous-total articles</span>
                  <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Réduction promo</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Taxes (8%)</span>
                  <span className="font-semibold text-slate-800">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Frais de livraison</span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-400 font-bold uppercase text-[10px] bg-whitemerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      Livraison Offerte
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-800">${deliveryFee.toFixed(2)}</span>
                  )}
                </div>

                {subtotal < 45 && subtotal > 0 && (
                  <p className="text-[11px] text-red-600 bg-red-600/10 border border-red-600/20 p-2 rounded-lg font-medium">
                    💡 Plus que ${(45 - subtotal).toFixed(2)} pour la <strong>livraison gratuite</strong> !
                  </p>
                )}

                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Commande</span>
                  <span className="text-red-500">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <button
                onClick={onProceedCheckout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-500 active:scale-98 text-white font-black rounded-2xl shadow-sm transition-all text-xs cursor-pointer"
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
