/**
 * Master SEO catalogue for every public-facing tool on jan-seva.site.
 *
 * One file, one shape, used by:
 *   • app/sitemap.ts          — emits every URL with priority + lastmod
 *   • components/seo/ToolJsonLd — emits SoftwareApplication / BreadcrumbList
 *   • app/guides/[slug]       — long-form how-to + FAQ pages
 *   • app/tools/page.tsx      — landing-card descriptions
 *
 * If you add a new tool, add it HERE first. The rest of the site will
 * pick it up automatically.
 */

import { CONVERTER_TOOLS } from '@/lib/converter/tools';

export const SITE_ORIGIN = 'https://www.jan-seva.site';

export interface SeoTool {
  /** Stable id; also used as the guide slug. */
  slug: string;
  /** Public URL path, e.g. `/cash-counter`. */
  path: string;
  /** Concise, search-friendly title (the &lt;title&gt; tag). */
  title: string;
  /** Tagline shown in OG description / SERPs. */
  description: string;
  /** SEO keywords; first one is the primary head term. */
  keywords: string[];
  /** Audience labels for "who is this for" sections. */
  audience: string[];
  /** Step-by-step usage (becomes HowTo schema in guides). */
  steps: { name: string; text: string }[];
  /** FAQ pairs (become FAQPage schema in guides). */
  faqs: { q: string; a: string }[];
  /** Sitemap priority 0–1. Top tools at 0.95. */
  priority: number;
  /** Sitemap changefreq. */
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  /** Optional category for grouping. */
  category: 'pdf' | 'image' | 'document' | 'finance' | 'career' | 'utility';
}

