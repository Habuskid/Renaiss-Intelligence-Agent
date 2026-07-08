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
  const prevCardRef = useRef(null);

  useEffect(() => {
    if (card !== prevCardRef.current) {
      setAnalysis(null);
      setError(null);
      prevCardRef.current = card;
    }

    if (!card || !details || !trades || !fmvSeries) return;
    if (analysis || loading || error) return;
    
    const runAnalysis = async () => {
      // 1. Check Cache First
      const cacheKey = `ai_analysis_${card.href || details?.name}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        try {
          const parsedCache = JSON.parse(cached);
          // Only use cache if it's less than 1 hour old
          if (Date.now() - parsedCache.timestamp < 3600000) {
            setAnalysis(parsedCache.data);
            return;
          }
        } catch (e) {
          // Ignore cache parse errors
        }
      }

      setLoading(true);
      setError(null);
      try {
        const result = await analyzeCard({ cardDetail: details, trades, fmvSeries });
        setAnalysis(result);
        
        // 2. Save to Cache
        localStorage.setItem(cacheKey, JSON.stringify({
          timestamp: Date.now(),
          data: result
        }));
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
    runAnalysis();
  }, [card, details, trades, fmvSeries, analysis, loading, error]);

  const getBuyWindowColor = (window) => {
    if (window === 'Now') return 'text-green-600 font-bold';
    if (window === 'Wait') return 'text-amber-500 font-bold';
    return 'text-red-600 font-bold';
  };

  if (loading) {
    return (
      <div className="ai-border-glow bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-stone-200/50 shadow-xl flex flex-col items-center justify-center text-center h-full min-h-[300px] transition-all">
        <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-stone-900 font-medium">Analyzing 10k+ data points...</p>
        <p className="text-sm text-stone-500 mt-1">Please wait while the AI reviews the market data.</p>
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
