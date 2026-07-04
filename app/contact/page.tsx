import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8 sm:mb-10 md:mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">Contact Us</h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600">हमसे संपर्क करें - Get in Touch with Us</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Contact Information */}
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="bg-white rounded-lg shadow-xl p-5 sm:p-6 md:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6">Visit Our Center</h2>
                    
                    <div className="space-y-4 sm:space-y-5 md:space-y-6">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="bg-blue-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Address</h3>
                          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                            Mandi Trihaa, Bidhuna Road<br />
                            Bharthana, Etawah<br />
                            Uttar Pradesh, India
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="bg-green-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                          <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Phone</h3>
                          <a href="tel:9193898182" className="text-blue-600 hover:text-blue-700 text-base sm:text-lg font-medium break-all">
                            9193898182
                          </a>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">Call us for immediate assistance</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="bg-orange-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                          <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Email</h3>
                          <a href="mailto:arpitcsc1707@gmail.com" className="text-blue-600 hover:text-blue-700 text-base sm:text-lg font-medium break-all">
                            arpitcsc1707@gmail.com
                          </a>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">Send us your queries via email</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="bg-purple-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Working Hours</h3>
                          <p className="text-sm sm:text-base text-gray-700">
                            Monday - Saturday: 9:00 AM - 7:00 PM<br />
                            Sunday: 10:00 AM - 5:00 PM
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-xl p-5 sm:p-6 md:p-8 text-white">
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Why Choose Us?</h3>
                    <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-blue-100">
                      <li className="flex items-start space-x-2">
                        <span className="text-white font-bold">✓</span>
                        <span>Fast and reliable service processing</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-white font-bold">✓</span>
                        <span>Expert guidance for all government services</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-white font-bold">✓</span>
                        <span>Transparent pricing with no hidden charges</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-white font-bold">✓</span>
                        <span>Secure handling of all documents</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-white font-bold">✓</span>
                        <span>Available throughout the week</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-lg shadow-xl p-5 sm:p-6 md:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Apply for Services</h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    Fill out the form below and we&apos;ll get back to you shortly. आप फॉर्म भरें और हम जल्द ही आपसे संपर्क करेंगे।
                  </p>
                  <ContactForm embedded />
                </div>
              </div>

              {/* Full Width Map Section */}
              <div className="mt-6 sm:mt-8 w-full">
                <div className="bg-white rounded-lg shadow-xl p-5 sm:p-6 md:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 flex-shrink-0" />
                    Our Location
                  </h2>
                  <div className="rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg">
                    <iframe
                      src={`https://www.google.com/maps?q=Mandi+Trihaa+Bidhuna+Road+Bharthana+Etawah+Uttar+Pradesh&output=embed`}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Jan Seva Kendra Location - Mandi Trihaa, Bidhuna Road, Bharthana, Etawah"
                      className="w-full sm:h-[350px] md:h-[450px]"
                    ></iframe>
                  </div>
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-700 text-xs sm:text-sm">
                      <strong>📍 Address:</strong> Mandi Trihaa, Bidhuna Road, Bharthana, Etawah, Uttar Pradesh
                    </p>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Mandi+Trihaa+Bidhuna+Road+Bharthana+Etawah+Uttar+Pradesh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm mt-2 inline-block"
                    >
                      Open in Google Maps →
                    </a>
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
