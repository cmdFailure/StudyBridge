import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, BookOpen, Target, Brain, Zap } from 'lucide-react';

export const AnalyticsDashboard = ({ pdfData, simplifiedText }) => {
  const [analytics, setAnalytics] = useState({
    readingTime: 0,
    comprehensionScore: 0,
    focusLevel: 85,
    recommendedBreak: false,
    optimalLearningTime: 'Morning (8-10 AM)',
    cognitiveLoad: 'Moderate'
  });

  useEffect(() => {
    // Simulate analytics calculations
    if (pdfData) {
      const wordCount = pdfData.wordCount || 0;
      const estimatedTime = Math.round(wordCount / 200); // 200 words per minute
      
      setAnalytics(prev => ({
        ...prev,
        readingTime: estimatedTime,
        comprehensionScore: simplifiedText ? 92 : 78
      }));
    }
  }, [pdfData, simplifiedText]);

  const metrics = [
    {
      icon: Clock,
      label: 'Estimated Reading Time',
      value: `${analytics.readingTime} min`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Brain,
      label: 'Comprehension Score',
      value: `${analytics.comprehensionScore}%`,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Zap,
      label: 'Focus Level',
      value: `${analytics.focusLevel}%`,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Target,
      label: 'Cognitive Load',
      value: analytics.cognitiveLoad,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    }
  ];

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6" data-testid="analytics-dashboard">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-bold text-white">Learning Analytics</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-slate-900/50 rounded-xl p-4">
              <div className={`${metric.bgColor} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <p className="text-sm text-slate-400 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-white">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-purple-400 mt-1" />
          <div>
            <h4 className="text-white font-semibold mb-2">AI Recommendation</h4>
            <p className="text-slate-300 text-sm">
              Your optimal learning time is <strong className="text-blue-400">{analytics.optimalLearningTime}</strong>.
              {analytics.recommendedBreak && ' Consider taking a 10-minute break to maintain focus.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
