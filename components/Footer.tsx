'use client';

import { MapPin, Phone, Mail, Clock, FileText, Users, Award, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8 lg:py-10">
        
        {/* Portfolio CTA Button / Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-slate-800/50 p-6 sm:p-8 rounded-3xl border border-slate-700 mb-8 sm:mb-12 shadow-xl">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-2">Our Work & Expertise</h3>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl">Built for Growth. Designed to Convert. Take a look at some of the high-quality digital solutions we build to help businesses scale.</p>
          </div>
          <Link href="/portfolio" className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-8 rounded-xl flex items-center justify-center transition-colors shadow-lg active:scale-95 whitespace-nowrap group">
            View All Projects <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5 lg:gap-6 mb-4 sm:mb-6">
          {/* About Section */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <Image 
                src="/jan-seva-logo-1.png" 
                alt="Jan Seva Kendra Logo" 
                width={56}
                height={56}
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain flex-shrink-0"
              />
              <h3 className="text-sm sm:text-base lg:text-lg font-bold">Jan Seva Kendra</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-1.5 sm:mb-2 line-clamp-2">
              आपकी सेवा में सदैव तत्पर। सभी सरकारी और निजी सेवाएं एक ही छत के नीचे।
            </p>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-2 sm:mb-3 line-clamp-2 hidden sm:block">
              Always ready to serve you. All government and private services under one roof.
            </p>
            <div className="flex space-x-2 sm:space-x-3 mt-2 sm:mt-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition p-1.5 hover:bg-white/10 rounded-lg">
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition p-1.5 hover:bg-white/10 rounded-lg">
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="https://www.instagram.com/janseva.kendra.ap" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition p-1.5 hover:bg-white/10 rounded-lg">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition p-1.5 hover:bg-white/10 rounded-lg">
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-2 sm:mb-3 flex items-center">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-blue-400 flex-shrink-0" />
              Quick Links
            </h3>
            <ul className="space-y-1 sm:space-y-1.5">
              <li>
                <Link href="/" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>About</span>
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>Services</span>
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-xs sm:text-sm text-gray-300 hover:text-amber-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>Free Tools</span>
                </Link>
              </li>
              <li>
                <Link href="/digital-services" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>Digital Work</span>
                </Link>
              </li>
              <li>
                <Link href="/vacancies" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>Vacancies</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>Contact</span>
                </Link>
              </li>
              <li>
                <Link href="/build-website" className="text-xs sm:text-sm text-gray-300 hover:text-indigo-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-indigo-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>Website Banwana</span>
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>Track Application</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Sitemaps (New Section) */}
          <div className="col-span-1">
            <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-2 sm:mb-3 flex items-center">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-blue-400 flex-shrink-0" />
              Sitemaps
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 sm:gap-x-3 gap-y-1 sm:gap-y-1.5 [&_li]:min-w-0 [&_a]:items-start [&_span:last-child]:break-words [&_span:last-child]:leading-tight">
              <li>
                <Link href="/sitemap" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>HTML Sitemap</span>
                </Link>
              </li>
              <li>
                <Link href="/build-website" className="text-xs sm:text-sm text-gray-300 hover:text-indigo-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-indigo-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>Website Banwana</span>
                </Link>
              </li>
              <li>
                <Link href="/tools-sitemap" className="text-xs sm:text-sm text-gray-300 hover:text-amber-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>Tools Sitemap</span>
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-xs sm:text-sm text-gray-300 hover:text-amber-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>Tool Guides</span>
                </Link>
              </li>
              <li>
                <Link href="/grow" className="text-xs sm:text-sm text-gray-300 hover:text-emerald-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>SEO & Social Guides</span>
                </Link>
              </li>
              <li>
                <Link href="/global-website-sitemap" className="text-xs sm:text-sm text-gray-300 hover:text-violet-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-violet-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>Global Website (USA, Russia…)</span>
                </Link>
              </li>
              <li>
                <Link href="/website-world" className="text-xs sm:text-sm text-gray-300 hover:text-violet-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-violet-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>Website World Hub</span>
                </Link>
              </li>
              <li>
                <Link href="/website-sitemap" className="text-xs sm:text-sm text-gray-300 hover:text-indigo-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-indigo-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>All India Website</span>
                </Link>
              </li>
              <li>
                <Link href="/state-sitemap" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>State Sitemap</span>
                </Link>
              </li>
              <li>
                <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>XML Sitemap</span>
                </a>
              </li>
              <li>
                <Link href="/government-links" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>Gov Links</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>Blog</span>
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>FAQ</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-span-1">
            <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-2 sm:mb-3 flex items-center">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-blue-400 flex-shrink-0" />
              Contact
            </h3>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-300">
              <div className="flex items-start space-x-1.5 sm:space-x-2">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5 text-blue-400" />
                <div className="leading-tight text-xs">
                  <p className="break-words">
                    Mandi Trihaa, Bidhuna Road<br />
                    Bharthana, Etawah, UP
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-blue-400" />
                <a href="tel:9193898182" className="hover:text-blue-400 transition font-semibold break-all text-xs">
                  9193898182, 7895094129
                </a>
              </div>
              <div className="flex items-start space-x-1.5 sm:space-x-2">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5 text-blue-400" />
                <a href="mailto:arpitcsc1707@gmail.com" className="hover:text-blue-400 transition break-all text-xs">
                  arpitcsc1707@gmail.com
                </a>
              </div>
              <div className="mt-2 hidden items-start space-x-1.5 sm:mt-3 sm:flex sm:space-x-2">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5 text-blue-400" />
                <div>
                  <p className="font-semibold text-white text-xs">Mon-Sat: 9AM-7PM</p>
                  <p className="text-gray-300 text-xs">Sun: 10AM-5PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Free Tools */}
          <div className="col-span-1">
            <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-2 sm:mb-3 flex items-center">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-amber-400 flex-shrink-0" />
              Free Tools
            </h3>
            <ul className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-gray-300">
              <li>
                <Link href="/photo-resizer" className="hover:text-amber-400 transition">Photo 20KB Resizer</Link>
              </li>
              <li>
                <Link href="/pdf-editor" className="hover:text-amber-400 transition">PDF Editor</Link>
              </li>
              <li>
                <Link href="/cash-counter" className="hover:text-amber-400 transition">Cash Counter</Link>
              </li>
              <li>
                <Link href="/file-converter" className="hover:text-amber-400 transition">File Converter</Link>
              </li>
              <li>
                <Link href="/applications" className="hover:text-amber-400 transition">Application Maker</Link>
              </li>
              <li className="hidden sm:block">
                <Link href="/resume-builder" className="hover:text-amber-400 transition">Resume Builder</Link>
              </li>
            </ul>
            <Link 
              href="/tools" 
              className="inline-block mt-2 sm:mt-3 bg-amber-500 hover:bg-amber-600 text-slate-900 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition font-semibold text-xs sm:text-sm w-full sm:w-auto text-center"
            >
              All Tools →
            </Link>
            <Link 
              href="/services" 
              className="inline-block mt-2 sm:mt-3 bg-blue-600 hover:bg-blue-700 text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition font-semibold text-xs sm:text-sm w-full sm:w-auto text-center"
            >
              CSC Services →
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-3 sm:pt-4 md:pt-5 mt-4 sm:mt-5 md:mt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 sm:space-y-2 md:space-y-0">
            <div className="text-center md:text-left w-full md:w-auto">
              <p className="text-xs sm:text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Jan Seva Kendra. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-0.5 hidden sm:block">
                सेवा ही धर्म है | Service is our duty
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-1.5 sm:gap-2 text-xs text-gray-400 w-full md:w-auto">
              <a href="tel:9193898182" className="hover:text-blue-400 transition whitespace-nowrap">
                📞 9193898182
              </a>
              <span className="hidden sm:inline text-gray-600">|</span>
              <a href="https://wa.me/9193898182" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition whitespace-nowrap">
                💬 WhatsApp: 9193898182
              </a>
              <span className="hidden sm:inline text-gray-600">|</span>
              <a href="mailto:arpitcsc1707@gmail.com" className="hover:text-blue-400 transition whitespace-nowrap hidden sm:inline">
                ✉️ Email
              </a>
              <span className="hidden sm:inline text-gray-600">|</span>
              <Link href="/admin" className="hover:text-blue-400 transition whitespace-nowrap">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}







