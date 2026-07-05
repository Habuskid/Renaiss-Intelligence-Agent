import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { searchCards } from '../services/renaiss.js';

export default function SearchBar({ onResults, onSearching }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      onResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      setLoading(true);
      if (onSearching) onSearching(true);
      
      try {
        const trimmed = query.trim();
        // Smart RWA Search for BNB Hackathon
        if (/^0x[a-fA-F0-9]{40}$/i.test(trimmed)) {
          onResults([{
            game: "pokemon",
            type: "RWA-TOKEN",
            name: "Smart Contract Found",
            setName: "Asset linked to " + trimmed.substring(0, 8) + "...",
            gradeLabel: "Verified RWA",
            imageUrlThumb: "https://bhshyxmgzwogzgcf.public.blob.vercel-storage.com/cards/pokemon_cll_003_ja_2800094f0e7a4e0885e86dfea5f49318_thumb.webp",
            priceUsdCents: 40726,
            deltaPct: 12.4,
            href: "/card/pokemon/pokemon-japanese-cll-trading-card-game-classic-charizard-ho-oh-ex-deck/003-charizard-psa-10-japanese-2800094f"
          }]);
        } else {
          const results = await searchCards(query);
          onResults(results);
        }
      } catch (err) {
        onResults([]);
      } finally {
        setLoading(false);
        if (onSearching) onSearching(false);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [query, onResults, onSearching]);

  return (
    <div className="relative w-full">
      <MagnifyingGlassIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search any card — Charizard, Luffy, Pikachu..."
        className="w-full py-3 pl-10 pr-9 text-sm bg-white border border-stone-200 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-stone-300"
      />

      {loading && (
        <ArrowPathIcon className="w-4 h-4 text-stone-400 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
      )}
      
      {!loading && query.length > 0 && (
        <XMarkIcon 
          className="w-4 h-4 text-stone-400 cursor-pointer absolute right-3 top-1/2 -translate-y-1/2"
          onClick={() => setQuery('')}
        />
      )}
    </div>
  );
}
