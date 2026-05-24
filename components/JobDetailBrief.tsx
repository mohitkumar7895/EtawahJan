import Link from 'next/link';
import { Calendar, Users, GraduationCap, FileText, ClipboardList } from 'lucide-react';
import CallbackRequestForm from '@/components/CallbackRequestForm';
import { getSanitizedJob, type JobMeta } from '@/lib/jobDisplay';

interface Job extends JobMeta {
  title: string;
  slug?: string;
  isNew?: boolean;
}

export default function JobDetailBrief({
  job,
  accent = 'orange',
  backHref = '/vacancies',
  backLabel = 'सभी updates',
}: {
  job: Job;
  accent?: 'orange' | 'blue' | 'emerald';
  backHref?: string;
  backLabel?: string;
}) {
  const gradient =
    accent === 'blue'
      ? 'from-blue-600 to-indigo-500'
      : accent === 'emerald'
        ? 'from-emerald-600 to-teal-500'
        : 'from-orange-600 to-amber-500';

  const accentBorder =
    accent === 'blue' ? 'border-blue-200' : accent === 'emerald' ? 'border-emerald-200' : 'border-orange-200';

  const s = getSanitizedJob(job);
  const isVacancy = job.category === 'Vacancies';

  return (
    <>
      <div className={`bg-gradient-to-r ${gradient} px-6 sm:px-10 py-8 sm:py-10 text-white`}>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wide">
            {job.category}
          </span>
          {job.isNew && (
            <span className="px-3 py-1 bg-rose-500 rounded-full text-xs font-bold">नया अपडेट</span>
          )}
        </div>
        <p className="text-white/80 text-sm font-medium mb-1">फॉर्म / भर्ती का नाम</p>
        <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight max-w-4xl">{job.title}</h1>
      </div>

      <div className="px-4 sm:px-8 lg:px-12 py-8 sm:py-10 bg-slate-50">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Dates — wide row */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
              <Calendar className="w-5 h-5 text-orange-600" />
              महत्वपूर्ण तिथियाँ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`bg-white rounded-2xl border-2 ${accentBorder} p-5 sm:p-6 shadow-sm`}>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  आवेदन शुरू (Start Date)
                </p>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{s.startDate}</p>
              </div>
              <div className="bg-white rounded-2xl border-2 border-red-200 p-5 sm:p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2">
                  अंतिम तिथि (Last Date)
                </p>
                <p className="text-xl sm:text-2xl font-extrabold text-red-600">{s.lastDate}</p>
              </div>
            </div>
          </section>

          {isVacancy && (
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
                <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  आयु सीमा (Age Limit)
                </h2>
                <p className="text-lg sm:text-xl font-bold text-slate-800">{s.ageLimit}</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
                <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-3">
                  <ClipboardList className="w-5 h-5 text-emerald-600" />
                  कुल पद (Total Posts)
                </h2>
                <p className="text-lg sm:text-xl font-bold text-emerald-700">{s.totalPosts}</p>
              </div>
            </section>
          )}

          <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-3">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              योग्यता (Qualification)
            </h2>
            <p className="text-slate-700 text-base leading-relaxed">{s.qualification}</p>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
              <FileText className="w-5 h-5 text-amber-600" />
              जरूरी दस्तावेज (Documents)
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {s.documents.map((doc) => (
                <li
                  key={doc}
                  className="flex items-center gap-2 text-slate-700 text-sm sm:text-base bg-slate-50 rounded-xl px-4 py-3 border border-slate-100"
                >
                  <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                  {doc}
                </li>
              ))}
            </ul>
          </section>

          <CallbackRequestForm
            jobTitle={job.title}
            jobSlug={job.slug}
            category={String(job.category)}
            source="job-detail"
          />
        </div>
      </div>

      <div className="py-6 text-center border-t border-slate-200 bg-white">
        <Link href={backHref} className="text-sm font-bold text-orange-600 hover:text-orange-700">
          ← {backLabel}
        </Link>
      </div>
    </>
  );
}
