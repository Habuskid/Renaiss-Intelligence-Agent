import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

export default function FeaturedCards({ cards, onSelect }) {
  if (!cards || cards.length === 0) return null;

  return (
    <div className="mt-12 animate-fade-up">
      <div className="flex items-center gap-2 mb-6">
        <ArrowTrendingUpIcon className="w-5 h-5 text-indigo-500" />
        <h2 className="text-lg font-display font-bold text-stone-900">
          Popular Collectibles
        </h2>
      </div>

      {cards.some(c => c.isMock) && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-3 mb-6 flex items-center justify-between text-amber-800 text-sm shadow-sm animate-fade-up">
          <div className="flex items-center gap-2">
            <span className="font-bold">API Offline:</span> Displaying placeholder mock data for hackathon demo purposes.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div 
            key={card.href}
            onClick={() => onSelect(card)}
            className={`
              bg-white border border-stone-200/80 
              rounded-xl p-4 cursor-pointer shadow-md
              hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] hover:-translate-y-6 hover:scale-110 hover:border-indigo-300/80
              transition-all duration-500 ease-out card-shine
              animate-fade-up
            `}
          >
            <div className="flex gap-4">
              <div className="w-16 h-24 rounded-md overflow-hidden bg-stone-100 flex-shrink-0 shadow-inner">
                <img 
                  src={card.imageUrlThumb || card.imageUrl} 
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-bold text-stone-900 text-sm line-clamp-1">{card.name}</h3>
                <p className="text-xs text-stone-500 mt-0.5">{card.gradeLabel}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-stone-900">
                    ${(card.priceUsdCents / 100).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </span>
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${card.deltaPct >= 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                    {card.deltaPct >= 0 ? '+' : ''}{card.deltaPct}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
