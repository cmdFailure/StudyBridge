export const getStoredProfile = () => {
  const stored = localStorage.getItem('studybridge_profile');
  return stored ? JSON.parse(stored) : getDefaultProfile();
};

export const saveProfile = (profile) => {
  localStorage.setItem('studybridge_profile', JSON.stringify(profile));
};

export const getDefaultProfile = () => ({
  disabilities: [],
  readingLevel: 8,
  visualNeeds: {
    fontSize: 16,
    fontFamily: 'Inter',
    contrast: 'normal',
    lineSpacing: 1.6,
    letterSpacing: 0
  },
  cognitiveNeeds: {
    simplification: true,
    chunkContent: true
  },
  preferences: {
    ttsSpeed: 1.0,
    ttsVoice: null
  }
});

export const dyslexicFonts = [
  { name: 'OpenDyslexic', value: 'OpenDyslexic, monospace' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Comic Sans', value: 'Comic Sans MS, cursive' },
  { name: 'Verdana', value: 'Verdana, sans-serif' }
];

export const contrastModes = [
  { name: 'Normal', value: 'normal' },
  { name: 'High Contrast', value: 'high' },
  { name: 'Dark Mode', value: 'dark' }
];