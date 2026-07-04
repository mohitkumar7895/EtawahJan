'use client';

import { FileText, Phone, Menu, X, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import NotificationBell from './NotificationBell';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/digital-services', label: 'Digital Work' },
    { path: '/build-website', label: 'Website Banwana' },
    { path: '/tools', label: 'Tools' },
    { path: '/vacancies', label: 'Vacancies' },
    { path: '/announcements', label: 'Announcements' },
    { path: '/contact', label: 'Contact' },
  ];

  const handleChatClick = () => {
    // Dispatch event to open chat
    window.dispatchEvent(new CustomEvent('openChat'));
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white shadow-xl sticky top-0 z-50 backdrop-blur-sm" style={{ scrollMarginTop: '0px' }}>
      <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 sm:space-x-3 hover:opacity-90 transition group min-w-0 flex-1"
          >
            <div className="flex-shrink-0">
              <Image 
                src="/jan-seva-logo-1.png" 
                alt="Jan Seva Kendra Logo" 
                width={80}
                height={80}
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-20 lg:h-20 object-contain"
                priority
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold tracking-tight truncate">
                 Jan Seva Kendra
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 hidden xs:block">सेवा ही धर्म है</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-white/20 text-white shadow-md'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side - Phone, Chat & Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notification Bell */}
            <NotificationBell />

            {/* Chat Button - Desktop */}
            <button
              onClick={handleChatClick}
              className="hidden md:flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl group"
              aria-label="Open Chat Support"
            >
              <MessageCircle className="w-4 h-4 group-hover:scale-110 transition" />
              <span className="font-semibold text-sm">Chat</span>
            </button>

            {/* Chat Button - Mobile */}
            <button
              onClick={handleChatClick}
              className="md:hidden bg-green-600 hover:bg-green-700 p-2 rounded-lg transition shadow-lg"
              aria-label="Open Chat"
            >
              <MessageCircle className="w-5 h-5" />
            </button>

            {/* Phone Number - Desktop */}
            <a 
              href="tel:9193898182" 
              className="hidden md:flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition group"
            >
              <Phone className="w-4 h-4 group-hover:scale-110 transition" />
              <span className="font-semibold text-sm">9193898182</span>
            </a>

            {/* Call Button - Mobile */}
            <a 
              href="tel:9193898182" 
              className="md:hidden bg-white/10 hover:bg-white/20 p-2 rounded-lg transition"
              aria-label="Call"
            >
              <Phone className="w-5 h-5" />
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/20 pt-4 animate-in slide-in-from-top">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition ${
                    isActive(link.path)
                      ? 'bg-white/20 text-white'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  handleChatClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition mt-2 w-full"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat Support</span>
              </button>
              <a 
                href="tel:9193898182"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition mt-2"
              >
                <Phone className="w-5 h-5" />
                <span>Call Now: 9193898182, 7895094129</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}







