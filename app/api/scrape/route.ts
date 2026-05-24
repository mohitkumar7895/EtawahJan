import { NextResponse } from 'next/server';
import { scrapeLatestJobs } from '@/lib/scraper';
import cron from 'node-cron';

// Register background cron job. We attach it to the global object
// so that Next.js hot-reloading does not create duplicate cron tasks in development.
if (!(global as any).jobPortalCronRegistered) {
  console.log('⏰ Registering background Cron worker: Scrapes sarkariexam.com every 6 hours...');
  
  // Cron schedule for "every 6 hours": '0 */6 * * *'
  // For testing/validation, it could run, but for production it's set to every 6 hours.
  (global as any).jobPortalCron = cron.schedule('0 */6 * * *', async () => {
    try {
      console.log('⏰ Automated Cron Scraper Triggered...');
      const added = await scrapeLatestJobs();
      console.log(`⏰ Cron Scraper execution completed. Added ${added} new posts.`);
    } catch (err: any) {
      console.error('❌ Error in automated Cron Scraper:', err.message);
    }
  });
  
  (global as any).jobPortalCronRegistered = true;
}

export async function GET() {
  try {
    console.log('📡 Manual scraping trigger received at /api/scrape');
    
    // Execute the scraper synchronously for the manual API call
    const added = await scrapeLatestJobs();
    
    return NextResponse.json({
      success: true,
      message: 'Scraping executed successfully.',
      addedPostsCount: added,
      cronStatus: 'active',
      schedule: 'every 6 hours (0 */6 * * *)',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Scraper API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Scraping failed',
      message: error.message
    }, { status: 500 });
  }
}
