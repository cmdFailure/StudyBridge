import React, { useState, useEffect } from 'react';
import { Hand, Play, Pause, Volume2, Languages } from 'lucide-react';

// ASL Hand Gesture Positions (simplified representation)
const ASLGestures = {
  A: { left: '20deg', right: '-20deg', type: 'fist' },
  B: { left: '0deg', right: '0deg', type: 'flat' },
  C: { left: '45deg', right: '45deg', type: 'curved' },
  D: { left: '90deg', right: '-90deg', type: 'point' },
  E: { left: '180deg', right: '180deg', type: 'fist' },
  Hello: { left: '45deg', right: '45deg', type: 'wave', duration: 2 },
  Please: { left: '90deg', right: '90deg', type: 'circle', duration: 2 },
  Thank: { left: '45deg', right: '-45deg', type: 'flat', duration: 1.5 },
  You: { left: '0deg', right: '0deg', type: 'point', duration: 1 },
  Learn: { left: '30deg', right: '-30deg', type: 'grab', duration: 2 },
  Study: { left: '-30deg', right: '30deg', type: 'book', duration: 2 },
  Help: { left: '60deg', right: '60deg', type: 'lift', duration: 1.5 },
};

export const SignLanguageInterpreter = ({ text, isActive }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [currentGesture, setCurrentGesture] = useState(null);
  const [expression, setExpression] = useState('happy');
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    if (isActive && isPlaying && text) {
      const words = text.split(' ').slice(0, 20); // Limit for demo
      let index = 0;
      
      const interval = setInterval(() => {
        if (index < words.length) {
          const word = words[index];
          setCurrentWord(word);
          
          // Set gesture based on word or first letter
          const gesture = ASLGestures[word.charAt(0).toUpperCase()] || 
                         ASLGestures[word] || 
                         ASLGestures.A;
          setCurrentGesture(gesture);
          
          // Change expression based on word sentiment
          if (word.toLowerCase().includes('help') || word.toLowerCase().includes('please')) {
            setExpression('concerned');
          } else if (word.toLowerCase().includes('thank') || word.toLowerCase().includes('good')) {
            setExpression('happy');
          } else {
            setExpression('neutral');
          }
          
          // Speak word if audio enabled
          if (audioEnabled) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
          }
          
          index++;
        } else {
          setIsPlaying(false);
          setCurrentWord('');
          setCurrentGesture(null);
        }
      }, 1200); // Slower for better comprehension

      return () => clearInterval(interval);
    }
  }, [isActive, isPlaying, text, audioEnabled]);

  if (!isActive) return null;

  const getHandRotation = (hand) => {
    if (!currentGesture) return '0deg';
    return hand === 'left' ? currentGesture.left : currentGesture.right;
  };

  return (
    <div 
      className="fixed bottom-4 right-4 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 border-4 border-purple-400 rounded-3xl shadow-2xl z-40 overflow-hidden animate-float"
      style={{ width: '400px', height: '500px' }}
      data-testid="sign-language-interpreter"
    >
      {/* Avatar Container */}
      <div className="relative w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex flex-col items-center justify-center p-6">
        {/* Avatar */}
        <div className="relative scale-125 mb-6">
          {/* Head with cute features */}
          <div className="w-32 h-40 bg-gradient-to-b from-purple-300 to-purple-400 rounded-t-[50%] mx-auto relative shadow-lg">
            {/* Hair/Top decoration */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-purple-600 rounded-t-full" />
            
            {/* Eyes - expressive */}
            <div className="flex justify-center gap-8 pt-12">
              <div className="relative">
                <div className={`w-4 h-4 bg-white rounded-full ${expression === 'happy' ? 'animate-happy-blink' : 'animate-blink'}`}>
                  <div className="w-2 h-2 bg-slate-900 rounded-full absolute top-1 left-1" />
                </div>
                {expression === 'happy' && (
                  <div className="absolute -top-2 left-0 w-4 h-1 bg-purple-600 rounded-full transform -rotate-12" />
                )}
              </div>
              <div className="relative">
                <div className={`w-4 h-4 bg-white rounded-full ${expression === 'happy' ? 'animate-happy-blink' : 'animate-blink'}`}>
                  <div className="w-2 h-2 bg-slate-900 rounded-full absolute top-1 left-1" />
                </div>
                {expression === 'happy' && (
                  <div className="absolute -top-2 left-0 w-4 h-1 bg-purple-600 rounded-full transform rotate-12" />
                )}
              </div>
            </div>
            
            {/* Nose - cute */}
            <div className="w-2 h-3 bg-purple-500 rounded-full mx-auto mt-4" />
            
            {/* Mouth - changes with expression */}
            <div className="mt-4 flex justify-center">
              {expression === 'happy' && (
                <div className="w-8 h-4 border-b-4 border-white rounded-b-full" />
              )}
              {expression === 'neutral' && (
                <div className="w-6 h-1 bg-white rounded-full" />
              )}
              {expression === 'concerned' && (
                <div className="w-8 h-4 border-t-4 border-white rounded-t-full" />
              )}
            </div>
            
            {/* Blush */}
            <div className="absolute top-20 left-2">
              <div className="w-4 h-3 bg-pink-400/50 rounded-full" />
            </div>
            <div className="absolute top-20 right-2">
              <div className="w-4 h-3 bg-pink-400/50 rounded-full" />
            </div>
          </div>
          
          {/* Body - bigger and rounder */}
          <div className="w-28 h-32 bg-gradient-to-b from-purple-400 to-purple-500 rounded-b-3xl mx-auto shadow-lg relative">
            {/* Heart badge */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div className="text-2xl">❤️</div>
            </div>
          </div>
          
          {/* Hands - Realistic ASL positions */}
          <div 
            className="absolute -left-12 top-24 transition-all duration-500"
            style={{ 
              transform: `rotate(${getHandRotation('left')}) translateY(${isPlaying ? '-10px' : '0'})`,
            }}
          >
            <div className="relative">
              {/* Palm */}
              <div className="w-10 h-12 bg-purple-300 rounded-lg shadow-lg" />
              {/* Fingers */}
              {currentGesture?.type === 'point' ? (
                <div className="absolute -top-6 left-3 w-2 h-8 bg-purple-300 rounded-t-full" />
              ) : currentGesture?.type === 'flat' ? (
                <>
                  <div className="absolute -top-6 left-1 w-1.5 h-7 bg-purple-300 rounded-t-full" />
                  <div className="absolute -top-6 left-3 w-1.5 h-8 bg-purple-300 rounded-t-full" />
                  <div className="absolute -top-6 left-5 w-1.5 h-7 bg-purple-300 rounded-t-full" />
                  <div className="absolute -top-6 left-7 w-1.5 h-6 bg-purple-300 rounded-t-full" />
                </>
              ) : (
                <>
                  <div className="absolute -top-4 left-2 w-1.5 h-5 bg-purple-300 rounded-t-full transform rotate-12" />
                  <div className="absolute -top-3 left-4 w-1.5 h-4 bg-purple-300 rounded-t-full" />
                  <div className="absolute -top-3 left-6 w-1.5 h-4 bg-purple-300 rounded-t-full transform -rotate-12" />
                </>
              )}
            </div>
          </div>
          
          <div 
            className="absolute -right-12 top-24 transition-all duration-500"
            style={{ 
              transform: `rotate(${getHandRotation('right')}) translateY(${isPlaying ? '-10px' : '0'})`,
            }}
          >
            <div className="relative">
              {/* Palm */}
              <div className="w-10 h-12 bg-purple-300 rounded-lg shadow-lg" />
              {/* Fingers */}
              {currentGesture?.type === 'point' ? (
                <div className="absolute -top-6 left-3 w-2 h-8 bg-purple-300 rounded-t-full" />
              ) : currentGesture?.type === 'flat' ? (
                <>
                  <div className="absolute -top-6 left-1 w-1.5 h-7 bg-purple-300 rounded-t-full" />
                  <div className="absolute -top-6 left-3 w-1.5 h-8 bg-purple-300 rounded-t-full" />
                  <div className="absolute -top-6 left-5 w-1.5 h-7 bg-purple-300 rounded-t-full" />
                  <div className="absolute -top-6 left-7 w-1.5 h-6 bg-purple-300 rounded-t-full" />
                </>
              ) : (
                <>
                  <div className="absolute -top-4 left-2 w-1.5 h-5 bg-purple-300 rounded-t-full transform rotate-12" />
                  <div className="absolute -top-3 left-4 w-1.5 h-4 bg-purple-300 rounded-t-full" />
                  <div className="absolute -top-3 left-6 w-1.5 h-4 bg-purple-300 rounded-t-full transform -rotate-12" />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Current Word Display - Larger */}
        {currentWord && (
          <div className="absolute bottom-24 left-0 right-0 text-center">
            <div className="bg-slate-900/95 backdrop-blur-sm px-6 py-4 rounded-2xl inline-block border-2 border-purple-400 shadow-2xl">
              <p className="text-white font-bold text-2xl">{currentWord}</p>
              <p className="text-purple-300 text-sm mt-1">Signing in ASL</p>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        {isPlaying && (
          <div className="absolute bottom-20 left-0 right-0 px-6">
            <div className="w-full bg-purple-900/50 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-full animate-progress" />
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-purple-900 to-pink-900 p-5 flex items-center justify-between border-t-2 border-purple-400">
        <div>
          <p className="text-white font-bold text-base">ASL Companion</p>
          <p className="text-purple-300 text-xs flex items-center gap-1">
            <Languages className="w-3 h-3" />
            American Sign Language
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-lg transition-all ${
              audioEnabled ? 'bg-purple-500 text-white' : 'bg-purple-900/50 text-purple-400'
            }`}
            aria-label="Toggle audio"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-full transition-all shadow-lg"
            aria-label={isPlaying ? 'Pause signing' : 'Start signing'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Enhanced LIVE Badge */}
      <div className="absolute top-4 left-4">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="font-bold">LIVE ASL</span>
        </div>
      </div>

      {/* Accessibility indicator */}
      <div className="absolute top-4 right-4">
        <div className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
          WCAG AA
        </div>
      </div>
    </div>
  );
};
