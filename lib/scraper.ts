import axios from 'axios';
import * as cheerio from 'cheerio';
import { connectDB } from './db';
import Vacancy from '@/models/Vacancy';

// Slugify helper
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Category sources on SarkariExam
const SOURCES = [
  {
    category: 'Vacancies' as const,
    url: 'https://www.sarkariexam.com/category/top-online-form/',
  },
  {
    category: 'Results' as const,
    url: 'https://www.sarkariexam.com/category/exam-result/',
  },
  {
    category: 'Admit Cards' as const,
    url: 'https://www.sarkariexam.com/category/admit-card/',
  }
];

// Helper to scrape detail page
async function scrapeDetailPage(url: string) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 8000
    });
    
    const $ = cheerio.load(data);
    
    let startDate = '';
    let lastDate = '';
    let ageLimit = '';
    let totalPosts = '';
    let qualification = '';
    let requiredDocuments = '';
    let officialLink = '';
    let thumbnail = '';
    
    // Attempt to scrape thumbnail from OpenGraph tags or article images
    thumbnail = $('meta[property="og:image"]').attr('content') || '';
    if (!thumbnail) {
      thumbnail = $('.entry-content img').first().attr('src') || '';
    }
    
    // Clean up thumbnail path
    if (thumbnail && thumbnail.startsWith('/')) {
      thumbnail = 'https://www.sarkariexam.com' + thumbnail;
    }
    
    // Parse tables for structured information
    $('table, tr').each((i, row) => {
      const rowText = $(row).text().toLowerCase();
      
      // Look for dates
      if (rowText.includes('starting date') || rowText.includes('start date')) {
        $(row).find('td, th').each((j, cell) => {
          const text = $(cell).text().trim();
          if (text && !text.toLowerCase().includes('start')) {
            startDate = text;
          }
        });
      }
      
      if (rowText.includes('last date') || rowText.includes('closing date')) {
        $(row).find('td, th').each((j, cell) => {
          const text = $(cell).text().trim();
          if (text && !text.toLowerCase().includes('last') && !text.toLowerCase().includes('closing')) {
            lastDate = text;
          }
        });
      }
      
      // Look for Age Limit
      if (rowText.includes('age limit') || rowText.includes('minimum age') || rowText.includes('maximum age')) {
        // Grab adjacent text
        const cellText = $(row).find('td').last().text().trim();
        if (cellText && cellText.length > 5) {
          ageLimit = cellText;
        }
      }
      
      // Look for number of posts
      if (rowText.includes('number of post') || rowText.includes('total post') || rowText.includes('vacancy details')) {
        const cellText = $(row).find('td').last().text().trim();
        if (cellText && cellText.length > 0) {
          totalPosts = cellText;
        }
      }
      
      // Look for qualification
      if (rowText.includes('qualification') || rowText.includes('educational qualification') || rowText.includes('eligibility')) {
        const cellText = $(row).find('td').last().text().trim();
        if (cellText && cellText.length > 10) {
          qualification = cellText;
        }
      }
      
      // Look for required documents
      if (rowText.includes('documents required') || rowText.includes('how to apply')) {
        const cellText = $(row).find('td').last().text().trim();
        if (cellText && cellText.length > 15) {
          requiredDocuments = cellText;
        }
      }
    });
    
    // Look for application link or official website
    $('a').each((i, el) => {
      const text = $(el).text().toLowerCase();
      const href = $(el).attr('href');
      if (href && href.startsWith('http') && !href.includes('sarkariexam.com')) {
        if (text.includes('apply online') || text.includes('click here') || text.includes('official website')) {
          officialLink = href;
        }
      }
    });
    
    // Fallbacks if tables didn't yield values
    if (!officialLink) {
      officialLink = url; // Fallback to SarkariExam detail page itself
    }
    
    // Get description/full content
    const fullDescription = $('.entry-content').text().trim() || $('.pf-content').text().trim() || $('article').text().trim() || 'Details available on the official link.';
    
    // Generate brief summary
    let shortDescription = '';
    const descParas = $('.entry-content p').text().trim();
    if (descParas && descParas.length > 50) {
      shortDescription = descParas.substring(0, 160) + '...';
    } else {
      shortDescription = fullDescription.substring(0, 160) + '...';
    }
    
    return {
      startDate: startDate.slice(0, 100),
      lastDate: lastDate.slice(0, 100),
      ageLimit: ageLimit.slice(0, 200),
      totalPosts: totalPosts.slice(0, 100),
      qualification: qualification.slice(0, 1000),
      requiredDocuments: requiredDocuments.slice(0, 1000),
      officialLink: officialLink,
      thumbnail: thumbnail,
      fullDescription: fullDescription,
      shortDescription: shortDescription
    };
    
  } catch (err: any) {
    console.error(`⚠️ Error scraping detail page ${url}:`, err.message);
    return null;
  }
}

