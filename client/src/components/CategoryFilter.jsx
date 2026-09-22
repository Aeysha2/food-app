import React from 'react';

const CATEGORY_ICONS = {
  All: '🍽️',
  Burgers: '🍔',
  Pizza: '🍕',
  Asian: '🍣',
  Pasta: '🍝',
  Healthy: '🥗',
  Desserts: '🍰',
  Drinks: '🥤'
};

export const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-black text-slate-100 tracking-tight">
          Explorer par Catégorie
        </h2>
        <span className="text-xs font-semibold text-slate-400">
          Sélection : <span className="text-amber-400 font-bold">{selectedCategory}</span>
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          const icon = CATEGORY_ICONS[cat] || '🍴';

          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                  : 'bg-[#131b2e] hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span className="text-base">{icon}</span>
              <span>{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
