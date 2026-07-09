import { useState, useEffect, useRef } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { analyzeCard } from '../services/gemini.js';
import { formatUSD } from '../utils/formatters.js';
import StarRating from './StarRating.jsx';
import TrendBadge from './TrendBadge.jsx';

const AiIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor" />
    <circle cx="12" cy="12" r="3" fill="currentColor" className="opacity-50" />
  </svg>
);

export default function AiAnalysis({ card, details, trades, fmvSeries }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  
  const [usageData, setUsageData] = useState(() => {
    const count = parseInt(localStorage.getItem('renaiss_ai_usage') || '0', 10);
    const resetTime = parseInt(localStorage.getItem('renaiss_ai_reset') || '0', 10);
    
    // If the 30-minute timer has expired, OR if they used the app before the timer feature was added
    if ((resetTime > 0 && Date.now() > resetTime) || (count >= 3 && !resetTime)) {
      localStorage.setItem('renaiss_ai_usage', '0');
      localStorage.setItem('renaiss_ai_reset', '0');
      return { count: 0, resetTime: 0 };
    }
    return { count, resetTime };
  });

  const prevCardRef = useRef(null);

  useEffect(() => {
    if (card !== prevCardRef.current) {
      setAnalysis(null);
      setError(null);
      setHasStarted(false); // Reset button state on new card
      prevCardRef.current = card;
    }
  }, [card]);

  const runAnalysis = async () => {
    if (!card || !details || !trades || !fmvSeries) return;
    if (usageData.count >= 3) return; // safeguard
    
    setHasStarted(true);
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeCard({ cardDetail: details, trades, fmvSeries });
      setAnalysis(result);
      
      const newCount = usageData.count + 1;
      let newResetTime = usageData.resetTime;
      
      // Start the 30-minute cooldown timer on the first usage
      if (newCount === 1 || !newResetTime) {
        newResetTime = Date.now() + (30 * 60 * 1000);
        localStorage.setItem('renaiss_ai_reset', newResetTime.toString());
      }
      
      setUsageData({ count: newCount, resetTime: newResetTime });
      localStorage.setItem('renaiss_ai_usage', newCount.toString());
    } catch (err) {
        // If we hit a rate limit, show a much friendlier error
        if (err.message?.includes('Quota exceeded') || err.message?.includes('429')) {
          setError('The AI is currently analyzing too many requests. Please wait a moment before trying again.');
        } else {
          setError(err.message || 'An error occurred during analysis.');
        }
      } finally {
        setLoading(false);
      }
    };

  const getBuyWindowColor = (window) => {
    if (window === 'Now') return 'text-green-600 font-bold';
    if (window === 'Wait') return 'text-amber-500 font-bold';
    return 'text-red-600 font-bold';
  };

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 border border-stone-200/50 shadow-xl flex flex-col items-center justify-center text-center h-full min-h-[300px] transition-all">
        <div className="relative w-12 h-12 mb-6">
          <svg className="animate-spin w-full h-full text-stone-900" viewBox="0 0 50 50">
            <circle className="opacity-20" cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4" />
            <circle className="opacity-100" cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="90 150" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-stone-900 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="text-stone-900 font-bold">Analyzing 10k+ Data Points</p>
        <p className="text-sm text-stone-500 mt-1">AI is actively reviewing market data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 border border-red-200/50 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[300px] animate-fade-up relative overflow-hidden">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 border border-red-100">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-stone-900 mb-2">Analysis Paused</h3>
        <p className="text-stone-500 font-medium mb-6 max-w-[250px] leading-relaxed text-sm">
          {error.includes('many requests') ? "Hit limit. Try again in 10 minutes." : error}
        </p>
        <button 
          onClick={() => { setError(null); setHasStarted(false); }}
          className="bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 px-6 py-2 rounded-full font-medium transition-all shadow-sm text-sm"
        >
          Dismiss Alert
        </button>
      </div>
    );
  }

  if (!hasStarted) {
    if (usageData.count >= 3) {
      // Calculate remaining minutes
      const remainingMs = usageData.resetTime - Date.now();
      const remainingMinutes = Math.max(1, Math.ceil(remainingMs / (1000 * 60)));

      return (
        <div className="bg-gradient-to-br from-stone-50 to-stone-100 backdrop-blur-sm rounded-xl p-8 border border-stone-200/50 shadow-inner flex flex-col items-center justify-center h-full min-h-[300px] animate-fade-up text-center">
          <SparklesIcon className="w-10 h-10 text-stone-300 mb-4" />
          <h3 className="text-lg font-bold text-stone-900 mb-2">Usage Limit Reached</h3>
          <p className="text-sm text-stone-500 mb-6 max-w-[250px]">You have exhausted your 3 free AI Market Analyses.</p>
          <button 
            disabled
            className="bg-stone-300 text-stone-500 px-6 py-2.5 rounded-full font-medium cursor-not-allowed shadow-inner flex items-center gap-2 mb-4"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Resets in {remainingMinutes} {remainingMinutes === 1 ? 'minute' : 'minutes'}
          </button>
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-stone-400 bg-stone-200/50 px-3 py-1.5 rounded-full border border-stone-200">
            3 / 3 Used
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-stone-200/50 shadow-sm flex flex-col items-center justify-center h-full min-h-[300px] animate-fade-up text-center relative overflow-hidden group card-shine hover:shadow-md transition-all duration-500">
        <div className="w-16 h-16 bg-stone-900 text-white rounded-2xl flex items-center justify-center shadow-lg mb-6 border border-stone-700/50">
          <AiIcon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-stone-900 mb-2">Ready for AI Analysis</h3>
        <p className="text-sm text-stone-500 mb-8 max-w-[250px] leading-relaxed">Generate a fair market value range and conviction rating using live data.</p>
        <button 
          onClick={runAnalysis}
          className="relative overflow-hidden bg-stone-900 text-white px-8 py-3.5 rounded-full font-bold shadow-[0_4px_14px_0_rgba(28,25,23,0.39)] hover:shadow-[0_6px_20px_rgba(28,25,23,0.23)] hover:bg-[rgba(41,37,36,1)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mb-4 group border border-stone-700/50"
        >
          <div className="absolute inset-0 w-full h-full border border-white/20 rounded-full scale-[0.9] opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 mix-blend-overlay"></div>
          <span className="relative z-10 flex items-center gap-2">
            <AiIcon className="w-5 h-5" />
            Generate Insight ({3 - usageData.count} left)
          </span>
        </button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-gradient-to-br from-white to-stone-50/50 backdrop-blur-sm rounded-xl p-8 border border-stone-200/50 shadow-lg flex flex-col items-center justify-center h-full min-h-[300px] animate-fade-up">
        <ArrowPathIcon className="w-6 h-6 text-stone-300 animate-spin mb-3" />
        <p className="text-stone-400 font-medium">Awaiting market data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 border border-stone-200/50 shadow-sm h-full flex flex-col min-h-[300px] animate-fade-up card-shine">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-stone-900 text-white rounded-xl flex items-center justify-center shadow-md">
          <AiIcon className="w-5 h-5" />
        </div>
        <h2 className="font-display font-bold text-stone-900 tracking-tight text-xl">AI Market Analysis</h2>
      </div>

      <div className="flex flex-col gap-6 mb-6">
        {/* Terminal/JSON Block */}
        <div className="bg-slate-900 rounded-xl p-5 shadow-inner border border-slate-800 relative overflow-hidden group animate-fade-up delay-100">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M4 18h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Terminal Output
            </span>
            <span className="text-[9px] text-green-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> VERIFIED
            </span>
          </div>
          <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
            <code>
{`{
  "asset": "${card?.name}",
  "fairValue": "${formatUSD(analysis.fairValueLow)} - ${formatUSD(analysis.fairValueHigh)}",
  "buyWindow": "${analysis.buyWindow}",
  "marketTrend": "${analysis.trend}",
  "confidence": "${analysis.rating}/5"
}`}
            </code>
          </pre>
        </div>

        {/* Human Readable Blocks */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-2 animate-fade-up delay-200">
          <div>
            <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest mb-1">Fair Value Range</p>
            <p className="text-xl font-bold text-stone-900">
              {formatUSD(analysis.fairValueLow)} - {formatUSD(analysis.fairValueHigh)}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest mb-1">Buy Window</p>
            <p className={`text-xl ${getBuyWindowColor(analysis.buyWindow)}`}>
              {analysis.buyWindow}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Market Trend</p>
            <TrendBadge trend={analysis.trend} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Conviction</p>
            <StarRating rating={analysis.rating} />
          </div>
        </div>
      </div>

      <div className="mt-auto animate-fade-up delay-300">
        <p className="text-[11px] font-bold text-stone-700 uppercase tracking-widest mb-3 border-b border-stone-100 pb-2">Analyst Insight</p>
        <div className="px-2">
          <p className="text-sm text-stone-800 leading-relaxed font-medium">
            {analysis.insight}
          </p>
        </div>
      </div>
    </div>
  );
}
