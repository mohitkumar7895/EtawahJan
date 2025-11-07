import { MapPin, Phone, Mail, Clock, FileText, Users, Shield, Award, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold">Jan Seva Kendra</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              आपकी सेवा में सदैव तत्पर। हम सभी प्रकार की सरकारी और निजी सेवाएं एक ही छत के नीचे प्रदान करते हैं।
            </p>
            <p className="text-gray-300 leading-relaxed">
              Always ready to serve you. We provide all types of government and private services under one roof.
            </p>
            <div className="flex space-x-4 mt-4">
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
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-400" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-blue-400 transition flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-blue-400 transition flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/vacancies" className="text-gray-300 hover:text-blue-400 transition flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Vacancies & Results
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-blue-400" />
              Contact Us
            </h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-1 text-blue-400" />
                <div>
                  <p className="leading-relaxed">
                    Mandi Trihaa, Bidhuna Road<br />
                    Bharthana, Etawah<br />
                    Uttar Pradesh, India
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-blue-400" />
                <a href="tel:9193898182" className="hover:text-blue-400 transition font-semibold">
                  9193898182
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-blue-400" />
                <a href="mailto:arpitcsc1707@gmail.com" className="hover:text-blue-400 transition break-all">
                  arpitcsc1707@gmail.com
                </a>
              </div>
              <div className="flex items-start space-x-3 mt-4">
                <Clock className="w-5 h-5 flex-shrink-0 mt-1 text-blue-400" />
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
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-400" />
              Our Services
            </h3>
            <ul className="space-y-2 text-gray-300">
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
              to="/services" 
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-semibold"
            >
              View All Services →
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                &copy; {new Date().getFullYear()} Jan Seva Kendra. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm mt-1">
                सेवा ही धर्म है | Service is our duty
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm text-gray-400">
              <a href="tel:9193898182" className="hover:text-blue-400 transition">
                📞 Call Now: 9193898182
              </a>
              <span>|</span>
              <a href="mailto:arpitcsc1707@gmail.com" className="hover:text-blue-400 transition">
                ✉️ Email Us
              </a>
               <a href="/admin" className="hover:text-blue-400 transition">
                 Admin
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
