import React, { useState, useEffect } from 'react';
import { Eye, Mic, Volume2, Keyboard, Focus, Ruler, Palette, Users, Zap, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

export const AccessibilityToolbar = ({ onFeatureToggle }) => {
  const [activeFeatures, setActiveFeatures] = useState({
    screenReader: false,
    signLanguage: false,
    keyboardNav: false,
    focusMode: false,
    readingGuide: false,
    colorBlind: false,
    voiceControl: false,
    liveCaptions: false,
    emergencyMode: false,
    collaborativeMode: false
  });

  const toggleFeature = (feature, label) => {
    const newState = !activeFeatures[feature];
    setActiveFeatures(prev => ({ ...prev, [feature]: newState }));
    onFeatureToggle?.(feature, newState);
    toast.success(`${label} ${newState ? 'enabled' : 'disabled'}`);
  };

  const tools = [
    {
      id: 'screenReader',
      icon: Eye,
      label: 'Screen Reader',
      description: 'Visual highlights with audio descriptions',
      color: 'bg-blue-500',
      shortcut: 'Alt+S'
    },
    {
      id: 'signLanguage',
      icon: Users,
      label: 'Sign Language',
      description: 'Real-time ASL interpretation',
      color: 'bg-purple-500',
      shortcut: 'Alt+L'
    },
    {
      id: 'keyboardNav',
      icon: Keyboard,
      label: 'Keyboard Guide',
      description: 'Visual navigation hints',
      color: 'bg-green-500',
      shortcut: 'Alt+K'
    },
    {
      id: 'focusMode',
      icon: Focus,
      label: 'Focus Mode',
      description: 'Distraction-free reading',
      color: 'bg-orange-500',
      shortcut: 'Alt+F'
    },
    {
      id: 'readingGuide',
      icon: Ruler,
      label: 'Reading Guide',
      description: 'Line-by-line tracker',
      color: 'bg-pink-500',
      shortcut: 'Alt+R'
    },
    {
      id: 'colorBlind',
      icon: Palette,
      label: 'Color Filter',
      description: 'Color blindness modes',
      color: 'bg-indigo-500',
      shortcut: 'Alt+C'
    },
    {
      id: 'voiceControl',
      icon: Mic,
      label: 'Voice Control',
      description: 'Hands-free commands',
      color: 'bg-red-500',
      shortcut: 'Alt+V'
    },
    {
      id: 'liveCaptions',
      icon: Volume2,
      label: 'Live Captions',
      description: 'Real-time text display',
      color: 'bg-cyan-500',
      shortcut: 'Alt+T'
    },
    {
      id: 'emergencyMode',
      icon: Zap,
      label: 'Quick Access',
      description: 'One-click optimization',
      color: 'bg-yellow-500',
      shortcut: 'Alt+Q'
    },
    {
      id: 'collaborativeMode',
      icon: Shield,
      label: 'Assistant Mode',
      description: 'Tutor/helper access',
      color: 'bg-teal-500',
      shortcut: 'Alt+A'
    }
  ];

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6" data-testid="accessibility-toolbar">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-400" />
          Accessibility Toolkit
        </h3>
        <Button
          onClick={() => {
            const allEnabled = Object.keys(activeFeatures).reduce((acc, key) => {
              acc[key] = true;
              return acc;
            }, {});
            setActiveFeatures(allEnabled);
            toast.success('All accessibility features enabled!');
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm"
        >
          Enable All
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeFeatures[tool.id];
          
          return (
            <button
              key={tool.id}
              onClick={() => toggleFeature(tool.id, tool.label)}
              className={`relative group text-left p-4 rounded-xl border-2 transition-all ${
                isActive
                  ? `${tool.color} border-white/30 shadow-lg`
                  : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
              }`}
              data-testid={`accessibility-${tool.id}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-slate-800'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-sm mb-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {tool.label}
                  </h4>
                  <p className={`text-xs ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                    {tool.description}
                  </p>
                  <p className={`text-xs mt-1 font-mono ${isActive ? 'text-white/60' : 'text-slate-600'}`}>
                    {tool.shortcut}
                  </p>
                </div>
              </div>
              
              {isActive && (
                <div className="absolute top-2 right-2">
                  <div className="bg-green-500 rounded-full p-1 animate-pulse">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Features Summary */}
      {Object.values(activeFeatures).filter(Boolean).length > 0 && (
        <div className="mt-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
          <p className="text-sm text-slate-300">
            <strong className="text-blue-400">{Object.values(activeFeatures).filter(Boolean).length}</strong> accessibility features active
          </p>
        </div>
      )}
    </div>
  );
};
