import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  Camera, 
  GraduationCap, 
  PiggyBank, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle,
  HelpCircle,
  Phone,
  FileText,
  Image as ImageIcon,
  FileStack,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CSC Online Tools | Photo Resizer & PDF Editor Etawah',
  description: 'Free digital tools by Jan Seva Kendra Etawah, Bharthana. Online Photo & Signature Resizer for government forms, Free Online PDF Text Editor & Digital Signer, Scholarship Eligibility, and Digital Savings Calculator. Free and secure!',
  keywords: [
    'online photo resizer',
    'online pdf editor',
    'free pdf signer',
    'pdf text writer',
    'photo compressor 20kb',
    'change image background online',
    'remove background free',
    'signature resizer 10kb',
    'sarkari result photo resizer',
    'csc online tools',
    'jan seva kendra tools',
    'scheme eligibility checker',
    'etawah csc center tools',
  ],
  openGraph: {
    title: 'CSC Online Tools | Photo Resizer & PDF Editor',
    description: 'Free digital tools for government job aspirants: Photo Resizer, PDF Editor & Signer, Scheme Eligibility, and Savings Calculator.',
    url: 'https://www.jan-seva.site/tools',
  },
};

const toolList = [
  {
    id: 'photo-resizer',
    title: 'Sarkari Photo & Signature Resizer',
    hindiTitle: 'Sarkari Photo & Signature Resizer',
    description: 'UP Police, SSC, RRB or Board exams ke liye photo & signature size (Under 20KB/50KB) compress karein instantly 1-click me.',
    badge: '🔥 Highly Popular',
    badgeColor: 'bg-orange-100 text-orange-850 border-orange-200/50',
    icon: Camera,
    iconBg: 'bg-orange-50 text-orange-600',
    link: '/photo-resizer',
    ctaText: 'Open Resizer →',
    primaryColor: 'border-t-orange-500 hover:shadow-orange-100',
  },
  {
    id: 'image-background-changer',
    title: 'Change Image Background Online',
    hindiTitle: 'Photo Background Changer (remove.bg jaisa)',
    description: 'Photo upload karein, background auto remove ho, phir White, Grey ya Blue official color lagayein. SSC, UP Police, NEET forms ke liye bilkul free!',
    badge: '✨ New Release',
    badgeColor: 'bg-emerald-100 text-emerald-850 border-emerald-200/50',
    icon: ImageIcon,
    iconBg: 'bg-emerald-50 text-emerald-600',
    link: '/image-background-changer',
    ctaText: 'Open Background Changer →',
    primaryColor: 'border-t-emerald-500 hover:shadow-emerald-100',
  },
  {
    id: 'pdf-editor',
    title: 'Free Online PDF Editor & Signer',
    hindiTitle: 'Online PDF Editor & Signer',
    description: 'PDF par text likhein, form fill karein ya digital signature add karke instantly secure download karein bilkul free.',
    badge: '⚡ New Release',
    badgeColor: 'bg-purple-100 text-purple-850 border-purple-200/50',
    icon: FileText,
    iconBg: 'bg-purple-50 text-purple-600',
    link: '/pdf-editor',
    ctaText: 'Open PDF Editor →',
    primaryColor: 'border-t-purple-500 hover:shadow-purple-100',
  },
  {
    id: 'file-converter',
    title: 'All-in-One File Converter',
    hindiTitle: 'PDF, Word, Image Converter',
    description:
      'PDF to JPG, Merge/Split PDF, Word/Excel to PDF, OCR, compress images — 30+ tools, batch convert & ZIP download. Professional & free.',
    badge: '🚀 New Suite',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-200/50',
    icon: FileStack,
    iconBg: 'bg-rose-50 text-rose-600',
    link: '/file-converter',
    ctaText: 'Open Converter →',
    primaryColor: 'border-t-rose-500 hover:shadow-rose-100',
  },
  {
    id: 'eligibility-wizard',
    title: 'Sarkari Scheme Eligibility Wizard',
    hindiTitle: 'Sarkari Yojana Eligibility Checker',
    description: 'Apni age, income aur profile select karke instantly pata karein ki aap kaun-kaun si Central & UP Govt schemes ke liye eligible hain.',
    badge: '💡 Scheme Finder',
    badgeColor: 'bg-blue-100 text-blue-850 border-blue-200/50',
    icon: GraduationCap,
    iconBg: 'bg-blue-50 text-blue-600',
    link: '/services',
    ctaText: 'Check Eligibility →',
    primaryColor: 'border-t-blue-500 hover:shadow-blue-100',
  },
  {
    id: 'savings-calculator',
    title: 'Digital Savings & Fee Calculator',
    hindiTitle: 'Digital Fee & Savings Calculator',
    description: 'Certificates aur PAN Card ki official govt fees vs local market rates check karein aur dekhein online apply karne par kitni bachat hogi.',
    badge: '💰 Money Saver',
    badgeColor: 'bg-emerald-100 text-emerald-850 border-emerald-200/50',
    icon: PiggyBank,
    iconBg: 'bg-emerald-50 text-emerald-600',
    link: '/services',
    ctaText: 'Calculate Savings →',
    primaryColor: 'border-t-emerald-500 hover:shadow-emerald-100',
  }
];

