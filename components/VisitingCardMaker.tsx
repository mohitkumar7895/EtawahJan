'use client';

import { useState } from 'react';
import { Download, Briefcase, Phone, MapPin, Building2, UserCircle2, ShieldCheck, X, Loader2, Upload, Mail, Globe, LayoutTemplate, CheckCircle2, AlignLeft, AlignCenter, AlignRight, LayoutPanelLeft, LayoutPanelTop, Columns3 } from 'lucide-react';
import { submitServiceApplication } from '@/lib/api';

type Theme = 'blue' | 'dark' | 'green' | 'gold' | 'red' | 'minimal' | 'purple' | 'orange' | 'ocean';
type LayoutType = 1 | 2 | 3 | 4 | 5 | 6;

export default function VisitingCardMaker() {
  const [formData, setFormData] = useState({
    businessName: 'Jan Seva Kendra',
    tagline: 'All Government Services',
    name: 'Your Name',
    designation: 'Director',
    phone: '9193898182',
    email: '',
    website: '',
    address: 'Bharthana, Etawah, UP'
  });

  const [theme, setTheme] = useState<Theme>('blue');
  const [layout, setLayout] = useState<LayoutType>(1);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadPhone, setLeadPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const getThemeClasses = () => {
    switch(theme) {
      case 'dark': return 'bg-slate-900 text-white border-slate-700';
      case 'green': return 'bg-emerald-700 text-white border-emerald-600';
      case 'gold': return 'bg-gradient-to-br from-yellow-600 via-yellow-500 to-amber-700 text-slate-900 border-yellow-400';
      case 'red': return 'bg-rose-700 text-white border-rose-600';
      case 'purple': return 'bg-gradient-to-br from-indigo-700 to-purple-800 text-white border-purple-500';
      case 'orange': return 'bg-gradient-to-br from-orange-500 to-red-500 text-white border-orange-400';
      case 'ocean': return 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white border-cyan-500';
      case 'minimal': return 'bg-white text-slate-900 border-slate-200';
      default: return 'bg-blue-600 text-white border-blue-500';
    }
  };

  const getAccentColor = () => {
    switch(theme) {
      case 'dark': return 'text-indigo-400';
      case 'green': return 'text-yellow-400';
      case 'gold': return 'text-amber-900';
      case 'red': return 'text-rose-200';
      case 'purple': return 'text-fuchsia-300';
      case 'orange': return 'text-yellow-200';
      case 'ocean': return 'text-cyan-200';
      case 'minimal': return 'text-slate-500';
      default: return 'text-blue-200';
    }
  };

  const getThemeIconColor = () => {
    return theme === 'minimal' ? 'text-slate-600 bg-slate-100' : 
           theme === 'gold' ? 'text-slate-900 bg-slate-900/10' : 
           'text-white bg-white/10';
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  const handleDownloadClick = () => {
    setShowLeadModal(true);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (leadPhone.length !== 10) {
      alert("Please enter a 10-digit mobile number.");
      return;
    }
    setSubmitting(true);
    try {
      await submitServiceApplication({
        name: formData.name,
        mobile: leadPhone,
        service_type: `Visiting Card Maker Lead (Business: ${formData.businessName})`,
        address: formData.address,
        email: formData.email
      });
      setSuccess(true);
      setTimeout(() => {
        setShowLeadModal(false);
        setSuccess(false);
        setLeadPhone('');
        window.print();
      }, 1500);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Renders the contact info block reused across layouts
  const renderContactInfo = (align: 'left' | 'center' | 'right' = 'left') => {
    const isRight = align === 'right';
    const isCenter = align === 'center';
    
    if (isCenter) {
      return (
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-2 w-full">
          <div className="flex items-center gap-2"><div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${getThemeIconColor()}`}><Phone className="w-3 h-3" /></div><span className="text-xs sm:text-sm font-semibold">+91 {formData.phone || '9999999999'}</span></div>
          {formData.email && <div className="flex items-center gap-2"><div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${getThemeIconColor()}`}><Mail className="w-3 h-3" /></div><span className="text-xs sm:text-sm font-medium">{formData.email}</span></div>}
          {formData.website && <div className="flex items-center gap-2"><div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${getThemeIconColor()}`}><Globe className="w-3 h-3" /></div><span className="text-xs sm:text-sm font-medium">{formData.website}</span></div>}
          <div className="flex items-center gap-2 w-full justify-center mt-1"><div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${getThemeIconColor()}`}><MapPin className="w-3 h-3" /></div><span className="text-xs sm:text-sm font-medium">{formData.address || 'Your Address Here'}</span></div>
        </div>
      );
    }

    return (
      <div className={`grid gap-3 ${isCenter ? 'grid-cols-1 justify-items-center' : 'grid-cols-1 sm:grid-cols-2'}`}>
        <div className={`flex items-center gap-3 ${isRight ? 'flex-row-reverse' : ''}`}>
          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getThemeIconColor()}`}>
            <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-wide">+91 {formData.phone || '9999999999'}</span>
        </div>
        {formData.email && (
          <div className={`flex items-center gap-3 ${isRight ? 'flex-row-reverse' : ''}`}>
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getThemeIconColor()}`}>
              <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            <span className="text-xs sm:text-sm font-medium break-all">{formData.email}</span>
          </div>
        )}
        {formData.website && (
          <div className={`flex items-center gap-3 ${isRight ? 'flex-row-reverse' : ''}`}>
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getThemeIconColor()}`}>
              <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            <span className="text-xs sm:text-sm font-medium">{formData.website}</span>
          </div>
        )}
        <div className={`flex items-center gap-3 ${isRight ? 'flex-row-reverse' : ''} ${isCenter ? '' : 'sm:col-span-2'}`}>
          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getThemeIconColor()}`}>
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
          <span className="text-xs sm:text-sm font-medium line-clamp-2">{formData.address || 'Your Address Here'}</span>
        </div>
      </div>
    );
  };

  const renderLogo = (size: 'small' | 'large' = 'small') => (
    <div className={`rounded-xl flex items-center justify-center backdrop-blur-sm border overflow-hidden shadow-sm flex-shrink-0 bg-white
      ${size === 'small' ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-24 h-24 sm:w-32 sm:h-32 rounded-2xl'}
    `}>
      {logoUrl ? (
        <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
      ) : (
        <Building2 className={`${size === 'small' ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-12 h-12 sm:w-16 sm:h-16'} text-slate-400`} />
      )}
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 print:p-0">
      
      {/* Header - Hidden in Print */}
      <div className="text-center mb-10 print:hidden">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
          <Briefcase className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
          Free Business <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Card Maker</span>
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Create a premium visiting card for your business. Select from 6 unique templates and 9 color themes!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Side: Controls - Hidden in Print */}
        <div className="w-full lg:w-1/3 space-y-6 print:hidden">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 max-h-[80vh] overflow-y-auto custom-scrollbar">
            
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 sticky top-0 bg-white z-10 py-2 border-b border-slate-100">
              <LayoutTemplate className="w-5 h-5 text-indigo-600" />
              1. Choose Template (Design)
            </h3>
            
            {/* 6 Unique Layouts Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { id: 1, name: 'Standard Left', icon: AlignLeft },
                { id: 2, name: 'Standard Right', icon: AlignRight },
                { id: 3, name: 'Classic Center', icon: AlignCenter },
                { id: 4, name: 'Modern Split', icon: LayoutPanelLeft },
                { id: 5, name: 'Top Heavy', icon: LayoutPanelTop },
                { id: 6, name: 'Grid View', icon: Columns3 },
              ].map((tpl) => (
                <button 
                  key={tpl.id}
                  onClick={() => setLayout(tpl.id as LayoutType)} 
                  className={`py-3 px-2 flex flex-col items-center gap-2 text-xs font-bold rounded-xl border-2 transition-all 
                    ${layout === tpl.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:bg-slate-50'}`}
                >
                  <tpl.icon className={`w-6 h-6 ${layout === tpl.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {tpl.name}
                </button>
              ))}
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 sticky top-0 bg-white z-10 py-2 border-b border-slate-100">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              2. Choose Theme (Color)
            </h3>
            
            <div className="grid grid-cols-3 gap-3 mb-8">
              <button onClick={() => setTheme('blue')} className={`w-full h-10 rounded-lg bg-blue-600 border-2 transition-all ${theme === 'blue' ? 'border-blue-300 ring-2 ring-blue-600 ring-offset-2' : 'border-transparent'}`} title="Professional Blue"></button>
              <button onClick={() => setTheme('dark')} className={`w-full h-10 rounded-lg bg-slate-900 border-2 transition-all ${theme === 'dark' ? 'border-slate-500 ring-2 ring-slate-900 ring-offset-2' : 'border-transparent'}`} title="Elegant Dark"></button>
              <button onClick={() => setTheme('green')} className={`w-full h-10 rounded-lg bg-emerald-700 border-2 transition-all ${theme === 'green' ? 'border-emerald-400 ring-2 ring-emerald-700 ring-offset-2' : 'border-transparent'}`} title="Emerald Green"></button>
              <button onClick={() => setTheme('gold')} className={`w-full h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-700 border-2 transition-all ${theme === 'gold' ? 'border-yellow-200 ring-2 ring-yellow-500 ring-offset-2' : 'border-transparent'}`} title="Luxury Gold"></button>
              <button onClick={() => setTheme('red')} className={`w-full h-10 rounded-lg bg-rose-700 border-2 transition-all ${theme === 'red' ? 'border-rose-400 ring-2 ring-rose-700 ring-offset-2' : 'border-transparent'}`} title="Ruby Red"></button>
              <button onClick={() => setTheme('purple')} className={`w-full h-10 rounded-lg bg-gradient-to-br from-indigo-700 to-purple-800 border-2 transition-all ${theme === 'purple' ? 'border-purple-300 ring-2 ring-purple-600 ring-offset-2' : 'border-transparent'}`} title="Vibrant Purple"></button>
              <button onClick={() => setTheme('orange')} className={`w-full h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 border-2 transition-all ${theme === 'orange' ? 'border-orange-300 ring-2 ring-orange-500 ring-offset-2' : 'border-transparent'}`} title="Sunset Orange"></button>
              <button onClick={() => setTheme('ocean')} className={`w-full h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 border-2 transition-all ${theme === 'ocean' ? 'border-cyan-300 ring-2 ring-cyan-500 ring-offset-2' : 'border-transparent'}`} title="Ocean Teal"></button>
              <button onClick={() => setTheme('minimal')} className={`w-full h-10 rounded-lg bg-slate-100 border border-slate-300 transition-all ${theme === 'minimal' ? 'border-slate-900 ring-2 ring-slate-900 ring-offset-2' : 'border-transparent'}`} title="Minimal White"></button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 sticky top-0 bg-white z-10 py-2 border-b border-slate-100">
              <UserCircle2 className="w-5 h-5 text-indigo-600" />
              3. Business Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company Logo (Optional)</label>
                <div className="relative">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 border-dashed rounded-lg flex items-center justify-center gap-2 text-sm text-slate-500 hover:bg-slate-100 transition-colors">
                    <Upload className="w-4 h-4" />
                    {logoUrl ? 'Logo Uploaded - Click to Change' : 'Upload Logo Image'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Business Name</label>
                <input name="businessName" type="text" value={formData.businessName} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tagline (Optional)</label>
                <input name="tagline" type="text" value={formData.tagline} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Name</label>
                  <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Designation</label>
                  <input name="designation" type="text" value={formData.designation} onChange={handleChange} placeholder="e.g. Director" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                <input name="phone" type="text" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email (Optional)</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@email.com" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Website (Optional)</label>
                  <input name="website" type="text" value={formData.website} onChange={handleChange} placeholder="www.yoursite.com" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Address</label>
                <input name="address" type="text" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>
            </div>
            
            <button
              onClick={handleDownloadClick}
              className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-transform active:scale-95 flex items-center justify-center gap-2 sticky bottom-0"
            >
              <Download className="w-5 h-5" />
              Download HD PDF
            </button>
          </div>
        </div>

        {/* Right Side: Live Preview */}
        <div className="w-full lg:w-2/3 flex flex-col items-center justify-start print:w-full print:items-start pt-4 lg:pt-0">
          <div className="mb-4 text-sm font-bold text-slate-400 tracking-widest uppercase print:hidden">Live Preview</div>
          
          <div className="print:w-[1050px] print:h-[600px] flex items-center justify-center w-full">
            
            {/* --- MASTER CARD WRAPPER --- */}
            <div className={`w-full max-w-[650px] aspect-[1.75/1] rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:border print:rounded-none relative ${getThemeClasses()}`}>
              
              {/* Decorative Background Patterns (Only for colored themes) */}
              {theme !== 'minimal' && (
                <>
                  <div className="absolute top-0 right-0 w-[120%] h-[120%] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-[80%] h-[80%] bg-black/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl pointer-events-none"></div>
                </>
              )}

              {/* === LAYOUT 1: Standard Left === */}
              {layout === 1 && (
                <div className="h-full p-8 sm:p-10 flex flex-col justify-between relative z-10 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-2 leading-none">{formData.businessName || 'Business Name'}</h1>
                      <p className={`text-sm sm:text-base font-bold tracking-widest uppercase ${getAccentColor()}`}>{formData.tagline || 'Tagline'}</p>
                    </div>
                    {renderLogo('small')}
                  </div>
                  <div className="mt-auto">
                    <div className={`h-1 rounded-full mb-5 w-16 ${theme === 'minimal' ? 'bg-indigo-500' : 'bg-white/20'}`}></div>
                    <h2 className="text-xl sm:text-2xl font-bold">{formData.name || 'Your Name'}</h2>
                    {formData.designation && <p className={`text-sm font-semibold uppercase tracking-wider mb-5 ${getAccentColor()}`}>{formData.designation}</p>}
                    {renderContactInfo('left')}
                  </div>
                </div>
              )}

              {/* === LAYOUT 2: Standard Right === */}
              {layout === 2 && (
                <div className="h-full p-8 sm:p-10 flex flex-col justify-between relative z-10 text-right items-end">
                  <div className="flex justify-between items-start w-full flex-row-reverse">
                    <div className="text-right">
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-2 leading-none">{formData.businessName || 'Business Name'}</h1>
                      <p className={`text-sm sm:text-base font-bold tracking-widest uppercase ${getAccentColor()}`}>{formData.tagline || 'Tagline'}</p>
                    </div>
                    {renderLogo('small')}
                  </div>
                  <div className="mt-auto flex flex-col items-end">
                    <div className={`h-1 rounded-full mb-5 w-16 ${theme === 'minimal' ? 'bg-indigo-500' : 'bg-white/20'}`}></div>
                    <h2 className="text-xl sm:text-2xl font-bold">{formData.name || 'Your Name'}</h2>
                    {formData.designation && <p className={`text-sm font-semibold uppercase tracking-wider mb-5 ${getAccentColor()}`}>{formData.designation}</p>}
                    {renderContactInfo('right')}
                  </div>
                </div>
              )}

              {/* === LAYOUT 3: Classic Center === */}
              {layout === 3 && (
                <div className="h-full p-8 sm:p-10 flex flex-col items-center justify-center relative z-10 text-center gap-3">
                  {renderLogo('small')}
                  
                  <div className="flex flex-col items-center mt-2">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-2 leading-none uppercase">{formData.businessName || 'Business Name'}</h1>
                    <p className={`text-xs sm:text-sm font-bold tracking-widest uppercase ${getAccentColor()}`}>{formData.tagline || 'Tagline'}</p>
                  </div>
                  
                  <div className={`h-px w-16 my-2 ${theme === 'minimal' ? 'bg-slate-300' : 'bg-white/30'}`}></div>
                  
                  <div className="flex flex-col items-center">
                    <h2 className="text-lg sm:text-xl font-bold tracking-wide">{formData.name || 'Your Name'}</h2>
                    {formData.designation && <p className={`text-[10px] sm:text-xs font-semibold uppercase tracking-widest mt-1 ${getAccentColor()}`}>{formData.designation}</p>}
                  </div>

                  <div className="mt-auto w-full pt-4">
                     <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium opacity-90">
                        {formData.phone && <span>+91 {formData.phone}</span>}
                        {formData.phone && (formData.email || formData.website) && <span>•</span>}
                        {formData.email && <span>{formData.email}</span>}
                        {formData.email && formData.website && <span>•</span>}
                        {formData.website && <span>{formData.website}</span>}
                     </div>
                     {formData.address && (
                       <div className="text-[10px] sm:text-xs mt-2 opacity-80 font-medium">
                          {formData.address}
                       </div>
                     )}
                  </div>
                </div>
              )}

              {/* === LAYOUT 4: Modern Split (Left block solid, right block content) === */}
              {layout === 4 && (
                <div className="h-full flex relative z-10 text-left bg-white text-slate-900">
                  {/* Left Column (Brand) */}
                  <div className={`w-2/5 h-full flex flex-col items-center justify-center p-6 text-center ${theme === 'minimal' ? 'bg-slate-100 border-r border-slate-200' : getThemeClasses()}`}>
                    {renderLogo('large')}
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-6 leading-tight">{formData.businessName || 'Business Name'}</h1>
                    <p className={`text-[10px] sm:text-xs font-bold tracking-widest uppercase mt-2 ${theme === 'minimal' ? 'text-slate-500' : 'text-white/80'}`}>{formData.tagline}</p>
                  </div>
                  {/* Right Column (Details) */}
                  <div className="w-3/5 h-full p-6 sm:p-8 flex flex-col justify-center">
                    <h2 className="text-xl sm:text-3xl font-bold text-slate-900">{formData.name || 'Your Name'}</h2>
                    {formData.designation && <p className="text-sm font-bold uppercase tracking-wider mb-6 text-indigo-600">{formData.designation}</p>}
                    
                    {/* Render contact info manually here to force slate colors on white bg */}
                    <div className="space-y-4 w-full">
                      <div className="flex items-center gap-3 text-slate-700">
                        <Phone className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-bold">+91 {formData.phone || '9999999999'}</span>
                      </div>
                      {formData.email && (
                        <div className="flex items-center gap-3 text-slate-700">
                          <Mail className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-medium">{formData.email}</span>
                        </div>
                      )}
                      {formData.website && (
                        <div className="flex items-center gap-3 text-slate-700">
                          <Globe className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-medium">{formData.website}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-slate-700">
                        <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                        <span className="text-sm font-medium">{formData.address || 'Your Address Here'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === LAYOUT 5: Top Heavy === */}
              {layout === 5 && (
                <div className="h-full flex flex-col relative z-10 text-center">
                  <div className="h-1/2 flex flex-col items-center justify-center p-6 bg-black/10 border-b border-white/10 backdrop-blur-sm">
                    {renderLogo('small')}
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 leading-none">{formData.businessName || 'Business Name'}</h1>
                    <p className={`text-xs font-bold tracking-widest uppercase mt-1 ${getAccentColor()}`}>{formData.tagline}</p>
                  </div>
                  <div className="h-1/2 p-6 sm:p-8 flex flex-col justify-center">
                    <h2 className="text-xl sm:text-2xl font-bold">{formData.name || 'Your Name'}</h2>
                    {formData.designation && <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${getAccentColor()}`}>{formData.designation}</p>}
                    <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mt-2">
                      <div className="flex items-center gap-2"><Phone className="w-3 h-3" /><span className="text-xs sm:text-sm font-bold">+91 {formData.phone}</span></div>
                      {formData.email && <div className="flex items-center gap-2"><Mail className="w-3 h-3" /><span className="text-xs sm:text-sm font-medium">{formData.email}</span></div>}
                      {formData.website && <div className="flex items-center gap-2"><Globe className="w-3 h-3" /><span className="text-xs sm:text-sm font-medium">{formData.website}</span></div>}
                      <div className="flex items-center gap-2 w-full justify-center mt-1"><MapPin className="w-3 h-3" /><span className="text-xs sm:text-sm font-medium">{formData.address}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* === LAYOUT 6: Grid View === */}
              {layout === 6 && (
                <div className="h-full p-8 sm:p-10 flex flex-col relative z-10 text-left">
                  <div className="flex justify-between items-start border-b pb-6 mb-6" style={{ borderColor: theme === 'minimal' ? '#e2e8f0' : 'rgba(255,255,255,0.2)'}}>
                    <div className="flex items-center gap-6">
                      {renderLogo('large')}
                      <div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-2 leading-none">{formData.businessName || 'Business Name'}</h1>
                        <p className={`text-sm font-bold tracking-widest uppercase ${getAccentColor()}`}>{formData.tagline}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 flex-1 items-center">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold mb-1">{formData.name || 'Your Name'}</h2>
                      {formData.designation && <p className={`text-sm font-semibold uppercase tracking-wider ${getAccentColor()}`}>{formData.designation}</p>}
                    </div>
                    <div className="border-l pl-6 py-2" style={{ borderColor: theme === 'minimal' ? '#e2e8f0' : 'rgba(255,255,255,0.2)'}}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3"><Phone className="w-4 h-4" /><span className="text-sm font-bold">+91 {formData.phone}</span></div>
                        {formData.email && <div className="flex items-center gap-3"><Mail className="w-4 h-4" /><span className="text-sm font-medium">{formData.email}</span></div>}
                        {formData.website && <div className="flex items-center gap-3"><Globe className="w-4 h-4" /><span className="text-sm font-medium">{formData.website}</span></div>}
                        <div className="flex items-center gap-3"><MapPin className="w-4 h-4" /><span className="text-sm font-medium">{formData.address}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AGENCY WATERMARK */}
              <div className="absolute bottom-1 sm:bottom-2 left-0 right-0 text-center w-full z-20 pointer-events-none">
                <p className={`text-[8px] sm:text-[9px] font-black tracking-widest uppercase opacity-60 ${
                  (layout === 4 || theme === 'minimal') ? 'text-slate-900' : 'text-white'
                }`}>
                  Website Agency | www.jan-seva.site | 7895094129
                </p>
              </div>

            </div>
          </div>
          
          <p className="mt-8 text-slate-500 text-sm max-w-md text-center print:hidden">
            Tip: Fill in your details, select a template and color theme. Then click Download to generate a high-definition PDF that you can take directly to your local printing shop.
          </p>
        </div>
      </div>

      {/* Lead Generation Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in print:hidden">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 relative shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500 rounded-t-3xl"></div>
            
            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Almost Done!</h3>
                <p className="text-slate-600">Generating your High-Quality PDF. The print window will open automatically...</p>
              </div>
            ) : (
              <>
                <button onClick={() => setShowLeadModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 mt-2">Download Free PDF</h3>
                <p className="text-slate-500 text-sm mb-6">Enter your WhatsApp number to unlock the High-Definition download for printing.</p>
                
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">WhatsApp Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold border-r border-slate-200 pr-3">+91</span>
                      <input type="tel" required maxLength={10} minLength={10} pattern="[0-9]{10}" value={leadPhone} onChange={(e) => setLeadPhone(e.target.value.replace(/\D/g, ''))} placeholder="Your 10-digit number" className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                  </div>
                  <button type="submit" disabled={submitting || leadPhone.length < 10} className="w-full py-4 text-white font-bold bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Download Now'}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-3">We hate spam. We will only contact you if you require IT/printing assistance.</p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .print\\:w-\\[1050px\\] * { visibility: visible; }
          .print\\:w-\\[1050px\\] {
            position: absolute; left: 0; top: 0; width: 1050px !important; height: 600px !important; transform-origin: top left;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}
