import React, { useState } from 'react';
import { Button } from './ui/button';
import { Wand2, RefreshCw, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { getReadingLevelDescription } from '../utils/readability';

export const ContentSimplifier = ({ originalText, simplifiedText, onSimplify, isSimplifying, profile }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(simplifiedText);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy text');
    }
  };

  if (!originalText) return null;

  return (
    <div className="space-y-6" data-testid="content-simplifier">
      <div className="premium-card rounded-2xl border border-white/10 p-8 card-lift">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white" id="original-content-heading">
              Original Content
            </h3>
          </div>
        </div>
        
        <div 
          className="prose max-w-none text-gray-300 max-h-96 overflow-y-auto p-6 bg-gray-900/50 rounded-xl border border-gray-800"
          aria-labelledby="original-content-heading"
          data-testid="original-text-display"
        >
          <p className="whitespace-pre-wrap leading-relaxed">{originalText.substring(0, 1500)}...</p>
        </div>

        {!simplifiedText && (
          <Button
            data-testid="simplify-content-btn"
            onClick={onSimplify}
            disabled={isSimplifying}
            className="mt-6 w-full cyber-button text-white py-7 text-lg rounded-2xl font-bold"
          >
            {isSimplifying ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                Simplifying with AI...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" aria-hidden="true" />
                Simplify Content with AI
              </>
            )}
          </Button>
        )}
      </div>

      {simplifiedText && (
        <div className="premium-card rounded-2xl border-2 border-green-500/30 p-8 card-lift relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white" id="simplified-content-heading">
                    Simplified Content
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    AI-adapted for {profile?.disabilities[0] || 'better'} accessibility
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  data-testid="copy-simplified-btn"
                  onClick={handleCopy}
                  variant="outline"
                  className="border-green-500/50 hover:bg-green-500/20 text-white"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" aria-label="Copied" />
                  ) : (
                    <Copy className="w-4 h-4" aria-label="Copy to clipboard" />
                  )}
                </Button>
                <Button
                  data-testid="regenerate-simplified-btn"
                  onClick={onSimplify}
                  disabled={isSimplifying}
                  variant="outline"
                  className="border-green-500/50 hover:bg-green-500/20 text-white"
                >
                  <RefreshCw className={`w-4 h-4 ${isSimplifying ? 'animate-spin' : ''}`} aria-label="Regenerate" />
                </Button>
              </div>
            </div>
            
            <div 
              className="prose max-w-none text-gray-200 max-h-96 overflow-y-auto p-6 bg-gray-900/50 rounded-xl border border-green-500/20 shadow-lg"
              style={{
                fontSize: `${profile?.visualNeeds?.fontSize || 16}px`,
                fontFamily: profile?.visualNeeds?.fontFamily || 'Inter',
                lineHeight: profile?.visualNeeds?.lineSpacing || 1.6,
                letterSpacing: `${profile?.visualNeeds?.letterSpacing || 0}px`
              }}
              aria-labelledby="simplified-content-heading"
              data-testid="simplified-text-display"
            >
              <p className="whitespace-pre-wrap leading-relaxed">{simplifiedText}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};