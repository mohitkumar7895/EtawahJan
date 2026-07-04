import { INDIA_STATES } from '@/lib/seo/india-locations'
import { WEBSITE_INDUSTRIES } from '@/lib/seo/website-industries'
import { WEBSITE_BUILD_SERVICES } from '@/lib/seo/website-build-services'

export function getWebsiteIndustrySitemapEntries(baseUrl: string) {
  const entries: { url: string; priority: number }[] = []

  entries.push({ url: `${baseUrl}/build-website`, priority: 0.88 })

  for (const ind of WEBSITE_INDUSTRIES) {
    entries.push({ url: `${baseUrl}/website-for/${ind.slug}`, priority: 0.82 })
    for (const st of INDIA_STATES) {
      entries.push({
        url: `${baseUrl}/website-for/${ind.slug}/${st.slug}`,
        priority: 0.78,
      })
    }
  }

  for (const svc of WEBSITE_BUILD_SERVICES) {
    entries.push({ url: `${baseUrl}/build-website/${svc.slug}`, priority: 0.84 })
  }

  return entries
}
