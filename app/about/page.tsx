import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { CheckCircle, Clock, Shield, Users, Award, Target, Phone, Linkedin } from 'lucide-react';
import type { Metadata } from 'next'

const team = [
  {
    name: 'Arpit Porwal',
    role: 'Owner',
    subtitle: 'CSC Operator · Legal & Government Services',
    brand: 'Arpit CSC · Jan Seva Kendra',
    image: '/arpitcsc.png',
    phone: '9193898182',
    accent: 'from-amber-500 to-orange-600',
    ring: 'ring-amber-200',
    bio:
      'Founder and Owner of Arpit Jan Seva Kendra. 7+ years of hands-on experience running a CSC center — government services, documents, and customer support with a clear, honest process.',
    education: 'LLB (Passout) · 7+ years at Jan Seva Kendra (CSC)',
    highlights: [
      'Authorized CSC operator — PAN, Aadhaar, certificates & online applications',
      '7+ years serving Bharthana, Etawah and nearby villages',
      'Legal background (LLB) for better guidance on forms and documents',
      'Fair pricing, official process, no unnecessary middlemen',
      'Center operations, quality check, and customer trust',
    ],
  },
  {
    name: 'Mohit Porwal',
    role: 'Director',
    subtitle: 'Software Developer · Digital Services',
    brand: 'Mohit CSC · Jan Seva Kendra',
    image: '/mohit-csc.png',
    phone: '7895094129',
    linkedin: 'https://www.linkedin.com/in/mohit-kumar7895/',
    accent: 'from-blue-600 to-indigo-700',
    ring: 'ring-blue-200',
    bio:
      'Software Developer and Director at Jan Seva Kendra. BCA (2025) with 2+ years of experience — websites, portals, and digital solutions for the center and customers.',
    education: 'BCA — Passout 2025 · 2+ years experience',
    highlights: [
      'Built the official Jan Seva Kendra website',
      'Created digital tools and online document portal',
      'Developed school management software',
      'Custom software and tech support for CSC services',
    ],
  },
];

export const metadata: Metadata = {
  title: 'About Jan Seva Kendra | CSC Center Etawah, Bharthana – Government Authorized',
  description: 'Jan Seva Kendra Etawah, Bharthana – government authorized CSC center. Same day service, official process, no agent required. Mandi Trihaa, Bidhuna Road. Call 9193898182.',
  openGraph: {
    title: 'About Us | Jan Seva Kendra – CSC Etawah, Bharthana',
    url: 'https://www.jan-seva.site/about',
  },
}

