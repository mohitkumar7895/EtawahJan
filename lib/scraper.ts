import axios from 'axios';
import https from 'https';
import * as cheerio from 'cheerio';
import { connectDB } from './db';
import Vacancy from '@/models/Vacancy';
import Notification from '@/models/Notification';
import { buildShortNotification, internalJobLink } from './vacancyNotifications';
import {
  extractAgeFromText,
  extractDateFromText,
  extractPostsFromText,
  cleanQualification,
  defaultDocuments,
} from './sanitizeJobFields';

export const ITEMS_PER_CATEGORY = 15;

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

const SOURCES = [
  {
    category: 'Vacancies' as const,
    urls: [
      'https://www.sarkariexam.com/category/top-online-form/',
      'https://www.sarkariresult.com/latestjob/',
    ],
  },
  {
    category: 'Results' as const,
    urls: [
      'https://www.sarkariexam.com/category/exam-result/',
      'https://www.sarkariresult.com/result/',
    ],
  },
  {
    category: 'Admit Cards' as const,
    urls: [
      'https://www.sarkariexam.com/category/admit-card/',
      'https://www.sarkariresult.com/admitcard/',
    ],
  },
];

const FETCH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml',
};

const fetchConfig = {
  headers: FETCH_HEADERS,
  timeout: 15000,
  // Windows/dev SSL chains sometimes fail; required for live SarkariExam fetch
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
};

export interface ListingPost {
  title: string;
  url: string;
  lastDate: string;
}

export function parseCategoryListings(html: string, sourceUrl = 'https://www.sarkariexam.com/'): ListingPost[] {
  const $ = cheerio.load(html);
  const posts: ListingPost[] = [];
  const seen = new Set<string>();

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')?.trim();
    const title = $(el).text().replace(/\s+/g, ' ').trim();
    if (!href || !title || title.length < 8) return;

    let url = '';
    try {
      const parsed = new URL(href, sourceUrl);
      const supportedHost =
        parsed.hostname.includes('sarkariexam.com') || parsed.hostname.includes('sarkariresult.com');
      if (!supportedHost) return;
      url = parsed.toString();
    } catch {
      return;
    }

    const normalizedPath = new URL(url).pathname.toLowerCase();
    if (
      normalizedPath === '/' ||
      normalizedPath.includes('/category/') ||
      normalizedPath.includes('/tag/') ||
      normalizedPath.includes('/author/') ||
      normalizedPath.includes('/page/') ||
      normalizedPath.includes('/latestjob/') ||
      normalizedPath.includes('/result/') ||
      normalizedPath.includes('/admitcard/') ||
      href.includes('#')
    ) {
      return;
    }

    try {
      if (!new URL(url).pathname.split('/').filter(Boolean).length) return;
    } catch {
      return;
    }
    if (seen.has(url)) return;
    seen.add(url);

    const container = $(el).closest('li').length ? $(el).closest('li') : $(el).parent();
    const blockText = container.text().replace(/\s+/g, ' ').trim();
    const dateMatch = blockText.match(/Last Date\s*:\s*(.+)$/i);
    const lastDate = dateMatch ? extractDateFromText(dateMatch[1]) || dateMatch[1].trim().slice(0, 40) : '';

    posts.push({ title, url, lastDate });
  });

  return posts.slice(0, ITEMS_PER_CATEGORY);
}

async function fetchListingsFromSource(source: (typeof SOURCES)[number]): Promise<ListingPost[]> {
  let lastError = '';

  for (const url of source.urls) {
    try {
      const { data } = await axios.get(url, fetchConfig);
      const listings = parseCategoryListings(data, url);
      if (listings.length) {
        if (url !== source.urls[0]) {
          console.log(`✅ ${source.category}: using fallback source ${url}`);
        }
        return listings;
      }
      lastError = `No listings found at ${url}`;
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : String(err);
      console.error(`❌ ${source.category} source failed ${url}:`, lastError);
    }
  }

  console.error(`❌ ${source.category}: all sources failed. Last error: ${lastError}`);
  return [];
}

