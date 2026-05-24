import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Vacancy from '@/models/Vacancy';
import Subscriber from '@/models/Subscriber';
import Notification from '@/models/Notification';
import { sendEmail, isEmailConfigured } from '@/lib/emailService';
import { websiteUpdateTemplate } from '@/lib/emailTemplates';
import { slugify } from '@/lib/scraper';

export async function GET(request: NextRequest) {
  try {
    if (!isDBConnected()) {
      try {
        await connectDB();
      } catch (connError: any) {
        console.error("❌ Connection failed:", connError.message);
        return NextResponse.json([]);
      }
    }

    // Parse query params for search & filter
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const filter: any = {};
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
      let query = Vacancy.find(filter).sort({ createdAt: -1 });
      if (limit) {
        query = query.limit(limit);
      }
      
      const vacancies = await query;
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
          const notificationMessage = savedVacancy.shortDescription 
            ? `${savedVacancy.title} - ${savedVacancy.shortDescription.substring(0, 100)}...`
            : savedVacancy.title;
          
          const notification = new Notification({
            title: `New ${savedVacancy.category}: ${savedVacancy.title}`,
            message: notificationMessage,
            type: 'vacancy',
            link: savedVacancy.link || '',
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
                    const message = `नई नौकरी की जानकारी:\n\n${savedVacancy.title}\nCategory: ${savedVacancy.category}\nLast Date: ${savedVacancy.lastDate}\nApply Link: ${savedVacancy.officialLink}`;
                    
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
