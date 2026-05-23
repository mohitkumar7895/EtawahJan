'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, MapPin, Phone, ArrowRight, Grid, Bookmark } from 'lucide-react'

interface StateSitemapClientProps {
  districts: string[]
}

export default function StateSitemapClient({ districts }: StateSitemapClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter districts based on search query
  const filteredDistricts = useMemo(() => {
    return districts.filter(d => 
      d.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [districts, searchQuery])

  // Group districts alphabetically
  const groupedDistricts = useMemo(() => {
    const groups: { [key: string]: string[] } = {}
    
    // Initialize sorted unique starting letters
    filteredDistricts.forEach(d => {
      const firstLetter = d[0].toUpperCase()
      if (!groups[firstLetter]) {
        groups[firstLetter] = []
      }
      groups[firstLetter].push(d)
    })

    // Sort districts in each group
    Object.keys(groups).forEach(letter => {
      groups[letter].sort()
    })

    return groups
  }, [filteredDistricts])

  // Alphabet jump links list (only letters that have matching districts)
  const alphabet = useMemo(() => {
    return Object.keys(groupedDistricts).sort()
  }, [groupedDistricts])

  const handleAlphabetClick = (letter: string) => {
    const element = document.getElementById(`letter-${letter}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <div className="space-y-8">
      {/* Search and Navigation Bar */}
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 sm:p-8">
        <div className="max-w-xl mx-auto mb-6">
          <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2 text-center">
            Search District / अपना जिला खोजें
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Agra, Kanpur, Lucknow, Etawah..."
              className="w-full px-5 py-3.5 pl-12 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Alphabet Jump Bar */}
        {alphabet.length > 0 ? (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-3">
              Alphabetical Quick Jump / अक्षर अनुसार खोजें
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {alphabet.map(letter => (
                <button
                  key={letter}
                  onClick={() => handleAlphabetClick(letter)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-sm bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition duration-150 shadow-sm"
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm py-4">
            No districts match your search / कोई जिला नहीं मिला।
          </p>
        )}
      </div>

      {/* Grouped Districts Display */}
      {alphabet.length > 0 && (
        <div className="space-y-8">
          {alphabet.map(letter => (
            <div 
              key={letter} 
              id={`letter-${letter}`} 
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-100">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
                  {letter}
                </span>
                <span className="text-sm font-semibold text-gray-400">
                  ({groupedDistricts[letter].length} {groupedDistricts[letter].length === 1 ? 'district' : 'districts'})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {groupedDistricts[letter].map(district => (
                  <Link
                    key={district}
                    href={`/district/${district.toLowerCase()}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition duration-150 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 group-hover:text-blue-600 transition" />
                      <span className="font-semibold text-gray-800 group-hover:text-blue-900 transition truncate text-sm sm:text-base">
                        {district}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA Information */}
      <div className="bg-gradient-to-r from-indigo-700 to-blue-800 rounded-2xl p-6 sm:p-8 text-white text-center shadow-xl">
        <h3 className="text-lg sm:text-xl font-bold mb-3 flex items-center justify-center gap-2">
          <Bookmark className="w-5 h-5" /> 75 UP Districts Local SEO Portal
        </h3>
        <p className="text-indigo-100 text-sm max-w-2xl mx-auto leading-relaxed">
          हमारे राज्य-व्यापी साइटमैप के माध्यम से उत्तर प्रदेश के सभी 75 जिलों में सीएससी और जन सेवा केंद्र की ऑनलाइन सेवाओं का लाभ उठाएं। 
          अपने जिले पर क्लिक करें और स्थानीयकृत सरकारी व निजी सेवाओं के लिए तुरंत आवेदन करें।
        </p>
      </div>
    </div>
  )
}
