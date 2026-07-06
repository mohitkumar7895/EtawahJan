'use client';

import { Phone, MessageCircle, MapPin, CheckCircle, Clock, Shield } from 'lucide-react';
import Link from 'next/link';

const WHATSAPP_NUMBER = '7895094129';

export default function LocalSeoContent() {
  return (
    <section className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-14 md:py-18">
        <div className="max-w-4xl mx-auto">
          {/* Primary H1 - One clear local intent */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
            Jan Seva Kendra Near Me – CSC Center Etawah, Bharthana | Same Day Service
          </h1>
          <p className="text-base sm:text-lg text-gray-600 text-center mb-8 sm:mb-10 leading-relaxed">
            आपके इलाके का भरोसेमंद जन सेवा केंद्र। Aadhaar address correction (Etawah only), PAN card apply, income/nivas/martu certificates (Etawah only), birth certificate, ration card, Ayushman card—<strong>same day work</strong>, <strong>official process</strong>, <strong>no agent required</strong>. Etawah, Bharthana, Agra, Kanpur, Lucknow, Firozabad, Ekdil, Auraiya (25 km radius).
          </p>

          {/* H2: Why choose us / Near me services */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 border-b border-blue-200 pb-2">
            Why Visit Jan Seva Kendra Near You? | आपके पास का सीएससी सेंटर
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Agar aap search kar rahe ho &quot;jan seva kendra near me&quot;, &quot;csc center near me&quot;, &quot;aadhaar address correction etawah&quot;, ya &quot;pan card apply near me&quot;—hum yahi hain. Mandi Trihaa, Bidhuna Road, Bharthana, Etawah.
          </p>

          {/* H3: Services we do */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-8 mb-3">
            Same Day &amp; Instant Services | जल्द काम करवाएं
          </h3>
          <ul className="space-y-2 text-gray-700 mb-6">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>Aadhaar address correction (Etawah only)</strong> – sirf address update, name/photo/mobile nahi</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>PAN card apply near me</strong> – new PAN, correction, fast approval help</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>Income certificate (Etawah only)</strong> – same day process</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>Birth certificate online near me</strong> – application &amp; correction</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>Caste certificate online</strong> – official process, fast help</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>Ration card apply</strong> – new &amp; update, family member add</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>Ayushman card apply</strong> – government health scheme</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>Government work online near me</strong> – voter ID, passport, PM Kisan, Ujjwala, bill payment, and more</span>
            </li>
          </ul>

          {/* H2: FAQ-style questions (voice search) */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 mt-10 border-b border-blue-200 pb-2">
            Frequently Asked | अक्सर पूछे जाने वाले सवाल
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Jan Seva Kendra near me kahan hai? | Where is the nearest Jan Seva Kendra?</h3>
              <p className="text-gray-700 pl-0 sm:pl-2">
                Jan Seva Kendra / CSC center Etawah, Bharthana mein Mandi Trihaa, Bidhuna Road par hai. Etawah, Agra, Kanpur, Lucknow, Firozabad, Ekdil, Auraiya se 25 km ke andar aasani se pahunch sakte hain. Visit today—same day work available.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aadhaar address correction Etawah par same day ho sakta hai?</h3>
              <p className="text-gray-700 pl-0 sm:pl-2">
                Haan, sirf <strong>Aadhaar address correction</strong> Etawah center par same day process hota hai. Name, photo, mobile update yahan nahi hota. Official process, no agent required. Call 9193898182, 7895094129.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">PAN card apply near me kaise karein?</h3>
              <p className="text-gray-700 pl-0 sm:pl-2">
                PAN card apply karne ke liye center par aao with Aadhaar, photo, address proof. Hum complete form fill, submission aur fast approval help dete hain. Instant service, official process. Call now 9193898182.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Income certificate apply near me / Caste certificate online?</h3>
              <p className="text-gray-700 pl-0 sm:pl-2">
                Income certificate (Aay), Domicile (Nivas), Death (Martu) certificate — <strong>sirf Etawah center par</strong>. Caste certificate sab jagah. Same day application, official process. Visit today.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ration card apply / Ayushman card apply kahan se karein?</h3>
              <p className="text-gray-700 pl-0 sm:pl-2">
                Ration card apply aur Ayushman card apply dono Jan Seva Kendra, Bharthana (Mandi Trihaa, Bidhuna Road) par karwa sakte ho. Government authorized center, no agent required. Call now ya WhatsApp now.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Government work online near me – kya kya services milti hain?</h3>
              <p className="text-gray-700 pl-0 sm:pl-2">
                Etawah center par: Aadhaar address correction, PAN, banking, income/nivas/martu certificates. Baaki districts ke liye: PAN, Voter ID, ration card, caste/birth/marriage certificate, driving license, Ayushman, PM Kisan, bill payment—official process.
              </p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 mb-8">
            <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-4 border border-blue-100">
              <Clock className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <span className="font-bold text-gray-900 block">Same Day Work</span>
                <span className="text-sm text-gray-600">Jaldi kaam ho jata hai</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-green-50 rounded-lg p-4 border border-green-100">
              <Shield className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <span className="font-bold text-gray-900 block">Official Process</span>
                <span className="text-sm text-gray-600">No agent required</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-amber-50 rounded-lg p-4 border border-amber-100">
              <CheckCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
              <div>
                <span className="font-bold text-gray-900 block">Fast Approval Help</span>
                <span className="text-sm text-gray-600">Instant service</span>
              </div>
            </div>
          </div>

          {/* CTA Block */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 sm:p-8 text-white text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Visit Today | Call 9193898182 | WhatsApp 7895094129</h2>
            <p className="text-blue-100 mb-4 text-sm sm:text-base">
              आज ही आएं या फोन करें। Same day service, no tension. Jan Seva Kendra – आपके पास का भरोसेमंद सेंटर।
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center flex-wrap">
              <a
                href="tel:9193898182"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-5 py-3 rounded-lg font-bold hover:bg-blue-50 transition w-full sm:w-auto"
              >
                <Phone className="w-5 h-5" />
                Call Now: 9193898182, 7895094129
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg font-bold transition w-full sm:w-auto"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp: 7895094129 / 9193898182
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 border-2 border-white/30 text-white px-5 py-3 rounded-lg font-bold transition w-full sm:w-auto"
              >
                <MapPin className="w-5 h-5" />
                Visit Today – Get Direction
              </Link>
            </div>
            <p className="text-blue-200 text-sm mt-4">
              Address: Mandi Trihaa, Bidhuna Road, Bharthana, Etawah, UP | Mon–Sat 9AM–7PM, Sun 10AM–5PM
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
