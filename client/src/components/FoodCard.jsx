import React from 'react';
import { Star, Clock, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const FoodCard = ({ item }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const cartItem = cartItems.find((i) => i.id === item.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  return (
    <div className="group flex flex-col bg-[#131b2e] rounded-3xl border border-slate-800/80 hover:border-slate-700/80 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      
      {/* Food Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-xs flex items-center justify-center">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              item.isVeg
                ? 'bg-emerald-400'
                : 'bg-rose-400'
            }`}
            title={item.isVeg ? 'Végétarien' : 'Non-Végétarien'}
          />
        </div>

        {/* Prep Time Tag */}
        {item.prepTime && (
          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-slate-300 text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 border border-slate-800 shadow-xs">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{item.prepTime}</span>
          </div>
        )}

        {/* Popular Tag */}
        {item.isPopular && (
          <div className="absolute bottom-3 left-3 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-xs">
            Populaire
          </div>
        )}
      </div>

      {/* Food Details */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Rating and Category */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-bold text-amber-400">{item.category}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-200">{item.rating || 4.8}</span>
              <span className="text-slate-500 text-[11px]">({item.reviewsCount || 85})</span>
            </div>
          </div>

          <h3 className="font-bold text-slate-100 text-base leading-snug group-hover:text-amber-300 transition-colors">
            {item.name}
          </h3>

          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Cart Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80">
          <div>
            <span className="text-[10px] text-slate-500 block font-medium">Prix</span>
            <span className="text-lg font-black text-slate-100">
              ${item.price.toFixed(2)}
            </span>
          </div>

          {!item.isAvailable ? (
            <span className="text-xs font-bold text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              Épuisé
            </span>
          ) : quantityInCart > 0 ? (
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-2xl p-1 shadow-xs">
              <button
                onClick={() => updateQuantity(item.id, -1)}
                className="w-7 h-7 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                aria-label="Diminuer la quantité"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-black text-amber-400 px-1 min-w-4 text-center">
                {quantityInCart}
              </span>
              <button
                onClick={() => updateQuantity(item.id, 1)}
                className="w-7 h-7 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                aria-label="Augmenter la quantité"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(item)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
