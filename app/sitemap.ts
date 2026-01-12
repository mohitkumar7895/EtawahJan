import { MetadataRoute } from 'next'
import { connectDB, isDBConnected } from '@/lib/db'
import Blog from '@/models/Blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.jan-seva.site/'
  
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
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
  ]

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
        url: `${baseUrl}blog/${blog.slug}`,
        lastModified: blog.updatedAt || blog.publishedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))

      return [...staticPages, ...blogPages]
    }
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error)
  }

  return staticPages
}







