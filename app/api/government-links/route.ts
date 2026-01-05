import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import GovernmentLink from '@/models/GovernmentLink';

// GET all government links
export async function GET(request: NextRequest) {
  try {
    if (!isDBConnected()) {
      await connectDB();
    }

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') !== 'false';

    const query: any = {};
    if (activeOnly) {
      query.isActive = true;
    }

    const links = await GovernmentLink.find(query)
      .sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      links: links.map(link => ({
        id: link._id.toString(),
        name: link.name,
        url: link.url,
        icon: link.icon,
        description: link.description,
        category: link.category,
        isActive: link.isActive,
        order: link.order,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching government links:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST create new government link
export async function POST(request: NextRequest) {
  try {
    if (!isDBConnected()) {
      await connectDB();
    }

    const body = await request.json();
    const { name, url, icon, description, category, order } = body;

    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      );
    }

    const link = new GovernmentLink({
      name: name.trim(),
      url: url.trim(),
      icon: icon || '🔗',
      description: description || '',
      category: category || 'General',
      order: order || 0,
      isActive: true,
    });

    await link.save();

    return NextResponse.json({
      success: true,
      link: {
        id: link._id.toString(),
        name: link.name,
        url: link.url,
        icon: link.icon,
        description: link.description,
        category: link.category,
        isActive: link.isActive,
        order: link.order,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error creating government link:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

