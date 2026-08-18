import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PortfolioSection from '@/components/PortfolioSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Work & Expertise | Jan Seva Kendra IT Agency',
  description: 'Built for Growth. Designed to Convert. Take a look at some of the high-quality digital solutions we build to help businesses scale and dominate their market.',
}

export default function PortfolioPage() {
  return (
    <>
      <Header />
      
      {/* Portfolio Header */}
      <div className="bg-slate-50 pt-20 pb-10">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-widest mb-6 shadow-sm">
            Our Work & Expertise
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
            Built for <span className="text-blue-600">Growth</span>.<br className="hidden sm:block" /> Designed to <span className="text-emerald-500">Convert</span>.
          </h1>
          <p className="text-slate-600 text-lg md:text-xl max-w-3xl mx-auto font-medium">
            Take a look at some of the high-quality digital solutions we build to help businesses scale and dominate their market.
          </p>
        </div>
      </div>

      {/* The Actual Portfolio Component */}
      <PortfolioSection hideHeader={true} />
      
      <Footer />
    </>
  )
}
