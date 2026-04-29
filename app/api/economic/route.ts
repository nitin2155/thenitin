import { NextResponse } from "next/server"

interface EconomicData {
  country: "CA" | "US"
  centralBank: {
    name: string
    currentRate: number
    previousRate: number
    lastChange: string
    nextMeeting: string
    marketExpectation: "Hike" | "Hold" | "Cut"
    expectedRateEndOfYear: number
  }
  inflation: {
    current: number
    target: number
    trend: "rising" | "falling" | "stable"
    coreInflation: number
  }
  employment: {
    unemploymentRate: number
    jobsAdded: number
    participationRate: number
  }
  gdp: {
    growth: number
    forecast: number
    trend: "expanding" | "slowing" | "contracting"
  }
  currency: {
    symbol: string
    vsUSD: number
    change24h: number
  }
  sectorImpacts: Array<{
    sector: string
    impact: "+" | "-" | "neutral"
    reason: string
  }>
  ratePath: Array<{
    period: string
    rate: number
  }>
  lastUpdated: string
}

// Fetch real-time currency data
async function fetchCurrencyData(): Promise<{ cadUsd: number; change: number }> {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/CADUSD=X?interval=1d&range=2d`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 300 }
      }
    )
    if (response.ok) {
      const data = await response.json()
      const meta = data.chart?.result?.[0]?.meta
      const currentPrice = meta?.regularMarketPrice || 0.73
      const previousClose = meta?.previousClose || currentPrice
      return {
        cadUsd: currentPrice,
        change: ((currentPrice - previousClose) / previousClose) * 100
      }
    }
    return { cadUsd: 0.73, change: 0 }
  } catch {
    return { cadUsd: 0.73, change: 0 }
  }
}

// Fetch DXY (US Dollar Index) for USD strength
async function fetchDXY(): Promise<{ value: number; change: number }> {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/DX-Y.NYB?interval=1d&range=2d`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 300 }
      }
    )
    if (response.ok) {
      const data = await response.json()
      const meta = data.chart?.result?.[0]?.meta
      const currentPrice = meta?.regularMarketPrice || 104
      const previousClose = meta?.previousClose || currentPrice
      return {
        value: currentPrice,
        change: ((currentPrice - previousClose) / previousClose) * 100
      }
    }
    return { value: 104, change: 0 }
  } catch {
    return { value: 104, change: 0 }
  }
}

