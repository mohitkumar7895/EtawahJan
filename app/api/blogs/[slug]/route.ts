import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Blog from '@/models/Blog';

/**
 * GET /api/blogs/[slug]
 * Get a single blog post by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
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

    const { slug } = params;

    const blog = await Blog.findOne({ slug }).lean();

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Increment views
    await Blog.updateOne({ slug }, { $inc: { views: 1 } });

    // Get related blogs (same category, exclude current)
    const relatedBlogs = await Blog.find({
      category: blog.category,
      slug: { $ne: slug },
      isPublished: true,
      publishedAt: { $lte: new Date() },
    })
      .select('-content')
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean();

    return NextResponse.json({
      success: true,
      blog: {
        ...blog,
        views: (blog.views || 0) + 1, // Return incremented view count
      },
      relatedBlogs,
    });
  } catch (error: any) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/blogs/[slug]
 * Update a blog post
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
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

    const { slug } = params;
    const body = await request.json();

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Update fields
    Object.keys(body).forEach((key) => {
      if (key !== '_id' && key !== 'slug' && key !== 'createdAt' && key !== 'updatedAt') {
        blog[key] = body[key];
      }
    });

    // If publishing for the first time, set publishedAt
    if (body.isPublished && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }

    await blog.save();

    return NextResponse.json({
      success: true,
      blog,
    });
  } catch (error: any) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blogs/[slug]
 * Delete a blog post
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
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

    const { slug } = params;

    const blog = await Blog.findOneAndDelete({ slug });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog', message: error.message },
      { status: 500 }
    );
  }
}


