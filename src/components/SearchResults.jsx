import CardResult from './CardResult.jsx';

export default function SearchResults({ results, onSelect }) {
  if (!results || results.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-[10px] shadow-lg z-10 overflow-hidden">
        <div className="px-4 py-6 text-center text-sm text-stone-500">
          No cards found — try a different name
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-[10px] shadow-lg z-10 overflow-hidden">
      {results.slice(0, 6).map((card, index) => (
        <CardResult 
          key={card.href || index} 
          card={card} 
          onClick={() => onSelect(card)} 
        />
      ))}
    </div>
  );
}
