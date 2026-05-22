'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Tag, Search, Filter, BookOpen, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { formatBlogDate, blogImageUnoptimized } from '@/lib/blog-display';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt?: string | null;
  createdAt?: string | null;
  readingTime: number;
  views: number;
}

const categories = [
  'All',
  'Government Services',
  'Document Services',
  'Schemes & Benefits',
  'Tips & Guides',
  'News & Updates',
  'General',
];

export default function BlogPageComponent() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory, searchQuery, currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        published: 'true',
      });

      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const response = await fetch(`/api/blogs?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setBlogs(data.blogs);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 dark:from-zinc-950 dark:to-zinc-900 transition-colors duration-200">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-12 sm:py-16 md:py-20 dark:from-blue-950 dark:via-blue-950 dark:to-slate-900">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-300" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              जन सेवा केंद्र ब्लॉग Jan seva kendra Blog
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-2">
              सरकारी सेवाओं के बारे में जानकारी और गाइड
            </p>
            <p className="text-base sm:text-lg text-blue-200">
              Information and guides about government services, documents, and schemes
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-6 sm:py-8 bg-white border-b border-gray-200 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-zinc-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search blogs... / ब्लॉग खोजें..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:bg-zinc-950 dark:text-zinc-100 placeholder:text-zinc-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition ${selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg dark:bg-blue-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
                <p className="mt-4 text-gray-600 dark:text-zinc-400">Loading blogs...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-gray-400 dark:text-zinc-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100 mb-2">No blogs found</h3>
                <p className="text-gray-600 dark:text-zinc-400">
                  {searchQuery ? 'Try a different search term' : 'Check back later for new posts'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {blogs.map((blog) => (
                    <article
                      key={blog._id}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group dark:bg-zinc-900 dark:border dark:border-zinc-800 dark:shadow-black/40"
                    >
                      {/* Featured Image */}
                      {blog.featuredImage ? (
                        <Link href={`/blog/${blog.slug}`}>
                          <div className="relative h-48 sm:h-56 overflow-hidden">
                            <Image
                              src={blog.featuredImage}
                              alt={blog.title}
                              fill
                              unoptimized={blogImageUnoptimized(blog.featuredImage)}
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        </Link>
                      ) : (
                        <Link href={`/blog/${blog.slug}`}>
                          <div className="relative h-48 sm:h-56 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-white opacity-50" />
                          </div>
                        </Link>
                      )}

                      {/* Content */}
                      <div className="p-5 sm:p-6">
                        {/* Category Badge */}
                        <div className="mb-3">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold dark:bg-blue-950 dark:text-blue-300">
                            {blog.category}
                          </span>
                        </div>

                        {/* Title */}
                        <Link href={`/blog/${blog.slug}`}>
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2">
                            {blog.title}
                          </h2>
                        </Link>

                        {/* Excerpt */}
                        <p className="text-gray-600 dark:text-zinc-400 text-sm sm:text-base mb-4 line-clamp-3">
                          {blog.excerpt}
                        </p>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 dark:text-zinc-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatBlogDate(blog.publishedAt, blog.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{blog.readingTime || 2} min read</span>
                          </div>
                        </div>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs dark:bg-zinc-800 dark:text-zinc-400"
                              >
                                <Tag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Read More Link */}
                        <Link
                          href={`/blog/${blog.slug}`}
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-sm sm:text-base group/link"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 sm:mt-12 flex justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-semibold ${currentPage === page
                            ? 'bg-blue-600 text-white dark:bg-blue-600'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Schema.org JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Jan Seva Kendra Blog',
            description: 'Information and guides about government services, documents, and schemes',
            url: 'https://www.jan-seva.site/blog',
            publisher: {
              '@type': 'Organization',
              name: 'Jan Seva Kendra',
              url: 'https://www.jan-seva.site',
            },
          }),
        }}
      />
    </div>
  );
}


