export type WorldCity = {
  name: string
  slug: string
}

export type WorldRegion =
  | 'north-america'
  | 'europe'
  | 'asia'
  | 'middle-east'
  | 'africa'
  | 'oceania'
  | 'south-america'

export type WorldCountry = {
  name: string
  slug: string
  region: WorldRegion
  /** ISO-style short code for schema / display */
  code: string
  cities: WorldCity[]
}

function city(name: string): WorldCity {
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return { name, slug }
}

function country(
  name: string,
  code: string,
  region: WorldRegion,
  cities: string[]
): WorldCountry {
  const slug = name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return { name, slug, code, region, cities: cities.map(city) }
}

/** 55+ countries · 400+ cities — website development SEO worldwide */
export const WORLD_COUNTRIES: WorldCountry[] = [
  country('United States', 'US', 'north-america', [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio',
    'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'San Francisco', 'Seattle',
    'Denver', 'Boston', 'Miami', 'Atlanta', 'Washington DC', 'Las Vegas', 'Portland',
    'Detroit', 'Minneapolis', 'Tampa', 'Charlotte', 'Nashville', 'Baltimore', 'Sacramento',
    'Kansas City', 'Columbus', 'Indianapolis', 'Milwaukee', 'Raleigh', 'Salt Lake City',
    'Pittsburgh', 'Cleveland', 'Cincinnati', 'St Louis', 'Orlando', 'San Bernardino',
  ]),
  country('Russia', 'RU', 'europe', [
    'Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Nizhny Novgorod',
    'Chelyabinsk', 'Samara', 'Omsk', 'Rostov-on-Don', 'Ufa', 'Krasnoyarsk', 'Voronezh',
    'Perm', 'Volgograd', 'Krasnodar',
  ]),
  country('United Kingdom', 'GB', 'europe', [
    'London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Edinburgh',
    'Bristol', 'Sheffield', 'Newcastle', 'Nottingham', 'Cardiff', 'Belfast',
  ]),
  country('Canada', 'CA', 'north-america', [
    'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Winnipeg',
    'Quebec City', 'Hamilton', 'Halifax', 'Victoria', 'Saskatoon',
  ]),
  country('Australia', 'AU', 'oceania', [
    'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra',
    'Newcastle', 'Hobart', 'Darwin',
  ]),
  country('Germany', 'DE', 'europe', [
    'Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Düsseldorf',
    'Leipzig', 'Dortmund', 'Essen', 'Bremen', 'Dresden',
  ]),
  country('France', 'FR', 'europe', [
    'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Bordeaux',
    'Lille', 'Montpellier',
  ]),
  country('United Arab Emirates', 'AE', 'middle-east', [
    'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Al Ain', 'Ras Al Khaimah',
  ]),
  country('Saudi Arabia', 'SA', 'middle-east', [
    'Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina', 'Khobar', 'Tabuk',
  ]),
  country('Singapore', 'SG', 'asia', ['Singapore']),
  country('Malaysia', 'MY', 'asia', [
    'Kuala Lumpur', 'Penang', 'Johor Bahru', 'Ipoh', 'Malacca', 'Kuching', 'Kota Kinabalu',
  ]),
  country('Philippines', 'PH', 'asia', [
    'Manila', 'Quezon City', 'Cebu City', 'Davao City', 'Makati', 'Pasig', 'Taguig',
  ]),
  country('Indonesia', 'ID', 'asia', [
    'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Bali', 'Semarang', 'Makassar',
  ]),
  country('Japan', 'JP', 'asia', [
    'Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto',
  ]),
  country('South Korea', 'KR', 'asia', [
    'Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju',
  ]),
  country('China', 'CN', 'asia', [
    'Hong Kong', 'Shanghai', 'Beijing', 'Shenzhen', 'Guangzhou', 'Chengdu', 'Hangzhou',
  ]),
  country('Pakistan', 'PK', 'asia', [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar',
  ]),
  country('Bangladesh', 'BD', 'asia', [
    'Dhaka', 'Chittagong', 'Sylhet', 'Khulna', 'Rajshahi', 'Gazipur',
  ]),
  country('Nepal', 'NP', 'asia', ['Kathmandu', 'Pokhara', 'Lalitpur', 'Bharatpur']),
  country('Sri Lanka', 'LK', 'asia', ['Colombo', 'Kandy', 'Galle', 'Jaffna']),
  country('Brazil', 'BR', 'south-america', [
    'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte',
    'Curitiba', 'Recife', 'Porto Alegre',
  ]),
  country('Mexico', 'MX', 'north-america', [
    'Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'Cancún', 'León',
  ]),
  country('Argentina', 'AR', 'south-america', [
    'Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata',
  ]),
  country('Colombia', 'CO', 'south-america', [
    'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
  ]),
  country('Chile', 'CL', 'south-america', ['Santiago', 'Valparaíso', 'Concepción', 'Viña del Mar']),
  country('Peru', 'PE', 'south-america', ['Lima', 'Arequipa', 'Trujillo', 'Cusco']),
  country('South Africa', 'ZA', 'africa', [
    'Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein',
  ]),
  country('Nigeria', 'NG', 'africa', [
    'Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Benin City',
  ]),
  country('Kenya', 'KE', 'africa', ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru']),
  country('Ghana', 'GH', 'africa', ['Accra', 'Kumasi', 'Tamale', 'Takoradi']),
  country('Egypt', 'EG', 'africa', ['Cairo', 'Alexandria', 'Giza', 'Sharm El Sheikh']),
  country('Morocco', 'MA', 'africa', ['Casablanca', 'Rabat', 'Marrakesh', 'Fes', 'Tangier']),
  country('Ethiopia', 'ET', 'africa', ['Addis Ababa', 'Dire Dawa', 'Mekelle']),
  country('Italy', 'IT', 'europe', [
    'Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Bologna', 'Florence',
  ]),
  country('Spain', 'ES', 'europe', [
    'Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao', 'Malaga', 'Zaragoza',
  ]),
  country('Netherlands', 'NL', 'europe', [
    'Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven',
  ]),
  country('Poland', 'PL', 'europe', [
    'Warsaw', 'Kraków', 'Wrocław', 'Poznań', 'Gdańsk', 'Łódź',
  ]),
  country('Turkey', 'TR', 'middle-east', [
    'Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana',
  ]),
  country('Israel', 'IL', 'middle-east', ['Tel Aviv', 'Jerusalem', 'Haifa', 'Beersheba']),
  country('Qatar', 'QA', 'middle-east', ['Doha', 'Al Wakrah', 'Al Khor']),
  country('Kuwait', 'KW', 'middle-east', ['Kuwait City', 'Hawalli', 'Salmiya']),
  country('Bahrain', 'BH', 'middle-east', ['Manama', 'Riffa', 'Muharraq']),
  country('Oman', 'OM', 'middle-east', ['Muscat', 'Salalah', 'Sohar']),
  country('Iraq', 'IQ', 'middle-east', ['Baghdad', 'Basra', 'Erbil', 'Mosul']),
  country('Ukraine', 'UA', 'europe', ['Kyiv', 'Kharkiv', 'Odesa', 'Dnipro', 'Lviv']),
  country('Kazakhstan', 'KZ', 'asia', ['Almaty', 'Astana', 'Shymkent', 'Karaganda']),
  country('Uzbekistan', 'UZ', 'asia', ['Tashkent', 'Samarkand', 'Bukhara', 'Namangan']),
  country('New Zealand', 'NZ', 'oceania', [
    'Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Dunedin',
  ]),
  country('Ireland', 'IE', 'europe', ['Dublin', 'Cork', 'Galway', 'Limerick']),
  country('Switzerland', 'CH', 'europe', ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne']),
  country('Sweden', 'SE', 'europe', ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala']),
  country('Norway', 'NO', 'europe', ['Oslo', 'Bergen', 'Trondheim', 'Stavanger']),
  country('Belgium', 'BE', 'europe', ['Brussels', 'Antwerp', 'Ghent', 'Bruges']),
  country('Austria', 'AT', 'europe', ['Vienna', 'Salzburg', 'Graz', 'Innsbruck']),
  country('Portugal', 'PT', 'europe', ['Lisbon', 'Porto', 'Braga', 'Faro']),
  country('Romania', 'RO', 'europe', ['Bucharest', 'Cluj-Napoca', 'Timișoara', 'Iași']),
  country('Czech Republic', 'CZ', 'europe', ['Prague', 'Brno', 'Ostrava', 'Plzeň']),
  country('Hungary', 'HU', 'europe', ['Budapest', 'Debrecen', 'Szeged']),
  country('Greece', 'GR', 'europe', ['Athens', 'Thessaloniki', 'Patras', 'Heraklion']),
  country('Finland', 'FI', 'europe', ['Helsinki', 'Espoo', 'Tampere', 'Turku']),
  country('Denmark', 'DK', 'europe', ['Copenhagen', 'Aarhus', 'Odense']),
  country('Thailand', 'TH', 'asia', ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Hat Yai']),
  country('Vietnam', 'VN', 'asia', ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hai Phong', 'Can Tho']),
  country('Myanmar', 'MM', 'asia', ['Yangon', 'Mandalay', 'Naypyidaw']),
  country('Cambodia', 'KH', 'asia', ['Phnom Penh', 'Siem Reap']),
]

export const WORLD_REGION_LABELS: Record<WorldRegion, string> = {
  'north-america': 'North America',
  europe: 'Europe',
  asia: 'Asia',
  'middle-east': 'Middle East',
  africa: 'Africa',
  oceania: 'Oceania',
  'south-america': 'South America',
}

export function getCountryBySlug(slug: string): WorldCountry | undefined {
  return WORLD_COUNTRIES.find((c) => c.slug === slug)
}

export function getCityBySlug(countrySlug: string, citySlug: string) {
  const c = getCountryBySlug(countrySlug)
  if (!c) return undefined
  const ct = c.cities.find((x) => x.slug === citySlug)
  if (!ct) return undefined
  return { country: c, city: ct }
}

export function getAllWorldCountryParams() {
  return WORLD_COUNTRIES.map((c) => ({ country: c.slug }))
}

export function getAllWorldCityParams() {
  const params: { country: string; city: string }[] = []
  for (const c of WORLD_COUNTRIES) {
    for (const ct of c.cities) {
      params.push({ country: c.slug, city: ct.slug })
    }
  }
  return params
}

export function getGlobalWebsiteSitemapEntries(baseUrl: string) {
  const entries: { url: string; priority: number }[] = []

  entries.push({ url: `${baseUrl}/website-world`, priority: 0.9 })
  entries.push({ url: `${baseUrl}/global-website-sitemap`, priority: 0.88 })

  for (const c of WORLD_COUNTRIES) {
    entries.push({ url: `${baseUrl}/website-world/${c.slug}`, priority: 0.8 })
    for (const ct of c.cities) {
      entries.push({
        url: `${baseUrl}/website-world/${c.slug}/${ct.slug}`,
        priority: 0.76,
      })
    }
  }

  return entries
}

export function getGlobalIndustrySitemapEntries(_baseUrl: string) {
  return [] as { url: string; priority: number }[]
}

export const WORLD_SITEMAP_STATS = {
  countries: WORLD_COUNTRIES.length,
  cities: WORLD_COUNTRIES.reduce((sum, c) => sum + c.cities.length, 0),
}

export function getCountriesByRegion(region: WorldRegion) {
  return WORLD_COUNTRIES.filter((c) => c.region === region)
}
