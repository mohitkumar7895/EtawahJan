import { FileText, CreditCard, User, Home, Briefcase, Car, GraduationCap, Heart, Landmark, Printer, Building2, Scale, BookOpen, FileCheck, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Vacancy = {
  id?: string;
  title: string;
  tag: string;
  info?: string;
  link?: string;
  date?: string;
  vacancies?: number;
  lastDate?: string;
};

const services = [
  // Documents
  { icon: FileText, name: 'Aadhaar Card', category: 'Documents', description: 'Aadhaar card enrollment, update, and correction services' },
  { icon: CreditCard, name: 'PAN Card', category: 'Documents', description: 'PAN card application and correction services' },
  { icon: User, name: 'Voter ID Card', category: 'Documents', description: 'Voter ID card application and update services' },
  { icon: FileText, name: 'Ration Card', category: 'Documents', description: 'Ration card application and family member addition' },
  { icon: FileText, name: 'Driving License', category: 'Documents', description: 'Driving license application and renewal' },
  { icon: FileText, name: 'Passport Services', category: 'Documents', description: 'Passport application and renewal services' },
  
  // Certificates
  { icon: Home, name: 'Birth Certificate', category: 'Certificates', description: 'Birth certificate application and correction' },
  { icon: Home, name: 'Death Certificate', category: 'Certificates', description: 'Death certificate application services' },
  { icon: FileText, name: 'Income Certificate', category: 'Certificates', description: 'Income certificate for various purposes' },
  { icon: FileText, name: 'Caste Certificate', category: 'Certificates', description: 'Caste certificate application and verification' },
  { icon: FileText, name: 'Domicile Certificate', category: 'Certificates', description: 'Domicile certificate application' },
  { icon: FileCheck, name: 'Character Certificate', category: 'Certificates', description: 'Character certificate for employment and education' },
  
  // Employment
  { icon: Briefcase, name: 'Employment Registration', category: 'Employment', description: 'Job registration and employment services' },
  { icon: Briefcase, name: 'EPF Services', category: 'Employment', description: 'EPF account opening and services' },
  { icon: Briefcase, name: 'ESIC Registration', category: 'Employment', description: 'ESIC registration and card services' },
  
  // Education
  { icon: GraduationCap, name: 'Education Verification', category: 'Education', description: 'Educational certificate verification' },
  { icon: BookOpen, name: 'Scholarship Application', category: 'Education', description: 'Various scholarship application assistance' },
  
  // Transport
  { icon: Car, name: 'Vehicle Registration', category: 'Transport', description: 'Vehicle registration and RC services' },
  { icon: Car, name: 'Vehicle Insurance', category: 'Transport', description: 'Vehicle insurance application and renewal' },
  
  // Property
  { icon: Landmark, name: 'Property Registration', category: 'Property', description: 'Property registration and document services' },
  { icon: Landmark, name: 'Mutation Services', category: 'Property', description: 'Property mutation and transfer services' },
  
  // Insurance
  { icon: Heart, name: 'Health Insurance', category: 'Insurance', description: 'Health insurance application and claim assistance' },
  { icon: Briefcase, name: 'Life Insurance', category: 'Insurance', description: 'Life insurance policies and services' },
  { icon: ShieldCheck, name: 'Crop Insurance', category: 'Insurance', description: 'Crop insurance application and claim' },
  
  // Banking
  { icon: CreditCard, name: 'Bank Account Opening', category: 'Banking', description: 'Bank account opening assistance' },
  { icon: FileText, name: 'Loan Applications', category: 'Banking', description: 'Loan application assistance for various schemes' },
  { icon: CreditCard, name: 'ATM Card Services', category: 'Banking', description: 'ATM card application and blocking' },
  
  // Business
  { icon: FileText, name: 'GST Registration', category: 'Business', description: 'GST registration and filing services' },
  { icon: Building2, name: 'Company Registration', category: 'Business', description: 'Company and firm registration' },
  { icon: FileText, name: 'Trade License', category: 'Business', description: 'Trade license application and renewal' },
  
  // Legal
  { icon: Scale, name: 'Legal Documentation', category: 'Legal', description: 'Legal document preparation and attestation' },
  { icon: Scale, name: 'Affidavit Services', category: 'Legal', description: 'Affidavit preparation and attestation' },
  
  // Utility
  { icon: CreditCard, name: 'Bill Payment', category: 'Utility', description: 'Electricity, water, and other bill payments' },
  { icon: Printer, name: 'Xerox & Printing', category: 'Printing', description: 'Photocopy and printing services' },
  { icon: FileText, name: 'Form Filling Services', category: 'General', description: 'Form filling assistance for all services' },
];

export default function ServicesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('janseva_vacancies');
      if (raw) {
        setVacancies(JSON.parse(raw));
        return;
      }
    } catch {
      // ignore parse errors
    }

    // fallback defaults
    setVacancies([
      { title: 'UPPSC Inspector 2025', tag: 'Result', info: '120 Vacancies • Declared: 02 Nov 2025' },
      { title: 'SSC CHSL 2025', tag: 'Result', info: '340 Vacancies • Declared: 28 Oct 2025' },
      { title: 'AIIMS Nursing 2025', tag: 'Admit Card', info: 'Vacancies: 210 • Exam: 15 Nov 2025' },
      { title: 'Railway JE 2025', tag: 'Notification', info: 'Vacancies: 560 • Apply by: 20 Nov 2025' },
    ]);
  }, []);

  // listen for vacancy updates from admin UI
  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem('janseva_vacancies');
        if (raw) setVacancies(JSON.parse(raw));
      } catch {
        // ignore
      }
    };

    window.addEventListener('janseva:vacancies:updated', handler as EventListener);
    return () => window.removeEventListener('janseva:vacancies:updated', handler as EventListener);
  }, []);

  const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];
  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Services</h1>
            <p className="text-xl text-gray-600">हमारी सेवाएं - All Government & Private Services Under One Roof</p>
          </div>

          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
            {filteredServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-lg transition transform hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-blue-100 p-4 rounded-full mb-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">{service.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 min-h-[40px]">{service.description}</p>
                    <span className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium">
                      {service.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-8 text-white text-center">
            <h3 className="text-3xl font-bold mb-4">और भी बहुत कुछ!</h3>
            <p className="text-lg text-blue-100 mb-6">
              किसी भी प्रकार की सरकारी या निजी सेवा के लिए हमसे संपर्क करें।
              हम आपकी पूरी सहायता करने के लिए तैयार हैं।
            </p>
            <p className="text-lg text-blue-100">
              For any type of government or private service, please contact us. We are ready to assist you completely.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

