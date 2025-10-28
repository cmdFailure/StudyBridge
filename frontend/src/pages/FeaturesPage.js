import React from 'react';
import { Wand2, Volume2, Eye, BookOpen, Scan, CheckCircle2, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Wand2,
    title: 'AI Simplification',
    description: 'Advanced Google Gemini AI adapts content for different disabilities and reading levels, ensuring comprehension for all students.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Volume2,
    title: 'Audio Support',
    description: 'High-quality text-to-speech with adjustable speed, multiple voices, and natural pronunciation for enhanced learning.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Eye,
    title: 'Visual Enhancements',
    description: 'Customizable fonts, sizes, colors, and spacing. High contrast modes and dyslexic-friendly options for optimal readability.',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: BookOpen,
    title: 'Smart Study Tools',
    description: 'AI-generated flashcards, summaries, key terms, and quizzes tailored to your content and learning style.',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    icon: Scan,
    title: 'OCR Processing',
    description: 'Advanced text extraction using Tesseract recognition to convert image-based PDFs into accessible text.',
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    icon: CheckCircle2,
    title: 'WCAG Compliant',
    description: 'Fully accessible interface following WCAG 2.1 AA standards, ensuring usability for everyone regardless of ability.',
    gradient: 'from-cyan-500 to-blue-500'
  }
];

export const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse-custom pointer-events-none"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse-custom pointer-events-none" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-transparent rounded-full blur-3xl animate-pulse-custom pointer-events-none" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-in-up">
          <div className="inline-flex items-center gap-2 premium-card px-6 py-3 rounded-full mb-6 border border-blue-500/20">
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse-custom" />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">Powerful Features</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
            <span className="block">Everything You Need</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
              For Accessible Learning
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive suite of AI-powered tools designed to make learning accessible for all students
          </p>
        </div>

        {/* Grid of Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                data-testid={`feature-card-${idx}`}
                className="premium-card rounded-2xl p-8 card-lift border border-white/10 group stagger-item"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};