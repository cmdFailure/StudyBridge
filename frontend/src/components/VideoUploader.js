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

      if (!uploadResponse.ok) {
        throw new Error('Video upload failed');
      }

      const uploadData = await uploadResponse.json();
      toast.success('Video uploaded! Transcribing...');

      // Transcribe video
      const transcribeResponse = await fetch(`${BACKEND_URL}/api/transcribe-video?video_id=${uploadData.video_id}`, {
        method: 'POST',
      });

      if (!transcribeResponse.ok) {
        throw new Error('Video transcription failed');
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
      toast.error('Failed to process video. Please try again.');
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

      if (!youtubeResponse.ok) {
        throw new Error('YouTube processing failed');
      }

      const youtubeData = await youtubeResponse.json();
      toast.success('YouTube video downloaded! Transcribing...');

      // Transcribe video
      const transcribeResponse = await fetch(`${BACKEND_URL}/api/transcribe-video?video_id=${youtubeData.video_id}`, {
        method: 'POST',
      });

      if (!transcribeResponse.ok) {
        throw new Error('Video transcription failed');
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
      toast.error('Failed to process YouTube video. Please try again.');
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
          className={uploadMode === 'file' ? 'bg-blue-500' : 'border-slate-600'}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
        <Button
          onClick={() => setUploadMode('youtube')}
          variant={uploadMode === 'youtube' ? 'default' : 'outline'}
          className={uploadMode === 'youtube' ? 'bg-red-500' : 'border-slate-600'}
        >
          <Youtube className="w-4 h-4 mr-2" />
          YouTube URL
        </Button>
      </div>

      {/* File Upload */}
      {uploadMode === 'file' && (
        <div className="border-2 border-dashed border-slate-600 rounded-2xl p-12 text-center hover:border-blue-500 transition">
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
              <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />
            ) : (
              <Video className="w-16 h-16 text-slate-400" />
            )}
            <div>
              <p className="text-white text-lg font-semibold mb-1">
                {isProcessing ? 'Processing video...' : 'Drop your video here or click to browse'}
              </p>
              <p className="text-slate-400 text-sm">
                Supports MP4, WebM, MOV (Max 100MB)
              </p>
            </div>
          </label>
        </div>
      )}

      {/* YouTube URL */}
      {uploadMode === 'youtube' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              disabled={isProcessing}
              className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <Button
              onClick={handleYoutubeSubmit}
              disabled={isProcessing}
              className="bg-red-500 hover:bg-red-600 px-6"
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
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
          <p className="text-blue-400 text-sm">
            Processing your video with AI... This may take a few minutes.
          </p>
        </div>
      )}
    </div>
  );
};
