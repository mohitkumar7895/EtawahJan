import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Vacancy from '@/models/Vacancy';

export async function GET() {
  try {
    // Check database connection - only try once if not connected
    if (!isDBConnected()) {
      // Check if MONGODB_URI is configured
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
      if (!mongoUri || mongoUri.trim() === '') {
        // Return empty array if DB not configured (graceful degradation)
        console.warn("⚠️ MONGODB_URI not configured - returning empty vacancies array");
        return NextResponse.json([]);
      }
      
      // Try to connect only if URI is configured
      try {
        await connectDB();
      } catch (connError: any) {
        console.error("❌ Connection failed:", connError.message);
        // Return empty array instead of error (graceful degradation)
        return NextResponse.json([]);
      }

      if (!isDBConnected()) {
        // Return empty array if still not connected
        return NextResponse.json([]);
      }
    }

    try {
      const vacancies = await Vacancy.find().sort({ createdAt: -1 });
      console.log(`✅ Fetched ${vacancies.length} vacancies`);
      return NextResponse.json(vacancies || []);
    } catch (queryError: any) {
      console.error("❌ Error querying vacancies:", queryError);

      if (queryError.name === 'MongoServerError' ||
          queryError.name === 'MongoError' ||
          queryError.message.includes('connection') ||
          queryError.message.includes('timeout')) {
        return NextResponse.json(
          {
            error: "Database connection error",
            message: "Failed to query database. Please check MongoDB connection.",
            hint: "Verify MONGODB_URI is correct in your .env file"
          },
          { status: 503 }
        );
      }

      throw queryError;
    }
  } catch (error: any) {
    console.error("❌ Error fetching vacancies:", error);

    if (error.name === 'MongoServerError' || error.name === 'MongoError') {
      return NextResponse.json(
        {
          error: "Database error",
          message: "Failed to fetch vacancies from database",
          hint: "Check MongoDB connection and environment variables"
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch vacancies",
        message: "An unexpected error occurred",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check database connection
    if (!isDBConnected()) {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
      if (!mongoUri || mongoUri.trim() === '') {
        return NextResponse.json(
          {
            error: "Database not configured",
            message: "MONGODB_URI environment variable is not set. Please configure it in .env.local file.",
            hint: "Create .env.local file in root directory with: MONGODB_URI=your_connection_string"
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
            error: "Database connection failed",
            message: "MongoDB connection could not be established. Please check MONGODB_URI environment variable.",
            hint: "Make sure MONGODB_URI is set correctly with your MongoDB Atlas URL"
          },
          { status: 503 }
        );
      }

      if (!isDBConnected()) {
        return NextResponse.json(
          {
            error: "Database not available",
            message: "MongoDB connection could not be established. Please check MONGODB_URI environment variable.",
            hint: "Verify your MongoDB Atlas connection string is correct"
          },
          { status: 503 }
        );
      }
    }

    const body = await request.json();
    const { title, tag, info, date, lastDate, vacancies, link } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!tag || !tag.trim()) {
      return NextResponse.json({ error: "Tag is required" }, { status: 400 });
    }

    console.log("📝 Creating vacancy:", { title, tag, info, date, lastDate, vacancies, link });

    const vacancy = new Vacancy({
      title: title.trim(),
      tag: tag.trim(),
      info: info ? info.trim() : '',
      date: date ? date.trim() : '',
      lastDate: lastDate ? lastDate.trim() : '',
      vacancies: vacancies ? (Number(vacancies) || null) : null,
      link: link ? link.trim() : '',
    });

    const validationError = vacancy.validateSync();
    if (validationError) {
      const errors = Object.values(validationError.errors).map((e: any) => e.message);
      return NextResponse.json(
        {
          error: "Validation error",
          details: errors.join(', ')
        },
        { status: 400 }
      );
    }

    const savedVacancy = await vacancy.save();
    console.log("✅ Vacancy created successfully:", savedVacancy._id);

    return NextResponse.json({
      ...savedVacancy.toObject(),
      id: savedVacancy._id.toString()
    }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error creating vacancy:", error);

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

    if (error.name === 'MongoServerError' || error.name === 'MongoError') {
      if (error.message.includes('connection') || error.message.includes('timeout') || error.message.includes('ECONNREFUSED')) {
        return NextResponse.json(
          {
            error: "Database connection error",
            message: "Failed to connect to MongoDB. Please check MONGODB_URI in your .env file.",
            hint: "Make sure MongoDB is running and MONGODB_URI is correct"
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        {
          error: "Database error",
          message: "Failed to save vacancy to database",
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }

    if (error.message && (error.message.includes('connection') || error.message.includes('ECONNREFUSED') || error.message.includes('timeout'))) {
      return NextResponse.json(
        {
          error: "Database connection error",
          message: "Failed to connect to MongoDB. Please check MONGODB_URI in your .env file.",
          hint: "Make sure MongoDB is running and MONGODB_URI is correct"
        },
        { status: 503 }
      );
    }

    if (error.name === 'CastError') {
      return NextResponse.json(
        {
          error: "Invalid data type",
          details: error.message
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create vacancy",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

