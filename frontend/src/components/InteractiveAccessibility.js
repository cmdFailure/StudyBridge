import React, { useState, useEffect } from 'react';

export const ReadingGuide = ({ isActive }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <>
      {/* Horizontal Reading Ruler */}
      <div
        className="fixed left-0 right-0 pointer-events-none z-40"
        style={{ top: `${position.y}px` }}
        data-testid="reading-guide"
      >
        {/* Top shadow */}
        <div className="h-screen bg-black/40 -mb-screen" style={{ marginTop: '-100vh' }} />
        
        {/* Highlighted reading line */}
        <div className="h-12 bg-yellow-400/20 border-y-2 border-yellow-400 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
        </div>
        
        {/* Bottom shadow */}
        <div className="h-screen bg-black/40" />
      </div>

      {/* Vertical Guide Line */}
      <div
        className="fixed top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent pointer-events-none z-40"
        style={{ left: `${position.x}px` }}
      />
    </>
  );
};

export const KeyboardNavigationGuide = ({ isActive }) => {
  const [focusedElement, setFocusedElement] = useState(null);

  useEffect(() => {
    if (!isActive) return;

    const handleFocus = (e) => {
      setFocusedElement(e.target);
    };

    document.addEventListener('focusin', handleFocus);
    return () => document.removeEventListener('focusin', handleFocus);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none" data-testid="keyboard-nav-guide">
      <div className="bg-slate-800 border border-blue-500 rounded-xl px-6 py-3 shadow-2xl">
        <p className="text-white text-sm font-medium">
          Keyboard Navigation Active
        </p>
        <div className="flex gap-3 mt-2 text-xs text-slate-300">
          <span className="bg-slate-700 px-2 py-1 rounded">Tab</span>
          <span>Navigate</span>
          <span>•</span>
          <span className="bg-slate-700 px-2 py-1 rounded">Enter</span>
          <span>Select</span>
          <span>•</span>
          <span className="bg-slate-700 px-2 py-1 rounded">Esc</span>
          <span>Cancel</span>
        </div>
      </div>
    </div>
  );
};

export const ColorBlindFilter = ({ mode }) => {
  if (!mode || mode === 'none') return null;

  const filters = {
    protanopia: 'grayscale(0%) sepia(100%) hue-rotate(-50deg) saturate(200%)',
    deuteranopia: 'grayscale(0%) sepia(100%) hue-rotate(90deg) saturate(150%)',
    tritanopia: 'grayscale(0%) sepia(100%) hue-rotate(180deg) saturate(120%)',
    monochrome: 'grayscale(100%)',
    highContrast: 'contrast(200%) brightness(110%)'
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30"
      style={{ 
        filter: filters[mode],
        mixBlendMode: 'multiply'
      }}
      data-testid="color-blind-filter"
    />
  );
};

export const LiveCaptions = ({ text, isActive }) => {
  const [displayText, setDisplayText] = useState('');
  const [words, setWords] = useState([]);

  useEffect(() => {
    if (isActive && text) {
      const wordArray = text.split(' ');
      setWords(wordArray);
      
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < wordArray.length) {
          setDisplayText(wordArray.slice(Math.max(0, currentIndex - 10), currentIndex + 1).join(' '));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [text, isActive]);

  if (!isActive || !displayText) return null;

  return (
    <div 
      className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40 max-w-4xl w-full px-4"
      data-testid="live-captions"
    >
      <div className="bg-black/90 backdrop-blur-sm border-2 border-cyan-500 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <p className="text-cyan-400 text-sm font-semibold">LIVE CAPTIONS</p>
        </div>
        <p className="text-white text-xl leading-relaxed">
          {displayText}
        </p>
      </div>
    </div>
  );
};
