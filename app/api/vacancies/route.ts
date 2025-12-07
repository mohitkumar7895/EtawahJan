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

    // Always return empty array instead of error - graceful degradation
    // This ensures the frontend doesn't break even if database is unavailable
    console.warn("⚠️ Returning empty vacancies array due to error");
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  // Set timeout for Vercel (8 seconds max - Vercel has 10s limit)
  const timeoutPromise = new Promise<NextResponse>((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), 8000);
  });

  try {
    // Race between actual work and timeout
    const result = await Promise.race([
      (async () => {
        // Check database connection with timeout
        if (!isDBConnected()) {
          const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
          if (!mongoUri || mongoUri.trim() === '') {
            return NextResponse.json(
              {
                error: "Database not configured",
                message: "MONGODB_URI is not set.",
                hint: "Set MONGODB_URI environment variable"
              },
              { status: 503 }
            );
          }
          
          try {
            // Ultra-fast connection with timeout (2.5 seconds for Vercel)
            await Promise.race([
              connectDB(),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 2500))
            ]);
          } catch (connError: any) {
            console.error("❌ Connection failed:", connError.message);
            return NextResponse.json(
              {
                error: "Database connection timeout",
                message: "MongoDB connection is taking too long. Please try again.",
                hint: "This may be a temporary issue. Please try again in a moment."
              },
              { status: 503 }
            );
          }

          if (!isDBConnected()) {
            return NextResponse.json(
              {
                error: "Database not available",
                message: "MongoDB connection could not be established.",
                hint: "Please try again in a moment"
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

        console.log("📝 Creating vacancy:", { title, tag });

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

        // Fast save with timeout (2 seconds)
        const savedVacancy = await Promise.race([
          vacancy.save(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Save timeout')), 2000))
        ]) as any;
        
        console.log("✅ Vacancy created successfully:", savedVacancy._id);

        return NextResponse.json({
          ...savedVacancy.toObject(),
          id: savedVacancy._id.toString()
        }, { status: 201 });
      })(),
      timeoutPromise
    ]);

    return result;
  } catch (error: any) {
    console.error("❌ Error creating vacancy:", error);

    // Handle timeout errors
    if (error.message === 'Request timeout' || error.message.includes('timeout')) {
      return NextResponse.json(
        {
          error: "Request timeout",
          message: "The request took too long to complete. Please try again.",
          hint: "This may be due to database connection delay. Try again in a moment."
        },
        { status: 504 }
      );
    }

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
            message: "Failed to connect to MongoDB. Please try again.",
            hint: "Database connection is taking too long. This may be a temporary issue."
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
          message: "Database connection timeout. Please try again.",
          hint: "This may be a temporary issue. Please try again in a moment."
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
        message: error.message || "An unexpected error occurred",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

