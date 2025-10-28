import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Slider } from '../components/ui/slider';
import { User, Brain, Eye, Ear, Hand, ArrowLeft, Save } from 'lucide-react';
import { getStoredProfile, saveProfile as saveProfileToStorage } from '../utils/accessibility';
import { toast } from 'sonner';

const disabilityOptions = [
  { id: 'dyslexia', label: 'Dyslexia', icon: Brain, color: 'text-purple-400' },
  { id: 'adhd', label: 'ADHD', icon: Brain, color: 'text-blue-400' },
  { id: 'autism', label: 'Autism Spectrum', icon: Brain, color: 'text-teal-400' },
  { id: 'visual', label: 'Visual Impairment', icon: Eye, color: 'text-amber-400' },
  { id: 'hearing', label: 'Hearing Impairment', icon: Ear, color: 'text-pink-400' },
  { id: 'motor', label: 'Motor Impairment', icon: Hand, color: 'text-indigo-400' },
];

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getStoredProfile());

  const toggleDisability = (id) => {
    setProfile(prev => ({
      ...prev,
      disabilities: prev.disabilities.includes(id)
        ? prev.disabilities.filter(d => d !== id)
        : [...prev.disabilities, id]
    }));
  };

  const handleSave = () => {
    saveProfileToStorage(profile);
    toast.success('Profile saved successfully!');
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Student Profile
            </h1>
            <p className="text-xl text-slate-300">
              Customize your accessibility preferences for a better learning experience
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Accessibility Needs */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <User className="w-6 h-6 text-blue-400" />
              Accessibility Needs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {disabilityOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = profile.disabilities.includes(option.id);
                
                return (
                  <button
                    key={option.id}
                    data-testid={`disability-option-${option.id}`}
                    onClick={() => toggleDisability(option.id)}
                    className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      aria-label={option.label}
                    />
                    <Icon className={`w-6 h-6 ${option.color}`} />
                    <span className="font-medium text-white text-lg">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reading Level */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              Reading Level: Grade {profile.readingLevel}
            </h3>
            <Slider
              data-testid="reading-level-slider"
              value={[profile.readingLevel]}
              onValueChange={(val) => setProfile(prev => ({ ...prev, readingLevel: val[0] }))}
              min={3}
              max={12}
              step={1}
              className="w-full"
              aria-label="Select reading level"
            />
            <div className="flex justify-between text-sm text-slate-400 mt-4">
              <span>Grade 3 (Simple)</span>
              <span>Grade 12+ (Advanced)</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
            <p className="text-slate-200">
              <strong className="text-blue-400">Note:</strong> These settings help personalize content simplification and accessibility features to match your needs. You can update them anytime.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              data-testid="cancel-profile-btn"
              variant="outline"
              onClick={() => navigate(-1)}
              className="border-slate-600 bg-slate-800/50 hover:bg-slate-700 text-white px-8 py-6 text-lg"
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              Cancel
            </Button>
            <Button
              data-testid="save-profile-btn"
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg"
            >
              <Save className="mr-2 w-5 h-5" />
              Save Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};