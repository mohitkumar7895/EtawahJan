import {
  Camera,
  GraduationCap,
  PiggyBank,
  FileText,
  Image as ImageIcon,
  FileStack,
  Briefcase,
  Wallet,
  ClipboardList,
  Landmark,
  Heart,
  type LucideIcon,
} from 'lucide-react';

export interface DigitalTool {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: LucideIcon;
  link: string;
  cta: string;
  accent: string;
  iconBg: string;
}

export const DIGITAL_TOOLS: DigitalTool[] = [
  {
    id: 'yojana-checker',
    title: 'Sarkari Yojana Finder (AI)',
    subtitle: 'Check 50+ Govt Schemes',
    description:
      'Age, gender aur income daalkar instantly check karein PM Kisan, Ayushman aur Scholarship jaisi kin schemes mein aap eligible hain.',
    badge: 'Trending · Hot',
    icon: Landmark,
    link: '/tools/yojana-checker',
    cta: 'Check Eligibility Now',
    accent: 'border-t-green-500',
    iconBg: 'bg-green-50 text-green-600',
  },
  {
    id: 'biodata-maker',
    title: 'Shaadi Biodata Maker',
    subtitle: 'Create Marriage Biodata PDF',
    description:
      'Apni ya apne bachho ki shadi ke liye 2 minute mein sundar Marriage Biodata banayein aur free HD PDF download karein.',
    badge: 'Viral · New',
    icon: Heart,
    link: '/tools/biodata-maker',
    cta: 'Make Biodata Free',
    accent: 'border-t-rose-500',
    iconBg: 'bg-rose-50 text-rose-600',
  },
  {
    id: 'visiting-card-maker',
    title: 'Business Visiting Card Maker',
    subtitle: 'Create Free HD PDF Card',
    description:
      'Apne business ya dukaan ke liye 1 minute mein premium visiting card banayein aur free HD PDF print ke liye download karein.',
    badge: 'New · Free',
    icon: Briefcase,
    link: '/tools/visiting-card',
    cta: 'Make Visiting Card',
    accent: 'border-t-indigo-500',
    iconBg: 'bg-indigo-50 text-indigo-600',
  },
  {
    id: 'resume-builder',
    title: 'AI Resume Builder',
    subtitle: '20+ templates · PDF export',
    description:
      'Professional CV maker with live preview, AI summary, ATS checker, drag-drop sections, and instant PDF download.',
    badge: 'New · Premium',
    icon: Briefcase,
    link: '/resume-builder',
    cta: 'Build Resume',
    accent: 'border-t-indigo-500',
    iconBg: 'bg-indigo-50 text-indigo-600',
  },
  {
    id: 'photo-resizer',
    title: 'Sarkari Photo & Signature Resizer',
    subtitle: 'Photo 20KB / 50KB — 1 click',
    description:
      'UP Police, SSC, RRB or Board exams ke liye photo & signature size compress karein instantly.',
    badge: 'Highly Popular',
    icon: Camera,
    link: '/photo-resizer',
    cta: 'Open Resizer',
    accent: 'border-t-orange-500',
    iconBg: 'bg-orange-50 text-orange-600',
  },
  {
    id: 'image-background-changer',
    title: 'Change Image Background Online',
    subtitle: 'remove.bg jaisa — free',
    description:
      'Background auto remove, phir White, Grey ya Blue official color. SSC, UP Police, NEET ke liye.',
    badge: 'New Release',
    icon: ImageIcon,
    link: '/image-background-changer',
    cta: 'Open Background Changer',
    accent: 'border-t-emerald-500',
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: 'pdf-editor',
    title: 'Free Online PDF Editor & Signer',
    subtitle: 'Text · Fill · Sign',
    description:
      'PDF par text likhein, form fill karein ya digital signature add karke secure download karein.',
    badge: 'New Release',
    icon: FileText,
    link: '/pdf-editor',
    cta: 'Open PDF Editor',
    accent: 'border-t-purple-500',
    iconBg: 'bg-purple-50 text-purple-600',
  },
  {
    id: 'file-converter',
    title: 'All-in-One File Converter',
    subtitle: 'PDF, Word, Image — 30+ tools',
    description:
      'PDF to JPG, Merge/Split, Word/Excel to PDF, OCR, compress — batch & ZIP download.',
    badge: 'New Suite',
    icon: FileStack,
    link: '/file-converter',
    cta: 'Open Converter',
    accent: 'border-t-rose-500',
    iconBg: 'bg-rose-50 text-rose-600',
  },
  {
    id: 'cash-counter',
    title: 'Cash & Note Counter',
    subtitle: '₹500, ₹200, ₹100… ka total',
    description:
      '₹500, ₹200, ₹100, ₹50, ₹20, ₹10 notes ki ginti daalo — total ₹ aur shabdon mein. Privacy ke liye total chhipa rakhne ka option.',
    badge: 'New · Popular',
    icon: Wallet,
    link: '/cash-counter',
    cta: 'Count Cash',
    accent: 'border-t-emerald-500',
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: 'applications',
    title: 'Application Letter Maker',
    subtitle: '50+ Sarkari, School, Bank, Office letters',
    description:
      'Sarkari (income, caste, FIR), School (TC, leave), Bank (cheque book, loan), Office (resignation, leave) — sab pre-written. Profile ek baar bharo, har letter mein auto-fill. PDF download free.',
    badge: 'New · 50+ Templates',
    icon: ClipboardList,
    link: '/applications',
    cta: 'Open Application Maker',
    accent: 'border-t-orange-500',
    iconBg: 'bg-orange-50 text-orange-600',
  },
  {
    id: 'eligibility-wizard',
    title: 'Sarkari Scheme Eligibility Wizard',
    subtitle: 'Yojana eligibility checker',
    description:
      'Age, income aur profile se dekhein kaun-si Central & UP Govt schemes eligible hain.',
    badge: 'Scheme Finder',
    icon: GraduationCap,
    link: '/services',
    cta: 'Check Eligibility',
    accent: 'border-t-blue-500',
    iconBg: 'bg-blue-50 text-blue-600',
  },
  {
    id: 'savings-calculator',
    title: 'Digital Savings & Fee Calculator',
    subtitle: 'Govt vs market fees',
    description:
      'Certificates, PAN Card — official fees vs market rates, kitni bachat hogi dekhein.',
    badge: 'Money Saver',
    icon: PiggyBank,
    link: '/services',
    cta: 'Calculate Savings',
    accent: 'border-t-emerald-500',
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
];
