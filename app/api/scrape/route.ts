import { NextResponse } from 'next/server';
import {
  ensureJobPortalCron,
  getJobPortalCronStatus,
  startJobPortalScrape,
} from '@/lib/jobPortalCron';

ensureJobPortalCron();

export async function GET() {
  try {
    console.log('📡 Manual scraping trigger received at /api/scrape');
    
    // Execute the scraper synchronously for the manual API call
    const result = await startJobPortalScrape('manual-api');
    const cronStatus = getJobPortalCronStatus();
    
    return NextResponse.json({
      success: true,
      message: 'Scraping executed successfully.',
      created: result.created,
      updated: result.updated,
      syncedAt: result.syncedAt,
      addedPostsCount: result.created + result.updated,
      cronStatus,
      perCategory: 15,
      source: 'https://www.sarkariexam.com/',
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
