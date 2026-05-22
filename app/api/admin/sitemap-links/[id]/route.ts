import { NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import SitemapLink from '@/models/SitemapLink';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!isDBConnected()) {
      await connectDB();
    }
    const { id } = params;
    const body = await request.json();
    const { url, title, description, changeFrequency, priority, isActive } = body;

    if (!url || !title) {
      return NextResponse.json(
        { success: false, error: 'URL and Title are required' },
        { status: 400 }
      );
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('/') && !formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = '/' + formattedUrl;
    }

    const updatedLink = await SitemapLink.findByIdAndUpdate(
      id,
      {
        url: formattedUrl,
        title: title.trim(),
        description: (description || '').trim(),
        changeFrequency: changeFrequency || 'weekly',
        priority: priority !== undefined ? Number(priority) : 0.5,
        isActive: isActive !== undefined ? isActive : true,
      },
      { new: true }
    );

    if (!updatedLink) {
      return NextResponse.json(
        { success: false, error: 'Sitemap link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, link: updatedLink });
  } catch (error: any) {
    console.error('Error updating custom sitemap link:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update custom sitemap link' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!isDBConnected()) {
      await connectDB();
    }
    const { id } = params;

    const deletedLink = await SitemapLink.findByIdAndDelete(id);

    if (!deletedLink) {
      return NextResponse.json(
        { success: false, error: 'Sitemap link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting custom sitemap link:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete custom sitemap link' },
      { status: 500 }
    );
  }
}
