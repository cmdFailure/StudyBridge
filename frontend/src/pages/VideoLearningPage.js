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
          <div className="max-w-3xl mx-auto">
            <VideoUploader onVideoProcessed={handleVideoProcessed} />
            
            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">AI Transcription</h3>
                <p className="text-slate-400 text-sm">Automatic transcription with timestamps</p>
              </div>
              
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Volume2 className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Live Captions</h3>
                <p className="text-slate-400 text-sm">Real-time captions on video</p>
              </div>
              
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                <div className="bg-green-500/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Languages className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">All Features</h3>
                <p className="text-slate-400 text-sm">Simplification, TTS, Braille, Translation</p>
              </div>
            </div>
          </div>
        ) : (
          // Video Processing & Accessibility
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Video Player */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <Video className="w-6 h-6 text-blue-400" />
                  {videoData.filename}
                </h2>
                <VideoPlayer
                  videoUrl={videoData.videoUrl}
                  transcript={videoData.transcript}
                  segments={videoData.segments}
                />
              </div>
              
              {/* Content Simplifier */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h2 className="text-white text-xl font-bold mb-4">Simplify Transcript</h2>
                <ContentSimplifier
                  originalText={videoData.transcript}
                  onSimplified={handleSimplified}
                />
              </div>
            </div>
            
            {/* Right Column - Accessibility Features */}
            <div className="space-y-6">
              {/* TTS Player */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-purple-400" />
                  Text-to-Speech
                </h2>
                <TTSPlayer text={simplifiedTranscript || videoData.transcript} />
              </div>
              
              {/* Advanced Accessibility Features */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h2 className="text-white text-xl font-bold mb-4">Advanced Features</h2>
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
