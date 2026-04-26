import { NextResponse } from "next/server"
import type { GeopoliticalEvent } from "@/lib/types"

// Historical geopolitical events and their market impact
// This serves as an educational reference showing how past events affected markets
const HISTORICAL_EVENTS: GeopoliticalEvent[] = [
  {
    id: "russia-ukraine-2022",
    date: "2022-02-24",
    title: "Russia-Ukraine Conflict Begins",
    description: "Russia launches full-scale invasion of Ukraine, triggering global energy crisis and supply chain disruptions.",
    category: "conflict",
    severity: "critical",
    regions: ["Russia", "Ukraine", "Europe", "Global"],
    affectedAssets: {
      stocks: ["XOM", "CVX", "ENB.TO", "SU.TO", "CNQ.TO"],
      crypto: ["bitcoin", "ethereum"],
      commodities: ["Oil", "Natural Gas", "Wheat", "Fertilizers"]
    },
    historicalImpact: [
      { asset: "Brent Crude", change: 58.2, timeframe: "3 months" },
      { asset: "Natural Gas (EU)", change: 142.5, timeframe: "6 months" },
      { asset: "S&P 500", change: -12.8, timeframe: "1 month" },
      { asset: "TSX Energy", change: 28.4, timeframe: "3 months" }
    ],
    canadaImpact: "Canadian energy exports surged as Europe sought alternatives to Russian oil and gas. Enbridge and TC Energy saw increased pipeline utilization."
  },
  {
    id: "us-china-trade-war-2018",
    date: "2018-07-06",
    title: "US-China Trade War Escalation",
    description: "US implements 25% tariffs on $34 billion of Chinese goods, China retaliates. Tech and manufacturing sectors heavily impacted.",
    category: "trade",
    severity: "high",
    regions: ["United States", "China", "Asia Pacific"],
    affectedAssets: {
      stocks: ["AAPL", "NVDA", "TSLA", "AMZN"],
      crypto: ["bitcoin"],
      commodities: ["Soybeans", "Steel", "Aluminum"]
    },
    historicalImpact: [
      { asset: "Apple (AAPL)", change: -18.5, timeframe: "3 months" },
      { asset: "NVIDIA", change: -32.4, timeframe: "6 months" },
      { asset: "Chinese Yuan", change: -8.2, timeframe: "1 year" },
      { asset: "TSX Tech", change: -15.2, timeframe: "3 months" }
    ],
    canadaImpact: "Canadian manufacturers faced uncertainty. Aluminum and steel tariffs affected Canadian exports. CAD weakened against USD."
  },
  {
    id: "brexit-2016",
    date: "2016-06-23",
    title: "Brexit Referendum",
    description: "UK votes to leave European Union, causing immediate market shock and long-term trade uncertainty.",
    category: "diplomacy",
    severity: "high",
    regions: ["United Kingdom", "European Union", "Global"],
    affectedAssets: {
      stocks: ["JPM", "BAC", "V", "MA"],
      crypto: ["bitcoin"],
      commodities: ["Gold", "British Pound"]
    },
    historicalImpact: [
      { asset: "British Pound", change: -11.2, timeframe: "1 day" },
      { asset: "FTSE 100", change: -3.2, timeframe: "1 day" },
      { asset: "Gold", change: 8.5, timeframe: "1 week" },
      { asset: "S&P 500", change: -5.3, timeframe: "2 days" }
    ],
    canadaImpact: "Canada-UK trade negotiations accelerated. Financial services in Toronto saw increased interest from UK firms."
  },
  {
    id: "covid-pandemic-2020",
    date: "2020-03-11",
    title: "WHO Declares COVID-19 Pandemic",
    description: "Global pandemic triggers unprecedented economic shutdown, supply chain disruptions, and monetary policy response.",
    category: "economy",
    severity: "critical",
    regions: ["Global"],
    affectedAssets: {
      stocks: ["All Major Indices"],
      crypto: ["bitcoin", "ethereum"],
      commodities: ["Oil", "Gold", "Copper"]
    },
    historicalImpact: [
      { asset: "S&P 500", change: -34, timeframe: "1 month" },
      { asset: "TSX Composite", change: -37.2, timeframe: "1 month" },
      { asset: "Oil (WTI)", change: -65, timeframe: "1 month" },
      { asset: "Bitcoin", change: -50, timeframe: "2 weeks" }
    ],
    canadaImpact: "Bank of Canada slashed rates to 0.25%. CERB program launched. Real estate market initially frozen then surged."
  },
  {
    id: "opec-price-war-2020",
    date: "2020-03-08",
    title: "OPEC+ Price War",
    description: "Saudi Arabia and Russia fail to agree on production cuts, triggering oil price war during pandemic demand collapse.",
    category: "economy",
    severity: "high",
    regions: ["Saudi Arabia", "Russia", "OPEC Nations", "Canada"],
    affectedAssets: {
      stocks: ["XOM", "CVX", "SU.TO", "CNQ.TO", "ENB.TO"],
      crypto: [],
      commodities: ["Oil", "Natural Gas"]
    },
    historicalImpact: [
      { asset: "WTI Crude", change: -66, timeframe: "2 months" },
      { asset: "Suncor Energy", change: -58, timeframe: "1 month" },
      { asset: "Energy Select ETF", change: -52, timeframe: "1 month" }
    ],
    canadaImpact: "Alberta oil sands faced existential threat. Federal government provided emergency support. Canadian energy sector saw massive layoffs."
  },
  {
    id: "taiwan-tensions-2022",
    date: "2022-08-02",
    title: "Taiwan Strait Crisis",
    description: "US House Speaker Pelosi visits Taiwan, China responds with military exercises and economic pressure.",
    category: "conflict",
    severity: "high",
    regions: ["Taiwan", "China", "United States", "Asia Pacific"],
    affectedAssets: {
      stocks: ["NVDA", "AAPL", "TSM"],
      crypto: ["bitcoin"],
      commodities: ["Semiconductors"]
    },
    historicalImpact: [
      { asset: "Taiwan Semi", change: -8.5, timeframe: "1 week" },
      { asset: "NVIDIA", change: -12.3, timeframe: "2 weeks" },
      { asset: "Philadelphia Semi Index", change: -7.8, timeframe: "1 week" }
    ],
    canadaImpact: "Canadian tech sector with Taiwan supply chain exposure faced uncertainty. Defense sector stocks gained."
  },
  {
    id: "us-iran-tensions-2020",
    date: "2020-01-03",
    title: "US-Iran Escalation",
    description: "US drone strike kills Iranian General Soleimani. Iran retaliates with missile strikes on US bases.",
    category: "conflict",
    severity: "high",
    regions: ["Iran", "Iraq", "Middle East", "United States"],
    affectedAssets: {
      stocks: ["XOM", "CVX", "BA", "LMT"],
      crypto: ["bitcoin"],
      commodities: ["Oil", "Gold"]
    },
    historicalImpact: [
      { asset: "Brent Crude", change: 4.5, timeframe: "1 day" },
      { asset: "Gold", change: 2.3, timeframe: "1 week" },
      { asset: "Defense Stocks", change: 5.2, timeframe: "1 week" }
    ],
    canadaImpact: "Canadian oil producers benefited from price spike. Gold mining stocks in TSX rallied."
  },
  {
    id: "fed-rate-hikes-2022",
    date: "2022-03-16",
    title: "Federal Reserve Rate Hike Cycle Begins",
    description: "Fed raises rates for first time since 2018, beginning aggressive cycle to combat inflation. Eventually reaching 5.5%.",
    category: "economy",
    severity: "high",
    regions: ["United States", "Global"],
    affectedAssets: {
      stocks: ["All Growth Stocks", "Tech Sector", "Real Estate"],
      crypto: ["bitcoin", "ethereum"],
      commodities: ["US Dollar", "Bonds"]
    },
    historicalImpact: [
      { asset: "NASDAQ", change: -33, timeframe: "9 months" },
      { asset: "Bitcoin", change: -65, timeframe: "1 year" },
      { asset: "10-Year Treasury Yield", change: 180, timeframe: "1 year" },
      { asset: "USD Index", change: 18, timeframe: "6 months" }
    ],
    canadaImpact: "Bank of Canada followed with aggressive rate hikes. Canadian housing market cooled significantly. CAD weakened against USD."
  },
  {
    id: "svb-collapse-2023",
    date: "2023-03-10",
    title: "Silicon Valley Bank Collapse",
    description: "SVB fails in second-largest US bank failure, triggering contagion fears and regional banking crisis.",
    category: "economy",
    severity: "high",
    regions: ["United States", "Global Banking"],
    affectedAssets: {
      stocks: ["JPM", "BAC", "Regional Banks"],
      crypto: ["bitcoin", "ethereum", "usd-coin"],
      commodities: ["Gold", "Bonds"]
    },
    historicalImpact: [
      { asset: "Regional Bank ETF", change: -28, timeframe: "1 week" },
      { asset: "Bitcoin", change: 28, timeframe: "1 month" },
      { asset: "2-Year Treasury", change: -100, timeframe: "1 week" }
    ],
    canadaImpact: "Canadian banks remained stable due to stricter regulation. CDIC coverage discussions intensified."
  },
  {
    id: "us-canada-tariffs-2025",
    date: "2025-02-01",
    title: "US Tariffs on Canadian Goods",
    description: "US implements broad tariffs on Canadian imports citing trade imbalance. Canada retaliates with targeted measures.",
    category: "trade",
    severity: "critical",
    regions: ["United States", "Canada"],
    affectedAssets: {
      stocks: ["RY.TO", "TD.TO", "CNR.TO", "CP.TO", "SU.TO"],
      crypto: [],
      commodities: ["Lumber", "Aluminum", "Oil", "Agricultural Products"]
    },
    historicalImpact: [
      { asset: "CAD/USD", change: -8.5, timeframe: "1 month" },
      { asset: "TSX Composite", change: -12.3, timeframe: "2 months" },
      { asset: "Canadian Banks", change: -15.2, timeframe: "1 month" }
    ],
    canadaImpact: "Major impact on Canadian exporters. Railway stocks affected due to cross-border trade uncertainty. Energy sector faces pipeline approval challenges."
  }
]

