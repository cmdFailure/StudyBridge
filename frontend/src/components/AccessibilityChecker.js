import React from 'react';
import { CheckCircle2, TrendingUp, DollarSign, Zap } from 'lucide-react';
import { getReadingLevelDescription } from '../utils/readability';

export const AccessibilityChecker = ({ originalScore, simplifiedScore, hasContent }) => {
  if (!hasContent) return null;

  const improvement = simplifiedScore ? Math.round(simplifiedScore - originalScore) : 0;
  const costSavings = 2000;

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-sky-50 to-purple-50 rounded-2xl shadow-lg border-2 border-emerald-200 p-6" data-testid="accessibility-checker">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle2 className="w-7 h-7 text-emerald-600" aria-hidden="true" />
        <h3 className="text-2xl font-bold text-slate-800">Accessibility Impact</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          icon={TrendingUp}
          title="Readability Score"
          value={`${originalScore} → ${simplifiedScore || '...'}`}
          description={simplifiedScore ? getReadingLevelDescription(simplifiedScore) : 'Awaiting simplification'}
          color="sky"
        />
        
        <MetricCard
          icon={Zap}
          title="Improvement"
          value={simplifiedScore ? `+${improvement} points` : 'N/A'}
          description={simplifiedScore ? 'Easier to read' : 'Process content first'}
          color="emerald"
        />
        
        <MetricCard
          icon={DollarSign}
          title="Cost Savings"
          value={`$${costSavings}/year`}
          description="vs. commercial AT tools"
          color="purple"
        />
      </div>

      <div className="mt-6 bg-white rounded-xl p-5 border border-emerald-200">
        <h4 className="font-semibold text-slate-800 mb-3">Why This Matters</h4>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span>80% of students with disabilities struggle with inaccessible PDFs</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span>Commercial assistive technology costs $2000+ per year</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span>StudyBridge provides free, AI-powered accessibility for all students</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const MetricCard = ({ icon: Icon, title, value, description, color }) => {
  const colorClasses = {
    sky: 'from-sky-400 to-blue-500',
    emerald: 'from-emerald-400 to-teal-500',
    purple: 'from-purple-400 to-pink-500'
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h4 className="text-sm font-medium text-slate-600 mb-1">{title}</h4>
      <p className="text-2xl font-bold text-slate-800 mb-1">{value}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );
};