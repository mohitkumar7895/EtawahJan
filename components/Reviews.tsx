'use client';

import { Star, ExternalLink } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  timeAgo: string;
  reviewCount: number;
  avatarColor: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: 'jatin manglani',
    rating: 5,
    text: 'Jan Seva Kendra provides excellent and reliable services. The staff is professional, cooperative, and completes all documentation work efficiently. The process is smooth and time-saving. Highly satisfied with the overall service quality.',
    timeAgo: '2 days ago',
    reviewCount: 4,
    avatarColor: 'bg-blue-500'
  },
  {
    id: 2,
    name: 'RAJ YADAV',
    rating: 5,
    text: 'Most probably Cyber Cafe in the City. The working effectivy is Good 😊 and great 👍 working.',
    timeAgo: '5 days ago',
    reviewCount: 1,
    avatarColor: 'bg-purple-500'
  },
  {
    id: 3,
    name: 'Eshu Tiwari',
    rating: 5,
    text: 'Best service',
    timeAgo: '5 days ago',
    reviewCount: 1,
    avatarColor: 'bg-blue-600'
  },
  {
    id: 4,
    name: 'Aniket Kashyap',
    rating: 5,
    text: 'Trusted Jan Seva Kendra',
    timeAgo: '5 days ago',
    reviewCount: 1,
    avatarColor: 'bg-blue-600'
  },
  {
    id: 5,
    name: 'adesh yadav',
    rating: 5,
    text: 'Fast and accurate work',
    timeAgo: '5 days ago',
    reviewCount: 1,
    avatarColor: 'bg-pink-500'
  },
  {
    id: 6,
    name: 'Vansh Bhatnagar',
    rating: 5,
    text: 'I recently Visited the Store and the Services they provide is good and their Staff is also friendly and polite and also cooperative',
    timeAgo: '5 days ago',
    reviewCount: 9,
    avatarColor: 'bg-blue-500'
  },
  {
    id: 7,
    name: 'Chandan Yadav',
    rating: 5,
    text: 'Your CSC is a Best Service Centre in Bharthana as a Digital CSC',
    timeAgo: 'a week ago',
    reviewCount: 1,
    avatarColor: 'bg-teal-500'
  },
  {
    id: 8,
    name: 'Rishabh Kumar',
    rating: 5,
    text: 'This is good cafe. And all online services is good',
    timeAgo: 'a week ago',
    reviewCount: 2,
    avatarColor: 'bg-green-500'
  },
  {
    id: 9,
    name: 'Navneet Yadav',
    rating: 5,
    text: 'Professional environment with accurate and timely service delivery.',
    timeAgo: 'a week ago',
    reviewCount: 2,
    avatarColor: 'bg-amber-600'
  },
  {
    id: 10,
    name: 'D S YADAV',
    rating: 5,
    text: 'Best internet cafe in the area so far........',
    timeAgo: 'a week ago',
    reviewCount: 1,
    avatarColor: 'bg-yellow-500'
  },
  {
    id: 11,
    name: 'Ranjana Sharma',
    rating: 4,
    text: 'Very helpful and reliable. All services are handled professionally with proper guidance at every step. Correct and updated information is provided, and the entire process is smooth and clear. A trustworthy place for form filling and online services. Highly recommended.',
    timeAgo: 'a week ago',
    reviewCount: 1,
    avatarColor: 'bg-blue-400'
  },
  {
    id: 12,
    name: 'Mohit Kumar',
    rating: 5,
    text: 'Excellent service. And achey tarike Sai form bharey jaatey hai yha pai',
    timeAgo: 'a week ago',
    reviewCount: 1,
    avatarColor: 'bg-amber-700'
  },
  {
    id: 13,
    name: 'Raj Katheriya',
    rating: 5,
    text: 'Achi service acha kaam arpit porwal bhai ke yha',
    timeAgo: 'a week ago',
    reviewCount: 1,
    avatarColor: 'bg-green-500'
  },
  {
    id: 14,
    name: 'Sanjeev Kumar',
    rating: 5,
    text: 'Best jan seva kendra Acha kam hota hai pf sai laike koi bhe kam karvao acha hai jan seva kendra best quality ke sath',
    timeAgo: 'a week ago',
    reviewCount: 2,
    avatarColor: 'bg-blue-600'
  },
  {
    id: 15,
    name: 'Pradip Kumar',
    rating: 5,
    text: 'One of the best jan seva kendra in this area Bharthana Etawaha. Very honest and reliable service',
    timeAgo: '2 weeks ago',
    reviewCount: 1,
    avatarColor: 'bg-green-500'
  },
  {
    id: 16,
    name: 'Indresh Sharma',
    rating: 5,
    text: 'Very professional behaviour and well-managed center.',
    timeAgo: '2 weeks ago',
    reviewCount: 1,
    avatarColor: 'bg-amber-700'
  },
  {
    id: 17,
    name: 'Ankit Shakya',
    rating: 5,
    text: 'Excellent and fast service . the staff us very helpful and they completed my document work much quicker than i expected . highly recomeneded for any givenment related service',
    timeAgo: '2 weeks ago',
    reviewCount: 1,
    avatarColor: 'bg-blue-500'
  },
  {
    id: 18,
    name: 'Tetu Yadav',
    rating: 5,
    text: 'This website are good work for all problems solution',
    timeAgo: '2 weeks ago',
    reviewCount: 1,
    avatarColor: 'bg-pink-500'
  },
  {
    id: 19,
    name: 'Himanshu Yadav',
    rating: 5,
    text: 'Excellent service genuine service',
    timeAgo: '2 weeks ago',
    reviewCount: 1,
    avatarColor: 'bg-orange-500'
  },
  {
    id: 20,
    name: 'Somesh Bhatnagar',
    rating: 5,
    text: 'Very useful application. All government services are available in one place. The interface is simple and easy to use. Works smoothly and saves a lot of time. Highly recommended.',
    timeAgo: '2 weeks ago',
    reviewCount: 2,
    avatarColor: 'bg-blue-500'
  },
  {
    id: 21,
    name: 'Afiya',
    rating: 5,
    text: 'Excellent service',
    timeAgo: '2 weeks ago',
    reviewCount: 1,
    avatarColor: 'bg-amber-600'
  },
  {
    id: 22,
    name: 'Shivam Rathore',
    rating: 5,
    text: 'Excellent 👌 work 💯 in this janseva kendra with genuine fees',
    timeAgo: '2 weeks ago',
    reviewCount: 5,
    avatarColor: 'bg-pink-600'
  },
  {
    id: 23,
    name: 'Puru Verma',
    rating: 5,
    text: 'Amazing service',
    timeAgo: '2 weeks ago',
    reviewCount: 3,
    avatarColor: 'bg-teal-500'
  }
];

