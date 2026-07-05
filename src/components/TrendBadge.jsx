import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from '@heroicons/react/24/outline';

export default function TrendBadge({ trend }) {
  if (!trend) return <span className="text-stone-500 font-medium">—</span>;

  const t = trend.toLowerCase();
  
  if (t.includes('up') || t.includes('bullish') || t.includes('positive')) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 border border-green-200">
        <ArrowTrendingUpIcon className="w-4 h-4 text-green-700" />
        <span className="text-sm font-bold text-green-700">{trend}</span>
      </div>
    );
  }

  if (t.includes('down') || t.includes('bearish') || t.includes('negative')) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 border border-red-200">
        <ArrowTrendingDownIcon className="w-4 h-4 text-red-700" />
        <span className="text-sm font-bold text-red-700">{trend}</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200">
      <MinusIcon className="w-4 h-4 text-stone-600" />
      <span className="text-sm font-bold text-stone-700">{trend}</span>
    </div>
  );
}
