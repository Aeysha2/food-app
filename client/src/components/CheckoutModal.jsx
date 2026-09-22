import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Banknote, MapPin, Phone, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const CheckoutModal = ({ isOpen, onClose, onOrderPlaced }) => {
  const { cartItems, subtotal, discount, tax, deliveryFee, grandTotal, clearCart } = useCart();
  const { user, token } = useAuth();

  const [address, setAddress] = useState(user?.address || '123 Rue de la Paix, Paris');
  const [phone, setPhone] = useState(user?.phone || '+33 6 12 34 56 78');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'cod'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Veuillez renseigner votre adresse de livraison.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity
        })),
        deliveryAddress: address,
        phone,
        deliveryNotes: notes,
        paymentMethod: paymentMethod === 'card' ? 'Credit Card (Stripe)' : (paymentMethod === 'cod' ? 'Cash on Delivery' : 'Digital Wallet'),
        customerName: user?.name || 'Client Gourmet',
        customerEmail: user?.email || 'client@example.com'
      };

      const result = await api.createOrder(orderPayload, token);
      clearCart();
      onClose();
      onOrderPlaced(result.order);
    } catch (err) {
      setError(err.message || 'Échec de la commande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs" />

      <div className="relative bg-[#131b2e] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-800 text-slate-200">
        
        {/* Header */}
        <div className="p-5 bg-[#0f172a] border-b border-slate-800 text-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black tracking-tight">Finaliser Votre Commande</h2>
            <p className="text-xs text-slate-400 mt-0.5">Livraison rapide garantie en 25–35 minutes</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmitOrder} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Adresse de Livraison *</span>
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: 12 Rue Saint-Honoré, Bâtiment B, Paris"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:border-amber-500/60 outline-none transition-all"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Téléphone de Contact</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+33 6 00 00 00 00"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:border-amber-500/60 outline-none transition-all"
            />
          </div>

          {/* Delivery Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>Instructions pour le livreur (Optionnel)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Code porte, interphone, étage..."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:border-amber-500/60 outline-none transition-all"
            />
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Mode de Règlement
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-amber-500/50 bg-amber-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <CreditCard className={`w-4 h-4 mt-0.5 ${paymentMethod === 'card' ? 'text-amber-400' : 'text-slate-500'}`} />
                <div>
                  <div className="text-xs font-bold text-slate-100">Carte Bancaire</div>
                  <div className="text-[10px] text-slate-400">Paiement direct sécurisé</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-amber-500/50 bg-amber-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <Banknote className={`w-4 h-4 mt-0.5 ${paymentMethod === 'cod' ? 'text-amber-400' : 'text-slate-500'}`} />
                <div>
                  <div className="text-xs font-bold text-slate-100">Espèces / Livraison</div>
                  <div className="text-[10px] text-slate-400">Paiement à la réception</div>
                </div>
              </button>

            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs space-y-1.5 text-slate-400">
            <div className="flex justify-between">
              <span>Articles ({cartItems.length} plats)</span>
              <span className="font-semibold text-slate-200">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Code promo appliqué</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Frais & Taxes</span>
              <span className="font-semibold text-slate-200">${(tax + deliveryFee).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-100 pt-1.5 border-t border-slate-800">
              <span>Montant Total</span>
              <span className="text-amber-400">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Validation de la commande...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Confirmer la Commande • ${grandTotal.toFixed(2)}</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1.5 pt-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Paiement sécurisé et préparation immédiate</span>
          </p>

        </form>

      </div>
    </div>
  );
};