export default function Reviews() {
  const visibleReviews = reviews.slice(0, 10);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Duplicate reviews for seamless infinite scroll
  const duplicatedReviews = [...visibleReviews, ...visibleReviews];

  return (
    <section id="reviews" className="bg-white pt-0 pb-2 md:pt-0 md:pb-8 lg:pt-0 lg:pb-8 overflow-hidden -mt-4 md:-mt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-4">
        <div className="text-center mb-3 md:mb-5">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-0.5">
            Customer Reviews
          </h2>
          <p className="text-gray-600 text-lg md:text-xl">
            What our customers say about us
          </p>
        </div>

        {/* Infinite Rotating Carousel */}
        <div className="relative w-full overflow-hidden">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling container */}
          <div className="flex gap-4 sm:gap-5 md:gap-6 animate-scroll will-change-transform">
            {duplicatedReviews.map((review, index) => (
              <div
                key={`${review.id}-${index}`}
                className="flex-shrink-0 w-[90%] max-w-[250px] sm:w-[280px] md:w-[300px] lg:w-[380px] bg-slate-900 rounded-xl p-3 sm:p-4 md:p-5 lg:p-4 shadow-xl border border-slate-700 flex flex-col"
              >
                <div className="flex items-start gap-2.5 sm:gap-3 lg:gap-3 mb-2 sm:mb-2.5 lg:mb-2">
                  {/* Avatar */}
                  <div className={`${review.avatarColor} w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0`}>
                    {getInitials(review.name)}
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm sm:text-base mb-0.5 truncate">
                      {review.name}
                    </h3>
                    <p className="text-white text-xs opacity-75">
                      {review.reviewCount} {review.reviewCount === 1 ? 'review' : 'reviews'}
                    </p>
                  </div>

                  {/* Options Menu */}
                  <button className="text-white opacity-60 hover:opacity-100 transition-colors">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-2 sm:mb-2.5 lg:mb-2 flex-wrap">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-800 text-gray-800'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white text-xs opacity-75">{review.timeAgo}</span>
                  <span className="bg-slate-800 text-white text-xs px-1.5 py-0.5 rounded-full border border-slate-600">New</span>
                </div>

                {/* Review Text */}
                <p className="text-white text-xs sm:text-sm lg:text-base leading-relaxed lg:line-clamp-5">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Google Review Link */}
        <div className="text-center mt-8 md:mt-12">
          <a
            href="https://g.page/r/CQYxijSk1u2yEBI/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg"
          >
            <span>Write a Review on Google</span>
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-250px * ${visibleReviews.length} - 16px * ${visibleReviews.length}));
          }
        }
        
        @media (min-width: 640px) {
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-280px * ${visibleReviews.length} - 20px * ${visibleReviews.length}));
            }
          }
        }
        
        @media (min-width: 768px) {
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-300px * ${visibleReviews.length} - 24px * ${visibleReviews.length}));
            }
          }
        }
        
        @media (min-width: 1024px) {
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-380px * ${visibleReviews.length} - 24px * ${visibleReviews.length}));
            }
          }
        }
        
        .animate-scroll {
          animation: scroll ${visibleReviews.length * 10}s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
