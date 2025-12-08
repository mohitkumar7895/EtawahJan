import mongoose from 'mongoose';

const vacancySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    default: '',
  },
  date: {
    type: String,
    default: '',
  },
  lastDate: {
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
  },
}, {
  timestamps: true,
});

export default mongoose.models.Vacancy || mongoose.model('Vacancy', vacancySchema);




