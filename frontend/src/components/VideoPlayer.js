import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Clock } from 'lucide-react';
import { Button } from './ui/button';

export const VideoPlayer = ({ videoUrl, transcript, segments = [] }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showCaptions, setShowCaptions] = useState(true);
  const [currentCaption, setCurrentCaption] = useState('');

  // Play/Pause toggle
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Time update handler
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setCurrentTime(current);
      
      // Update captions based on current time
      if (segments.length > 0 && showCaptions) {
        const currentSegment = segments.find((seg, idx) => {
          const [mins, secs] = seg.timestamp.split(':').map(Number);
          const segTime = mins * 60 + secs;
          
          const nextSeg = segments[idx + 1];
          let nextTime = duration;
          if (nextSeg) {
            const [nextMins, nextSecs] = nextSeg.timestamp.split(':').map(Number);
            nextTime = nextMins * 60 + nextSecs;
          }
          
          return current >= segTime && current < nextTime;
        });
        
        setCurrentCaption(currentSegment?.text || '');
      }
    }
  };

  // Load metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Volume control
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  // Mute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Playback speed
  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // Seek to timestamp
  const seekToTimestamp = (timestamp) => {
    const [mins, secs] = timestamp.split(':').map(Number);
    const time = mins * 60 + secs;
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // Format time
  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.parentElement.requestFullscreen();
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div className="relative bg-black rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full aspect-video"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
        />
        
        {/* Live Captions Overlay */}
        {showCaptions && currentCaption && (
          <div className="absolute bottom-16 left-0 right-0 px-8 py-3 bg-black/80 text-white text-center text-lg">
            <p className="leading-relaxed">{currentCaption}</p>
          </div>
        )}
        
        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => {
              const time = parseFloat(e.target.value);
              if (videoRef.current) {
                videoRef.current.currentTime = time;
              }
            }}
            className="w-full mb-3 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #475569 ${(currentTime / duration) * 100}%, #475569 100%)`
            }}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <Button
                onClick={togglePlay}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              
              {/* Volume */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              {/* Time Display */}
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Speed Control */}
              <div className="relative group">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20 text-sm"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  {playbackRate}x
                </Button>
                <div className="absolute bottom-full mb-2 right-0 bg-slate-900 rounded-lg p-2 hidden group-hover:block">
                  {[0.5, 1, 1.5, 2].map(rate => (
                    <button
                      key={rate}
                      onClick={() => changePlaybackRate(rate)}
                      className={`block w-full text-left px-3 py-1 text-sm rounded ${
                        playbackRate === rate ? 'bg-blue-500 text-white' : 'text-white hover:bg-slate-700'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Captions Toggle */}
              <Button
                onClick={() => setShowCaptions(!showCaptions)}
                variant="ghost"
                className={`text-sm ${showCaptions ? 'text-blue-400' : 'text-white'} hover:bg-white/20`}
              >
                CC
              </Button>
              
              {/* Fullscreen */}
              <Button
                onClick={toggleFullscreen}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Transcript with Timestamps */}
      {segments.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-6 max-h-96 overflow-y-auto">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Transcript
          </h3>
          <div className="space-y-3">
            {segments.map((segment, idx) => (
              <div
                key={idx}
                className="flex gap-3 items-start hover:bg-slate-700/30 p-2 rounded-lg cursor-pointer transition"
                onClick={() => seekToTimestamp(segment.timestamp)}
              >
                <span className="text-blue-400 font-mono text-sm shrink-0 mt-0.5">
                  [{segment.timestamp}]
                </span>
                <p className="text-slate-300 text-sm leading-relaxed">{segment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