function parseTableField(label: string, value: string): Partial<Record<string, string>> {
  const l = label.toLowerCase();
  const v = value.trim();
  if (!v || v.length > 150) return {};

  if (l.includes('start') && l.includes('date')) return { startDate: v };
  if (l.includes('last') || l.includes('closing') || l.includes('end date')) return { lastDate: v };
  if (l.includes('age')) return { ageLimit: v };
  if (l.includes('post') || l.includes('vacancy') || l.includes('भर्ती')) return { totalPosts: v };
  if (l.includes('qualification') || l.includes('eligibility') || l.includes('education')) {
    return { qualification: v };
  }
  if (l.includes('document')) return { requiredDocuments: v };
  return {};
}

function extractDocumentsFromHtml($: cheerio.CheerioAPI): string {
  const items: string[] = [];
  $('h2, h3, h4, strong, b').each((_, el) => {
    const heading = $(el).text().toLowerCase();
    if (!heading.includes('document') && !heading.includes('required')) return;
    $(el)
      .nextAll('ul, ol')
      .first()
      .find('li')
      .each((__, li) => {
        const t = $(li).text().replace(/\s+/g, ' ').trim();
        if (t.length > 2 && t.length < 100) items.push(t);
      });
  });
  if (items.length >= 2) return items.join(', ');
  return '';
}

async function scrapeDetailPage(url: string) {
  try {
    const { data } = await axios.get(url, { ...fetchConfig, timeout: 12000 });
    const $ = cheerio.load(data);

    const raw: Record<string, string> = {
      startDate: '',
      lastDate: '',
      ageLimit: '',
      totalPosts: '',
      qualification: '',
      requiredDocuments: extractDocumentsFromHtml($),
    };

    $('table tr').each((_, row) => {
      const cells = $(row)
        .find('td, th')
        .map((__, c) => $(c).text().replace(/\s+/g, ' ').trim())
        .get()
        .filter(Boolean);
      if (cells.length >= 2) {
        const parsed = parseTableField(cells[0], cells[cells.length - 1]);
        Object.assign(raw, parsed);
      }
    });

    const pageText = $('.entry-content').text().replace(/\s+/g, ' ');

    const startM = pageText.match(
      /(?:application\s+)?start\s+date\s*[:\-–]\s*([^|\n]+?)(?=last|closing|age|qualification|$)/i
    );
    const lastM = pageText.match(
      /(?:last|closing|final)\s+date\s*[:\-–]\s*([^|\n]+?)(?=start|age|qualification|fee|$)/i
    );
    const ageM = pageText.match(/age\s+limit\s*[:\-–]\s*([^|\n]+?)(?=qualification|fee|apply|$)/i);
    const postsM = pageText.match(
      /(?:total|no\.?|number)\s+of\s+(?:posts?|vacancy)\s*[:\-–]?\s*([\d,]+)/i
    );

    if (startM && !raw.startDate) raw.startDate = startM[1];
    if (lastM && !raw.lastDate) raw.lastDate = lastM[1];
    if (ageM && !raw.ageLimit) raw.ageLimit = ageM[1];
    if (postsM && !raw.totalPosts) raw.totalPosts = postsM[1];

    const firstPara = $('.entry-content p')
      .map((_, p) => $(p).text().trim())
      .get()
      .find((t) => t.length > 40 && !/important question/i.test(t));

    return {
      startDate: extractDateFromText(raw.startDate),
      lastDate: extractDateFromText(raw.lastDate),
      ageLimit: extractAgeFromText(raw.ageLimit),
      totalPosts: extractPostsFromText(raw.totalPosts),
      qualification: cleanQualification(raw.qualification),
      requiredDocuments: raw.requiredDocuments || defaultDocuments().join(', '),
      officialLink: url,
      thumbnail: $('meta[property="og:image"]').attr('content') || '',
      shortDescription: firstPara?.slice(0, 200) || '',
      fullDescription: '',
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`⚠️ Detail scrape failed ${url}:`, message);
    return null;
  }
}