const features = [
  {
    icon: CheckCircle,
    iconBg: 'bg-blue-100 text-blue-600',
    title: 'Quality Service',
    description:
      'Customer satisfaction is our top priority. Har kaam carefully aur sahi process se complete hota hai.',
  },
  {
    icon: Clock,
    iconBg: 'bg-green-100 text-green-600',
    title: 'Quick Processing',
    description:
      'Jaldi service — same day help jahan possible ho. Aapka time waste nahi hoga.',
  },
  {
    icon: Shield,
    iconBg: 'bg-orange-100 text-orange-600',
    title: 'Secure & Reliable',
    description:
      'Aapke documents safe aur confidential rehte hain. Official CSC process follow karte hain.',
  },
  {
    icon: Users,
    iconBg: 'bg-red-100 text-red-600',
    title: 'Expert Team',
    description:
      'Trained team jo forms, certificates aur online services mein experienced hai.',
  },
  {
    icon: Award,
    iconBg: 'bg-purple-100 text-purple-600',
    title: 'Certified Services',
    description:
      'Government aur private services jo valid aur recognized hain — transparent fees.',
  },
  {
    icon: Target,
    iconBg: 'bg-teal-100 text-teal-600',
    title: 'Customer Focus',
    description:
      'Pehle aapki need sunte hain, phir sahi solution batate hain. No hidden charges.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                  About Jan Seva Kendra
                </h1>
                <p className="text-lg sm:text-xl text-gray-600">
                  Arpit Jan Seva Kendra · Bharthana, Etawah — Service is our duty
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-5 sm:p-6 md:p-8 mb-8 sm:mb-10 md:mb-12">
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Welcome to Jan Seva Kendra
                  </h2>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
                    Jan Seva Kendra is a trusted CSC service center in Bharthana, Etawah. Yahan aapko
                    government aur useful private services ek hi jagah milte hain — PAN, Aadhaar,
                    certificates, forms, online applications, photo/PDF tools aur bahut kuch.
                  </p>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
                    Our mission is simple: har customer ko easy, clear aur fast service dena. No
                    confusing agent talk — seedha official process, fair price, aur help jab aapko
                    form ya document mein doubt ho.
                  </p>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    Hum Etawah aur aas-paas ke gaon ke logon ki roz ki zaroorat samajhte hain. Chahe
                    student ho, job aspirant ho ya family documents ke liye aaye — hum friendly
                    guidance ke sath kaam poora karte hain.
                  </p>
                </div>
              </div>

              <div className="mb-8 sm:mb-10 md:mb-12">
                <div className="text-center mb-8 sm:mb-10">
                  <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">
                    Our leadership
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Meet Our Team
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                    Arpit Jan Seva Kendra ko locally run karte hain — owner se lekar director tak,
                    aapko seedha support milti hai.
                  </p>
                </div>

                <div className="flex flex-col gap-8 max-w-5xl mx-auto">
                  {team.map((member) => (
                    <article
                      key={member.name}
                      className="group flex flex-col md:flex-row bg-white rounded-3xl shadow-lg border border-slate-200/80 overflow-hidden hover:shadow-2xl hover:border-blue-200/60 transition-all duration-300"
                    >
                      <div className="md:w-[46%] flex-shrink-0 bg-gradient-to-b from-slate-50 via-blue-50/40 to-white px-5 py-8 sm:px-8 sm:py-10 flex items-center justify-center min-h-[360px] md:min-h-[420px]">
                        <div
                          className={`relative rounded-2xl bg-white p-2.5 sm:p-3 shadow-md ring-4 ${member.ring} w-full max-w-[340px] md:max-w-none mx-auto`}
                        >
                          <Image
                            src={member.image}
                            alt={`${member.name} — ${member.role}, ${member.brand}`}
                            width={520}
                            height={680}
                            className="w-full h-auto max-h-[min(560px,72vh)] object-contain rounded-xl"
                            sizes="(max-width: 768px) 340px, 420px"
                            priority
                          />
                        </div>
                      </div>

                      <div className="flex flex-col flex-1 p-5 sm:p-6 md:p-7 border-t sm:border-t-0 sm:border-l border-slate-100">
                        <div
                          className={`inline-flex self-start items-center rounded-full bg-gradient-to-r ${member.accent} px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm mb-3`}
                        >
                          {member.role}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">
                          {member.name}
                        </h3>
                        {'subtitle' in member && member.subtitle ? (
                          <p className="text-sm font-medium text-blue-700 mb-1">{member.subtitle}</p>
                        ) : null}
                        <p className="text-sm text-slate-500 mb-4">{member.brand}</p>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                          {member.bio}
                        </p>
                        {'education' in member && member.education ? (
                          <p className="text-sm font-medium text-slate-600 mb-4">{member.education}</p>
                        ) : null}
                        {'highlights' in member && member.highlights?.length ? (
                          <div className="mb-5 flex-1">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                              Experience
                            </p>
                            <ul className="space-y-2">
                              {member.highlights.map((item) => (
                                <li
                                  key={item}
                                  className="flex gap-2 text-sm text-gray-700 leading-snug"
                                >
                                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="mb-5 flex-1" />
                        )}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <a
                            href={`tel:${member.phone}`}
                            className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${member.accent} px-5 py-3 text-sm sm:text-base font-semibold text-white hover:opacity-95 transition shadow-md`}
                          >
                            <Phone className="w-4 h-4 flex-shrink-0" />
                            Call {member.phone}
                          </a>
                          {'linkedin' in member && member.linkedin ? (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-blue-600 bg-white px-5 py-3 text-sm sm:text-base font-semibold text-blue-700 hover:bg-blue-50 transition"
                            >
                              <Linkedin className="w-4 h-4 flex-shrink-0" />
                              LinkedIn
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-8 rounded-2xl bg-white/80 border border-blue-100 px-4 py-4 sm:px-6 text-center shadow-sm">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">WhatsApp / Call —</span>{' '}
                    <a href="tel:9193898182" className="text-blue-600 font-semibold hover:underline">
                      9193898182
                    </a>
                    <span className="text-gray-300 mx-2">|</span>
                    <a href="tel:7895094129" className="text-blue-600 font-semibold hover:underline">
                      7895094129
                    </a>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12">
                {features.map(({ icon: Icon, iconBg, title, description }) => (
                  <div
                    key={title}
                    className="bg-white rounded-lg shadow-lg p-4 sm:p-5 md:p-6 hover:shadow-xl transition"
                  >
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className={`p-2 sm:p-3 rounded-full flex-shrink-0 ${iconBg}`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                          {title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600">{description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-xl p-5 sm:p-6 md:p-8 text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-5 md:mb-6 text-center">
                  Our Location
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Address</h3>
                    <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                      Mandi Trihaa, Bidhuna Road
                      <br />
                      Bharthana, Etawah
                      <br />
                      Uttar Pradesh, India
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                      Contact Information
                    </h3>
                    <p className="text-sm sm:text-base text-blue-100 mb-2">
                      <strong>Arpit Porwal (Owner):</strong>{' '}
                      <a href="tel:9193898182" className="hover:text-white transition">
                        9193898182
                      </a>
                    </p>
                    <p className="text-sm sm:text-base text-blue-100 mb-2">
                      <strong>Mohit Porwal (Director):</strong>{' '}
                      <a href="tel:7895094129" className="hover:text-white transition">
                        7895094129
                      </a>
                    </p>
                    <p className="text-sm sm:text-base text-blue-100">
                      <strong>Email:</strong>{' '}
                      <a
                        href="mailto:arpitcsc1707@gmail.com"
                        className="hover:text-white transition break-all"
                      >
                        arpitcsc1707@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
