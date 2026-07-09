import { ScaleIcon, ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Header({ isAppLaunched, onSearchAgain }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-md border-b border-stone-200/50 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-stone-900 to-stone-800 shadow-md flex items-center justify-center flex-shrink-0 border border-stone-700/50">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 21V3H13.5C16.5376 3 19 5.46243 19 8.5C19 10.9995 17.3323 13.1103 15.0213 13.8055L20.25 21H16.75L12 14.5H9V21H6ZM9 11.5H13.5C15.1569 11.5 16.5 10.1569 16.5 8.5C16.5 6.84315 15.1569 5.5 13.5 5.5H9V11.5Z" fill="url(#paint0_linear)"/>
            <circle cx="17.5" cy="18.5" r="2.5" fill="#3B82F6"/>
            <defs>
              <linearGradient id="paint0_linear" x1="6" y1="3" x2="18.5" y2="19" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDE68A"/>
                <stop offset="1" stopColor="#D97706"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <h1 className="font-display font-bold text-base text-stone-900 tracking-tight">
            Renaiss Intelligence Agent
          </h1>
          <p className="text-[11px] text-stone-400 tracking-wider mt-0.5 uppercase font-medium">
            Pokémon · One Piece · AI Analysis
          </p>
        </div>
      </div>
      
      {isAppLaunched && onSearchAgain && (
        <button 
          onClick={onSearchAgain}
          className="flex items-center gap-2 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Home</span>
        </button>
      )}
    </header>
  );
}
