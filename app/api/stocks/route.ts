import { NextResponse } from "next/server"
import type { StockData } from "@/lib/types"

// Top US stocks
const US_STOCKS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA",
  "META", "TSLA", "JPM", "V", "XOM",
  "WMT", "JNJ", "PG", "MA", "HD",
  "CVX", "BAC", "KO", "PFE", "DIS"
]

// Top TSX Canadian stocks  
const TSX_STOCKS = [
  "RY.TO", "TD.TO", "BNS.TO", "BMO.TO", "CM.TO",
  "ENB.TO", "CNR.TO", "CP.TO", "SU.TO", "CNQ.TO",
  "SHOP.TO", "BCE.TO", "T.TO", "ABX.TO", "MFC.TO"
]

// Stock metadata for context
const STOCK_META: Record<string, { name: string; sector: string; exchange: "NYSE" | "NASDAQ" | "TSX"; currency: "USD" | "CAD"; geopoliticalExposure: "high" | "medium" | "low"; affectedRegions: string[] }> = {
  // US Stocks
  AAPL: { name: "Apple Inc.", sector: "Technology", exchange: "NASDAQ", currency: "USD", geopoliticalExposure: "high", affectedRegions: ["China", "Taiwan"] },
  MSFT: { name: "Microsoft Corp.", sector: "Technology", exchange: "NASDAQ", currency: "USD", geopoliticalExposure: "medium", affectedRegions: ["China", "Europe"] },
  GOOGL: { name: "Alphabet Inc.", sector: "Technology", exchange: "NASDAQ", currency: "USD", geopoliticalExposure: "medium", affectedRegions: ["China", "Europe"] },
  AMZN: { name: "Amazon.com Inc.", sector: "Consumer Cyclical", exchange: "NASDAQ", currency: "USD", geopoliticalExposure: "medium", affectedRegions: ["Global Supply Chain"] },
  NVDA: { name: "NVIDIA Corp.", sector: "Technology", exchange: "NASDAQ", currency: "USD", geopoliticalExposure: "high", affectedRegions: ["China", "Taiwan"] },
  META: { name: "Meta Platforms", sector: "Technology", exchange: "NASDAQ", currency: "USD", geopoliticalExposure: "medium", affectedRegions: ["Europe", "Global"] },
  TSLA: { name: "Tesla Inc.", sector: "Automotive", exchange: "NASDAQ", currency: "USD", geopoliticalExposure: "high", affectedRegions: ["China", "Europe"] },
  JPM: { name: "JPMorgan Chase", sector: "Financial", exchange: "NYSE", currency: "USD", geopoliticalExposure: "medium", affectedRegions: ["Global Markets"] },
  V: { name: "Visa Inc.", sector: "Financial", exchange: "NYSE", currency: "USD", geopoliticalExposure: "medium", affectedRegions: ["Russia", "Global"] },
  XOM: { name: "Exxon Mobil", sector: "Energy", exchange: "NYSE", currency: "USD", geopoliticalExposure: "high", affectedRegions: ["Middle East", "Russia"] },
  WMT: { name: "Walmart Inc.", sector: "Consumer Defensive", exchange: "NYSE", currency: "USD", geopoliticalExposure: "medium", affectedRegions: ["China", "Mexico"] },
  JNJ: { name: "Johnson & Johnson", sector: "Healthcare", exchange: "NYSE", currency: "USD", geopoliticalExposure: "low", affectedRegions: ["Global"] },
  PG: { name: "Procter & Gamble", sector: "Consumer Defensive", exchange: "NYSE", currency: "USD", geopoliticalExposure: "low", affectedRegions: ["Global"] },
  MA: { name: "Mastercard Inc.", sector: "Financial", exchange: "NYSE", currency: "USD", geopoliticalExposure: "medium", affectedRegions: ["Russia", "Global"] },
  HD: { name: "Home Depot", sector: "Consumer Cyclical", exchange: "NYSE", currency: "USD", geopoliticalExposure: "low", affectedRegions: ["North America"] },
  CVX: { name: "Chevron Corp.", sector: "Energy", exchange: "NYSE", currency: "USD", geopoliticalExposure: "high", affectedRegions: ["Middle East", "Venezuela"] },
  BAC: { name: "Bank of America", sector: "Financial", exchange: "NYSE", currency: "USD", geopoliticalExposure: "medium", affectedRegions: ["Global Markets"] },
  KO: { name: "Coca-Cola Co.", sector: "Consumer Defensive", exchange: "NYSE", currency: "USD", geopoliticalExposure: "low", affectedRegions: ["Global"] },
  PFE: { name: "Pfizer Inc.", sector: "Healthcare", exchange: "NYSE", currency: "USD", geopoliticalExposure: "medium", affectedRegions: ["Global", "China"] },
  DIS: { name: "Walt Disney Co.", sector: "Communication", exchange: "NYSE", currency: "USD", geopoliticalExposure: "medium", affectedRegions: ["China", "Global"] },
  // TSX Canadian Stocks
  "RY.TO": { name: "Royal Bank of Canada", sector: "Financial", exchange: "TSX", currency: "CAD", geopoliticalExposure: "medium", affectedRegions: ["Canada", "US", "Global"] },
  "TD.TO": { name: "Toronto-Dominion Bank", sector: "Financial", exchange: "TSX", currency: "CAD", geopoliticalExposure: "medium", affectedRegions: ["Canada", "US"] },
  "BNS.TO": { name: "Bank of Nova Scotia", sector: "Financial", exchange: "TSX", currency: "CAD", geopoliticalExposure: "medium", affectedRegions: ["Canada", "Latin America"] },
  "BMO.TO": { name: "Bank of Montreal", sector: "Financial", exchange: "TSX", currency: "CAD", geopoliticalExposure: "medium", affectedRegions: ["Canada", "US"] },
  "CM.TO": { name: "CIBC", sector: "Financial", exchange: "TSX", currency: "CAD", geopoliticalExposure: "low", affectedRegions: ["Canada", "US"] },
  "ENB.TO": { name: "Enbridge Inc.", sector: "Energy", exchange: "TSX", currency: "CAD", geopoliticalExposure: "high", affectedRegions: ["Canada", "US", "OPEC"] },
  "CNR.TO": { name: "Canadian National Railway", sector: "Industrials", exchange: "TSX", currency: "CAD", geopoliticalExposure: "medium", affectedRegions: ["Canada", "US", "Trade Routes"] },
  "CP.TO": { name: "Canadian Pacific Kansas City", sector: "Industrials", exchange: "TSX", currency: "CAD", geopoliticalExposure: "medium", affectedRegions: ["North America", "Mexico"] },
  "SU.TO": { name: "Suncor Energy", sector: "Energy", exchange: "TSX", currency: "CAD", geopoliticalExposure: "high", affectedRegions: ["Canada", "OPEC", "Global Oil"] },
  "CNQ.TO": { name: "Canadian Natural Resources", sector: "Energy", exchange: "TSX", currency: "CAD", geopoliticalExposure: "high", affectedRegions: ["Canada", "Global Oil"] },
  "SHOP.TO": { name: "Shopify Inc.", sector: "Technology", exchange: "TSX", currency: "CAD", geopoliticalExposure: "low", affectedRegions: ["Global E-commerce"] },
  "BCE.TO": { name: "BCE Inc.", sector: "Telecom", exchange: "TSX", currency: "CAD", geopoliticalExposure: "low", affectedRegions: ["Canada"] },
  "T.TO": { name: "TELUS Corp.", sector: "Telecom", exchange: "TSX", currency: "CAD", geopoliticalExposure: "low", affectedRegions: ["Canada"] },
  "ABX.TO": { name: "Barrick Gold", sector: "Materials", exchange: "TSX", currency: "CAD", geopoliticalExposure: "high", affectedRegions: ["Africa", "South America", "Global Gold"] },
  "MFC.TO": { name: "Manulife Financial", sector: "Financial", exchange: "TSX", currency: "CAD", geopoliticalExposure: "medium", affectedRegions: ["Canada", "Asia", "US"] }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const market = searchParams.get("market") || "all" // "us", "tsx", or "all"
    
    let symbolsToFetch: string[] = []
    if (market === "us") {
      symbolsToFetch = US_STOCKS
    } else if (market === "tsx") {
      symbolsToFetch = TSX_STOCKS
    } else {
      symbolsToFetch = [...US_STOCKS, ...TSX_STOCKS]
    }
    
    const stocks: StockData[] = []
    
    // Fetch from Yahoo Finance quote API (free endpoint)
    const fetchPromises = symbolsToFetch.map(async (symbol) => {
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
            
            return {
              symbol: symbol.replace(".TO", ""),
              name: stockMeta?.name || symbol,
              price: currentPrice,
              change: Number(change.toFixed(2)),
              changePercent: Number(changePercent.toFixed(2)),
              volume: quote.volume?.[quote.volume.length - 1] || 0,
              marketCap: formatMarketCap(meta.marketCap || 0),
              sector: stockMeta?.sector || "Unknown",
              exchange: stockMeta?.exchange || "NYSE",
              currency: stockMeta?.currency || "USD",
              geopoliticalExposure: stockMeta?.geopoliticalExposure || "medium",
              affectedRegions: stockMeta?.affectedRegions || []
            } as StockData
          }
        }
        return null
      } catch {
        // If individual stock fails, return null
        return null
      }
    })
    
    const results = await Promise.all(fetchPromises)
    
    // Filter out nulls and add successful results
    results.forEach((result) => {
      if (result) stocks.push(result)
    })
    
    // Sort by market cap (largest first)
    stocks.sort((a, b) => {
      const aVal = parseMarketCap(a.marketCap)
      const bVal = parseMarketCap(b.marketCap)
      return bVal - aVal
    })
    
    return NextResponse.json({ 
      stocks, 
      lastUpdated: new Date().toISOString(),
      market,
      total: stocks.length
    })
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

function parseMarketCap(value: string): number {
  if (value === "N/A") return 0
  const num = parseFloat(value.replace(/[$,]/g, ""))
  if (value.includes("T")) return num * 1e12
  if (value.includes("B")) return num * 1e9
  if (value.includes("M")) return num * 1e6
  return num
}
