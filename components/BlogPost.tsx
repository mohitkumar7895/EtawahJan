'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Tag, User, ArrowLeft, Share2, Eye } from 'lucide-react';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  readingTime: number;
  views: number;
  metaTitle?: string;
  metaDescription?: string;
}

interface RelatedBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  publishedAt: string;
}

interface BlogPostProps {
  slug: string;
}

export default function BlogPostComponent({ slug }: BlogPostProps) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blogs/${slug}`);
      const data = await response.json();

      if (data.success) {
        setBlog(data.blog);
        setRelatedBlogs(data.relatedBlogs || []);
      } else {
        setError(data.error || 'Blog not found');
      }
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The blog post you are looking for does not exist.'}</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 sm:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              {/* Category */}
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {blog.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {blog.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(blog.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{blog.readingTime || 2} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span>{blog.views || 0} views</span>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      <Tag className="w-4 h-4" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                <div className="relative w-full h-64 sm:h-80 md:h-96">
                  <Image
                    src={blog.featuredImage}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div
              className="blog-content mb-12"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Share Section */}
            <div className="bg-blue-50 rounded-xl p-6 mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Share this article</h3>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                <Share2 className="w-5 h-5" />
                Share Now
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <section className="py-8 sm:py-12 bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <Link
                    key={relatedBlog._id}
                    href={`/blog/${relatedBlog.slug}`}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
                  >
                    {relatedBlog.featuredImage ? (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relatedBlog.featuredImage}
                          alt={relatedBlog.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <Tag className="w-12 h-12 text-white opacity-50" />
                      </div>
                    )}
                    <div className="p-5">
                      <span className="text-xs font-semibold text-blue-600">{relatedBlog.category}</span>
                      <h3 className="text-lg font-bold text-gray-900 mt-2 mb-2 group-hover:text-blue-600 transition line-clamp-2">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{relatedBlog.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Schema.org JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: blog.title,
            description: blog.metaDescription || blog.excerpt,
            image: blog.featuredImage
              ? blog.featuredImage.startsWith('http')
                ? blog.featuredImage
                : `https://www.jan-seva.site${blog.featuredImage}`
              : 'https://www.jan-seva.site/jan-seva-logo-1.png',
            datePublished: blog.publishedAt,
            dateModified: blog.publishedAt,
            author: {
              '@type': 'Person',
              name: blog.author,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Jan Seva Kendra',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.jan-seva.site/jan-seva-logo-1.png',
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://www.jan-seva.site/blog/${blog.slug}`,
            },
            keywords: blog.tags?.join(', '),
            articleSection: blog.category,
          }),
        }}
      />
    </div>
  );
}

