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
      maxOutputTokens: 2000,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          trend: { type: "STRING" },
          fairValueLow: { type: "NUMBER" },
          fairValueHigh: { type: "NUMBER" },
          buyWindow: { type: "STRING" },
          rating: { type: "NUMBER" },
          insight: { type: "STRING" }
        },
        required: ["trend", "fairValueLow", "fairValueHigh", "buyWindow", "rating", "insight"]
      }
    }
  };

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || "Failed to fetch analysis from Gemini API");
    }

    const data = await res.json();
    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    // Clean markdown wrappers if any
    rawText = rawText.replace(/```json|```/gi, '').trim();

    // Aggressively replace literal newlines with spaces to avoid 'unterminated string' errors 
    // when Gemini accidentally outputs actual line breaks inside the insight string
    let parsed;
    try {
        parsed = JSON.parse(rawText);
    } catch (parseErr) {
        try {
            // Fallback: strip literal newlines that break JSON.parse
            const safeText = rawText.replace(/\n/g, ' ').replace(/\r/g, ' ');
            parsed = JSON.parse(safeText);
        } catch (fallbackErr) {
            console.error("Gemini Raw Output:", rawText);
            throw new Error(`JSON parsing failed. Raw output was: ${rawText.substring(0, 100)}...`);
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
    throw new Error(`AI Analysis failed: ${err.message}`);
  }
}
