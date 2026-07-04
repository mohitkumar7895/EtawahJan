import Link from 'next/link'
import { MessageCircle, Phone } from 'lucide-react'
import { WEBSITE_INDUSTRIES } from '@/lib/seo/website-industries'
import { WEBSITE_BUILD_SERVICES } from '@/lib/seo/website-build-services'

type Props = {
  stateName: string
  stateSlug: string
  districtName?: string
  districtSlug?: string
}

export default function WebsiteLongSeoContent({
  stateName,
  stateSlug,
  districtName,
  districtSlug,
}: Props) {
  const location = districtName ? `${districtName}, ${stateName}` : stateName
  const wa = `https://wa.me/917895094129?text=${encodeURIComponent(
    `Hello, I want website/software in ${location}. Please call me with quote.`
  )}`

  const longFaqs = [
    {
      q: `${location} me website banwane ki cost kitni hai?`,
      a: `Basic business website se lekar e-commerce tak packages alag hain. WhatsApp par 7895094129 par apna business type aur budget batayein — hum ${location} ke liye customized free quote denge. Chhoti dukan se lekar bade company tak sab ke liye affordable options hain.`,
    },
    {
      q: `Kya ${location} se bahar bhi kaam karoge?`,
      a: `Haan — hum all India delivery karte hain. ${location} ka customer ho ya India ka koi bhi city — video call, WhatsApp aur phone par poora project manage hota hai. Face-to-face zaroori nahi.`,
    },
    {
      q: `Website banne ke baad Google par kaise dikhega?`,
      a: `Har website me basic SEO setup hota hai: page titles, descriptions, mobile speed, sitemap. ${location} ke local keywords jaise "website development ${districtName || stateName}" target kiye jaate hain. Extra SEO package bhi available hai.`,
    },
    {
      q: `Software aur website dono ek saath ban sakte hain?`,
      a: `Haan — billing software + company website, school website + management software, shop website + inventory system — combo packages me discount milta hai.`,
    },
    {
      q: `Kitne din me website ready ho jayegi?`,
      a: `Simple 5-page business website: 5-10 din. E-commerce ya custom software: 2-6 hafte. Urgent project ke liye WhatsApp par "urgent" likh kar priority quote lein.`,
    },
    {
      q: `Payment kaise hogi?`,
      a: `Usually 50% advance se kaam start, baaki delivery par. UPI, bank transfer — flexible options. Proper bill/invoice milega.`,
    },
  ]

  return (
    <section className="py-12 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4 max-w-5xl">
        <article className="prose prose-slate max-w-none">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 not-prose mb-6">
            {location} — Website Banwana, Software Banwana (Complete Guide)
          </h2>

          <div className="text-slate-700 leading-relaxed space-y-4 text-sm sm:text-base">
            <p>
              Agar aap <strong>{location}</strong> me rehte hain aur apne business ke liye website ya software
              dhundh rahe hain, to Jan Seva Kendra aapke liye all-in-one digital partner hai. Hum sirf ek page nahi —
              poora online business setup karte hain: website design, mobile app, billing software, logo, video editing,
              Google SEO, aur WhatsApp lead system.
            </p>
            <p>
              <strong>{districtName || stateName}</strong> ke local businesses — coaching institutes, schools, clinics,
              restaurants, retail shops, real estate dealers, manufacturers — sab ko aaj digital presence chahiye.
              Customers pehle Google par &quot;near me&quot; search karte hain. Bina website aap invisible ho jaate hain.
            </p>
            <p>
              Humari team {location} ke keywords ke liye dedicated SEO pages banati hai (jaise yahi page) taaki jab koi
              search kare &quot;website development {districtName || stateName}&quot; ya &quot;software company {stateName}&quot; —
              aapko hum milen aur seedha WhatsApp par lead aaye.
            </p>
            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">
              {location} businesses ke liye popular solutions
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>5-15 page business website with WhatsApp button</li>
              <li>E-commerce store with Razorpay / UPI payment</li>
              <li>Coaching / school website with admission form</li>
              <li>Clinic website with appointment booking</li>
              <li>Billing & GST invoice software for shops</li>
              <li>Android app for delivery, booking, or services</li>
              <li>Google ranking & local SEO for {stateName}</li>
            </ul>
            <p>
              <strong>Free consultation:</strong> WhatsApp 7895094129 ya call 9193898182. Apna business name, kya
              banwana hai, aur approximate budget likh kar bhejein — hum 24 ghante ke andar jawab denge.
            </p>
          </div>

          <div className="not-prose mt-10">
            <h3 className="text-xl font-black text-slate-900 mb-4">
              {location} — Frequently Asked Questions (Website & Software)
            </h3>
            <div className="space-y-4">
              {longFaqs.map((faq) => (
                <div key={faq.q} className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">{faq.q}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="not-prose mt-10 grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-black text-slate-900 mb-3">Industry pages</h3>
              <div className="flex flex-wrap gap-2">
                {WEBSITE_INDUSTRIES.map((ind) => (
                  <Link
                    key={ind.slug}
                    href={
                      districtSlug
                        ? `/website-for/${ind.slug}/${stateSlug}`
                        : `/website-for/${ind.slug}`
                    }
                    className="rounded-lg bg-white border px-2.5 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-50"
                  >
                    {ind.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-black text-slate-900 mb-3">Service pages</h3>
              <div className="flex flex-wrap gap-2">
                {WEBSITE_BUILD_SERVICES.map((svc) => (
                  <Link
                    key={svc.slug}
                    href={`/build-website/${svc.slug}`}
                    className="rounded-lg bg-white border px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-50"
                  >
                    {svc.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="not-prose mt-10 flex flex-col sm:flex-row gap-3 justify-center p-6 rounded-2xl bg-indigo-600 text-white text-center">
            <p className="font-black text-lg flex-1">{location} — aaj hi shuru karein</p>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-black hover:bg-green-600"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp Now
            </a>
            <a
              href="tel:9193898182"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 font-black text-slate-900"
            >
              <Phone className="h-5 w-5" />
              Call
            </a>
          </div>
        </article>
      </div>
    </section>
  )
}
