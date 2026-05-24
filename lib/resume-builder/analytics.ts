import { connectDB } from '@/lib/db';
import ResumeAnalytics from '@/models/ResumeAnalytics';

export async function trackResumeEvent(
  event: string,
  userId?: string,
  resumeId?: string,
  meta?: Record<string, unknown>
) {
  try {
    await connectDB();
    await ResumeAnalytics.create({
      userId: userId || undefined,
      resumeId: resumeId || undefined,
      event,
      meta: meta || {},
    });
  } catch (e) {
    console.error('Resume analytics error:', e);
  }
}
