'use client';

import { useState } from 'react';
import { Download, Upload, X, Loader2, Heart, User, Users, BookOpen, MapPin, CheckCircle2, Briefcase } from 'lucide-react';
import { submitServiceApplication } from '@/lib/api';

type Theme = 'red' | 'gold' | 'pink' | 'minimal' | 'emerald' | 'purple' | 'ocean' | 'orange';
type Layout = 'modern-split' | 'classic-center' | 'standard-left';

export default function BiodataMaker() {
  const [formData, setFormData] = useState({
    titleText: '॥ श्री गणेशाय नमः ॥',
    // Personal
    name: 'Rahul Kumar',
    dob: '15 August 1996',
    timeOfBirth: '10:30 AM',
    placeOfBirth: 'Etawah, UP',
    height: '5 ft 10 in',
    complexion: 'Fair',
    bloodGroup: 'O+',
    
    // Religious
    religion: 'Hindu',
    caste: 'Brahmin',
    gotra: 'Kashyap',
    manglik: 'No',
    
    // Education & Career
    education: 'B.Tech (Computer Science)',
    occupation: 'Software Engineer at MNC',
    income: '12 Lakhs PA',
    
    // Family
    fatherName: 'Mr. Ashok Kumar',
    fatherOccupation: 'Govt. Teacher',
    motherName: 'Mrs. Sunita Devi',
    motherOccupation: 'Homemaker',
    siblings: '1 Brother, 1 Sister',
    address: '123, Civil Lines, Etawah, UP'
  });

  const [theme, setTheme] = useState<Theme>('red');
  const [layout, setLayout] = useState<Layout>('modern-split');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadPhone, setLeadPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const getThemeClasses = () => {
    switch(theme) {
      case 'red': return 'bg-rose-50 text-slate-900 border-rose-600 border-[12px]';
      case 'gold': return 'bg-amber-50 text-slate-900 border-amber-600 border-[12px]';
      case 'pink': return 'bg-pink-50 text-slate-900 border-pink-500 border-[12px]';
      case 'emerald': return 'bg-emerald-50 text-slate-900 border-emerald-600 border-[12px]';
      case 'purple': return 'bg-purple-50 text-slate-900 border-purple-600 border-[12px]';
      case 'ocean': return 'bg-cyan-50 text-slate-900 border-cyan-600 border-[12px]';
      case 'orange': return 'bg-orange-50 text-slate-900 border-orange-500 border-[12px]';
      case 'minimal': return 'bg-white text-slate-900 border-slate-300 border-[4px]';
      default: return 'bg-white text-slate-900 border-rose-600 border-[12px]';
    }
  };

  const getThemeHeaderColor = () => {
    switch(theme) {
      case 'red': return 'text-rose-700 border-rose-200';
      case 'gold': return 'text-amber-700 border-amber-200';
      case 'pink': return 'text-pink-600 border-pink-200';
      case 'emerald': return 'text-emerald-700 border-emerald-200';
      case 'purple': return 'text-purple-700 border-purple-200';
      case 'ocean': return 'text-cyan-700 border-cyan-200';
      case 'orange': return 'text-orange-600 border-orange-200';
      case 'minimal': return 'text-slate-800 border-slate-200';
      default: return 'text-rose-700 border-rose-200';
    }
  };

  const getThemeIconColor = () => {
    switch(theme) {
      case 'red': return 'text-rose-500';
      case 'gold': return 'text-amber-600';
      case 'pink': return 'text-pink-500';
      case 'emerald': return 'text-emerald-500';
      case 'purple': return 'text-purple-500';
      case 'ocean': return 'text-cyan-500';
      case 'orange': return 'text-orange-500';
      case 'minimal': return 'text-slate-400';
      default: return 'text-rose-500';
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        service_type: `Shaadi Biodata Maker Lead (Name: ${formData.name})`,
        address: formData.address,
        email: ''
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

  const DataRow = ({ label, value }: { label: string, value: string }) => {
    if (!value) return null;
    return (
      <div className="flex text-[9px] sm:text-[11px] md:text-[12px] py-1 border-b border-black/5 last:border-0 leading-snug">
        <div className="w-[40%] font-bold opacity-70 flex-shrink-0 pr-1 sm:pr-2">{label}</div>
        <div className="w-[60%] font-semibold break-words flex">
          <span className="mr-2 opacity-50">:</span>
          <span className="flex-1">{value}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 print:p-0">
      
      {/* STRICT PRINT STYLES FOR EXACT 1-PAGE A4 OUTPUT */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0 !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm;
            height: 297mm;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            overflow: hidden !important;
          }
          #resume-print-root {
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            overflow: hidden !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            transform: none !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>

      {/* Header - Hidden in Print */}
      <div className="text-center mb-10 print:hidden">
        <div className="inline-flex items-center justify-center p-3 bg-rose-100 rounded-full mb-4">
          <Heart className="w-8 h-8 text-rose-600" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
          Marriage <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600">Biodata Maker</span>
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Create a beautiful marriage biodata in 2 minutes. Fill details, choose a theme, and download a high-quality PDF for WhatsApp sharing or printing.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Side: Form Controls - Hidden in Print */}
        <div className="w-full lg:w-1/2 space-y-6 print:hidden">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 max-h-[85vh] overflow-y-auto custom-scrollbar">
            
            {/* Theme & Layout */}
            <h3 className="text-lg font-bold text-slate-900 mb-4 sticky top-0 bg-white z-10 py-2 border-b border-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-rose-600" /> 1. Choose Theme & Layout
            </h3>
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Color Theme</label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                <button onClick={() => setTheme('red')} className={`h-10 rounded-lg bg-rose-700 border-2 transition-all ${theme === 'red' ? 'border-rose-300 ring-2 ring-rose-700 ring-offset-2' : 'border-transparent'}`} title="Classic Red"></button>
                <button onClick={() => setTheme('gold')} className={`h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-700 border-2 transition-all ${theme === 'gold' ? 'border-amber-300 ring-2 ring-amber-600 ring-offset-2' : 'border-transparent'}`} title="Royal Gold"></button>
                <button onClick={() => setTheme('pink')} className={`h-10 rounded-lg bg-pink-500 border-2 transition-all ${theme === 'pink' ? 'border-pink-300 ring-2 ring-pink-500 ring-offset-2' : 'border-transparent'}`} title="Soft Pink"></button>
                <button onClick={() => setTheme('emerald')} className={`h-10 rounded-lg bg-emerald-600 border-2 transition-all ${theme === 'emerald' ? 'border-emerald-300 ring-2 ring-emerald-600 ring-offset-2' : 'border-transparent'}`} title="Emerald Green"></button>
                <button onClick={() => setTheme('purple')} className={`h-10 rounded-lg bg-purple-600 border-2 transition-all ${theme === 'purple' ? 'border-purple-300 ring-2 ring-purple-600 ring-offset-2' : 'border-transparent'}`} title="Royal Purple"></button>
                <button onClick={() => setTheme('ocean')} className={`h-10 rounded-lg bg-cyan-600 border-2 transition-all ${theme === 'ocean' ? 'border-cyan-300 ring-2 ring-cyan-600 ring-offset-2' : 'border-transparent'}`} title="Ocean Blue"></button>
                <button onClick={() => setTheme('orange')} className={`h-10 rounded-lg bg-orange-500 border-2 transition-all ${theme === 'orange' ? 'border-orange-300 ring-2 ring-orange-500 ring-offset-2' : 'border-transparent'}`} title="Vibrant Orange"></button>
                <button onClick={() => setTheme('minimal')} className={`h-10 rounded-lg bg-white border border-slate-300 transition-all ${theme === 'minimal' ? 'border-slate-900 ring-2 ring-slate-900 ring-offset-2' : 'border-transparent'}`} title="Minimal White"></button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Biodata Layout</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button 
                  onClick={() => setLayout('modern-split')} 
                  className={`p-3 text-sm font-bold rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${layout === 'modern-split' ? 'border-rose-600 bg-rose-50 text-rose-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                >
                  <div className="w-12 h-16 border-2 border-current rounded flex flex-col p-1 gap-1 opacity-70">
                    <div className="flex justify-between items-start gap-1"><div className="w-full h-2 bg-current rounded-sm"></div><div className="w-4 h-4 bg-current rounded-sm flex-shrink-0"></div></div>
                    <div className="flex gap-1 flex-1"><div className="w-1/2 h-full bg-current opacity-30 rounded-sm"></div><div className="w-1/2 h-full bg-current opacity-30 rounded-sm"></div></div>
                  </div>
                  Modern Split
                </button>
                <button 
                  onClick={() => setLayout('classic-center')} 
                  className={`p-3 text-sm font-bold rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${layout === 'classic-center' ? 'border-rose-600 bg-rose-50 text-rose-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                >
                  <div className="w-12 h-16 border-2 border-current rounded flex flex-col items-center p-1 gap-1 opacity-70">
                    <div className="w-4 h-4 bg-current rounded-sm"></div>
                    <div className="w-3/4 h-2 bg-current rounded-sm"></div>
                    <div className="w-full flex-1 bg-current opacity-30 rounded-sm"></div>
                  </div>
                  Classic Center
                </button>
                <button 
                  onClick={() => setLayout('standard-left')} 
                  className={`p-3 text-sm font-bold rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${layout === 'standard-left' ? 'border-rose-600 bg-rose-50 text-rose-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                >
                  <div className="w-12 h-16 border-2 border-current rounded flex flex-col p-1 gap-1 opacity-70">
                    <div className="flex gap-1"><div className="w-4 h-4 bg-current rounded-sm flex-shrink-0"></div><div className="w-full h-4 bg-current opacity-30 rounded-sm"></div></div>
                    <div className="w-full flex-1 bg-current opacity-30 rounded-sm"></div>
                  </div>
                  Standard Left
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Top Heading (Religious Text)</label>
              <input name="titleText" type="text" value={formData.titleText} onChange={handleChange} placeholder="e.g. ॥ श्री गणेशाय नमः ॥" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
            </div>

            {/* Photo Upload */}
            <div className="mb-8">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Biodata Photo (Optional)</label>
              <div className="relative">
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 border-dashed rounded-lg flex items-center justify-center gap-2 text-sm text-slate-500 hover:bg-slate-100 transition-colors">
                  <Upload className="w-4 h-4" />
                  {photoUrl ? 'Photo Uploaded - Click to Change' : 'Upload Profile Photo'}
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <h3 className="text-lg font-bold text-slate-900 mb-4 sticky top-0 bg-white z-10 py-2 border-b border-slate-100 mt-6 flex items-center gap-2">
              <User className="w-5 h-5 text-rose-600" /> 2. Personal Details
            </h3>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date of Birth</label>
                  <input name="dob" type="text" value={formData.dob} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time of Birth</label>
                  <input name="timeOfBirth" type="text" value={formData.timeOfBirth} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Place of Birth</label>
                  <input name="placeOfBirth" type="text" value={formData.placeOfBirth} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Height</label>
                  <input name="height" type="text" value={formData.height} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Complexion</label>
                  <input name="complexion" type="text" value={formData.complexion} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Blood Group</label>
                  <input name="bloodGroup" type="text" value={formData.bloodGroup} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
                </div>
              </div>
            </div>

            {/* Religious Details */}
            <h3 className="text-lg font-bold text-slate-900 mb-4 sticky top-0 bg-white z-10 py-2 border-b border-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-rose-600" /> 3. Religion & Caste
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-8 space-y-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Religion</label>
                <input name="religion" type="text" value={formData.religion} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Caste</label>
                <input name="caste" type="text" value={formData.caste} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gotra (Optional)</label>
                <input name="gotra" type="text" value={formData.gotra} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Manglik Status</label>
                <select name="manglik" value={formData.manglik} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none">
                  <option value="No">No (Non-Manglik)</option>
                  <option value="Yes">Yes (Manglik)</option>
                  <option value="Anshik">Anshik Manglik</option>
                  <option value="Don't Know">Don't Know</option>
                </select>
              </div>
            </div>

            {/* Career Details */}
            <h3 className="text-lg font-bold text-slate-900 mb-4 sticky top-0 bg-white z-10 py-2 border-b border-slate-100 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-rose-600" /> 4. Education & Career
            </h3>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Highest Education</label>
                <input name="education" type="text" value={formData.education} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Occupation / Job</label>
                <input name="occupation" type="text" value={formData.occupation} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Annual Income (Optional)</label>
                <input name="income" type="text" value={formData.income} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
            </div>

            {/* Family Details */}
            <h3 className="text-lg font-bold text-slate-900 mb-4 sticky top-0 bg-white z-10 py-2 border-b border-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-rose-600" /> 5. Family Details
            </h3>
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Father's Name</label>
                  <input name="fatherName" type="text" value={formData.fatherName} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Occupation</label>
                  <input name="fatherOccupation" type="text" value={formData.fatherOccupation} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mother's Name</label>
                  <input name="motherName" type="text" value={formData.motherName} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Occupation</label>
                  <input name="motherOccupation" type="text" value={formData.motherOccupation} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Siblings</label>
                <input name="siblings" type="text" value={formData.siblings} onChange={handleChange} placeholder="e.g. 1 Brother, 1 Sister" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Family Address</label>
                <input name="address" type="text" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
            </div>

            <button
              onClick={handleDownloadClick}
              className="w-full mt-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-500/30 transition-transform active:scale-95 flex items-center justify-center gap-2 sticky bottom-0 z-20"
            >
              <Download className="w-5 h-5" />
              Download HD PDF
            </button>
          </div>
        </div>

        {/* Right Side: Live Preview (A4 Aspect Ratio) */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-start print:w-full print:items-start pt-4 lg:pt-0">
          <div className="mb-4 text-sm font-bold text-slate-400 tracking-widest uppercase print:hidden">Live Preview (A4 Size)</div>
          
          <div className="flex items-center justify-center w-full max-w-[600px] mx-auto print:max-w-none print:w-full print:h-full print:block">
            
            {/* --- MASTER A4 WRAPPER --- */}
            {/* Standard A4 Aspect Ratio is 1 : 1.414 */}
            <div id="resume-print-root" className={`w-full aspect-[1/1.414] rounded-lg shadow-2xl relative overflow-hidden print:shadow-none print:border-none print:rounded-none ${getThemeClasses()}`}>
              
              {/* Inner Border */}
              <div className={`absolute inset-2 sm:inset-4 border-[2px] sm:border-[4px] rounded-md pointer-events-none z-10 print:hidden ${theme === 'minimal' ? 'border-slate-200' : 'border-white/30'}`}></div>
              
              <div className="w-full h-full p-3 sm:p-6 md:p-8 flex flex-col justify-between relative z-20 overflow-hidden">
                
                {/* Header Section */}
                <div className="text-center mb-2 sm:mb-4 flex flex-col items-center">
                  <h1 className={`text-sm sm:text-xl font-bold mb-1 sm:mb-2 tracking-wide ${getThemeHeaderColor().split(' ')[0]}`}>
                    {formData.titleText}
                  </h1>
                  <h2 className={`text-lg sm:text-2xl font-black uppercase tracking-[0.2em] border-y-[1.5px] sm:border-y-2 py-0.5 sm:py-1 px-8 sm:px-12 ${getThemeHeaderColor()}`}>
                    BIODATA
                  </h2>
                </div>

                {/* Top Section: Photo & Basic Info */}
                {layout === 'modern-split' && (
                  <div className="flex justify-between items-start mb-2 pb-2 sm:mb-4 sm:pb-4 border-b-2 border-black/10 gap-2 sm:gap-4">
                    <div className="flex-1 pt-1 sm:pt-2">
                      <h3 className={`text-lg sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 uppercase ${getThemeHeaderColor().split(' ')[0]}`}>
                        {formData.name || 'Your Name'}
                      </h3>
                      <div className="text-[8px] sm:text-xs md:text-sm mt-1 sm:mt-2 opacity-80 leading-tight">
                        <span className="font-bold">DOB:</span> {formData.dob} <span className="mx-1 sm:mx-2 opacity-50">|</span> <span className="font-bold">Time:</span> {formData.timeOfBirth} <span className="mx-1 sm:mx-2 opacity-50">|</span> <span className="font-bold">Place:</span> {formData.placeOfBirth}
                      </div>
                    </div>
                    {photoUrl ? (
                      <div className={`w-16 h-20 sm:w-28 sm:h-32 md:w-32 md:h-36 rounded-lg overflow-hidden shadow-lg border-2 sm:border-[3px] flex-shrink-0 ${theme === 'minimal' ? 'border-slate-200' : 'border-white'}`}>
                        <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={`w-16 h-20 sm:w-28 sm:h-32 md:w-32 md:h-36 rounded-lg flex flex-col items-center justify-center shadow-inner border-[1px] sm:border-[2px] border-dashed flex-shrink-0 ${theme === 'minimal' ? 'border-slate-300 bg-slate-50' : 'border-black/20 bg-black/5'}`}>
                        <User className={`w-5 h-5 sm:w-8 sm:h-8 mb-1 sm:mb-2 opacity-50`} />
                        <span className="text-[6px] sm:text-[9px] uppercase font-bold opacity-50 text-center px-1">Attach Photo</span>
                      </div>
                    )}
                  </div>
                )}

                {layout === 'classic-center' && (
                  <div className="flex flex-col items-center mb-2 pb-2 sm:mb-4 sm:pb-4 border-b-2 border-black/10 text-center">
                    {photoUrl ? (
                      <div className={`w-16 h-20 sm:w-24 sm:h-28 rounded-lg overflow-hidden shadow-lg border-2 sm:border-[3px] mb-2 sm:mb-3 ${theme === 'minimal' ? 'border-slate-200' : 'border-white'}`}>
                        <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={`w-16 h-20 sm:w-24 sm:h-28 rounded-lg flex flex-col items-center justify-center shadow-inner border-[1px] sm:border-[2px] border-dashed mb-2 sm:mb-3 ${theme === 'minimal' ? 'border-slate-300 bg-slate-50' : 'border-black/20 bg-black/5'}`}>
                        <User className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 opacity-50`} />
                        <span className="text-[6px] sm:text-[8px] uppercase font-bold opacity-50 text-center px-1">Attach Photo</span>
                      </div>
                    )}
                    <h3 className={`text-lg sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 uppercase ${getThemeHeaderColor().split(' ')[0]}`}>
                      {formData.name || 'Your Name'}
                    </h3>
                    <div className="w-full text-center text-[8px] sm:text-xs md:text-sm opacity-80 leading-tight">
                      <span className="font-bold">DOB:</span> {formData.dob} <span className="mx-1 sm:mx-2 opacity-50">|</span> <span className="font-bold">Time:</span> {formData.timeOfBirth} <span className="mx-1 sm:mx-2 opacity-50">|</span> <span className="font-bold">Place:</span> {formData.placeOfBirth}
                    </div>
                  </div>
                )}

                {layout === 'standard-left' && (
                  <div className="flex flex-row items-center mb-2 pb-2 sm:mb-4 sm:pb-4 border-b-2 border-black/10 gap-3 sm:gap-6">
                    {photoUrl ? (
                      <div className={`w-16 h-20 sm:w-28 sm:h-32 md:w-32 md:h-36 rounded-lg overflow-hidden shadow-lg border-2 sm:border-[3px] flex-shrink-0 ${theme === 'minimal' ? 'border-slate-200' : 'border-white'}`}>
                        <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={`w-16 h-20 sm:w-28 sm:h-32 md:w-32 md:h-36 rounded-lg flex flex-col items-center justify-center shadow-inner border-[1px] sm:border-[2px] border-dashed flex-shrink-0 ${theme === 'minimal' ? 'border-slate-300 bg-slate-50' : 'border-black/20 bg-black/5'}`}>
                        <User className={`w-5 h-5 sm:w-8 sm:h-8 mb-1 sm:mb-2 opacity-50`} />
                        <span className="text-[6px] sm:text-[9px] uppercase font-bold opacity-50 text-center px-1">Attach Photo</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className={`text-lg sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 uppercase ${getThemeHeaderColor().split(' ')[0]}`}>
                        {formData.name || 'Your Name'}
                      </h3>
                      <div className="text-[8px] sm:text-xs md:text-sm mt-1 sm:mt-2 opacity-80 leading-tight">
                        <span className="font-bold">DOB:</span> {formData.dob} <span className="mx-1 sm:mx-2 opacity-50">|</span> <span className="font-bold">Time:</span> {formData.timeOfBirth} <span className="mx-1 sm:mx-2 opacity-50">|</span> <span className="font-bold">Place:</span> {formData.placeOfBirth}
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Details Grid */}
                <div className="flex-1 grid grid-cols-2 gap-x-2 sm:gap-x-10 gap-y-2 sm:gap-y-4">
                  
                  {/* LEFT COLUMN / FIRST HALF */}
                  <div className="flex flex-col justify-between h-full w-full">
                    {/* Personal & Physical Details */}
                    <div>
                      <h4 className={`text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-2 px-2 py-1 rounded inline-block bg-black/5 print:bg-slate-100 ${getThemeHeaderColor().split(' ')[0]}`}>
                        Personal Details
                      </h4>
                      <div className="space-y-1">
                        <DataRow label="Height" value={formData.height} />
                        <DataRow label="Complexion" value={formData.complexion} />
                        <DataRow label="Blood Group" value={formData.bloodGroup} />
                      </div>
                    </div>

                    {/* Religious Details */}
                    <div>
                      <h4 className={`text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-2 px-2 py-1 rounded inline-block bg-black/5 print:bg-slate-100 ${getThemeHeaderColor().split(' ')[0]}`}>
                        Religion & Caste
                      </h4>
                      <div className="space-y-1">
                        <DataRow label="Religion" value={formData.religion} />
                        <DataRow label="Caste" value={formData.caste} />
                        <DataRow label="Gotra" value={formData.gotra} />
                        <DataRow label="Manglik" value={formData.manglik} />
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN / SECOND HALF */}
                  <div className="flex flex-col justify-between h-full w-full">
                    {/* Education & Career */}
                    <div>
                      <h4 className={`text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-2 px-2 py-1 rounded inline-block bg-black/5 print:bg-slate-100 ${getThemeHeaderColor().split(' ')[0]}`}>
                        Education & Career
                      </h4>
                      <div className="space-y-1">
                        <DataRow label="Education" value={formData.education} />
                        <DataRow label="Occupation" value={formData.occupation} />
                        <DataRow label="Annual Income" value={formData.income} />
                      </div>
                    </div>

                    {/* Family Details */}
                    <div>
                      <h4 className={`text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-2 px-2 py-1 rounded inline-block bg-black/5 print:bg-slate-100 ${getThemeHeaderColor().split(' ')[0]}`}>
                        Family Details
                      </h4>
                      <div className="space-y-1">
                        <DataRow label="Father" value={formData.fatherName} />
                        <DataRow label="Father's Job" value={formData.fatherOccupation} />
                        <DataRow label="Mother" value={formData.motherName} />
                        <DataRow label="Mother's Job" value={formData.motherOccupation} />
                        <DataRow label="Siblings" value={formData.siblings} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Width Contact Details at Bottom */}
                <div className="pt-2 sm:pt-3 border-t-2 border-black/10">
                  <h4 className={`text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 px-2 py-1 rounded inline-block bg-black/5 print:bg-slate-100 ${getThemeHeaderColor().split(' ')[0]}`}>
                    Contact Information
                  </h4>
                  <div className="space-y-1">
                    <DataRow label="Residential Address" value={formData.address} />
                  </div>
                </div>

              </div>

              {/* AGENCY WATERMARK */}
              <div className="absolute bottom-2 left-0 right-0 text-center w-full z-30 pointer-events-none">
                <p className={`text-[8px] sm:text-[9px] font-black tracking-widest uppercase opacity-40 ${theme === 'minimal' ? 'text-slate-900' : 'text-black'}`}>
                  Website Agency | www.jan-seva.site | 7895094129
                </p>
              </div>

            </div>
          </div>
          
          <p className="mt-8 text-slate-500 text-sm max-w-md text-center print:hidden">
            Tip: Upload a clear passport size photo. Click Download to save this HD Biodata to your device or print it directly.
          </p>
        </div>
      </div>

      {/* Lead Generation Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in print:hidden">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 relative shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-rose-500 rounded-t-3xl"></div>
            
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
                <p className="text-slate-500 text-sm mb-6">Enter your WhatsApp number to unlock the High-Definition download for printing/sharing.</p>
                
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">WhatsApp Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold border-r border-slate-200 pr-3">+91</span>
                      <input type="tel" required maxLength={10} minLength={10} pattern="[0-9]{10}" value={leadPhone} onChange={(e) => setLeadPhone(e.target.value.replace(/\D/g, ''))} placeholder="Your 10-digit number" className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all" />
                    </div>
                  </div>
                  <button type="submit" disabled={submitting || leadPhone.length < 10} className="w-full py-4 text-white font-bold bg-rose-600 hover:bg-rose-700 rounded-xl shadow-lg shadow-rose-600/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Download HD Biodata'}
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
          .print\\:w-\\[794px\\] * { visibility: visible; }
          .print\\:w-\\[794px\\] {
            position: absolute; left: 0; top: 0; width: 794px !important; height: 1123px !important; transform-origin: top left;
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