export const SEO_TOOLS: SeoTool[] = [
  // ──────────────────────────────────────────────────────────────────
  // CASH COUNTER
  // ──────────────────────────────────────────────────────────────────
  {
    slug: 'cash-counter',
    path: '/cash-counter',
    title: 'Cash & Note Counter — ₹500, ₹200, ₹100 ki ginti aur total | Free Online',
    description:
      'Free online cash counter — ₹500, ₹200, ₹100, ₹50, ₹20, ₹10 notes ki ginti daalo, total ₹ aur shabdon mein turant. Shopkeeper, CSC, bank, kirana store ke liye.',
    keywords: [
      'cash counter online',
      'note counter india',
      'paise count karne wala tool',
      'rupee note counter',
      'currency counter free',
      'shopkeeper cash calculator',
      'denomination calculator india',
      'cash count receipt pdf',
      'kirana store hisab',
      'jan seva kendra cash counter',
    ],
    audience: ['Shopkeepers', 'CSC operators', 'Bank cashiers', 'Kirana stores', 'Petrol pumps'],
    steps: [
      {
        name: 'Open the cash counter tool',
        text: 'jan-seva.site/cash-counter par jaayein — koi sign-up nahi, koi app install nahi.',
      },
      {
        name: 'Har denomination ke saamne ginti likhein',
        text: '₹500, ₹200, ₹100, ₹50, ₹20, ₹10 — jitne notes hain, number daalein.',
      },
      {
        name: 'Total auto calculate hoga',
        text: 'Tool turant total ₹ dikhayega aur saath mein words mein bhi (English + Hindi).',
      },
      {
        name: 'Receipt download karein',
        text: 'Download PDF Receipt button dabaayein — A4 receipt save ho jaayegi, WhatsApp/email pe bhejein.',
      },
    ],
    faqs: [
      {
        q: 'Kya cash counter free hai?',
        a: 'Haan, bilkul free. Koi limit nahi, koi ad nahi, koi sign-up nahi.',
      },
      {
        q: 'Kya mera data save hota hai?',
        a: 'Nahi. Saari counting browser ke andar hoti hai — server pe kuch nahi jaata. Privacy 100%.',
      },
      {
        q: 'Kya PDF receipt mein business name aata hai?',
        a: 'Haan, header mein Arpit Jan Seva Kendra ka logo + address + phone hota hai.',
      },
      {
        q: 'Kya total ko hide kar sakte hain?',
        a: 'Haan, ek toggle hai — counting karte waqt total chhipa rakh sakte ho privacy ke liye.',
      },
    ],
    priority: 0.95,
    changefreq: 'weekly',
    category: 'finance',
  },

  // ──────────────────────────────────────────────────────────────────
  // PHOTO RESIZER
  // ──────────────────────────────────────────────────────────────────
  {
    slug: 'photo-resizer',
    path: '/photo-resizer',
    title: 'Sarkari Photo & Signature Resizer — 20KB / 50KB Compress Free',
    description:
      'UP Police, SSC, RRB, Banking exam ke liye photo aur signature 20KB / 50KB tak compress karein free. JPG / PNG resize, no quality loss, instant download.',
    keywords: [
      'photo resize 20kb',
      'signature resize 50kb',
      'sarkari photo resizer',
      'ssc photo size resizer',
      'up police photo resize',
      'rrb photo resize',
      'banking exam photo resize',
      'jpg compressor 20kb',
      'free photo resize online',
      'jan seva photo resize',
    ],
    audience: ['Sarkari exam aspirants', 'Students', 'Job applicants', 'Banking candidates'],
    steps: [
      { name: 'Photo / signature upload karein', text: 'Drag-drop ya click karke JPG/PNG file daalein.' },
      { name: 'Target size choose karein', text: '20KB, 50KB, 100KB ya custom — apne form ki requirement ke hisaab se.' },
      { name: 'Auto-compress', text: 'Tool quality maintain karte hue size compress karega.' },
      { name: 'Download karein', text: 'Compressed photo seedha download — form pe upload kar do.' },
    ],
    faqs: [
      {
        q: 'Kaunse forms ke liye yeh tool useful hai?',
        a: 'UP Police, SSC CGL/CHSL, RRB NTPC/Group D, IBPS PO/Clerk, SBI exams, UPSC, state board exams — sabhi.',
      },
      {
        q: 'Kya photo ki quality kharab hoti hai?',
        a: 'Nahi. Tool smart compression use karta hai — visible quality loss nahi hota.',
      },
      {
        q: 'Kya signature ke liye bhi kaam karta hai?',
        a: 'Haan, signature ko 10KB-30KB tak compress kar sakte ho.',
      },
      {
        q: 'Kya mobile pe chalta hai?',
        a: 'Haan, mobile aur desktop dono pe chalta hai. Mobile pe gallery se direct upload kar sakte ho.',
      },
    ],
    priority: 0.95,
    changefreq: 'weekly',
    category: 'image',
  },

  // ──────────────────────────────────────────────────────────────────
  // IMAGE BACKGROUND CHANGER
  // ──────────────────────────────────────────────────────────────────
  {
    slug: 'image-background-changer',
    path: '/image-background-changer',
    title: 'Change Image Background Online — White, Blue, Grey | Free remove.bg Alternative',
    description:
      'Photo ka background remove karein aur White, Blue ya Grey official color lagaayein. SSC, UP Police, NEET, passport size ke liye. Free, no watermark.',
    keywords: [
      'change image background free',
      'remove background online',
      'white background photo maker',
      'blue background photo',
      'passport photo background change',
      'ssc photo background',
      'up police photo background',
      'neet photo background',
      'remove.bg alternative',
      'photo background changer free',
    ],
    audience: ['Sarkari exam aspirants', 'Passport applicants', 'Students', 'Job seekers'],
    steps: [
      { name: 'Photo upload karein', text: 'JPG/PNG photo drag-drop ya click karke daalein.' },
      { name: 'Auto background removal', text: 'AI tool background ko apne aap remove karega.' },
      { name: 'Naya color choose karein', text: 'White (passport), Blue (SSC), Grey (corporate) — ek click mein lagao.' },
      { name: 'Download karein', text: 'Final photo HD quality mein save karein.' },
    ],
    faqs: [
      {
        q: 'Kya yeh remove.bg jaisa hai?',
        a: 'Haan, lekin bilkul free aur unlimited. Watermark nahi aata.',
      },
      {
        q: 'Kya passport size ke liye chalega?',
        a: 'Haan, white background passport photos ke liye perfect hai.',
      },
      {
        q: 'SSC ke liye konsa background?',
        a: 'SSC officially white ya light blue accept karta hai — dono options available hain.',
      },
      {
        q: 'Kya custom color le sakte hain?',
        a: 'Haan, hex code ya color picker se koi bhi color choose kar sakte ho.',
      },
    ],
    priority: 0.9,
    changefreq: 'weekly',
    category: 'image',
  },

  // ──────────────────────────────────────────────────────────────────
  // PDF EDITOR
  // ──────────────────────────────────────────────────────────────────
  {
    slug: 'pdf-editor',
    path: '/pdf-editor',
    title: 'Free Online PDF Editor & Signer — Edit Text, Sign, Highlight | Adobe Alternative',
    description:
      'Upload any PDF and edit text by clicking — add signature, highlight, whiteout, fill forms, OCR for scanned PDFs. Free Adobe Acrobat alternative.',
    keywords: [
      'online pdf editor',
      'edit pdf text free',
      'pdf signer online',
      'add signature to pdf',
      'fill pdf form online',
      'highlight pdf text',
      'adobe acrobat alternative',
      'free pdf editor india',
      'pdf editor mobile',
      'jan seva pdf editor',
    ],
    audience: ['Office workers', 'Students', 'CSC operators', 'Lawyers', 'Accountants'],
    steps: [
      { name: 'PDF upload karein', text: 'Editor pe PDF drag karein ya click karke select karein.' },
      { name: 'Text par click karke edit karein', text: 'Adobe Acrobat jaise — direct text par click karo aur change karo.' },
      { name: 'Signature, highlight, whiteout add karein', text: 'Toolbar se signature draw karo, important parts highlight karo.' },
      { name: 'Save & download', text: 'Edited PDF ko original quality mein download karein.' },
    ],
    faqs: [
      {
        q: 'Kya scanned PDF edit kar sakte hain?',
        a: 'Haan, OCR built-in hai — scanned PDF ka text recognize hoke editable ho jaata hai.',
      },
      {
        q: 'Kya signature add kar sakte hain?',
        a: 'Haan, type, draw ya upload karke signature add karein. PDF agreement, NOC, application form sab pe lagao.',
      },
      {
        q: 'Kya yeh free hai?',
        a: 'Bilkul free. Koi watermark nahi, koi page limit nahi.',
      },
      {
        q: 'Kya mera PDF safe hai?',
        a: 'Haan, processing browser ke andar hoti hai. File server pe permanently store nahi hoti.',
      },
    ],
    priority: 0.95,
    changefreq: 'weekly',
    category: 'pdf',
  },

  // ──────────────────────────────────────────────────────────────────
  // FILE CONVERTER (HUB)
  // ──────────────────────────────────────────────────────────────────
  {
    slug: 'file-converter',
    path: '/file-converter',
    title: 'All-in-One File Converter — PDF, Image, 20+ Tools Free | Jan Seva Kendra',
    description:
      'PDF to JPG, JPG to PDF, Merge PDF, Split PDF, Compress PDF, Watermark, Protect — 20+ free file conversion tools. Batch jobs aur ZIP download.',
    keywords: [
      'free file converter online',
      'pdf converter free',
      'pdf to jpg converter',
      'jpg to pdf converter',
      'merge pdf online',
      'compress pdf online',
      'split pdf free',
      'image converter online',
      'all in one file converter',
      'free pdf tools',
    ],
    audience: ['Students', 'Office workers', 'CSC operators', 'Designers', 'Sarkari applicants'],
    steps: [
      { name: 'Tool choose karein', text: 'Search bar mein tool ka naam likhein ya category se browse karein.' },
      { name: 'File upload karein', text: 'Single ya multiple files drag-drop karein.' },
      { name: 'Convert dabayein', text: 'Tool turant convert karega — batch ke liye ZIP banayega.' },
      { name: 'Download', text: 'Output file ya ZIP archive download karein.' },
    ],
    faqs: [
      {
        q: 'Kitne tools available hain?',
        a: '20+ tools — PDF to JPG/PNG/Text, JPG/PNG to PDF, Merge, Split, Compress, Rotate, Watermark, Protect, Unlock aur image format conversions.',
      },
      {
        q: 'Kya batch processing chalti hai?',
        a: 'Haan, multiple files ek saath upload karke ek hi ZIP mein download kar sakte ho.',
      },
      {
        q: 'Maximum file size kya hai?',
        a: 'Free version mein 50MB tak. Bade files ke liye contact form bharein.',
      },
      {
        q: 'Kya files store hoti hain?',
        a: 'Nahi. Conversion ke baad temporary files auto-delete ho jaati hain.',
      },
    ],
    priority: 0.95,
    changefreq: 'weekly',
    category: 'pdf',
  },

  // ──────────────────────────────────────────────────────────────────
  // RESUME BUILDER
  // ──────────────────────────────────────────────────────────────────
  {
    slug: 'resume-builder',
    path: '/resume-builder',
    title: 'AI Resume Builder — Free Premium CV Maker | 20+ Templates, ATS Score, PDF Download',
    description:
      'Build a premium resume in minutes — 20+ professional templates, AI summary writer, ATS score checker, live preview, A4 PDF export. 100% free.',
    keywords: [
      'free resume builder',
      'cv maker online',
      'ai resume builder',
      'ats resume checker',
      'professional cv templates',
      'resume builder india',
      'free pdf resume',
      'fresher resume builder',
      'job resume maker',
      'jan seva resume builder',
    ],
    audience: ['Freshers', 'Job seekers', 'Students', 'Career changers', 'IT professionals'],
    steps: [
      { name: 'Template choose karein', text: '20+ professional templates mein se apne field ke hisaab se select karein.' },
      { name: 'Details fill karein', text: 'Personal info, education, experience, skills, projects — sab live preview ke saath.' },
      { name: 'AI ki help lein', text: 'Summary aur skills section AI auto-generate kar sakta hai.' },
      { name: 'PDF download karein', text: 'A4 print-ready resume one-click PDF download.' },
    ],
    faqs: [
      {
        q: 'Kya yeh resume builder free hai?',
        a: 'Haan, bilkul free. Sabhi templates aur features unlock hain — koi watermark nahi.',
      },
      {
        q: 'ATS score kya hota hai?',
        a: 'Applicant Tracking System (ATS) machines resume scan karti hain. Hamara checker batata hai aapka resume ATS-friendly hai ya nahi.',
      },
      {
        q: 'Kya draft save hoga?',
        a: 'Haan, account banane ke baad sab kuch auto-save hota hai. Jab chahein resume edit kar sakte ho.',
      },
      {
        q: 'Kya printable A4 milta hai?',
        a: 'Haan, exact A4 size, high-res PDF — directly print ya email kar sakte ho.',
      },
    ],
    priority: 0.95,
    changefreq: 'weekly',
    category: 'career',
  },

  // ──────────────────────────────────────────────────────────────────
  // TOOLS LANDING PAGE
  // ──────────────────────────────────────────────────────────────────
  {
    slug: 'tools',
    path: '/tools',
    title: 'Free Digital Tools — Photo Resizer, PDF Editor, Cash Counter, File Converter',
    description:
      'Sabhi free online tools ek jagah — photo resize, PDF edit, cash count, file convert, resume build, background change. Jan Seva Kendra Etawah.',
    keywords: [
      'free online tools india',
      'jan seva kendra tools',
      'sarkari tools',
      'free photo tools',
      'free pdf tools',
      'all in one tools',
      'digital tools etawah',
      'free utility tools',
    ],
    audience: ['Students', 'Office workers', 'Job applicants', 'Shopkeepers', 'CSC operators'],
    steps: [
      { name: 'Tool select karein', text: 'Page pe sabhi tools cards mein dikhte hain — apna tool chunein.' },
      { name: 'Tool ki guide padhein', text: 'Har tool ka detailed guide /guides ke andar hai.' },
      { name: 'Use karein', text: 'Open karke directly use karein — koi sign-up zaroori nahi.' },
    ],
    faqs: [
      {
        q: 'Kitne tools hain?',
        a: '6 main tools — Photo Resizer, PDF Editor, Cash Counter, File Converter (20+ sub-tools), Background Changer, Resume Builder.',
      },
      {
        q: 'Kya sab free hain?',
        a: 'Haan, sab tools 100% free hain. Koi paid tier nahi.',
      },
      {
        q: 'Kya app install karni padegi?',
        a: 'Nahi. Sab tools browser mein chalte hain — mobile aur desktop dono.',
      },
    ],
    priority: 0.9,
    changefreq: 'weekly',
    category: 'utility',
  },
];

/**
 * Sub-tools under /file-converter/[toolId]. We pull names from the
 * existing converter catalogue so the SEO catalogue stays in sync
 * automatically as tools are added or removed.
 */
export interface SeoSubTool {
  slug: string;
  path: string;
  title: string;
  description: string;
}

export const FILE_CONVERTER_SUB_TOOLS: SeoSubTool[] = CONVERTER_TOOLS.map((tool) => ({
  slug: tool.id,
  path: `/file-converter/${tool.id}`,
  title: `${tool.name} — Free Online Converter | Jan Seva Kendra`,
  description: tool.description,
}));

export function getSeoToolBySlug(slug: string): SeoTool | undefined {
  return SEO_TOOLS.find((t) => t.slug === slug);
}
