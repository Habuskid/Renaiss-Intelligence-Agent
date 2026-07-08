# Renaiss Agent ⚡️

**Renaiss Agent** is an AI-powered pricing intelligence terminal built for collectors of Real World Assets (RWAs) on the **BNB Chain**. 

Built for the **Renaiss Tech Hackathon S1**, this application serves as the ultimate frontend analytical terminal for the Renaiss ecosystem. It leverages Google's Gemini `2.5-flash` model to analyze thousands of data points from the **Renaiss OS Index API**—including recent trades, 30-day fair market value (FMV) series, and historical deltas—to instantly generate actionable buy windows, price confidence ratings, and collector insights. 

It replaces intuition with hard data for physical asset trading.

## 🧠 How the App Works
1. **Data Ingestion:** The app connects to the live Renaiss OS Index API. When a user queries an asset, it securely fetches the exact `CardDetail`, `TradesResponse`, and `FmvSeriesResponse`.
2. **Intelligent Routing:** The search bar supports standard keyword searches, but it also features a built-in ID extractor. You can paste an entire `renaiss.xyz/card/...` URL or a massive `renaiss_item_id` directly into the search bar, and the app will instantly bypass search indexing and route directly to the highly-specific ID endpoints.
3. **AI Evaluation:** Once the data is retrieved, the raw JSON payload is fed into an intelligent Gemini Prompt Agent. The AI processes the market volatility, price discrepancies, and trade volume.
4. **Actionable Output:** Gemini returns a strictly structured JSON response containing definitive trading signals (Buy/Wait/Sell) which are injected directly into a stunning Glassmorphism UI.

## 🎯 How to Use It (For Judges)

### Live Demo (Recommended)
You can test the fully deployed application immediately at our live Vercel link. The live version is already pre-configured with our team's Partner API Keys (10,000 requests/day limit) so you won't hit any rate limits!

1. Go to the live demo link provided in our submission.
2. Search for any popular asset in the search bar (e.g., `"Luffy"`, `"Pikachu"`, `"Black Lotus"`).
3. **Advanced Test:** Go to the main `renaiss.xyz` site, find any card, copy the URL from your address bar, and paste the entire URL directly into our Agent's search bar. It will instantly resolve the ID and pull the data!

### Expected Results
When you select an asset, you should expect the terminal to populate with:
- **Card Statistics:** The asset's current grade, name, and total observations.
- **Trade Ledger:** A history of recent transactions across marketplaces like eBay, Goldin, and SNKRDUNK.
- **FMV Chart:** A visual plot of the card's 30-day price trajectory.
- **AI Market Analysis (The Magic):** An illuminated panel on the right side will spin up and generate:
  - `Fair Value Range`: A calculated buffer of what you should pay.
  - `Buy Window`: A definitive **Now**, **Wait**, or **Sell** signal.
  - `Conviction Rating`: A 1-to-5 star rating based on data availability and volatility.
  - `Analyst Insight`: A detailed, human-readable paragraph explaining *why* the AI generated this rating based on the specific trades and FMV data it reviewed.

## ⚙️ Local Setup Instructions

If you wish to run the agent locally, you will need your own API keys.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Habuskid/-Renaiss-Agent.git
   cd renaiss-agent
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   # Your Google AI Studio Key (for the Gemini Agent)
   VITE_GEMINI_API_KEY=your_gemini_key_here
   
   # Your Renaiss OS Index Keys (Settings -> API access)
   VITE_RENAISS_API_KEY=your_renaiss_key_here
   VITE_RENAISS_API_SECRET=your_renaiss_secret_here
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

## 🛠️ Tech Stack
- **Frontend:** React 19, Vite, TailwindCSS (Vanilla CSS for aesthetic tokens)
- **AI Engine:** Google Generative AI (`gemini-2.5-flash`)
- **Data Layer:** Renaiss OS Index API (`api.renaissos.com`)

---
*Built for the Renaiss Tech Hackathon S1.*
