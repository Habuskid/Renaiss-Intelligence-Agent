import { formatUSD } from '../utils/formatters.js';

export default function CardResult({ card, onClick }) {
  const getConfidenceColor = (confidence) => {
    if (confidence === 'high') return 'bg-green-400';
    if (confidence === 'medium') return 'bg-amber-400';
    return 'bg-red-400'; // low or unknown
  };

  return (
    <div 
      className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 cursor-pointer border-b border-stone-100 last:border-0 card-shine transition-colors duration-200"
      onClick={onClick}
    >
      {card.imageUrl ? (
        <img src={card.imageUrl} alt={card.name} className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0" />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-stone-100 shrink-0" />
      )}
      
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <span className="font-display font-medium text-sm text-stone-900 truncate">
          {card.name}
        </span>
        <span className="text-xs text-stone-500 mt-0.5 truncate">
          {card.setName} · {card.gradeLabel}
        </span>
      </div>

      <div className="flex items-center gap-3 ml-auto shrink-0">
        <span className="text-sm text-stone-700">
          {formatUSD(card.priceUsdCents)}
        </span>
        <div className={`w-2 h-2 rounded-full ${getConfidenceColor(card.confidence)}`} />
      </div>
    </div>
  );
}
