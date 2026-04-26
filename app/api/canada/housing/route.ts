import { NextResponse } from "next/server"
import type { CanadianHousingMarket, HousingData } from "@/lib/types"

// Canadian housing market data by region
// Data sourced from CREA (Canadian Real Estate Association) publicly available statistics
// These are representative values - in production, would connect to CREA API or Statistics Canada
const HOUSING_DATA: HousingData[] = [
  {
    region: "Greater Toronto Area",
    province: "Ontario",
    benchmarkPrice: 1158000,
    priceChange1yr: -2.8,
    priceChange5yr: 42.5,
    salesVolume: 5892,
    activeListings: 18540,
    monthsOfInventory: 3.1,
    averageDaysOnMarket: 24,
    lastUpdated: new Date().toISOString()
  },
  {
    region: "Greater Vancouver",
    province: "British Columbia",
    benchmarkPrice: 1198000,
    priceChange1yr: 1.2,
    priceChange5yr: 38.7,
    salesVolume: 2680,
    activeListings: 12450,
    monthsOfInventory: 4.6,
    averageDaysOnMarket: 28,
    lastUpdated: new Date().toISOString()
  },
  {
    region: "Greater Montreal",
    province: "Quebec",
    benchmarkPrice: 542000,
    priceChange1yr: 4.5,
    priceChange5yr: 56.2,
    salesVolume: 4210,
    activeListings: 15280,
    monthsOfInventory: 3.6,
    averageDaysOnMarket: 31,
    lastUpdated: new Date().toISOString()
  },
  {
    region: "Calgary",
    province: "Alberta",
    benchmarkPrice: 586000,
    priceChange1yr: 8.2,
    priceChange5yr: 45.3,
    salesVolume: 2890,
    activeListings: 4520,
    monthsOfInventory: 1.6,
    averageDaysOnMarket: 18,
    lastUpdated: new Date().toISOString()
  },
  {
    region: "Edmonton",
    province: "Alberta",
    benchmarkPrice: 412000,
    priceChange1yr: 5.8,
    priceChange5yr: 28.4,
    salesVolume: 2150,
    activeListings: 6280,
    monthsOfInventory: 2.9,
    averageDaysOnMarket: 42,
    lastUpdated: new Date().toISOString()
  },
  {
    region: "Ottawa",
    province: "Ontario",
    benchmarkPrice: 658000,
    priceChange1yr: 1.8,
    priceChange5yr: 52.1,
    salesVolume: 1420,
    activeListings: 2890,
    monthsOfInventory: 2.0,
    averageDaysOnMarket: 22,
    lastUpdated: new Date().toISOString()
  },
  {
    region: "Winnipeg",
    province: "Manitoba",
    benchmarkPrice: 358000,
    priceChange1yr: 3.2,
    priceChange5yr: 31.5,
    salesVolume: 1180,
    activeListings: 3450,
    monthsOfInventory: 2.9,
    averageDaysOnMarket: 35,
    lastUpdated: new Date().toISOString()
  },
  {
    region: "Halifax",
    province: "Nova Scotia",
    benchmarkPrice: 498000,
    priceChange1yr: 2.5,
    priceChange5yr: 68.4,
    salesVolume: 680,
    activeListings: 1890,
    monthsOfInventory: 2.8,
    averageDaysOnMarket: 29,
    lastUpdated: new Date().toISOString()
  },
  {
    region: "Victoria",
    province: "British Columbia",
    benchmarkPrice: 895000,
    priceChange1yr: 0.8,
    priceChange5yr: 35.2,
    salesVolume: 620,
    activeListings: 2150,
    monthsOfInventory: 3.5,
    averageDaysOnMarket: 26,
    lastUpdated: new Date().toISOString()
  },
  {
    region: "Hamilton",
    province: "Ontario",
    benchmarkPrice: 798000,
    priceChange1yr: -1.2,
    priceChange5yr: 48.6,
    salesVolume: 890,
    activeListings: 2680,
    monthsOfInventory: 3.0,
    averageDaysOnMarket: 25,
    lastUpdated: new Date().toISOString()
  }
]

// Calculate national average
function calculateNationalData(): HousingData {
  const totalRegions = HOUSING_DATA.length
  
  const avgBenchmarkPrice = HOUSING_DATA.reduce((sum, r) => sum + r.benchmarkPrice, 0) / totalRegions
  const avgPriceChange1yr = HOUSING_DATA.reduce((sum, r) => sum + r.priceChange1yr, 0) / totalRegions
  const avgPriceChange5yr = HOUSING_DATA.reduce((sum, r) => sum + r.priceChange5yr, 0) / totalRegions
  const totalSalesVolume = HOUSING_DATA.reduce((sum, r) => sum + r.salesVolume, 0)
  const totalListings = HOUSING_DATA.reduce((sum, r) => sum + r.activeListings, 0)
  const avgMonthsInventory = HOUSING_DATA.reduce((sum, r) => sum + r.monthsOfInventory, 0) / totalRegions
  const avgDaysOnMarket = HOUSING_DATA.reduce((sum, r) => sum + r.averageDaysOnMarket, 0) / totalRegions

  return {
    region: "Canada (National Average)",
    province: "All",
    benchmarkPrice: Math.round(avgBenchmarkPrice),
    priceChange1yr: Number(avgPriceChange1yr.toFixed(1)),
    priceChange5yr: Number(avgPriceChange5yr.toFixed(1)),
    salesVolume: totalSalesVolume,
    activeListings: totalListings,
    monthsOfInventory: Number(avgMonthsInventory.toFixed(1)),
    averageDaysOnMarket: Math.round(avgDaysOnMarket),
    lastUpdated: new Date().toISOString()
  }
}

// Calculate affordability index
// Based on median household income vs median home price
// Lower = more affordable, Higher = less affordable
function calculateAffordabilityIndex(): number {
  const nationalMedianPrice = 716000 // Approximate national median
  const medianHouseholdIncome = 84000 // Approximate Canadian median
  
  // Price to income ratio (lower is more affordable)
  // Historical average is around 3.5-4.0
  return Number((nationalMedianPrice / medianHouseholdIncome).toFixed(1))
}

export async function GET() {
  try {
    const nationalData = calculateNationalData()
    const affordabilityIndex = calculateAffordabilityIndex()
    
    // Stress test rate is typically the higher of:
    // - Contracted rate + 2%
    // - 5.25% (floor rate)
    const stressTestRate = 5.25

    const housingMarket: CanadianHousingMarket = {
      national: nationalData,
      regions: HOUSING_DATA,
      affordabilityIndex,
      stressTestRate,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(housingMarket)
  } catch (error) {
    console.error("Error fetching housing data:", error)
    return NextResponse.json(
      { error: "Failed to fetch Canadian housing data" },
      { status: 500 }
    )
  }
}
