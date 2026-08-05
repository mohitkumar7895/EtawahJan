'use client';

import { useState } from 'react';
import { MonitorPlay, Smartphone, ShoppingCart, TrendingUp, Clock, CalendarDays, Infinity, ArrowRight, CheckCircle2, ChevronLeft, Loader2, X } from 'lucide-react';
import { submitServiceApplication } from '@/lib/api';

type QuizState = {
  step: number;
  projectType: string;
  timeline: string;
  phone: string;
  isSubmitting: boolean;
  isSuccess: boolean;
};

const PROJECT_TYPES = [
  { id: 'website', title: 'Business Website', icon: MonitorPlay, desc: 'Corporate, Portfolio, or Agency site' },
  { id: 'ecommerce', title: 'E-Commerce Store', icon: ShoppingCart, desc: 'Sell products online' },
  { id: 'app', title: 'Mobile App', icon: Smartphone, desc: 'Android & iOS Application' },
  { id: 'software', title: 'Custom Software', icon: TrendingUp, desc: 'ERP, CRM, or Billing Software' }
];

const TIMELINES = [
  { id: 'urgent', title: 'Urgent (1 Week)', icon: Clock, desc: 'I need this done ASAP' },
  { id: 'normal', title: 'Standard (2-4 Weeks)', icon: CalendarDays, desc: 'Normal development timeline' },
  { id: 'flexible', title: 'Flexible', icon: Infinity, desc: 'No rush, focus on perfection' }
];

interface CostEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CostEstimatorModal({ isOpen, onClose }: CostEstimatorModalProps) {
  const [state, setState] = useState<QuizState>({
    step: 1,
    projectType: '',
    timeline: '',
    phone: '',
    isSubmitting: false,
    isSuccess: false
  });

  if (!isOpen) return null;

  const handleNext = () => setState(s => ({ ...s, step: s.step + 1 }));
  const handlePrev = () => setState(s => ({ ...s, step: s.step - 1 }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.phone || state.phone.length < 10) return;
    
    setState(s => ({ ...s, isSubmitting: true }));
    
    // Submit lead to admin
    submitServiceApplication({
      name: 'Price Quiz Lead',
      mobile: state.phone.trim(),
      service_type: `Website/App Quiz: ${state.projectType}`,
      address: `Timeline: ${state.timeline}`,
      email: ''
    }).catch(console.error);
    
    // Simulate API call
    setTimeout(() => {
      setState(s => ({ ...s, isSubmitting: false, isSuccess: true }));
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in relative border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header section (if not success) */}
        {!state.isSuccess && (
          <div className="bg-slate-50 border-b border-slate-100 p-6 sm:p-8 text-center shrink-0">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-emerald-600 font-bold text-xs uppercase tracking-widest mb-4 border border-emerald-100 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Instant Cost Estimator
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              How much will your <span className="text-blue-600">Project Cost?</span>
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium max-w-lg mx-auto">
              Answer 2 quick questions to calculate the estimated cost and timeframe for your dream project.
            </p>
          </div>
        )}

        {/* Progress Bar */}
        {!state.isSuccess && (
          <div className="flex bg-slate-50 border-b border-slate-100 shrink-0">
            {[1, 2, 3].map((num) => (
              <div 
                key={num}
                className={`flex-1 py-3 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                  state.step >= num 
                    ? 'text-blue-600 bg-blue-50/50 border-b-2 border-blue-600' 
                    : 'text-slate-400 border-b-2 border-transparent'
                }`}
              >
                Step {num}
              </div>
            ))}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          {/* STEP 1: Project Type */}
          {state.step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-black text-slate-900 mb-6 text-center">What do you want to build?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PROJECT_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setState(s => ({ ...s, projectType: type.title }));
                      handleNext();
                    }}
                    className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 group ${
                      state.projectType === type.title 
                        ? 'border-blue-600 bg-blue-50 shadow-md transform scale-[1.02]' 
                        : 'border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50'
                    }`}
                  >
                    <type.icon className={`w-8 h-8 mb-4 transition-colors ${state.projectType === type.title ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`} />
                    <h4 className="font-bold text-slate-900 text-lg">{type.title}</h4>
                    <p className="text-sm text-slate-500 mt-1 leading-snug">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Timeline */}
          {state.step === 2 && (
            <div className="animate-fade-in">
              <button onClick={handlePrev} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm font-bold mb-4 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <h3 className="text-xl font-black text-slate-900 mb-6 text-center">How soon do you need it?</h3>
              <div className="flex flex-col gap-3 max-w-lg mx-auto">
                {TIMELINES.map(time => (
                  <button
                    key={time.id}
                    onClick={() => {
                      setState(s => ({ ...s, timeline: time.title }));
                      handleNext();
                    }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 group ${
                      state.timeline === time.title 
                        ? 'border-blue-600 bg-blue-50 shadow-md transform scale-[1.02]' 
                        : 'border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${state.timeline === time.title ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                      <time.icon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-slate-900 text-base">{time.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{time.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Phone Number & Result */}
          {state.step === 3 && (
            <div className="animate-fade-in max-w-md mx-auto w-full text-center">
              {!state.isSuccess ? (
                <>
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Estimate Ready!</h3>
                  <p className="text-slate-500 text-sm mb-8">
                    Enter your WhatsApp number below to see your exact price for a <strong>{state.projectType}</strong>.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold border-r border-slate-200 pr-3">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        minLength={10}
                        pattern="[0-9]{10}"
                        placeholder="Enter 10-digit number"
                        className="w-full pl-16 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:ring-0 outline-none transition-colors font-bold text-slate-900 bg-slate-50"
                        value={state.phone}
                        onChange={(e) => setState(s => ({ ...s, phone: e.target.value.replace(/\D/g, '') }))}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={state.isSubmitting || state.phone.length < 10}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-blue-600/20"
                    >
                      {state.isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Calculating Price...
                        </>
                      ) : (
                        <>
                          Show My Price <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                    <button type="button" onClick={handlePrev} className="text-slate-400 hover:text-slate-600 text-xs font-bold mt-4 underline decoration-slate-300 underline-offset-4">
                      Wait, let me change my answers
                    </button>
                  </form>
                </>
              ) : (
                <div className="animate-fade-in py-8">
                  <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">Request Sent!</h3>
                  <p className="text-slate-500 mb-8 leading-relaxed">
                    We have received your requirement for a <strong>{state.projectType}</strong>. Our technical expert will WhatsApp you the detailed quotation in the next 5 minutes.
                  </p>
                  
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Your Whatsapp Number</p>
                    <p className="text-xl font-black text-slate-900">+91 {state.phone}</p>
                  </div>

                  <div className="mt-8 flex flex-col gap-3">
                    <button
                      onClick={onClose}
                      className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors"
                    >
                      Close Window
                    </button>
                    <a 
                      href={`https://wa.me/917895094129?text=Hello,%20I%20just%20completed%20the%20price%20quiz%20for%20a%20${state.projectType}%20(${state.timeline}).%20My%20number%20is%20${state.phone}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 text-blue-600 font-bold hover:text-blue-700 mt-2"
                    >
                      Message Us Directly Instead <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