// Fetch gold price as inflation hedge indicator
async function fetchGoldPrice(): Promise<{ price: number; change: number }> {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1d&range=2d`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 300 }
      }
    )
    if (response.ok) {
      const data = await response.json()
      const meta = data.chart?.result?.[0]?.meta
      const currentPrice = meta?.regularMarketPrice || 3000
      const previousClose = meta?.previousClose || currentPrice
      return {
        price: currentPrice,
        change: ((currentPrice - previousClose) / previousClose) * 100
      }
    }
    return { price: 3000, change: 0 }
  } catch {
    return { price: 3000, change: 0 }
  }
}

// Fetch VIX for market volatility
async function fetchVIX(): Promise<{ value: number; change: number }> {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX?interval=1d&range=2d`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 300 }
      }
    )
    if (response.ok) {
      const data = await response.json()
      const meta = data.chart?.result?.[0]?.meta
      const currentPrice = meta?.regularMarketPrice || 18
      const previousClose = meta?.previousClose || currentPrice
      return {
        value: currentPrice,
        change: ((currentPrice - previousClose) / previousClose) * 100
      }
    }
    return { value: 18, change: 0 }
  } catch {
    return { value: 18, change: 0 }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const market = (searchParams.get("market") || "US") as "CA" | "US"
    
    // Fetch real-time market indicators
    const [cadUsd, dxy, gold, vix] = await Promise.all([
      fetchCurrencyData(),
      fetchDXY(),
      fetchGoldPrice(),
      fetchVIX()
    ])
    
    let economicData: EconomicData
    
    if (market === "CA") {
      economicData = {
        country: "CA",
        centralBank: {
          name: "Bank of Canada",
          currentRate: 3.25,
          previousRate: 3.75,
          lastChange: "Jan 2025",
          nextMeeting: "Jun 4, 2025",
          marketExpectation: "Hold",
          expectedRateEndOfYear: 2.75
        },
        inflation: {
          current: 2.9,
          target: 2.0,
          trend: "falling",
          coreInflation: 2.7
        },
        employment: {
          unemploymentRate: 6.7,
          jobsAdded: -33000,
          participationRate: 65.0
        },
        gdp: {
          growth: 1.5,
          forecast: 1.8,
          trend: "slowing"
        },
        currency: {
          symbol: "CAD",
          vsUSD: cadUsd.cadUsd,
          change24h: cadUsd.change
        },
        sectorImpacts: [
          { sector: "Real Estate", impact: "+", reason: "Rate cuts boost housing" },
          { sector: "Energy", impact: "-", reason: "Weak CAD hurts imports" },
          { sector: "Banks", impact: "neutral", reason: "NIM stabilizing" },
          { sector: "Export/Manufacturing", impact: "+", reason: "Weak CAD helps exports" }
        ],
        ratePath: [
          { period: "Now", rate: 3.25 },
          { period: "Q2 25", rate: 3.00 },
          { period: "Q3 25", rate: 2.75 },
          { period: "Q4 25", rate: 2.75 },
          { period: "Q1 26", rate: 2.50 },
          { period: "Q2 26", rate: 2.50 }
        ],
        lastUpdated: new Date().toISOString()
      }
    } else {
      economicData = {
        country: "US",
        centralBank: {
          name: "Federal Reserve",
          currentRate: 4.25,
          previousRate: 4.50,
          lastChange: "Dec 2024",
          nextMeeting: "May 7, 2025",
          marketExpectation: "Hold",
          expectedRateEndOfYear: 3.75
        },
        inflation: {
          current: 2.8,
          target: 2.0,
          trend: "stable",
          coreInflation: 3.0
        },
        employment: {
          unemploymentRate: 4.2,
          jobsAdded: 228000,
          participationRate: 62.5
        },
        gdp: {
          growth: 2.4,
          forecast: 2.1,
          trend: "expanding"
        },
        currency: {
          symbol: "USD",
          vsUSD: 1.0,
          change24h: dxy.change
        },
        sectorImpacts: [
          { sector: "Tech Stocks", impact: "+", reason: "Lower rates boost growth" },
          { sector: "USD Strength", impact: "-", reason: "Rate cuts weaken dollar" },
          { sector: "Gold", impact: "+", reason: "Dovish Fed bullish for gold" },
          { sector: "Bank Stocks", impact: "-", reason: "NIM compression risk" }
        ],
        ratePath: [
          { period: "Now", rate: 4.25 },
          { period: "Q2 25", rate: 4.25 },
          { period: "Q3 25", rate: 4.00 },
          { period: "Q4 25", rate: 3.75 },
          { period: "Q1 26", rate: 3.50 },
          { period: "Q2 26", rate: 3.50 }
        ],
        lastUpdated: new Date().toISOString()
      }
    }
    
    // Add market indicators
    const marketIndicators = {
      gold: {
        price: gold.price,
        change: gold.change,
        signal: gold.change > 0 ? "Risk-off / Inflation hedge active" : "Risk-on sentiment"
      },
      vix: {
        value: vix.value,
        change: vix.change,
        signal: vix.value > 20 ? "Elevated fear" : vix.value > 15 ? "Normal volatility" : "Complacency"
      },
      dollarIndex: {
        value: dxy.value,
        change: dxy.change
      }
    }
    
    return NextResponse.json({
      data: economicData,
      marketIndicators,
      source: "Central Bank Data + Yahoo Finance"
    })
  } catch (error) {
    console.error("Error fetching economic data:", error)
    return NextResponse.json({ error: "Failed to fetch economic data" }, { status: 500 })
  }
}
