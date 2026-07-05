import { formatUSD, formatDelta, deltaColor } from '../utils/formatters.js';

export default function StatsRow({ card, details }) {
  if (!card) return null;

  const capitalize = (s) => {
    if (!s) return '—';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-stone-200/50 shadow-sm animate-fade-up delay-100 hover:-translate-y-1 hover:shadow-md hover:border-stone-300/50 transition-all duration-300">
        <h3 className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">
          Fair Market Value
        </h3>
        <p className="text-2xl font-bold text-stone-900 mt-2">
          {formatUSD(card.priceUsdCents)}
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-stone-200/50 shadow-sm animate-fade-up delay-200 hover:-translate-y-1 hover:shadow-md hover:border-stone-300/50 transition-all duration-300">
        <h3 className="text-[11px] font-bold text-stone-500 uppercase tracking-widest mb-3">
          Historical Trends
        </h3>
        <div className="flex flex-wrap gap-2">
          {['d7', 'd30', 'd365'].map(key => {
            const val = details?.deltas?.[key] ?? card?.deltas?.[key];
            if (val == null) return null;
            const isPos = val >= 0;
            return (
              <div key={key} className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md border ${isPos ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                <span>{key.toUpperCase()}</span>
                <span>{formatDelta(val)}</span>
              </div>
            );
          })}
          {!(details?.deltas?.d30 ?? card?.deltas?.d30) && (
            <p className={`text-2xl font-bold ${deltaColor(card?.deltaPct)}`}>
              {formatDelta(card?.deltaPct)}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-stone-200/50 shadow-sm animate-fade-up delay-300 hover:-translate-y-1 hover:shadow-md hover:border-stone-300/50 transition-all duration-300">
        <h3 className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">
          Confidence
        </h3>
        <p className="text-2xl font-bold text-stone-900 mt-2">
          {capitalize(card.confidence)}
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-stone-200/50 shadow-sm animate-fade-up delay-400 hover:-translate-y-1 hover:shadow-md hover:border-stone-300/50 transition-all duration-300">
        <h3 className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">
          Observations
        </h3>
        <p className="text-2xl font-bold text-stone-900 mt-2">
          {details?.observationCount ?? '—'}
        </p>
      </div>
    </div>
  );
}
