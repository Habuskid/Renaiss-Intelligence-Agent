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
        const results = await searchCards(trimmed);
        onResults(results);
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
      <MagnifyingGlassIcon className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search any card — Charizard, Luffy, Pikachu..."
        className="w-full py-4 pl-12 pr-[100px] text-[15px] bg-white border-2 border-stone-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-stone-400 shadow-sm transition-all"
      />

      <div className="absolute right-2 top-2 bottom-2 flex items-center gap-2">
        {loading && (
          <ArrowPathIcon className="w-4 h-4 text-blue-500 animate-spin" />
        )}
        
        {!loading && query.length > 0 && (
          <XMarkIcon 
            className="w-4 h-4 text-stone-400 hover:text-stone-600 cursor-pointer transition-colors"
            onClick={() => setQuery('')}
          />
        )}

        <button 
          onClick={() => {}} // Auto-searches via useEffect, button is for UX confidence
          className="bg-stone-900 text-white px-4 h-full rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors shadow-sm"
        >
          Search
        </button>
      </div>
    </div>
  );
}
