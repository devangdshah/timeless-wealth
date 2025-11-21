
import React, { useState, useEffect, useCallback } from 'react';
import { fetchRandomWisdom } from './services/geminiService';
import { WisdomCard } from './components/WisdomCard';
import { CountdownTimer } from './components/CountdownTimer';
import { CategoryList } from './components/CategoryList';
import { Newsletter } from './components/Newsletter';
import { AuthorCloud } from './components/AuthorCloud';
import { Toast } from './components/Toast';
import { WisdomData } from './types';

// 10 Minutes in milliseconds
const REFRESH_INTERVAL = 10 * 60 * 1000;

const App: React.FC = () => {
  const [data, setData] = useState<WisdomData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextUpdate, setNextUpdate] = useState<number>(0);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);
  
  // Sticky state for the selected investor. If set, refresh will stick to this person.
  const [selectedInvestor, setSelectedInvestor] = useState<string | undefined>(undefined);

  // Maintain a history of quotes to avoid repetition in the same session
  const [quoteHistory, setQuoteHistory] = useState<string[]>([]);

  // Memoized fetch function
  // specificInvestor: 
  //   string -> specific person (override)
  //   null   -> force random (reset)
  //   undefined -> use current sticky state (refresh/timer)
  const loadNewWisdom = useCallback(async (specificInvestor?: string | null) => {
    setLoading(true);
    
    let targetInvestor: string | undefined;
    
    if (specificInvestor === null) {
      targetInvestor = undefined; // Force random
    } else if (specificInvestor !== undefined) {
      targetInvestor = specificInvestor; // Use override
    } else {
      targetInvestor = selectedInvestor; // Fallback to sticky state
    }
    
    // If specificInvestor is passed (manual selection), we might want to rely on the caller to update state
    // But here we just use the logic that if we are in a "mode", we stay in it unless overridden.
    // Note: If specificInvestor is passed as undefined (e.g. timer refresh), it falls back to selectedInvestor.
    
    const wisdom = await fetchRandomWisdom(targetInvestor, quoteHistory);
    
    setData(wisdom);
    
    // Update history
    if (wisdom.quote) {
      setQuoteHistory(prev => {
        const newHistory = [...prev, wisdom.quote];
        // Keep the last 50 quotes in history to force the AI to dig deep for variety
        // This specifically helps with popular investors like Buffett/Munger having 20+ unique quotes available
        return newHistory.slice(-50);
      });
    }
    
    setLoading(false);
    
    // Reset the timer whenever new wisdom is loaded (manual or automatic)
    const now = Date.now();
    setNextUpdate(now + REFRESH_INTERVAL);
  }, [quoteHistory, selectedInvestor]);

  // Initial automatic load
  useEffect(() => {
    // Only load if we don't have data yet (prevents double load on strict mode mounting)
    if (!data) {
      loadNewWisdom();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefreshNow = () => {
    loadNewWisdom(); // Will use selectedInvestor from state if active
  };

  const handleSelectInvestor = (investorName: string) => {
    setSelectedInvestor(investorName);
    loadNewWisdom(investorName);
    // Scroll to top smoothly to show the card
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Focusing on ${investorName.split(' ')[0]}...`);
  };

  const handleReset = () => {
    if (selectedInvestor) {
      setSelectedInvestor(undefined);
      loadNewWisdom(null); // Pass null to force random
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast("Back to random wisdom.");
    } else {
      // Just refresh if already random
      handleRefreshNow();
    }
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f0f4f3] to-[#e2ebe8] text-wealth-900 overflow-x-hidden font-sans relative">
      
      {/* Navbar / Header */}
      <nav className="w-full p-6 flex justify-between items-center max-w-7xl mx-auto relative z-20">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={handleReset}
          title="Reset to random"
        >
          <div className="w-10 h-10 bg-wealth-900 rounded-lg flex items-center justify-center text-wealth-50 font-display text-xl font-bold shadow-lg group-hover:bg-wealth-800 transition-colors">
            T
          </div>
          <div className="hidden md:block">
            <h1 className="font-display font-bold text-lg text-wealth-900 tracking-tight group-hover:text-wealth-700 transition-colors">Timeless Wealth</h1>
            <p className="text-[10px] text-wealth-500 uppercase tracking-widest">Daily Compounding</p>
          </div>
        </div>

        {/* Active Filter Indicator */}
        {selectedInvestor && (
          <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
             <button 
               onClick={handleReset}
               className="bg-wealth-200 hover:bg-wealth-300 text-wealth-800 text-xs px-4 py-1.5 rounded-full flex items-center gap-2 transition-all border border-wealth-300"
             >
                <span className="font-medium">Filter: {selectedInvestor.split('(')[0]}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* Timer */}
          {nextUpdate > 0 && (
            <CountdownTimer 
              nextUpdate={nextUpdate} 
              totalDuration={REFRESH_INTERVAL} 
              onComplete={() => loadNewWisdom()} 
            />
          )}
          
          {/* Manual Refresh Button */}
          <button 
            onClick={handleRefreshNow}
            className="bg-white hover:bg-wealth-50 text-wealth-600 border border-wealth-200 p-2.5 rounded-full shadow-sm transition-all active:scale-95"
            title={selectedInvestor ? `Next quote from ${selectedInvestor}` : "Get random wisdom now"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>
      </nav>
      
      {/* Mobile Filter Indicator */}
      {selectedInvestor && (
        <div className="md:hidden w-full flex justify-center mb-4 px-4">
            <button 
               onClick={handleReset}
               className="bg-wealth-200 hover:bg-wealth-300 text-wealth-800 text-xs px-4 py-1.5 rounded-full flex items-center gap-2 transition-all border border-wealth-300 w-full justify-center"
             >
                <span className="font-medium">Filtering by: {selectedInvestor.split('(')[0]}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 opacity-50">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col justify-center">
        
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-wealth-800 mb-4">
            Standing on the Shoulders of Giants
          </h2>
          <p className="text-wealth-600 font-light">
            Access the distilled mental models of history's greatest capital allocators. 
            A new perspective arrives every 10 minutes, or select a legend below.
          </p>
        </div>

        {data ? (
          <WisdomCard 
            data={data} 
            loading={loading} 
            onShowToast={showToast}
          />
        ) : (
          // Initial loading state wrapper
          <WisdomCard 
            data={{ investorName: "", category: "", quote: "", wisdom: "" }} 
            loading={true} 
            onShowToast={showToast}
          />
        )}

        {/* Structured Categories (Hidden in favor of Word Cloud)
        <CategoryList onSelect={handleSelectInvestor} />
        */}
        
        {/* Organic Word Cloud */}
        <AuthorCloud onSelect={handleSelectInvestor} />

        {/* Newsletter Section */}
        <Newsletter onShowToast={showToast} />

      </main>
      
      {/* Footer */}
      <footer className="w-full py-8 text-center text-wealth-400 text-sm mt-4 border-t border-wealth-200/50">
        <p>© {new Date().getFullYear()} Timeless Wealth. Powered by Gemini.</p>
      </footer>

      {/* Toast Container */}
      {toast && (
        <Toast 
          message={toast.msg} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

    </div>
  );
};

export default App;
