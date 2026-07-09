import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage.jsx';
import Header from './components/Header.jsx';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import SearchBar from './components/SearchBar.jsx';
import SearchResults from './components/SearchResults.jsx';
import FeaturedCards from './components/FeaturedCards.jsx';
import StatsRow from './components/StatsRow.jsx';
import TradeHistory from './components/TradeHistory.jsx';
import FmvChart from './components/FmvChart.jsx';
import AiAnalysis from './components/AiAnalysis.jsx';
import { getCardDetail, getCardTrades, getFmvSeries, getFeaturedCards } from './services/renaiss.js';
import { parseHref } from './utils/parseHref.js';

export default function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [featuredCards, setFeaturedCards] = useState([]);
  const [isAppLaunched, setIsAppLaunched] = useState(false);
  
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardDetails, setCardDetails] = useState(null);
  const [trades, setTrades] = useState([]);
  const [fmvSeries, setFmvSeries] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const [featuredError, setFeaturedError] = useState(null);

  useEffect(() => {
    getFeaturedCards()
      .then(setFeaturedCards)
      .catch((err) => {
        console.error(err);
        setFeaturedError("API rate limit exceeded or keys missing. Please configure VITE_RENAISS_API_KEY in Vercel.");
      });
  }, []);

  const handleSelectCard = async (card) => {
    setSearchResults([]); // close dropdown
    setSelectedCard(card);
    setLoadingData(true);
    setCardDetails(null);
    setTrades([]);
    setFmvSeries([]);

    try {
      const { game, set, card: cardId } = parseHref(card.href);
      
      let cardError = null;
      const detailsPromise = getCardDetail(game, set, cardId).catch((err) => {
        cardError = err.message;
        return null;
      });

      const [detailsData, tradesData, fmvData] = await Promise.all([
        detailsPromise,
        getCardTrades(game, set, cardId).catch(() => []),
        getFmvSeries(game, set, cardId).catch(() => [])
      ]);

      if (!detailsData) {
        setCardDetails({ error: cardError || 'not_found' });
      } else {
        setCardDetails(detailsData);
      }
      setTrades(tradesData);
      setFmvSeries(fmvData);
    } catch (err) {
      console.error("Failed to load full card data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  return (
    <div className="min-h-screen bg-parchment font-sans text-stone-900 mesh-bg overflow-hidden relative">
      <Header 
        isAppLaunched={isAppLaunched} 
        onSearchAgain={() => {
          setSelectedCard(null);
          setSearchResults([]);
          setIsAppLaunched(false);
        }} 
      />
      
      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        
        {!isAppLaunched ? (
          <LandingPage onLaunch={() => setIsAppLaunched(true)} featuredCards={featuredCards} />
        ) : (
          <>
            <div className={`transition-all duration-500 flex flex-col ${!selectedCard ? 'items-center justify-center min-h-[60vh] text-center' : 'items-start justify-start'}`}>
              
              <div className={`w-full max-w-2xl relative z-20 ${!selectedCard ? 'mb-16' : 'mb-8'}`}>
                <SearchBar 
                  onResults={setSearchResults} 
                  onSearching={setSearching} 
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-2 text-left">
                    <SearchResults 
                      results={searchResults} 
                      onSelect={handleSelectCard} 
                    />
                  </div>
                )}
              </div>

              {!selectedCard && searchResults.length === 0 && !searching && (
                <div className="w-full text-left">
                  {featuredError ? (
                    <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 text-center shadow-sm">
                      <h3 className="font-bold text-lg mb-1">Could not load market data</h3>
                      <p className="text-sm">{featuredError}</p>
                    </div>
                  ) : (
                    <FeaturedCards cards={featuredCards} onSelect={handleSelectCard} />
                  )}
                </div>
              )}
            </div>

        {selectedCard && (
          <div className="mt-8">
            {loadingData ? (
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-12 border border-stone-200/50 shadow-xl text-center flex flex-col items-center min-h-[400px] justify-center animate-fade-up">
                <div className="relative w-12 h-12 mb-6">
                  <svg className="animate-spin w-full h-full text-stone-900" viewBox="0 0 50 50">
                    <circle className="opacity-20" cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4" />
                    <circle className="opacity-100" cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="90 150" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-stone-900 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-xl font-display font-bold text-stone-900 mb-2">Fetching Market Data</p>
                <p className="text-stone-500 font-medium">Loading card details and recent sales from the API...</p>
              </div>
            ) : cardDetails?.error === 'rate_limit' ? (
              <div className="bg-red-50/90 backdrop-blur-sm rounded-xl p-12 border border-red-200 shadow-sm text-center min-h-[300px] flex flex-col items-center justify-center animate-fade-up">
                <h2 className="text-2xl font-bold text-red-900 mb-2">API Rate Limit Exceeded</h2>
                <p className="text-red-700 max-w-md mx-auto">This Vercel deployment has hit the anonymous rate limit. Please ensure VITE_RENAISS_API_KEY is configured in Vercel.</p>
                <button onClick={() => setSelectedCard(null)} className="mt-6 bg-red-900 text-white px-6 py-2 rounded-full font-medium hover:bg-red-800 transition-colors shadow-sm">
                  Clear Search
                </button>
              </div>
            ) : cardDetails?.error === 'not_found' ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-12 border border-stone-200/50 shadow-sm text-center min-h-[300px] flex flex-col items-center justify-center animate-fade-up">
                <h2 className="text-2xl font-bold text-stone-900 mb-2">Asset Not Indexed</h2>
                <p className="text-stone-500 max-w-md mx-auto">The requested asset ID could not be found in the live Renaiss database. It may not be indexed yet or the ID is invalid.</p>
                <button onClick={() => setSelectedCard(null)} className="mt-6 bg-stone-900 text-white px-6 py-2 rounded-full font-medium hover:bg-stone-800 transition-colors shadow-sm">
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (2/3 width) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  {/* Premium Title Card */}
                  <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-stone-200/50 shadow-sm animate-fade-up card-shine">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-bold uppercase tracking-widest border border-stone-200">
                        {selectedCard.game}
                      </span>
                      <span className="text-stone-400 text-sm font-medium">
                        {selectedCard.setName}
                      </span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-display font-bold text-stone-900 tracking-tight leading-tight">
                      {selectedCard.name} <span className="text-stone-400 font-light">| {selectedCard.gradeLabel}</span>
                    </h1>
                  </div>

                  <StatsRow 
                    card={selectedCard} 
                    details={cardDetails} 
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div>
                      <TradeHistory trades={trades} />
                    </div>
                    <div>
                      <FmvChart data={fmvSeries} />
                    </div>
                  </div>
                </div>

                {/* Right Column (1/3 width) */}
                <div className="lg:col-span-1">
                  <AiAnalysis 
                    card={selectedCard}
                    details={cardDetails}
                    trades={trades}
                    fmvSeries={fmvSeries}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        </>
        )}
      </main>
    </div>
  );
}
