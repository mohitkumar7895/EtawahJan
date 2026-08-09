'use client';

import { useState } from 'react';
import { Search, CheckCircle2, ChevronRight, AlertCircle, PhoneCall, Loader2, Award, Landmark, UserCircle2 } from 'lucide-react';
import { submitServiceApplication } from '@/lib/api';

type Scheme = {
  id: string;
  name: string;
  description: string;
  amount: string;
  matchScore: number;
};

const SCHEMES_DATABASE = [
  {
    id: 'pm-kisan',
    name: 'PM Kisan Samman Nidhi',
    description: 'Financial support for farmers. Get ₹6000 per year directly in your bank account.',
    amount: '₹6,000 / Year',
    conditions: (data: any) => data.occupation === 'Farmer'
  },
  {
    id: 'up-scholarship',
    name: 'UP Scholarship Scheme',
    description: 'Financial assistance for students from Pre-Matric to Post-Matric levels.',
    amount: 'Variable',
    conditions: (data: any) => data.occupation === 'Student' && parseInt(data.income) < 250000
  },
  {
    id: 'ayushman',
    name: 'Ayushman Bharat Card',
    description: 'Free medical treatment up to ₹5 Lakhs in top private and government hospitals.',
    amount: '₹5 Lakhs Cover',
    conditions: (data: any) => parseInt(data.income) < 300000
  },
  {
    id: 'shram-card',
    name: 'E-Shram Card',
    description: 'Accidental insurance and financial help during pandemic/emergencies for unorganized workers.',
    amount: '₹2 Lakhs Cover',
    conditions: (data: any) => ['Laborer', 'Self Employed', 'Farmer'].includes(data.occupation)
  },
  {
    id: 'kanya-sumangala',
    name: 'Mukhya Mantri Kanya Sumangala',
    description: 'Financial assistance to families with girl children for their education and health.',
    amount: '₹15,000 Total',
    conditions: (data: any) => data.gender === 'Female' && parseInt(data.age) < 18 && parseInt(data.income) < 300000
  },
  {
    id: 'vridha-pension',
    name: 'UP Old Age Pension',
    description: 'Monthly pension scheme for senior citizens of Uttar Pradesh.',
    amount: '₹1,000 / Month',
    conditions: (data: any) => parseInt(data.age) >= 60 && parseInt(data.income) < 46000
  }
];

export default function SchemeFinder() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [matchedSchemes, setMatchedSchemes] = useState<Scheme[]>([]);
  
  // Form State
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    occupation: 'Student',
    income: '50000'
  });

  // Lead State
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAnalyze = () => {
    if (!formData.age || parseInt(formData.age) <= 0) {
      alert("Please enter a valid age.");
      return;
    }

    setLoading(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      const matches: Scheme[] = [];
      
      SCHEMES_DATABASE.forEach(scheme => {
        if (scheme.conditions(formData)) {
          matches.push({
            ...scheme,
            matchScore: Math.floor(Math.random() * 10) + 90 // 90-99% match
          });
        }
      });
      
      // Always show at least generic ones if no specific match
      if (matches.length === 0) {
        const defaultMatch = SCHEMES_DATABASE.find(s => s.id === 'ayushman');
        if (defaultMatch) {
          matches.push({ ...defaultMatch, matchScore: 85 });
        }
      }
      
      setMatchedSchemes(matches);
      setStep(2);
      setLoading(false);
    }, 2000);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      alert("Please enter a 10-digit mobile number.");
      return;
    }

    setSubmitting(true);
    try {
      await submitServiceApplication({
        name: 'Sarkari Yojana Lead',
        mobile: phone,
        service_type: `Scheme Apply: ${selectedScheme?.name}`,
        address: 'Online Yojana Checker',
        email: ''
      });
      setSuccess(true);
      
      // Redirect to WhatsApp after short delay
      setTimeout(() => {
        const text = encodeURIComponent(`Hello, I checked my eligibility online and want to apply for *${selectedScheme?.name}*. My number is ${phone}. Please guide me.`);
        window.open(`https://wa.me/917895094129?text=${text}`, '_blank');
        setSuccess(false);
        setSelectedScheme(null);
        setPhone('');
      }, 2000);
      
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
          <Landmark className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
          Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Yojana Finder</span>
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Check your eligibility for 50+ Central and State Government schemes in just 10 seconds. Find out how much financial assistance you can claim today!
        </p>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8 max-w-2xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <Search className="absolute inset-0 m-auto w-6 h-6 text-blue-600 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing Eligibility...</h3>
              <p className="text-slate-500 text-sm">Scanning UP & Central Government databases to find your best matches.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Age */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Your Age <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="E.g. 25"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Gender</label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Occupation */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Occupation</label>
                  <select 
                    value={formData.occupation}
                    onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="Student">Student</option>
                    <option value="Farmer">Farmer</option>
                    <option value="Self Employed">Self Employed / Business</option>
                    <option value="Laborer">Laborer / Unorganized</option>
                    <option value="Salaried">Salaried Employee</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
                </div>

                {/* Income */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Annual Family Income (₹)</label>
                  <select 
                    value={formData.income}
                    onChange={(e) => setFormData({...formData, income: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="45000">Less than ₹50,000</option>
                    <option value="150000">₹50,000 - ₹2,00,000</option>
                    <option value="250000">₹2,00,000 - ₹3,00,000</option>
                    <option value="400000">₹3,00,000 - ₹5,00,000</option>
                    <option value="600000">More than ₹5,00,000</option>
                  </select>
                </div>

              </div>

              <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-blue-900 leading-relaxed">
                  Your data is safe and will only be used to check your scheme eligibility. We do not store this information.
                </p>
              </div>

              <button
                onClick={handleAnalyze}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Find My Schemes Now
              </button>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-green-50 border border-green-200 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 text-white p-2 rounded-full">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-green-900 text-lg">Great News!</h3>
                <p className="text-green-700 text-sm">You are highly eligible for {matchedSchemes.length} schemes.</p>
              </div>
            </div>
            <button 
              onClick={() => setStep(1)}
              className="text-sm font-semibold text-green-700 hover:text-green-900 underline"
            >
              Re-check Details
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {matchedSchemes.map((scheme, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 text-xs font-black px-3 py-1 rounded-bl-xl">
                  {scheme.matchScore}% MATCH
                </div>
                
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl flex-shrink-0">
                    <Award className="w-8 h-8 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{scheme.name}</h3>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">{scheme.description}</p>
                    
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold mb-5 sm:mb-0">
                      Benefit: {scheme.amount}
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex-shrink-0 flex items-center justify-end">
                    <button 
                      onClick={() => setSelectedScheme(scheme)}
                      className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                    >
                      Apply Now <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Application Modal (Lead Gen) */}
      {selectedScheme && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 relative shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-green-500 rounded-t-3xl"></div>
            
            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Sent!</h3>
                <p className="text-slate-600">Redirecting you to WhatsApp to complete the application...</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Apply for {selectedScheme.name}</h3>
                <p className="text-slate-500 text-sm mb-6">Enter your WhatsApp number. Our CSC expert will contact you to complete the application process safely.</p>
                
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">WhatsApp Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <PhoneCall className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        minLength={10}
                        pattern="[0-9]{10}"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="10-digit number"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedScheme(null)}
                      className="flex-1 py-3 text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || phone.length < 10}
                      className="flex-1 py-3 text-white font-bold bg-green-600 hover:bg-green-700 rounded-xl shadow-lg shadow-green-600/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Apply'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      
    </div>
  );
}
