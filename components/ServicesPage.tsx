'use client';

import { FileText, CreditCard, User, Home, Briefcase, Car, Heart, Printer, Building2, FileCheck, ShieldCheck, Zap, Receipt, Wallet, PiggyBank, Smartphone, GraduationCap, Shield, Users, Phone, Droplets, Flame, IndianRupee, FileEdit, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getVacancies } from '@/lib/api';

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
  { icon: FileEdit, name: 'Aadhaar Update/Correction', category: 'Documents', description: 'Aadhaar details update, correction, and biometric update' },
  { icon: Smartphone, name: 'Mobile Number Linking', category: 'Documents', description: 'Link mobile number with Aadhaar and other documents' },
  { icon: CreditCard, name: 'Bank Account Linking', category: 'Documents', description: 'Link bank account with Aadhaar and other services' },
  { icon: CreditCard, name: 'PAN Card', category: 'Documents', description: 'PAN card application and correction services' },
  { icon: User, name: 'Voter ID Card', category: 'Documents', description: 'Voter ID card application and update services' },
  { icon: FileText, name: 'Ration Card', category: 'Documents', description: 'Ration card application and family member addition' },
  { icon: FileEdit, name: 'Ration Card Update', category: 'Documents', description: 'Ration card update, correction, and family member modification' },
  { icon: FileText, name: 'Passport Services', category: 'Documents', description: 'Passport application and renewal services' },
  { icon: Shield, name: 'E-Shram Card', category: 'Documents', description: 'E-Shram card registration for unorganized workers' },
  { icon: CheckCircle, name: 'Digital Signature Certificate', category: 'Documents', description: 'Digital signature certificate application and renewal' },
  
  // Certificates
  { icon: Home, name: 'Birth Certificate', category: 'Certificates', description: 'Birth certificate application and correction' },
  { icon: FileEdit, name: 'Birth Certificate Correction', category: 'Certificates', description: 'Birth certificate correction and update services' },
  { icon: Home, name: 'Death Certificate', category: 'Certificates', description: 'Death certificate application services' },
  { icon: FileEdit, name: 'Death Certificate Correction', category: 'Certificates', description: 'Death certificate correction and update' },
  { icon: Users, name: 'Marriage Certificate', category: 'Certificates', description: 'Marriage certificate application and registration' },
  { icon: FileText, name: 'Income Certificate', category: 'Certificates', description: 'Income certificate for various purposes' },
  { icon: FileText, name: 'Caste Certificate', category: 'Certificates', description: 'Caste certificate application and verification' },
  { icon: FileText, name: 'Domicile Certificate', category: 'Certificates', description: 'Domicile certificate application' },
  { icon: FileEdit, name: 'Name Change Services', category: 'Certificates', description: 'Name change in certificates and documents' },
  { icon: FileEdit, name: 'Address Change Services', category: 'Certificates', description: 'Address change in certificates and documents' },
  
  // Employment
  { icon: Briefcase, name: 'Employment Registration', category: 'Employment', description: 'Job registration and employment services' },
  { icon: Briefcase, name: 'EPF Services', category: 'Employment', description: 'EPF account opening and services' },
  { icon: Briefcase, name: 'ESIC Registration', category: 'Employment', description: 'ESIC registration and card services' },
  
  // Pension
  { icon: PiggyBank, name: 'Pension Services', category: 'Pension', description: 'Pension application, registration, and related services' },
  { icon: PiggyBank, name: 'Old Age Pension', category: 'Pension', description: 'Old age pension application and services' },
  { icon: PiggyBank, name: 'Widow Pension', category: 'Pension', description: 'Widow pension application and services' },
  { icon: PiggyBank, name: 'Disability Pension', category: 'Pension', description: 'Disability pension application and services' },
  { icon: CheckCircle, name: 'Jeevan Pramaan (Digital Life Certificate)', category: 'Pension', description: 'Digital life certificate for pensioners' },
  
  // Transport
  { icon: Car, name: 'Driving License Services', category: 'Transport', description: 'Driving license application, renewal, and related services' },
  { icon: Car, name: 'Vehicle Registration', category: 'Transport', description: 'Vehicle registration and RC services' },
  { icon: Car, name: 'Vehicle Number Plate Online', category: 'Transport', description: 'Online vehicle number plate application and services' },
  { icon: FileCheck, name: 'RC Services', category: 'Transport', description: 'RC card services, duplicate, and correction' },
  { icon: FileCheck, name: 'Vehicle Insurance', category: 'Transport', description: 'Vehicle insurance application and renewal' },
  { icon: FileCheck, name: 'Vehicle Transfer', category: 'Transport', description: 'Vehicle ownership transfer services' },
  
  // Insurance
  { icon: Heart, name: 'Health Insurance', category: 'Insurance', description: 'Health insurance application and claim assistance' },
  { icon: Shield, name: 'Ayushman Bharat Card', category: 'Insurance', description: 'Ayushman Bharat health insurance card application' },
  { icon: Shield, name: 'PMJAY Card', category: 'Insurance', description: 'PM Jan Arogya Yojana card application and services' },
  { icon: Briefcase, name: 'Life Insurance', category: 'Insurance', description: 'Life insurance policies and services' },
  { icon: ShieldCheck, name: 'Crop Insurance', category: 'Insurance', description: 'Crop insurance application and claim' },
  
  // Government Schemes
  { icon: Home, name: 'PM Awas Yojana', category: 'Schemes', description: 'Pradhan Mantri Awas Yojana housing scheme application' },
  { icon: Flame, name: 'Ujjwala Yojana', category: 'Schemes', description: 'Ujjwala gas connection scheme application' },
  { icon: IndianRupee, name: 'PM Kisan Registration', category: 'Schemes', description: 'PM Kisan Samman Nidhi registration and update' },
  { icon: CreditCard, name: 'Kisan Credit Card', category: 'Schemes', description: 'Kisan Credit Card application and services' },
  { icon: IndianRupee, name: 'PM Mudra Loan', category: 'Schemes', description: 'PM Mudra loan application and services' },
  { icon: GraduationCap, name: 'Scholarship Applications', category: 'Schemes', description: 'Various scholarship application assistance' },
  
  // Utility
  { icon: CreditCard, name: 'Bill Payment', category: 'Utility', description: 'Electricity, water, and other bill payments' },
  { icon: Zap, name: 'Light Connection (Jhatpat Online)', category: 'Utility', description: 'Quick electricity connection application online' },
  { icon: Droplets, name: 'Water Connection', category: 'Utility', description: 'Water connection application and services' },
  { icon: Phone, name: 'Mobile Recharge', category: 'Utility', description: 'Mobile recharge and top-up services' },
  { icon: Smartphone, name: 'DTH Recharge', category: 'Utility', description: 'DTH recharge and subscription services' },
  { icon: Flame, name: 'Gas Booking', category: 'Utility', description: 'LPG gas cylinder booking services' },
  { icon: Receipt, name: 'Tax Deduction', category: 'Utility', description: 'Tax deduction certificate and related services' },
  { icon: Receipt, name: 'Income Tax Filing', category: 'Utility', description: 'Income tax return filing assistance' },
  { icon: Wallet, name: 'Withdraw/Payment Withdrawal', category: 'Utility', description: 'Payment withdrawal and transaction services' },
  
  // Business
  { icon: FileText, name: 'GST Registration', category: 'Business', description: 'GST registration and filing services' },
  { icon: Building2, name: 'Company Registration', category: 'Business', description: 'Company and firm registration' },
  
  // Legal
  { icon: FileText, name: 'Legal Documentation', category: 'Legal', description: 'Legal document preparation and attestation' },
  { icon: FileText, name: 'Affidavit Services', category: 'Legal', description: 'Affidavit preparation and attestation' },
  
  // General
  { icon: Printer, name: 'Xerox & Printing', category: 'Printing', description: 'Photocopy and printing services' },
  { icon: FileText, name: 'Form Filling Services', category: 'General', description: 'Form filling assistance for all services' },
];

export default function ServicesPageComponent() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const loadVacancies = async () => {
    try {
      const data = await getVacancies();
      setVacancies(data);
    } catch (error) {
      console.error('Failed to load vacancies:', error);
      setVacancies([]);
    }
  };

  useEffect(() => {
    loadVacancies();
    
    const interval = setInterval(() => {
      loadVacancies();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = () => {
      loadVacancies();
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



