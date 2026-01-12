import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300,
  },
  content: {
    type: String,
    required: true,
  },
  featuredImage: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Government Services',
      'Document Services',
      'Schemes & Benefits',
      'Tips & Guides',
      'News & Updates',
      'General'
    ],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  author: {
    type: String,
    default: 'Jan Seva Kendra',
  },
  metaTitle: {
    type: String,
    default: '',
  },
  metaDescription: {
    type: String,
    default: '',
    maxlength: 160,
  },
  keywords: [{
    type: String,
    trim: true,
  }],
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
    default: null,
  },
  views: {
    type: Number,
    default: 0,
  },
  readingTime: {
    type: Number,
    default: 0, // in minutes
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ isPublished: 1, publishedAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ createdAt: -1 });

// Calculate reading time before saving
blogSchema.pre('save', function(next) {
  if (this.content) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }
  next();
});

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);


