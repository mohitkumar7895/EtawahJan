'use client';

import { useState, FormEvent } from 'react';
import { Send, CheckCircle, User, Phone, MapPin, FileText, Loader2 } from 'lucide-react';
import { submitServiceApplication } from '@/lib/api';

const serviceOptions = [
  // Documents
  'Aadhaar Card',
  'PAN Card',
  'Voter ID Card',
  'Ration Card',
  'Ration Card Update',
  'Passport Services',
  'E-Shram Card',
  'Digital Signature Certificate',
  
  // Certificates
  'Birth Certificate',
  'Birth Certificate Correction',
  'Death Certificate',
  'Death Certificate Correction',
  'Marriage Certificate',
  'Income Certificate',
  'Caste Certificate',
  'Domicile Certificate',
  
  // Employment
  'Employment Registration',
  
  // Pension
  'Pension Services',
  'Old Age Pension',
  'Widow Pension',
  'Disability Pension',
  
  // Transport
  'Driving License Services',
  'Vehicle Registration',
  'Vehicle Number Plate Online',
  'RC Services',
  'Vehicle Insurance',
  'Vehicle Transfer',
  
  // Insurance
  'Health Insurance',
  'Ayushman Bharat Card',
  'Life Insurance',
  
  // Government Schemes
  'PM Awas Yojana',
  'Ujjwala Yojana',
  'PM Kisan Registration',
  'Kisan Credit Card',
  'PM Mudra Loan',
  'Scholarship Applications',
  
  // Utility
  'Bill Payment',
  'Light Connection (Jhatpat Online)',
  'Water Connection',
  'Mobile Recharge',
  'DTH Recharge',
  'Tax Deduction',
  'Income Tax Filing',
  'Withdraw/Payment Withdrawal',
  
  // Business
  
  // Legal
  
  // General
  'Xerox & Printing',
  'Sarkari Form Online',
  'Challan Jama',
  'Other Services',
  
  // School Project Work Services
  'School Project Writing',
  'Project Printing & Binding',
  'Project Design & Layout',
  'Project Cover Page Design',
  'Project Report Writing',
  'School Assignment Help',
  'Project Research Work',
  'Project Cutting & Pasting',
  'School Certificate Printing',
  'Report Card Printing',
  'School Form Filling',
  'School Document Services',
  
  // CSC Services - Land & Property
  'Land Records (Bhulekh)',
  'Property Documents',
  
  // CSC Services - Travel & Booking
  
  // CSC Services - Banking & Financial
  'Banking Services',
  'Money Transfer',
  'Aadhaar Enabled Payment',
  
  // CSC Services - Education & Skills
  'Exam Form Filling',
  'Skill Development Courses',
  'Digital Literacy',
  
  // Legal & Court
  'Court Case Status',
  'Legal Aid Services',
  
  // IT Services
  'IT Services',
  'Website, Mobile App, Custom Software',
];

type ContactFormProps = {
  embedded?: boolean;
  preselectedService?: string;
};

