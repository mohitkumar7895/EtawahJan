import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Blog from '@/models/Blog';

/**
 * GET /api/blogs
 * Get all published blogs with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    if (!isDBConnected()) {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
      if (!mongoUri || mongoUri.trim() === '') {
        return NextResponse.json(
          { error: "Database not configured" },
          { status: 503 }
        );
      }
      await connectDB();
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const publishedOnly = searchParams.get('published') !== 'false';

    // Build query (use $and so "search $or" does not clash with published date rules)
    const query: any = {};

    if (publishedOnly) {
      query.isPublished = true;
    }

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    const andBlocks: object[] = [];

    if (publishedOnly) {
      andBlocks.push({
        $or: [
          { publishedAt: null },
          { publishedAt: { $lte: new Date() } },
        ],
      });
    }

    if (search) {
      andBlocks.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ],
      });
    }

    if (andBlocks.length > 0) {
      query.$and = andBlocks;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const total = await Blog.countDocuments(query);

    // Fetch blogs
    const blogs = await Blog.find(query)
      .select('-content') // Don't send full content in listing
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blogs
 * Create a new blog post (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Connect to database
    if (!isDBConnected()) {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
      if (!mongoUri || mongoUri.trim() === '') {
        return NextResponse.json(
          { error: "Database not configured" },
          { status: 503 }
        );
      }
      await connectDB();
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      author,
      metaTitle,
      metaDescription,
      keywords,
      isPublished,
    } = body;

    // Validation
    if (!title || !slug || !excerpt || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return NextResponse.json(
        { error: 'Blog with this slug already exists' },
        { status: 400 }
      );
    }

    // Create blog
    const blog = new Blog({
      title,
      slug,
      excerpt,
      content,
      featuredImage: featuredImage || '',
      category,
      tags: tags || [],
      author: author || 'Jan Seva Kendra',
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt.substring(0, 160),
      keywords: keywords || [],
      isPublished: isPublished || false,
      publishedAt: isPublished ? new Date() : null,
    });

    await blog.save();

    return NextResponse.json({
      success: true,
      blog,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog', message: error.message },
      { status: 500 }
    );
  }
}


