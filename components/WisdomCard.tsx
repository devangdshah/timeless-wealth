
import React from 'react';
import { WisdomData } from '../types';
// @ts-ignore
import html2canvas from 'html2canvas';

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

  const handleShare = async () => {
    const cardElement = document.getElementById('wisdom-card-container');
    if (!cardElement) return;
    
    onShowToast("Preparing image for sharing...");
    
    try {
      // Generate the canvas
      const canvas = await html2canvas(cardElement, {
         useCORS: true,
         scale: 2, // Higher resolution for retina displays
         backgroundColor: '#f4f7f6', // Match body bg so glass effect doesn't look black
         ignoreElements: (element: Element) => element.classList.contains('no-capture')
      });

      canvas.toBlob(async (blob: Blob | null) => {
         if (!blob) return;
         
         const file = new File([blob], 'timeless-wisdom.png', { type: 'image/png' });
         const shareData = {
            title: 'Timeless Wealth Wisdom',
            text: `"${data.quote}" - ${data.investorName} \n\nWisdom via Timeless Wealth`,
            files: [file]
         };

         // Check if native sharing is supported (Mobile mostly)
         if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share(shareData);
              onShowToast("Shared successfully!");
            } catch (error) {
               // If user cancelled, just ignore
               if ((error as Error).name !== 'AbortError') {
                  console.error(error);
                  // Fallback to download if share fails technically
                  downloadImage(canvas);
                  onShowToast("Share failed, downloaded instead.");
               }
            }
         } else {
            // Desktop Fallback: Download image
            downloadImage(canvas);
            onShowToast("Image downloaded! Ready to post.");
         }
      });
    } catch (e) {
      console.error(e);
      onShowToast("Failed to generate image.");
    }
  };

  const downloadImage = (canvas: HTMLCanvasElement) => {
     const link = document.createElement('a');
     link.download = `timeless-wealth-${data.investorName.split(' ')[0]}.png`;
     link.href = canvas.toDataURL('image/png');
     link.click();
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
    <div className="w-full max-w-4xl mx-auto relative perspective-1000 group">
      <div id="wisdom-card-container" className="glass-panel rounded-3xl p-8 md:p-16 shadow-2xl transform transition-all duration-700 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-t-4 border-t-wealth-600 relative overflow-hidden">
        
        {/* Action Buttons (Copy & Share) - Hidden during capture */}
        <div className="absolute top-6 right-6 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0 no-capture">
           <button 
            onClick={handleShare}
            className="p-2 rounded-full bg-wealth-100 hover:bg-gold-400 hover:text-white text-wealth-600 transition-colors shadow-sm"
            title="Share Image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
            </svg>
          </button>
          
          <button 
            onClick={handleCopy}
            className="p-2 rounded-full bg-wealth-100 hover:bg-wealth-200 text-wealth-600 transition-colors shadow-sm"
            title="Copy Text"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5" />
            </svg>
          </button>
        </div>

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
        <div className="text-center mb-8">
          <h2 className="text-xl font-display font-bold text-wealth-800 mb-1">
            {data.investorName}
          </h2>
          {data.sourceBook && (
            <p className="text-wealth-500 text-sm italic">
              Author of <span className="font-semibold text-wealth-600">{data.sourceBook}</span>
            </p>
          )}
        </div>

        {/* Social Link - High Visibility Update */}
        <div className="flex justify-center mb-12">
          <a 
            href="https://x.com/devang_shah" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-wealth-900 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 transition-all group/link px-6 py-3 rounded-full shadow-md border border-wealth-200 transform hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
            <span className="font-bold text-lg tracking-tight">Follow me @devang_shah</span>
          </a>
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
