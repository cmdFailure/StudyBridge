import React, { useState } from 'react';
import { VideoUploader } from '../components/VideoUploader';
import { VideoPlayer } from '../components/VideoPlayer';
import { ContentSimplifier } from '../components/ContentSimplifier';
import { TTSPlayer } from '../components/TTSPlayer';
import { AdvancedAccessibilityFeatures } from '../components/AdvancedAccessibilityFeatures';
import { Video, FileText, Volume2, Languages } from 'lucide-react';

export const VideoLearningPage = () => {
  const [videoData, setVideoData] = useState(null);
  const [simplifiedTranscript, setSimplifiedTranscript] = useState('');

  const handleVideoProcessed = (data) => {
    setVideoData(data);
  };

  const handleSimplified = (simplified) => {
    setSimplifiedTranscript(simplified);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12 animate-slide-in-up">
          <div className="inline-flex items-center gap-2 glass border border-purple-500/30 rounded-full px-4 py-2 mb-4 hover-scale">
            <Video className="w-4 h-4 text-purple-400 animate-pulse-custom" />
            <span className="text-purple-300 text-sm font-medium">Video Learning</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Transform Videos into
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
              Accessible Learning
            </span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Upload any video or paste a YouTube URL. Get AI-powered transcripts, summaries, and all accessibility features.
          </p>
        </div>

        {!videoData ? (
          // Upload Section
          <div className="max-w-3xl mx-auto animate-slide-in-up" style={{animationDelay: '0.2s'}}>
            <VideoUploader onVideoProcessed={handleVideoProcessed} />
            
            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="glass border border-slate-700 rounded-xl p-6 text-center hover-scale stagger-item">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 animate-pulse-custom">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">AI Transcription</h3>
                <p className="text-slate-400 text-sm">Automatic transcription with timestamps</p>
              </div>
              
              <div className="glass border border-slate-700 rounded-xl p-6 text-center hover-scale stagger-item">
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 animate-pulse-custom">
                  <Volume2 className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Live Captions</h3>
                <p className="text-slate-400 text-sm">Real-time captions on video</p>
              </div>
              
              <div className="glass border border-slate-700 rounded-xl p-6 text-center hover-scale stagger-item">
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 animate-pulse-custom">
                  <Languages className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">All Features</h3>
                <p className="text-slate-400 text-sm">Simplification, TTS, Braille, Translation</p>
              </div>
            </div>
          </div>
        ) : (
          // Video Processing & Accessibility
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-in-up">
            {/* Left Column - Video Player */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass border border-slate-700 rounded-2xl p-6 hover-scale">
                <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <Video className="w-6 h-6 text-blue-400" />
                  <span className="truncate">{videoData.filename}</span>
                </h2>
                <VideoPlayer
                  videoUrl={videoData.videoUrl}
                  transcript={videoData.transcript}
                  segments={videoData.segments}
                />
              </div>
              
              {/* Content Simplifier */}
              <div className="glass border border-slate-700 rounded-2xl p-6 hover-scale">
                <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Simplify Transcript
                </h2>
                <ContentSimplifier
                  originalText={videoData.transcript}
                  onSimplified={handleSimplified}
                />
              </div>
            </div>
            
            {/* Right Column - Accessibility Features */}
            <div className="space-y-6">
              {/* TTS Player */}
              <div className="glass border border-slate-700 rounded-2xl p-6 hover-scale">
                <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-purple-400" />
                  Text-to-Speech
                </h2>
                <TTSPlayer text={simplifiedTranscript || videoData.transcript} />
              </div>
              
              {/* Advanced Accessibility Features */}
              <div className="glass border border-slate-700 rounded-2xl p-6 hover-scale">
                <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <Languages className="w-5 h-5 text-green-400" />
                  Advanced Features
                </h2>
                <AdvancedAccessibilityFeatures
                  content={simplifiedTranscript || videoData.transcript}
                  pdfData={null}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
