import { formatDate, formatUSD } from '../utils/formatters.js';

export default function TradeHistory({ trades }) {
  const safeTrades = trades || [];

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-stone-200/50 shadow-sm h-full animate-fade-up delay-500 card-shine">
      <h2 className="text-[11px] font-bold text-stone-700 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">Recent Transactions</h2>
      
      {safeTrades.length === 0 ? (
        <div className="text-sm text-stone-500 text-center py-4">No recent trades found.</div>
      ) : (
        <div className="divide-y divide-stone-100">
          {safeTrades.slice(0, 8).map((trade, i) => (
            <div key={i} className="flex items-center justify-between py-3 text-sm">
              <div className="flex gap-3">
                <span className="text-stone-500">{formatDate(trade.observedAt)}</span>
                <span className="text-stone-900">{trade.displayName}</span>
              </div>
              <span className="text-stone-900 font-medium">
                {formatUSD(trade.priceUsdCents)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
