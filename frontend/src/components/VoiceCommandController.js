import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Command } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const VoiceCommandController = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = async (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);

        if (event.results[current].isFinal) {
          // Process command
          try {
            const response = await fetch(`${BACKEND_URL}/api/voice-command`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ command: transcriptText })
            });
            
            const data = await response.json();
            
            if (data.action === 'navigate') {
              navigate(data.route);
              toast.success(`Navigating to ${data.route}`);
            } else if (data.action === 'start_tts') {
              toast.info('Starting text-to-speech');
              document.dispatchEvent(new CustomEvent('voiceCommand', { detail: { action: 'tts' } }));
            } else if (data.action === 'translate') {
              toast.info('Opening translation');
              document.dispatchEvent(new CustomEvent('voiceCommand', { detail: { action: 'translate' } }));
            } else if (data.action === 'simplify') {
              toast.info('Simplifying content');
              document.dispatchEvent(new CustomEvent('voiceCommand', { detail: { action: 'simplify' } }));
            }
          } catch (error) {
            console.error('Voice command error:', error);
          }
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [navigate, BACKEND_URL]);

  const toggleListening = () => {
    if (!recognition) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      toast.info('Voice commands disabled');
    } else {
      recognition.start();
      setIsListening(true);
      toast.success('Voice commands enabled - Try saying "Go to upload" or "Read document"');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end gap-3">
        {isListening && transcript && (
          <div className="premium-card px-4 py-3 rounded-2xl border border-purple-500/30 max-w-xs animate-slide-in-up">
            <p className="text-sm text-gray-300">"{transcript}"</p>
          </div>
        )}
        
        <Button
          onClick={toggleListening}
          className={`w-16 h-16 rounded-full shadow-2xl ${
            isListening 
              ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse-custom' 
              : 'cyber-button'
          }`}
          title="Voice Commands"
        >
          {isListening ? (
            <MicOff className="w-7 h-7 text-white" />
          ) : (
            <Mic className="w-7 h-7 text-white" />
          )}
        </Button>

        {!isListening && (
          <div className="premium-card px-4 py-2 rounded-xl border border-purple-500/20">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Command className="w-3 h-3" />
              <span>Voice Control</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
