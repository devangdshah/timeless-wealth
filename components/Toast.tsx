import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out">
      <div className={`px-6 py-3 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] flex items-center gap-3 border backdrop-blur-md ${
        type === 'success' 
          ? 'bg-wealth-900/95 text-white border-wealth-600' 
          : 'bg-red-50 text-red-800 border-red-200'
      }`}>
        {type === 'success' && (
          <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        <span className="font-sans font-medium text-sm tracking-wide">{message}</span>
      </div>
    </div>
  );
};