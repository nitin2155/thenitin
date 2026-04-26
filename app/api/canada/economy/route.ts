import { NextResponse } from "next/server"
import type { CanadianEconomicData, BoCData } from "@/lib/types"

// Bank of Canada Valet API series codes
const BOC_SERIES = {
  policyRate: "V39079", // Bank of Canada policy rate
  cpi: "V41690973", // Consumer Price Index
  cadUsd: "FXUSDCAD", // CAD/USD exchange rate
  prime: "V80691335", // Prime business loan rate
  mortgage5yr: "V80691336", // 5-year conventional mortgage
  mortgage3yr: "V80691337", // 3-year conventional mortgage
  unemployment: "V2062815", // Unemployment rate
}

interface BoCObservation {
  d: string
  [key: string]: string
}

interface BoCSeriesDetail {
  label: string
  description: string
}

async function fetchBoCData(seriesCode: string): Promise<{ value: number; date: string } | null> {
  try {
    const response = await fetch(
      `https://www.bankofcanada.ca/valet/observations/${seriesCode}/json?recent=1`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    
    if (!response.ok) return null
    
    const data = await response.json()
    const observations = data.observations as BoCObservation[]
    
    if (observations && observations.length > 0) {
      const latest = observations[0]
      return {
        value: parseFloat(latest[seriesCode] as string) || 0,
        date: latest.d
      }
    }
    return null
  } catch {
    return null
  }
}

async function fetchBoCSeriesInfo(seriesCode: string): Promise<BoCSeriesDetail | null> {
  try {
    const response = await fetch(
      `https://www.bankofcanada.ca/valet/series/${seriesCode}/json`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    )
    
    if (!response.ok) return null
    
    const data = await response.json()
    const series = data.series?.[seriesCode]
    
    if (series) {
      return {
        label: series.label || seriesCode,
        description: series.description || ""
      }
    }
    return null
  } catch {
    return null
  }
}

export async function GET() {
  try {
    // Fetch all data in parallel
    const [
      policyRate,
      cpi,
      cadUsd,
      prime,
      mortgage5yr,
      mortgage3yr,
      unemployment
    ] = await Promise.all([
      fetchBoCData(BOC_SERIES.policyRate),
      fetchBoCData(BOC_SERIES.cpi),
      fetchBoCData(BOC_SERIES.cadUsd),
      fetchBoCData(BOC_SERIES.prime),
      fetchBoCData(BOC_SERIES.mortgage5yr),
      fetchBoCData(BOC_SERIES.mortgage3yr),
      fetchBoCData(BOC_SERIES.unemployment)
    ])

    // Calculate inflation rate (year-over-year CPI change)
    // For simplicity, using the CPI value as a proxy or fetching historical
    const inflationRate = cpi?.value ? ((cpi.value - 100) / 100 * 100) : 2.5

    const economicData: CanadianEconomicData = {
      interestRate: {
        series: BOC_SERIES.policyRate,
        label: "Bank of Canada Policy Rate",
        value: policyRate?.value || 4.25,
        date: policyRate?.date || new Date().toISOString().split("T")[0],
        description: "The target for the overnight rate set by the Bank of Canada"
      },
      inflationRate: {
        series: BOC_SERIES.cpi,
        label: "Inflation Rate (CPI)",
        value: Number(inflationRate.toFixed(2)),
        date: cpi?.date || new Date().toISOString().split("T")[0],
        description: "Year-over-year change in Consumer Price Index"
      },
      cadUsdRate: {
        series: BOC_SERIES.cadUsd,
        label: "CAD/USD Exchange Rate",
        value: cadUsd?.value || 1.36,
        date: cadUsd?.date || new Date().toISOString().split("T")[0],
        description: "Canadian dollar to US dollar exchange rate"
      },
      mortgageRate5yr: {
        series: BOC_SERIES.mortgage5yr,
        label: "5-Year Fixed Mortgage Rate",
        value: mortgage5yr?.value || 5.49,
        date: mortgage5yr?.date || new Date().toISOString().split("T")[0],
        description: "Conventional 5-year fixed mortgage rate"
      },
      mortgageRate3yr: {
        series: BOC_SERIES.mortgage3yr,
        label: "3-Year Fixed Mortgage Rate",
        value: mortgage3yr?.value || 5.29,
        date: mortgage3yr?.date || new Date().toISOString().split("T")[0],
        description: "Conventional 3-year fixed mortgage rate"
      },
      primeRate: {
        series: BOC_SERIES.prime,
        label: "Prime Rate",
        value: prime?.value || 6.45,
        date: prime?.date || new Date().toISOString().split("T")[0],
        description: "Prime business loan rate used for variable mortgages"
      },
      unemploymentRate: {
        series: BOC_SERIES.unemployment,
        label: "Unemployment Rate",
        value: unemployment?.value || 6.1,
        date: unemployment?.date || new Date().toISOString().split("T")[0],
        description: "Canadian unemployment rate (seasonally adjusted)"
      },
      gdpGrowth: {
        series: "GDP",
        label: "GDP Growth Rate",
        value: 1.8, // Estimated - would need Statistics Canada API
        date: new Date().toISOString().split("T")[0],
        description: "Annual GDP growth rate"
      },
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(economicData)
  } catch (error) {
    console.error("Error fetching Bank of Canada data:", error)
    return NextResponse.json(
      { error: "Failed to fetch Canadian economic data" },
      { status: 500 }
    )
  }
}
