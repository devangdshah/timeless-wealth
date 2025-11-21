
import React, { useState, useEffect } from 'react';

interface NewsletterProps {
  onShowToast: (msg: string) => void;
}

export const Newsletter: React.FC<NewsletterProps> = ({ onShowToast }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const subscribed = localStorage.getItem('tw_subscribed');
    if (subscribed === 'true') {
      setIsSubscribed(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setIsSubscribed(true);
      localStorage.setItem('tw_subscribed', 'true');
      setEmail('');
      onShowToast("Subscription feature coming up!");
    }, 1500);
  };

  if (isSubscribed) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-16 mb-8 p-8 bg-wealth-900 rounded-2xl text-center shadow-2xl border border-wealth-700 transform transition-all">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-wealth-700 rounded-full flex items-center justify-center border border-wealth-600">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gold-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-display font-bold text-white mb-2">Coming Up</h3>
        <p className="text-wealth-300">
          Thanks for your interest! We are currently building the daily wisdom delivery system.
        </p>
        <button 
          onClick={() => {
            localStorage.removeItem('tw_subscribed');
            setIsSubscribed(false);
            setStatus('idle');
            onShowToast("Reset complete.");
          }}
          className="mt-6 text-xs text-wealth-500 hover:text-wealth-300 underline"
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-20 mb-8 p-1 bg-gradient-to-r from-wealth-700 via-wealth-800 to-wealth-900 rounded-2xl shadow-2xl">
      <div className="bg-wealth-900 rounded-xl px-8 py-12 md:px-16 text-center border border-wealth-700/50 relative overflow-hidden">
        
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-wealth-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 relative z-10">
          Daily Wisdom at Market Open
        </h3>
        <p className="text-wealth-300 mb-8 max-w-md mx-auto leading-relaxed relative z-10">
          Join smart investors receiving one curated, non-repetitive investment insight every morning at 9:30 AM ET.
        </p>

        <form onSubmit={handleSubmit} className="relative z-10 max-w-md mx-auto flex flex-col md:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            className="flex-1 px-5 py-3 rounded-lg bg-wealth-950/50 border border-wealth-700 text-white placeholder-wealth-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all disabled:opacity-50"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-wealth-950 font-bold rounded-lg shadow-lg shadow-gold-900/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center min-w-[120px]"
          >
            {status === 'loading' ? (
              <svg className="animate-spin h-5 w-5 text-wealth-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
        
        <p className="mt-4 text-[10px] text-wealth-500 uppercase tracking-widest relative z-10">
          Demo Mode • No Email Will Be Sent • Unsubscribe Anytime
        </p>
      </div>
    </div>
  );
};