export default function ContactForm({ embedded, preselectedService }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    service_type: preselectedService || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      console.log('Submitting form data:', formData);
      await submitServiceApplication(formData);
      setIsSuccess(true);
      setFormData({
        name: '',
        mobile: '',
        address: '',
        service_type: '',
      });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      setError('कृपया पुनः प्रयास करें। Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const inner = (
    <div className={embedded ? 'text-base' : ''}>
      <div className={embedded ? 'text-center mb-4' : 'text-center mb-6'}>
        {!embedded && (
          <>
            <h2 className="text-4xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-xl text-blue-100">हमसे संपर्क करें - Fill the form to apply for services</p>
          </>
        )}
        <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-4">
          <span className="inline-flex items-center text-xs sm:text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold border border-green-200">
            <CheckCircle className="w-4 h-4 mr-1" /> 100% Secure
          </span>
          <span className="inline-flex items-center text-xs sm:text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold border border-blue-200">
            <Send className="w-4 h-4 mr-1" /> Fast Processing
          </span>
        </div>
      </div>

      {isSuccess && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-xl mb-6 flex items-center space-x-3 shadow-lg border-2 border-green-400 animate-in slide-in-from-top">
          <CheckCircle className="w-6 h-6 flex-shrink-0" />
          <div>
            <p className="font-bold text-lg">Form Submitted Successfully! 🎉</p>
            <p className="text-sm text-green-100 mt-1">हम जल्द ही आपसे संपर्क करेंगे। We&apos;ll contact you soon.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-5 rounded-xl mb-6 shadow-lg border-2 border-red-400 animate-in slide-in-from-top">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-bold text-lg">Error</p>
              <p className="text-sm text-red-100 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={embedded ? 'bg-transparent relative' : 'bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-2xl border border-blue-100 p-4 sm:p-6 md:p-8 relative'}
      >
        <div className="absolute -top-3 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
          🔥 Fill form for PRIORITY service!
        </div>
        <div className={embedded ? 'space-y-3 pt-2' : 'space-y-4 sm:space-y-5 md:space-y-6 pt-2'}>
          {/* Full Name Field */}
          <div className="relative">
            <label htmlFor="name" className="flex items-center text-xs font-bold text-gray-800 mb-1.5">
              <User className="w-4 h-4 mr-2 text-blue-600" />
              Full Name / पूरा नाम <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                autoFocus={embedded}
                className={`w-full ${embedded ? 'pl-10 pr-3 py-2 text-sm' : 'pl-12 pr-4 py-3'} border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all bg-white text-gray-900 placeholder-gray-400 shadow-sm hover:border-gray-400`}
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Mobile Field */}
          <div className="relative">
            <label htmlFor="mobile" className="flex items-center text-xs font-bold text-gray-800 mb-1.5">
              <Phone className="w-4 h-4 mr-2 text-blue-600" />
              Mobile / मोबाइल <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                required
                value={formData.mobile}
                onChange={handleChange}
                pattern="[0-9]{10}"
                maxLength={10}
                className={`w-full ${embedded ? 'pl-10 pr-3 py-2 text-sm' : 'pl-12 pr-4 py-3'} border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all bg-white text-gray-900 placeholder-gray-400 shadow-sm hover:border-gray-400`}
                placeholder="10 digit mobile number"
              />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Please enter 10 digit mobile number</p>
          </div>

          {/* Service Type Field */}
          <div className="relative">
            <label htmlFor="service_type" className="flex items-center text-xs font-bold text-gray-800 mb-1.5">
              <FileText className="w-4 h-4 mr-2 text-blue-600" />
              Service / सेवा <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="service_type"
                name="service_type"
                required
                value={formData.service_type}
                onChange={handleChange}
                className={`w-full ${embedded ? 'pl-10 pr-10 py-2 text-sm' : 'pl-12 pr-10 py-3'} border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all bg-white text-gray-900 appearance-none cursor-pointer shadow-sm hover:border-gray-400`}
              >
                <option value="" className="text-gray-400">-- Select Service --</option>
                {serviceOptions.map((service) => (
                  <option key={service} value={service} className="text-gray-800">
                    {service}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Address Field */}
          <div className="relative">
            <label htmlFor="address" className="flex items-center text-xs font-bold text-gray-800 mb-1.5">
              <MapPin className="w-4 h-4 mr-2 text-blue-600" />
              Address / पता <span className="text-gray-500 font-normal ml-1">(Optional / ऐच्छिक)</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-4 pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className={`w-full ${embedded ? 'pl-10 pr-3 py-2 text-sm' : 'pl-12 pr-4 py-3'} border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all bg-white text-gray-900 placeholder-gray-400 resize-none shadow-sm hover:border-gray-400`}
                placeholder="Enter your complete address"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white ${embedded ? 'px-4 py-2.5 text-sm' : 'px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4'} rounded-lg font-bold ${embedded ? 'text-sm' : 'text-base sm:text-lg'} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 relative overflow-hidden group`}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
              <span className="relative z-10 flex items-center space-x-2">
              {isSubmitting ? (
                <>
                  <Loader2 className={`${embedded ? 'w-4 h-4' : 'w-6 h-6'} animate-spin`} />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className={embedded ? 'w-4 h-4' : 'w-6 h-6'} />
                  <span>{embedded ? 'Submit Application' : 'Submit Application (Fast Track)'}</span>
                </>
              )}
              </span>
            </button>
            <p className="text-xs text-center text-gray-500 mt-2 mb-4">
              By submitting, you agree to our terms and conditions
            </p>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">OR / या</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <a
              href="https://wa.me/917895094129?text=Hello%20Jan%20Seva%20Kendra,%20I%20need%20help%20with%20a%20service."
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-4 w-full bg-[#25D366] hover:bg-[#128C7E] text-white ${embedded ? 'px-4 py-2.5 text-sm' : 'px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4'} rounded-lg font-bold ${embedded ? 'text-sm' : 'text-base sm:text-lg'} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2`}
            >
              <svg className={embedded ? 'w-4 h-4' : 'w-6 h-6'} fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              <span>WhatsApp: 7895094129 / 9193898182</span>
            </a>
          </div>
        </div>
      </form>

      {!embedded && (
        <div className="mt-8 text-center text-white">
          <p className="text-lg mb-2">या सीधे हमसे संपर्क करें:</p>
          <a href="tel:9193898182" className="text-2xl font-bold hover:text-blue-200 transition">
            📞 9193898182, 7895094129
          </a>
        </div>
      )}
    </div>
  );

  if (embedded) return inner;

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">{inner}</div>
      </div>
    </section>
  );
}


