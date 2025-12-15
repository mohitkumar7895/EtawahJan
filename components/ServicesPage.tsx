'use client';

import { FileText, CreditCard, User, Home, Briefcase, Car, Heart, Printer, FileCheck, Zap, Receipt, Wallet, PiggyBank, Smartphone, GraduationCap, Shield, Users, Phone, Droplets, Flame, IndianRupee, FileEdit, CheckCircle, X, CheckCircle2, ChevronLeft, Scale, BookOpen, Laptop, MapPin, Banknote, Book, Scissors, FileImage, ClipboardList, PenTool, Globe, Code, Palette, Image, Layout, Monitor, Video, Instagram, Camera, Film, Music, Youtube, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getVacancies, submitServiceApplication } from '@/lib/api';

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
  { icon: FileEdit, name: 'Address Change Services', category: 'Certificates', description: 'Address change in certificates and documents' },
  
  // Employment
  { icon: Briefcase, name: 'Employment Registration', category: 'Employment', description: 'Job registration and employment services' },
  
  // Pension
  { icon: PiggyBank, name: 'Pension Services', category: 'Pension', description: 'Pension application, registration, and related services' },
  { icon: PiggyBank, name: 'Old Age Pension', category: 'Pension', description: 'Old age pension application and services' },
  { icon: PiggyBank, name: 'Widow Pension', category: 'Pension', description: 'Widow pension application and services' },
  { icon: PiggyBank, name: 'Disability Pension', category: 'Pension', description: 'Disability pension application and services' },
  
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
  { icon: Briefcase, name: 'Life Insurance', category: 'Insurance', description: 'Life insurance policies and services' },
  
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
  { icon: Receipt, name: 'Tax Deduction', category: 'Utility', description: 'Tax deduction certificate and related services' },
  { icon: Receipt, name: 'Income Tax Filing', category: 'Utility', description: 'Income tax return filing assistance' },
  { icon: Wallet, name: 'Withdraw/Payment Withdrawal', category: 'Utility', description: 'Payment withdrawal and transaction services' },
  
  // General
  { icon: Printer, name: 'Xerox & Printing', category: 'Printing', description: 'Photocopy and printing services' },
  { icon: FileText, name: 'Sarkari Form Online', category: 'General', description: 'All government form filling services online' },
  { icon: Receipt, name: 'Challan Jama', category: 'General', description: 'Challan payment and deposit services' },
  
  // School Project Work Services
  { icon: Book, name: 'School Project Writing', category: 'School Services', description: 'School project writing and content assistance' },
  { icon: Printer, name: 'Project Printing & Binding', category: 'School Services', description: 'School project printing, binding, and finishing' },
  { icon: FileImage, name: 'Project Design & Layout', category: 'School Services', description: 'Project design, layout, and formatting services' },
  { icon: PenTool, name: 'Project Cover Page Design', category: 'School Services', description: 'Professional project cover page design' },
  { icon: ClipboardList, name: 'Project Report Writing', category: 'School Services', description: 'Project report writing and documentation' },
  { icon: FileText, name: 'School Assignment Help', category: 'School Services', description: 'School assignment writing and completion' },
  { icon: BookOpen, name: 'Project Research Work', category: 'School Services', description: 'Research work assistance for school projects' },
  { icon: Scissors, name: 'Project Cutting & Pasting', category: 'School Services', description: 'Project cutting, pasting, and craft work' },
  { icon: FileText, name: 'School Certificate Printing', category: 'School Services', description: 'School certificate and document printing' },
  { icon: FileText, name: 'Report Card Printing', category: 'School Services', description: 'Report card and mark sheet printing' },
  { icon: FileText, name: 'School Form Filling', category: 'School Services', description: 'School admission and form filling services' },
  { icon: FileText, name: 'School Document Services', category: 'School Services', description: 'All school related document services' },
  
  // CSC Services - Land & Property
  { icon: MapPin, name: 'Land Records (Bhulekh)', category: 'CSC Services', description: 'Land records search, copy, and related services' },
  { icon: FileText, name: 'Property Documents', category: 'CSC Services', description: 'Property related document services' },
  
  // CSC Services - Banking & Financial
  { icon: Wallet, name: 'Banking Services', category: 'CSC Services', description: 'Banking services and transactions' },
  { icon: Banknote, name: 'Money Transfer', category: 'CSC Services', description: 'Money transfer and remittance services' },
  { icon: CreditCard, name: 'Aadhaar Enabled Payment', category: 'CSC Services', description: 'AEPS banking services' },
  
  // CSC Services - Education & Skills
  { icon: BookOpen, name: 'Exam Form Filling', category: 'CSC Services', description: 'Online exam form filling assistance' },
  { icon: GraduationCap, name: 'Skill Development Courses', category: 'CSC Services', description: 'Skill development and training courses' },
  { icon: Laptop, name: 'Digital Literacy', category: 'CSC Services', description: 'Digital literacy training programs' },
  
  // CSC Services - Legal & Court
  { icon: Scale, name: 'Court Case Status', category: 'CSC Services', description: 'Check court case status online' },
  { icon: FileText, name: 'Legal Aid Services', category: 'CSC Services', description: 'Legal aid and consultation services' },
  
  // IT Services - All in One
  { icon: Laptop, name: 'IT Services', category: 'IT Services', description: 'Complete IT solutions: Website Development, Software Development, Mobile Apps, Graphic Design, Video Editing, Instagram Posts, Photo Editing, Logo Design and more' },
  
  // Individual IT Services (shown when IT Services is clicked)
  { icon: Globe, name: 'Website Development', category: 'IT Services', description: 'Professional website design and development services', parentService: 'IT Services' },
  { icon: Code, name: 'Software Development', category: 'IT Services', description: 'Custom software development and programming services', parentService: 'IT Services' },
  { icon: Smartphone, name: 'Mobile App Development', category: 'IT Services', description: 'Android and iOS mobile application development', parentService: 'IT Services' },
  { icon: Palette, name: 'Graphic Design', category: 'IT Services', description: 'Professional graphic design services', parentService: 'IT Services' },
  { icon: Image, name: 'Post Design', category: 'IT Services', description: 'Social media post and advertisement design', parentService: 'IT Services' },
  { icon: Instagram, name: 'Instagram Post Design', category: 'IT Services', description: 'Professional Instagram post, story, and reel design', parentService: 'IT Services' },
  { icon: Video, name: 'Video Editing', category: 'IT Services', description: 'Professional video editing and post-production services', parentService: 'IT Services' },
  { icon: Film, name: 'Video Production', category: 'IT Services', description: 'Complete video production and shooting services', parentService: 'IT Services' },
  { icon: Youtube, name: 'YouTube Video Editing', category: 'IT Services', description: 'YouTube video editing, thumbnails, and optimization', parentService: 'IT Services' },
  { icon: Camera, name: 'Photo Editing', category: 'IT Services', description: 'Professional photo editing and retouching services', parentService: 'IT Services' },
  { icon: Layout, name: 'Banner Design', category: 'IT Services', description: 'Banner and hoarding design services', parentService: 'IT Services' },
  { icon: Monitor, name: 'Logo Design', category: 'IT Services', description: 'Professional logo design and branding services', parentService: 'IT Services' },
  { icon: Music, name: 'Audio Editing', category: 'IT Services', description: 'Audio editing, mixing, and sound design services', parentService: 'IT Services' },
  { icon: Code, name: 'Web Application Development', category: 'IT Services', description: 'Custom web applications and software solutions', parentService: 'IT Services' },
  { icon: Laptop, name: 'E-Commerce Website', category: 'IT Services', description: 'E-commerce website development and setup', parentService: 'IT Services' },
];

