import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Sparkles, Upload, User, Video, FileText, Zap, Globe, Volume2 } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { icon: FileText, title: 'PDF Learning', color: 'blue' },
    { icon: Video, title: 'Video Learning', color: 'purple' },
    { icon: Volume2, title: 'Text-to-Speech', color: 'green' },
    { icon: Globe, title: 'Multi-Language', color: 'red' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.3), transparent 50%)`,
          transition: 'background 0.3s ease'
        }}
      ></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse-custom"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-custom" style={{animationDelay: '1s'}}></div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-6 py-3 rounded-full backdrop-blur-sm glass hover-scale animate-slide-in-up">
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse-custom" />
            <span className="text-blue-400 font-medium">Free & Accessible AI-Powered Learning</span>
          </div>

          {/* Main Headline */}
          <div className="animate-slide-in-up" style={{animationDelay: '0.2s'}}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="text-white">Transform Learning</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
                Break Barriers
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed animate-slide-in-up" style={{animationDelay: '0.4s'}}>
            AI-powered platform that transforms any <span className="text-blue-400 font-semibold">PDF</span> or <span className="text-purple-400 font-semibold">Video</span> into an accessible learning experience.
            Making education truly inclusive for students with disabilities.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 animate-slide-in-up" style={{animationDelay: '0.6s'}}>
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className={`glass px-4 py-2 rounded-full flex items-center gap-2 hover-scale border border-${feature.color}-500/30`}
                >
                  <Icon className={`w-4 h-4 text-${feature.color}-400`} />
                  <span className="text-slate-300 text-sm font-medium">{feature.title}</span>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-in-up" style={{animationDelay: '0.8s'}}>
            <Button
              data-testid="upload-first-pdf-btn"
              onClick={() => navigate('/upload')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/50 min-w-[240px] btn-interactive animate-glow"
            >
              Upload Your First PDF
              <Upload className="ml-2 w-5 h-5" />
            </Button>
            <Button
              data-testid="video-learning-btn"
              onClick={() => navigate('/video-learning')}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-purple-500/50 min-w-[240px] btn-interactive"
            >
              Try Video Learning
              <Video className="ml-2 w-5 h-5" />
            </Button>
            <Button
              data-testid="setup-profile-btn"
              onClick={() => navigate('/profile')}
              variant="outline"
              className="border-slate-600 bg-slate-800/50 hover:bg-slate-700 text-white px-8 py-6 text-lg rounded-xl min-w-[240px] glass hover-scale"
            >
              Set Up Profile
              <User className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-12 animate-slide-in-up" style={{animationDelay: '1s'}}>
            <div className="glass p-6 rounded-xl hover-scale">
              <div className="text-3xl font-bold text-blue-400 mb-2">10+</div>
              <div className="text-slate-400 text-sm">Accessibility Features</div>
            </div>
            <div className="glass p-6 rounded-xl hover-scale" style={{animationDelay: '0.1s'}}>
              <div className="text-3xl font-bold text-purple-400 mb-2">2</div>
              <div className="text-slate-400 text-sm">Learning Modes</div>
            </div>
            <div className="glass p-6 rounded-xl hover-scale" style={{animationDelay: '0.2s'}}>
              <div className="text-3xl font-bold text-green-400 mb-2">3</div>
              <div className="text-slate-400 text-sm">Languages Supported</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};