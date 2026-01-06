import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Admin from '@/models/Admin';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isDBConnected()) {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
      if (!mongoUri || mongoUri.trim() === '') {
        return NextResponse.json(
          {
            error: "Database not configured",
            message: "MONGODB_URI is not set.",
          },
          { status: 503 }
        );
      }
      
      try {
        await connectDB();
      } catch (connError: any) {
        console.error("❌ Connection failed:", connError.message);
        return NextResponse.json(
          {
            error: "Database connection error",
            message: "Failed to connect to database.",
          },
          { status: 503 }
        );
      }

      if (!isDBConnected()) {
        return NextResponse.json(
          {
            error: "Database not available",
            message: "MongoDB connection could not be established.",
          },
          { status: 503 }
        );
      }
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Admin ID is required" }, { status: 400 });
    }

    console.log("🗑️ Deleting admin:", id);

    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return NextResponse.json(
        {
          error: "Admin not found",
          message: "The admin you are trying to delete does not exist."
        },
        { status: 404 }
      );
    }

    console.log("✅ Admin deleted successfully:", id);

    return NextResponse.json({ 
      message: "Admin deleted successfully",
      id: id 
    }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error deleting admin:", error);

    return NextResponse.json(
      {
        error: "Failed to delete admin",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}












