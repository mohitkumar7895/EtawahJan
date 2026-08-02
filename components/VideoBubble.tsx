'use client';
import { useState, useRef, useEffect } from 'react';
import { Play, X, Volume2 } from 'lucide-react';

export default function VideoBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speakWelcome = () => {
    if (!synthRef.current) return;
    
    // Stop any currently playing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(
      "Hello! Welcome to Jan Seva IT Solutions. Apne business ko online laane, aur ten-x grow karne ke liye, aaj hi humse judiye. Niche diye gaye button par click karke humse WhatsApp par baat karein."
    );
    
    // Try to find the most premium, professional female voice available on the device
    const voices = synthRef.current.getVoices();
    const premiumFemaleVoice = 
      voices.find(v => v.name === 'Google हिन्दी') ||
      voices.find(v => v.name === 'Google UK English Female') ||
      voices.find(v => v.name.includes('Aditi')) || // Windows Indian Female
      voices.find(v => v.name.includes('Veena')) || // Mac Indian Female
      voices.find(v => v.name.includes('Zira')) || // Windows US Female
      voices.find(v => v.name.includes('Samantha')) || // Mac US Female
      voices.find(v => (v.lang.includes('hi-IN') || v.lang.includes('en-IN')) && v.name.toLowerCase().includes('female'));

    if (premiumFemaleVoice) {
      utterance.voice = premiumFemaleVoice;
    }
    
    // Soften the tone and speed for a natural, professional feel
    utterance.rate = 0.85; // slightly slower
    utterance.pitch = 1.15; // slightly higher but not squeaky

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    synthRef.current.speak(utterance);
  };

  const handleOpen = () => {
    setIsOpen(true);
    // Slight delay to allow modal to animate before speaking
    setTimeout(speakWelcome, 400);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }
  };

  if (isClosed) return null;

  return (
    <>
      {/* Floating Bubble */}
      {!isOpen && (
        <div className="fixed bottom-28 left-4 sm:bottom-32 sm:left-6 z-[9900] group cursor-pointer animate-fade-in" onClick={handleOpen}>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-60"></div>
            <div className="relative w-16 h-16 rounded-full border-2 border-white shadow-xl overflow-hidden bg-slate-900 group-hover:scale-110 transition-transform duration-300">
              <img 
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80" 
                alt="AI Assistant"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
            
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-white text-slate-900 text-xs font-bold py-1.5 px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Hear our Welcome Message!
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45"></div>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Video Modal */}
      {isOpen && (
        <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[9950] animate-scale-in">
          <div className="relative w-[280px] sm:w-[320px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-3 right-3 z-20 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors backdrop-blur-sm"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Interactive Avatar Area */}
            <div className="relative w-full aspect-[4/5] bg-gradient-to-b from-blue-900 to-slate-900 flex flex-col items-center justify-center overflow-hidden">
              
              {/* Sound Waves Animation */}
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <div className="w-32 h-32 bg-blue-500 rounded-full animate-ping"></div>
                  <div className="absolute w-48 h-48 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                </div>
              )}

              {/* Avatar Image */}
              <div className={`relative z-10 w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl transition-transform duration-500 ${isPlaying ? 'scale-110' : 'scale-100'}`}>
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80" 
                  alt="AI Assistant"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Status Text */}
              <div className="absolute bottom-6 left-0 right-0 text-center z-10">
                <div className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  {isPlaying ? (
                    <>
                      <Volume2 className="w-3 h-3 text-green-400 animate-pulse" />
                      <span className="text-white text-xs font-medium">Speaking...</span>
                    </>
                  ) : (
                    <button onClick={speakWelcome} className="flex items-center gap-1.5 hover:text-blue-300 transition-colors">
                      <Play className="w-3 h-3 text-white fill-white" />
                      <span className="text-white text-xs font-medium">Replay Message</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Bottom CTA */}
            <div className="p-4 bg-white">
              <h3 className="text-slate-900 font-black text-lg mb-1">Let's Grow Together!</h3>
              <p className="text-slate-500 text-xs mb-4">We build premium websites & apps to scale your business.</p>
              <a 
                href="https://wa.me/917895094129?text=Hello,%20I%20heard%20your%20welcome%20message.%20I%20want%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-transform active:scale-95 shadow-md hover:shadow-lg"
              >
                Chat on WhatsApp Now
              </a>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); transform-origin: bottom left; }
          100% { opacity: 1; transform: scale(1) translateY(0); transform-origin: bottom left; }
        }
        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  );
}
