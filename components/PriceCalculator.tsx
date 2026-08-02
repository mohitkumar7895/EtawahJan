'use client';
import { useState } from 'react';
import { Calculator, CheckCircle2, ArrowRight } from 'lucide-react';

export default function PriceCalculator() {
  const [pages, setPages] = useState(5);
  const [isEcommerce, setIsEcommerce] = useState(false);
  const [hasAdminPanel, setHasAdminPanel] = useState(false);
  const [hasSeo, setHasSeo] = useState(true);

  // Calculate logic
  let basePrice = 3000;
  let pagePrice = pages * 500;
  let ecoPrice = isEcommerce ? 8000 : 0;
  let adminPrice = hasAdminPanel ? 5000 : 0;
  let seoPrice = hasSeo ? 2000 : 0;
  
  let totalPrice = basePrice + pagePrice + ecoPrice + adminPrice + seoPrice;

  return (
    <section className="py-20 sm:py-28 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900 pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Text */}
          <div className="w-full lg:w-5/12 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-blue-400 font-bold text-xs uppercase tracking-widest mb-6">
              <Calculator className="w-4 h-4 text-emerald-400" />
              Instant Price Estimate
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
              Calculate Your <br/>
              <span className="text-yellow-400">Project Cost</span>
            </h2>
            
            <p className="text-base sm:text-lg text-slate-400 mb-8 leading-relaxed">
              No hidden fees. Select your requirements to get an instant estimate for your website or app.
            </p>

            <div className="hidden lg:block space-y-4">
              <div className="flex items-center gap-3 text-slate-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Transparent Pricing
              </div>
              <div className="flex items-center gap-3 text-slate-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Custom Design
              </div>
              <div className="flex items-center gap-3 text-slate-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 1 Year Free Support
              </div>
            </div>
          </div>

          {/* Right Calculator Card */}
          <div className="w-full lg:w-7/12">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl">
              
              {/* Pages Slider */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <label className="font-bold text-slate-700">Number of Pages</label>
                  <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{pages} Pages</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  value={pages} 
                  onChange={(e) => setPages(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs font-medium text-slate-400 mt-2">
                  <span>1 Page</span>
                  <span>20 Pages</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4 mb-8">
                <label className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-100 cursor-pointer transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">E-Commerce Functionality</span>
                    <span className="text-xs text-slate-500">Sell products online with payment gateway</span>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" checked={isEcommerce} onChange={() => setIsEcommerce(!isEcommerce)} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-100 cursor-pointer transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">Admin Dashboard</span>
                    <span className="text-xs text-slate-500">Manage content and users easily</span>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" checked={hasAdminPanel} onChange={() => setHasAdminPanel(!hasAdminPanel)} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-100 cursor-pointer transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">Advanced SEO</span>
                    <span className="text-xs text-slate-500">Rank on Google page 1</span>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" checked={hasSeo} onChange={() => setHasSeo(!hasSeo)} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </label>
              </div>

              {/* Total Price */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6 text-center">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider block mb-2">Estimated Cost</span>
                <div className="text-4xl sm:text-5xl font-black text-slate-900">
                  ₹{totalPrice.toLocaleString('en-IN')}*
                </div>
                <span className="text-xs text-slate-400 mt-2 block">*Prices may vary based on exact requirements</span>
              </div>

              {/* CTA */}
              <a 
                href={`https://wa.me/917895094129?text=Hello,%20I%20used%20your%20calculator.%20My%20estimated%20cost%20is%20%E2%82%B9${totalPrice}%20for%20${pages}%20pages.%20Please%20give%20me%20a%20final%20quote.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                Get Final Quote <ArrowRight className="w-5 h-5" />
              </a>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
