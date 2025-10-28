import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { User, Brain, Eye, Ear, Hand } from 'lucide-react';

const disabilityOptions = [
  { id: 'dyslexia', label: 'Dyslexia', icon: Brain, color: 'text-purple-500' },
  { id: 'adhd', label: 'ADHD', icon: Brain, color: 'text-blue-500' },
  { id: 'autism', label: 'Autism Spectrum', icon: Brain, color: 'text-teal-500' },
  { id: 'visual', label: 'Visual Impairment', icon: Eye, color: 'text-amber-500' },
  { id: 'hearing', label: 'Hearing Impairment', icon: Ear, color: 'text-pink-500' },
  { id: 'motor', label: 'Motor Impairment', icon: Hand, color: 'text-indigo-500' },
];

export const StudentProfile = ({ isOpen, onClose, profile, onSave }) => {
  const [localProfile, setLocalProfile] = React.useState(profile);

  const toggleDisability = (id) => {
    setLocalProfile(prev => ({
      ...prev,
      disabilities: prev.disabilities.includes(id)
        ? prev.disabilities.filter(d => d !== id)
        : [...prev.disabilities, id]
    }));
  };

  const handleSave = () => {
    onSave(localProfile);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="student-profile-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <User className="w-7 h-7 text-sky-500" />
            Student Profile
          </DialogTitle>
          <DialogDescription>
            Customize your accessibility preferences for a better learning experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Accessibility Needs</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {disabilityOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = localProfile.disabilities.includes(option.id);
                
                return (
                  <button
                    key={option.id}
                    data-testid={`disability-option-${option.id}`}
                    onClick={() => toggleDisability(option.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      aria-label={option.label}
                    />
                    <Icon className={`w-5 h-5 ${option.color}`} />
                    <span className="font-medium text-slate-700">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="reading-level" className="font-semibold text-slate-800 mb-3 block">
              Reading Level: Grade {localProfile.readingLevel}
            </label>
            <Slider
              id="reading-level"
              data-testid="reading-level-slider"
              value={[localProfile.readingLevel]}
              onValueChange={(val) => setLocalProfile(prev => ({ ...prev, readingLevel: val[0] }))}
              min={3}
              max={12}
              step={1}
              className="w-full"
              aria-label="Select reading level"
            />
            <div className="flex justify-between text-sm text-slate-500 mt-2">
              <span>Grade 3</span>
              <span>Grade 12+</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-xl p-4">
            <p className="text-sm text-slate-700">
              <strong>Note:</strong> These settings help personalize content simplification and accessibility features to match your needs.
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button
            data-testid="cancel-profile-btn"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            data-testid="save-profile-btn"
            onClick={handleSave}
            className="bg-sky-500 hover:bg-sky-600"
          >
            Save Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};