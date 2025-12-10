import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Chat from '@/models/Chat';

/**
 * DELETE /api/chats/[id]
 * Delete a chat by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isDBConnected()) {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
      if (!mongoUri || mongoUri.trim() === '') {
        return NextResponse.json(
          { error: "Database not configured" },
          { status: 503 }
        );
      }
      
      try {
        await connectDB();
      } catch (connError: any) {
        console.error("❌ Connection failed:", connError.message);
        return NextResponse.json(
          { error: "Database connection error" },
          { status: 503 }
        );
      }

      if (!isDBConnected()) {
        return NextResponse.json(
          { error: "Database not available" },
          { status: 503 }
        );
      }
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    const chat = await Chat.findByIdAndDelete(id);

    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      );
    }

    console.log("✅ Chat deleted successfully:", id);

    return NextResponse.json(
      {
        message: "Chat deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error deleting chat:", error);
    return NextResponse.json(
      { error: "Failed to delete chat", message: error.message },
      { status: 500 }
    );
  }
}