// Documents required mapping for each service
const serviceDocuments: Record<string, string[]> = {
  'Aadhaar Card': ['Proof of Identity (POI)', 'Proof of Address (POA)', 'Date of Birth Proof', 'Passport size photo'],
  'Aadhaar Update/Correction': ['Existing Aadhaar Card', 'Supporting document for correction', 'Proof of Identity', 'Proof of Address'],
  'PAN Card': ['Aadhaar Card', 'Proof of Identity', 'Proof of Address', 'Date of Birth Proof', 'Passport size photo'],
  'Voter ID Card': ['Proof of Identity', 'Proof of Address', 'Date of Birth Proof', 'Passport size photo'],
  'Ration Card': ['Aadhaar Card of all family members', 'Proof of Address', 'Family photo', 'Income certificate'],
  'Ration Card Update': ['Existing Ration Card', 'Aadhaar Card', 'Supporting documents for update'],
  'Passport Services': ['Aadhaar Card', 'Birth Certificate', 'Proof of Address', 'Educational certificates', 'Passport size photos'],
  'E-Shram Card': ['Aadhaar Card', 'Bank account details', 'Mobile number', 'Photo'],
  'Digital Signature Certificate': ['Aadhaar Card', 'PAN Card', 'Email ID', 'Mobile number', 'Photo'],
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
  'Website Development': ['Business details', 'Requirements', 'Content/material', 'Payment'],
  'Software Development': ['Project requirements', 'Business details', 'Technical specifications', 'Payment'],
  'Mobile App Development': ['App requirements', 'Features list', 'Platform (Android/iOS)', 'Payment'],
  'Graphic Design': ['Design requirements', 'Content/text', 'Images/photos', 'Payment'],
  'Post Design': ['Post content', 'Design requirements', 'Images/photos', 'Payment'],
  'Instagram Post Design': ['Post content', 'Design requirements', 'Images/photos', 'Brand guidelines', 'Payment'],
  'Video Editing': ['Video footage', 'Editing requirements', 'Music/sound effects', 'Payment'],
  'Video Production': ['Script/storyboard', 'Shooting requirements', 'Location details', 'Payment'],
  'YouTube Video Editing': ['Video footage', 'Thumbnail requirements', 'SEO requirements', 'Payment'],
  'Photo Editing': ['Original photos', 'Editing requirements', 'Style preferences', 'Payment'],
  'Banner Design': ['Banner content', 'Size specifications', 'Design requirements', 'Payment'],
  'Logo Design': ['Company/business name', 'Design preferences', 'Color scheme', 'Payment'],
  'Audio Editing': ['Audio files', 'Editing requirements', 'Music/sound effects', 'Payment'],
  'Web Application Development': ['Project requirements', 'Business details', 'Technical specifications', 'Payment'],
  'E-Commerce Website': ['Product details', 'Business information', 'Payment gateway requirements', 'Payment'],
};

