import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Slider } from './ui/slider';

export const TTSPlayer = ({ text, profile, useSimplified }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(profile?.preferences?.ttsSpeed || 1.0);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const utteranceRef = useRef(null);

  // Clean text for TTS - remove markdown formatting
  const cleanTextForTTS = (rawText) => {
    if (!rawText) return '';
    
    return rawText
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\*/g, '')   // Remove italic markdown
      .replace(/#{1,6}\s/g, '') // Remove heading markers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to plain text
      .replace(/`{1,3}/g, '') // Remove code markers
      .replace(/^\s*[-•]\s/gm, '') // Remove bullet points
      .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
      .trim();
  };

  const cleanedText = cleanTextForTTS(text);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handlePlay = () => {
    if (!cleanedText) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        const utterance = new SpeechSynthesisUtterance(cleanedText);
        utterance.rate = speed;
        if (selectedVoice) utterance.voice = selectedVoice;
        
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleSpeedChange = (value) => {
    setSpeed(value[0]);
    if (isPlaying) {
      handleStop();
    }
  };

  if (!text) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6" data-testid="tts-player">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Volume2 className="w-6 h-6 text-sky-500" aria-hidden="true" />
          <h3 className="text-xl font-bold text-slate-800">
            Text-to-Speech
            {useSimplified && (
              <span className="ml-2 text-sm font-normal text-emerald-600">(Simplified Version)</span>
            )}
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Button
          data-testid="tts-skip-back-btn"
          onClick={handleStop}
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-slate-300"
          aria-label="Skip to start"
        >
          <SkipBack className="w-5 h-5" />
        </Button>

        <Button
          data-testid="tts-play-pause-btn"
          onClick={handlePlay}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-1" />
          )}
        </Button>

        <Button
          data-testid="tts-skip-forward-btn"
          onClick={handleStop}
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-slate-300"
          aria-label="Stop"
        >
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="tts-speed" className="text-sm font-medium text-slate-700 mb-2 block">
            Speed: {speed.toFixed(1)}x
          </label>
          <Slider
            id="tts-speed"
            data-testid="tts-speed-slider"
            value={[speed]}
            onValueChange={handleSpeedChange}
            min={0.5}
            max={2.0}
            step={0.1}
            className="w-full"
            aria-label="Adjust playback speed"
          />
        </div>

        {voices.length > 0 && (
          <div>
            <label htmlFor="tts-voice" className="text-sm font-medium text-slate-700 mb-2 block">
              Voice
            </label>
            <select
              id="tts-voice"
              data-testid="tts-voice-select"
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const voice = voices.find(v => v.name === e.target.value);
                setSelectedVoice(voice);
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              aria-label="Select voice"
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};