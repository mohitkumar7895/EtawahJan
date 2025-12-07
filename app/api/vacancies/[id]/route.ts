import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Vacancy from '@/models/Vacancy';

export async function PUT(
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
            message: "MONGODB_URI environment variable is not set."
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
            error: "Database not available",
            message: "Please check MongoDB connection string in environment variables"
          },
          { status: 503 }
        );
      }

      if (!isDBConnected()) {
        return NextResponse.json(
          {
            error: "Database not available",
            message: "MongoDB connection could not be established"
          },
          { status: 503 }
        );
      }
    }

    const { id } = params;
    const body = await request.json();
    const { title, tag, info, date, lastDate, vacancies, link } = body;

    if (!id) {
      return NextResponse.json({ error: "Vacancy ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (tag !== undefined) updateData.tag = tag.trim();
    if (info !== undefined) updateData.info = info ? info.trim() : '';
    if (date !== undefined) updateData.date = date ? date.trim() : '';
    if (lastDate !== undefined) updateData.lastDate = lastDate ? lastDate.trim() : '';
    if (vacancies !== undefined) updateData.vacancies = vacancies ? (Number(vacancies) || null) : null;
    if (link !== undefined) updateData.link = link ? link.trim() : '';

    console.log("📝 Updating vacancy:", id, updateData);

    const vacancy = await Vacancy.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!vacancy) {
      return NextResponse.json({ error: "Vacancy not found" }, { status: 404 });
    }

    console.log("✅ Vacancy updated successfully:", vacancy._id);
    return NextResponse.json(vacancy);
  } catch (error: any) {
    console.error("❌ Error updating vacancy:", error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        {
          error: "Validation error",
          details: errors.join(', ')
        },
        { status: 400 }
      );
    }

    if (error.name === 'CastError') {
      return NextResponse.json(
        {
          error: "Invalid vacancy ID format"
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update vacancy",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

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
            message: "MONGODB_URI environment variable is not set."
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
            error: "Database not available",
            message: "Please check MongoDB connection string in environment variables"
          },
          { status: 503 }
        );
      }

      if (!isDBConnected()) {
        return NextResponse.json(
          {
            error: "Database not available",
            message: "MongoDB connection could not be established"
          },
          { status: 503 }
        );
      }
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Vacancy ID is required" }, { status: 400 });
    }

    console.log("🗑️ Deleting vacancy:", id);
    const vacancy = await Vacancy.findByIdAndDelete(id);

    if (!vacancy) {
      return NextResponse.json({ error: "Vacancy not found" }, { status: 404 });
    }

    console.log("✅ Vacancy deleted successfully:", id);
    return NextResponse.json({ message: "Vacancy deleted successfully", id });
  } catch (error: any) {
    console.error("❌ Error deleting vacancy:", error);

    if (error.name === 'CastError') {
      return NextResponse.json(
        {
          error: "Invalid vacancy ID format"
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to delete vacancy",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

