import React, { useState, useEffect } from 'react';
import { Smile, Meh, Frown, Brain, Lightbulb } from 'lucide-react';

export const EmotionDetector = () => {
  const [emotion, setEmotion] = useState('neutral');
  const [suggestion, setSuggestion] = useState('');

  useEffect(() => {
    // Simulate emotion detection - in production, this would use facial recognition or sentiment analysis
    const emotions = ['happy', 'neutral', 'focused', 'tired'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    setEmotion(randomEmotion);

    // Generate suggestions based on emotion
    const suggestions = {
      happy: 'Great mood! This is an excellent time to tackle challenging content.',
      neutral: 'Steady focus detected. Continue with your current learning pace.',
      focused: 'Peak concentration! Maximize this time with complex material.',
      tired: 'Consider taking a 5-minute break or switching to lighter content.'
    };
    setSuggestion(suggestions[randomEmotion]);
  }, []);

  const getEmotionIcon = () => {
    switch (emotion) {
      case 'happy':
        return <Smile className=\"w-8 h-8 text-green-400\" />;
      case 'focused':
        return <Brain className=\"w-8 h-8 text-blue-400\" />;
      case 'tired':
        return <Frown className=\"w-8 h-8 text-orange-400\" />;
      default:
        return <Meh className=\"w-8 h-8 text-slate-400\" />;
    }
  };

  const getEmotionColor = () => {
    switch (emotion) {
      case 'happy':
        return 'from-green-500/10 to-emerald-500/10 border-green-500/30';
      case 'focused':
        return 'from-blue-500/10 to-cyan-500/10 border-blue-500/30';
      case 'tired':
        return 'from-orange-500/10 to-red-500/10 border-orange-500/30';
      default:
        return 'from-slate-500/10 to-slate-600/10 border-slate-500/30';
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getEmotionColor()} border rounded-2xl p-6`} data-testid=\"emotion-detector\">
      <div className=\"flex items-center gap-4 mb-4\">
        <div className=\"bg-slate-900/50 p-3 rounded-xl\">
          {getEmotionIcon()}
        </div>
        <div>
          <h3 className=\"text-lg font-bold text-white\">Emotion Detected</h3>
          <p className=\"text-sm text-slate-400 capitalize\">{emotion}</p>
        </div>
      </div>

      <div className=\"flex items-start gap-3 bg-slate-900/50 rounded-xl p-4\">
        <Lightbulb className=\"w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0\" />
        <p className=\"text-sm text-slate-300\">{suggestion}</p>
      </div>
    </div>
  );
};
