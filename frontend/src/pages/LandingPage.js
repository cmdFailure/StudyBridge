import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Sparkles, Upload, User } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-6 py-3 rounded-full backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-medium">Free & Accessible AI-Powered Learning</span>
          </div>

          {/* Main Headline */}
          <div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="text-white">Transform Learning</span>
              <br />
              <span className="text-blue-400">Break Barriers</span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            AI-powered platform that transforms any PDF into an accessible learning experience.
            Making education truly inclusive for students with disabilities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              data-testid="upload-first-pdf-btn"
              onClick={() => navigate('/upload')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/50 min-w-[240px]"
            >
              Upload Your First PDF
              <Upload className="ml-2 w-5 h-5" />
            </Button>
            <Button
              data-testid="setup-profile-btn"
              onClick={() => navigate('/profile')}
              variant="outline"
              className="border-slate-600 bg-slate-800/50 hover:bg-slate-700 text-white px-8 py-6 text-lg rounded-xl min-w-[240px]"
            >
              Set Up Profile
              <User className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};