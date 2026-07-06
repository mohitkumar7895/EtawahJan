'use client';

import { FileText, CreditCard, User, Home, Briefcase, Car, Heart, Printer, Zap, Receipt, Wallet, FileCheck, PiggyBank, Smartphone, GraduationCap, Shield, Users, Phone, Droplets, Flame, IndianRupee, FileEdit, CheckCircle, X, CheckCircle2, ChevronLeft, Scale, BookOpen, Laptop, MapPin, Banknote, Book, Scissors, FileImage, ClipboardList, PenTool } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getVacancies, type Vacancy, submitServiceApplication } from '@/lib/api';
import {
  AADHAAR_ADDRESS_CORRECTION,
} from '@/lib/etawah-only-services';

const services = [
  // Documents
  { icon: CreditCard, name: 'PAN Card', category: 'Documents' },
  { icon: FileEdit, name: AADHAAR_ADDRESS_CORRECTION, category: 'Documents', etawahOnly: true },
  { icon: User, name: 'Voter ID Card', category: 'Documents' },
  { icon: FileText, name: 'Ration Card', category: 'Documents' },
  { icon: FileEdit, name: 'Ration Card Update', category: 'Documents' },
  { icon: FileText, name: 'Passport Services', category: 'Documents' },
  { icon: Shield, name: 'E-Shram Card', category: 'Documents' },
  { icon: CheckCircle, name: 'Digital Signature Certificate', category: 'Documents' },
  
  // Certificates
  { icon: Home, name: 'Birth Certificate', category: 'Certificates' },
  { icon: FileEdit, name: 'Birth Certificate Correction', category: 'Certificates' },
  { icon: Home, name: 'Death Certificate', category: 'Certificates', etawahOnly: true },
  { icon: FileEdit, name: 'Death Certificate Correction', category: 'Certificates', etawahOnly: true },
  { icon: Users, name: 'Marriage Certificate', category: 'Certificates' },
  { icon: FileText, name: 'Income Certificate', category: 'Certificates', etawahOnly: true },
  { icon: FileText, name: 'Caste Certificate', category: 'Certificates' },
  { icon: FileText, name: 'Domicile Certificate', category: 'Certificates', etawahOnly: true },
 
  
  // Employment
  { icon: Briefcase, name: 'Employment Registration', category: 'Employment' },
  
  // Pension
  { icon: PiggyBank, name: 'Pension Services', category: 'Pension' },
  { icon: PiggyBank, name: 'Old Age Pension', category: 'Pension' },
  { icon: PiggyBank, name: 'Widow Pension', category: 'Pension' },
  { icon: PiggyBank, name: 'Disability Pension', category: 'Pension' },
  
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
  { icon: Receipt, name: 'Tax Deduction', category: 'Utility' },
  { icon: Receipt, name: 'Income Tax Filing', category: 'Utility' },
  { icon: Wallet, name: 'Withdraw/Payment Withdrawal', category: 'Utility' },
  
  // General
  { icon: Printer, name: 'Xerox & Printing', category: 'Printing' },
  { icon: FileText, name: 'Sarkari Form Online', category: 'General' },
  { icon: Receipt, name: 'Challan Jama', category: 'General' },
  
  // School Project Work Services
  { icon: Book, name: 'School Project Writing', category: 'School Services' },
  { icon: Printer, name: 'Project Printing & Binding', category: 'School Services' },
  { icon: FileImage, name: 'Project Design & Layout', category: 'School Services' },
  { icon: PenTool, name: 'Project Cover Page Design', category: 'School Services' },
  { icon: ClipboardList, name: 'Project Report Writing', category: 'School Services' },
  { icon: FileText, name: 'School Assignment Help', category: 'School Services' },
  { icon: BookOpen, name: 'Project Research Work', category: 'School Services' },
  { icon: Scissors, name: 'Project Cutting & Pasting', category: 'School Services' },
  { icon: FileText, name: 'School Certificate Printing', category: 'School Services' },
  { icon: FileText, name: 'Report Card Printing', category: 'School Services' },
  { icon: FileText, name: 'School Form Filling', category: 'School Services' },
  { icon: FileText, name: 'School Document Services', category: 'School Services' },
  
  // CSC Services - Land & Property
  { icon: MapPin, name: 'Land Records (Bhulekh)', category: 'CSC Services' },
  { icon: FileText, name: 'Property Documents', category: 'CSC Services' },
  
  // CSC Services - Banking & Financial
  { icon: Wallet, name: 'Banking Services', category: 'CSC Services', etawahOnly: true },
  { icon: Banknote, name: 'Money Transfer', category: 'CSC Services', etawahOnly: true },
  { icon: CreditCard, name: 'Aadhaar Enabled Payment', category: 'CSC Services', etawahOnly: true },
  
  // CSC Services - Education & Skills
  { icon: BookOpen, name: 'Exam Form Filling', category: 'CSC Services' },
  { icon: GraduationCap, name: 'Skill Development Courses', category: 'CSC Services' },
  { icon: Laptop, name: 'Digital Literacy', category: 'CSC Services' },
  
  // CSC Services - Legal & Court
  { icon: Scale, name: 'Court Case Status', category: 'CSC Services' },
  { icon: FileText, name: 'Legal Aid Services', category: 'CSC Services' },
  
  // IT Services - All in One
  { icon: Laptop, name: 'IT Services', category: 'IT Services' },
];

