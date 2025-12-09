import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Announcements from '@/components/Announcements'

export default function Home() {
  return (
    <>
      <Header />
      {/* Announcements Banner - prominently displayed after header */}
      <Announcements />
      <Hero />
      <Services />
      <Footer />
    </>
  )
}







