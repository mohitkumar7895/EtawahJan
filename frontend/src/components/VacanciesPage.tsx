import React, { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';

type Vacancy = {
  id: string;
  title: string;
  tag: string;
  info: string;
  date?: string;
  lastDate?: string;
  vacancies?: number;
  link?: string;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const STORAGE_KEY = 'janseva_vacancies';

function loadVacancies(): Vacancy[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Vacancy[];
  } catch {
    return [];
  }
}

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [categories] = useState(['All', 'Results', 'Vacancies']);

  useEffect(() => {
    setVacancies(loadVacancies());
    
    // Listen for updates from admin panel
    const handleUpdate = () => setVacancies(loadVacancies());
    window.addEventListener('janseva:vacancies:updated', handleUpdate);
    return () => window.removeEventListener('janseva:vacancies:updated', handleUpdate);
  }, []);

  const categorizedVacancies = {
    'All': vacancies,
    'Results': vacancies.filter(v => v.tag.toLowerCase().includes('result')),
    'Vacancies': vacancies.filter(v => !v.tag.toLowerCase().includes('result'))
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Latest Vacancies and Results</h1>
          <p className="mt-2 text-lg text-gray-600">Find Government Jobs and Results</p>
        </div>

        <div className="w-full max-w-5xl mx-auto">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-orange-900/20 p-1">
              {categories.map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white/60 ring-offset-2 ring-offset-orange-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-orange-700 shadow'
                        : 'text-orange-700 hover:bg-white/[0.12] hover:text-orange-800'
                    )
                  }
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
              {categories.map((category, idx) => (
                <Tab.Panel
                  key={idx}
                  className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white/60 ring-offset-2 ring-offset-orange-400 focus:outline-none focus:ring-2'
                  )}
                >
                  <div className="space-y-4">
                    {categorizedVacancies[category as keyof typeof categorizedVacancies].length === 0 ? (
                      <p className="text-center py-8 text-gray-500">No vacancies or results available</p>
                    ) : (
                      categorizedVacancies[category as keyof typeof categorizedVacancies].map((vacancy) => (
                        <div key={vacancy.id} className="relative rounded-lg p-4 hover:bg-orange-50 transition-colors border">
                          <h3 className="text-lg font-semibold text-gray-900">{vacancy.title}</h3>
                          
                          <div className="mt-1 flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              {vacancy.tag}
                            </span>
                            {vacancy.vacancies && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {vacancy.vacancies} Posts
                              </span>
                            )}
                            {vacancy.date && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {vacancy.date}
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-sm text-gray-600">{vacancy.info}</p>

                          {vacancy.link && (
                            <div className="mt-3">
                              <a
                                href={vacancy.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1.5 border border-orange-600 text-sm font-medium rounded-md text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                              >
                                View Details
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