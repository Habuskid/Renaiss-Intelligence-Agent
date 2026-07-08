# Renaiss Intelligence Agent ⚡️

**Renaiss Intelligence Agent** is an AI-powered pricing intelligence terminal built for collectors of Real World Assets (RWAs) on the **BNB Chain**. 

Built for the **Renaiss Tech Hackathon S1**, this application serves as the ultimate frontend analytical terminal for the Renaiss ecosystem. It leverages Google's Gemini `2.5-flash` model to analyze thousands of data points from the **Renaiss OS Index API**—including recent trades, 30-day fair market value (FMV) series, and historical deltas—to instantly generate actionable buy windows, price confidence ratings, and collector insights. 

It replaces intuition with hard data for physical asset trading.

## 🧠 How the App Works
1. **Data Ingestion:** The app connects to the live Renaiss OS Index API. When a user queries an asset via the search bar, it securely fetches the exact `CardDetail`, `TradesResponse`, and `FmvSeriesResponse`.
2. **Intelligent Presentation:** The terminal maps the raw blockchain and indexing data into a stunning, responsive glassmorphism UI, plotting 30-day FMV trajectories alongside a ledger of recent verified transactions from global marketplaces.
3. **AI Evaluation:** Rather than running expensive AI models on every click, the terminal places the AI Analyst behind a manual "Generate Insight" trigger. When clicked, the raw JSON payload is fed into an intelligent Gemini Prompt Agent which processes market volatility, price discrepancies, and trade volume.
4. **Actionable Output:** Gemini returns a strictly structured JSON response containing definitive trading signals (Buy/Wait/Sell) which are injected directly into the UI panel.

## 🎯 How to Use It (For Judges)

### Live Demo (Recommended)
You can test the fully deployed application immediately at our live Vercel link. The live version is fully configured and ready for testing!

1. Go to the live demo link provided in our submission.
2. The homepage will display live "Featured Assets" pulled directly from the Renaiss protocol.
3. Use the search bar to look up specific character or card names (e.g., `"Luffy"`, `"Pikachu"`, `"Charizard"`) and select a result from the dropdown.

### Expected Results
When you select an asset, the terminal will populate with:
- **Card Statistics:** The asset's current grade, name, and variation.
- **Trade Ledger:** A history of recent transactions across marketplaces like eBay, Goldin, and SNKRDUNK.
- **FMV Chart:** A visual plot of the card's 30-day price trajectory.
- **AI Market Analysis (The Magic):** An illuminated panel on the right side will display a **Generate Insight** button. 
  - *Note on Rate Limits:* The Gemini AI runs on a Free Tier API limited to 15 requests per minute. We placed it behind a button so you can freely browse the app without accidentally exhausting the global quota!
  - Click the button to generate the `Fair Value Range`, `Buy Window`, `Conviction Rating`, and a detailed `Analyst Insight`.

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
