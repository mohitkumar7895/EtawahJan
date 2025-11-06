import { FileText, Phone, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/vacancies', label: 'Vacancies' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white shadow-xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-90 transition group"
          >
            <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition">
              <FileText className="w-7 h-7 text-blue-100" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">Jan Seva Kendra</h1>
              <p className="text-xs md:text-sm text-blue-100">सेवा ही धर्म है</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
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

          {/* Right Side - Phone & Mobile Menu */}
          <div className="flex items-center space-x-4">
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
                  to={link.path}
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
              <a 
                href="tel:9193898182"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition mt-2"
              >
                <Phone className="w-5 h-5" />
                <span>Call Now: 9193898182</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}