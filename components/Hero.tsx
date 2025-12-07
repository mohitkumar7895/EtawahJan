'use client';

import { MapPin, Phone, Mail, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ContactForm from './ContactForm';

export default function Hero() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!showModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showModal]);

  return (
    <section id="home" className="bg-gradient-to-br from-blue-400 to-blue-800 text-white py-12 md:py-15">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Main Content */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to Jan Seva Kendra
            </h1>
            <p className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">
              Arpit Porwal
            </p>
          
            <p className="text-xl text-blue-100 mb-3">
              आपकी सेवा में हमेशा तत्पर
            </p>
            <p className="text-lg text-blue-200 mb-8">
              All Government & Private Services Under One Roof
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <button
                onClick={() => setShowModal(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Apply for Services</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                href="/services"
                className="bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white px-8 py-3 rounded-lg font-semibold text-lg transition transform hover:scale-105"
              >
                View All Services
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">पता / Address</h3>
                  <p className="text-blue-100 text-sm">
                    Mandi Trihaa, Bidhuna Road<br />
                    Bharthana, Etawah, UP
                  </p>
                  <p className="text-yellow-300 text-xs mt-2">📍 आसानी से मिल जाएगा</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition">
              <div className="flex items-start space-x-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <a href="tel:9193898182" className="text-yellow-300 hover:text-yellow-200 font-bold text-lg transition block">
                    9193898182
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition">
              <div className="flex items-start space-x-3">
                <div className="bg-orange-500 p-2 rounded-lg">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <a href="mailto:arpitcsc1707@gmail.com" className="text-yellow-300 hover:text-yellow-200 text-sm transition break-all block">
                    arpitcsc1707@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
            onClick={() => setShowModal(false)}
            aria-hidden
          />

          {/* Modal Container */}
          <div 
            role="dialog" 
            aria-modal="true" 
            className="relative z-10 w-full max-w-lg animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-yellow-400/20">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-5 py-4">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -ml-12 -mb-12"></div>
                
                <div className="relative z-10 flex items-start justify-between">
                  <div className="text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-yellow-300 uppercase tracking-wide">Service Application</span>
                    </div>
                    <h3 className="text-xl font-extrabold mb-1">Apply for Services</h3>
                    <p className="text-xs text-blue-100">Fill the form below to get started</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    aria-label="Close dialog"
                    className="text-white hover:text-yellow-300 hover:bg-white/10 transition-all p-2 rounded-lg hover:scale-110 active:scale-95"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-5 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
                <ContactForm embedded />
              </div>

              {/* Footer Note */}
              <div className="px-5 py-3 bg-blue-50/50 border-t border-blue-100">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Need help? Call us at</span>
                  <a href="tel:9193898182" className="font-bold text-blue-600 hover:text-blue-700 transition">
                    9193898182
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