// Current geopolitical risk factors
const CURRENT_RISKS = [
  {
    region: "China-Taiwan",
    riskLevel: "high" as const,
    assets: ["NVDA", "AAPL", "TSM", "Semiconductors"],
    description: "Ongoing tensions over Taiwan sovereignty"
  },
  {
    region: "Middle East",
    riskLevel: "high" as const,
    assets: ["Oil", "XOM", "CVX", "Defense"],
    description: "Regional conflicts affecting oil supply"
  },
  {
    region: "US-Canada Trade",
    riskLevel: "medium" as const,
    assets: ["CNR.TO", "CP.TO", "Lumber", "Auto"],
    description: "Trade policy uncertainty under current administration"
  },
  {
    region: "Europe Energy",
    riskLevel: "medium" as const,
    assets: ["Natural Gas", "ENB.TO", "European Stocks"],
    description: "Energy security and Russian sanctions"
  },
  {
    region: "Global Inflation",
    riskLevel: "medium" as const,
    assets: ["Bonds", "Real Estate", "Growth Stocks"],
    description: "Central bank policy divergence"
  }
]

export async function GET() {
  try {
    // Sort events by date (most recent first)
    const sortedEvents = [...HISTORICAL_EVENTS].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    return NextResponse.json({
      historicalEvents: sortedEvents,
      currentRisks: CURRENT_RISKS,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error("Error fetching geopolitical data:", error)
    return NextResponse.json(
      { error: "Failed to fetch geopolitical data" },
      { status: 500 }
    )
  }
}
