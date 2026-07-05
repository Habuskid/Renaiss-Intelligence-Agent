const BASE = 'https://api.renaissos.com';

export async function searchCards(query) {
  try {
    const res = await fetch(`${BASE}/v1/search?q=${encodeURIComponent(query)}&limit=8`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    throw new Error("Search failed. Please try again.");
  }
}

export async function getCardDetail(game, set, card) {
  try {
    const res = await fetch(`${BASE}/v1/cards/${game}/${set}/${card}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (err) {
    throw new Error("Could not load card details.");
  }
}

export async function getCardTrades(game, set, card) {
  try {
    const res = await fetch(`${BASE}/v1/cards/${game}/${set}/${card}/trades?limit=20&scope=grade`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.trades || [];
  } catch (err) {
    throw new Error("Could not load trade history.");
  }
}

export async function getFmvSeries(game, set, card) {
  try {
    const res = await fetch(`${BASE}/v1/cards/${game}/${set}/${card}/fmv-series?window=30`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.points || [];
  } catch (err) {
    throw new Error("Could not load price series.");
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
