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
        <h2 className="text-lg font-black text-slate-900 tracking-tight">
          Explorer par Catégorie
        </h2>
        <span className="text-xs font-semibold text-slate-400">
          Sélection : <span className="text-red-500 font-bold">{selectedCategory}</span>
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
                  ? 'bg-red-600/20 text-red-600 border border-red-600/40 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
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
