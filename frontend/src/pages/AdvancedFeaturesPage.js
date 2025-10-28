import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Zap, Users, Trophy, TrendingUp, Target, Award, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { getStoredProfile } from '../utils/accessibility';

export const AdvancedFeaturesPage = () => {
  const navigate = useNavigate();
  const [profile] = useState(getStoredProfile());
  const [userStats, setUserStats] = useState({
    streak: 0,
    totalTime: 0,
    documentsProcessed: 0,
    achievements: []
  });

  useEffect(() => {
    // Load user stats from localStorage
    const stats = localStorage.getItem('userStats');
    if (stats) {
      setUserStats(JSON.parse(stats));
    }
  }, []);

  const advancedFeatures = [
    {
      icon: Brain,
      title: 'AI Learning Companion',
      description: 'Advanced emotion detection and adaptive learning that responds to your emotional state and cognitive load in real-time.',
      color: 'from-purple-500 to-pink-500',
      status: 'Active'
    },
    {
      icon: Zap,
      title: 'Personalized Learning Path',
      description: 'AI-driven schedules that adapt to your peak performance times, learning patterns, and energy levels throughout the day.',
      color: 'from-yellow-500 to-orange-500',
      status: 'Active'
    },
    {
      icon: Users,
      title: 'Collaborative Study Rooms',
      description: 'Real-time collaboration with peers, shared annotations, live tutoring sessions, and group learning experiences.',
      color: 'from-blue-500 to-cyan-500',
      status: 'Beta'
    },
    {
      icon: Trophy,
      title: 'Achievement System',
      description: 'Gamified learning with badges, streaks, milestones, and rewards that motivate continuous improvement.',
      color: 'from-green-500 to-emerald-500',
      status: 'Active'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Deep insights into your learning patterns, progress predictions, and personalized recommendations for improvement.',
      color: 'from-indigo-500 to-purple-500',
      status: 'Active'
    },
    {
      icon: Target,
      title: 'Cognitive Enhancement',
      description: 'Brain training exercises, focus optimization techniques, and memory enhancement through scientifically-proven methods.',
      color: 'from-red-500 to-pink-500',
      status: 'Coming Soon'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 px-6 py-3 rounded-full backdrop-blur-sm mb-6">
            <Star className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-medium">Advanced AI-Powered Features</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Next-Generation Learning
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Cutting-edge AI and accessibility technologies that adapt to your unique needs and learning style
          </p>
        </div>

        {/* User Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-slate-400 text-sm">Current Streak</span>
            </div>
            <p className="text-3xl font-bold text-white">{userStats.streak} days</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Brain className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-slate-400 text-sm">Total Study Time</span>
            </div>
            <p className="text-3xl font-bold text-white">{Math.round(userStats.totalTime / 60)}h</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <Trophy className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-slate-400 text-sm">Achievements</span>
            </div>
            <p className="text-3xl font-bold text-white">{userStats.achievements.length}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-500/20 p-2 rounded-lg">
                <Award className="w-5 h-5 text-orange-400" />
              </div>
              <span className="text-slate-400 text-sm">Documents Processed</span>
            </div>
            <p className="text-3xl font-bold text-white">{userStats.documentsProcessed}</p>
          </div>
        </div>

        {/* Advanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advancedFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:bg-slate-800 transition-all hover:border-purple-500/50 group"
              >
                <div className={`bg-gradient-to-br ${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {feature.title}
                  </h3>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    feature.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                    feature.status === 'Beta' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {feature.status}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed mb-6">
                  {feature.description}
                </p>
                {feature.status !== 'Coming Soon' && (
                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  >
                    Try It Now
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 border border-purple-500/30 rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Ready to Experience Advanced Learning?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Unlock the full potential of AI-powered accessibility and personalized learning
            </p>
            <Button
              onClick={() => navigate('/upload')}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-12 py-6 text-lg rounded-xl"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};