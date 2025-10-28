import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Sparkles, Upload, User, Video, FileText, Zap, Globe, Volume2, ArrowRight, Brain, Shield } from 'lucide-react';

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
    { icon: FileText, title: 'PDF Learning', color: 'from-blue-500 to-cyan-500', delay: '0s' },
    { icon: Video, title: 'Video Learning', color: 'from-purple-500 to-pink-500', delay: '0.1s' },
    { icon: Volume2, title: 'Text-to-Speech', color: 'from-green-500 to-emerald-500', delay: '0.2s' },
    { icon: Globe, title: 'Multi-Language', color: 'from-red-500 to-orange-500', delay: '0.3s' },
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Gradient Mesh Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div 
          className="absolute w-full h-full opacity-40"
          style={{
            background: `radial-gradient(circle 600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
            transition: 'background 0.3s ease'
          }}
        ></div>
      </div>
      
      {/* Floating Orbs with Gradients */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-transparent rounded-full blur-3xl animate-pulse-custom pointer-events-none"></div>
      <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/30 to-transparent rounded-full blur-3xl animate-pulse-custom pointer-events-none" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-transparent rounded-full blur-3xl animate-pulse-custom pointer-events-none" style={{animationDelay: '2s'}}></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center space-y-8 py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 premium-card px-6 py-3 rounded-full hover-scale animate-slide-in-up border border-blue-500/20">
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse-custom" />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">Free & Accessible AI-Powered Learning</span>
          </div>

          {/* Main Headline with Mega Impact */}
          <div className="animate-slide-in-up space-y-4" style={{animationDelay: '0.2s'}}>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="block text-white mb-2">Transform Learning</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient text-glow-blue">
                Break Barriers
              </span>
            </h1>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30">
                <span className="text-blue-300 font-semibold">AI-Powered</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30">
                <span className="text-purple-300 font-semibold">Inclusive</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-pink-600/20 border border-pink-500/30">
                <span className="text-pink-300 font-semibold">Accessible</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed animate-slide-in-up" style={{animationDelay: '0.4s'}}>
            AI-powered platform that transforms any <span className="text-blue-400 font-bold">PDF</span> or <span className="text-purple-400 font-bold">Video</span> into an accessible learning experience.
            <span className="block mt-2 text-lg text-gray-400">Making education truly inclusive for students with disabilities.</span>
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-slide-in-up" style={{animationDelay: '0.6s'}}>
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="premium-card p-4 rounded-2xl card-lift border border-white/10 group"
                  style={{animationDelay: feature.delay}}
                >
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-300 text-sm font-medium">{feature.title}</span>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons - Enhanced */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-slide-in-up" style={{animationDelay: '0.8s'}}>
            <Button
              data-testid="upload-first-pdf-btn"
              onClick={() => navigate('/upload')}
              className="cyber-button text-white px-10 py-7 text-lg rounded-2xl min-w-[280px] font-bold group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Upload Your First PDF
                <Upload className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button
              data-testid="video-learning-btn"
              onClick={() => navigate('/video-learning')}
              className="relative px-10 py-7 text-lg rounded-2xl min-w-[280px] font-bold overflow-hidden group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                Try Video Learning
                <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </span>
            </Button>
            <Button
              data-testid="setup-profile-btn"
              onClick={() => navigate('/profile')}
              variant="outline"
              className="border-2 border-gray-700 hover:border-gray-600 bg-gray-900/50 hover:bg-gray-800/50 text-white px-10 py-7 text-lg rounded-2xl min-w-[280px] font-bold backdrop-blur-sm"
            >
              <span className="flex items-center justify-center gap-2">
                Set Up Profile
                <User className="w-5 h-5" />
              </span>
            </Button>
          </div>

          {/* Stats Section - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-5xl mx-auto animate-slide-in-up" style={{animationDelay: '1s'}}>
            <div className="premium-card p-8 rounded-2xl card-lift border border-blue-500/20 group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">10+</div>
              <div className="text-gray-400 text-sm font-medium">Accessibility Features</div>
            </div>
            <div className="premium-card p-8 rounded-2xl card-lift border border-purple-500/20 group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">2</div>
              <div className="text-gray-400 text-sm font-medium">Learning Modes</div>
            </div>
            <div className="premium-card p-8 rounded-2xl card-lift border border-green-500/20 group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">100%</div>
              <div className="text-gray-400 text-sm font-medium">Free & Accessible</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};