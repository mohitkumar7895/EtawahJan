import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobDetailBrief from '@/components/JobDetailBrief';
import { connectDB } from '@/lib/db';
import Vacancy from '@/models/Vacancy';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connectDB();
  const job = await Vacancy.findOne({ slug: params.slug });
  if (!job) return { title: 'Not Found | Jan Seva Kendra' };
  return { title: `${job.title} | Jan Seva Kendra` };
}

export default async function AdmitCardDetailPage({ params }: PageProps) {
  await connectDB();
  const job = await Vacancy.findOne({ slug: params.slug });
  if (!job) notFound();

  const plain = JSON.parse(JSON.stringify(job));

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-100">
        <article className="w-full max-w-[100rem] mx-auto bg-white shadow-xl">
          <JobDetailBrief
            job={{ ...plain, slug: plain.slug }}
            accent="blue"
            backHref="/vacancies?tab=admit"
            backLabel="सभी Admit Card"
          />
        </article>
      </div>
      <Footer />
    </>
  );
}
