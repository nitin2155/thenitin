import { NextResponse } from "next/server"

// Top 20 stocks to track - major US stocks affected by geopolitics
const TOP_STOCKS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA",
  "META", "TSLA", "JPM", "V", "XOM",
  "WMT", "JNJ", "PG", "MA", "HD",
  "CVX", "BAC", "KO", "PFE", "DIS"
]

interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: string
  sector: string
  geopoliticalExposure: "high" | "medium" | "low"
  affectedRegions: string[]
}

// Stock metadata for context
const STOCK_META: Record<string, { name: string; sector: string; geopoliticalExposure: "high" | "medium" | "low"; affectedRegions: string[] }> = {
  AAPL: { name: "Apple Inc.", sector: "Technology", geopoliticalExposure: "high", affectedRegions: ["China", "Taiwan"] },
  MSFT: { name: "Microsoft Corp.", sector: "Technology", geopoliticalExposure: "medium", affectedRegions: ["China", "Europe"] },
  GOOGL: { name: "Alphabet Inc.", sector: "Technology", geopoliticalExposure: "medium", affectedRegions: ["China", "Europe"] },
  AMZN: { name: "Amazon.com Inc.", sector: "Consumer Cyclical", geopoliticalExposure: "medium", affectedRegions: ["Global Supply Chain"] },
  NVDA: { name: "NVIDIA Corp.", sector: "Technology", geopoliticalExposure: "high", affectedRegions: ["China", "Taiwan"] },
  META: { name: "Meta Platforms", sector: "Technology", geopoliticalExposure: "medium", affectedRegions: ["Europe", "Global"] },
  TSLA: { name: "Tesla Inc.", sector: "Automotive", geopoliticalExposure: "high", affectedRegions: ["China", "Europe"] },
  JPM: { name: "JPMorgan Chase", sector: "Financial", geopoliticalExposure: "medium", affectedRegions: ["Global Markets"] },
  V: { name: "Visa Inc.", sector: "Financial", geopoliticalExposure: "medium", affectedRegions: ["Russia", "Global"] },
  XOM: { name: "Exxon Mobil", sector: "Energy", geopoliticalExposure: "high", affectedRegions: ["Middle East", "Russia"] },
  WMT: { name: "Walmart Inc.", sector: "Consumer Defensive", geopoliticalExposure: "medium", affectedRegions: ["China", "Mexico"] },
  JNJ: { name: "Johnson & Johnson", sector: "Healthcare", geopoliticalExposure: "low", affectedRegions: ["Global"] },
  PG: { name: "Procter & Gamble", sector: "Consumer Defensive", geopoliticalExposure: "low", affectedRegions: ["Global"] },
  MA: { name: "Mastercard Inc.", sector: "Financial", geopoliticalExposure: "medium", affectedRegions: ["Russia", "Global"] },
  HD: { name: "Home Depot", sector: "Consumer Cyclical", geopoliticalExposure: "low", affectedRegions: ["North America"] },
  CVX: { name: "Chevron Corp.", sector: "Energy", geopoliticalExposure: "high", affectedRegions: ["Middle East", "Venezuela"] },
  BAC: { name: "Bank of America", sector: "Financial", geopoliticalExposure: "medium", affectedRegions: ["Global Markets"] },
  KO: { name: "Coca-Cola Co.", sector: "Consumer Defensive", geopoliticalExposure: "low", affectedRegions: ["Global"] },
  PFE: { name: "Pfizer Inc.", sector: "Healthcare", geopoliticalExposure: "medium", affectedRegions: ["Global", "China"] },
  DIS: { name: "Walt Disney Co.", sector: "Communication", geopoliticalExposure: "medium", affectedRegions: ["China", "Global"] }
}

export async function GET() {
  try {
    // Using Yahoo Finance API (free, no key required) via RapidAPI proxy
    // Alternative: Using Alpha Vantage demo or Finnhub for real data
    // For demo purposes, we'll use a free API that provides real stock data
    
    const stocks: StockData[] = []
    
    // Fetch from Yahoo Finance quote API (free endpoint)
    for (const symbol of TOP_STOCKS) {
      try {
        const response = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
          {
            headers: {
              "User-Agent": "Mozilla/5.0",
            },
            next: { revalidate: 60 } // Cache for 60 seconds
          }
        )
        
        if (response.ok) {
          const data = await response.json()
          const result = data.chart?.result?.[0]
          const meta = result?.meta
          const quote = result?.indicators?.quote?.[0]
          
          if (meta && quote) {
            const currentPrice = meta.regularMarketPrice || 0
            const previousClose = meta.previousClose || meta.chartPreviousClose || currentPrice
            const change = currentPrice - previousClose
            const changePercent = previousClose ? (change / previousClose) * 100 : 0
            
            const stockMeta = STOCK_META[symbol]
            
            stocks.push({
              symbol,
              name: stockMeta?.name || symbol,
              price: currentPrice,
              change: Number(change.toFixed(2)),
              changePercent: Number(changePercent.toFixed(2)),
              volume: quote.volume?.[quote.volume.length - 1] || 0,
              marketCap: formatMarketCap(meta.marketCap || 0),
              sector: stockMeta?.sector || "Unknown",
              geopoliticalExposure: stockMeta?.geopoliticalExposure || "medium",
              affectedRegions: stockMeta?.affectedRegions || []
            })
          }
        }
      } catch {
        // If individual stock fails, add with fallback data
        const stockMeta = STOCK_META[symbol]
        stocks.push({
          symbol,
          name: stockMeta?.name || symbol,
          price: 0,
          change: 0,
          changePercent: 0,
          volume: 0,
          marketCap: "N/A",
          sector: stockMeta?.sector || "Unknown",
          geopoliticalExposure: stockMeta?.geopoliticalExposure || "medium",
          affectedRegions: stockMeta?.affectedRegions || []
        })
      }
    }
    
    return NextResponse.json({ stocks, lastUpdated: new Date().toISOString() })
  } catch (error) {
    console.error("Error fetching stocks:", error)
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 })
  }
}

function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  return `$${value.toLocaleString()}`
}
