import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Announcement from '@/models/Announcement';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const id = params.id;
    const body = await request.json();
    const { title, description, link, expiresAt, isActive } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const announcement = await Announcement.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description ? description.trim() : '',
        link: link ? link.trim() : '',
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: isActive !== undefined ? isActive : true,
      },
      { new: true, runValidators: true }
    );

    if (!announcement) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...announcement.toObject(),
      id: announcement._id.toString()
    });
  } catch (error: any) {
    console.error("❌ Error updating announcement:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update announcement" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const id = params.id;
    const announcement = await Announcement.findByIdAndDelete(id);

    if (!announcement) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Announcement deleted successfully"
    });
  } catch (error: any) {
    console.error("❌ Error deleting announcement:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete announcement" },
      { status: 500 }
    );
  }
}

