
import React from 'react';
import { CATEGORIES } from '../types';

interface AuthorCloudProps {
  onSelect: (author: string) => void;
}

export const AuthorCloud: React.FC<AuthorCloudProps> = ({ onSelect }) => {
  // Flatten all authors into a single list
  const allAuthors = CATEGORIES.flatMap(c => c.items);

  // Helper to determine font size/weight based on subjective popularity/significance
  // giving a visual hierarchy to the cloud
  const getStyles = (name: string) => {
    const tier1 = ['Buffett', 'Munger', 'Lynch', 'Dalio', 'Simons', 'Graham', 'Soros'];
    const tier2 = ['Bogle', 'Marks', 'Fisher', 'Thiel', 'Wood', 'Asness'];

    if (tier1.some(n => name.includes(n))) {
      return 'text-3xl md:text-4xl font-bold text-wealth-800 opacity-100';
    }
    if (tier2.some(n => name.includes(n))) {
      return 'text-xl md:text-2xl font-semibold text-wealth-700 opacity-90';
    }
    return 'text-base md:text-lg font-medium text-wealth-600 opacity-75';
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-16 mb-8 px-6">
      <div className="text-center mb-8">
        <h3 className="font-display text-wealth-900 text-xl tracking-wide">Wisdom by Legend</h3>
        <div className="w-12 h-1 bg-wealth-300 mx-auto mt-2 rounded-full"></div>
      </div>
      
      <div className="flex flex-wrap justify-center items-baseline gap-x-6 gap-y-4">
        {allAuthors.map((auth, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(auth.query)}
            className={`font-serif transition-all duration-300 hover:text-gold-600 hover:opacity-100 hover:scale-110 active:scale-95 ${getStyles(auth.display)}`}
            title={`Get wisdom from ${auth.display}`}
          >
            {auth.display}
          </button>
        ))}
      </div>
    </div>
  );
};
