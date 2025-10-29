import React, { useState } from 'react';
import { Upload, Youtube, Loader2, Video } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

export const VideoUploader = ({ onVideoProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'youtube'
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a valid video file');
      return;
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('Video file too large. Maximum size is 100MB');
      return;
    }

    setIsProcessing(true);
    toast.info('Uploading video...');

    try {
      // Upload video
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch(`${BACKEND_URL}/api/upload-video`, {
        method: 'POST',
        body: formData,
      });

      const uploadClone = uploadResponse.clone();

      if (!uploadResponse.ok) {
        let errorMessage = 'Video upload failed';
        try {
          const errorData = await uploadClone.json();
          errorMessage = errorData.detail || errorData.error || errorMessage;
        } catch (e) {
          // If can't parse error, use default message
        }
        throw new Error(errorMessage);
      }

      const uploadData = await uploadResponse.json();
      toast.success('Video uploaded! Transcribing...');

      // Transcribe video
      const transcribeResponse = await fetch(`${BACKEND_URL}/api/transcribe-video?video_id=${uploadData.video_id}`, {
        method: 'POST',
      });

      const transcribeClone = transcribeResponse.clone();

      if (!transcribeResponse.ok) {
        let errorMessage = 'Video transcription failed';
        try {
          const errorData = await transcribeClone.json();
          errorMessage = errorData.detail || errorData.error || errorMessage;
        } catch (e) {
          // If can't parse error, use default message
        }
        throw new Error(errorMessage);
      }

      const transcriptData = await transcribeResponse.json();
      
      // Get video URL
      const videoUrl = `${BACKEND_URL}/api/video-file/${uploadData.video_id}`;

      toast.success('Video processed successfully!');
      
      onVideoProcessed({
        videoUrl,
        videoId: uploadData.video_id,
        filename: uploadData.filename,
        transcript: transcriptData.transcript,
        segments: transcriptData.segments,
      });

    } catch (error) {
      console.error('Video processing error:', error);
      toast.error(error.message || 'Failed to process video. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleYoutubeSubmit = async () => {
    if (!youtubeUrl.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    setIsProcessing(true);
    toast.info('Processing YouTube video...');

    try {
      // Process YouTube URL
      const youtubeResponse = await fetch(`${BACKEND_URL}/api/process-youtube`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtube_url: youtubeUrl }),
      });

      // Clone response to avoid "body already used" error in monitored environments
      const responseClone = youtubeResponse.clone();
      
      if (!youtubeResponse.ok) {
        let errorMessage = 'YouTube processing failed';
        try {
          const errorData = await responseClone.json();
          errorMessage = errorData.detail || errorData.error || errorMessage;
        } catch (e) {
          // If can't parse error, use default message
        }
        throw new Error(errorMessage);
      }

      const youtubeData = await youtubeResponse.json();
      toast.success('YouTube video downloaded! Transcribing...');

      // Transcribe video
      const transcribeResponse = await fetch(`${BACKEND_URL}/api/transcribe-video?video_id=${youtubeData.video_id}`, {
        method: 'POST',
      });

      const transcribeClone = transcribeResponse.clone();

      if (!transcribeResponse.ok) {
        let errorMessage = 'Video transcription failed';
        try {
          const errorData = await transcribeClone.json();
          errorMessage = errorData.detail || errorData.error || errorMessage;
        } catch (e) {
          // If can't parse error, use default message
        }
        throw new Error(errorMessage);
      }

      const transcriptData = await transcribeResponse.json();
      
      // Get video URL
      const videoUrl = `${BACKEND_URL}/api/video-file/${youtubeData.video_id}`;

      toast.success('YouTube video processed successfully!');
      
      onVideoProcessed({
        videoUrl,
        videoId: youtubeData.video_id,
        filename: youtubeData.filename,
        transcript: transcriptData.transcript,
        segments: transcriptData.segments,
      });

      setYoutubeUrl('');

    } catch (error) {
      console.error('YouTube processing error:', error);
      toast.error(error.message || 'Failed to process YouTube video. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={() => setUploadMode('file')}
          variant={uploadMode === 'file' ? 'default' : 'outline'}
          className={`btn-interactive transition-all ${
            uploadMode === 'file' 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/50' 
              : 'border-slate-600 hover:border-blue-500 hover:bg-slate-800'
          }`}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
        <Button
          onClick={() => setUploadMode('youtube')}
          variant={uploadMode === 'youtube' ? 'default' : 'outline'}
          className={`btn-interactive transition-all ${
            uploadMode === 'youtube' 
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/50' 
              : 'border-slate-600 hover:border-red-500 hover:bg-slate-800'
          }`}
        >
          <Youtube className="w-4 h-4 mr-2" />
          YouTube URL
        </Button>
      </div>

      {/* File Upload */}
      {uploadMode === 'file' && (
        <div className="border-2 border-dashed border-slate-600 rounded-2xl p-12 text-center hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-300 hover-scale">
          <input
            type="file"
            id="video-upload"
            accept="video/*"
            onChange={handleFileUpload}
            disabled={isProcessing}
            className="hidden"
          />
          <label
            htmlFor="video-upload"
            className="cursor-pointer flex flex-col items-center gap-4"
          >
            {isProcessing ? (
              <div className="relative">
                <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />
                <div className="absolute inset-0 w-16 h-16 border-4 border-blue-400/30 rounded-full animate-pulse-custom"></div>
              </div>
            ) : (
              <div className="relative">
                <Video className="w-16 h-16 text-slate-400 transition-all group-hover:text-blue-400" />
                <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            )}
            <div className="space-y-2">
              <p className="text-white text-lg font-semibold mb-1">
                {isProcessing ? 'Processing video...' : 'Drop your video here or click to browse'}
              </p>
              <p className="text-slate-400 text-sm flex items-center gap-2 justify-center">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse-custom"></span>
                Supports MP4, WebM, MOV (Max 100MB)
              </p>
            </div>
          </label>
        </div>
      )}

      {/* YouTube URL */}
      {uploadMode === 'youtube' && (
        <div className="space-y-4 animate-slide-in-up">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Paste YouTube URL here..."
                disabled={isProcessing}
                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all"
              />
              {!isProcessing && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Youtube className="w-5 h-5 text-red-400 animate-pulse-custom" />
                </div>
              )}
            </div>
            <Button
              onClick={handleYoutubeSubmit}
              disabled={isProcessing}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-6 btn-interactive shadow-lg shadow-red-500/50"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Youtube className="w-5 h-5 mr-2" />
                  Process
                </>
              )}
            </Button>
          </div>
          <p className="text-slate-400 text-sm text-center">
            Enter a YouTube video URL to automatically transcribe and analyze
          </p>
        </div>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <div className="glass rounded-xl p-6 text-center border border-blue-500/30 animate-slide-in-up">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-500/30 rounded-full"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>
          <p className="text-blue-400 text-sm font-medium mb-2">
            Processing your video with AI...
          </p>
          <p className="text-slate-400 text-xs">
            This may take a few minutes. Please wait.
          </p>
          <div className="mt-4 w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-gradient"></div>
          </div>
        </div>
      )}
    </div>
  );
};
