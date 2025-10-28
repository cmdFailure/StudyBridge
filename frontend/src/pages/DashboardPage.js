import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentSimplifier } from '../components/ContentSimplifier';
import { TTSPlayer } from '../components/TTSPlayer';
import { VisualAccessibilityPanel } from '../components/VisualAccessibilityPanel';
import { StudyToolsPanel } from '../components/StudyToolsPanel';
import { AccessibilityChecker } from '../components/AccessibilityChecker';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { EmotionDetector } from '../components/EmotionDetector';
import { AchievementSystem } from '../components/AchievementSystem';
import { AccessibilityToolbar } from '../components/AccessibilityToolbar';
import { FocusMode } from '../components/FocusMode';
import { SignLanguageInterpreter } from '../components/SignLanguageInterpreter';
import { ReadingGuide, KeyboardNavigationGuide, ColorBlindFilter, LiveCaptions } from '../components/InteractiveAccessibility';
import { apiService } from '../services/apiService';
import { getStoredProfile, saveProfile as saveProfileToStorage } from '../utils/accessibility';
import { toast } from 'sonner';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getStoredProfile());
  const [pdfData, setPdfData] = useState(null);
  const [simplifiedText, setSimplifiedText] = useState('');
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [simplifiedScore, setSimplifiedScore] = useState(0);
  
  // Interactive accessibility features
  const [accessibilityFeatures, setAccessibilityFeatures] = useState({
    focusMode: false,
    signLanguage: false,
    readingGuide: false,
    keyboardNav: false,
    colorBlindMode: 'none',
    liveCaptions: false
  });

  useEffect(() => {
    // Load PDF data from localStorage
    const stored = localStorage.getItem('currentPDF');
    if (stored) {
      setPdfData(JSON.parse(stored));
    } else {
      toast.error('No PDF found. Please upload a PDF first.');
      navigate('/upload');
    }
  }, [navigate]);

  const handleSimplify = async () => {
    if (!pdfData?.text) return;
    
    setIsSimplifying(true);
    try {
      const disabilityType = profile.disabilities[0] || 'general';
      const result = await apiService.simplifyContent(
        pdfData.text,
        profile.readingLevel,
        disabilityType
      );
      setSimplifiedText(result.simplified_text);
      setSimplifiedScore(result.reading_score || 0);
      toast.success('Content simplified successfully!');
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || error.response?.data?.detail || 'Failed to simplify content';
      toast.error(errorMsg);
    } finally {
      setIsSimplifying(false);
    }
  };

  const handleSaveProfile = (newProfile) => {
    setProfile(newProfile);
    saveProfileToStorage(newProfile);
    toast.success('Profile saved!');
  };

  const handleFeatureToggle = (feature, isEnabled) => {
    setAccessibilityFeatures(prev => ({
      ...prev,
      [feature]: isEnabled
    }));
  };

  const displayText = simplifiedText || pdfData?.text || '';
  const ttsText = simplifiedText || pdfData?.text || '';

  if (!pdfData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              data-testid="back-to-upload-btn"
              onClick={() => navigate('/upload')}
              variant="outline"
              className="border-slate-600 bg-slate-800/50 hover:bg-slate-700 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold text-white">{pdfData.fileName}</h2>
              </div>
              <p className="text-sm text-slate-400">
                {pdfData.pages} pages • {pdfData.wordCount} words
              </p>
            </div>
          </div>
        </div>

        {/* Accessibility Checker */}
        <div className="mb-8">
          <AccessibilityChecker
            originalScore={pdfData.readingScore}
            simplifiedScore={simplifiedScore}
            hasContent={true}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Analytics and Emotion Detection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnalyticsDashboard pdfData={pdfData} simplifiedText={simplifiedText} />
              <EmotionDetector />
            </div>

            <ContentSimplifier
              originalText={pdfData.text}
              simplifiedText={simplifiedText}
              onSimplify={handleSimplify}
              isSimplifying={isSimplifying}
              profile={profile}
            />

            {displayText && (
              <>
                <TTSPlayer text={ttsText} profile={profile} useSimplified={!!simplifiedText} />
                <StudyToolsPanel content={displayText} />
              </>
            )}
          </div>

          {/* Right Column - Accessibility Panel & Achievements */}
          <div className="lg:col-span-1 space-y-8">
            <div className="sticky top-8 space-y-8">
              <VisualAccessibilityPanel
                profile={profile}
                onUpdateProfile={handleSaveProfile}
              />
              <AchievementSystem />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};