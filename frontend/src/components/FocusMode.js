import React, { useState, useEffect } from 'react';
import { X, Volume2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

export const FocusMode = ({ content, isActive, onClose }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [fontSize, setFontSize] = useState(24);
  const [isReading, setIsReading] = useState(false);

  const lines = content?.split('\n').filter(line => line.trim()) || [];

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isActive) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentLine(prev => Math.min(prev + 1, lines.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentLine(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive, lines.length, onClose]);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onend = () => {
      setIsReading(false);
      if (currentLine < lines.length - 1) {
        setCurrentLine(prev => prev + 1);
      }
    };
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center p-8" data-testid="focus-mode">
      {/* Close Button */}
      <Button
        onClick={onClose}
        className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-white"
        size="icon"
        aria-label="Close focus mode"
      >
        <X className="w-5 h-5" />
      </Button>

      {/* Controls */}
      <div className="absolute top-4 left-4 flex gap-2">
        <Button
          onClick={() => setFontSize(prev => Math.min(prev + 2, 48))}
          className="bg-slate-800 hover:bg-slate-700 text-white"
          size="sm"
        >
          A+
        </Button>
        <Button
          onClick={() => setFontSize(prev => Math.max(prev - 2, 16))}
          className="bg-slate-800 hover:bg-slate-700 text-white"
          size="sm"
        >
          A-
        </Button>
        <Button
          onClick={() => speak(lines[currentLine])}
          className="bg-blue-500 hover:bg-blue-600 text-white"
          size="sm"
        >
          <Volume2 className="w-4 h-4 mr-2" />
          {isReading ? 'Reading...' : 'Read Line'}
        </Button>
      </div>

      {/* Content */}
      <div className="max-w-4xl w-full">
        {/* Previous lines (dimmed) */}
        {currentLine > 0 && (
          <div className="mb-8 opacity-40">
            <p className="text-slate-400 text-lg text-center">
              {lines[currentLine - 1]}
            </p>
          </div>
        )}

        {/* Current line (highlighted) */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl" />
          <div className="relative bg-slate-800/90 backdrop-blur-sm border-2 border-blue-500 rounded-2xl p-8 shadow-2xl">
            <p 
              className="text-white text-center leading-relaxed"
              style={{ fontSize: `${fontSize}px` }}
            >
              {lines[currentLine]}
            </p>
          </div>
        </div>

        {/* Next line (preview) */}
        {currentLine < lines.length - 1 && (
          <div className="mt-8 opacity-40">
            <p className="text-slate-400 text-lg text-center">
              {lines[currentLine + 1]}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            onClick={() => setCurrentLine(prev => Math.max(prev - 1, 0))}
            disabled={currentLine === 0}
            className="bg-slate-800 hover:bg-slate-700 text-white"
            aria-label="Previous line"
          >
            <ChevronUp className="w-5 h-5" />
          </Button>
          <span className="text-slate-400 text-sm">
            Line {currentLine + 1} of {lines.length}
          </span>
          <Button
            onClick={() => setCurrentLine(prev => Math.min(prev + 1, lines.length - 1))}
            disabled={currentLine === lines.length - 1}
            className="bg-slate-800 hover:bg-slate-700 text-white"
            aria-label="Next line"
          >
            <ChevronDown className="w-5 h-5" />
          </Button>
        </div>

        {/* Keyboard Hints */}
        <div className="mt-8 flex justify-center gap-4 text-xs text-slate-500">
          <span>↑↓ Navigate</span>
          <span>•</span>
          <span>ESC Close</span>
          <span>•</span>
          <span>Space Read</span>
        </div>
      </div>
    </div>
  );
};
