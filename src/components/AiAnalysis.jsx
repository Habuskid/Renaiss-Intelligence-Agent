import { useState, useEffect, useRef } from 'react';
import { SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { analyzeCard } from '../services/gemini.js';
import { formatUSD } from '../utils/formatters.js';
import StarRating from './StarRating.jsx';
import TrendBadge from './TrendBadge.jsx';

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
      <div className="ai-border-glow bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-stone-200/50 shadow-xl flex flex-col items-center justify-center text-center h-full min-h-[300px] transition-all">
        <div className="card-scanner mb-6 shadow-md"></div>
        <p className="text-stone-900 font-bold">Analyzing 10k+ Data Points</p>
        <p className="text-sm text-stone-500 mt-1">AI is actively reviewing market data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50/90 backdrop-blur-sm rounded-xl p-8 border border-red-100 shadow-xl flex flex-col items-center justify-center text-center h-full min-h-[300px] animate-fade-up">
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <button 
          onClick={() => setError(null)}
          className="text-sm bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
        >
          Dismiss
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
      <div className="bg-gradient-to-br from-white to-stone-50/50 backdrop-blur-sm rounded-2xl p-8 border border-stone-200/50 shadow-xl flex flex-col items-center justify-center h-full min-h-[300px] animate-fade-up text-center relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center shadow-inner mb-6 border border-white">
          <SparklesIcon className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-xl font-bold text-stone-900 mb-2">Ready for AI Analysis</h3>
        <p className="text-sm text-stone-500 mb-8 max-w-[250px] leading-relaxed">Generate a fair market value range and conviction rating using live data.</p>
        <button 
          onClick={runAnalysis}
          className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3.5 rounded-full font-bold shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mb-4"
        >
          <span className="relative z-10 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5" />
            Generate Insight ({3 - usageData.count} left)
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
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
    <div className="ai-border-glow bg-white/95 backdrop-blur-md rounded-xl p-6 border border-stone-200/50 shadow-2xl h-full flex flex-col min-h-[300px] animate-fade-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-2 rounded-lg shadow-inner">
          <SparklesIcon className="w-5 h-5 text-amber-600" />
        </div>
        <h2 className="font-bold text-stone-900 tracking-tight text-lg">AI Market Analysis</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-stone-50/50 backdrop-blur-sm p-4 rounded-xl border border-stone-100 shadow-sm animate-fade-up delay-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">Fair Value Range</p>
          <p className="text-lg font-bold text-stone-900 mt-1.5">
            {formatUSD(analysis.fairValueLow)} - {formatUSD(analysis.fairValueHigh)}
          </p>
        </div>
        <div className="bg-stone-50/50 backdrop-blur-sm p-4 rounded-xl border border-stone-100 shadow-sm animate-fade-up delay-200 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">Buy Window</p>
          <p className={`text-lg mt-1.5 ${getBuyWindowColor(analysis.buyWindow)}`}>
            {analysis.buyWindow}
          </p>
        </div>
        <div className="bg-stone-50/50 backdrop-blur-sm p-4 rounded-xl border border-stone-100 shadow-sm animate-fade-up delay-300 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-center">
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Market Trend</p>
          <div>
            <TrendBadge trend={analysis.trend} />
          </div>
        </div>
        <div className="bg-stone-50/50 backdrop-blur-sm p-4 rounded-xl border border-stone-100 shadow-sm animate-fade-up delay-400 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-center">
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Conviction Rating</p>
          <StarRating rating={analysis.rating} />
        </div>
      </div>

      <div className="mt-auto animate-fade-up delay-400">
        <p className="text-xs font-bold text-stone-900 uppercase tracking-widest mb-3">Analyst Insight</p>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-5 rounded-xl border border-blue-100/50 shadow-inner">
          <p className="text-sm text-stone-800 leading-relaxed font-medium">
            {analysis.insight}
          </p>
        </div>
      </div>
    </div>
  );
}