// Main scrape function
export async function scrapeLatestJobs() {
  console.log('🚀 Starting SarkariExam Scraping Job...');
  await connectDB();
  
  let totalNewAdded = 0;
  
  for (const source of SOURCES) {
    console.log(`📡 Fetching listing page for category: ${source.category}...`);
    try {
      const { data } = await axios.get(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 10000
      });
      
      const $ = cheerio.load(data);
      const postLinks: { title: string; url: string }[] = [];
      
      // Look for standard wordpress heading links or entry titles
      $('article h2 a, .post h2 a, h2.entry-title a, .entry-title a, h3 a').each((i, el) => {
        const title = $(el).text().trim();
        const href = $(el).attr('href');
        
        if (title && href && href.startsWith('http') && !href.includes('/category/')) {
          // Avoid duplicates in the scraped batch
          if (!postLinks.some(link => link.url === href)) {
            postLinks.push({ title, url: href });
          }
        }
      });
      
      console.log(`Found ${postLinks.length} post links in category: ${source.category}`);
      
      // Process top 10 fresh links to check for new insertions (limit scan to keep it fast)
      let addedInCategory = 0;
      for (const link of postLinks.slice(0, 10)) {
        const slug = slugify(link.title);
        
        // 1. Duplicate check (by slug)
        const exists = await Vacancy.findOne({ slug });
        if (exists) {
          console.log(`⏭️ Duplicate found: "${link.title}" (slug: ${slug}). Skipping.`);
          continue;
        }
        
        // 2. Crawl detail page for full fields
        console.log(`🔍 Scraping details for new post: "${link.title}"...`);
        const details = await scrapeDetailPage(source.url); // Use category-page as detail fallback if crawl fails
        const crawledDetails = await scrapeDetailPage(source.url);
        
        const finalDetails = await scrapeDetailPage(link.url);
        
        if (!finalDetails) {
          console.log(`⚠️ Could not crawl details for: ${link.title}. Inserting basic version.`);
        }
        
        const jobData = {
          title: link.title,
          slug: slug,
          category: source.category,
          shortDescription: finalDetails?.shortDescription || `${link.title}. Find eligibility, age limits and details inside.`,
          fullDescription: finalDetails?.fullDescription || 'Full details are available on the official link.',
          startDate: finalDetails?.startDate || 'Available Now',
          lastDate: finalDetails?.lastDate || 'See Official Link',
          ageLimit: finalDetails?.ageLimit || 'As per Rules',
          totalPosts: finalDetails?.totalPosts || 'Various',
          qualification: finalDetails?.qualification || 'See Details',
          requiredDocuments: finalDetails?.requiredDocuments || 'Photograph, Signature, ID Proof, Marksheets',
          officialLink: finalDetails?.officialLink || link.url,
          thumbnail: finalDetails?.thumbnail || '',
          sourceType: 'scraped' as const,
          isNew: true,
        };
        
        // Create new Vacancy document
        const newPost = new Vacancy(jobData);
        await newPost.save();
        
        addedInCategory++;
        totalNewAdded++;
        console.log(`✅ Successfully added: "${link.title}"`);
      }
      
      // 3. Limit Cleanup: Keep only top 15 posts per category
      if (addedInCategory > 0) {
        console.log(`🧼 Pruning older posts for category: ${source.category} to keep only latest 15...`);
        const categoryPosts = await Vacancy.find({ category: source.category }).sort({ createdAt: -1 });
        if (categoryPosts.length > 15) {
          const postsToDelete = categoryPosts.slice(15);
          const idsToDelete = postsToDelete.map(p => p._id);
          await Vacancy.deleteMany({ _id: { $in: idsToDelete } });
          console.log(`🗑️ Deleted ${idsToDelete.length} older posts in ${source.category}`);
        }
      }
      
    } catch (err: any) {
      console.error(`❌ Error scraping category ${source.category}:`, err.message);
    }
  }
  
  console.log(`🏁 Scraping job complete. Total new posts added: ${totalNewAdded}`);
  return totalNewAdded;
}