// Documents required mapping for each service
const serviceDocuments: Record<string, string[]> = {
  'PAN Card': ['Aadhaar Card', 'Proof of Identity', 'Proof of Address', 'Date of Birth Proof', 'Passport size photo'],
  'Voter ID Card': ['Proof of Identity', 'Proof of Address', 'Date of Birth Proof', 'Passport size photo'],
  'Ration Card': ['Aadhaar Card of all family members', 'Proof of Address', 'Family photo', 'Income certificate'],
  'Ration Card Update': ['Existing Ration Card', 'Aadhaar Card', 'Supporting documents for update'],
  'Passport Services': ['Aadhaar Card', 'Birth Certificate', 'Proof of Address', 'Educational certificates', 'Passport size photos'],
  'E-Shram Card': ['Aadhaar Card', 'Bank account details', 'Mobile number', 'Photo'],
  'Digital Signature Certificate': ['Aadhaar Card', 'PAN Card', 'Email ID', 'Mobile number', 'Photo'],
  [AADHAAR_ADDRESS_CORRECTION]: ['Aadhaar Card', 'New address proof', 'Old address proof (if any)', 'Passport size photo'],
  'Birth Certificate': ['Hospital discharge slip', 'Parent\'s Aadhaar Card', 'Parent\'s ID proof', 'Marriage certificate'],
  'Birth Certificate Correction': ['Existing Birth Certificate', 'Supporting document for correction', 'Aadhaar Card'],
  'Death Certificate': ['Hospital certificate', 'Aadhaar Card of deceased', 'Proof of relationship', 'ID proof of applicant'],
  'Death Certificate Correction': ['Existing Death Certificate', 'Supporting document for correction'],
  'Marriage Certificate': ['Aadhaar Card of both partners', 'Age proof', 'Address proof', 'Marriage photos', 'Witness details'],
  'Income Certificate': ['Aadhaar Card', 'Address proof', 'Bank statements', 'Salary slips or income proof'],
  'Caste Certificate': ['Aadhaar Card', 'Address proof', 'Parent\'s caste certificate', 'School leaving certificate'],
  'Domicile Certificate': ['Aadhaar Card', 'Address proof', 'Birth certificate', 'School certificates'],
  'Address Change Services': ['Existing documents', 'Aadhaar Card', 'New address proof', 'Old address proof'],
  'Employment Registration': ['Aadhaar Card', 'Educational certificates', 'Resume', 'Photo', 'Address proof'],
  'EPF Services': ['Aadhaar Card', 'PAN Card', 'Bank account details', 'Employer details', 'Photo'],
  'ESIC Registration': ['Aadhaar Card', 'PAN Card', 'Bank account details', 'Employer details', 'Photo'],
  'Pension Services': ['Aadhaar Card', 'Bank account details', 'Age proof', 'Service certificate', 'Photo'],
  'Old Age Pension': ['Aadhaar Card', 'Age proof (60+ years)', 'Bank account details', 'Income certificate', 'Address proof'],
  'Widow Pension': ['Aadhaar Card', 'Husband\'s death certificate', 'Bank account details', 'Income certificate', 'Address proof'],
  'Disability Pension': ['Aadhaar Card', 'Disability certificate', 'Bank account details', 'Income certificate', 'Medical reports'],
  'Driving License Services': ['Aadhaar Card', 'Age proof', 'Address proof', 'Medical certificate', 'Passport size photos'],
  'Vehicle Registration': ['Aadhaar Card', 'Address proof', 'Vehicle invoice', 'Insurance certificate', 'PUC certificate'],
  'Vehicle Number Plate Online': ['RC Book', 'Aadhaar Card', 'Address proof', 'Vehicle details'],
  'RC Services': ['Existing RC', 'Aadhaar Card', 'Address proof', 'Vehicle documents'],
  'Vehicle Insurance': ['RC Book', 'Aadhaar Card', 'Previous insurance (if any)', 'Vehicle details'],
  'Vehicle Transfer': ['RC Book', 'Aadhaar Card of buyer and seller', 'Sale deed', 'NOC', 'Insurance'],
  'Health Insurance': ['Aadhaar Card', 'Age proof', 'Medical history', 'Bank account details', 'Photo'],
  'Ayushman Bharat Card': ['Aadhaar Card', 'Ration Card or Income certificate', 'Family details', 'Mobile number', 'Photo'],
  'Life Insurance': ['Aadhaar Card', 'Age proof', 'Medical certificate', 'Bank account details', 'Photo'],
  'PM Awas Yojana': ['Aadhaar Card', 'Income certificate', 'Address proof', 'Bank account details', 'Family details'],
  'Ujjwala Yojana': ['Aadhaar Card', 'BPL card or Income certificate', 'Bank account details', 'Address proof', 'Photo'],
  'PM Kisan Registration': ['Aadhaar Card', 'Bank account details', 'Land documents', 'Mobile number'],
  'Kisan Credit Card': ['Aadhaar Card', 'Land documents', 'Bank account details', 'Income certificate', 'Photo'],
  'PM Mudra Loan': ['Aadhaar Card', 'Business proof', 'Bank account details', 'Income certificate', 'Business plan'],
  'Scholarship Applications': ['Aadhaar Card', 'Educational certificates', 'Income certificate', 'Caste certificate (if applicable)', 'Bank account details'],
  'Bill Payment': ['Aadhaar Card', 'Bill copy', 'Mobile number'],
  'Light Connection (Jhatpat Online)': ['Aadhaar Card', 'Address proof', 'Identity proof', 'Bank account details'],
  'Water Connection': ['Aadhaar Card', 'Address proof', 'Property documents', 'Bank account details'],
  'Mobile Recharge': ['Mobile number', 'Payment method'],
  'DTH Recharge': ['DTH connection details', 'Payment method'],
  'Tax Deduction': ['PAN Card', 'Aadhaar Card', 'Income proof', 'Bank statements'],
  'Income Tax Filing': ['PAN Card', 'Aadhaar Card', 'Form 16', 'Bank statements', 'Investment proofs'],
  'Withdraw/Payment Withdrawal': ['Aadhaar Card', 'Bank account details', 'Identity proof'],
  'Xerox & Printing': ['Original documents', 'Payment'],
  'Sarkari Form Online': ['Aadhaar Card', 'Relevant documents', 'Photo', 'Required certificates'],
  'Challan Jama': ['Challan number', 'Aadhaar Card', 'Payment method', 'Relevant documents'],
  'School Project Writing': ['Project topic', 'Project requirements', 'Content/material', 'Payment'],
  'Project Printing & Binding': ['Project file/content', 'Printing requirements', 'Binding preference', 'Payment'],
  'Project Design & Layout': ['Project content', 'Design requirements', 'Images/photos', 'Payment'],
  'Project Cover Page Design': ['Project details', 'School name', 'Student name', 'Class/Subject', 'Payment'],
  'Project Report Writing': ['Project topic', 'Research material', 'Requirements', 'Payment'],
  'School Assignment Help': ['Assignment details', 'Subject', 'Requirements', 'Payment'],
  'Project Research Work': ['Project topic', 'Research requirements', 'Payment'],
  'Project Cutting & Pasting': ['Project materials', 'Craft items', 'Payment'],
  'School Certificate Printing': ['Certificate details', 'Student information', 'Payment'],
  'Report Card Printing': ['Report card data', 'Student details', 'Payment'],
  'School Form Filling': ['Aadhaar Card', 'School documents', 'Student details', 'Photo'],
  'School Document Services': ['Aadhaar Card', 'Relevant school documents', 'Payment'],
  'Land Records (Bhulekh)': ['Aadhaar Card', 'Property details', 'Khasra/Khatauni number'],
  'Property Documents': ['Aadhaar Card', 'Property details', 'Previous documents'],
  'Banking Services': ['Aadhaar Card', 'Bank account details', 'Identity proof'],
  'Money Transfer': ['Aadhaar Card', 'Beneficiary details', 'Payment method'],
  'Aadhaar Enabled Payment': ['Aadhaar Card', 'Bank account linked with Aadhaar', 'Biometric verification'],
  'Exam Form Filling': ['Aadhaar Card', 'Educational certificates', 'Photo', 'Payment'],
  'Skill Development Courses': ['Aadhaar Card', 'Educational certificates', 'Photo'],
  'Digital Literacy': ['Aadhaar Card', 'Photo', 'Basic information'],
  'Court Case Status': ['Case number', 'Court details', 'Aadhaar Card'],
  'Legal Aid Services': ['Aadhaar Card', 'Case details', 'Supporting documents'],
  'IT Services': [
    'Website Development - Business details, Requirements, Content/material',
    'Software Development - Project requirements, Business details, Technical specifications',
    'Mobile App Development - App requirements, Features list, Platform (Android/iOS)',
    'Graphic Design - Design requirements, Content/text, Images/photos',
    'Post Design - Post content, Design requirements, Images/photos',
    'Banner Design - Banner content, Size specifications, Design requirements',
    'Logo Design - Company/business name, Design preferences, Color scheme',
    'Payment method'
  ],
};

