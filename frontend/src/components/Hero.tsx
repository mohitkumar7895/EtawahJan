import { MapPin, Phone, Mail, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
                to="/services"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 transition-opacity"
            onClick={() => setShowModal(false)}
            aria-hidden
          />

          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-md">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="flex items-start justify-between bg-blue-600 px-6 py-4">
                <div className="text-white">
                  <h3 className="text-lg font-bold">Apply for Services</h3>
                  <p className="text-sm text-blue-100 mt-1">Fill the form below</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  aria-label="Close dialog"
                  className="text-white hover:text-gray-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 bg-gray-50">
                <ContactForm embedded />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
