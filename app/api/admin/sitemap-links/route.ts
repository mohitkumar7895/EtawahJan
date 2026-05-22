import { NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import SitemapLink from '@/models/SitemapLink';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!isDBConnected()) {
      await connectDB();
    }
    const links = await SitemapLink.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, links });
  } catch (error: any) {
    console.error('Error fetching custom sitemap links:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch custom sitemap links' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!isDBConnected()) {
      await connectDB();
    }
    const body = await request.json();
    const { url, title, description, changeFrequency, priority, isActive } = body;

    if (!url || !title) {
      return NextResponse.json(
        { success: false, error: 'URL and Title are required' },
        { status: 400 }
      );
    }

    // Ensure URL is relative path or valid absolute URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('/') && !formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = '/' + formattedUrl;
    }

    const newLink = await SitemapLink.create({
      url: formattedUrl,
      title: title.trim(),
      description: (description || '').trim(),
      changeFrequency: changeFrequency || 'weekly',
      priority: priority !== undefined ? Number(priority) : 0.5,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({ success: true, link: newLink });
  } catch (error: any) {
    console.error('Error creating custom sitemap link:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create custom sitemap link' },
      { status: 500 }
    );
  }
}
