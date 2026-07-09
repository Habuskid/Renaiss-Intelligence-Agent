import { ArrowRightIcon, PresentationChartLineIcon, CpuChipIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';

export default function LandingPage({ onLaunch, featuredCards = [] }) {
  const bgCards = featuredCards.slice(0, 5);
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 animate-fade-up relative">
      
      {/* Floating Background Cards */}
      <div className="absolute inset-0 pointer-events-none z-[-5] overflow-hidden hidden md:block">
        {bgCards.map((card, index) => {
          // Pre-defined scattered positions for up to 5 background cards
          const positions = [
            { top: '5%', left: '5%', delay: '0s', scale: '0.8', rotate: '-12deg' },
            { top: '15%', right: '5%', delay: '1.5s', scale: '0.9', rotate: '15deg' },
            { bottom: '20%', left: '10%', delay: '0.5s', scale: '0.85', rotate: '-8deg' },
            { bottom: '10%', right: '15%', delay: '2s', scale: '0.75', rotate: '10deg' },
            { top: '40%', right: '-5%', delay: '1s', scale: '0.8', rotate: '-5deg' },
          ];
          const pos = positions[index] || positions[0];

          return (
            <div 
              key={card.href || card.name}
              className="absolute pointer-events-auto group z-0 hover:z-50"
              style={{
                top: pos.top,
                bottom: pos.bottom,
                left: pos.left,
                right: pos.right,
                transform: `scale(${pos.scale}) rotate(${pos.rotate})`
              }}
            >
              <div 
                className="animate-float-3d opacity-60 transition-all duration-500 group-hover:opacity-100 cursor-pointer"
                style={{ animationDelay: pos.delay }}
              >
                <div className="bg-white p-3 rounded-2xl shadow-xl border border-stone-200 w-48 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-4">
                  <div className="w-full h-56 rounded-lg overflow-hidden bg-stone-100 mb-3 shadow-inner">
                    <img 
                      src={card.imageUrlThumb || card.imageUrl} 
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-stone-900 text-sm line-clamp-1">{card.name}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">{card.gradeLabel}</p>
                    <div className="mt-2 font-mono text-sm font-semibold text-stone-900">
                      ${(card.priceUsdCents / 100).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-20 relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        
        <h1 className="text-5xl lg:text-7xl font-display font-bold text-stone-900 tracking-tight leading-tight mb-6 animate-fade-up delay-100 cursor-default">
          <span className="inline-block transition-all duration-150 ease-out hover:-translate-y-3 hover:scale-110 hover:text-blue-600 mr-3">Pricing</span>
          <span className="inline-block transition-all duration-150 ease-out hover:-translate-y-3 hover:scale-110 hover:text-blue-600 mr-3">Intelligence</span>
          <span className="inline-block transition-all duration-150 ease-out hover:-translate-y-3 hover:scale-110 hover:text-blue-600">for</span>
          <br/>
          <span className="inline-block transition-all duration-150 ease-out hover:-translate-y-3 hover:scale-110 mr-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500">Real</span>
          <span className="inline-block transition-all duration-150 ease-out hover:-translate-y-3 hover:scale-110 mr-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500">World</span>
          <span className="inline-block transition-all duration-150 ease-out hover:-translate-y-3 hover:scale-110 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500">Assets</span>
        </h1>
        <p className="text-lg lg:text-xl text-stone-600 mb-10 max-w-2xl mx-auto animate-fade-up delay-200">
          The first AI-driven terminal to analyze physical collectibles on Renaiss. 
          Get instant fair market value, liquidity scores, and investment insights powered by Ai.
        </p>
        
        <div className="flex items-center justify-center gap-4 animate-fade-up delay-300">
          <button 
            onClick={onLaunch}
            className="group flex items-center gap-3 bg-stone-900 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-stone-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Launch Terminal
            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-md hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] hover:scale-110 hover:-translate-y-6 transition-all duration-500 ease-out delay-100 animate-fade-up group cursor-default">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <PresentationChartLineIcon className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-3">Real-Time Valuation</h3>
          <p className="text-stone-500 leading-relaxed">
            Instantly determine the fair market value of physical collectibles. Search by asset name to unlock real-time pricing intelligence.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-md hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] hover:scale-110 hover:-translate-y-6 transition-all duration-500 ease-out delay-200 animate-fade-up group cursor-default">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <CpuChipIcon className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-3">AI-Powered Analysis</h3>
          <p className="text-stone-500 leading-relaxed">
            Our advanced AI engine evaluates physical assets to provide accurate liquidity scores, market volatility metrics, and comprehensive investment insights.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-md hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] hover:scale-110 hover:-translate-y-6 transition-all duration-500 ease-out delay-300 animate-fade-up group cursor-default">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <CheckBadgeIcon className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-3">Renaiss Protocol Native</h3>
          <p className="text-stone-500 leading-relaxed">
            Powered by the Renaiss Protocol on BNB Chain. Our terminal brings verified transparency to physical assets indexed exclusively within the Renaiss ecosystem.
          </p>
        </div>
      </div>
    </div>
  );
}
