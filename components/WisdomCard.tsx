
import React from 'react';
import { WisdomData } from '../types';

interface WisdomCardProps {
  data: WisdomData;
  loading: boolean;
  onShowToast: (msg: string) => void;
}

export const WisdomCard: React.FC<WisdomCardProps> = ({ data, loading, onShowToast }) => {
  
  const handleCopy = async () => {
    if (data.quote) {
      try {
        const textToCopy = `"${data.quote}" - ${data.investorName}\n\nTimeless Wealth App`;
        await navigator.clipboard.writeText(textToCopy);
        onShowToast("Quote copied to clipboard!");
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto min-h-[400px] glass-panel rounded-3xl p-12 flex flex-col items-center justify-center animate-pulse">
        <div className="h-4 bg-wealth-200 rounded w-1/3 mb-8"></div>
        <div className="h-8 bg-wealth-300 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-wealth-300 rounded w-2/3 mb-12"></div>
        <div className="h-24 bg-wealth-100 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto relative perspective-1000">
      <div className="glass-panel rounded-3xl p-8 md:p-16 shadow-2xl transform transition-all duration-700 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-t-4 border-t-wealth-600 relative overflow-hidden group">
        
        {/* Copy Button (Visible on Hover/Active) */}
        <button 
          onClick={handleCopy}
          className="absolute top-6 right-6 z-30 p-2 rounded-full bg-wealth-100 hover:bg-wealth-200 text-wealth-600 transition-all opacity-0 group-hover:opacity-100 transform translate-y-[-10px] group-hover:translate-y-0"
          title="Copy Quote"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5" />
          </svg>
        </button>

        {/* Background Watermark decoration */}
        <div className="absolute -top-10 -right-10 text-wealth-900 opacity-[0.03] text-9xl font-serif select-none pointer-events-none">
          “
        </div>

        {/* Category Label */}
        <div className="flex justify-center mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-wealth-50 text-wealth-600 text-xs font-bold tracking-widest uppercase border border-wealth-200">
            {data.category}
          </span>
        </div>

        {/* Main Quote */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-5xl text-wealth-900 leading-tight italic relative z-10">
            <span className="text-wealth-400 text-4xl md:text-6xl absolute -top-4 -left-4 md:-left-8 select-none">“</span>
            {data.quote}
            <span className="text-wealth-400 text-4xl md:text-6xl absolute -bottom-8 -right-2 select-none">”</span>
          </h1>
        </div>

        {/* Author & Source */}
        <div className="text-center mb-12">
          <h2 className="text-xl font-display font-bold text-wealth-800 mb-1">
            {data.investorName}
          </h2>
          {data.sourceBook && (
            <p className="text-wealth-500 text-sm italic">
              Author of <span className="font-semibold text-wealth-600">{data.sourceBook}</span>
            </p>
          )}
        </div>

        {/* The "Wisdom" Section (Investment Advice) */}
        <div className="bg-gradient-to-br from-wealth-50 to-white rounded-2xl p-8 border border-wealth-100 shadow-inner relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-wealth-600 text-white px-4 py-1 rounded-md shadow-md text-xs font-bold tracking-wider uppercase">
              Simple Wisdom
            </div>
          </div>
          <p className="text-wealth-700 text-lg md:text-xl leading-relaxed text-center font-sans font-light">
            {data.wisdom}
          </p>
        </div>

      </div>
    </div>
  );
};
