'use client';
import { useState, useEffect } from 'react';
import { User, X, BadgeCheck } from 'lucide-react';

// Massive Dummy data to create highly authentic FOMO
const NAMES = [
  'Rahul', 'Priya', 'Amit', 'Sanjay', 'Neha', 'Vikas', 'Pooja', 'Ankit', 'Ramesh', 'Sunita',
  'Mohit', 'Arpit', 'Vivek', 'Sneha', 'Riya', 'Karan', 'Deepak', 'Manish', 'Komal', 'Gaurav',
  'Vishal', 'Swati', 'Ajay', 'Anjali', 'Rohan', 'Sakshi', 'Tarun', 'Nidhi', 'Sachin', 'Divya',
  'Ashish', 'Jyoti', 'Mukesh', 'Kavita', 'Suresh', 'Anita', 'Rajesh', 'Poonam', 'Dinesh', 'Meena'
];
const CITIES = [
  'Lucknow', 'Kanpur', 'Etawah', 'Agra', 'Delhi', 'Noida', 'Gurugram', 'Meerut', 'Varanasi', 'Prayagraj',
  'Ghaziabad', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Mathura', 'Jhansi', 'Ayodhya',
  'Patna', 'Jaipur', 'Bhopal', 'Indore', 'Dehradun', 'Chandigarh', 'Mumbai', 'Pune', 'Bangalore', 'Hyderabad'
];
const ACTIONS = [
  // Website specific
  'just booked a Premium Business Website',
  'inquired about a custom E-Commerce store',
  'requested a quote for Website Redesign',
  'hired us for Corporate Website development',
  'just got their Startup Landing Page live',
  'inquired about a Next.js Web Application',
  'booked a Real Estate Property website',
  'purchased an SEO-optimized Business Website',
  'just signed up for a Web Design consultation',
  'inquired about a Dynamic Portfolio Website',
  'requested pricing for a News/Blog Portal',
  'booked a custom React.js Web App',
  'inquired about a Multi-vendor E-commerce Site',
  'just booked a 5-Page Local Business Website',
  'requested a quote for Hospital Management Website',
  
  // Software / Other
  'requested a Custom Software quote',
  'booked a Free Business Consultation',
  'inquired about Mobile App Development',
  'purchased a School Management ERP',
  'is interested in a Hospital CRM',
  'requested a quote for an Android App',
  'booked a digital marketing package',
  'inquired about Restaurant Billing Software',
  'hired a dedicated web developer',
  'just got a 20% discount on Web Design',
  'requested an SEO audit for their website'
];

export default function SocialProofPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [notification, setNotification] = useState({ name: '', city: '', action: '', time: '' });

  useEffect(() => {
    // Logic to show popup randomly every 15 to 30 seconds
    const triggerPopup = () => {
      // Pick random data
      const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
      const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
      const randomAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      const randomTime = Math.floor(Math.random() * 10) + 1; // 1 to 10 mins ago

      setNotification({
        name: randomName,
        city: randomCity,
        action: randomAction,
        time: `${randomTime} min ago`
      });

      setIsVisible(true);

      // Hide popup after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Initial delay before first popup
    const initialTimer = setTimeout(triggerPopup, 10000);

    // Continuous interval for subsequent popups
    const interval = setInterval(() => {
      if (!isVisible) triggerPopup();
    }, 25000); // Check every 25s

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9900] animate-slide-up sm:bottom-6 sm:left-6">
      <div className="bg-white p-3 pr-8 sm:p-4 sm:pr-10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-100 flex items-start gap-3 w-[300px] sm:w-[350px] relative overflow-hidden group">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-slate-300 hover:text-slate-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-100">
          <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center gap-1 mb-0.5">
            <span className="font-bold text-slate-900 text-sm">{notification.name}</span>
            <span className="text-slate-500 text-xs">from {notification.city}</span>
            <BadgeCheck className="w-3.5 h-3.5 text-blue-500 ml-1" />
          </div>
          <p className="text-slate-600 text-xs sm:text-sm leading-tight mb-1.5">
            {notification.action}
          </p>
          <p className="text-slate-400 text-[10px] sm:text-xs font-medium">
            {notification.time}
          </p>
        </div>

        <style jsx global>{`
          @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(20px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-slide-up {
            animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
      </div>
    </div>
  );
}
