'use client';

import { MapPin, Phone, Mail, Clock, FileText, Users, Shield, Award, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* About Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold">Jan Seva Kendra</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3 sm:mb-4">
              आपकी सेवा में सदैव तत्पर। हम सभी प्रकार की सरकारी और निजी सेवाएं एक ही छत के नीचे प्रदान करते हैं।
            </p>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Always ready to serve you. We provide all types of government and private services under one roof.
            </p>
            <div className="flex space-x-3 sm:space-x-4 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-400 flex-shrink-0" />
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-blue-400 transition flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-blue-400 transition flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-blue-400 transition flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/vacancies" className="text-gray-300 hover:text-blue-400 transition flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Vacancies & Results
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-400 flex-shrink-0" />
              Contact Us
            </h3>
            <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-300">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-1 text-blue-400" />
                <div>
                  <p className="leading-relaxed">
                    Mandi Trihaa, Bidhuna Road<br />
                    Bharthana, Etawah<br />
                    Uttar Pradesh, India
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-blue-400" />
                <a href="tel:9193898182" className="hover:text-blue-400 transition font-semibold break-all">
                  9193898182
                </a>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-blue-400" />
                <a href="mailto:arpitcsc1707@gmail.com" className="hover:text-blue-400 transition break-all">
                  arpitcsc1707@gmail.com
                </a>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3 mt-3 sm:mt-4">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-1 text-blue-400" />
                <div>
                  <p className="font-semibold text-white">Monday - Saturday</p>
                  <p className="text-gray-300">9:00 AM - 7:00 PM</p>
                  <p className="text-gray-300 mt-1">Sunday: 10:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services Highlights */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-400 flex-shrink-0" />
              Our Services
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-300">
              <li className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-400" />
                Aadhaar & PAN Card
              </li>
              <li className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-400" />
                Voter ID & Ration Card
              </li>
              <li className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-400" />
                Certificates & Documents
              </li>
              <li className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-400" />
                Banking & Insurance
              </li>
              <li className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-400" />
                Property & Vehicle Registration
              </li>
              <li className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-400" />
                And Many More...
              </li>
            </ul>
            <Link 
              href="/services" 
              className="inline-block mt-3 sm:mt-4 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition font-semibold text-sm sm:text-base"
            >
              View All Services →
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-4 sm:pt-5 md:pt-6 mt-6 sm:mt-7 md:mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm sm:text-base text-gray-400">
                &copy; {new Date().getFullYear()} Jan Seva Kendra. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                सेवा ही धर्म है | Service is our duty
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-400">
              <a href="tel:9193898182" className="hover:text-blue-400 transition">
                📞 Call Now: 9193898182
              </a>
              <span>|</span>
              <a href="mailto:arpitcsc1707@gmail.com" className="hover:text-blue-400 transition">
                ✉️ Email Us
              </a>
               <Link href="/admin" className="hover:text-blue-400 transition">
                 Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}







