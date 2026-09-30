import React, { useState } from 'react';
import { Search, X, History, Sparkles } from 'lucide-react';

const POPULAR_CITIES = [
  { name: 'London', label: '🇬🇧 London' },
  { name: 'New York', label: '🇺🇸 New York' },
  { name: 'Tokyo', label: '🇯🇵 Tokyo' },
  { name: 'Kolkata', label: '🇮🇳 Kolkata' },
  { name: 'Paris', label: '🇫🇷 Paris' },
  { name: 'Sydney', label: '🇦🇺 Sydney' },
];

export default function SearchBar({
  onSearch,
  isLoading,
  currentCity,
  recentSearches = [],
  onClearRecents,
}) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleChipClick = (cityName) => {
    if (!isLoading) {
      setQuery('');
      onSearch(cityName);
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-3 px-2 sm:px-0">
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative w-full flex items-center">
        <div className="relative w-full flex items-center">
          <div className="absolute left-4 pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-cyan-400" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city (e.g., Tokyo, Kolkata, London)..."
            disabled={isLoading}
            className="w-full pl-12 pr-28 py-3.5 sm:py-4 rounded-2xl bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-slate-300 text-sm sm:text-base font-medium border border-white/20 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 backdrop-blur-xl transition-all shadow-lg"
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-20 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Submit Search Button */}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Quick-Select Chips: Popular Cities */}
      <div className="w-full flex items-center gap-1.5 flex-wrap justify-center sm:justify-start pt-1">
        <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Popular:
        </span>
        {POPULAR_CITIES.map((city) => {
          const isSelected = currentCity?.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              key={city.name}
              type="button"
              onClick={() => handleChipClick(city.name)}
              disabled={isLoading}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all active:scale-95 border ${
                isSelected
                  ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400/50 shadow-sm shadow-cyan-500/20 font-semibold'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/15 hover:border-white/30'
              }`}
            >
              {city.label}
            </button>
          );
        })}
      </div>

      {/* Recent Searches (if any exist) */}
      {recentSearches.length > 0 && (
        <div className="w-full flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1 mr-1">
            <History className="w-3 h-3 text-slate-400" />
            Recent:
          </span>
          {recentSearches.slice(0, 4).map((cityName) => (
            <button
              key={cityName}
              type="button"
              onClick={() => handleChipClick(cityName)}
              disabled={isLoading}
              className="text-xs px-2.5 py-1 rounded-lg bg-black/25 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-all active:scale-95"
            >
              {cityName}
            </button>
          ))}
          {recentSearches.length > 0 && onClearRecents && (
            <button
              type="button"
              onClick={onClearRecents}
              className="text-[11px] text-slate-400 hover:text-rose-300 underline ml-1"
            >
              clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
