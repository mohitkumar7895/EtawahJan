'use client';

import { CheckCircle, Clock, Shield, Users } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">About Us</h2>
            <p className="text-lg sm:text-xl text-gray-600">हमारे बारे में</p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-5 sm:p-6 md:p-8 mb-6 sm:mb-7 md:mb-8">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-5 md:mb-6">
              जन सेवा केंद्र एक विश्वसनीय सेवा केंद्र है जो सभी प्रकार की सरकारी और निजी सेवाएं एक ही छत के नीचे प्रदान करता है।
              हम अपने ग्राहकों को तेज, सटीक और पारदर्शी सेवा देने के लिए प्रतिबद्ध हैं।
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              We are committed to providing fast, accurate, and transparent services to our customers.
              Our goal is to make government and private services easily accessible to everyone in our community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-5 md:p-6 hover:shadow-xl transition">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-blue-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Quality Service</h3>
                  <p className="text-sm sm:text-base text-gray-600">गुणवत्तापूर्ण सेवा और ग्राहक संतुष्टि हमारी प्राथमिकता है</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-5 md:p-6 hover:shadow-xl transition">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-green-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Quick Processing</h3>
                  <p className="text-sm sm:text-base text-gray-600">न्यूनतम समय में आपके काम को पूरा करने की गारंटी</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-5 md:p-6 hover:shadow-xl transition">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-orange-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Secure & Reliable</h3>
                  <p className="text-sm sm:text-base text-gray-600">आपके दस्तावेज़ों की पूर्ण सुरक्षा और गोपनीयता</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-5 md:p-6 hover:shadow-xl transition">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-red-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Expert Team</h3>
                  <p className="text-sm sm:text-base text-gray-600">अनुभवी और प्रशिक्षित टीम द्वारा सेवा प्रदान</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}







