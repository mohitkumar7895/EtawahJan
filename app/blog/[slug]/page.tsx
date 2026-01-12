import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogPostComponent from '@/components/BlogPost';
import type { Metadata } from 'next';
import { connectDB, isDBConnected } from '@/lib/db';
import Blog from '@/models/Blog';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    if (!isDBConnected()) {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
      if (mongoUri && mongoUri.trim() !== '') {
        await connectDB();
      }
    }

    const blog = await Blog.findOne({ slug: params.slug, isPublished: true }).lean() as any;

    if (!blog) {
      return {
        title: 'Blog Post Not Found - Jan Seva Kendra',
      };
    }

    const title = blog.metaTitle || blog.title;
    const description = blog.metaDescription || blog.excerpt;
    const image = blog.featuredImage || '/jan-seva-logo-1.png';
    const url = `https://www.jan-seva.site/blog/${params.slug}`;

    return {
      title: `${title} | Jan Seva Kendra Blog`,
      description,
      keywords: blog.keywords && blog.keywords.length > 0 ? blog.keywords : undefined,
      openGraph: {
        title,
        description,
        type: 'article',
        url,
        images: [
          {
            url: image.startsWith('http') ? image : `https://www.jan-seva.site${image}`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        publishedTime: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : undefined,
        modifiedTime: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined,
        authors: [blog.author || 'Jan Seva Kendra'],
        tags: blog.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image.startsWith('http') ? image : `https://www.jan-seva.site${image}`],
      },
      alternates: {
        canonical: url,
      },
      other: {
        'article:published_time': blog.publishedAt ? new Date(blog.publishedAt).toISOString() : '',
        'article:modified_time': blog.updatedAt ? new Date(blog.updatedAt).toISOString() : '',
        'article:author': blog.author || 'Jan Seva Kendra',
        'article:section': blog.category,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post - Jan Seva Kendra',
    };
  }
}

// Generate static params for better SEO (optional, for popular posts)
export async function generateStaticParams() {
  try {
    if (!isDBConnected()) {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
      if (mongoUri && mongoUri.trim() !== '') {
        await connectDB();
      }
    }

    const blogs = await Blog.find({ isPublished: true })
      .select('slug')
      .limit(50) // Generate static pages for top 50 posts
      .lean() as any[];

    return blogs.map((blog: any) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <>
      <Header />
      <BlogPostComponent slug={params.slug} />
      <Footer />
    </>
  );
}


