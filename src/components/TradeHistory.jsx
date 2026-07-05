import { formatDate, formatUSD } from '../utils/formatters.js';

export default function TradeHistory({ trades }) {
  const safeTrades = trades || [];

  return (
    <div className="bg-white p-6 rounded-xl border border-stone-200 h-full">
      <h2 className="text-sm font-bold text-stone-900 mb-4">Recent Transactions</h2>
      
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
