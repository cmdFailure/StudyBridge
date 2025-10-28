import React from 'react';
import { Wand2, Volume2, Eye, BookOpen, Scan, CheckCircle2 } from 'lucide-react';

const features = [
  {
    icon: Wand2,
    title: 'AI Simplification',
    description: 'Advanced Google Gemini AI adapts content for different disabilities and reading levels, ensuring comprehension for all students.'
  },
  {
    icon: Volume2,
    title: 'Audio Support',
    description: 'High-quality text-to-speech with adjustable speed, multiple voices, and natural pronunciation for enhanced learning.'
  },
  {
    icon: Eye,
    title: 'Visual Enhancements',
    description: 'Customizable fonts, sizes, colors, and spacing. High contrast modes and dyslexic-friendly options for optimal readability.'
  },
  {
    icon: BookOpen,
    title: 'Smart Study Tools',
    description: 'AI-generated flashcards, summaries, key terms, and quizzes tailored to your content and learning style.'
  },
  {
    icon: Scan,
    title: 'OCR Processing',
    description: 'Advanced text extraction using Tesseract recognition to convert image-based PDFs into accessible text.'
  },
  {
    icon: CheckCircle2,
    title: 'WCAG Compliant',
    description: 'Fully accessible interface following WCAG 2.1 AA standards, ensuring usability for everyone regardless of ability.'
  }
];

export const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid of Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                data-testid={`feature-card-${idx}`}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:bg-slate-800 transition-all hover:border-blue-500/50"
              >
                <div className="bg-blue-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-blue-400" />
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