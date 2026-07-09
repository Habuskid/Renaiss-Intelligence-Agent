import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { searchCards } from '../services/renaiss.js';

export default function SearchBar({ onResults, onSearching }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = ['Charizard', 'Luffy', 'Pikachu', 'Cornerstone Mask Ogerpon', 'Blue-Eyes'];

  const executeSearch = async (searchQuery) => {
    if (searchQuery.trim().length < 2) {
      onResults([]);
      return;
    }
    
    setLoading(true);
    if (onSearching) onSearching(true);
    
    try {
      const trimmed = searchQuery.trim();
      const results = await searchCards(trimmed);
      onResults(results);
    } catch (err) {
      onResults([]);
    } finally {
      setLoading(false);
      if (onSearching) onSearching(false);
    }
  };

  const handleSearchClick = () => {
    executeSearch(query);
  };

  return (
    <div className="relative w-full">
      <div className="relative z-50">
        <MagnifyingGlassIcon className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
        
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim().length === 0) onResults([]);
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Enter asset name to run terminal analysis..."
          className="w-full py-4 pl-12 pr-[100px] text-[15px] bg-white border-2 border-stone-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-stone-400 shadow-sm transition-all relative z-50"
        />

        <div className="absolute right-2 top-2 bottom-2 flex items-center gap-2 z-50">
          {loading && (
            <ArrowPathIcon className="w-4 h-4 text-blue-500 animate-spin" />
          )}
          
          {!loading && query.length > 0 && (
            <XMarkIcon 
              className="w-4 h-4 text-stone-400 hover:text-stone-600 cursor-pointer transition-colors"
              onClick={() => {
                setQuery('');
                onResults([]);
              }}
            />
          )}

          <button 
            onClick={handleSearchClick}
            className="bg-stone-900 text-white px-4 h-full rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors shadow-sm"
          >
            Search
          </button>
        </div>

        {/* Dropdown Suggestions */}
        {isFocused && query.length === 0 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-stone-200 py-2 z-40 animate-fade-up">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setQuery(suggestion);
                  setIsFocused(false);
                  executeSearch(suggestion);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-stone-50 text-[15px] text-stone-700 font-medium transition-colors flex items-center gap-3"
              >
                <MagnifyingGlassIcon className="w-4 h-4 text-stone-400" />
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
