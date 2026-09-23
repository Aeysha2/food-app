import React, { useState, useEffect } from 'react';
import { X, Check, Clock, ChefHat, Bike, CheckCircle, RefreshCw, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  { key: 'Order Placed', label: 'Commande Reçue', desc: 'Validée par la cuisine', icon: Clock },
  { key: 'Preparing Food', label: 'En Préparation', desc: 'Ingrédients frais en cuisson', icon: ChefHat },
  { key: 'Out for Delivery', label: 'En Livraison', desc: 'Livreur en route vers chez vous', icon: Bike },
  { key: 'Delivered', label: 'Livrée', desc: 'Bonne dégustation !', icon: CheckCircle }
];

export const OrderTrackerModal = ({ isOpen, onClose, orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token, isAdmin } = useAuth();

  const fetchOrder = async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const data = await api.getOrderById(orderId);
      setOrder(data.order);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrder();
    }
  }, [isOpen, orderId]);

  if (!isOpen || !order) return null;

  // Determine current active step index
  const currentIndex = STEPS.findIndex((s) => s.key === order.status);
  const activeStep = currentIndex === -1 ? 0 : currentIndex;

  // Simulate advancing status
  const handleAdvanceStatus = async () => {
    const nextIndex = (activeStep + 1) % STEPS.length;
    const nextStatus = STEPS[nextIndex].key;
    try {
      await api.updateOrderStatus(order.id, nextStatus, token);
      fetchOrder();
    } catch (err) {
      setOrder((prev) => ({ ...prev, status: nextStatus }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-100/80 backdrop-blur-xs" />

      <div className="relative bg-slate-50 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 text-slate-800">
        
        {/* Header */}
        <div className="p-6 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-500">
                Suivi de Commande en Direct
              </span>
              <span className="w-2 h-2 rounded-full bg-whitemerald-400 animate-pulse" />
            </div>
            <h2 className="text-xl font-black mt-0.5 tracking-tight">
              Commande #{order.id}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrder}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Actualiser le statut"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-red-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Estimated Time Card */}
        <div className="p-5 bg-white/90 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">Délai Estimé</span>
            <span className="text-xl font-black text-slate-900">
              {order.status === 'Delivered' ? 'Commande Livrée !' : order.estimatedDeliveryTime || '25-35 min'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-semibold block">Total Commande</span>
            <span className="text-lg font-black text-red-500">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* 4-Step Stepper Flow */}
        <div className="p-6 space-y-6">
          <div className="relative">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx < activeStep;
              const isCurrent = idx === activeStep;

              return (
                <div key={step.key} className="relative flex items-start gap-4 pb-6 last:pb-0">
                  {/* Vertical connecting line */}
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`absolute left-5 top-10 w-0.5 h-12 -ml-px transition-colors ${
                        idx < activeStep ? 'bg-red-600' : 'bg-slate-50'
                      }`}
                    />
                  )}

                  {/* Icon Circle */}
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all ${
                      isCompleted
                        ? 'bg-red-600 text-white font-black shadow-sm'
                        : isCurrent
                        ? 'bg-red-600/20 text-red-600 border border-red-600/40 shadow-sm'
                        : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-5 h-5" />}
                  </div>

                  {/* Step Description */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs sm:text-sm font-bold ${
                          isCurrent
                            ? 'text-red-600'
                            : isCompleted
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      {isCurrent && (
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-red-600/15 text-red-600 border border-red-600/30 px-2 py-0.5 rounded-full">
                          En cours
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Details */}
          <div className="p-3.5 bg-slate-100/80 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">Adresse de Livraison :</span>
                <span className="text-slate-400">{order.deliveryAddress}</span>
              </div>
            </div>
          </div>

          {/* Ordered Dishes Recap */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Articles Commandés
            </h4>
            <div className="divide-y divide-slate-200 max-h-36 overflow-y-auto">
              {order.items.map((it, i) => (
                <div key={i} className="py-2 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">
                    <span className="font-bold text-red-500 mr-1.5">{it.quantity}x</span>
                    {it.name}
                  </span>
                  <span className="font-semibold text-slate-700">
                    ${(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulation / Interactive Step button */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">
              Mode Démo : Tester la progression
            </span>
            <button
              onClick={handleAdvanceStatus}
              className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer border border-slate-300"
            >
              Étape Suivante ➡️
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
