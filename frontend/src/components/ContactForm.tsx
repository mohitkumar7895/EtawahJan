import { useState, FormEvent } from 'react';
import { Send, CheckCircle, User, Mail, Phone, MapPin, FileText, Loader2 } from 'lucide-react';
import { submitServiceApplication } from '../lib/api';

const serviceOptions = [
  'Aadhaar Card',
  'Aadhaar Update/Correction',
  'Mobile Number Linking',
  'Bank Account Linking',
  'PAN Card',
  'Voter ID Card',
  'Ration Card',
  'Ration Card Update',
  'Passport Services',
  'E-Shram Card',
  'Digital Signature Certificate',
  'Birth Certificate',
  'Birth Certificate Correction',
  'Death Certificate',
  'Death Certificate Correction',
  'Marriage Certificate',
  'Income Certificate',
  'Caste Certificate',
  'Domicile Certificate',
  'Name Change Services',
  'Address Change Services',
  'Employment Registration',
  'EPF Services',
  'ESIC Registration',
  'Pension Services',
  'Old Age Pension',
  'Widow Pension',
  'Disability Pension',
  'Jeevan Pramaan (Digital Life Certificate)',
  'Driving License Services',
  'Vehicle Registration',
  'Vehicle Number Plate Online',
  'RC Services',
  'Vehicle Insurance',
  'Vehicle Transfer',
  'Health Insurance',
  'Ayushman Bharat Card',
  'PMJAY Card',
  'Life Insurance',
  'Crop Insurance',
  'PM Awas Yojana',
  'Ujjwala Yojana',
  'PM Kisan Registration',
  'Kisan Credit Card',
  'PM Mudra Loan',
  'Scholarship Applications',
  'Bill Payment',
  'Light Connection (Jhatpat Online)',
  'Water Connection',
  'Mobile Recharge',
  'DTH Recharge',
  'Gas Booking',
  'Tax Deduction',
  'Income Tax Filing',
  'Withdraw/Payment Withdrawal',
  'GST Registration',
  'Company Registration',
  'Legal Documentation',
  'Affidavit Services',
  'Xerox & Printing',
  'Form Filling Services',
  'Other Services',
];

type ContactFormProps = {
  /** When true the component renders only the inner form (no outer section/container)
   *  so it can be embedded (for example, inside a modal). */
  embedded?: boolean;
};

export default function ContactForm({ embedded }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    service_type: '',
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
        email: '',
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

  // When embedded (e.g. inside a modal) we render a compact inner form block
  const inner = (
    <div className={embedded ? 'text-base' : ''}>
      <div className={embedded ? 'text-center mb-4' : 'text-center mb-6'}>
        {!embedded && (
          <>
            <h2 className="text-4xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-xl text-blue-100">हमसे संपर्क करें - Fill the form to apply for services</p>
          </>
        )}
      </div>

      {isSuccess && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-xl mb-6 flex items-center space-x-3 shadow-lg border-2 border-green-400 animate-in slide-in-from-top">
          <CheckCircle className="w-6 h-6 flex-shrink-0" />
          <div>
            <p className="font-bold text-lg">Form Submitted Successfully! 🎉</p>
            <p className="text-sm text-green-100 mt-1">हम जल्द ही आपसे संपर्क करेंगे। We'll contact you soon.</p>
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
        className={embedded ? 'bg-transparent' : 'bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-2xl border border-blue-100 p-8'}
      >
        <div className={embedded ? 'space-y-3' : 'space-y-6'}>
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

          {/* Email Field */}
          <div className="relative">
            <label htmlFor="email" className="flex items-center text-xs font-bold text-gray-800 mb-1.5">
              <Mail className="w-4 h-4 mr-2 text-blue-600" />
              Email / ईमेल <span className="text-gray-500 text-xs ml-1">(optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full ${embedded ? 'pl-10 pr-3 py-2 text-sm' : 'pl-12 pr-4 py-3'} border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all bg-white text-gray-900 placeholder-gray-400 shadow-sm hover:border-gray-400`}
                placeholder="your.email@example.com"
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
              Address / पता <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-4 pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="address"
                name="address"
                required
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
              className={`w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white ${embedded ? 'px-4 py-2.5 text-sm' : 'px-8 py-4'} rounded-lg font-bold ${embedded ? 'text-sm' : 'text-lg'} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 relative overflow-hidden group`}
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
                  <span>{embedded ? 'Submit Application' : 'Submit Application & Get Started'}</span>
                </>
              )}
              </span>
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">
              By submitting, you agree to our terms and conditions
            </p>
          </div>
        </div>
      </form>

      {!embedded && (
        <div className="mt-8 text-center text-white">
          <p className="text-lg mb-2">या सीधे हमसे संपर्क करें:</p>
          <a href="tel:9193898182" className="text-2xl font-bold hover:text-blue-200 transition">
            📞 9193898182
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
