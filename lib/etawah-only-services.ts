/** Services available only at Jan Seva Kendra, Etawah — not other districts. */
export const ETAWAH_DISTRICT_SLUGS = ['etawah']

export const AADHAAR_ADDRESS_CORRECTION = 'Aadhaar Address Correction'

export const ETAWAH_ONLY_SERVICES = [
  AADHAAR_ADDRESS_CORRECTION,
  'Banking Services',
  'Money Transfer',
  'Aadhaar Enabled Payment',
  'Income Certificate',
  'Domicile Certificate',
  'Death Certificate',
  'Death Certificate Correction',
] as const

export type EtawahOnlyService = (typeof ETAWAH_ONLY_SERVICES)[number]

export function isEtawahDistrict(districtOrSlug: string): boolean {
  const normalized = districtOrSlug.trim().toLowerCase().replace(/\s+/g, '-')
  return ETAWAH_DISTRICT_SLUGS.includes(normalized) || normalized === 'etawah'
}

export function isEtawahOnlyService(serviceName: string): boolean {
  return (ETAWAH_ONLY_SERVICES as readonly string[]).includes(serviceName)
}

export function filterServicesForLocation<T extends { name: string }>(
  items: T[],
  districtOrSlug?: string
): T[] {
  if (!districtOrSlug || isEtawahDistrict(districtOrSlug)) {
    return items
  }
  return items.filter((item) => !isEtawahOnlyService(item.name))
}

export const ETAWAH_ONLY_HINDI_NOTE =
  'यह सेवा केवल इटावा जन सेवा केंद्र पर उपलब्ध है — अन्य जिलों में नहीं।'

export const ETAWAH_ONLY_ENGLISH_NOTE =
  'Available only at Etawah Jan Seva Kendra — not offered in other districts.'
