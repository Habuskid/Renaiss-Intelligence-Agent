import { useState, useEffect } from 'react';
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
  
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardDetails, setCardDetails] = useState(null);
  const [trades, setTrades] = useState([]);
  const [fmvSeries, setFmvSeries] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    getFeaturedCards().then(setFeaturedCards).catch(console.error);
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
      
      const [detailsData, tradesData, fmvData] = await Promise.all([
        getCardDetail(game, set, cardId).catch(() => ({})),
        getCardTrades(game, set, cardId).catch(() => []),
        getFmvSeries(game, set, cardId).catch(() => [])
      ]);

      setCardDetails(detailsData);
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
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        
        <div className={`transition-all duration-500 flex flex-col ${!selectedCard ? 'items-center justify-center min-h-[60vh] text-center' : 'items-start justify-start'}`}>
          
          {!selectedCard && (
            <div className="animate-fade-up">
              <h1 className="text-5xl font-display font-bold text-stone-900 mb-4 tracking-tight">
                Pricing Intelligence for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Real World Assets</span>
              </h1>
              <p className="text-stone-500 max-w-xl mx-auto mb-10">
                The first AI-driven terminal on BNB Chain to analyze physical collectibles. Search by asset name or paste an NFT smart contract to determine its fair market value.
              </p>
            </div>
          )}

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
              <FeaturedCards cards={featuredCards} onSelect={handleSelectCard} />
            </div>
          )}
        </div>

        {selectedCard && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Left Column (2/3 width) */}
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-display font-bold text-stone-900 animate-fade-up">
                {selectedCard.name} — {selectedCard.gradeLabel}
              </h1>
              <p className="text-sm text-stone-500 mt-1 animate-fade-up delay-100">
                {selectedCard.game} · {selectedCard.setName}
              </p>

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
              {loadingData ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-stone-200/50 shadow-sm h-full flex flex-col items-center justify-center min-h-[300px]">
                  <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              ) : (
                <AiAnalysis 
                  card={selectedCard}
                  details={cardDetails}
                  trades={trades}
                  fmvSeries={fmvSeries}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