type Service = {
  icon: any;
  name: string;
  category: string;
  description: string;
  parentService?: string;
};

export default function ServicesPageComponent() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showITServices, setShowITServices] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    service_type: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

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
  
  // Filter services based on category and search query
  const filteredServices = services.filter(s => {
    // Exclude parent services (like IT Services sub-services)
    if (s.parentService) return false;
    
    // Filter by category
    const categoryMatch = selectedCategory === 'All' || s.category === selectedCategory;
    
    // Filter by search query (case-insensitive search in name, description, and category)
    const searchMatch = searchQuery.trim() === '' || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  const handleServiceClick = (service: Service) => {
    console.log('Service clicked:', service.name);
    if (service.name === 'IT Services') {
      setShowITServices(true);
      setSelectedService(service);
      setIsModalOpen(true);
      setShowForm(false);
      setSubmitSuccess(false);
      setError('');
      setFormData({ name: '', mobile: '', address: '', service_type: '' });
    } else {
      setShowITServices(false);
      setSelectedService(service);
      setIsModalOpen(true);
      setShowForm(false);
      setSubmitSuccess(false);
      setError('');
      setFormData({ name: '', mobile: '', address: '', service_type: '' });
    }
    // Prevent body scroll when modal is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };
  
  const handleITServiceClick = (service: Service) => {
    setShowITServices(false);
    setSelectedService(service);
    setShowForm(false);
    setSubmitSuccess(false);
    setError('');
    setFormData({ name: '', mobile: '', address: '', service_type: service.name });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    setShowForm(false);
    setShowITServices(false);
    setSubmitSuccess(false);
    setError('');
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
    setError('');
    
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
      
      setError('कृपया पुनः प्रयास करें। Please try again.');
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
    <div className="min-h-screen bg-white">
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">Our Services</h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">हमारी सेवाएं - All Government & Private Services Under One Roof</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6 sm:mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services... (e.g., Aadhaar, PAN, Certificate)"
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-gray-600 transition" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-gray-600 text-center">
                Found {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </p>
            )}
          </div>

          {/* Category Filter */}
          <div className="mb-6 sm:mb-8 flex flex-wrap justify-center gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm md:text-base transition ${
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
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12">
            {filteredServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  onClick={() => handleServiceClick(service)}
                  className="bg-gradient-to-br from-blue-50 to-white p-4 sm:p-5 md:p-6 rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-lg transition transform hover:scale-105 cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-blue-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base md:text-lg leading-tight">{service.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 min-h-[40px]">{service.description}</p>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 sm:px-3 py-1 rounded-full font-medium">
                      {service.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 sm:p-7 md:p-8 text-white text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">और भी बहुत कुछ!</h3>
            <p className="text-sm sm:text-base md:text-lg text-blue-100 mb-4 sm:mb-6">
              किसी भी प्रकार की सरकारी या निजी सेवा के लिए हमसे संपर्क करें।
              हम आपकी पूरी सहायता करने के लिए तैयार हैं।
            </p>
            <p className="text-sm sm:text-base md:text-lg text-blue-100">
              For any type of government or private service, please contact us. We are ready to assist you completely.
            </p>
          </div>
        </div>
      </section>

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
              {showITServices && selectedService?.name === 'IT Services' ? (
                <>
                  {/* IT Services Grid */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <Laptop className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                      <span className="text-sm sm:text-base">IT Services</span>
                    </h3>
                    <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">{selectedService.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {services.filter(s => s.parentService === 'IT Services').map((service, idx) => {
                        const Icon = service.icon;
                        return (
                          <div
                            key={idx}
                            onClick={() => handleITServiceClick(service)}
                            className="bg-gradient-to-br from-blue-50 to-white p-4 sm:p-5 rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-lg transition transform hover:scale-105 cursor-pointer"
                          >
                            <div className="flex flex-col items-center text-center">
                              <div className="bg-blue-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                              </div>
                              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base leading-tight">{service.name}</h4>
                              <p className="text-xs sm:text-sm text-gray-600">{service.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="w-full px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-sm sm:text-base"
                  >
                    Close
                  </button>
                </>
              ) : !showForm ? (
                <>
                  {/* Service Description */}
                  <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">{selectedService.description}</p>

                  {/* Required Documents Section */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                      <span className="text-sm sm:text-base">आवश्यक दस्तावेज (Required Documents)</span>
                    </h3>
                    <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
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
    </div>
  );
}







