import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

/**
 * POST /api/blogs/upload
 * Upload image file for blog featured image
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file type - only images allowed
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Check file size (max 5MB for blog images)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Get file bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Detect serverless environment
    const cwd = process.cwd();
    const isServerless = 
      process.env.VERCEL || 
      process.env.AWS_LAMBDA_FUNCTION_NAME || 
      process.env.LAMBDA_TASK_ROOT ||
      cwd.includes('/var/task') ||
      cwd.includes('/tmp') ||
      cwd === '/';
    
    // Force base64 in production to avoid file system issues
    const isProduction = process.env.NODE_ENV === 'production';
    const forceBase64 = process.env.FORCE_BASE64_STORAGE === 'true' || isProduction;
    
    let fileUrl: string;
    
    // Try file system first, fallback to base64
    if (isServerless || forceBase64) {
      // For serverless/production: Convert to base64 data URL
      console.log(`📦 ${isServerless ? 'Serverless' : 'Production'} environment detected - using base64 storage`);
      const base64 = buffer.toString('base64');
      const mimeType = file.type || 'image/jpeg';
      fileUrl = `data:${mimeType};base64,${base64}`;
    } else {
      // For regular server: Try to save to file system
      try {
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 15);
        let fileExtension = file.name.split('.').pop();
        if (!fileExtension) {
          fileExtension = 'jpg';
        }
        const filename = `${timestamp}-${randomStr}.${fileExtension}`;
        
        const publicDir = join(process.cwd(), 'public');
        const uploadsDir = join(publicDir, 'uploads', 'blogs');
        
        // Create directories recursively
        await mkdir(uploadsDir, { recursive: true });
        
        const filepath = join(uploadsDir, filename);
        await writeFile(filepath, buffer);
        
        // File URL (relative to public folder)
        fileUrl = `/uploads/blogs/${filename}`;
        console.log("✅ Blog image saved to:", fileUrl);
      } catch (fileError: any) {
        // If file system fails, fallback to base64
        console.warn("⚠️ File system save failed, using base64 fallback:", fileError.message);
        const base64 = buffer.toString('base64');
        const mimeType = file.type || 'image/jpeg';
        fileUrl = `data:${mimeType};base64,${base64}`;
      }
    }

    return NextResponse.json(
      {
        message: "Image uploaded successfully",
        fileUrl,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error uploading blog image:", error);
    return NextResponse.json(
      { 
        error: "Failed to upload image", 
        message: error.message || "Unknown error occurred. Please try again." 
      },
      { status: 500 }
    );
  }
}

