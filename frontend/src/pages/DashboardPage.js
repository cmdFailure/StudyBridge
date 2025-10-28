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
import { AdvancedAccessibilityFeatures } from '../components/AdvancedAccessibilityFeatures';
import { AITutorChat } from '../components/AITutorChat';
import { apiService } from '../services/apiService';
import { getStoredProfile, saveProfile as saveProfileToStorage } from '../utils/accessibility';
import { toast } from 'sonner';
import { FileText, ArrowLeft, Bot } from 'lucide-react';
import { Button } from '../components/ui/button';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getStoredProfile());
  const [pdfData, setPdfData] = useState(null);
  const [simplifiedText, setSimplifiedText] = useState('');
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [simplifiedScore, setSimplifiedScore] = useState(0);
  const [showAITutor, setShowAITutor] = useState(false);
  
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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse-custom pointer-events-none"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse-custom pointer-events-none" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {/* Interactive Accessibility Overlays */}
      <FocusMode 
        content={displayText} 
        isActive={accessibilityFeatures.focusMode} 
        onClose={() => handleFeatureToggle('focusMode', false)}
      />
      <SignLanguageInterpreter 
        text={displayText} 
        isActive={accessibilityFeatures.signLanguage}
      />
      <ReadingGuide isActive={accessibilityFeatures.readingGuide} />
      <KeyboardNavigationGuide isActive={accessibilityFeatures.keyboardNav} />
      <ColorBlindFilter mode={accessibilityFeatures.colorBlindMode} />
      <LiveCaptions 
        text={displayText} 
        isActive={accessibilityFeatures.liveCaptions}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-in-up">
          <div className="flex items-center gap-4">
            <Button
              data-testid="back-to-upload-btn"
              onClick={() => navigate('/upload')}
              variant="outline"
              className="border-2 border-gray-700 hover:border-gray-600 bg-gray-900/50 hover:bg-gray-800/50 text-white backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">{pdfData.fileName}</h2>
              </div>
              <p className="text-sm text-gray-400 ml-12">
                {pdfData.pages} pages • {pdfData.wordCount} words
              </p>
            </div>
          </div>
        </div>

        {/* Accessibility Checker */}
        <div className="mb-8 animate-slide-in-up" style={{animationDelay: '0.1s'}}>
          <AccessibilityChecker
            originalScore={pdfData.readingScore}
            simplifiedScore={simplifiedScore}
            hasContent={true}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">{/* Analytics and Emotion Detection */}
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
              <AccessibilityToolbar onFeatureToggle={handleFeatureToggle} />
              <AdvancedAccessibilityFeatures content={displayText} pdfData={pdfData} />
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