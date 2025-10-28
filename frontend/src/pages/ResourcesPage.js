import React, { useState } from 'react';
import { BookOpen, Briefcase, Home, DollarSign, GraduationCap, Heart, Users, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';

const resourceCategories = [
  {
    id: 'education',
    title: 'Educational Resources',
    icon: GraduationCap,
    gradient: 'from-blue-500 to-cyan-500',
    resources: [
      { title: 'Math Fundamentals', level: 'Beginner', format: 'PDF, Audio, Braille' },
      { title: 'Reading Comprehension', level: 'Intermediate', format: 'Interactive, Audio' },
      { title: 'Science Basics', level: 'Beginner', format: 'Video, Simplified Text' },
      { title: 'History Lessons', level: 'All Levels', format: 'Audio, Sign Language' },
    ]
  },
  {
    id: 'job_readiness',
    title: 'Job Readiness & Career',
    icon: Briefcase,
    gradient: 'from-purple-500 to-pink-500',
    resources: [
      { title: 'Resume Builder for Disabled Workers', level: 'All Levels', format: 'Interactive, Templates' },
      { title: 'Interview Skills Training', level: 'Intermediate', format: 'Video, Audio, Practice' },
      { title: 'Workplace Rights & Accommodations', level: 'All Levels', format: 'PDF, Audio' },
      { title: 'Remote Work Opportunities', level: 'All Levels', format: 'Database, Audio Guide' },
    ]
  },
  {
    id: 'daily_living',
    title: 'Daily Living Skills',
    icon: Home,
    gradient: 'from-green-500 to-emerald-500',
    resources: [
      { title: 'Cooking & Nutrition Basics', level: 'Beginner', format: 'Video, Audio, Step-by-Step' },
      { title: 'Personal Hygiene & Self-Care', level: 'Beginner', format: 'Illustrated, Audio' },
      { title: 'Using Public Transportation', level: 'Intermediate', format: 'Video, Maps, Audio' },
      { title: 'Home Safety & Emergency Prep', level: 'All Levels', format: 'Checklist, Audio' },
    ]
  },
  {
    id: 'financial',
    title: 'Financial Literacy',
    icon: DollarSign,
    gradient: 'from-orange-500 to-red-500',
    resources: [
      { title: 'Budgeting Made Simple', level: 'Beginner', format: 'Interactive, Calculator' },
      { title: 'Banking & Money Management', level: 'Beginner', format: 'Video, Audio, Guide' },
      { title: 'Understanding Benefits & Support', level: 'All Levels', format: 'PDF, Audio' },
      { title: 'Saving & Financial Planning', level: 'Intermediate', format: 'Interactive, Tools' },
    ]
  },
  {
    id: 'social',
    title: 'Social Skills & Relationships',
    icon: Heart,
    gradient: 'from-pink-500 to-rose-500',
    resources: [
      { title: 'Making Friends & Social Interaction', level: 'All Levels', format: 'Video, Scenarios' },
      { title: 'Online Safety & Digital Citizenship', level: 'All Levels', format: 'Interactive, Audio' },
      { title: 'Conflict Resolution', level: 'Intermediate', format: 'Video, Examples' },
      { title: 'Understanding Social Cues', level: 'All Levels', format: 'Visual, Audio' },
    ]
  },
  {
    id: 'community',
    title: 'Community & Support',
    icon: Users,
    gradient: 'from-indigo-500 to-purple-500',
    resources: [
      { title: 'Local Support Groups', level: 'All Levels', format: 'Directory, Contact Info' },
      { title: 'Disability Rights & Advocacy', level: 'All Levels', format: 'PDF, Audio, Video' },
      { title: 'Success Stories', level: 'Inspiring', format: 'Stories, Video, Audio' },
      { title: 'Peer Mentorship Program', level: 'All Levels', format: 'Platform, Chat' },
    ]
  },
];

export const ResourcesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse-custom pointer-events-none"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse-custom pointer-events-none" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-in-up">
          <div className="inline-flex items-center gap-2 premium-card px-6 py-3 rounded-full mb-6 border border-blue-500/20">
            <BookOpen className="w-5 h-5 text-blue-400 animate-pulse-custom" />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">Resource Library</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
            <span className="block">Free Accessible</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
              Learning Resources
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive resources for education, career, daily living, and independence
          </p>
        </div>

        {/* Resource Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resourceCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className="premium-card rounded-2xl p-6 card-lift border border-white/10 group cursor-pointer stagger-item"
                onClick={() => setSelectedCategory(category)}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {category.resources.length} resources available
                </p>
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
                  Explore Resources
                </Button>
              </div>
            );
          })}
        </div>

        {/* Resource Detail Modal */}
        {selectedCategory && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="premium-card w-full max-w-4xl max-h-[80vh] overflow-y-auto border border-white/10 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedCategory.gradient} flex items-center justify-center`}>
                    {React.createElement(selectedCategory.icon, { className: "w-8 h-8 text-white" })}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white">{selectedCategory.title}</h2>
                    <p className="text-gray-400">{selectedCategory.resources.length} resources</p>
                  </div>
                </div>
                <Button
                  onClick={() => setSelectedCategory(null)}
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                {selectedCategory.resources.map((resource, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-white mb-2">{resource.title}</h4>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                            {resource.level}
                          </span>
                          <span className="text-gray-400">{resource.format}</span>
                        </div>
                      </div>
                      <Button className="cyber-button">
                        Access
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
