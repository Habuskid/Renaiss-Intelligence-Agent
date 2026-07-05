import { ScaleIcon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center gap-3 px-6 py-4 bg-white/70 backdrop-blur-md border-b border-stone-200/50 shadow-sm transition-all duration-300">
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg p-2 flex-shrink-0 shadow-inner">
        <ScaleIcon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h1 className="font-display font-bold text-base text-stone-900 tracking-tight">
          Renaiss Intelligence
        </h1>
        <p className="text-[11px] text-stone-400 tracking-wider mt-0.5 uppercase font-medium">
          Pokémon · One Piece · AI Analysis
        </p>
      </div>
    </header>
  );
}
