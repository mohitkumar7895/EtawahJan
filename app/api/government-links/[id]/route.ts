import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import GovernmentLink from '@/models/GovernmentLink';

// GET single government link
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isDBConnected()) {
      await connectDB();
    }

    const link = await GovernmentLink.findById(params.id);

    if (!link) {
      return NextResponse.json(
        { error: 'Government link not found' },
        { status: 404 }
      );
    }

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
    console.error('Error fetching government link:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT update government link
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isDBConnected()) {
      await connectDB();
    }

    const body = await request.json();
    const { name, url, icon, description, category, isActive, order } = body;

    const link = await GovernmentLink.findById(params.id);

    if (!link) {
      return NextResponse.json(
        { error: 'Government link not found' },
        { status: 404 }
      );
    }

    if (name !== undefined) link.name = name.trim();
    if (url !== undefined) link.url = url.trim();
    if (icon !== undefined) link.icon = icon;
    if (description !== undefined) link.description = description.trim();
    if (category !== undefined) link.category = category.trim();
    if (isActive !== undefined) link.isActive = isActive;
    if (order !== undefined) link.order = order;

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
    console.error('Error updating government link:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE government link
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isDBConnected()) {
      await connectDB();
    }

    const link = await GovernmentLink.findByIdAndDelete(params.id);

    if (!link) {
      return NextResponse.json(
        { error: 'Government link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Government link deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting government link:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