function categoryDefaults(category: (typeof SOURCES)[number]['category'], listing: ListingPost) {
  switch (category) {
    case 'Results':
      return {
        startDate: 'Declared',
        lastDate: extractDateFromText(listing.lastDate) || 'Check result',
        totalPosts: '—',
        qualification: 'Scorecard / merit list',
        requiredDocuments: 'Roll Number, DOB',
      };
    case 'Admit Cards':
      return {
        startDate: 'Available',
        lastDate: extractDateFromText(listing.lastDate) || 'Download',
        totalPosts: '—',
        qualification: 'Hall ticket — login with registration',
        requiredDocuments: 'Registration No., DOB',
      };
    default:
      return {
        startDate: 'जल्द',
        lastDate: extractDateFromText(listing.lastDate) || 'देखें',
        totalPosts: 'Various',
        qualification: 'Notification ke anusar',
        requiredDocuments: defaultDocuments().join(', '),
      };
  }
}

async function pushJobNotification(job: {
  category: (typeof SOURCES)[number]['category'];
  title: string;
  slug: string;
  startDate?: string;
  lastDate?: string;
  ageLimit?: string;
  totalPosts?: string;
}) {
  try {
    const short = buildShortNotification(job);
    await Notification.create({
      title: short.title,
      message: short.message,
      type: 'vacancy',
      link: internalJobLink(job.category, job.slug),
      isActive: true,
    });
  } catch {
    /* non-blocking */
  }
}

async function upsertListing(
  category: (typeof SOURCES)[number]['category'],
  listing: ListingPost
) {
  const slug = slugify(listing.title);
  const defaults = categoryDefaults(category, listing);

  let existing =
    (await Vacancy.findOne({ sourceUrl: listing.url })) || (await Vacancy.findOne({ slug }));

  if (existing) {
    const changed =
      existing.title !== listing.title ||
      (listing.lastDate && existing.lastDate !== listing.lastDate);

    existing.title = listing.title;
    if (listing.lastDate) {
      const d = extractDateFromText(listing.lastDate);
      if (d) existing.lastDate = d;
    }
    existing.isNew = !!changed;
    existing.sourceUrl = listing.url;
    existing.sourceType = 'scraped';
    await existing.save();
    if (changed) {
      await pushJobNotification({
        category,
        title: existing.title,
        slug: existing.slug,
        startDate: existing.startDate,
        lastDate: existing.lastDate,
        ageLimit: existing.ageLimit,
        totalPosts: existing.totalPosts,
      });
    }
    return { action: changed ? 'updated' : 'skipped' } as const;
  }

  const details = await scrapeDetailPage(listing.url);

  let uniqueSlug = slug;
  let counter = 1;
  while (await Vacancy.findOne({ slug: uniqueSlug })) {
    uniqueSlug = `${slug}-${counter++}`;
  }

  const jobData = {
    title: listing.title,
    slug: uniqueSlug,
    category,
    sourceUrl: listing.url,
    shortDescription: details?.shortDescription || `${listing.title} — Jan Seva Kendra par details`,
    fullDescription: '',
    startDate: details?.startDate || defaults.startDate,
    lastDate: details?.lastDate || defaults.lastDate,
    ageLimit: details?.ageLimit || 'नियमानुसार',
    totalPosts: details?.totalPosts || defaults.totalPosts,
    qualification: details?.qualification || defaults.qualification,
    requiredDocuments: details?.requiredDocuments || defaults.requiredDocuments,
    officialLink: listing.url,
    thumbnail: details?.thumbnail || '',
    sourceType: 'scraped' as const,
    isNew: true,
  };

  try {
    const doc = await Vacancy.create(jobData);
    await pushJobNotification({
      category,
      title: doc.title,
      slug: doc.slug,
      startDate: doc.startDate,
      lastDate: doc.lastDate,
      ageLimit: doc.ageLimit,
      totalPosts: doc.totalPosts,
    });
    return { action: 'created' } as const;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('duplicate') || message.includes('E11000')) {
      return { action: 'skipped' } as const;
    }
    throw err;
  }
}

