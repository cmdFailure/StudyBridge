import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '/features' },
    { label: 'Advanced AI', path: '/advanced' },
    { label: 'Upload', path: '/upload' },
    { label: 'Video Learning', path: '/video-learning' },
    { label: 'Profile', path: '/profile' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-slate-900/95 border-b border-slate-700 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            data-testid="logo-btn"
          >
            <div className="bg-blue-500 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
              StudyBridge
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.path}
                data-testid={`nav-${link.label.toLowerCase()}`}
                onClick={() => navigate(link.path)}
                className={`text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-blue-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button
              data-testid="header-get-started-btn"
              onClick={() => navigate('/upload')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-slate-700">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={() => {
                navigate('/upload');
                setMobileMenuOpen(false);
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-4"
            >
              Get Started
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};