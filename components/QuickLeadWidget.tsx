'use client'

import { useState, useEffect } from 'react'
import { PhoneCall, X, CheckCircle2, Loader, Sparkles, ShieldCheck } from 'lucide-react'
import { submitServiceApplication } from '@/lib/api'

export default function QuickLeadWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [service, setService] = useState('📞 Callback Request / कॉल-बैेक')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [trackingId, setTrackingId] = useState('')

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openCallback', handleOpen);
    return () => window.removeEventListener('openCallback', handleOpen);
  }, []);

  const servicesList = [
    '📞 Callback Request / कॉल-बैक अनुरोध',
    '💳 PAN Card / Voter ID / Ration Card',
    '📜 Caste / Birth / Marriage Certificates',
    '📍 Aadhaar Address Correction (Etawah only)',
    '📜 Income / Domicile / Death Cert. (Etawah only)',
    '🎓 UP Scholarship & Exam Forms',
    '📌 PM Kisan & Government Schemes',
    '💻 Website & Mobile App Development',
    '🚗 Driving License & Vehicle Services',
    '💵 Banking / AEPS (Etawah only)'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      alert('कृपया अपना नाम दर्ज करें / Please enter your name')
      return
    }
    if (!mobile.trim() || mobile.trim().length !== 10) {
      alert('कृपया 10 अंकों का मोबाइल नंबर दर्ज करें / Please enter 10 digit mobile number')
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: `Callback Client: ${name.trim()}`,
        mobile: mobile.trim(),
        service_type: service,
        address: 'Online via Floating Callback Widget',
        email: ''
      }

      const response = await submitServiceApplication(payload)
      
      if (response && response.success !== false) {
        setSuccess(true)
        setTrackingId(response.trackingId || '')
        // Reset form
        setName('')
        setMobile('')
        setService('📞 Callback Request / कॉल-बैेक')
      } else {
        alert('कुछ त्रुटि हुई। कृपया पुनः प्रयास करें। / Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error('Callback request error:', err)
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pointer-events-auto animate-fade-in">
      {/* 10-Second Callback Form Card */}
      <div className="w-full sm:w-[360px] max-w-md bg-white rounded-2xl shadow-2xl border border-blue-100 p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        
        {/* Close button */}
          <button 
            onClick={() => { setIsOpen(false); setSuccess(false); }}
            className="absolute top-4 right-4 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-4 h-4" />
          </button>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">Get a Call Back in 5 Mins!</h3>
                  <p className="text-xs text-gray-500">5 मिनट में तुरंत कॉल-बैक पाएं</p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <label htmlFor="widget-name" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                    आपका नाम / Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="widget-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full px-3.5 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                  />
                </div>

                <div>
                  <label htmlFor="widget-mobile" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                    मोबाइल नंबर / Mobile <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="widget-mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter 10 digit number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                    className="w-full px-3.5 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                  />
                </div>

                <div>
                  <label htmlFor="widget-service" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                    सर्विस चुनें / Select Service
                  </label>
                  <select
                    id="widget-service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm bg-white transition"
                  >
                    {servicesList.map((srv, idx) => (
                      <option key={idx} value={srv}>{srv}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Online offer tag */}
              <div className="bg-blue-50 rounded-xl p-2.5 flex items-start gap-1.5 border border-blue-100">
                <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-[10px] sm:text-xs text-blue-900 leading-snug font-medium">
                  <strong>Online Offer:</strong> वेबसाइट द्वारा अप्लाई करने पर सर्विस चार्ज में <strong>20% की विशेष छूट!</strong>
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Requesting...</span>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-4 h-4" />
                    <span>Call Me Back / मुझे फोन करें</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
              <div>
                <h3 className="font-extrabold text-gray-900 text-base sm:text-lg">Request Registered!</h3>
                <p className="text-xs text-gray-500 mt-1">
                  हम आपको अगले 5 मिनट में कॉल करेंगे। <br />
                  Our team will call you shortly.
                </p>
              </div>

              {trackingId && (
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Tracking ID</span>
                  <span className="font-mono font-black text-sm text-gray-800">{trackingId}</span>
                </div>
              )}

              <button
                onClick={() => { setIsOpen(false); setSuccess(false); }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Close / बंद करें
              </button>
            </div>
          )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
