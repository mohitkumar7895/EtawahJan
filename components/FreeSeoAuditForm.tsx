'use client';

import { useState } from 'react';
import { Search, ShieldAlert, Activity, Smartphone, Link as LinkIcon, CheckCircle2, ArrowRight, X } from 'lucide-react';

export default function FreeSeoAuditForm({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const [url, setUrl] = useState('');
  const [phone, setPhone] = useState('');
  type AuditState = 'idle' | 'scanning' | 'results';
  const [state, setState] = useState<AuditState>('idle');
  const [scanStep, setScanStep] = useState(0);

  const scanTexts = [
    'Initializing Scanner...',
    'Checking Mobile Responsiveness...',
    'Analyzing Meta Tags & SEO...',
    'Checking Page Load Speed...',
    'Scanning for Broken Links...',
    'Generating Final Report...'
  ];

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || phone.length < 10) return;
    
    setState('scanning');
    setScanStep(0);

    // Fake scanning progression
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setScanStep(step);
      if (step >= scanTexts.length) {
        clearInterval(interval);
        setTimeout(() => setState('results'), 600);
      }
    }, 800);
  };

  if (isOpen === false) return null;

  return (
    <div className={isOpen !== undefined ? "fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6" : ""}>
      {isOpen !== undefined && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      )}
      
      <section className={`bg-[#0a0f1c] relative overflow-hidden ${isOpen !== undefined ? 'w-full max-w-6xl rounded-3xl shadow-2xl z-10 max-h-[95vh] overflow-y-auto py-12 sm:py-16' : 'py-20 sm:py-28'}`}>
        
        {isOpen !== undefined && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Background Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
          
          {/* Left Side Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs uppercase tracking-widest mb-6">
              <ShieldAlert className="w-4 h-4" />
              Is Your Website Losing Customers?
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
              Get a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">FREE SEO Audit</span> Report
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Enter your website URL below to find out why your competitors are ranking higher on Google. We&apos;ll identify critical errors blocking your sales.
            </p>
            
            <div className="hidden lg:flex flex-col gap-4">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center"><Activity className="w-5 h-5 text-cyan-400" /></div>
                <span className="font-medium">Performance & Speed Check</span>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center"><Smartphone className="w-5 h-5 text-cyan-400" /></div>
                <span className="font-medium">Mobile Responsiveness Test</span>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center"><LinkIcon className="w-5 h-5 text-cyan-400" /></div>
                <span className="font-medium">SEO & Broken Link Analysis</span>
              </div>
            </div>
          </div>

          {/* Right Side Scanner Form */}
          <div className="w-full lg:w-1/2 max-w-md w-full">
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden shadow-indigo-900/20">
              
              {/* Form State */}
              {state === 'idle' && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Search className="w-5 h-5 text-indigo-400" /> Start Free Audit
                  </h3>
                  <form onSubmit={handleScan} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Website URL</label>
                      <input
                        type="url"
                        required
                        placeholder="https://www.yourwebsite.com"
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </div>
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
                          placeholder="Where should we send the report?"
                          className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-16 pr-4 py-3.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={!url || phone.length < 10}
                      className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-bold py-4 rounded-xl mt-4 shadow-lg shadow-indigo-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Scan My Website
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-4">
                      100% Free. No credit card required.
                    </p>
                  </form>
                </div>
              )}

              {/* Scanning State */}
              {state === 'scanning' && (
                <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in">
                  <div className="relative w-24 h-24 mb-8">
                    {/* Radar animation */}
                    <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full"></div>
                    <div className="absolute inset-2 border-2 border-indigo-500/50 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_70%,rgba(99,102,241,0.8)_100%)] rounded-full animate-[spin_2s_linear_infinite]"></div>
                    <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Analyzing Website...</h3>
                  <p className="text-indigo-400 text-sm font-medium animate-pulse h-6">
                    {scanTexts[Math.min(scanStep, scanTexts.length - 1)]}
                  </p>
                  
                  {/* Progress bar */}
                  <div className="w-full max-w-[200px] h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-300 ease-out"
                      style={{ width: `${(scanStep / scanTexts.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Results State */}
              {state === 'results' && (
                <div className="text-center py-6 animate-fade-in">
                  <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="w-10 h-10 animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">12 Critical Errors Found!</h3>
                  <p className="text-slate-400 text-sm mb-8">
                    Your website is losing potential customers due to slow speed and poor mobile optimization.
                  </p>
                  
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 mb-6 text-left space-y-3">
                    <div className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white text-sm font-bold">Slow Page Load Time</p>
                        <p className="text-slate-500 text-xs">Takes &gt; 4 seconds to load.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white text-sm font-bold">Missing Meta Tags</p>
                        <p className="text-slate-500 text-xs">Google cannot read your site properly.</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-indigo-300 text-sm font-medium mb-6">
                    We are sending the detailed PDF report to your WhatsApp (+91 {phone}).
                  </p>

                  <a 
                    href={`https://wa.me/917895094129?text=Hello,%20I%20just%20ran%20the%20SEO%20Audit%20for%20my%20website%20(${url}).%20My%20number%20is%20${phone}.%20Please%20share%20the%20report.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
                  >
                    Discuss Fixes on WhatsApp <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      </section>
    </div>
  );
}
