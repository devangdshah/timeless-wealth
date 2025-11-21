
import React from 'react';
import { CATEGORIES } from '../types';

interface CategoryListProps {
  onSelect: (query: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 mt-16 max-w-7xl mx-auto px-4">
      {CATEGORIES.map((cat, idx) => (
        <div key={idx} className="text-center flex flex-col items-center">
          <h3 className="text-xs font-bold text-wealth-400 uppercase tracking-wider mb-3 border-b border-wealth-200 pb-1 w-3/4">
            {cat.title}
          </h3>
          <ul className="space-y-2 w-full">
            {cat.items.map((item, nIdx) => (
              <li key={nIdx}>
                <button 
                  onClick={() => onSelect(item.query)}
                  className="text-xs text-wealth-600 font-medium hover:text-wealth-900 hover:bg-wealth-200/50 py-1 px-2 rounded-md transition-all w-full truncate text-center active:scale-95"
                  title={`Get wisdom from ${item.query}`}
                >
                  {item.display}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
