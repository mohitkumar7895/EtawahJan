'use client';

import { FileText, CreditCard, User, Home, Briefcase, Car, Heart, Printer, Zap, Receipt, Wallet, FileCheck, PiggyBank, Smartphone, Building2, GraduationCap, Shield, Users, Phone, Droplets, Flame, IndianRupee, FileEdit, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getVacancies, type Vacancy } from '@/lib/api';

const services = [
  // Documents
  { icon: FileText, name: 'Aadhaar Card', category: 'Documents' },
  { icon: CreditCard, name: 'Bank Account Linking', category: 'Documents' },
  { icon: CreditCard, name: 'PAN Card', category: 'Documents' },
  { icon: User, name: 'Voter ID Card', category: 'Documents' },
  { icon: FileText, name: 'Ration Card', category: 'Documents' },
  { icon: FileEdit, name: 'Ration Card Update', category: 'Documents' },
  { icon: FileText, name: 'Passport Services', category: 'Documents' },
  { icon: Shield, name: 'E-Shram Card', category: 'Documents' },
  { icon: CheckCircle, name: 'Digital Signature Certificate', category: 'Documents' },
  
  // Certificates
  { icon: Home, name: 'Birth Certificate', category: 'Certificates' },
  { icon: FileEdit, name: 'Birth Certificate Correction', category: 'Certificates' },
  { icon: Home, name: 'Death Certificate', category: 'Certificates' },
  { icon: FileEdit, name: 'Death Certificate Correction', category: 'Certificates' },
  { icon: Users, name: 'Marriage Certificate', category: 'Certificates' },
  { icon: FileText, name: 'Income Certificate', category: 'Certificates' },
  { icon: FileText, name: 'Caste Certificate', category: 'Certificates' },
  { icon: FileText, name: 'Domicile Certificate', category: 'Certificates' },
 
  
  // Employment
  { icon: Briefcase, name: 'Employment Registration', category: 'Employment' },
  
  // Pension
  { icon: PiggyBank, name: 'Pension Services', category: 'Pension' },
  { icon: PiggyBank, name: 'Old Age Pension', category: 'Pension' },
  { icon: PiggyBank, name: 'Widow Pension', category: 'Pension' },
  { icon: PiggyBank, name: 'Disability Pension', category: 'Pension' },
  { icon: CheckCircle, name: 'Jeevan Pramaan (Digital Life Certificate)', category: 'Pension' },
  
  // Transport
  { icon: Car, name: 'Driving License Services', category: 'Transport' },
  { icon: Car, name: 'Vehicle Registration', category: 'Transport' },
  { icon: Car, name: 'Vehicle Number Plate Online', category: 'Transport' },
  { icon: FileCheck, name: 'RC Services', category: 'Transport' },
  { icon: FileCheck, name: 'Vehicle Insurance', category: 'Transport' },
  { icon: FileCheck, name: 'Vehicle Transfer', category: 'Transport' },
  
  // Insurance
  { icon: Heart, name: 'Health Insurance', category: 'Insurance' },
  { icon: Shield, name: 'Ayushman Bharat Card', category: 'Insurance' },
  { icon: Shield, name: 'PMJAY Card', category: 'Insurance' },
  { icon: Briefcase, name: 'Life Insurance', category: 'Insurance' },
  
  // Government Schemes
  { icon: Home, name: 'PM Awas Yojana', category: 'Schemes' },
  { icon: Flame, name: 'Ujjwala Yojana', category: 'Schemes' },
  { icon: IndianRupee, name: 'PM Kisan Registration', category: 'Schemes' },
  { icon: CreditCard, name: 'Kisan Credit Card', category: 'Schemes' },
  { icon: IndianRupee, name: 'PM Mudra Loan', category: 'Schemes' },
  { icon: GraduationCap, name: 'Scholarship Applications', category: 'Schemes' },
  
  // Utility
  { icon: CreditCard, name: 'Bill Payment', category: 'Utility' },
  { icon: Zap, name: 'Light Connection (Jhatpat Online)', category: 'Utility' },
  { icon: Droplets, name: 'Water Connection', category: 'Utility' },
  { icon: Phone, name: 'Mobile Recharge', category: 'Utility' },
  { icon: Smartphone, name: 'DTH Recharge', category: 'Utility' },
  { icon: Flame, name: 'Gas Booking', category: 'Utility' },
  { icon: Receipt, name: 'Tax Deduction', category: 'Utility' },
  { icon: Receipt, name: 'Income Tax Filing', category: 'Utility' },
  { icon: Wallet, name: 'Withdraw/Payment Withdrawal', category: 'Utility' },
  
  // Business
  { icon: FileText, name: 'GST Registration', category: 'Business' },
  { icon: Building2, name: 'Company Registration', category: 'Business' },
  
  // Legal
  { icon: FileText, name: 'Legal Documentation', category: 'Legal' },
  { icon: FileText, name: 'Affidavit Services', category: 'Legal' },
  
  // General
  { icon: Printer, name: 'Xerox & Printing', category: 'Printing' },
  { icon: FileText, name: 'Form Filling Services', category: 'General' },
];

