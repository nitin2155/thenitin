import { NextResponse } from "next/server"

// Commodity symbols on Yahoo Finance
const SYMBOLS: Record<string, string> = {
  "GOLD": "GC=F",
  "SILVER": "SI=F", 
  "CRUDE_OIL": "CL=F",
  "NATURAL_GAS": "NG=F",
  "COPPER": "HG=F",
  "PLATINUM": "PL=F",
  "WHEAT": "ZW=F",
  "CORN": "ZC=F",
  "XLE": "XLE",
  "XOP": "XOP",
  "UNG": "UNG",
  "GLD": "GLD",
  "SLV": "SLV",
}

export interface HistoricalDataPoint {
  date: string
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const range = searchParams.get("range") || "1y" // 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, max
    const interval = searchParams.get("interval") || "1d" // 1m, 5m, 15m, 1h, 1d, 1wk, 1mo
    
    if (!id || !SYMBOLS[id]) {
      return NextResponse.json({ error: "Invalid commodity ID" }, { status: 400 })
    }
    
    const symbol = SYMBOLS[id]
    
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    )
    
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
    }
    
    const data = await response.json()
    const result = data.chart?.result?.[0]
    
    if (!result) {
      return NextResponse.json({ error: "No data available" }, { status: 404 })
    }
    
    const timestamps = result.timestamp || []
    const quotes = result.indicators?.quote?.[0] || {}
    
    const history: HistoricalDataPoint[] = timestamps.map((ts: number, i: number) => ({
      date: new Date(ts * 1000).toISOString().split('T')[0],
      timestamp: ts * 1000,
      open: quotes.open?.[i] || 0,
      high: quotes.high?.[i] || 0,
      low: quotes.low?.[i] || 0,
      close: quotes.close?.[i] || 0,
      volume: quotes.volume?.[i] || 0,
    })).filter((point: HistoricalDataPoint) => point.close > 0)
    
    // Calculate some statistics
    const prices = history.map(h => h.close)
    const firstPrice = prices[0] || 0
    const lastPrice = prices[prices.length - 1] || 0
    const highestPrice = Math.max(...prices)
    const lowestPrice = Math.min(...prices)
    const totalChange = lastPrice - firstPrice
    const totalChangePercent = firstPrice ? (totalChange / firstPrice) * 100 : 0
    
    return NextResponse.json({
      id,
      symbol,
      range,
      interval,
      history,
      statistics: {
        startPrice: Number(firstPrice.toFixed(2)),
        endPrice: Number(lastPrice.toFixed(2)),
        highestPrice: Number(highestPrice.toFixed(2)),
        lowestPrice: Number(lowestPrice.toFixed(2)),
        totalChange: Number(totalChange.toFixed(2)),
        totalChangePercent: Number(totalChangePercent.toFixed(2)),
        dataPoints: history.length,
      },
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error("Error fetching historical data:", error)
    return NextResponse.json({ error: "Failed to fetch historical data" }, { status: 500 })
  }
}
