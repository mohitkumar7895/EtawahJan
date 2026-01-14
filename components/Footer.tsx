'use client';

import { MapPin, Phone, Mail, Clock, FileText, Users, Shield, Award, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8 lg:py-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 mb-4 sm:mb-6">
          {/* About Section */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
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
                <Link href="/track" className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition flex items-center py-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400 rounded-full mr-1.5 flex-shrink-0"></span>
                  <span>Track Application</span>
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
              <div className="flex items-start space-x-1.5 sm:space-x-2 mt-2 sm:mt-3 hidden sm:block">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5 text-blue-400" />
                <div>
                  <p className="font-semibold text-white text-xs">Mon-Sat: 9AM-7PM</p>
                  <p className="text-gray-300 text-xs">Sun: 10AM-5PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services Highlights */}
          <div>
            <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-2 sm:mb-3 flex items-center">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-blue-400 flex-shrink-0" />
              Services
            </h3>
            <ul className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-gray-300">
              <li className="flex items-center">
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 text-green-400 flex-shrink-0" />
                <span>Aadhaar & PAN</span>
              </li>
              <li className="flex items-center">
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 text-green-400 flex-shrink-0" />
                <span>Voter ID & Ration</span>
              </li>
              <li className="flex items-center">
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 text-green-400 flex-shrink-0" />
                <span>Certificates</span>
              </li>
              <li className="flex items-center">
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 text-green-400 flex-shrink-0" />
                <span>Banking & Insurance</span>
              </li>
              <li className="flex items-center hidden sm:flex">
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 text-green-400 flex-shrink-0" />
                <span>Property & Vehicle</span>
              </li>
              <li className="flex items-center hidden sm:flex">
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 text-green-400 flex-shrink-0" />
                <span>And Many More...</span>
              </li>
            </ul>
            <Link 
              href="/services" 
              className="inline-block mt-2 sm:mt-3 bg-blue-600 hover:bg-blue-700 text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition font-semibold text-xs sm:text-sm w-full sm:w-auto text-center"
            >
              View All →
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
                📞 9193898182, 7895094129
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







