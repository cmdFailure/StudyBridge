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
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800" id="original-content-heading">
            Original Content
          </h3>
        </div>
        
        <div 
          className="prose max-w-none text-slate-700 max-h-96 overflow-y-auto p-4 bg-slate-50 rounded-xl"
          aria-labelledby="original-content-heading"
          data-testid="original-text-display"
        >
          <p className="whitespace-pre-wrap">{originalText.substring(0, 1500)}...</p>
        </div>

        {!simplifiedText && (
          <Button
            data-testid="simplify-content-btn"
            onClick={onSimplify}
            disabled={isSimplifying}
            className="mt-4 w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white py-6 text-base rounded-xl font-semibold"
          >
            {isSimplifying ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                Simplifying with AI...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" aria-hidden="true" />
                Simplify Content
              </>
            )}
          </Button>
        )}
      </div>

      {simplifiedText && (
        <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-2xl shadow-md border-2 border-emerald-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800" id="simplified-content-heading">
                Simplified Content
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Adapted for {profile?.disabilities[0] || 'general'} accessibility
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                data-testid="copy-simplified-btn"
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="border-emerald-300 hover:bg-emerald-100"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" aria-label="Copied" />
                ) : (
                  <Copy className="w-4 h-4" aria-label="Copy to clipboard" />
                )}
              </Button>
              <Button
                data-testid="regenerate-simplified-btn"
                onClick={onSimplify}
                disabled={isSimplifying}
                variant="outline"
                size="sm"
                className="border-emerald-300 hover:bg-emerald-100"
              >
                <RefreshCw className={`w-4 h-4 ${isSimplifying ? 'animate-spin' : ''}`} aria-label="Regenerate" />
              </Button>
            </div>
          </div>
          
          <div 
            className="prose max-w-none text-slate-800 max-h-96 overflow-y-auto p-6 bg-white rounded-xl shadow-sm"
            style={{
              fontSize: `${profile?.visualNeeds?.fontSize || 16}px`,
              fontFamily: profile?.visualNeeds?.fontFamily || 'Inter',
              lineHeight: profile?.visualNeeds?.lineSpacing || 1.6,
              letterSpacing: `${profile?.visualNeeds?.letterSpacing || 0}px`
            }}
            aria-labelledby="simplified-content-heading"
            data-testid="simplified-text-display"
          >
            <p className="whitespace-pre-wrap">{simplifiedText}</p>
          </div>
        </div>
      )}
    </div>
  );
};