type Service = {
  icon: any;
  name: string;
  category: string;
};

const VACANCIES_REFRESH_MS = 5 * 60 * 1000;

export default function Services() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    service_type: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    }, VACANCIES_REFRESH_MS);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = () => {
      loadVacancies();
    };

    window.addEventListener('janseva:vacancies:updated', handler as EventListener);
    return () => window.removeEventListener('janseva:vacancies:updated', handler as EventListener);
  }, []);

  const handleServiceClick = (service: Service) => {
    console.log('Service clicked:', service.name);
    setSelectedService(service);
    setIsModalOpen(true);
    setShowForm(false);
    setSubmitSuccess(false);
    setFormData({ name: '', mobile: '', address: '', service_type: '' });
    // Prevent body scroll when modal is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    setShowForm(false);
    setSubmitSuccess(false);
    setFormData({ name: '', mobile: '', address: '', service_type: '' });
    // Restore body scroll
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'unset';
    }
  };

  const handleApplyForService = () => {
    setShowForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate before submission
    if (!formData.name.trim()) {
      alert('कृपया अपना नाम दर्ज करें / Please enter your name');
      setIsSubmitting(false);
      return;
    }
    if (!formData.mobile.trim() || formData.mobile.trim().length !== 10) {
      alert('कृपया 10 अंकों का मोबाइल नंबर दर्ज करें / Please enter 10 digit mobile number');
      setIsSubmitting(false);
      return;
    }
    if (!formData.address.trim()) {
      alert('कृपया अपना पता दर्ज करें / Please enter your address');
      setIsSubmitting(false);
      return;
    }
    if (!selectedService?.name) {
      alert('Service not selected');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Prepare form data - API expects: name, mobile, address, service_type, email (optional)
      const submissionData = {
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        address: formData.address.trim(),
        service_type: selectedService.name,
        email: '' // Optional but API expects it
      };
      
      console.log('🔥 ==========================================');
      console.log('📤 SUBMITTING SERVICE APPLICATION');
      console.log('📤 Data:', JSON.stringify(submissionData, null, 2));
      console.log('🔥 ==========================================');
      
      // Call API
      const response = await submitServiceApplication(submissionData);
      
      console.log('✅ ==========================================');
      console.log('✅ API RESPONSE RECEIVED');
      console.log('✅ Response:', JSON.stringify(response, null, 2));
      console.log('✅ ==========================================');
      
      // Check response
      if (response && response.success !== false) {
        console.log('📧 Email Status:', response.emailStatus || 'Email sent');
        setSubmitSuccess(true);
        setTimeout(() => {
          handleCloseModal();
        }, 3000);
      } else {
        console.warn('⚠️ Email may have failed:', response);
        // Still show success but log warning
        setSubmitSuccess(true);
        setTimeout(() => {
          handleCloseModal();
        }, 3000);
      }
    } catch (err: any) {
      console.error('❌ ==========================================');
      console.error('❌ FORM SUBMISSION ERROR');
      console.error('❌ Error:', err);
      console.error('❌ Error Message:', err?.message);
      console.error('❌ Error Stack:', err?.stack);
      console.error('❌ ==========================================');
      
      alert(`Error: ${err?.message || 'Form submission failed'}\n\nकृपया पुनः प्रयास करें / Please try again.\n\nCheck browser console for details.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDocumentsForService = (serviceName: string): string[] => {
    const docs = serviceDocuments[serviceName];
    console.log('Service Name:', serviceName, 'Documents:', docs);
    return docs || ['Aadhaar Card', 'Address Proof', 'Photo', 'Relevant supporting documents'];
  };

  return (
    <section id="services" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Our Services</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600">हमारी सेवाएं - All Services Under One Roof</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {/* Show only first 12 services on home page */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {services.slice(0, 12).map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={index}
                    onClick={() => handleServiceClick(service)}
                    className="bg-gradient-to-br from-blue-50 to-white p-4 sm:p-5 md:p-6 rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-lg transition transform hover:scale-105 cursor-pointer"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-blue-100 p-2 sm:p-3 rounded-full mb-3 sm:mb-4">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base leading-tight">
                        {service.name}
                        {'etawahOnly' in service && service.etawahOnly && (
                          <span className="ml-1.5 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 align-middle">
                            Etawah only
                          </span>
                        )}
                      </h3>
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {service.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View All Button - Prominently displayed */}
            <div className="mt-6 sm:mt-8 text-center">
              <Link 
                href="/services" 
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
              >
                <span>View All Services</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            <div className="mt-8 sm:mt-10 md:mt-12 bg-blue-50 rounded-lg p-6 sm:p-7 md:p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">और भी बहुत कुछ!</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-4">
                किसी भी प्रकार की सरकारी या निजी सेवा के लिए हमसे संपर्क करें।
                हम आपकी पूरी सहायता करने के लिए तैयार हैं।
              </p>
            </div>
          </div>

          {/* Vacancy / Sarkari Results sidebar */}
          <aside className="lg:col-span-1 mt-6 lg:mt-0">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl sm:rounded-2xl shadow-lg border-l-4 sm:border-l-8 border-blue-600 p-0 lg:sticky lg:top-24">
              <div className="flex items-center gap-2 px-4 sm:px-5 md:px-6 py-3 sm:py-4 bg-blue-600 rounded-t-xl sm:rounded-t-2xl">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 17v1a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h6a3 3 0 013 3v1m4 0h-8m8 0v10a2 2 0 01-2 2h-8a2 2 0 01-2-2V7a2 2 0 012-2h8a2 2 0 012 2z" /></svg>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">Vacancies & Results</h3>
              </div>

              <ul className="space-y-3 sm:space-y-4 px-3 sm:px-4 py-3 sm:py-4 text-sm">
                {vacancies.slice(0, 3).map((v, idx) => (
                  <li key={v.id || v._id || idx} className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition flex flex-col gap-2">
                    <div className="flex items-start sm:items-center justify-between gap-2">
                      <h4 className="font-semibold text-blue-900 text-sm sm:text-base leading-tight flex-1 min-w-0">{v.title || 'Untitled vacancy'}</h4>
                      <span
                        className={
                          'text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border flex-shrink-0 ' +
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
                    {v.info && <p className="text-gray-700 text-xs sm:text-sm mb-1 line-clamp-2">{v.info}</p>}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-600">
                      {v.vacancies !== undefined && (
                        <span className="inline-flex items-center gap-1"><svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4V7a4 4 0 00-8 0v5m8 0a4 4 0 01-8 0m8 0v5a4 4 0 01-8 0v-5" /></svg>Vacancies: <strong className="text-gray-800">{v.vacancies}</strong></span>
                      )}
                      {v.date && (
                        <span className="inline-flex items-center gap-1"><svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>Date: <strong className="text-gray-800">{v.date}</strong></span>
                      )}
                      {v.lastDate && (
                        <span className="inline-flex items-center gap-1"><svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Last: <strong className="text-gray-800">{v.lastDate}</strong></span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {v.link ? (
                        <a
                          href={v.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs px-2 sm:px-3 py-1 rounded hover:bg-blue-700 transition"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7v7m0 0L10 21l-7-7 11-11z" /></svg>
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
                <div className="mt-3 sm:mt-4 text-center pb-2 px-3 sm:px-4">
                  <Link 
                    href="/vacancies" 
                    className="inline-block bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm hover:bg-blue-700 transition"
                  >
                    View all ({vacancies.length})
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Service Details Modal */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-3 sm:p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col relative z-[10000]" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6 rounded-t-xl flex items-center justify-between gap-2 sm:gap-4 flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                {selectedService.icon && (
                  <div className="bg-white/20 p-2 sm:p-3 rounded-full flex-shrink-0">
                    <selectedService.icon className="w-5 h-5 sm:w-8 sm:h-8" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">{selectedService.name}</h2>
                  <p className="text-blue-100 text-xs sm:text-sm">{selectedService.category}</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="bg-white/20 hover:bg-white/30 rounded-full p-1.5 sm:p-2 transition flex-shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              {!showForm ? (
                <>
                  {/* Required Documents Section */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                      <span className="text-sm sm:text-base">आवश्यक दस्तावेज (Required Documents)</span>
                    </h3>
                    <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                      <ul className="space-y-2">
                        {getDocumentsForService(selectedService.name).map((doc, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <button
                      onClick={handleApplyForService}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Apply for Service</span>
                    </button>
                    <button
                      onClick={handleCloseModal}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {submitSuccess ? (
                    <div className="text-center py-6 sm:py-8">
                      <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-3 sm:mb-4" />
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">
                        हमारी टीम जल्द ही आपसे संपर्क करेगी।
                      </p>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Our team will contact you soon.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Back to Documents Button */}
                      <div className="mb-3 sm:mb-4">
                        <button
                          onClick={() => setShowForm(false)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm sm:text-base font-medium transition"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Back to Documents</span>
                        </button>
                      </div>

                      <div className="mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">Apply for {selectedService.name}</h3>
                        <p className="text-gray-600 text-sm sm:text-base">कृपया अपनी जानकारी भरें (Please fill in your details)</p>
                      </div>

                      <form onSubmit={handleFormSubmit} className="space-y-3 sm:space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            नाम / Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            autoComplete="name"
                            className="w-full px-3 py-2.5 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all touch-manipulation"
                            placeholder="Enter your name"
                          />
                        </div>

                        <div>
                          <label htmlFor="mobile" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            मोबाइल नंबर / Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            id="mobile"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            required
                            pattern="[0-9]{10}"
                            maxLength={10}
                            inputMode="numeric"
                            autoComplete="tel"
                            className="w-full px-3 py-2.5 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all touch-manipulation"
                            placeholder="Enter 10 digit mobile number"
                          />
                        </div>

                        <div>
                          <label htmlFor="address" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            पता / Address <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            autoComplete="street-address"
                            className="w-full px-3 py-2.5 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all touch-manipulation"
                            placeholder="Enter your complete address"
                          />
                        </div>

                        <div className="bg-blue-50 rounded-lg p-2.5 sm:p-4 mb-3 sm:mb-4 border border-blue-100">
                          <p className="text-xs text-gray-700 font-medium mb-0.5">
                            <strong>Service:</strong> {selectedService.name}
                          </p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            कृपया सुनिश्चित करें कि आपके पास सभी आवश्यक दस्तावेज हैं।
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-1">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px] touch-manipulation"
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span className="text-sm">Submitting...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-sm">Submit Application</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 active:scale-95 transition-all text-sm sm:text-base min-h-[44px] touch-manipulation"
                          >
                            Back
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}







