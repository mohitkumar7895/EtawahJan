import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogsData } from './blogsData';

// Resolve environment variables manually since this is a script
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Simple Blog Schema directly in script for safety
const blogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  excerpt: String,
  content: String,
  featuredImage: { type: String, default: '/jan-seva-logo-1.png' },
  category: String,
  tags: [String],
  author: String,
  metaTitle: String,
  metaDescription: String,
  keywords: [String],
  isPublished: { type: Boolean, default: true },
  publishedAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  readingTime: { type: Number, default: 3 },
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

async function seedBlogs() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
  if (!uri) {
    console.error('No MONGODB_URI found in .env.local');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    let inserted = 0;
    let skipped = 0;

    for (const blogData of blogsData) {
      // Check if blog exists
      const existing = await Blog.findOne({ slug: blogData.slug });
      
      if (existing) {
        console.log(`Blog skipped (already exists): ${blogData.slug}`);
        skipped++;
      } else {
        const newBlog = new Blog({
          ...blogData,
          isPublished: true,
          publishedAt: new Date(),
          readingTime: Math.ceil(blogData.content.split(/\s+/).length / 200) || 3
        });
        await newBlog.save();
        console.log(`✅ Blog inserted: ${blogData.slug}`);
        inserted++;
      }
    }

    console.log(`\nSeed Complete! Inserted: ${inserted}, Skipped: ${skipped}`);
  } catch (error) {
    console.error('Error seeding blogs:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seedBlogs();
