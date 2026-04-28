// Prediction Market Style Scenarios
// "What if X happens?" with probability signals and sentiment tracking

export interface MarketScenario {
  id: string
  question: string // The "What if" question
  shortTitle: string
  category: "geopolitics" | "trade" | "monetary" | "energy" | "housing" | "markets"
  status: "active" | "resolved" | "expired"
  
  // Probability and sentiment
  probability: number // 0-100 current probability estimate
  probabilityChange24h: number // Change in last 24h
  sentiment: "bullish" | "bearish" | "neutral"
  sentimentScore: number // -100 to 100
  
  // Volume and engagement
  volume24h: number // Simulated trading volume
  totalVolume: number
  participants: number
  
  // Timeline
  createdAt: string
  resolutionDate?: string
  lastUpdated: string
  
  // Context
  description: string
  keyFactors: string[]
  
  // Impact projections if scenario occurs
  projectedImpacts: {
    asset: string
    assetType: "stock" | "commodity" | "currency" | "index" | "housing"
    currentPrice: number
    projectedChange: number // percentage
    confidence: "high" | "medium" | "low"
    rationale: string
  }[]
  
  // Historical precedent
  historicalPrecedent?: {
    event: string
    date: string
    outcome: string
    marketImpact: string
  }[]
  
  // Related scenarios
  relatedScenarioIds?: string[]
  
  // Educational insight (neutral, not directive)
  insight: string
}