export default function ToolsLandingPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 text-slate-800">
        
        {/* Banner Section */}
        <section className="bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-950 text-white py-14 sm:py-16 md:py-20 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]"></div>
          
          <div className="container mx-auto max-w-4xl relative z-10 space-y-4">
            <span className="bg-blue-500/20 text-blue-200 border border-blue-400/30 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              100% Free & Secure Online Utilities
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Jan Seva Kendra Digital Tools
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              हमारे निःशुल्क डिजिटल टूल्स का उपयोग करके सरकारी फॉर्म और प्रमाण पत्र आवेदनों को अत्यंत सरल, पारदर्शी और त्रुटि-मुक्त बनाएं।
            </p>
          </div>
        </section>

        {/* Showcase Grid Section */}
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto max-w-7xl">
            
            {/* Header info */}
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                चुनें और उपयोग करें / Select a Digital Tool
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
                घर बैठे ही अपनी जरूरत के अनुसार नीचे दिए गए प्रीमियम टूल्स का मुफ़्त उपयोग करें।
              </p>
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {toolList.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div
                    key={tool.id}
                    className={`bg-white rounded-2xl border border-slate-200/80 border-t-4 ${tool.primaryColor} p-6 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group`}
                  >
                    <div className="space-y-4">
                      {/* Top Header Row inside Card */}
                      <div className="flex justify-between items-start gap-2">
                        <div className={`p-3 rounded-xl ${tool.iconBg} flex-shrink-0`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className={`text-[10px] font-black tracking-wide border px-2.5 py-0.5 rounded-full uppercase ${tool.badgeColor}`}>
                          {tool.badge}
                        </span>
                      </div>

                      {/* Content details */}
                      <div className="space-y-2">
                        <h3 className="font-extrabold text-lg text-slate-900 leading-snug group-hover:text-blue-700 transition">
                          {tool.title}
                        </h3>
                        <h4 className="text-xs font-bold text-blue-600">
                          {tool.hindiTitle}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-1">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    {/* CTA Link block */}
                    <div className="pt-6">
                      <Link
                        href={tool.link}
                        className="w-full bg-slate-50 hover:bg-blue-600 hover:text-white border-2 border-slate-100 hover:border-blue-600 text-slate-700 font-extrabold py-3 px-4 rounded-xl text-center shadow-sm hover:shadow-md transition duration-200 active:scale-95 block text-xs sm:text-sm"
                      >
                        {tool.ctaText}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Guaranteed Trust Banner */}
            <div className="bg-gradient-to-br from-indigo-900 to-blue-950 text-white rounded-2xl border-2 border-yellow-400/40 p-6 md:p-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
              
              <div className="space-y-3 text-center md:text-left z-10 max-w-2xl">
                <span className="bg-yellow-400 text-slate-900 font-black px-3 py-0.5 rounded-full text-[10px] uppercase tracking-wide inline-block">
                  🛡️ Government Application Experts
                </span>
                <h3 className="text-xl sm:text-2xl font-black">
                  फॉर्म की गलतियों से बचें, एडमिट कार्ड सुरक्षित करें!
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                  सभी ऑनलाइन टूल्स पूरी तरह सुरक्षित हैं। क्या आप चाहते हैं कि सरकारी फॉर्म में कोई भी गलती न हो? केवल <strong>₹50 सेवा शुल्क</strong> में हमारे जन सेवा केंद्र विशेषज्ञों से अपना फॉर्म ऑनलाइन भरवाएं।
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 z-10 w-full md:w-auto justify-center">
                <a
                  href="https://wa.me/917895094129?text=Hello%20Jan%20Seva%20Kendra,%20I%20want%20to%20apply%20for%20online%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black px-6 py-3.5 rounded-xl transition duration-200 active:scale-95 shadow-md flex items-center justify-center gap-1.5 text-xs sm:text-sm"
                >
                  💬 व्हाट्सएप करें / Send on WhatsApp
                </a>
                <a
                  href="tel:9193898182"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold px-6 py-3.5 rounded-xl transition duration-200 active:scale-95 flex items-center justify-center gap-1.5 text-xs sm:text-sm"
                >
                  📞 कॉल करें: 9193898182
                </a>
              </div>
            </div>

          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
