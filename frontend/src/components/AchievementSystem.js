import React, { useState, useEffect } from 'react';
import { Trophy, Award, Star, Zap, Target, Crown } from 'lucide-react';

export const AchievementSystem = () => {
  const [userAchievements, setUserAchievements] = useState([]);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    // Load achievements from localStorage
    const stored = localStorage.getItem('userStats');
    if (stored) {
      const stats = JSON.parse(stored);
      setUserAchievements(stats.achievements || []);
      setLevel(Math.floor(stats.totalTime / 3600) + 1); // Level up every 60 hours
      setXp(stats.totalTime % 3600);
    }
  }, []);

  const achievements = [
    {
      id: 'first_pdf',
      icon: Award,
      title: 'First Steps',
      description: 'Upload your first PDF',
      unlocked: userAchievements.includes('first_pdf'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'simplify_master',
      icon: Star,
      title: 'Simplification Master',
      description: 'Simplify 10 documents',
      unlocked: userAchievements.includes('simplify_master'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'week_streak',
      icon: Zap,
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      unlocked: userAchievements.includes('week_streak'),
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'quiz_champion',
      icon: Target,
      title: 'Quiz Champion',
      description: 'Complete 25 quizzes',
      unlocked: userAchievements.includes('quiz_champion'),
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'legend',
      icon: Crown,
      title: 'StudyBridge Legend',
      description: 'Reach Level 10',
      unlocked: level >= 10,
      color: 'from-amber-500 to-red-500'
    }
  ];

  const xpPercentage = (xp / 3600) * 100;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6" data-testid="achievement-system">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-bold text-white">Achievements</h3>
      </div>

      {/* Level Progress */}
      <div className="bg-slate-900/50 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-white">Level {level}</p>
            <p className="text-sm text-slate-400">StudyBridge Scholar</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
            <Crown className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">{Math.round(xpPercentage)}% to next level</p>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <div
              key={achievement.id}
              className={`relative rounded-xl p-4 border-2 transition-all ${
                achievement.unlocked
                  ? `bg-gradient-to-br ${achievement.color} border-white/20`
                  : 'bg-slate-900/50 border-slate-700 opacity-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                achievement.unlocked ? 'bg-white/20' : 'bg-slate-700'
              }`}>
                <Icon className={`w-5 h-5 ${achievement.unlocked ? 'text-white' : 'text-slate-500'}`} />
              </div>
              <h4 className={`font-semibold text-sm mb-1 ${achievement.unlocked ? 'text-white' : 'text-slate-500'}`}>
                {achievement.title}
              </h4>
              <p className={`text-xs ${achievement.unlocked ? 'text-white/80' : 'text-slate-600'}`}>
                {achievement.description}
              </p>
              {achievement.unlocked && (
                <div className="absolute top-2 right-2">
                  <div className="bg-green-500 rounded-full p-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
