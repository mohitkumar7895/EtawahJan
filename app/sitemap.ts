import { MetadataRoute } from 'next'
import { connectDB, isDBConnected } from '@/lib/db'
import Blog from '@/models/Blog'
import SitemapLink from '@/models/SitemapLink'
import { SEO_TOOLS, FILE_CONVERTER_SUB_TOOLS } from '@/lib/seo/tools-catalog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.jan-seva.site'

  // ── Tool pages — every standalone tool gets its own high-priority
  // entry so Google indexes a deep link straight to the tool, not just
  // the homepage. lastModified is set to "now" on every build so each
  // deploy refreshes the crawl signal.
  const toolPages: MetadataRoute.Sitemap = SEO_TOOLS.map((t) => ({
    url: `${baseUrl}${t.path}`,
    lastModified: new Date(),
    changeFrequency: t.changefreq,
    priority: t.priority,
  }))

  // ── /file-converter/[toolId] — every individual converter is a
  // separate landing target for keywords like "PDF to JPG online".
  const subToolPages: MetadataRoute.Sitemap = FILE_CONVERTER_SUB_TOOLS.map((t) => ({
    url: `${baseUrl}${t.path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // ── /guides hub + per-tool guide pages (long-form HowTo content
  // that internally links back to the tool — the cluster pattern
  // Google rewards).
  const guidePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    ...SEO_TOOLS.map((t) => ({
      url: `${baseUrl}/guides/${t.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/vacancies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/announcements`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/government-links`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/sitemap`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/state-sitemap`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  const UP_DISTRICTS = [
    'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Azamgarh',
    'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 
    'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr',
    'Chandauli', 'Chitrakoot',
    'Deoria',
    'Etah', 'Etawah',
    'Farrukhabad', 'Fatehpur', 'Firozabad',
    'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur',
    'Hamirpur', 'Hapur', 'Hardoi', 'Hathras',
    'Jalaun', 'Jaunpur', 'Jhansi',
    'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar',
    'Lalitpur', 'Lucknow',
    'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 
    'Moradabad', 'Muzaffarnagar',
    'Pilibhit', 'Pratapgarh', 'Prayagraj',
    'Raebareli', 'Rampur',
    'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shrawasti', 
    'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur',
    'Unnao',
    'Varanasi'
  ]

  const districtPages: MetadataRoute.Sitemap = UP_DISTRICTS.map(d => ({
    url: `${baseUrl}/district/${d.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Add blog posts dynamically
  try {
    if (!isDBConnected()) {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL
      if (mongoUri && mongoUri.trim() !== '') {
        await connectDB()
      }
    }

    if (isDBConnected()) {
      const blogs = await Blog.find({ isPublished: true })
        .select('slug updatedAt publishedAt')
        .sort({ publishedAt: -1 })
        .limit(100) // Limit to 100 most recent posts for sitemap
        .lean() as any[]

      const blogPages: MetadataRoute.Sitemap = blogs.map((blog: any) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.updatedAt || blog.publishedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))

      // Fetch custom admin sitemap links dynamically
      let customPages: MetadataRoute.Sitemap = []
      try {
        const customLinks = await SitemapLink.find({ isActive: true }).lean() as any[]
        customPages = customLinks.map((link: any) => {
          let url = link.url;
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
          }
          return {
            url,
            lastModified: link.updatedAt || new Date(),
            changeFrequency: (link.changeFrequency || 'weekly') as any,
            priority: link.priority !== undefined ? link.priority : 0.5,
          }
        })
      } catch (customErr) {
        console.error('Error fetching custom sitemap links:', customErr)
      }

      return [
        ...staticPages,
        ...toolPages,
        ...subToolPages,
        ...guidePages,
        ...blogPages,
        ...customPages,
        ...districtPages,
      ]
    }
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error)
  }

  // Fallback when DB is unavailable: still emit tools + guides so the
  // SEO surface never depends on MongoDB connectivity.
  return [
    ...staticPages,
    ...toolPages,
    ...subToolPages,
    ...guidePages,
    ...districtPages,
  ]
}