export const MARKET_SCENARIOS: MarketScenario[] = [
  // GEOPOLITICAL SCENARIOS
  {
    id: "us-canada-tariffs-25",
    question: "Will the US impose 25% tariffs on Canadian goods by Q2 2025?",
    shortTitle: "US-Canada 25% Tariffs",
    category: "trade",
    status: "active",
    probability: 68,
    probabilityChange24h: 3.5,
    sentiment: "bearish",
    sentimentScore: -42,
    volume24h: 2_450_000,
    totalVolume: 89_000_000,
    participants: 12_450,
    createdAt: "2024-11-10",
    resolutionDate: "2025-06-30",
    lastUpdated: new Date().toISOString(),
    description: "Assessing the likelihood of broad 25% tariffs on Canadian exports to the US, including auto, energy, and agricultural products.",
    keyFactors: [
      "Trump administration trade policy signals",
      "USMCA renegotiation timeline",
      "Canada's retaliatory stance",
      "Auto sector lobbying intensity",
      "Congressional support level"
    ],
    projectedImpacts: [
      {
        asset: "CAD/USD",
        assetType: "currency",
        currentPrice: 0.72,
        projectedChange: -8.5,
        confidence: "high",
        rationale: "Trade disruption typically weakens export-dependent currencies"
      },
      {
        asset: "TSX Composite",
        assetType: "index",
        currentPrice: 24500,
        projectedChange: -12,
        confidence: "medium",
        rationale: "Export-heavy TSX would face significant headwinds"
      },
      {
        asset: "Canadian Auto Stocks",
        assetType: "stock",
        currentPrice: 100,
        projectedChange: -25,
        confidence: "high",
        rationale: "Auto sector most exposed with 75% of production exported to US"
      },
      {
        asset: "Gold (CAD)",
        assetType: "commodity",
        currentPrice: 3800,
        projectedChange: 15,
        confidence: "medium",
        rationale: "Safe-haven demand plus CAD weakness boosts CAD-denominated gold"
      },
      {
        asset: "Canadian Housing",
        assetType: "housing",
        currentPrice: 750000,
        projectedChange: -8,
        confidence: "medium",
        rationale: "Economic uncertainty and job losses could pressure housing"
      }
    ],
    historicalPrecedent: [
      {
        event: "2018 Steel/Aluminum Tariffs",
        date: "2018-06-01",
        outcome: "Tariffs imposed, later negotiated down via USMCA",
        marketImpact: "CAD fell 5%, TSX materials sector dropped 12%"
      },
      {
        event: "Softwood Lumber Dispute",
        date: "2017-04-24",
        outcome: "20% duties imposed on Canadian lumber",
        marketImpact: "Canadian forestry stocks fell 15%, US home prices rose 3%"
      }
    ],
    relatedScenarioIds: ["boc-rate-cuts", "cad-parity-risk"],
    insight: "Trade disputes between closely integrated economies historically create short-term volatility but often resolve through negotiation. The auto sector's cross-border supply chains make complete decoupling economically painful for both sides."
  },
  
  {
    id: "boc-rate-cuts",
    question: "Will the Bank of Canada cut rates below 2.5% by end of 2025?",
    shortTitle: "BoC Below 2.5%",
    category: "monetary",
    status: "active",
    probability: 72,
    probabilityChange24h: -2.1,
    sentiment: "bullish",
    sentimentScore: 35,
    volume24h: 1_850_000,
    totalVolume: 67_000_000,
    participants: 8_920,
    createdAt: "2024-12-01",
    resolutionDate: "2025-12-31",
    lastUpdated: new Date().toISOString(),
    description: "Probability of BoC cutting the overnight rate to 2.5% or below to stimulate the economy amid tariff concerns.",
    keyFactors: [
      "Inflation trajectory (currently 2.7%)",
      "Employment trends",
      "Housing market stability",
      "CAD/USD exchange rate",
      "Fed policy divergence"
    ],
    projectedImpacts: [
      {
        asset: "Canadian Housing",
        assetType: "housing",
        currentPrice: 750000,
        projectedChange: 12,
        confidence: "high",
        rationale: "Lower rates historically boost housing demand and prices"
      },
      {
        asset: "CAD/USD",
        assetType: "currency",
        currentPrice: 0.72,
        projectedChange: -5,
        confidence: "high",
        rationale: "Rate cuts widen US-Canada rate differential, weakening CAD"
      },
      {
        asset: "TSX Financials",
        assetType: "stock",
        currentPrice: 100,
        projectedChange: -8,
        confidence: "medium",
        rationale: "Bank margins compress with lower rates"
      },
      {
        asset: "TSX REITs",
        assetType: "stock",
        currentPrice: 100,
        projectedChange: 18,
        confidence: "high",
        rationale: "REITs benefit from lower borrowing costs and yield seeking"
      }
    ],
    historicalPrecedent: [
      {
        event: "2020 COVID Rate Cuts",
        date: "2020-03-27",
        outcome: "BoC cut to 0.25%, held for 2 years",
        marketImpact: "Housing prices rose 30%+, REITs recovered strongly"
      },
      {
        event: "2015 Oil Crash Cuts",
        date: "2015-01-21",
        outcome: "Surprise cut from 1% to 0.75%",
        marketImpact: "CAD fell 8%, housing in non-Alberta regions accelerated"
      }
    ],
    relatedScenarioIds: ["us-canada-tariffs-25", "housing-correction"],
    insight: "Central bank divergence from the Fed creates currency pressure but may be necessary if tariffs materially impact Canadian employment. The housing market's sensitivity to rates makes this a double-edged sword for policymakers."
  },
  
  {
    id: "oil-above-100",
    question: "Will crude oil trade above $100/barrel in the next 6 months?",
    shortTitle: "Oil Above $100",
    category: "energy",
    status: "active",
    probability: 28,
    probabilityChange24h: 5.2,
    sentiment: "neutral",
    sentimentScore: 8,
    volume24h: 3_200_000,
    totalVolume: 124_000_000,
    participants: 18_750,
    createdAt: "2024-10-15",
    resolutionDate: "2025-04-15",
    lastUpdated: new Date().toISOString(),
    description: "Assessing the probability of WTI crude oil reaching $100/barrel amid Middle East tensions and OPEC+ production decisions.",
    keyFactors: [
      "Middle East conflict escalation",
      "OPEC+ production cuts",
      "US shale production response",
      "China demand recovery",
      "Strategic reserve levels"
    ],
    projectedImpacts: [
      {
        asset: "TSX Energy Sector",
        assetType: "stock",
        currentPrice: 100,
        projectedChange: 35,
        confidence: "high",
        rationale: "Canadian energy producers highly leveraged to oil prices"
      },
      {
        asset: "CAD/USD",
        assetType: "currency",
        currentPrice: 0.72,
        projectedChange: 6,
        confidence: "high",
        rationale: "Petro-currency benefits from higher oil prices"
      },
      {
        asset: "Gold",
        assetType: "commodity",
        currentPrice: 2650,
        projectedChange: 8,
        confidence: "medium",
        rationale: "Geopolitical premium and inflation hedge demand"
      },
      {
        asset: "Airline Stocks",
        assetType: "stock",
        currentPrice: 100,
        projectedChange: -20,
        confidence: "high",
        rationale: "Fuel is 25-30% of airline costs"
      }
    ],
    historicalPrecedent: [
      {
        event: "2022 Russia-Ukraine War",
        date: "2022-03-08",
        outcome: "Oil spiked to $130 briefly",
        marketImpact: "TSX Energy +55% YTD, CAD strengthened 4%"
      },
      {
        event: "2008 Oil Spike",
        date: "2008-07-11",
        outcome: "Oil hit $147, then crashed to $32",
        marketImpact: "Preceded recession, energy stocks gave back all gains"
      }
    ],
    insight: "Oil spikes are often self-limiting - high prices incentivize production increases and demand destruction. However, the path to $100 matters: geopolitical supply disruption has different implications than demand-driven rallies."
  },
  
  {
    id: "housing-correction",
    question: "Will Canadian housing prices fall another 10% from current levels?",
    shortTitle: "Housing -10% More",
    category: "housing",
    status: "active",
    probability: 35,
    probabilityChange24h: -1.8,
    sentiment: "bearish",
    sentimentScore: -28,
    volume24h: 1_650_000,
    totalVolume: 52_000_000,
    participants: 9_340,
    createdAt: "2024-11-20",
    resolutionDate: "2025-11-20",
    lastUpdated: new Date().toISOString(),
    description: "Probability of national average home prices declining another 10% from current levels, beyond the 15% correction already seen.",
    keyFactors: [
      "Mortgage renewal cliff (2025-2026)",
      "Immigration policy changes",
      "Interest rate trajectory",
      "Unemployment trends",
      "Inventory levels"
    ],
    projectedImpacts: [
      {
        asset: "Canadian Bank Stocks",
        assetType: "stock",
        currentPrice: 100,
        projectedChange: -18,
        confidence: "high",
        rationale: "Mortgage books would face increased defaults and provisions"
      },
      {
        asset: "Construction Stocks",
        assetType: "stock",
        currentPrice: 100,
        projectedChange: -25,
        confidence: "high",
        rationale: "New construction would slow dramatically"
      },
      {
        asset: "Consumer Discretionary",
        assetType: "stock",
        currentPrice: 100,
        projectedChange: -15,
        confidence: "medium",
        rationale: "Wealth effect contraction reduces spending"
      },
      {
        asset: "Rental REITs",
        assetType: "stock",
        currentPrice: 100,
        projectedChange: 8,
        confidence: "medium",
        rationale: "More people rent when buying becomes less attractive"
      }
    ],
    historicalPrecedent: [
      {
        event: "1990 Toronto Housing Crash",
        date: "1990-01-01",
        outcome: "Prices fell 40% over 7 years",
        marketImpact: "Banks took major provisions, recovery took until 2002"
      },
      {
        event: "2008 US Housing Crisis",
        date: "2008-01-01",
        outcome: "US prices fell 33% nationally",
        marketImpact: "Canada only saw 8% dip due to stricter lending standards"
      }
    ],
    insight: "Canadian housing is unique due to government-backed mortgage insurance (CMHC), limiting bank losses. However, household debt-to-income is highest in G7, making the system vulnerable to employment shocks."
  },
  
  {
    id: "china-taiwan-tensions",
    question: "Will China impose a Taiwan blockade or military action by 2026?",
    shortTitle: "Taiwan Escalation",
    category: "geopolitics",
    status: "active",
    probability: 15,
    probabilityChange24h: 0.8,
    sentiment: "bearish",
    sentimentScore: -65,
    volume24h: 4_500_000,
    totalVolume: 210_000_000,
    participants: 34_200,
    createdAt: "2024-09-01",
    resolutionDate: "2026-12-31",
    lastUpdated: new Date().toISOString(),
    description: "Probability of major China-Taiwan escalation including blockade, military exercises, or direct action affecting global markets.",
    keyFactors: [
      "US-China relations trajectory",
      "Taiwan election outcomes",
      "CHIPS Act implementation",
      "Chinese economic conditions",
      "US military posture in Pacific"
    ],
    projectedImpacts: [
      {
        asset: "Semiconductor Stocks",
        assetType: "stock",
        currentPrice: 100,
        projectedChange: -45,
        confidence: "high",
        rationale: "Taiwan produces 90% of advanced chips - catastrophic supply disruption"
      },
      {
        asset: "Gold",
        assetType: "commodity",
        currentPrice: 2650,
        projectedChange: 30,
        confidence: "high",
        rationale: "Ultimate safe-haven event, unprecedented since WWII"
      },
      {
        asset: "Oil",
        assetType: "commodity",
        currentPrice: 75,
        projectedChange: 80,
        confidence: "high",
        rationale: "Shipping disruption through South China Sea"
      },
      {
        asset: "US Treasuries",
        assetType: "index",
        currentPrice: 100,
        projectedChange: 15,
        confidence: "high",
        rationale: "Flight to safety despite potential Chinese selling"
      }
    ],
    historicalPrecedent: [
      {
        event: "1996 Taiwan Strait Crisis",
        date: "1996-03-08",
        outcome: "China missile tests, US carrier groups deployed",
        marketImpact: "Asian markets fell 8-15%, resolved without conflict"
      },
      {
        event: "Russia-Ukraine Invasion",
        date: "2022-02-24",
        outcome: "Full-scale invasion despite predictions otherwise",
        marketImpact: "Global markets -10%, commodities spiked 30-80%"
      }
    ],
    insight: "Low probability but extremely high impact scenario. Markets consistently underpriced tail risks before Russia-Ukraine. Semiconductor supply chain concentration creates unprecedented global vulnerability."
  },
  
  {
    id: "gold-3500",
    question: "Will gold reach $3,500/oz by end of 2025?",
    shortTitle: "Gold to $3,500",
    category: "markets",
    status: "active",
    probability: 42,
    probabilityChange24h: 2.3,
    sentiment: "bullish",
    sentimentScore: 48,
    volume24h: 2_100_000,
    totalVolume: 95_000_000,
    participants: 15_800,
    createdAt: "2024-10-01",
    resolutionDate: "2025-12-31",
    lastUpdated: new Date().toISOString(),
    description: "Probability of gold reaching $3,500/oz driven by central bank buying, geopolitical risks, and potential Fed rate cuts.",
    keyFactors: [
      "Central bank gold purchases",
      "Real interest rate trajectory",
      "US fiscal deficit concerns",
      "De-dollarization trends",
      "Geopolitical risk premium"
    ],
    projectedImpacts: [
      {
        asset: "Gold Miners (GDX)",
        assetType: "stock",
        currentPrice: 100,
        projectedChange: 60,
        confidence: "high",
        rationale: "Miners are leveraged play on gold prices"
      },
      {
        asset: "Silver",
        assetType: "commodity",
        currentPrice: 31,
        projectedChange: 45,
        confidence: "medium",
        rationale: "Silver historically follows gold with higher beta"
      },
      {
        asset: "USD Index",
        assetType: "currency",
        currentPrice: 104,
        projectedChange: -8,
        confidence: "medium",
        rationale: "Gold strength often correlates with dollar weakness"
      },
      {
        asset: "Bitcoin",
        assetType: "commodity",
        currentPrice: 95000,
        projectedChange: 25,
        confidence: "low",
        rationale: "Some correlation as alternative store of value, but relationship unstable"
      }
    ],
    historicalPrecedent: [
      {
        event: "2011 Gold Peak",
        date: "2011-09-06",
        outcome: "Gold hit $1,920 then fell 45% over 4 years",
        marketImpact: "Miners destroyed, sentiment took decade to recover"
      },
      {
        event: "2020 COVID Gold Rally",
        date: "2020-08-06",
        outcome: "Gold hit $2,075 all-time high",
        marketImpact: "Preceded by massive stimulus, miners +150%"
      }
    ],
    insight: "Central bank buying has fundamentally changed gold dynamics - 2022-2024 saw record purchases led by China, Russia, and emerging markets. This structural demand shift may support higher prices regardless of traditional drivers like real rates."
  },
  
  {
    id: "fed-recession",
    question: "Will the US enter a recession (2 consecutive GDP declines) by mid-2025?",
    shortTitle: "US Recession",
    category: "markets",
    status: "active",
    probability: 32,
    probabilityChange24h: -1.5,
    sentiment: "neutral",
    sentimentScore: -12,
    volume24h: 3_800_000,
    totalVolume: 156_000_000,
    participants: 28_400,
    createdAt: "2024-08-15",
    resolutionDate: "2025-06-30",
    lastUpdated: new Date().toISOString(),
    description: "Probability of the US economy entering a technical recession with two consecutive quarters of GDP contraction.",
    keyFactors: [
      "Labor market softening",
      "Consumer spending trends",
      "Corporate earnings trajectory",
      "Yield curve normalization",
      "Credit conditions"
    ],
    projectedImpacts: [
      {
        asset: "S&P 500",
        assetType: "index",
        currentPrice: 5800,
        projectedChange: -25,
        confidence: "high",
        rationale: "Average recession drawdown is 30-35%"
      },
      {
        asset: "TSX Composite",
        assetType: "index",
        currentPrice: 24500,
        projectedChange: -28,
        confidence: "high",
        rationale: "Canada exports 75% to US, recession contagion high"
      },
      {
        asset: "Gold",
        assetType: "commodity",
        currentPrice: 2650,
        projectedChange: 20,
        confidence: "medium",
        rationale: "Safe haven demand plus Fed rate cuts"
      },
      {
        asset: "Oil",
        assetType: "commodity",
        currentPrice: 75,
        projectedChange: -30,
        confidence: "high",
        rationale: "Demand destruction in recessions historically severe"
      }
    ],
    historicalPrecedent: [
      {
        event: "2008 Great Recession",
        date: "2008-12-01",
        outcome: "GDP fell 4.3%, worst since Great Depression",
        marketImpact: "S&P 500 -57%, unemployment peaked at 10%"
      },
      {
        event: "2020 COVID Recession",
        date: "2020-04-01",
        outcome: "Shortest recession on record (2 months)",
        marketImpact: "S&P 500 -34% then recovered in 5 months"
      }
    ],
    insight: "Yield curve inversions have preceded every recession since 1970, but with variable lag times (6-24 months). The 2023 inversion's signal remains unresolved. Soft landing vs hard landing remains the key market debate."
  },
  
  {
    id: "bitcoin-150k",
    question: "Will Bitcoin reach $150,000 by end of 2025?",
    shortTitle: "BTC to $150K",
    category: "markets",
    status: "active",
    probability: 38,
    probabilityChange24h: 4.2,
    sentiment: "bullish",
    sentimentScore: 55,
    volume24h: 5_200_000,
    totalVolume: 320_000_000,
    participants: 52_100,
    createdAt: "2024-11-01",
    resolutionDate: "2025-12-31",
    lastUpdated: new Date().toISOString(),
    description: "Probability of Bitcoin reaching $150,000 driven by ETF inflows, halving cycle, and potential government adoption.",
    keyFactors: [
      "ETF inflow momentum",
      "Halving cycle dynamics",
      "Regulatory environment",
      "Institutional adoption",
      "Macro liquidity conditions"
    ],
    projectedImpacts: [
      {
        asset: "Crypto Mining Stocks",
        assetType: "stock",
        currentPrice: 100,
        projectedChange: 120,
        confidence: "high",
        rationale: "Miners are leveraged play on BTC price"
      },
      {
        asset: "Gold",
        assetType: "commodity",
        currentPrice: 2650,
        projectedChange: -5,
        confidence: "low",
        rationale: "Some portfolio rotation possible, but often move together"
      },
      {
        asset: "Tech Stocks",
        assetType: "stock",
        currentPrice: 100,
        projectedChange: 15,
        confidence: "medium",
        rationale: "Risk-on correlation with speculative assets"
      }
    ],
    historicalPrecedent: [
      {
        event: "2021 Bitcoin Peak",
        date: "2021-11-10",
        outcome: "BTC hit $69,000 then fell 77%",
        marketImpact: "Crypto market lost $2T, contagion to SPAC/growth stocks"
      },
      {
        event: "2024 ETF Approval Rally",
        date: "2024-01-10",
        outcome: "BTC rallied 60% in 3 months",
        marketImpact: "Institutional adoption narrative strengthened"
      }
    ],
    insight: "Bitcoin ETFs have changed the demand dynamic with consistent inflows from traditional finance. However, crypto remains highly volatile and correlated with risk assets during stress periods. Past halving cycles showed 12-18 month rallies."
  }
]

// Helper functions
export function getScenariosByCategory(category: MarketScenario["category"]): MarketScenario[] {
  return MARKET_SCENARIOS.filter(s => s.category === category)
}

export function getActiveScenarios(): MarketScenario[] {
  return MARKET_SCENARIOS.filter(s => s.status === "active")
}

export function getHighProbabilityScenarios(threshold: number = 60): MarketScenario[] {
  return MARKET_SCENARIOS.filter(s => s.probability >= threshold)
}

export function getScenarioById(id: string): MarketScenario | undefined {
  return MARKET_SCENARIOS.find(s => s.id === id)
}

export function getRelatedScenarios(scenario: MarketScenario): MarketScenario[] {
  if (!scenario.relatedScenarioIds) return []
  return scenario.relatedScenarioIds
    .map(id => MARKET_SCENARIOS.find(s => s.id === id))
    .filter((s): s is MarketScenario => s !== undefined)
}

export function getTrendingScenarios(): MarketScenario[] {
  return [...MARKET_SCENARIOS]
    .sort((a, b) => b.volume24h - a.volume24h)
    .slice(0, 5)
}
