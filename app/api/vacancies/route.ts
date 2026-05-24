import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Vacancy from '@/models/Vacancy';
import Subscriber from '@/models/Subscriber';
import Notification from '@/models/Notification';
import { sendEmail, isEmailConfigured } from '@/lib/emailService';
import { websiteUpdateTemplate } from '@/lib/emailTemplates';
import {
  slugify,
  fetchLiveHomeFeed,
  fetchLiveCategoryJobs,
  fetchAllLiveJobs,
} from '@/lib/scraper';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const feed = searchParams.get('feed') === 'home';

  try {
    let dbReady = isDBConnected();
    if (!dbReady) {
      try {
        await connectDB();
        dbReady = true;
      } catch (connError: unknown) {
        const message = connError instanceof Error ? connError.message : String(connError);
        console.error('❌ Connection failed:', message);
        if (feed) {
          return NextResponse.json(await fetchLiveHomeFeed());
        }
        const category = searchParams.get('category');
        if (category === 'Vacancies' || category === 'Admit Cards' || category === 'Results') {
          const limit = searchParams.get('limit');
          const n = limit ? parseInt(limit, 10) : 15;
          return NextResponse.json(await fetchLiveCategoryJobs(category, n));
        }
        return NextResponse.json(await fetchAllLiveJobs());
      }
    }

    // Parse query params for search & filter
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    // Default: live SarkariExam feed (scraped, pruned to top 15). ?all=true includes admin/manual too.
    const liveOnly = searchParams.get('all') !== 'true';

    const filter: Record<string, unknown> = {};
    if (liveOnly) {
      filter.sourceType = 'scraped';
    }
    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { fullDescription: { $regex: search, $options: 'i' } },
        { qualification: { $regex: search, $options: 'i' } }
      ];
    }

    try {
      if (feed) {
        const live = { sourceType: 'scraped' };
        const [vacancies, admitCards, results, lastSync] = await Promise.all([
          Vacancy.find({ category: 'Vacancies', ...live }).sort({ updatedAt: -1 }).limit(5).lean(),
          Vacancy.find({ category: 'Admit Cards', ...live }).sort({ updatedAt: -1 }).limit(5).lean(),
          Vacancy.find({ category: 'Results', ...live }).sort({ updatedAt: -1 }).limit(5).lean(),
          Vacancy.findOne({ sourceType: 'scraped' }).sort({ updatedAt: -1 }).select('updatedAt').lean(),
        ]);
        const total = vacancies.length + admitCards.length + results.length;
        if (total === 0) {
          return NextResponse.json(await fetchLiveHomeFeed());
        }
        return NextResponse.json({
          vacancies,
          admitCards,
          results,
          lastSyncAt: lastSync?.updatedAt ?? null,
          refreshHours: 6,
        });
      }

      let query = Vacancy.find(filter).sort({ updatedAt: -1 });
      if (limit) {
        query = query.limit(limit);
      }

      const vacancies = await query;
      if ((vacancies?.length ?? 0) === 0 && liveOnly && !search) {
        if (category === 'Vacancies' || category === 'Admit Cards' || category === 'Results') {
          return NextResponse.json(await fetchLiveCategoryJobs(category, limit ?? 15));
        }
        if (!category) {
          return NextResponse.json(await fetchAllLiveJobs(limit ?? 15));
        }
      }
      return NextResponse.json(vacancies || []);
    } catch (queryError: any) {
      console.error("❌ Error querying vacancies:", queryError);
      return NextResponse.json([]);
    }
  } catch (error: any) {
    console.error("❌ Error fetching vacancies:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  const timeoutPromise = new Promise<NextResponse>((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), 8000);
  });

  try {
    const result = await Promise.race([
      (async () => {
        if (!isDBConnected()) {
          try {
            await connectDB();
          } catch (connError: any) {
            console.error("❌ Connection failed:", connError.message);
            return NextResponse.json({ error: "Database connection error" }, { status: 503 });
          }
        }

        const body = await request.json();
        const { 
          title, 
          tag, 
          info, 
          date, 
          lastDate, 
          vacancies, 
          link,
          // New fields
          category,
          shortDescription,
          fullDescription,
          startDate,
          ageLimit,
          totalPosts,
          qualification,
          requiredDocuments,
          officialLink,
          thumbnail,
          sourceType
        } = body;

        if (!title || !title.trim()) {
          return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        // Determine category (fallback if only tag is sent from old UI)
        let finalCategory = category;
        if (!finalCategory && tag) {
          if (tag.toLowerCase().includes('result')) {
            finalCategory = 'Results';
          } else if (tag.toLowerCase().includes('admit')) {
            finalCategory = 'Admit Cards';
          } else {
            finalCategory = 'Vacancies';
          }
        }
        if (!finalCategory) {
          finalCategory = 'Vacancies'; // Default category
        }

        // Generate base unique slug
        let baseSlug = slugify(title);
        let uniqueSlug = baseSlug;
        let counter = 1;
        
        // Loop to resolve any slug collision
        while (await Vacancy.findOne({ slug: uniqueSlug })) {
          uniqueSlug = `${baseSlug}-${counter}`;
          counter++;
        }

        console.log("📝 Creating vacancy:", { title, category: finalCategory, slug: uniqueSlug });

        // Map values with fallbacks to keep both old and new formats in sync
        const vacancy = new Vacancy({
          title: title.trim(),
          slug: uniqueSlug,
          category: finalCategory,
          shortDescription: shortDescription || info || '',
          fullDescription: fullDescription || shortDescription || info || 'Full details available in official link.',
          startDate: startDate || date || '',
          lastDate: lastDate || '',
          ageLimit: ageLimit || 'As per Rules',
          totalPosts: totalPosts || (vacancies ? String(vacancies) : 'Various'),
          qualification: qualification || 'Check Details',
          requiredDocuments: requiredDocuments || 'ID Proof, Photos, Certificates',
          officialLink: officialLink || link || '',
          thumbnail: thumbnail || '',
          sourceType: sourceType || 'admin',
          isNew: true,
          
          // Old fields (will be auto-mapped by pre-save hooks, but defined here explicitly too)
          tag: tag || (finalCategory === 'Results' ? 'Result' : finalCategory === 'Admit Cards' ? 'Admit Card' : 'Vacancy'),
          info: info || shortDescription || '',
          date: date || startDate || '',
          vacancies: vacancies ? (Number(vacancies) || null) : null,
          link: link || `/${finalCategory === 'Results' ? 'result' : finalCategory === 'Admit Cards' ? 'admit-card' : 'vacancy'}/${uniqueSlug}`
        });

        // Validate
        const validationError = vacancy.validateSync();
        if (validationError) {
          const errors = Object.values(validationError.errors).map((e: any) => e.message);
          return NextResponse.json({ error: "Validation error", details: errors.join(', ') }, { status: 400 });
        }

        const savedVacancy = await vacancy.save() as any;
        console.log("✅ Vacancy created successfully:", savedVacancy._id);

        // Limit Pruning: Keep only top 15 posts for this category
        try {
          const categoryPosts = await Vacancy.find({ category: finalCategory }).sort({ createdAt: -1 });
          if (categoryPosts.length > 15) {
            const postsToDelete = categoryPosts.slice(15);
            const idsToDelete = postsToDelete.map(p => p._id);
            await Vacancy.deleteMany({ _id: { $in: idsToDelete } });
            console.log(`🧼 Pruned ${idsToDelete.length} older posts in category: ${finalCategory}`);
          }
        } catch (pruneErr: any) {
          console.error("❌ Error cleaning older posts:", pruneErr);
        }

        // Create in-app notification
        try {
          const { buildShortNotification, internalJobLink } = await import('@/lib/vacancyNotifications');
          const short = buildShortNotification({
            category: savedVacancy.category as 'Vacancies' | 'Results' | 'Admit Cards',
            title: savedVacancy.title,
            startDate: savedVacancy.startDate,
            lastDate: savedVacancy.lastDate,
            ageLimit: savedVacancy.ageLimit,
            totalPosts: savedVacancy.totalPosts,
          });

          const notification = new Notification({
            title: short.title,
            message: short.message,
            type: 'vacancy',
            link:
              savedVacancy.link ||
              internalJobLink(
                savedVacancy.category as 'Vacancies' | 'Results' | 'Admit Cards',
                savedVacancy.slug
              ),
            relatedId: savedVacancy._id.toString(),
            isActive: true,
          });
          
          await notification.save();
          console.log("✅ In-app notification created:", notification._id);
        } catch (notifError: any) {
          console.error('❌ Error creating in-app notification:', notifError);
        }

        // Send email notifications to subscribers
        if (isEmailConfigured()) {
          (async () => {
            try {
              const subscribers = await Subscriber.find({ 
                isActive: true,
                email: { $exists: true, $ne: '' }
              }).limit(200);

              console.log(`📧 Sending vacancy notifications to ${subscribers.length} subscribers...`);

              let notificationCount = 0;
              for (const subscriber of subscribers) {
                if (subscriber.email && subscriber.email.trim()) {
                  try {
                    const subject = `🔔 नई नौकरी: ${savedVacancy.title} | New Job: ${savedVacancy.title} - Jan Seva Kendra`;
                    const message = `${savedVacancy.title}\n${savedVacancy.category} · Last: ${savedVacancy.lastDate || '—'}`;
                    
                    const html = websiteUpdateTemplate({
                      title: `नई नौकरी: ${savedVacancy.title}`,
                      description: message,
                      message: message,
                    });
                    
                    const result = await sendEmail({ 
                      to: subscriber.email.trim(), 
                      subject, 
                      html 
                    });
                    
                    if (result.success) {
                      notificationCount++;
                      await Subscriber.findByIdAndUpdate(subscriber._id, {
                        lastNotifiedAt: new Date(),
                        $inc: { notificationCount: 1 },
                      });
                    }
                    await new Promise((r) => setTimeout(r, 500));
                  } catch (emailError: any) {
                    console.error(`❌ Failed to send notification to ${subscriber.email}:`, emailError);
                  }
                }
              }
              console.log(`✅ Vacancy notifications sent to ${notificationCount}/${subscribers.length} subscribers`);
            } catch (notificationError: any) {
              console.error('❌ Error sending vacancy notifications:', notificationError);
            }
          })();
        }

        return NextResponse.json({
          ...savedVacancy.toObject(),
          id: savedVacancy._id.toString()
        }, { status: 201 });
      })(),
      timeoutPromise
    ]);

    return result;
  } catch (error: any) {
    console.error("❌ Error creating vacancy:", error);
    return NextResponse.json({ error: "Failed to create vacancy", message: error.message }, { status: 500 });
  }
}
