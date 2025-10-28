import React, { useState } from 'react';
import { BookOpen, FileText, Lightbulb, HelpCircle, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { apiService } from '../services/apiService';
import { toast } from 'sonner';

export const StudyToolsPanel = ({ content }) => {
  const [activeTab, setActiveTab] = useState('flashcards');
  const [studyAids, setStudyAids] = useState({});
  const [loading, setLoading] = useState({});

  const generateAid = async (type) => {
    if (studyAids[type]) return;
    
    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      const result = await apiService.generateStudyAids(content, type);
      
      let parsedContent = result.content;
      try {
        const jsonMatch = result.content.match(/\[.*\]/s);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        // Keep as string if not JSON
      }
      
      setStudyAids(prev => ({ ...prev, [type]: parsedContent }));
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} generated!`);
    } catch (error) {
      toast.error(`Failed to generate ${type}`);
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const regenerateAid = (type) => {
    setStudyAids(prev => {
      const updated = { ...prev };
      delete updated[type];
      return updated;
    });
    generateAid(type);
  };

  if (!content) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6" data-testid="study-tools-panel">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-amber-500" aria-hidden="true" />
        <h3 className="text-xl font-bold text-slate-800">Study Tools</h3>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="flashcards" data-testid="tab-flashcards" className="gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Cards</span>
          </TabsTrigger>
          <TabsTrigger value="summary" data-testid="tab-summary" className="gap-2">
            <Lightbulb className="w-4 h-4" />
            <span className="hidden sm:inline">Summary</span>
          </TabsTrigger>
          <TabsTrigger value="keyterms" data-testid="tab-keyterms" className="gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Terms</span>
          </TabsTrigger>
          <TabsTrigger value="quiz" data-testid="tab-quiz" className="gap-2">
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Quiz</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flashcards" className="mt-4">
          <FlashcardsView 
            data={studyAids.flashcards}
            loading={loading.flashcards}
            onGenerate={() => generateAid('flashcards')}
            onRegenerate={() => regenerateAid('flashcards')}
          />
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <SummaryView 
            data={studyAids.summary}
            loading={loading.summary}
            onGenerate={() => generateAid('summary')}
            onRegenerate={() => regenerateAid('summary')}
          />
        </TabsContent>

        <TabsContent value="keyterms" className="mt-4">
          <KeyTermsView 
            data={studyAids.keyterms}
            loading={loading.keyterms}
            onGenerate={() => generateAid('keyterms')}
            onRegenerate={() => regenerateAid('keyterms')}
          />
        </TabsContent>

        <TabsContent value="quiz" className="mt-4">
          <QuizView 
            data={studyAids.quiz}
            loading={loading.quiz}
            onGenerate={() => generateAid('quiz')}
            onRegenerate={() => regenerateAid('quiz')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const FlashcardsView = ({ data, loading, onGenerate, onRegenerate }) => {
  const [flipped, setFlipped] = useState({});

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <Button 
        data-testid="generate-flashcards-btn"
        onClick={onGenerate} 
        className="w-full py-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
      >
        Generate Flashcards
      </Button>
    );
  }

  const cards = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          data-testid="regenerate-flashcards-btn"
          onClick={onRegenerate} 
          variant="outline" 
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate
        </Button>
      </div>
      {cards.map((card, idx) => (
        <div
          key={idx}
          data-testid={`flashcard-${idx}`}
          onClick={() => setFlipped(prev => ({ ...prev, [idx]: !prev[idx] }))}
          className="cursor-pointer bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 transition-all hover:shadow-lg min-h-[120px] flex items-center justify-center"
          role="button"
          tabIndex={0}
          aria-label={`Flashcard ${idx + 1}, click to flip`}
        >
          <p className="text-center text-slate-800 font-medium">
            {flipped[idx] ? (card.back || card.answer || 'No answer') : (card.front || card.question || 'No question')}
          </p>
        </div>
      ))}
    </div>
  );
};

const SummaryView = ({ data, loading, onGenerate, onRegenerate }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <Button 
        data-testid="generate-summary-btn"
        onClick={onGenerate} 
        className="w-full py-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
      >
        Generate Summary
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          data-testid="regenerate-summary-btn"
          onClick={onRegenerate} 
          variant="outline" 
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate
        </Button>
      </div>
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6" data-testid="summary-content">
        <p className="text-slate-800 whitespace-pre-wrap">{data}</p>
      </div>
    </div>
  );
};

const KeyTermsView = ({ data, loading, onGenerate, onRegenerate }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <Button 
        data-testid="generate-keyterms-btn"
        onClick={onGenerate} 
        className="w-full py-6 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
      >
        Extract Key Terms
      </Button>
    );
  }

  const terms = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          data-testid="regenerate-keyterms-btn"
          onClick={onRegenerate} 
          variant="outline" 
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate
        </Button>
      </div>
      {terms.map((item, idx) => (
        <div key={idx} className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-5" data-testid={`keyterm-${idx}`}>
          <h4 className="font-bold text-purple-700 text-lg mb-2">{item.term || 'Term'}</h4>
          <p className="text-slate-700">{item.definition || item.description || 'Definition'}</p>
        </div>
      ))}
    </div>
  );
};

const QuizView = ({ data, loading, onGenerate, onRegenerate }) => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <Button 
        data-testid="generate-quiz-btn"
        onClick={onGenerate} 
        className="w-full py-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
      >
        Generate Quiz
      </Button>
    );
  }

  const questions = Array.isArray(data) ? data : [];

  const handleSubmit = () => {
    setShowResults(true);
  };

  const score = showResults ? questions.reduce((acc, q, idx) => {
    return acc + (answers[idx] === q.correct ? 1 : 0);
  }, 0) : 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          data-testid="regenerate-quiz-btn"
          onClick={() => {
            setAnswers({});
            setShowResults(false);
            onRegenerate();
          }} 
          variant="outline" 
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate
        </Button>
      </div>
      
      {questions.map((q, idx) => (
        <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5" data-testid={`quiz-question-${idx}`}>
          <p className="font-semibold text-slate-800 mb-3">{idx + 1}. {q.question}</p>
          <div className="space-y-2">
            {(q.options || []).map((option, optIdx) => {
              const isSelected = answers[idx] === optIdx;
              const isCorrect = q.correct === optIdx;
              const showFeedback = showResults && (isSelected || isCorrect);
              
              return (
                <button
                  key={optIdx}
                  data-testid={`quiz-option-${idx}-${optIdx}`}
                  onClick={() => !showResults && setAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                  disabled={showResults}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                    showFeedback
                      ? isCorrect
                        ? 'border-emerald-500 bg-emerald-50'
                        : isSelected
                        ? 'border-red-500 bg-red-50'
                        : 'border-slate-200'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      
      {!showResults ? (
        <Button 
          data-testid="submit-quiz-btn"
          onClick={handleSubmit} 
          className="w-full py-6 bg-gradient-to-r from-blue-500 to-indigo-600"
          disabled={Object.keys(answers).length < questions.length}
        >
          Submit Answers
        </Button>
      ) : (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-6 text-center" data-testid="quiz-results">
          <p className="text-2xl font-bold">Score: {score} / {questions.length}</p>
          <p className="mt-2">{Math.round((score / questions.length) * 100)}% Correct</p>
        </div>
      )}
    </div>
  );
};
