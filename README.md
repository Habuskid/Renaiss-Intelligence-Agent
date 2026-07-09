# Renaiss Intelligence Agent

Renaiss Intelligence Agent is a React-based web application that serves as an AI-driven terminal for analyzing physical collectibles and real-world assets on the BNB Chain. It fetches live market data and leverages Google's Gemini AI to provide actionable investment insights, liquidity scores, and fair market value assessments.

## Features

* Asset Search and Market Data: Fetches real-time market data, historical trades, and Fair Market Value (FMV) time-series data for physical collectibles.
* AI Market Analysis: Integrates the Google Gemini API to analyze historical liquidity and generate a structured JSON output detailing market trends, buy window recommendations, and collector insights.
* Rate Limit Resilience: Implements exponential backoff and 503 error handling to gracefully manage Gemini API rate limits and high demand spikes.
* Usage Quotas: Includes a local storage-based usage limiter that restricts users to 3 analyses per session, followed by a 30-minute cooldown.
* Interactive Visualization: Renders dynamic historical price charts using Recharts.
* Terminal Interface: Presents data through a sleek, premium dark-mode terminal UI with floating 3D CSS animations for featured assets.

## Tech Stack

* Framework: React 19 / Vite
* Styling: Tailwind CSS, Vanilla CSS (Custom Keyframes)
* Charts: Recharts
* Icons: Heroicons
* AI Provider: Google Gemini API (REST)
* Linting: Oxlint

## Getting Started

### Prerequisites

* Node.js (v18 or higher recommended)
* A valid Google Gemini API Key

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your API credentials:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_RENAISS_API_KEY=your_renaiss_api_key_here
   VITE_RENAISS_API_SECRET=your_renaiss_api_secret_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

* `src/components/`: Contains UI elements including LandingPage, TerminalPage, AiAnalysis, FmvChart, and FeaturedCards.
* `src/services/`: Contains API integration logic. The gemini.js file handles the generative AI prompts, structured JSON parsing, and retry logic.
* `src/utils/`: Contains formatting utilities for currency and dates.

## License

All rights reserved.
