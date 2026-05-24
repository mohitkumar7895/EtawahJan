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
      title: 'Admit Card Not Found | Jan Seva Kendra',
      description: 'The requested admit card details could not be found.'
    };
  }

  return {
    title: `${job.title} | Download Admit Card & Hall Ticket`,
    description: job.shortDescription || `Download hall ticket and admit cards for ${job.title}. Find direct login links, exam dates and instructions.`,
    openGraph: {
      title: job.title,
      description: job.shortDescription || 'Download admit cards and hall tickets.',
      images: job.thumbnail ? [{ url: job.thumbnail }] : [],
    }
  };
}

export default async function AdmitCardDetailPage({ params }: PageProps) {
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
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/admit-cards" className="hover:text-blue-600 transition-colors">Admit Cards</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-800 font-medium truncate">{job.title}</span>
          </nav>

          {/* Main Card */}
          <article className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-2xl">
            
            {/* Upper Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-10 sm:px-10 text-white relative">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
                  {job.category}
                </span>
                
                {job.isNew && (
                  <span className="px-3 py-1 bg-rose-500 text-white rounded-full text-xs font-bold uppercase tracking-wider animate-pulse shadow-md">
                    NEW
                  </span>
                )}
                
                <span className="px-3 py-1 bg-blue-800 text-white rounded-full text-xs font-semibold uppercase tracking-wider">
                  {job.sourceType === 'scraped' ? 'Scraped from SarkariExam' : 'Verified Admin Post'}
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                {job.title}
              </h1>
              
              <p className="mt-2 text-blue-50/90 text-sm sm:text-base max-w-2xl leading-relaxed">
                {job.shortDescription}
              </p>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-10 bg-slate-50 border-b border-slate-100">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100/80">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Release Date</span>
                <span className="block mt-1 text-sm font-bold text-slate-800">{job.startDate || 'Available Now'}</span>
              </div>
              
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100/80">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Exam Date</span>
                <span className="block mt-1 text-sm font-bold text-red-600">{job.lastDate || 'See Admit Card'}</span>
              </div>
              
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100/80">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Vacancies</span>
                <span className="block mt-1 text-sm font-bold text-slate-800">{job.totalPosts || 'Various'}</span>
              </div>
              
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100/80">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Instructions</span>
                <span className="block mt-1 text-sm font-bold text-blue-600">{job.ageLimit || 'Follow guidelines'}</span>
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

              {/* Instructions to Download Hall Ticket */}
              <section className="bg-gradient-to-br from-slate-50 to-blue-50/20 p-6 rounded-2xl border border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
                  Instructions to Download Admit Card
                </h2>
                <div className="text-slate-700 leading-relaxed text-sm sm:text-base">
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Click on the <strong>Official Download Link</strong> button below.</li>
                    <li>Enter your Registration ID, Application Number, or Roll Number.</li>
                    <li>Enter your Password or Date of Birth (DD-MM-YYYY).</li>
                    <li>Submit details and download the PDF copy of the Hall Ticket.</li>
                    <li>Ensure you print the card on A4 paper and carry a valid photo ID to the exam center.</li>
                  </ol>
                </div>
              </section>

              {/* Required Documents / Information */}
              <section className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
                  Things to carry in Exam Center
                </h2>
                <div className="text-slate-700 leading-relaxed text-sm sm:text-base">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Printed copy of this Admit Card / Hall Ticket</li>
                    <li>Original Photo Identity Proof (Aadhar Card, Voter ID, driving license, etc.)</li>
                    <li>Two recent passport-size colored photographs</li>
                    <li>Transparent blue/black ballpoint pen</li>
                  </ul>
                </div>
              </section>

              {/* Eligibility details */}
              {job.qualification && (
                <section className="p-6 bg-white border border-slate-100 rounded-2xl">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
                    Eligibility / Exam Details
                  </h2>
                  <p className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                    {job.qualification}
                  </p>
                </section>
              )}

              {/* Full Description */}
              <section>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
                  Full Notification details
                </h2>
                <div className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line bg-white p-6 border border-slate-100 rounded-2xl shadow-inner max-h-[500px] overflow-y-auto">
                  {job.fullDescription}
                </div>
              </section>

              {/* Apply / CTA Actions */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Need help printing admit cards?</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Visit nearest Jan Seva Kendra or contact our help desk.</p>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <a
                    href={job.officialLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto text-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Official Link / Download Admit Card
                  </a>
                </div>
              </div>

            </div>
          </article>

          {/* Quick Footer back button */}
          <div className="mt-8 text-center">
            <Link 
              href="/admit-cards" 
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Admit Card Listings
            </Link>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
