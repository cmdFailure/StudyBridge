import React from 'react';
import { Eye, Type, Contrast, AlignLeft } from 'lucide-react';
import { Slider } from './ui/slider';
import { dyslexicFonts, contrastModes } from '../utils/accessibility';

export const VisualAccessibilityPanel = ({ profile, onUpdateProfile }) => {
  const updateVisualNeeds = (key, value) => {
    onUpdateProfile({
      ...profile,
      visualNeeds: {
        ...profile.visualNeeds,
        [key]: value
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6" data-testid="visual-accessibility-panel">
      <div className="flex items-center gap-3 mb-6">
        <Eye className="w-6 h-6 text-purple-500" aria-hidden="true" />
        <h3 className="text-xl font-bold text-slate-800">Visual Accessibility</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="font-size" className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
            <Type className="w-4 h-4" aria-hidden="true" />
            Font Size: {profile.visualNeeds.fontSize}px
          </label>
          <Slider
            id="font-size"
            data-testid="font-size-slider"
            value={[profile.visualNeeds.fontSize]}
            onValueChange={(val) => updateVisualNeeds('fontSize', val[0])}
            min={12}
            max={32}
            step={1}
            className="w-full"
            aria-label="Adjust font size"
          />
        </div>

        <div>
          <label htmlFor="font-family" className="text-sm font-medium text-slate-700 mb-2 block">
            Font Style
          </label>
          <select
            id="font-family"
            data-testid="font-family-select"
            value={profile.visualNeeds.fontFamily}
            onChange={(e) => updateVisualNeeds('fontFamily', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            aria-label="Select font style"
          >
            <option value="Inter">Inter (Default)</option>
            <option value="Arial">Arial</option>
            <option value="Verdana">Verdana</option>
            <option value="Georgia">Georgia</option>
            <option value="'Comic Sans MS', cursive">Comic Sans (Dyslexic-friendly)</option>
            <option value="monospace">Monospace</option>
          </select>
        </div>

        <div>
          <label htmlFor="contrast-mode" className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Contrast className="w-4 h-4" aria-hidden="true" />
            Contrast Mode
          </label>
          <select
            id="contrast-mode"
            data-testid="contrast-mode-select"
            value={profile.visualNeeds.contrast}
            onChange={(e) => updateVisualNeeds('contrast', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            aria-label="Select contrast mode"
          >
            {contrastModes.map(mode => (
              <option key={mode.value} value={mode.value}>{mode.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="line-spacing" className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
            <AlignLeft className="w-4 h-4" aria-hidden="true" />
            Line Spacing: {profile.visualNeeds.lineSpacing}x
          </label>
          <Slider
            id="line-spacing"
            data-testid="line-spacing-slider"
            value={[profile.visualNeeds.lineSpacing]}
            onValueChange={(val) => updateVisualNeeds('lineSpacing', val[0])}
            min={1.0}
            max={3.0}
            step={0.1}
            className="w-full"
            aria-label="Adjust line spacing"
          />
        </div>

        <div>
          <label htmlFor="letter-spacing" className="text-sm font-medium text-slate-700 mb-3 block">
            Letter Spacing: {profile.visualNeeds.letterSpacing}px
          </label>
          <Slider
            id="letter-spacing"
            data-testid="letter-spacing-slider"
            value={[profile.visualNeeds.letterSpacing]}
            onValueChange={(val) => updateVisualNeeds('letterSpacing', val[0])}
            min={0}
            max={5}
            step={0.5}
            className="w-full"
            aria-label="Adjust letter spacing"
          />
        </div>
      </div>
    </div>
  );
};