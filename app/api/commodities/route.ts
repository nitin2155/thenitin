import { NextResponse } from "next/server"

// Commodity symbols on Yahoo Finance
const COMMODITIES = {
  "GOLD": { symbol: "GC=F", name: "Gold", unit: "oz", category: "Precious Metals" },
  "SILVER": { symbol: "SI=F", name: "Silver", unit: "oz", category: "Precious Metals" },
  "CRUDE_OIL": { symbol: "CL=F", name: "Crude Oil (WTI)", unit: "barrel", category: "Energy" },
  "NATURAL_GAS": { symbol: "NG=F", name: "Natural Gas", unit: "MMBtu", category: "Energy" },
  "COPPER": { symbol: "HG=F", name: "Copper", unit: "lb", category: "Industrial Metals" },
  "PLATINUM": { symbol: "PL=F", name: "Platinum", unit: "oz", category: "Precious Metals" },
  "WHEAT": { symbol: "ZW=F", name: "Wheat", unit: "bushel", category: "Agriculture" },
  "CORN": { symbol: "ZC=F", name: "Corn", unit: "bushel", category: "Agriculture" },
}

// Energy ETFs for broader market view
const ENERGY_ETFS = {
  "XLE": { symbol: "XLE", name: "Energy Select Sector SPDR", category: "ETF" },
  "XOP": { symbol: "XOP", name: "Oil & Gas Exploration ETF", category: "ETF" },
  "UNG": { symbol: "UNG", name: "US Natural Gas Fund", category: "ETF" },
  "GLD": { symbol: "GLD", name: "SPDR Gold Trust", category: "ETF" },
  "SLV": { symbol: "SLV", name: "iShares Silver Trust", category: "ETF" },
}

export interface CommodityData {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  previousClose: number
  open: number
  dayHigh: number
  dayLow: number
  volume: number
  unit: string
  category: string
  lastUpdated: string
  // Historical data
  week52High?: number
  week52Low?: number
  ytdChange?: number
}

async function fetchYahooFinanceData(symbol: string): Promise<{
  price: number
  change: number
  changePercent: number
  previousClose: number
  open: number
  dayHigh: number
  dayLow: number
  volume: number
  week52High?: number
  week52Low?: number
} | null> {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 60 }
      }
    )
    
    if (!response.ok) return null
    
    const data = await response.json()
    const result = data.chart?.result?.[0]
    const meta = result?.meta
    const quote = result?.indicators?.quote?.[0]
    
    if (!meta) return null
    
    const currentPrice = meta.regularMarketPrice || 0
    const previousClose = meta.previousClose || meta.chartPreviousClose || currentPrice
    const change = currentPrice - previousClose
    const changePercent = previousClose ? (change / previousClose) * 100 : 0
    
    return {
      price: currentPrice,
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      previousClose,
      open: quote?.open?.[0] || currentPrice,
      dayHigh: quote?.high?.[0] || currentPrice,
      dayLow: quote?.low?.[0] || currentPrice,
      volume: quote?.volume?.[quote.volume.length - 1] || 0,
      week52High: meta.fiftyTwoWeekHigh,
      week52Low: meta.fiftyTwoWeekLow,
    }
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "all" // "commodities", "etfs", or "all"
    const id = searchParams.get("id") // specific commodity id
    
    const results: CommodityData[] = []
    
    // If specific ID requested
    if (id) {
      const commodity = COMMODITIES[id as keyof typeof COMMODITIES] || ENERGY_ETFS[id as keyof typeof ENERGY_ETFS]
      if (commodity) {
        const data = await fetchYahooFinanceData(commodity.symbol)
        if (data) {
          results.push({
            id,
            symbol: commodity.symbol,
            name: commodity.name,
            price: data.price,
            change: data.change,
            changePercent: data.changePercent,
            previousClose: data.previousClose,
            open: data.open,
            dayHigh: data.dayHigh,
            dayLow: data.dayLow,
            volume: data.volume,
            unit: "unit" in commodity ? commodity.unit : "shares",
            category: commodity.category,
            lastUpdated: new Date().toISOString(),
            week52High: data.week52High,
            week52Low: data.week52Low,
          })
        }
      }
      return NextResponse.json({ commodities: results, lastUpdated: new Date().toISOString() })
    }
    
    // Fetch all commodities
    const itemsToFetch: [string, { symbol: string; name: string; unit?: string; category: string }][] = []
    
    if (type === "commodities" || type === "all") {
      Object.entries(COMMODITIES).forEach(([key, value]) => {
        itemsToFetch.push([key, value])
      })
    }
    
    if (type === "etfs" || type === "all") {
      Object.entries(ENERGY_ETFS).forEach(([key, value]) => {
        itemsToFetch.push([key, { ...value, unit: "shares" }])
      })
    }
    
    // Fetch all in parallel
    const fetchPromises = itemsToFetch.map(async ([id, commodity]) => {
      const data = await fetchYahooFinanceData(commodity.symbol)
      if (data) {
        return {
          id,
          symbol: commodity.symbol,
          name: commodity.name,
          price: data.price,
          change: data.change,
          changePercent: data.changePercent,
          previousClose: data.previousClose,
          open: data.open,
          dayHigh: data.dayHigh,
          dayLow: data.dayLow,
          volume: data.volume,
          unit: commodity.unit || "shares",
          category: commodity.category,
          lastUpdated: new Date().toISOString(),
          week52High: data.week52High,
          week52Low: data.week52Low,
        } as CommodityData
      }
      return null
    })
    
    const fetchedResults = await Promise.all(fetchPromises)
    fetchedResults.forEach(result => {
      if (result) results.push(result)
    })
    
    return NextResponse.json({ 
      commodities: results, 
      lastUpdated: new Date().toISOString(),
      count: results.length
    })
  } catch (error) {
    console.error("Error fetching commodities:", error)
    return NextResponse.json({ error: "Failed to fetch commodity data" }, { status: 500 })
  }
}
