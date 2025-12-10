import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Chat from '@/models/Chat';
import User from '@/models/User';

/**
 * GET /api/chats
 * Get all chats (admin only) or get chat for specific phone number (customer)
 */
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const userPhone = searchParams.get('userPhone');
    const isAdmin = searchParams.get('admin') === 'true';

    // If userPhone is provided, return that specific chat (customer view)
    if (userPhone) {
      const chat = await Chat.findOne({ userPhone: userPhone.trim() });
      if (!chat) {
        return NextResponse.json({ userPhone, messages: [] });
      }
      return NextResponse.json({
        _id: chat._id,
        id: chat._id.toString(),
        userPhone: chat.userPhone,
        messages: chat.messages || [],
        lastMessageAt: chat.lastMessageAt,
      });
    }

    // If admin, return all chats sorted by last message
    if (isAdmin) {
      const chats = await Chat.find()
        .sort({ lastMessageAt: -1 })
        .select('userPhone messages lastMessageAt createdAt updatedAt');
      
      // Format response with last message preview
      const formattedChats = chats.map((chat) => {
        const messages = chat.messages || [];
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
        return {
          _id: chat._id,
          id: chat._id.toString(),
          userPhone: chat.userPhone,
          lastMessage: lastMessage ? {
            sender: lastMessage.sender,
            content: lastMessage.content,
            type: lastMessage.type,
            timestamp: lastMessage.timestamp,
          } : null,
          messageCount: messages.length,
          lastMessageAt: chat.lastMessageAt,
          createdAt: chat.createdAt,
        };
      });

      return NextResponse.json(formattedChats);
    }

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("❌ Error fetching chats:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chats
 * Create a new chat or add message to existing chat
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { userPhone, sender, content, type } = body;

    // Validation
    if (!userPhone || !userPhone.trim()) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Validate phone number (Indian format: 10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = userPhone.trim().replace(/\D/g, ''); // Remove non-digits
    if (cleanPhone.length !== 10 || !phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: "Invalid phone number. Please enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    if (!sender || !['customer', 'admin'].includes(sender)) {
      return NextResponse.json({ error: "Valid sender is required" }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    const messageType = type || 'text';
    if (!['text', 'image', 'video'].includes(messageType)) {
      return NextResponse.json({ error: "Invalid message type" }, { status: 400 });
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

    // Add message
    const newMessage = {
      sender,
      content: content.trim(),
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
        message: "Message sent successfully",
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
    console.error("❌ Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message", message: error.message },
      { status: 500 }
    );
  }
}

