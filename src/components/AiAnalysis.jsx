import { useState, useEffect, useRef } from 'react';
import { ArrowPathIcon, SparklesIcon } from '@heroicons/react/24/outline';
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
        // If we hit a rate limit or high demand, show a much friendlier error
        if (err.message?.includes('Quota exceeded') || err.message?.includes('429') || err.message?.includes('demand')) {
          setError('The AI server is currently experiencing extremely high demand. Please wait a moment before trying again.');
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
    <div className="relative rounded-2xl p-8 border border-stone-200/50 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col min-h-[300px] animate-fade-up overflow-hidden group">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-full blur-[80px] -z-10 group-hover:scale-110 transition-transform duration-700"></div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-stone-900 blur-sm opacity-20 rounded-xl"></div>
            <div className="relative w-11 h-11 bg-gradient-to-b from-stone-800 to-stone-900 text-white rounded-xl flex items-center justify-center border border-stone-700/50 shadow-lg">
              <AiIcon className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <h2 className="font-display font-bold text-stone-900 tracking-tight text-xl">AI Market Analysis</h2>
            <p className="text-xs text-stone-500 font-medium">Real-time intelligence engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200/50">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Verified</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Terminal/JSON Block - Sleek dark mode */}
        <div className="md:col-span-2 bg-[#0A0A0A] rounded-xl p-5 border border-stone-800/80 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-50"></div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            <span className="ml-3 text-[10px] font-mono text-stone-500">renaiss-terminal ~ /output</span>
          </div>
          <pre className="font-mono text-xs text-blue-100/80 overflow-x-auto whitespace-pre-wrap break-words leading-relaxed">
            <code>
{`{
  "asset": "${card?.name}",
  "fairValue": "${formatUSD(analysis.fairValueLow)} - ${formatUSD(analysis.fairValueHigh)}",
  "buyWindow": "${analysis.buyWindow}",
  "marketTrend": "${analysis.trend}",
  "confidence": "${analysis.rating}/5",
  "insight": "${analysis.insight}"
}`}
            </code>
          </pre>
        </div>

        {/* Value Range Card */}
        <div className="bg-gradient-to-br from-stone-50 to-white rounded-xl p-5 border border-stone-200/60 shadow-sm relative overflow-hidden group/card">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Fair Value Range</p>
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-stone-900 to-stone-600 mb-1">
            {formatUSD(analysis.fairValueLow)} <span className="text-stone-300 font-light mx-1">-</span> {formatUSD(analysis.fairValueHigh)}
          </p>
          <p className="text-xs text-stone-400 font-medium border-t border-stone-100 pt-2 mt-2">Based on historical liquidity</p>
        </div>

        {/* Buy Window Card */}
        <div className="bg-gradient-to-br from-stone-50 to-white rounded-xl p-5 border border-stone-200/60 shadow-sm relative overflow-hidden group/card">
          <div className={`absolute right-0 top-0 w-24 h-24 rounded-full blur-2xl -mr-10 -mt-10 opacity-0 group-hover/card:opacity-50 transition-opacity ${analysis.buyWindow === 'Now' ? 'bg-green-100' : analysis.buyWindow === 'Wait' ? 'bg-yellow-100' : 'bg-red-100'}`}></div>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Buy Window</p>
          <p className={`text-2xl font-display font-bold tracking-tight ${getBuyWindowColor(analysis.buyWindow)}`}>
            {analysis.buyWindow}
          </p>
          <p className="text-xs text-stone-400 font-medium border-t border-stone-100 pt-2 mt-2">Algorithmic recommendation</p>
        </div>

        {/* Trend Card */}
        <div className="bg-gradient-to-br from-stone-50 to-white rounded-xl p-5 border border-stone-200/60 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Market Trend</p>
          <div className="mt-1">
            <TrendBadge trend={analysis.trend} />
          </div>
        </div>

        {/* Conviction Card */}
        <div className="bg-gradient-to-br from-stone-50 to-white rounded-xl p-5 border border-stone-200/60 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Conviction Rating</p>
          <div className="mt-1">
            <StarRating rating={analysis.rating} />
          </div>
        </div>
      </div>
    </div>
  );
}
