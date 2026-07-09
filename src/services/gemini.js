export async function analyzeCard({ cardDetail, trades, fmvSeries }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please set VITE_GEMINI_API_KEY in .env.");
  }

  const tradesSummary = (trades || []).slice(0, 15).map(t =>
    `${t.kind} | $${(t.priceUsdCents / 100).toFixed(0)} | ${t.displayName || 'Unknown'} | ${(t.observedAt || '').slice(0, 10)}`
  ).join('\n');

  const fmvSummary = (fmvSeries || []).slice(-14).map(p =>
    `${(p.t || '').slice(0, 10)}: $${(p.usdCents / 100).toFixed(0)} (${p.n} trades)`
  ).join('\n');

  const card = cardDetail.card || {};
  const currentPrice = card.priceUsdCents ? (card.priceUsdCents / 100).toFixed(2) : '0.00';
  const d7 = card.deltas?.d7 ?? 'N/A';
  const d30 = card.deltas?.d30 ?? 'N/A';
  const d365 = card.deltas?.d365 ?? 'N/A';
  const sourceCount = (cardDetail.sourceBreakdown || []).length;

  const promptText = `You are a collectible card market analyst for the Renaiss ecosystem.

Card: ${card.name || 'Unknown'} — ${card.gradeLabel || 'Raw'} — ${card.setName || 'Unknown'}
Game: ${card.game || 'Unknown'}
Current FMV: $${currentPrice}
7-day delta: ${d7}%
30-day delta: ${d30}%
365-day delta: ${d365}%
Confidence level: ${card.confidence || 'unknown'}
Total observations: ${cardDetail.observationCount || 0}
Data sources: ${sourceCount}

Recent trades (last 20):
${tradesSummary}

30-day FMV trend (daily averages in USD):
${fmvSummary}

Respond ONLY with this exact JSON (no markdown, no explanation). Ensure the insight string contains NO line breaks and NO double quotes:
{
  "trend": "Rising" | "Stable" | "Cooling",
  "fairValueLow": number (USD cents),
  "fairValueHigh": number (USD cents),
  "buyWindow": "Now" | "Wait" | "Pass",
  "rating": number (1-5),
  "insight": "2-3 sentence collector analysis (SINGLE LINE STRING, NO LINE BREAKS, NO DOUBLE QUOTES)"
}`;

  const body = {
    contents: [{ parts: [{ text: promptText }] }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2000
    }
  };

  const MAX_RETRIES = 3;
  let attempt = 0;
  
  while (attempt <= MAX_RETRIES) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        
        // If it's a 429 or Quota error, and we have retries left, wait and try again
        if ((res.status === 429 || errData.error?.message?.includes('Quota') || errData.error?.message?.includes('rate')) && attempt < MAX_RETRIES) {
          attempt++;
          const delayMs = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.warn(`Gemini API rate limited. Retrying in ${delayMs}ms... (Attempt ${attempt} of ${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }
        
        throw new Error(errData.error?.message || "Failed to fetch analysis from Gemini API");
      }

      const data = await res.json();
      let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      
      // Clean markdown wrappers if any
      rawText = rawText.replace(/```json|```/gi, '').trim();

      // Aggressively replace literal newlines with spaces to avoid 'unterminated string' errors 
      let parsed;
      try {
          parsed = JSON.parse(rawText);
      } catch (parseErr) {
          try {
              // Indestructible Regex Fallback: Manually extract fields from broken/cut-off JSON
              const trend = rawText.match(/"trend"\s*:\s*"([^"]+)"/i)?.[1] || "Stable";
              const fairValueLow = parseInt(rawText.match(/"fairValueLow"\s*:\s*(\d+)/i)?.[1] || "0", 10);
              const fairValueHigh = parseInt(rawText.match(/"fairValueHigh"\s*:\s*(\d+)/i)?.[1] || "0", 10);
              const buyWindow = rawText.match(/"buyWindow"\s*:\s*"([^"]+)"/i)?.[1] || "Wait";
              const rating = parseInt(rawText.match(/"rating"\s*:\s*(\d+)/i)?.[1] || "3", 10);
              
              let insight = "Data received but insight text was cut off.";
              const insightMatch = rawText.match(/"insight"\s*:\s*"([\s\S]*)/i);
              if (insightMatch) {
                  insight = insightMatch[1].replace(/["}\]]+$/, '').replace(/\n/g, ' ').trim();
              }

              parsed = { trend, fairValueLow, fairValueHigh, buyWindow, rating, insight };
              
              if (fairValueLow === 0 && fairValueHigh === 0) {
                 throw new Error("Could not salvage data");
              }
          } catch (fatalErr) {
              console.error("Gemini Raw Output:", rawText);
              throw new Error(`AI generated invalid syntax. Raw text: ${rawText.substring(0, 100)}...`);
          }
      }

      const requiredKeys = ['trend', 'fairValueLow', 'fairValueHigh', 'buyWindow', 'rating', 'insight'];
      for (const key of requiredKeys) {
        if (!(key in parsed)) {
          throw new Error(`Missing key in Gemini response: ${key}`);
        }
      }

      return parsed;
      
    } catch (err) {
      // If it's a network error and we have retries left, retry
      if (err.message === "Failed to fetch" && attempt < MAX_RETRIES) {
          attempt++;
          const delayMs = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
      }
      
      // If we've exhausted retries or hit a hard error, throw it
      if (attempt >= MAX_RETRIES || (!err.message?.includes('Failed to fetch') && !err.message?.includes('rate'))) {
          throw new Error(`AI Analysis failed: ${err.message}`);
      }
    }
  }
}
