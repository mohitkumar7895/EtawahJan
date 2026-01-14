import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Chat from '@/models/Chat';
import User from '@/models/User';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Admin phone numbers
const ADMIN_PHONES = ['9193898182', '7895094129'];

/**
 * POST /api/chats/upload
 * Upload image or video file for chat
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userPhone = formData.get('userPhone') as string;
    const sender = formData.get('sender') as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!userPhone || !userPhone.trim()) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    if (!sender || !['customer', 'admin'].includes(sender)) {
      return NextResponse.json({ error: "Valid sender is required" }, { status: 400 });
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = userPhone.trim().replace(/\D/g, '');
    if (cleanPhone.length !== 10 || !phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    // Check file type
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    let messageType: 'image' | 'video' | 'pdf' = 'image';
    
    if (fileType.startsWith('image/')) {
      messageType = 'image';
    } else if (fileType.startsWith('video/')) {
      messageType = 'video';
    } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      messageType = 'pdf';
    } else {
      return NextResponse.json(
        { error: "Invalid file type. Only images, videos, and PDFs are allowed." },
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Get file bytes first
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Detect serverless environment (AWS Lambda, Vercel, etc.)
    // Check multiple indicators for serverless
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
    
    // Always try base64 first for serverless, production, or if file system might fail
    if (isServerless || forceBase64) {
      // For serverless/production: Convert directly to base64 data URL
      // This works without needing file system access
      console.log(`📦 ${isServerless ? 'Serverless' : 'Production'} environment detected - using base64 storage`);
      const base64 = buffer.toString('base64');
      const mimeType = file.type || (messageType === 'image' ? 'image/jpeg' : messageType === 'video' ? 'video/mp4' : 'application/pdf');
      fileUrl = `data:${mimeType};base64,${base64}`;
    } else {
      // For regular server: Try to save to file system
      try {
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 15);
        let fileExtension = file.name.split('.').pop();
        if (!fileExtension) {
          // Default extensions based on message type
          if (messageType === 'image') fileExtension = 'jpg';
          else if (messageType === 'video') fileExtension = 'mp4';
          else if (messageType === 'pdf') fileExtension = 'pdf';
        }
        const filename = `${timestamp}-${randomStr}.${fileExtension}`;
        
        const publicDir = join(process.cwd(), 'public');
        const uploadsDir = join(publicDir, 'uploads', 'chat');
        
        // Create directories recursively
        await mkdir(uploadsDir, { recursive: true });
        
        const filepath = join(uploadsDir, filename);
        await writeFile(filepath, buffer);
        
        // File URL (relative to public folder)
        fileUrl = `/uploads/chat/${filename}`;
        console.log("✅ File saved to:", fileUrl);
      } catch (fileError: any) {
        // If file system fails (including directory creation errors), fallback to base64
        console.warn("⚠️ File system save failed, using base64 fallback:", fileError.message);
        const base64 = buffer.toString('base64');
        const mimeType = file.type || (messageType === 'image' ? 'image/jpeg' : messageType === 'video' ? 'video/mp4' : 'application/pdf');
        fileUrl = `data:${mimeType};base64,${base64}`;
      }
    }

    // Connect to database
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

    // Find or create user in database
    let user = await User.findOne({ phoneNumber: cleanPhone });
    if (!user) {
      user = new User({
        phoneNumber: cleanPhone,
        firstChatAt: new Date(),
        lastActiveAt: new Date(),
        messageCount: 0,
        isActive: true,
      });
      await user.save();
      console.log("✅ New user created:", cleanPhone);
    } else {
      // Update last active time
      user.lastActiveAt = new Date();
      user.isActive = true;
      await user.save();
    }

    // Find or create chat
    let chat = await Chat.findOne({ userPhone: cleanPhone });

    if (!chat) {
      chat = new Chat({
        userPhone: cleanPhone,
        messages: [],
      });
    }

    // Add message with file URL
    const newMessage = {
      sender,
      content: fileUrl,
      type: messageType,
      timestamp: new Date(),
    };

    chat.messages.push(newMessage);
    chat.lastMessageAt = new Date();

    await chat.save();

    // Update user's message count
    if (user) {
      user.messageCount = chat.messages.length;
      await user.save();
    }

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        fileUrl,
        chat: {
          _id: chat._id,
          id: chat._id.toString(),
          userPhone: chat.userPhone,
          messages: chat.messages,
          lastMessageAt: chat.lastMessageAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error uploading file:", error);
    return NextResponse.json(
      { 
        error: "Failed to upload file", 
        message: error.message || "Unknown error occurred. Please try again." 
      },
      { status: 500 }
    );
  }
}

