"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Home,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Info
} from "lucide-react"
import type { CanadianHousingMarket, HousingData } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function getMarketCondition(monthsOfInventory: number): { label: string; color: string } {
  if (monthsOfInventory < 2) return { label: "Seller's Market", color: "text-destructive" }
  if (monthsOfInventory < 4) return { label: "Balanced", color: "text-chart-2" }
  return { label: "Buyer's Market", color: "text-primary" }
}

export default function HousingPage() {
  const { data, isLoading, mutate } = useSWR<CanadianHousingMarket>(
    "/api/canada/housing",
    fetcher,
    { refreshInterval: 300000 }
  )

  const regions = data?.regions || []
  const national = data?.national

  // Sort regions by price
  const sortedByPrice = [...regions].sort((a, b) => b.benchmarkPrice - a.benchmarkPrice)
  const mostExpensive = sortedByPrice[0]
  const mostAffordable = sortedByPrice[sortedByPrice.length - 1]

  // Hottest markets (lowest inventory)
  const hottestMarkets = [...regions].sort((a, b) => a.monthsOfInventory - b.monthsOfInventory).slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Canadian Housing</h1>
          <p className="text-muted-foreground mt-1">
            Real estate market data across major Canadian cities
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => mutate()}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* National Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-4/10">
                <Home className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">National Average</p>
                <p className="text-xl font-bold">
                  C${national?.benchmarkPrice.toLocaleString() || "---"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-2/10">
                {(national?.priceChange1yr || 0) >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-chart-2" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-destructive" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">1-Year Change</p>
                <p className={`text-xl font-bold ${(national?.priceChange1yr || 0) >= 0 ? "text-chart-2" : "text-destructive"}`}>
                  {(national?.priceChange1yr || 0) >= 0 ? "+" : ""}
                  {national?.priceChange1yr}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-1/10">
                <BarChart3 className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Affordability Index</p>
                <p className="text-xl font-bold">{data?.affordabilityIndex || "---"}x</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stress Test Rate</p>
                <p className="text-xl font-bold">{data?.stressTestRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Insights */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Most Expensive
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mostExpensive && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">{mostExpensive.region}</p>
                  <p className="text-sm text-muted-foreground">{mostExpensive.province}</p>
                </div>
                <p className="text-xl font-bold text-chart-1">
                  C${mostExpensive.benchmarkPrice.toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Most Affordable
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mostAffordable && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">{mostAffordable.region}</p>
                  <p className="text-sm text-muted-foreground">{mostAffordable.province}</p>
                </div>
                <p className="text-xl font-bold text-chart-2">
                  C${mostAffordable.benchmarkPrice.toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hottest Market
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hottestMarkets[0] && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">{hottestMarkets[0].region}</p>
                  <p className="text-sm text-muted-foreground">
                    {hottestMarkets[0].monthsOfInventory} months inventory
                  </p>
                </div>
                <Badge variant="destructive">Hot</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Regional Data */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Market Data</CardTitle>
          <CardDescription>
            Benchmark prices and market conditions across Canada
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {regions.map((region) => {
                const condition = getMarketCondition(region.monthsOfInventory)
                return (
                  <div
                    key={region.region}
                    className="p-4 rounded-lg bg-secondary/50 grid gap-4 md:grid-cols-5 items-center"
                  >
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{region.region}</p>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">
                        {region.province}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Benchmark</p>
                      <p className="text-lg font-bold">
                        C${region.benchmarkPrice.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">YoY Change</p>
                      <p
                        className={`font-semibold flex items-center gap-1 ${
                          region.priceChange1yr >= 0 ? "text-chart-2" : "text-destructive"
                        }`}
                      >
                        {region.priceChange1yr >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {region.priceChange1yr >= 0 ? "+" : ""}
                        {region.priceChange1yr}%
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <Badge variant="outline" className={condition.color}>
                        {condition.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {region.monthsOfInventory} mo. inventory
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Affordability Explainer */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Understanding Affordability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="font-medium">Affordability Index: {data?.affordabilityIndex}x</p>
              <p className="text-sm text-muted-foreground mt-1">
                This is the ratio of median home price to median household income.
                A healthy ratio is considered 3-4x. Above 5x indicates severe 
                affordability challenges.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="font-medium">Stress Test Rate: {data?.stressTestRate}%</p>
              <p className="text-sm text-muted-foreground mt-1">
                To qualify for a mortgage, you must prove you can afford payments 
                at the higher of your contracted rate + 2% or {data?.stressTestRate}%.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-chart-4" />
              Market Indicators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="font-medium">Months of Inventory</p>
              <p className="text-sm text-muted-foreground mt-1">
                Less than 2 months = Seller&apos;s market (prices rising)
                <br />
                2-4 months = Balanced market
                <br />
                More than 4 months = Buyer&apos;s market (prices stable/falling)
              </p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="font-medium">5-Year Price Change</p>
              <p className="text-sm text-muted-foreground mt-1">
                National average has increased {national?.priceChange5yr}% over 5 years.
                Some markets like Halifax saw {regions.find(r => r.region === "Halifax")?.priceChange5yr || 0}% gains.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
