# SEO किस-किस फाइल में होता है (SEO Files Guide)

ये वो फाइलें हैं जिनमें बदलाव करने से आपकी साइट का **Google Search / SEO** बेहतर होता है।

---

## 1. **app/layout.tsx** (सबसे ज़्यादा ज़रूरी)

- **Title** – पूरी साइट का default title (Google में दिखता है)
- **Description** – पूरी साइट का meta description (search result में नीचे वाली लाइन)
- **Keywords** – सारे important keywords (jan seva kendra near me, csc center, aadhar update, etc.)
- **Open Graph** – Facebook/WhatsApp share करने पर दिखने वाला title, description, image
- **Twitter Card** – Twitter share पर दिखने वाला title, description
- **LocalBusiness Schema (JSON-LD)** – Google को बताता है: business name, address, phone, area served (Etawah, Bharthana, Agra, Kanpur…), opening hours, services
- **Extra meta tags** – geo (location), telephone, address, language, robots

**क्या बदलें:** Title, description, keywords में नए शहर/सर्विस जोड़ सकते हो। Schema में address/phone/areaServed update कर सकते हो।

---

## 2. **app/page.tsx** (होमपेज)

- **metadata** – होमपेज का अलग title, description, keywords, openGraph, canonical URL

**क्या बदलें:** होमपेज के लिए अलग title/description चाहिए तो यहाँ बदलो। बाकी pages के लिए layout का template use होता है।

---

## 3. **app/services/page.tsx** (सर्विसेज़ पेज)

- **metadata** – Services पेज का title, description, openGraph

**क्या बदलें:** "Aadhaar, PAN, Ration Card" जैसे service keywords यहाँ डालो। SEO बेहतर होगा।

---

## 4. **app/about/page.tsx** (अबाउट पेज)

- **metadata** – About पेज का title, description, openGraph

**क्या बदलें:** "Government authorized", "CSC Etawah" जैसे trust words यहाँ रख सकते हो।

---

## 5. **app/faq/page.tsx** (FAQ पेज)

- **metadata** – FAQ पेज का title, description, openGraph

**क्या बदलें:** "Aadhaar update", "PAN card apply", "near me" type questions description में डालो।

---

## 6. **app/blog/[slug]/page.tsx** (हर ब्लॉग पोस्ट)

- **generateMetadata()** – हर ब्लॉग पोस्ट का अपना title, description, openGraph, images (database से आता है)

**क्या बदलें:** Admin से ब्लॉग लिखते समय **meta title** और **meta description** भरो। वही SEO में use होता है।

---

## 7. **components/Hero.tsx** (होमपेज का ऊपर वाला हिस्सा)

- **H1 heading** – पेज का मुख्य heading (Google के लिए बहुत important)
- **Subtext** – "Same Day Work • No Agent Required" जैसी लाइनें

**क्या बदलें:** H1 में business name + location रखो। ज़्यादा long न करो।

---

## 8. **components/FAQ.tsx** (FAQ कंटेंट + Schema)

- **FAQ questions/answers** – सवाल-जवाब जो पेज पर दिखते हैं
- **FAQPage Schema (JSON-LD)** – Google को बताता है कि ये FAQ हैं → search में "People also ask" / rich result में आ सकता है

**क्या बदलें:** नए सवाल जोड़ो (जैसे "Aadhaar update near me?", "PAN card apply kaise?"). Schema automatically सारे FAQs use करता है।

---

## 9. **components/BlogPost.tsx** (ब्लॉग पोस्ट पेज)

- **Article Schema (JSON-LD)** – headline, description, author, date, image (Google को article समझने के लिए)

**क्या बदलें:** ज़्यादा नहीं; blog data database से आता है। Schema already setup है।

---

## 10. **app/sitemap.ts** (साइटमैप)

- **Static pages** – Home, About, Services, Contact, Vacancies, Blog, Announcements, FAQ (URLs + priority + changeFrequency)
- **Dynamic blog URLs** – published blog posts की list (database से)

**क्या बदलें:** नया पेज बनाओ तो यहाँ URL add करो। Google को पूरी साइट index करने में मदद मिलती है।

---

## 11. **public/robots.txt**

- **Allow/Disallow** – कौन से URLs Google crawl करे (e.g. /admin, /api block)
- **Sitemap** – sitemap.xml का link

**क्या बदलें:** ज़्यादा नहीं। नया domain हो तो Sitemap URL update करो।

---

## 12. **components/LocalSeoContent.tsx** (अभी होमपेज पर नहीं है)

- लंबा SEO content block था: "Jan Seva Kendra Near Me", FAQ-style Q&A, Call/WhatsApp CTA
- अभी **homepage से हटाया हुआ** है; फाइल बनी हुई है

**क्या करें:** अगर फिर से होमपेज या About पर वो block चाहिए तो इस component को वहाँ import करके use कर सकते हो।

---

## Short summary (कौन सी फाइल किस लिए)

| फाइल | SEO में क्या करता है |
|------|----------------------|
| **app/layout.tsx** | Site-wide title, description, keywords, Open Graph, LocalBusiness schema |
| **app/page.tsx** | Homepage title & description |
| **app/services/page.tsx** | Services page title & description |
| **app/about/page.tsx** | About page title & description |
| **app/faq/page.tsx** | FAQ page title & description |
| **app/blog/[slug]/page.tsx** | हर blog post का title & description (DB + meta) |
| **components/Hero.tsx** | Homepage H1 (main heading) |
| **components/FAQ.tsx** | FAQ content + FAQ schema (rich results) |
| **components/BlogPost.tsx** | Article schema for blog posts |
| **app/sitemap.ts** | सारे pages का list (Google को index करने में मदद) |
| **public/robots.txt** | Crawl rules + sitemap link |

---

**सबसे ज़्यादा असर:**  
**layout.tsx** (title, description, keywords, schema) और **Hero.tsx** (H1)। इन्हें सही रखो तो SEO सबसे ज़्यादा बेहतर होता है।