async function pruneCategory(
  category: (typeof SOURCES)[number]['category'],
  keepUrls: string[]
) {
  const scraped = await Vacancy.find({ category, sourceType: 'scraped' }).sort({ updatedAt: -1 });
  const toRemove = scraped.filter((p) => p.sourceUrl && !keepUrls.includes(p.sourceUrl));
  if (toRemove.length > 0) {
    await Vacancy.deleteMany({ _id: { $in: toRemove.map((p) => p._id) } });
  }
  const remaining = await Vacancy.find({ category }).sort({ updatedAt: -1 });
  if (remaining.length > ITEMS_PER_CATEGORY) {
    const excess = remaining.slice(ITEMS_PER_CATEGORY);
    await Vacancy.deleteMany({ _id: { $in: excess.map((p) => p._id) } });
  }
}

type JobCategory = (typeof SOURCES)[number]['category'];

function listingToJob(listing: ListingPost, category: JobCategory) {
  return {
    title: listing.title,
    slug: slugify(listing.title),
    category,
    sourceUrl: listing.url,
    officialLink: listing.url,
    lastDate: listing.lastDate || '',
    shortDescription: listing.title,
    isNew: true,
    sourceType: 'scraped' as const,
    liveOnly: true,
  };
}

/** Direct SarkariExam fetch when DB is empty or unreachable — shows data immediately */
export async function fetchLiveHomeFeed() {
  const result = {
    vacancies: [] as ReturnType<typeof listingToJob>[],
    admitCards: [] as ReturnType<typeof listingToJob>[],
    results: [] as ReturnType<typeof listingToJob>[],
    lastSyncAt: new Date().toISOString(),
    refreshHours: 6,
    live: true as const,
  };

  for (const source of SOURCES) {
    try {
      const items = (await fetchListingsFromSource(source))
        .slice(0, 5)
        .map((l) => listingToJob(l, source.category));
      if (source.category === 'Vacancies') result.vacancies = items;
      if (source.category === 'Admit Cards') result.admitCards = items;
      if (source.category === 'Results') result.results = items;
    } catch (err: unknown) {
      console.error(`❌ Live fetch ${source.category}:`, err instanceof Error ? err.message : err);
    }
  }

  return result;
}

export async function fetchLiveCategoryJobs(category: JobCategory, limit = ITEMS_PER_CATEGORY) {
  const source = SOURCES.find((s) => s.category === category);
  if (!source) return [];

  try {
    return (await fetchListingsFromSource(source))
      .slice(0, limit)
      .map((l) => listingToJob(l, source.category));
  } catch (err: unknown) {
    console.error(`❌ Live fetch ${category}:`, err instanceof Error ? err.message : err);
    return [];
  }
}

export async function fetchAllLiveJobs(limit = ITEMS_PER_CATEGORY) {
  const all: ReturnType<typeof listingToJob>[] = [];
  for (const source of SOURCES) {
    const items = await fetchLiveCategoryJobs(source.category, limit);
    all.push(...items);
  }
  return all.sort((a, b) => a.title.localeCompare(b.title));
}

export async function scrapeLatestJobs() {
  console.log('🚀 SarkariExam sync started...');
  await connectDB();

  let created = 0;
  let updated = 0;

  for (const source of SOURCES) {
    try {
      const listings = await fetchListingsFromSource(source);
      if (!listings.length) continue;

      await Vacancy.updateMany({ category: source.category, sourceType: 'scraped' }, { isNew: false });

      const keepUrls: string[] = [];
      for (const listing of listings) {
        keepUrls.push(listing.url);
        const result = await upsertListing(source.category, listing);
        if (result.action === 'created') created++;
        if (result.action === 'updated') updated++;
        await new Promise((r) => setTimeout(r, 400));
      }
      await pruneCategory(source.category, keepUrls);
    } catch (err: unknown) {
      console.error(`❌ ${source.category}:`, err instanceof Error ? err.message : err);
    }
  }

  const syncedAt = new Date();
  console.log(`🏁 Sync done at ${syncedAt.toISOString()}. New: ${created}, Updated: ${updated}`);
  return { created, updated, syncedAt: syncedAt.toISOString() };
}