export default function Services() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

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

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600">हमारी सेवाएं - All Services Under One Roof</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-lg transition transform hover:scale-105"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-blue-100 p-3 rounded-full mb-4">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {service.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">और भी बहुत कुछ!</h3>
              <p className="text-gray-700 mb-4">
                किसी भी प्रकार की सरकारी या निजी सेवा के लिए हमसे संपर्क करें।
                हम आपकी पूरी सहायता करने के लिए तैयार हैं।
              </p>
              <Link 
                href="/services" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
              >
                View All Services →
              </Link>
            </div>
          </div>

          {/* Vacancy / Sarkari Results sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg border-l-8 border-blue-600 p-0 sticky top-24">
              <div className="flex items-center gap-2 px-6 py-4 bg-blue-600 rounded-t-2xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 17v1a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h6a3 3 0 013 3v1m4 0h-8m8 0v10a2 2 0 01-2 2h-8a2 2 0 01-2-2V7a2 2 0 012-2h8a2 2 0 012 2z" /></svg>
                <h3 className="text-lg font-bold text-white tracking-wide">Vacancies & Results</h3>
              </div>

              <ul className="space-y-4 px-4 py-4 text-sm">
                {vacancies.slice(0, 3).map((v, idx) => (
                  <li key={v.id || v._id || idx} className="p-4 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-blue-900 truncate text-base">{v.title || 'Untitled vacancy'}</h4>
                      <span
                        className={
                          'text-xs font-semibold px-2 py-1 rounded-full border ' +
                          (v.tag?.toLowerCase().includes('result')
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : v.tag?.toLowerCase().includes('admit')
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : v.tag?.toLowerCase().includes('notification')
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200')
                        }
                      >
                        {v.tag || 'Info'}
                      </span>
                    </div>
                    {v.info && <p className="text-gray-700 text-sm mb-1">{v.info}</p>}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                      {v.vacancies !== undefined && (
                        <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4V7a4 4 0 00-8 0v5m8 0a4 4 0 01-8 0m8 0v5a4 4 0 01-8 0v-5" /></svg>Vacancies: <strong className="text-gray-800">{v.vacancies}</strong></span>
                      )}
                      {v.date && (
                        <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>Date: <strong className="text-gray-800">{v.date}</strong></span>
                      )}
                      {v.lastDate && (
                        <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Last: <strong className="text-gray-800">{v.lastDate}</strong></span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {v.link ? (
                        <a
                          href={v.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7v7m0 0L10 21l-7-7 11-11z" /></svg>
                          View
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No link</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {vacancies.length > 3 && (
                <div className="mt-4 text-center pb-2">
                  <Link 
                    href="/vacancies" 
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
                  >
                    View all ({vacancies.length})
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}


