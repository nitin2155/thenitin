// Stock Types
export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: string
  sector: string
  exchange: "NYSE" | "NASDAQ" | "TSX"
  currency: "USD" | "CAD"
  geopoliticalExposure: "high" | "medium" | "low"
  affectedRegions: string[]
}

// Crypto Types
export interface CryptoData {
  id: string
  symbol: string
  name: string
  image: string
  currentPrice: number
  priceCAD: number
  marketCap: number
  marketCapRank: number
  priceChange24h: number
  priceChangePercentage24h: number
  priceChangePercentage7d: number
  totalVolume: number
  circulatingSupply: number
  ath: number
  athChangePercentage: number
  geopoliticalFactors: string[]
}

// Bank of Canada Types
export interface BoCData {
  series: string
  label: string
  value: number
  date: string
  description: string
}

export interface CanadianEconomicData {
  interestRate: BoCData
  inflationRate: BoCData
  cadUsdRate: BoCData
  mortgageRate5yr: BoCData
  mortgageRate3yr: BoCData
  primeRate: BoCData
  unemploymentRate: BoCData
  gdpGrowth: BoCData
  lastUpdated: string
}

// Housing Types
export interface HousingData {
  region: string
  province: string
  benchmarkPrice: number
  priceChange1yr: number
  priceChange5yr: number
  salesVolume: number
  activeListings: number
  monthsOfInventory: number
  averageDaysOnMarket: number
  lastUpdated: string
}

export interface CanadianHousingMarket {
  national: HousingData
  regions: HousingData[]
  affordabilityIndex: number
  stressTestRate: number
  lastUpdated: string
}

// Geopolitical Types
export interface GeopoliticalEvent {
  id: string
  date: string
  title: string
  description: string
  category: "conflict" | "trade" | "sanctions" | "diplomacy" | "economy" | "election"
  severity: "critical" | "high" | "medium" | "low"
  regions: string[]
  affectedAssets: {
    stocks: string[]
    crypto: string[]
    commodities: string[]
  }
  historicalImpact: {
    asset: string
    change: number
    timeframe: string
  }[]
  canadaImpact: string
}

// News Types
export interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  category: "conflict" | "trade" | "sanctions" | "diplomacy" | "economy" | "markets"
  sentiment: "positive" | "negative" | "neutral"
  impactLevel: "high" | "medium" | "low"
  affectedStocks: string[]
  affectedRegions: string[]
  canadaRelevance: boolean
}

// Personal Finance Types
export interface MortgageCalculation {
  homePrice: number
  downPayment: number
  downPaymentPercent: number
  mortgageAmount: number
  interestRate: number
  amortizationYears: number
  paymentFrequency: "monthly" | "biweekly" | "weekly"
  monthlyPayment: number
  totalInterest: number
  totalCost: number
  cmhcInsurance: number
  stressTestRate: number
  qualifiesUnderStressTest: boolean
  requiredIncome: number
}

export interface InvestmentProjection {
  initialAmount: number
  monthlyContribution: number
  years: number
  expectedReturn: number
  projectedValue: number
  totalContributions: number
  totalGrowth: number
  yearlyBreakdown: {
    year: number
    balance: number
    contributions: number
    growth: number
  }[]
}
