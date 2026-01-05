'use client';

import { ExternalLink, Link as LinkIcon } from 'lucide-react';

const governmentLinks = [
  { name: 'Aadhaar Official', url: 'https://uidai.gov.in/', icon: '🔐' },
  { name: 'PAN Card (NSDL)', url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html', icon: '💳' },
  { name: 'Voter ID (NVSP)', url: 'https://www.nvsp.in/', icon: '🗳️' },
  { name: 'PM Kisan Portal', url: 'https://pmkisan.gov.in/', icon: '🌾' },
  { name: 'PM Awas Yojana', url: 'https://pmaymis.gov.in/', icon: '🏠' },
  { name: 'Ayushman Bharat', url: 'https://pmjay.gov.in/', icon: '🏥' },
  { name: 'UP Government Portal', url: 'https://up.gov.in/', icon: '🏛️' },
  { name: 'CSC Portal', url: 'https://www.csc.gov.in/', icon: '💻' },
  { name: 'DigiLocker', url: 'https://www.digilocker.gov.in/', icon: '📱' },
  { name: 'e-Shram Portal', url: 'https://eshram.gov.in/', icon: '👷' },
  { name: 'UP Ration Card', url: 'https://fcs.up.gov.in/', icon: '🛒' },
  { name: 'UP Land Records (Bhulekh)', url: 'https://bhulekh.up.gov.in/', icon: '📄' },
];

export default function QuickLinks() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Important Government Links */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-blue-100">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
              <LinkIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                Important Government Links
              </h2>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              महत्वपूर्ण सरकारी लिंक - Official Government Portals
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {governmentLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-white border-2 border-blue-100 rounded-lg hover:border-blue-400 hover:shadow-lg transition transform hover:scale-105 group"
              >
                <span className="text-2xl sm:text-3xl flex-shrink-0">{link.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-blue-600 transition">
                    {link.name}
                  </h3>
                </div>
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-600 transition flex-shrink-0" />
              </a>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm sm:text-base text-gray-700 text-center">
              <strong>Note:</strong> These are official government portals. Always verify the URL before entering any personal information.
              <br />
              <span className="text-gray-600">ये आधिकारिक सरकारी पोर्टल हैं। कोई भी व्यक्तिगत जानकारी दर्ज करने से पहले URL को हमेशा सत्यापित करें।</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

