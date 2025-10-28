import React, { useState, useEffect } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { PDFUploader } from '@/components/PDFUploader';
import { ContentSimplifier } from '@/components/ContentSimplifier';
import { TTSPlayer } from '@/components/TTSPlayer';
import { VisualAccessibilityPanel } from '@/components/VisualAccessibilityPanel';
import { StudyToolsPanel } from '@/components/StudyToolsPanel';
import { StudentProfile } from '@/components/StudentProfile';
import { AccessibilityChecker } from '@/components/AccessibilityChecker';
import { apiService } from '@/services/apiService';
import { getStoredProfile, saveProfile as saveProfileToStorage } from '@/utils/accessibility';
import { toast } from 'sonner';
import { BookOpen, Settings, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
  const [profile, setProfile] = useState(getStoredProfile());
  const [showProfile, setShowProfile] = useState(false);
  const [pdfText, setPdfText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [originalScore, setOriginalScore] = useState(0);
  const [simplifiedScore, setSimplifiedScore] = useState(0);

  useEffect(() => {
    if (!profile.disabilities.length) {
      setTimeout(() => setShowProfile(true), 1000);
    }
  }, []);

  const handleFileProcess = async (file) => {
    setIsProcessing(true);
    setPdfText('');
    setSimplifiedText('');
    
    try {
      const result = await apiService.extractPDF(file);
      setPdfText(result.text);
      setOriginalScore(result.reading_score || 0);
      toast.success(`PDF extracted: ${result.pages} pages, ${result.word_count} words`);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || error.response?.data?.detail || 'Failed to process PDF';
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimplify = async () => {
    if (!pdfText) return;
    
    setIsSimplifying(true);
    try {
      const disabilityType = profile.disabilities[0] || 'general';
      const result = await apiService.simplifyContent(
        pdfText,
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

  const displayText = simplifiedText || pdfText;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-2 rounded-xl">
                <BookOpen className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800"
                    style={{ fontFamily: 'Manrope, sans-serif' }}>
                  StudyBridge
                </h1>
                <p className="text-sm text-slate-600">AI-Powered Accessible Learning</p>
              </div>
            </div>
            <Button
              data-testid="open-profile-btn"
              onClick={() => setShowProfile(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        {!pdfText && (
          <div className="text-center mb-12" data-testid="hero-section">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-sky-100 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-slate-700">Free • AI-Powered • Accessible</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4"
                style={{ fontFamily: 'Manrope, sans-serif' }}>
              Make PDFs Accessible for Everyone
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Transform inaccessible PDF documents into multiple accessible formats using AI.
              Built for students with disabilities.
            </p>
          </div>
        )}

        <div className="space-y-8">
          {/* PDF Uploader */}
          <PDFUploader 
            onFileProcess={handleFileProcess}
            isProcessing={isProcessing}
          />

          {/* Accessibility Checker */}
          {pdfText && (
            <AccessibilityChecker
              originalScore={originalScore}
              simplifiedScore={simplifiedScore}
              hasContent={!!pdfText}
            />
          )}

          {/* Content Grid */}
          {pdfText && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <ContentSimplifier
                  originalText={pdfText}
                  simplifiedText={simplifiedText}
                  onSimplify={handleSimplify}
                  isSimplifying={isSimplifying}
                  profile={profile}
                />

                {displayText && (
                  <>
                    <TTSPlayer text={displayText} profile={profile} />
                    <StudyToolsPanel content={displayText} />
                  </>
                )}
              </div>

              {/* Right Column - Accessibility Panel */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <VisualAccessibilityPanel
                    profile={profile}
                    onUpdateProfile={handleSaveProfile}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600">
            <p className="text-sm">
              StudyBridge - Making education accessible for all students.
              <br />
              Powered by Google Gemini AI.
            </p>
          </div>
        </div>
      </footer>

      {/* Student Profile Modal */}
      <StudentProfile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      <Toaster position="top-right" richColors />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;