/** Business growth guides — Google Search Console setup + social media templates. */

export const SITE_URL = 'https://www.jan-seva.site'
export const SITEMAP_URL = `${SITE_URL}/sitemap.xml`
export const WHATSAPP = '7895094129'
export const WHATSAPP_LINK = 'https://wa.me/917895094129'
export const PHONE = '9193898182'
export const INSTAGRAM = 'https://www.instagram.com/janseva.kendra.ap'

export type GrowthGuideStep = {
  title: string
  content: string
  tip?: string
}

export type SocialTemplate = {
  id: string
  platform: string
  title: string
  text: string
  hashtags?: string
}

export type GrowthGuide = {
  slug: string
  title: string
  description: string
  category: 'seo' | 'social'
  icon: string
  steps?: GrowthGuideStep[]
  templates?: SocialTemplate[]
  checklist?: string[]
  faqs?: { q: string; a: string }[]
}

export const GROWTH_GUIDES: GrowthGuide[] = [
  {
    slug: 'google-search-console',
    title: 'Google Search Console Setup Guide',
    description:
      'Step-by-step: apni website Google me kaise register karein, sitemap submit karein, aur customers Google se kaise aayenge — Hindi + English.',
    category: 'seo',
    icon: 'search',
    steps: [
      {
        title: 'Step 1 — Google Search Console kholein',
        content:
          'Browser me jayein: https://search.google.com/search-console\n\nGoogle account se login karein (jo email aap business ke liye use karte hain — wahi best hai).\n\nPehli baar ho to "Start now" par click karein.',
        tip: 'Same Google account use karein jo Gmail / Google Business Profile me hai — sab ek jagah manage hoga.',
      },
      {
        title: 'Step 2 — Property add karein (Website URL)',
        content:
          'Left side "Add property" choose karein.\n\n**Domain property** (advanced): jan-seva.site — poore domain ke liye\n\n**URL prefix** (recommended, easy): https://www.jan-seva.site\n\nHumara site: **https://www.jan-seva.site** — ye URL exactly likhein (www ke saath).',
        tip: 'Agar Vercel par www redirect hai to www wala URL hi add karein — sitemap bhi same domain par honi chahiye.',
      },
      {
        title: 'Step 3 — Ownership verify karein',
        content:
          'Google aapko batayega ki site aapki hai. 3 common tareeke:\n\n**A) HTML tag (Vercel — sabse aasan)**\n1. Search Console se meta tag copy karein\n2. Vercel → Project → Settings → Environment (ya app/layout.tsx me metadata verification add karein)\n3. Deploy ke baad Search Console me "Verify" click karein\n\n**B) DNS record (domain registrar par)**\n1. GoDaddy / Namecheap / Hostinger me DNS settings\n2. TXT record add karein jo Google de\n3. 5–30 min wait, phir Verify\n\n**C) Google Analytics** — agar GA4 already connected hai to one-click verify.',
        tip: 'Verify fail ho to 24 ghante wait karke dubara try karein. DNS me kabhi-kabhi propagation time lagta hai.',
      },
      {
        title: 'Step 4 — Sitemap submit karein (bahut important!)',
        content:
          'Verify hone ke baad:\n\n1. Left menu → **Sitemaps**\n2. "Add a new sitemap" me likhein: **sitemap.xml**\n3. Submit par click karein\n\nFull URL: https://www.jan-seva.site/sitemap.xml\n\nYe sitemap me 3000+ pages hain — India cities, world countries, tools, website services. Google in sab ko crawl karega.',
        tip: 'Status "Success" dikhe to theek hai. "Couldn\'t fetch" aaye to site live hai ya nahi check karein — pehle Vercel deploy confirm karein.',
      },
      {
        title: 'Step 5 — Important pages manually index karwayein',
        content:
          'Top menu me **URL Inspection** (search bar) use karein.\n\nHar URL paste karke **Request Indexing** dabayein:\n\n• https://www.jan-seva.site/\n• https://www.jan-seva.site/build-website\n• https://www.jan-seva.site/website-world\n• https://www.jan-seva.site/website-world/united-states\n• https://www.jan-seva.site/tools\n• https://www.jan-seva.site/contact\n\nRoz 5–10 important URLs request karein — zyada spam mat karein.',
        tip: 'Naye pages deploy ke baad 2–3 din me dubara Request Indexing kar sakte hain.',
      },
      {
        title: 'Step 6 — Performance monitor karein',
        content:
          'Left menu → **Performance** — yahan dikhega:\n\n• Kaun se keywords par clicks aa rahe hain\n• Kaun si pages Google me dikh rahi hain\n• Average position (ranking)\n\nHar hafte ek baar check karein. "website development Etawah", "jan seva kendra", "photo resizer 20kb" jaise queries track hongi.',
        tip: 'Pehle 2–4 hafte data kam dikhega — normal hai. Indexing ke baad traffic badhta hai.',
      },
      {
        title: 'Step 7 — Coverage / Pages errors fix karein',
        content:
          'Left menu → **Pages** (pehle "Coverage" kehlata tha)\n\n• **Indexed** — theek hai\n• **Not indexed** — reason padhein (duplicate, crawled not indexed, etc.)\n• **Error** — 404 ya server error fix karein\n\nAgar koi page "Discovered – currently not indexed" ho to us URL par Request Indexing karein ya page par zyada unique content add karein.',
      },
      {
        title: 'Step 8 — Google Business Profile (local customers)',
        content:
          'Etawah / Bharthana ke local customers ke liye:\n\n1. https://business.google.com par jayein\n2. Business name: **Jan Seva Kendra**\n3. Address: Mandi Trihaa, Bidhuna Road, Bharthana, Etawah\n4. Category: Government office / Computer service / IT company\n5. Website: https://www.jan-seva.site\n6. Phone: 9193898182\n7. Photos upload karein — shop, team, services\n\nVerify postcard ya phone se. Reviews maangein satisfied customers se.',
        tip: 'Google Business + Search Console dono alag hain — dono setup karein for maximum local + global reach.',
      },
      {
        title: 'Step 9 — Bing Webmaster (bonus — free traffic)',
        content:
          'Google ke saath Bing bhi setup karein:\n\n1. https://www.bing.com/webmasters\n2. Site add karein\n3. **Import from Google Search Console** — one click!\n4. Sitemap same: sitemap.xml\n\nBing se bhi website development leads aa sakti hain — especially USA/UK me.',
      },
    ],
    checklist: [
      'Search Console me https://www.jan-seva.site verify ho gaya',
      'sitemap.xml submit ho gaya — Status Success',
      'Homepage + /build-website + /website-world index request ho gaya',
      'Google Business Profile create / update ho gaya',
      'Bing Webmaster import ho gaya',
      'Har hafte Performance report check kar rahe hain',
    ],
    faqs: [
      {
        q: 'Kitne din me Google par site dikhegi?',
        a: 'Verify + sitemap ke baad usually 3–14 din me pehli pages index hoti hain. Full 3000+ pages ke liye 1–3 mahine lag sakte hain. Social media par site link share karne se indexing fast hoti hai.',
      },
      {
        q: 'Sitemap me error aa raha hai — kya karein?',
        a: 'Pehle browser me https://www.jan-seva.site/sitemap.xml kholein — XML dikhni chahiye. Agar 404 aaye to latest code Vercel par deploy karein. Phir Search Console me dubara submit karein.',
      },
      {
        q: 'Kya har roz Request Indexing karna chahiye?',
        a: 'Nahi — sirf naye important pages ya deploy ke baad. Roz 5–10 URL enough hai. Zyada spam se Google ignore kar sakta hai.',
      },
      {
        q: 'Rank top par kab aayega?',
        a: 'SEO me time lagta hai — 2–6 mahine consistent effort ke baad improvement dikhti hai. Backlinks (Facebook, Instagram, YouTube, directories) + good content + fast site = better ranking.',
      },
    ],
  },
  {
    slug: 'social-media-templates',
    title: 'Social Media Post Templates — Backlinks & Customers',
    description:
      'Ready-made Facebook, Instagram, WhatsApp, YouTube, LinkedIn posts — copy karein, apni site ka link lagayein, customers aur Google ranking dono badhein.',
    category: 'social',
    icon: 'share',
    templates: [
      {
        id: 'fb-website-hindi',
        platform: 'Facebook',
        title: 'Website Development — Hindi (India customers)',
        text: `🌐 Apni Business Website Banvaiye — Customers Badhao!

Kya aapki dukan / coaching / clinic / shop abhi bhi sirf WhatsApp par hai?
Professional website se Google par dikhenge — naye customers khud aayenge.

✅ Business Website | E-commerce | Mobile App
✅ WhatsApp lead button | Google SEO ready
✅ Affordable price | Free quote same day

📍 Poore India + 65 countries me delivery
💬 WhatsApp: ${WHATSAPP}
📞 Call: ${PHONE}

👉 Free quote: ${SITE_URL}/build-website
👉 Etawah CSC + Premium IT: ${SITE_URL}

#WebsiteBanwana #WebDevelopment #JanSevaKendra #Etawah #DigitalIndia #SmallBusiness`,
      },
      {
        id: 'fb-website-english',
        platform: 'Facebook',
        title: 'Website Development — English (Global)',
        text: `🚀 Professional Website Development — India Team, Worldwide Delivery

Looking for an affordable website developer? We build:
• Business websites
• E-commerce stores
• Mobile apps & custom software

Save 50–70% vs local agencies. English support. Fast delivery.

🌍 USA · UK · Russia · UAE · Canada · Australia & 65+ countries
💬 WhatsApp: ${WHATSAPP}

Get FREE quote in 24 hours:
👉 ${SITE_URL}/website-world/united-states
👉 ${SITE_URL}/build-website

#WebDevelopment #WebsiteDesign #HireWebDeveloper #AffordableWebsite #SmallBusiness`,
      },
      {
        id: 'ig-website',
        platform: 'Instagram',
        title: 'Instagram Caption — Website + Reel',
        text: `Website nahi = Customers Google par nahi dhoondh paate 📉

Hum banate hain:
✨ Professional business websites
✨ Online dukan (e-commerce)
✨ Mobile apps
✨ Billing / school / hospital software

India 🇮🇳 + Worldwide 🌍 — same day free quote on WhatsApp

DM "WEBSITE" ya link in bio 👇
${SITE_URL}/build-website

WhatsApp: ${WHATSAPP}`,
        hashtags:
          '#websitebanwana #webdesign #webdeveloper #smallbusiness #startupindia #digitalmarketing #ecommerce #jansevakendra #etawah #onlinbusiness #googleseo #affordablewebsite #businessgrowth #entrepreneur #madeinindia',
      },
      {
        id: 'ig-tools',
        platform: 'Instagram',
        title: 'Instagram — Free Tools Promo',
        text: `100% FREE online tools — no login, no ads 🎉

📸 Sarkari photo 20KB resize
📄 PDF edit & merge
💵 Cash note counter
📁 File converter (PDF, JPG, Word)
📝 Resume builder

Sab browser me — mobile + desktop

Link in bio 👇
${SITE_URL}/tools

Follow @janseva.kendra.ap for daily tips!`,
        hashtags:
          '#freetools #onlinetools #photoresizer #pdfeditor #cashcounter #resumebuilder #sarkarijobs #governmentexam #jansevakendra #etawah #studytips #digitalseva',
      },
      {
        id: 'wa-status-website',
        platform: 'WhatsApp Status',
        title: 'WhatsApp Status — Website offer',
        text: `🌐 Website + App + Software

Apni dukan/coaching/clinic ke liye professional website banvaiye — Google par customers aayenge!

✅ Affordable price
✅ WhatsApp button on site
✅ Free quote

WhatsApp: ${WHATSAPP}
Site: ${SITE_URL}/build-website`,
      },
      {
        id: 'wa-status-tools',
        platform: 'WhatsApp Status',
        title: 'WhatsApp Status — Free Tools',
        text: `FREE Tools — Photo 20KB, PDF Edit, Cash Counter, Resume Builder

No app download — seedha browser me:
${SITE_URL}/tools

Share karein dosto ke saath! 🙏`,
      },
      {
        id: 'wa-broadcast',
        platform: 'WhatsApp Broadcast',
        title: 'WhatsApp Broadcast — Monthly offer',
        text: `Namaste 🙏

Jan Seva Kendra se update:

1️⃣ Website / App banwana — ${SITE_URL}/build-website
2️⃣ Free online tools — ${SITE_URL}/tools
3️⃣ CSC services Etawah — PAN, certificate, Aadhaar

Free quote: WhatsApp ${WHATSAPP}
Call: ${PHONE}

Dhanyavaad!`,
      },
      {
        id: 'yt-website',
        platform: 'YouTube',
        title: 'YouTube Video Description',
        text: `Professional Website & App Development — Jan Seva Kendra

In this video we explain how to get a business website that brings customers from Google.

🔗 Get FREE Website Quote: ${SITE_URL}/build-website
🌍 Worldwide (USA, UK, Russia, UAE): ${SITE_URL}/website-world
🛠️ Free Online Tools: ${SITE_URL}/tools
📍 Etawah CSC Center: ${SITE_URL}

Contact:
WhatsApp: ${WHATSAPP} (${WHATSAPP_LINK})
Call: ${PHONE}
Instagram: ${INSTAGRAM}

Services: Business Website | E-commerce | Mobile App | Custom Software | SEO

#WebDevelopment #WebsiteBanwana #JanSevaKendra #SmallBusiness #DigitalMarketing

---
Subscribe for more tips on growing your business online!`,
      },
      {
        id: 'linkedin-global',
        platform: 'LinkedIn',
        title: 'LinkedIn — B2B Global post',
        text: `Looking for a reliable remote web development partner?

Jan Seva Kendra delivers professional websites, e-commerce platforms, and custom software for businesses across 65+ countries — at 50–70% lower cost than local agencies.

What we offer:
→ Responsive business websites with SEO
→ E-commerce with payment integration
→ Mobile apps (Android/iOS)
→ Direct WhatsApp communication — no agency middlemen

Trusted by clients in India, USA, UK, UAE, and beyond.

Free project quote within 24 hours.

Learn more: ${SITE_URL}/website-world
Contact: ${WHATSAPP_LINK}

#WebDevelopment #Outsourcing #RemoteTeam #SmallBusiness #DigitalTransformation #ITServices`,
      },
      {
        id: 'twitter-x',
        platform: 'Twitter / X',
        title: 'Short post — Website dev',
        text: `Need a professional website without breaking the bank?

We build business sites, e-commerce & apps — worldwide delivery from India.

Free quote → ${SITE_URL}/build-website
WhatsApp ${WHATSAPP}

#WebDev #SmallBusiness #WebsiteDesign`,
      },
      {
        id: 'fb-csc-etawah',
        platform: 'Facebook',
        title: 'CSC / Jan Seva — Local Etawah',
        text: `🏛️ Jan Seva Kendra — Etawah, Bharthana

Sarkari aur digital seva ek jagah:
• PAN card apply
• Income / caste certificate
• Ration card help
• Aadhaar address update (Etawah)

📍 Mandi Trihaa, Bidhuna Road, Bharthana, Etawah
📞 ${PHONE} | WhatsApp ${WHATSAPP}

Website & App bhi banate hain:
${SITE_URL}

#JanSevaKendra #CSC #Etawah #EtawahNews #DigitalSeva #PANcard`,
      },
      {
        id: 'ig-story-text',
        platform: 'Instagram Story',
        title: 'Story text overlay (short)',
        text: `Website = Google par customers 🔥
FREE quote on WhatsApp
${WHATSAPP}
Link 👆 bio me`,
      },
      {
        id: 'directory-listing',
        platform: 'Directory / Forum',
        title: 'Business directory listing (JustDial style copy)',
        text: `Business Name: Jan Seva Kendra
Category: Website Development, CSC Center, IT Services
Address: Mandi Trihaa, Bidhuna Road, Bharthana, Etawah, UP 206241
Phone: ${PHONE}
WhatsApp: ${WHATSAPP}
Website: ${SITE_URL}
Services: Website development, mobile app, e-commerce, PAN card, certificates, free online tools
Areas served: India (780+ cities), USA, UK, Russia, UAE, 65+ countries`,
      },
    ],
    checklist: [
      'Har hafte kam se kam 2 Facebook posts — site link ke saath',
      'Instagram par 3 reels/posts per week — bio me site link',
      'WhatsApp status roz ya alternate day — tools + website link',
      'YouTube video description me hamesha 3 links (build-website, tools, contact)',
      'LinkedIn par mahine me 2 professional posts',
      'JustDial / IndiaMART / Sulekha par listing with website URL',
      'Har post me same URL use karein: https://www.jan-seva.site (backlink consistency)',
    ],
    faqs: [
      {
        q: 'Backlink kya hai aur kyun zaroori hai?',
        a: 'Jab Facebook, Instagram, YouTube, ya koi aur site aapki site ka link lagati hai — Google use "trust signal" samajhta hai. Zyada quality backlinks = better ranking = zyada customers.',
      },
      {
        q: 'Kitni baar post karein?',
        a: 'Consistency matter karti hai: Facebook 2x/week, Instagram 3x/week, WhatsApp status daily/alternate. Same templates rotate karein — thoda text change karke fresh rakhein.',
      },
      {
        q: 'Kya paid ads bhi chahiye?',
        a: 'Shuru me organic (free) posts + Search Console enough hai. Budget ho to Facebook/Instagram ads Etawah local area target kar sakte hain — website development ke liye Rs 200–500/day se start.',
      },
    ],
  },
]

export function getGrowthGuideBySlug(slug: string): GrowthGuide | undefined {
  return GROWTH_GUIDES.find((g) => g.slug === slug)
}
