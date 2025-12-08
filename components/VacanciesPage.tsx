'use client';

import React, { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import { getVacancies, type Vacancy } from '@/lib/api';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [categories] = useState(['All', 'Results', 'Admit Card', 'Vacancies']);

  const loadVacancies = async () => {
    try {
      const data = await getVacancies();
      setVacancies(data || []); // Ensure it's always an array
    } catch (error) {
      // Silently handle errors - getVacancies already returns empty array
      console.warn('Vacancies load warning (non-critical):', error);
      setVacancies([]);
    }
  };

  useEffect(() => {
    loadVacancies();
    
    const interval = setInterval(() => {
      loadVacancies();
    }, 5000);
    
    const handleUpdate = () => loadVacancies();
    window.addEventListener('janseva:vacancies:updated', handleUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('janseva:vacancies:updated', handleUpdate);
    };
  }, []);

  const categorizedVacancies = {
    'All': vacancies,
    'Results': vacancies.filter(v => v.tag.toLowerCase().includes('result')),
    'Admit Card': vacancies.filter(v => v.tag.toLowerCase().includes('admit')),
    'Vacancies': vacancies.filter(v => !v.tag.toLowerCase().includes('result') && !v.tag.toLowerCase().includes('admit'))
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Latest Vacancies and Results</h1>
          <p className="mt-2 text-base sm:text-lg text-gray-600">Find Government Jobs and Results</p>
        </div>

        <div className="w-full max-w-5xl mx-auto">
          <Tab.Group>
            <Tab.List className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-1 rounded-xl bg-orange-900/20 p-1 sm:p-1">
              {categories.map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2 sm:py-2.5 px-2 text-xs sm:text-sm md:text-base font-medium leading-5',
                      'ring-white/60 ring-offset-2 ring-offset-orange-400 focus:outline-none focus:ring-2 transition-all',
                      'text-center whitespace-nowrap',
                      selected
                        ? 'bg-white text-orange-700 shadow-md'
                        : 'text-orange-700 hover:bg-white/[0.12] hover:text-orange-800'
                    )
                  }
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-3 sm:mt-4">
              {categories.map((category, idx) => (
                <Tab.Panel
                  key={idx}
                  className={classNames(
                    'rounded-xl bg-white p-3 sm:p-4 md:p-5',
                    'ring-white/60 ring-offset-2 ring-offset-orange-400 focus:outline-none focus:ring-2'
                  )}
                >
                  <div className="space-y-3 sm:space-y-4">
                    {categorizedVacancies[category as keyof typeof categorizedVacancies].length === 0 ? (
                      <p className="text-center py-8 sm:py-12 text-sm sm:text-base text-gray-500">No vacancies or results available</p>
                    ) : (
                      categorizedVacancies[category as keyof typeof categorizedVacancies].map((vacancy) => (
                        <div key={vacancy.id || vacancy._id} className="relative rounded-lg p-3 sm:p-4 md:p-5 hover:bg-orange-50 transition-colors border border-gray-200 hover:border-orange-300">
                          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight">{vacancy.title}</h3>
                          
                          <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                            <span className="inline-flex items-center px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                              {vacancy.tag}
                            </span>
                            {vacancy.vacancies && (
                              <span className="inline-flex items-center px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                {vacancy.vacancies} Posts
                              </span>
                            )}
                            {vacancy.date && (
                              <span className="inline-flex items-center px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                                {vacancy.date}
                              </span>
                            )}
                            {vacancy.lastDate && (
                              <span className="inline-flex items-center px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                                Last: {vacancy.lastDate}
                              </span>
                            )}
                          </div>

                          {vacancy.info && (
                            <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">{vacancy.info}</p>
                          )}

                          {vacancy.link && (
                            <div className="mt-3 sm:mt-4">
                              <a
                                href={vacancy.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-orange-600 text-xs sm:text-sm md:text-base font-semibold rounded-md text-orange-700 bg-white hover:bg-orange-50 hover:border-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                              >
                                View Details
                                <svg className="ml-1.5 w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}


