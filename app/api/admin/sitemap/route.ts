import { NextResponse } from 'next/server';
import sitemap from '@/app/sitemap';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const urls = await sitemap();
    
    // Group URLs for stats
    const staticUrls = urls.filter(u => !u.url.includes('/blog/'));
    const blogUrls = urls.filter(u => u.url.includes('/blog/'));
    
    return NextResponse.json({
      success: true,
      baseUrl: 'https://www.jan-seva.site',
      stats: {
        total: urls.length,
        staticCount: staticUrls.length,
        blogCount: blogUrls.length,
      },
      urls: urls.map(u => ({
        url: u.url,
        lastModified: u.lastModified ? new Date(u.lastModified).toISOString() : new Date().toISOString(),
        changeFrequency: u.changeFrequency || 'weekly',
        priority: u.priority || 0.5,
      })),
    });
  } catch (error: any) {
    console.error('Error generating sitemap list in API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch sitemap URLs',
      },
      { status: 500 }
    );
  }
}
