import React from 'react';
import { Star, Clock, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const FoodCard = ({ item }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const cartItem = cartItems.find((i) => i.id === item.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  return (
    <div className="group flex flex-col bg-slate-50 rounded-3xl border border-slate-200/80 hover:border-slate-300/80 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      
      {/* Food Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden bg-white">
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
        <div className="absolute top-3 left-3 bg-slate-100/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-300 shadow-xs flex items-center justify-center">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              item.isVeg
                ? 'bg-whitemerald-400'
                : 'bg-rose-400'
            }`}
            title={item.isVeg ? 'Végétarien' : 'Non-Végétarien'}
          />
        </div>

        {/* Prep Time Tag */}
        {item.prepTime && (
          <div className="absolute top-3 right-3 bg-slate-100/80 backdrop-blur-md text-slate-700 text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 border border-slate-200 shadow-xs">
            <Clock className="w-3 h-3 text-red-500" />
            <span>{item.prepTime}</span>
          </div>
        )}

        {/* Popular Tag */}
        {item.isPopular && (
          <div className="absolute bottom-3 left-3 bg-red-600/20 text-red-600 border border-red-600/30 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-xs">
            Populaire
          </div>
        )}
      </div>

      {/* Food Details */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Rating and Category */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-bold text-red-500">{item.category}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-red-500 text-red-500" />
              <span className="font-bold text-slate-800">{item.rating || 4.8}</span>
              <span className="text-slate-400 text-[11px]">({item.reviewsCount || 85})</span>
            </div>
          </div>

          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-red-600 transition-colors">
            {item.name}
          </h3>

          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Cart Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/80">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Prix</span>
            <span className="text-lg font-black text-slate-900">
              ${item.price.toFixed(2)}
            </span>
          </div>

          {!item.isAvailable ? (
            <span className="text-xs font-bold text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
              Épuisé
            </span>
          ) : quantityInCart > 0 ? (
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-2xl p-1 shadow-xs">
              <button
                onClick={() => updateQuantity(item.id, -1)}
                className="w-7 h-7 rounded-xl bg-slate-50 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                aria-label="Diminuer la quantité"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-black text-red-500 px-1 min-w-4 text-center">
                {quantityInCart}
              </span>
              <button
                onClick={() => updateQuantity(item.id, 1)}
                className="w-7 h-7 rounded-xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                aria-label="Augmenter la quantité"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(item)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer"
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
