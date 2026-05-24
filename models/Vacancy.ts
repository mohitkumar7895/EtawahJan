import mongoose from 'mongoose';

const vacancySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Vacancies', 'Results', 'Admit Cards'],
    trim: true,
  },
  shortDescription: {
    type: String,
    default: '',
  },
  fullDescription: {
    type: String,
    default: '',
  },
  startDate: {
    type: String,
    default: '',
  },
  lastDate: {
    type: String,
    default: '',
  },
  ageLimit: {
    type: String,
    default: '',
  },
  totalPosts: {
    type: String,
    default: '',
  },
  qualification: {
    type: String,
    default: '',
  },
  requiredDocuments: {
    type: String,
    default: '',
  },
  officialLink: {
    type: String,
    default: '',
  },
  /** Original SarkariExam post URL (for scrape dedup) */
  sourceUrl: {
    type: String,
    trim: true,
    sparse: true,
    unique: true,
  },
  thumbnail: {
    type: String,
    default: '',
  },
  sourceType: {
    type: String,
    enum: ['admin', 'scraped'],
    default: 'admin',
  },
  isNew: {
    type: Boolean,
    default: true,
  },
  // Backwards compatibility fields
  tag: {
    type: String,
    default: 'Vacancy',
  },
  info: {
    type: String,
    default: '',
  },
  date: {
    type: String,
    default: '',
  },
  vacancies: {
    type: Number,
    default: null,
  },
  link: {
    type: String,
    default: '',
  }
}, {
  timestamps: true,
});

// Auto-populate backward compatibility fields before saving
vacancySchema.pre('save', function(next) {
  if (this.category) {
    // Map categories to tag
    if (this.category === 'Results') {
      this.tag = 'Result';
    } else if (this.category === 'Admit Cards') {
      this.tag = 'Admit Card';
    } else {
      this.tag = 'Vacancy';
    }
  }
  
  if (this.shortDescription && !this.info) {
    this.info = this.shortDescription;
  }
  
  if (this.startDate && !this.date) {
    this.date = this.startDate;
  }
  
  if (this.totalPosts && this.vacancies === null) {
    const num = parseInt(this.totalPosts.replace(/[^0-9]/g, ''), 10);
    this.vacancies = isNaN(num) ? (null as any) : num;
  }
  
  if (this.slug && !this.link) {
    const routePrefix = this.category === 'Results' ? 'result' : this.category === 'Admit Cards' ? 'admit-card' : 'vacancy';
    this.link = `/${routePrefix}/${this.slug}`;
  }
  
  next();
});

export default mongoose.models.Vacancy || mongoose.model('Vacancy', vacancySchema);
