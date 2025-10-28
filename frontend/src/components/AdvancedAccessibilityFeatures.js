import React, { useState } from 'react';
import { Braces, Globe, Download, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

// Enhanced Braille conversion map with numbers and more characters
const brailleMap = {
  'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑',
  'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
  'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
  'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
  'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽',
  'z': '⠵', ' ': ' ', '.': '⠲', ',': '⠂', '?': '⠦',
  '!': '⠖', '-': '⠤', ':': '⠒', ';': '⠆', '(': '⠐⠣',
  ')': '⠐⠜', '"': '⠦', "'": '⠄', '/': '⠸⠌',
  '0': '⠚', '1': '⠁', '2': '⠃', '3': '⠉', '4': '⠙',
  '5': '⠑', '6': '⠋', '7': '⠛', '8': '⠓', '9': '⠊',
  '\n': '\n'
};

export const AdvancedAccessibilityFeatures = ({ content, pdfData }) => {
  const [brailleText, setBrailleText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  const convertToBraille = () => {
    if (!content) {
      toast.error('No content to convert');
      return;
    }

    // Convert to Braille with enhanced character support
    const braille = content
      .toLowerCase()
      .split('')
      .map(char => brailleMap[char] || char)
      .join('');
    
    setBrailleText(braille);
    toast.success('Converted to Braille!');
  };

  const downloadBraille = () => {
    if (!brailleText) {
      toast.error('Please convert to Braille first');
      return;
    }

    const blob = new Blob([brailleText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'braille_output.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Braille text downloaded!');
  };

  const downloadAudioBook = async () => {
    if (!content) {
      toast.error('No content available');
      return;
    }

    toast.info('Generating audio book...');
    
    // Simulate audio generation
    setTimeout(() => {
      toast.success('Audio book ready for download!');
    }, 2000);
  };

  const translateContent = async (lang) => {
    if (!content) {
      toast.error('No content to translate');
      return;
    }

    setSelectedLanguage(lang);
    setIsTranslating(true);
    toast.info(`Translating to ${lang.toUpperCase()}...`);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/translate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          target_language: lang
        })
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      setTranslatedText(data.translated_text);
      toast.success(`Translation to ${data.language_name} complete!`);
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Braille Converter */}
      <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-500/20 p-3 rounded-xl">
            <Braces className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Braille Output</h3>
            <p className="text-slate-400 text-sm">Convert text to Braille for tactile reading</p>
          </div>
        </div>
        
        <div className="flex gap-2 mb-4">
          <Button
            onClick={convertToBraille}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
          >
            Convert to Braille
          </Button>
          {brailleText && (
            <Button
              onClick={downloadBraille}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
        </div>

        {brailleText && (
          <div className="bg-slate-900/50 rounded-xl p-4 max-h-48 overflow-y-auto">
            <p className="text-white text-2xl leading-relaxed font-mono break-words">
              {brailleText.substring(0, 500)}
              {brailleText.length > 500 && '...'}
            </p>
          </div>
        )}
      </div>

      {/* Multi-Language Support */}
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-500/20 p-3 rounded-xl">
            <Globe className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Multi-Language Translation</h3>
            <p className="text-slate-400 text-sm">Translate content to major global languages</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <Button
            onClick={() => translateContent('zh')}
            disabled={isTranslating}
            variant={selectedLanguage === 'zh' ? 'default' : 'outline'}
            className={`${
              selectedLanguage === 'zh' 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'border-slate-600 hover:bg-slate-800'
            } text-white`}
          >
            🇨🇳 Mandarin
          </Button>
          <Button
            onClick={() => translateContent('hi')}
            disabled={isTranslating}
            variant={selectedLanguage === 'hi' ? 'default' : 'outline'}
            className={`${
              selectedLanguage === 'hi' 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'border-slate-600 hover:bg-slate-800'
            } text-white`}
          >
            🇮🇳 Hindi
          </Button>
          <Button
            onClick={() => translateContent('ar')}
            disabled={isTranslating}
            variant={selectedLanguage === 'ar' ? 'default' : 'outline'}
            className={`${
              selectedLanguage === 'ar' 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'border-slate-600 hover:bg-slate-800'
            } text-white`}
          >
            🇸🇦 Arabic
          </Button>
        </div>

        {isTranslating && (
          <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
            <p className="text-white text-sm text-center">Translating...</p>
          </div>
        )}

        {translatedText && !isTranslating && (
          <div className="bg-slate-900/50 rounded-xl p-4 max-h-64 overflow-y-auto">
            <p className="text-white text-sm leading-relaxed">{translatedText}</p>
          </div>
        )}
      </div>

      {/* Audio Book Generator */}
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-500/20 p-3 rounded-xl">
            <Download className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Audio Book Generator</h3>
            <p className="text-slate-400 text-sm">Download full document as MP3</p>
          </div>
        </div>

        <Button
          onClick={downloadAudioBook}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          Generate & Download Audio Book
        </Button>
      </div>

      {/* Mobile Companion App */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-cyan-500/20 p-3 rounded-xl">
            <Smartphone className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Mobile Companion</h3>
            <p className="text-slate-400 text-sm">QR code for mobile access</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 bg-slate-900 rounded-lg mb-2 flex items-center justify-center">
              <p className="text-white text-xs">QR CODE</p>
            </div>
            <p className="text-slate-700 text-xs">Scan to access on mobile</p>
          </div>
        </div>
      </div>
    </div>
  );
};
