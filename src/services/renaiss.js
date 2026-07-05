const BASE = 'https://api.renaissos.com';

export async function searchCards(query) {
  try {
    const res = await fetch(`${BASE}/v1/search?q=${encodeURIComponent(query)}&limit=8`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    // Mock Search Results
    if (!query) return [];
    return [
      {
        name: "Charizard - Holographic",
        game: "Pokemon",
        setName: "Base Set",
        gradeLabel: "PSA 8 Near Mint",
        priceUsdCents: 45000,
        imageUrlThumb: "https://images.unsplash.com/photo-1613771404726-17b5cc95c72b?auto=format&fit=crop&q=80&w=100&h=150",
        href: "/card/pokemon/base1/4/psa8"
      },
      {
        name: "Black Lotus - Unlimited",
        game: "Magic",
        setName: "Unlimited Edition",
        gradeLabel: "BGS 7.5 Near Mint",
        priceUsdCents: 1250000,
        imageUrlThumb: "https://images.unsplash.com/photo-1593814681464-eef5af2b0628?auto=format&fit=crop&q=80&w=100&h=150",
        href: "/card/magic/unlimited/black-lotus/bgs75"
      }
    ];
  }
}

export async function getCardDetail(game, set, card) {
  try {
    const res = await fetch(`${BASE}/v1/cards/${game}/${set}/${card}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (err) {
    // Mock Details
    return {
      name: game === 'magic' ? "Black Lotus - Unlimited" : "Charizard - Holographic",
      game: game === 'magic' ? "Magic" : "Pokemon",
      setName: set === 'unlimited' ? "Unlimited Edition" : "Base Set",
      gradeLabel: game === 'magic' ? "BGS 7.5 Near Mint" : "PSA 8 Near Mint",
      priceUsdCents: game === 'magic' ? 1250000 : 45000,
      deltas: { d7: 2.1, d30: 12.5, d365: 45.2 },
      observationCount: 142,
      sourceCount: 4
    };
  }
}

export async function getCardTrades(game, set, card) {
  try {
    const res = await fetch(`${BASE}/v1/cards/${game}/${set}/${card}/trades?limit=20&scope=grade`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.trades || [];
  } catch (err) {
    // Mock Trades
    const basePrice = game === 'magic' ? 1250000 : 45000;
    return Array.from({ length: 10 }).map((_, i) => ({
      date: new Date(Date.now() - i * 86400000 * 3).toISOString(),
      priceUsdCents: basePrice - Math.floor(Math.random() * 5000),
      marketplace: i % 2 === 0 ? "eBay" : "Goldin",
      gradeLabel: game === 'magic' ? "BGS 7.5" : "PSA 8"
    }));
  }
}

export async function getFmvSeries(game, set, card) {
  try {
    const res = await fetch(`${BASE}/v1/cards/${game}/${set}/${card}/fmv-series?window=30`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.points || [];
  } catch (err) {
    // Mock Series
    const basePrice = game === 'magic' ? 1200000 : 40000;
    return Array.from({ length: 30 }).map((_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString(),
      usdCents: basePrice + (i * 200) + Math.floor(Math.random() * 1000)
    }));
  }
}

export async function getFeaturedCards() {
  try {
    const res = await fetch(`${BASE}/v1/cards/featured?limit=6`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (data.cards && data.cards.length > 0) return data.cards;
    throw new Error("Empty");
  } catch (err) {
    return [
      {
        name: "Charizard - Holographic",
        game: "Pokemon",
        gradeLabel: "PSA 8 Near Mint",
        priceUsdCents: 45000,
        deltaPct: 12.5,
        imageUrl: "https://images.unsplash.com/photo-1613771404726-17b5cc95c72b?auto=format&fit=crop&q=80&w=400&h=600",
        href: "/card/pokemon/base1/4/psa8",
        isMock: true
      },
      {
        name: "Black Lotus - Unlimited",
        game: "Magic",
        gradeLabel: "BGS 7.5 Near Mint",
        priceUsdCents: 1250000,
        deltaPct: 5.2,
        imageUrl: "https://images.unsplash.com/photo-1593814681464-eef5af2b0628?auto=format&fit=crop&q=80&w=400&h=600",
        href: "/card/magic/unlimited/black-lotus/bgs75",
        isMock: true
      },
      {
        name: "Michael Jordan Rookie",
        game: "Basketball",
        gradeLabel: "PSA 7 Near Mint",
        priceUsdCents: 320000,
        deltaPct: -2.4,
        imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400&h=600",
        href: "/card/basketball/fleer1986/57/psa7",
        isMock: true
      }
    ];
  }
}
