import React, { useState, useEffect } from 'react';
import { Hand, Play, Pause } from 'lucide-react';

export const SignLanguageInterpreter = ({ text, isActive }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWord, setCurrentWord] = useState('');

  useEffect(() => {
    if (isActive && isPlaying && text) {
      const words = text.split(' ');
      let index = 0;
      
      const interval = setInterval(() => {
        if (index < words.length) {
          setCurrentWord(words[index]);
          index++;
        } else {
          setIsPlaying(false);
          setCurrentWord('');
        }
      }, 800); // Sign each word for 800ms

      return () => clearInterval(interval);
    }
  }, [isActive, isPlaying, text]);

  if (!isActive) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 bg-slate-800 border-2 border-purple-500 rounded-2xl shadow-2xl z-40 overflow-hidden"
      data-testid="sign-language-interpreter"
    >
      {/* Avatar Container */}
      <div className="relative w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
        {/* Animated Avatar */}
        <div className="relative">
          {/* Head */}
          <div className="w-20 h-24 bg-gradient-to-b from-purple-400 to-purple-500 rounded-t-full mx-auto relative">
            {/* Eyes */}
            <div className="flex justify-center gap-4 pt-8">
              <div className="w-2 h-2 bg-white rounded-full animate-blink" />
              <div className="w-2 h-2 bg-white rounded-full animate-blink" />
            </div>
            {/* Mouth */}
            <div className="w-6 h-1 bg-white rounded-full mx-auto mt-4" />
          </div>
          
          {/* Body */}
          <div className="w-16 h-20 bg-gradient-to-b from-purple-500 to-purple-600 rounded-b-lg mx-auto" />
          
          {/* Hands - Animated based on signing */}
          <div className={`absolute -left-8 top-16 transition-all duration-300 ${
            isPlaying ? 'animate-sign-left' : ''
          }`}>
            <Hand className="w-8 h-8 text-purple-300" />
          </div>
          <div className={`absolute -right-8 top-16 transition-all duration-300 ${
            isPlaying ? 'animate-sign-right' : ''
          }`}>
            <Hand className="w-8 h-8 text-purple-300 transform scale-x-[-1]" />
          </div>
        </div>

        {/* Current Word Display */}
        {currentWord && (
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <div className="bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-full inline-block border border-purple-500">
              <p className="text-white font-bold">{currentWord}</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-slate-900 p-4 flex items-center justify-between">
        <div>
          <p className="text-white font-semibold text-sm">ASL Interpreter</p>
          <p className="text-slate-400 text-xs">American Sign Language</p>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full transition-all"
          aria-label={isPlaying ? 'Pause signing' : 'Start signing'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
      </div>

      {/* Info Badge */}
      <div className="absolute top-2 left-2">
        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          LIVE
        </div>
      </div>
    </div>
  );
};
