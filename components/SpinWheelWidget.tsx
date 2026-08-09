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

  // Auto-open after 60 seconds if not closed before
  useEffect(() => {
    const hasClosed = localStorage.getItem('spinWheelClosed');
    if (!hasClosed) {
      const timer = setTimeout(() => setIsOpen(true), 60000);
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={handleClose}></div>
          
          <div className="bg-[#0a0f1c] rounded-3xl w-full max-w-6xl relative z-10 max-h-[95vh] overflow-y-auto py-12 sm:py-16 px-4 shadow-2xl border border-slate-800">
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-50 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Background Grid & Glow */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-12 max-w-5xl mx-auto">
                
                {/* Left Side: Title and Wheel */}
                <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 font-bold text-xs uppercase tracking-widest mb-6">
                    <Gift className="w-4 h-4" /> Lucky Draw
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-black text-white mb-8 leading-tight">
                    Spin to Win <br className="hidden lg:block"/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">Amazing Discounts!</span>
                  </h2>
                  
                  {/* Wheel Container */}
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] mx-auto lg:mx-0">
                    {/* Center Pointer */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-yellow-400 drop-shadow-md">
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
                          className="absolute inset-0 w-full h-full text-white font-black text-sm sm:text-base lg:text-lg flex justify-center"
                          style={{ transform: `rotate(${i * 60 + 30}deg)` }}
                        >
                          <span className="pt-5 sm:pt-6 lg:pt-10 drop-shadow-md">{prize}</span>
                        </div>
                      ))}
                      {/* Inner Center Circle */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white rounded-full border-[3px] sm:border-4 border-yellow-400 z-10 flex items-center justify-center shadow-inner">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-slate-900 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Form Card */}
                <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0 lg:ml-auto">
                  <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-2xl relative overflow-hidden shadow-pink-900/20">
                    
                    {!prizeWon ? (
                      <div className="animate-fade-in">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <PartyPopper className="w-5 h-5 text-pink-400" /> Enter to Spin
                        </h3>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                          Enter your WhatsApp number to spin the wheel. You could win Free Hosting, a Free Domain, or up to 20% off your project!
                        </p>

                        <form onSubmit={spinWheel} className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">WhatsApp Number</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold border-r border-slate-700 pr-3">+91</span>
                              <input
                                type="tel"
                                required
                                maxLength={10}
                                minLength={10}
                                pattern="[0-9]{10}"
                                placeholder="Where to send the prize?"
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-16 pr-4 py-3.5 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all placeholder:text-slate-600"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                disabled={isSpinning}
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            disabled={!phone || phone.length < 10 || isSpinning}
                            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center"
                          >
                            {isSpinning ? 'Spinning...' : 'SPIN NOW!'}
                          </button>
                        </form>
                        <p className="text-center text-xs text-slate-500 mt-4">
                          Only 1 spin allowed per person. Terms & conditions apply.
                        </p>
                      </div>
                    ) : (
                      <div className="animate-fade-in text-center py-4">
                        <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <PartyPopper className="w-10 h-10 text-green-400 animate-bounce" />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-2">Congratulations!</h3>
                        <p className="text-slate-400 text-sm mb-6">You won:</p>
                        
                        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-3xl sm:text-4xl font-black py-4 px-8 rounded-2xl shadow-lg mb-8 inline-block transform rotate-[-2deg]">
                          {prizeWon}
                        </div>
                        
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 mb-6 text-left">
                          <p className="text-white text-sm font-bold mb-1">Prize Locked! 🎁</p>
                          <p className="text-slate-400 text-xs leading-relaxed">
                            Awesome! Our team will message you shortly on <strong className="text-white">+91 {phone}</strong> to apply your prize!
                          </p>
                        </div>

                        <button
                          onClick={handleClose}
                          className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-4 rounded-xl transition-colors shadow-lg active:scale-95"
                        >
                          Done
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
