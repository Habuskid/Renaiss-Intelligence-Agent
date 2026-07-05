# Renaiss Agent ⚡️

![Renaiss Agent Header](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop)

**Renaiss Agent** is an AI-powered pricing intelligence terminal built for collectors of Real World Assets (RWAs) on the **BNB Chain**. 

Built for the **Renaiss Tech Hackathon S1**, this application leverages Google's Gemini `2.5-flash` model to analyze thousands of data points—including recent trades, 30-day fair market value series, and historical deltas—to instantly generate actionable buy windows, price confidence ratings, and collector insights. It replaces intuition with hard data for physical asset trading.

## 🚀 Features
- **AI Market Analysis:** Ingests raw physical asset attributes and generates structured logic using `gemini-2.5-flash`.
- **Renaiss API Integration:** Interfaces seamlessly with the Renaiss Index API to pull real-time historical trade ledgers and collector data on the BNB Chain.
- **Glassmorphism UI:** A premium, responsive interface featuring dynamic skeleton loaders, SVG smooth-bezier charts, and an animated mesh background.
- **Offline Fallback Resilience:** Built to gracefully inject high-fidelity mock data if the Renaiss testnet API is down for maintenance during judging.

## ⚙️ How to Run & Test (For Judges)

### Prerequisites
- Node.js (v18+ recommended)
- A valid Google Gemini API Key

### Setup Instructions
1. **Clone the repository** and navigate to the project folder:
   ```bash
   git clone <your-repo-link>
   cd renaiss-agent
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=gemini_api_key_here
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

### Testing the App
- Search for an asset or click on one of the **Trending Assets** on the homepage.
- Watch as the AI instantly analyzes the asset's data points and generates a Fair Value Range, Market Trend, and Collector Insight.

## ⛓️ Relation to Renaiss Protocol
Our project serves as the ultimate frontend analytical terminal for the Renaiss ecosystem. Instead of just displaying raw charts to users, we process Renaiss API data through an AI agent to extract definitive trading signals, providing immense value to the BNB Chain collector community by removing friction and uncertainty from RWA valuations.

## 🛠️ Tech Stack
- **Frontend:** React 19, Vite, TailwindCSS
- **AI:** Google Generative AI (`gemini-2.5-flash`)
- **Icons:** Heroicons

---
*Built for the Renaiss Tech Hackathon S1.*
