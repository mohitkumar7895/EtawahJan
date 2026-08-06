'use client';

import { useState, useEffect } from 'react';
import { Gift, X, Phone, PartyPopper } from 'lucide-react';
import { submitServiceApplication } from '@/lib/api';

const PRIZES = [
  "20% Off",
  "Free SEO",
  "No Luck",
  "Free Domain",
  "10% Off",
  "Free Hosting"
];

const COLORS = [
  "#ef4444", // red
  "#3b82f6", // blue
  "#64748b", // slate
  "#10b981", // emerald
  "#f59e0b", // amber
  "#8b5cf6", // violet
];

export default function SpinWheelWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prizeWon, setPrizeWon] = useState<string | null>(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openSpinWheel', handleOpen);
    return () => window.removeEventListener('openSpinWheel', handleOpen);
  }, []);

  // Auto-open after 15 seconds if not closed before
  useEffect(() => {
    const hasClosed = localStorage.getItem('spinWheelClosed');
    if (!hasClosed) {
      const timer = setTimeout(() => setIsOpen(true), 15000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('spinWheelClosed', 'true');
  };

  const spinWheel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10 || isSpinning) return;
    
    setIsSpinning(true);
    setPrizeWon(null);

    // Random prize index (We exclude "No Luck" which is index 2, so they always win something and you get the lead!)
    const possiblePrizes = [0, 1, 3, 4, 5]; // "20% Off", "Free SEO", "Free Domain", "10% Off", "Free Hosting"
    const prizeIndex = possiblePrizes[Math.floor(Math.random() * possiblePrizes.length)];
    const wonPrizeText = PRIZES[prizeIndex];

    // Submit lead to admin silently in the background
    submitServiceApplication({
      name: 'Spin Wheel Lead',
      mobile: phone.trim(),
      service_type: `Spin Wheel (Won: ${wonPrizeText})`,
      address: 'Online Spin Wheel Widget',
      email: ''
    }).catch(console.error);
    
    // Each slice is 60 degrees. 
    // To land on prizeIndex, the wheel needs to rotate such that prizeIndex is at the TOP (0 degrees).
    // The top is currently index 0. 
    // The prize slice angle is prizeIndex * 60.
    // So we need to rotate backwards by (prizeIndex * 60), plus 5 full spins (360 * 5).
    const extraSpins = 360 * 5;
    const offset = 360 - (prizeIndex * 60) - 30; // -30 to center it roughly
    const newRotation = rotation + extraSpins + offset + (Math.random() * 20 - 10); // add slight randomness

    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setPrizeWon(PRIZES[prizeIndex]);
    }, 5000); // 5 seconds spin duration
  };

  return (
    <>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={handleClose}></div>
          
          <div className="bg-white rounded-3xl w-full max-w-4xl relative z-10 overflow-x-hidden overflow-y-auto max-h-[95vh] shadow-2xl flex flex-col md:flex-row">
            <button 
              onClick={handleClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 p-2 bg-white/80 md:bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors shadow-sm backdrop-blur-md"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Left Side: The Wheel */}
            <div className="w-full md:w-1/2 bg-slate-900 p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,transparent_100%)]"></div>
              
              {/* Wheel Container */}
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80">
                {/* Center Pointer */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 text-yellow-400 drop-shadow-md scale-75 sm:scale-100">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L22 20H2L12 2Z" className="rotate-180 origin-center" />
                  </svg>
                </div>
                
                {/* The Rotating Wheel */}
                <div 
                  className="w-full h-full rounded-full border-4 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)] relative overflow-hidden transition-transform duration-[5000ms] ease-[cubic-bezier(0.1,0,0,1)]"
                  style={{ 
                    transform: `rotate(${rotation}deg)`,
                    background: `conic-gradient(
                      ${COLORS[0]} 0deg 60deg,
                      ${COLORS[1]} 60deg 120deg,
                      ${COLORS[2]} 120deg 180deg,
                      ${COLORS[3]} 180deg 240deg,
                      ${COLORS[4]} 240deg 300deg,
                      ${COLORS[5]} 300deg 360deg
                    )`
                  }}
                >
                  {/* Wheel Labels */}
                  {PRIZES.map((prize, i) => (
                    <div 
                      key={i} 
                      className="absolute inset-0 w-full h-full text-white font-black text-xs sm:text-sm md:text-base flex justify-center"
                      style={{ transform: `rotate(${i * 60 + 30}deg)` }}
                    >
                      <span className="pt-3 sm:pt-4 drop-shadow-md">{prize}</span>
                    </div>
                  ))}
                  {/* Inner Center Circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full border-[3px] sm:border-4 border-yellow-400 z-10 flex items-center justify-center shadow-inner">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-slate-900 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Form & Results */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center">
              {!prizeWon ? (
                <div className="animate-fade-in text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-600 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-3 sm:mb-4">
                    <Gift className="w-3 h-3 sm:w-4 sm:h-4" /> Lucky Draw
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-3 sm:mb-4 leading-tight">
                    Spin to Win <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Amazing Discounts!</span>
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 font-medium">
                    Enter your WhatsApp number to spin the wheel. You could win Free Hosting, a Free Domain, or up to 20% off your project!
                  </p>

                  <form onSubmit={spinWheel} className="space-y-3 sm:space-y-4">
                    <div>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold border-r border-slate-200 pr-3 text-sm sm:text-base">+91</span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          minLength={10}
                          pattern="[0-9]{10}"
                          placeholder="WhatsApp Number"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl pl-16 pr-4 py-3 sm:py-4 text-sm sm:text-base focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          disabled={isSpinning}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={!phone || phone.length < 10 || isSpinning}
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-base sm:text-lg py-3 sm:py-4 rounded-xl shadow-lg shadow-pink-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSpinning ? 'Spinning...' : 'SPIN NOW!'}
                    </button>
                  </form>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-4 text-center">
                    Only 1 spin allowed per person. Terms & conditions apply.
                  </p>
                </div>
              ) : (
                <div className="animate-fade-in text-center py-6 sm:py-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <PartyPopper className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 animate-bounce" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Congratulations!</h3>
                  <p className="text-base sm:text-lg text-slate-600 mb-4 sm:mb-6 font-medium">You won:</p>
                  
                  <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-3xl sm:text-4xl font-black py-3 px-6 sm:py-4 sm:px-8 rounded-2xl shadow-lg mb-6 sm:mb-8 inline-block transform rotate-[-2deg]">
                    {prizeWon}
                  </div>
                  
                  <p className="text-sm sm:text-base text-slate-700 font-medium mb-6 sm:mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    Awesome! Our team will message you shortly on <br/><strong className="text-slate-900">+91 {phone}</strong> to apply your prize!
                  </p>

                  <button
                    onClick={handleClose}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl transition-colors w-full sm:w-auto"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
