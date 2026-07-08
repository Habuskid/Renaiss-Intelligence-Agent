const BASE = 'https://api.renaissos.com';

function getAuthHeaders() {
  const key = import.meta.env.VITE_RENAISS_API_KEY;
  const secret = import.meta.env.VITE_RENAISS_API_SECRET;
  const headers = {};
  if (key && secret) {
    headers['X-Api-Key'] = key;
    headers['X-Api-Secret'] = secret;
  }
  return headers;
}

export async function searchCards(query) {
  try {
    const res = await fetch(`${BASE}/v1/search?q=${encodeURIComponent(query)}&limit=8`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    return [];
  }
}

export async function getCardDetail(game, set, card) {
  try {
    let url = `${BASE}/v1/cards/${game}/${set}/${card}`;
    if (!set && !card) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(game);
      url = isUuid ? `${BASE}/v1/cards/by-id/${game}` : `${BASE}/v1/cards/by-renaiss-id/${game}`;
    }
    const res = await fetch(url, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function getCardTrades(game, set, card) {
  try {
    let url = `${BASE}/v1/cards/${game}/${set}/${card}/trades?limit=20&scope=grade`;
    if (!set && !card) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(game);
      url = isUuid ? `${BASE}/v1/cards/by-id/${game}/trades?limit=20&scope=grade` : `${BASE}/v1/cards/by-renaiss-id/${game}/trades?limit=20&scope=grade`;
    }
    const res = await fetch(url, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.trades || [];
  } catch (err) {
    return [];
  }
}

export async function getFmvSeries(game, set, card) {
  try {
    let url = `${BASE}/v1/cards/${game}/${set}/${card}/fmv-series?window=30`;
    if (!set && !card) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(game);
      url = isUuid ? `${BASE}/v1/cards/by-id/${game}/fmv-series?window=30` : `${BASE}/v1/cards/by-renaiss-id/${game}/fmv-series?window=30`;
    }
    const res = await fetch(url, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.points || [];
  } catch (err) {
    return [];
  }
}

export async function getFeaturedCards() {
  try {
    const res = await fetch(`${BASE}/v1/cards/featured?limit=6`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (data.cards && data.cards.length > 0) return data.cards;
    throw new Error("Empty");
  } catch (err) {
    return [];
  }
}
