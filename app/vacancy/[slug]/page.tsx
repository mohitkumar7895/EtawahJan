import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { connectDB } from '@/lib/db';
import Vacancy from '@/models/Vacancy';
import Link from 'next/link';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connectDB();
  const job = await Vacancy.findOne({ slug: params.slug });
  
  if (!job) {
    return {
      title: 'Job Post Not Found | Jan Seva Kendra',
      description: 'The requested job post could not be found.'
    };
  }

  return {
    title: `${job.title} | Application Details & Notification`,
    description: job.shortDescription || `Details for ${job.title}. Learn about eligibility, age limits, start and last dates, total recruitments, and required documents.`,
    openGraph: {
      title: job.title,
      description: job.shortDescription || 'Apply for this latest vacancy.',
      images: job.thumbnail ? [{ url: job.thumbnail }] : [],
    }
  };
}

export default async function VacancyDetailPage({ params }: PageProps) {
  await connectDB();
  const job = await Vacancy.findOne({ slug: params.slug });

  if (!job) {
    notFound();
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/vacancies" className="hover:text-orange-600 transition-colors">Vacancies</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-800 font-medium truncate">{job.title}</span>
          </nav>

          {/* Main Card */}
          <article className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-2xl">
            
            {/* Upper Banner */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-500 px-6 py-10 sm:px-10 text-white relative">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
                  {job.category}
                </span>
                
                {job.isNew && (
                  <span className="px-3 py-1 bg-rose-500 text-white rounded-full text-xs font-bold uppercase tracking-wider animate-pulse shadow-md">
                    NEW
                  </span>
                )}
                
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold uppercase tracking-wider">
                  {job.sourceType === 'scraped' ? 'Scraped from SarkariExam' : 'Verified Admin Post'}
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                {job.title}
              </h1>
              
              <p className="mt-2 text-orange-50/90 text-sm sm:text-base max-w-2xl leading-relaxed">
                {job.shortDescription}
              </p>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-10 bg-slate-50 border-b border-slate-100">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100/80">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Start Date</span>
                <span className="block mt-1 text-sm font-bold text-slate-800">{job.startDate || 'Available Now'}</span>
              </div>
              
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100/80">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Date</span>
                <span className="block mt-1 text-sm font-bold text-red-600">{job.lastDate || 'Check Official Notification'}</span>
              </div>
              
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100/80">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Vacancies</span>
                <span className="block mt-1 text-sm font-bold text-emerald-600">{job.totalPosts || 'Various'}</span>
              </div>
              
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100/80">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Age Limit</span>
                <span className="block mt-1 text-sm font-bold text-slate-800">{job.ageLimit || 'As per rules'}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 sm:p-10 space-y-8">
              
              {/* Thumbnail Image if available */}
              {job.thumbnail && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm max-h-96 w-full flex items-center justify-center bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={job.thumbnail} 
                    alt={job.title} 
                    className="object-contain max-h-96 w-full"
                  />
                </div>
              )}

              {/* Eligibility & Qualifications */}
              <section className="bg-gradient-to-br from-slate-50 to-orange-50/20 p-6 rounded-2xl border border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-6 bg-orange-600 rounded-full inline-block"></span>
                  Eligibility & Educational Qualification
                </h2>
                <p className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {job.qualification || 'Please refer to the official notification link for full qualification details.'}
                </p>
              </section>

              {/* Required Documents */}
              <section className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-6 bg-orange-600 rounded-full inline-block"></span>
                  Required Documents to Apply
                </h2>
                <div className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {job.requiredDocuments || (
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Educational Qualification Marksheets & Certificates</li>
                      <li>Aadhar Card / Identity Proof</li>
                      <li>Passport Size Photograph</li>
                      <li>Signature Scan Copy</li>
                      <li>Caste/Category Certificate (if applicable)</li>
                    </ul>
                  )}
                </div>
              </section>

              {/* Full Description */}
              <section>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-6 bg-orange-600 rounded-full inline-block"></span>
                  Full Notification details
                </h2>
                <div className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line bg-white p-6 border border-slate-100 rounded-2xl shadow-inner max-h-[500px] overflow-y-auto">
                  {job.fullDescription}
                </div>
              </section>

              {/* Apply / CTA Actions */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Need help in applying online?</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Visit nearest Jan Seva Kendra or contact our help desk.</p>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <a
                    href={job.officialLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto text-center px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Official Link / Apply Now
                  </a>
                </div>
              </div>

            </div>
          </article>

          {/* Quick Footer back button */}
          <div className="mt-8 text-center">
            <Link 
              href="/vacancies" 
              className="inline-flex items-center text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Vacancy Listings
            </Link>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
