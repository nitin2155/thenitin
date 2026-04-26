"use client"

import useSWR from "swr"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  TrendingUp,
  TrendingDown,
  Landmark,
  Home,
  Globe2,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Percent,
  Gem,
  Warehouse
} from "lucide-react"
import type { StockData, CanadianEconomicData, CanadianHousingMarket } from "@/lib/types"
import { MarketAlerts } from "@/components/ui/market-alerts"

interface CommodityData {
  id: string
  name: string
  symbol: string
  price: number
  priceCAD: number
  change: number
  changePercent: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DashboardPage() {
  const { data: stocksData, isLoading: stocksLoading } = useSWR<{ stocks: StockData[] }>(
    "/api/stocks?market=tsx",
    fetcher,
    { refreshInterval: 60000 }
  )

  const { data: commoditiesData, isLoading: commoditiesLoading } = useSWR<{ commodities: CommodityData[]; cadRate: number }>(
    "/api/commodities",
    fetcher,
    { refreshInterval: 60000 }
  )

  const { data: economyData, isLoading: economyLoading } = useSWR<CanadianEconomicData>(
    "/api/canada/economy",
    fetcher,
    { refreshInterval: 300000 }
  )

  const { data: housingData, isLoading: housingLoading } = useSWR<CanadianHousingMarket>(
    "/api/canada/housing",
    fetcher,
    { refreshInterval: 300000 }
  )

  const { data: geoData } = useSWR<{ currentRisks: { region: string; riskLevel: string; description: string }[] }>(
    "/api/geopolitics",
    fetcher
  )

  // Calculate market summary
  const tsxGainers = stocksData?.stocks.filter((s) => s.changePercent > 0).length || 0
  const tsxLosers = stocksData?.stocks.filter((s) => s.changePercent < 0).length || 0
  const commodityGainers = commoditiesData?.commodities.filter((c) => c.changePercent > 0).length || 0

  // Top movers
  const topGainer = stocksData?.stocks.reduce((max, s) => 
    s.changePercent > (max?.changePercent || -Infinity) ? s : max, stocksData.stocks[0])
  const topLoser = stocksData?.stocks.reduce((min, s) => 
    s.changePercent < (min?.changePercent || Infinity) ? s : min, stocksData.stocks[0])

  // High risk regions count
  const highRiskCount = geoData?.currentRisks.filter((r) => r.riskLevel === "high").length || 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Overview</h1>
          <p className="text-muted-foreground mt-1">
            Real-time Canadian market data with geopolitical context - All prices in CAD
          </p>
        </div>
        
        {/* Market Alerts */}
        <div className="lg:w-96">
          <MarketAlerts />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="CAD/USD Rate"
          value={economyData?.cadUsdRate.value || 0}
          icon={DollarSign}
          iconColor="text-chart-2"
          description="Bank of Canada"
          className={economyLoading ? "animate-pulse" : ""}
        />
        <StatCard
          title="BoC Interest Rate"
          value={`${economyData?.interestRate.value || 0}%`}
          icon={Percent}
          iconColor="text-chart-1"
          description="Policy Rate"
          className={economyLoading ? "animate-pulse" : ""}
        />
        <StatCard
          title="5-Year Mortgage"
          value={`${economyData?.mortgageRate5yr.value || 0}%`}
          icon={Home}
          iconColor="text-chart-4"
          description="Fixed Rate"
          className={economyLoading ? "animate-pulse" : ""}
        />
        <StatCard
          title="Geopolitical Risks"
          value={highRiskCount}
          icon={AlertTriangle}
          iconColor="text-destructive"
          description="High severity"
        />
      </div>

      {/* Market Summary Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* TSX Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              TSX Canadian Stocks
            </CardTitle>
            <Link 
              href="/dashboard/stocks" 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {stocksLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span className="flex items-center gap-1 text-chart-2">
                    <TrendingUp className="h-4 w-4" />
                    {tsxGainers} Gainers
                  </span>
                  <span className="flex items-center gap-1 text-destructive">
                    <TrendingDown className="h-4 w-4" />
                    {tsxLosers} Losers
                  </span>
                </div>
                <div className="space-y-2">
                  {stocksData?.stocks.slice(0, 5).map((stock) => (
                    <div
                      key={stock.symbol}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <div>
                        <p className="font-medium">{stock.symbol}</p>
                        <p className="text-xs text-muted-foreground">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">C${stock.price.toFixed(2)}</p>
                        <p
                          className={
                            stock.changePercent >= 0
                              ? "text-xs text-chart-2"
                              : "text-xs text-destructive"
                          }
                        >
                          {stock.changePercent >= 0 ? "+" : ""}
                          {stock.changePercent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Commodities Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Gem className="h-5 w-5 text-accent" />
              Commodities (CAD)
            </CardTitle>
            <Link 
              href="/dashboard/commodities" 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {commoditiesLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span className="flex items-center gap-1 text-chart-2">
                    <TrendingUp className="h-4 w-4" />
                    {commodityGainers} Up Today
                  </span>
                  <span className="text-muted-foreground">
                    CAD Rate: {commoditiesData?.cadRate?.toFixed(4) || "---"}
                  </span>
                </div>
                <div className="space-y-2">
                  {commoditiesData?.commodities?.slice(0, 5).map((commodity) => (
                    <Link
                      key={commodity.id}
                      href={`/dashboard/commodities/${commodity.id}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div>
                        <p className="font-medium">{commodity.symbol}</p>
                        <p className="text-xs text-muted-foreground">{commodity.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">C${commodity.priceCAD?.toLocaleString() || "---"}</p>
                        <p
                          className={
                            commodity.changePercent >= 0
                              ? "text-xs text-chart-2"
                              : "text-xs text-destructive"
                          }
                        >
                          {commodity.changePercent >= 0 ? "+" : ""}
                          {commodity.changePercent?.toFixed(2) || "0.00"}%
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Housing Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Home className="h-5 w-5 text-chart-4" />
              Canadian Housing Market
            </CardTitle>
            <Link 
              href="/dashboard/housing" 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {housingLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span className="text-muted-foreground">
                    National Avg: C${housingData?.national?.benchmarkPrice?.toLocaleString() || "---"}
                  </span>
                  <Badge variant="outline" className="text-destructive text-xs">
                    -12% from peak
                  </Badge>
                </div>
                <div className="space-y-2">
                  {housingData?.regions?.slice(0, 4).map((region) => (
                    <div
                      key={region.region}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <div>
                        <p className="font-medium">{region.region}</p>
                        <p className="text-xs text-muted-foreground">{region.province}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">C${region.benchmarkPrice?.toLocaleString()}</p>
                        <p
                          className={
                            region.priceChange1yr >= 0
                              ? "text-xs text-chart-2"
                              : "text-xs text-destructive"
                          }
                        >
                          {region.priceChange1yr >= 0 ? "+" : ""}
                          {region.priceChange1yr}% YoY
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-2 rounded-md bg-chart-1/10 border border-chart-1/20">
                  <div className="flex items-center gap-2 text-xs">
                    <Warehouse className="h-3.5 w-3.5 text-chart-1" />
                    <span className="text-chart-1 font-medium">Inventory up 65% - Buyer&apos;s market forming</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Geopolitical Risks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-chart-5" />
              Geopolitical Risk Monitor
            </CardTitle>
            <Link 
              href="/dashboard/geopolitics" 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {geoData?.currentRisks?.map((risk) => (
                <div
                  key={risk.region}
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
                >
                  <Badge
                    variant={
                      risk.riskLevel === "high"
                        ? "destructive"
                        : risk.riskLevel === "medium"
                        ? "default"
                        : "secondary"
                    }
                    className="mt-0.5"
                  >
                    {risk.riskLevel}
                  </Badge>
                  <div>
                    <p className="font-medium">{risk.region}</p>
                    <p className="text-xs text-muted-foreground">{risk.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Movers */}
      {topGainer && topLoser && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">TSX Top Movers Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-chart-2/10 border border-chart-2/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-chart-2" />
                  <span className="text-sm font-medium text-chart-2">Top Gainer</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold">{topGainer.symbol}</p>
                    <p className="text-sm text-muted-foreground">{topGainer.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-chart-2">
                      +{topGainer.changePercent.toFixed(2)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      C${topGainer.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  <span className="text-sm font-medium text-destructive">Top Loser</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold">{topLoser.symbol}</p>
                    <p className="text-sm text-muted-foreground">{topLoser.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-destructive">
                      {topLoser.changePercent.toFixed(2)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      C${topLoser.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Canadian Economy Quick View */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" />
            Canadian Economic Indicators
          </CardTitle>
          <Link 
            href="/dashboard/economy" 
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View details <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Inflation (CPI)</p>
              <p className="text-xl font-bold">{economyData?.inflationRate?.value || "---"}%</p>
              <p className="text-xs text-muted-foreground">Year-over-year</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Prime Rate</p>
              <p className="text-xl font-bold">{economyData?.primeRate?.value || "---"}%</p>
              <p className="text-xs text-muted-foreground">Bank prime</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">GDP Growth</p>
              <p className="text-xl font-bold">{economyData?.gdpGrowth?.value || "---"}%</p>
              <p className="text-xs text-muted-foreground">Quarterly</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Unemployment</p>
              <p className="text-xl font-bold">{economyData?.unemploymentRate?.value || "---"}%</p>
              <p className="text-xs text-muted-foreground">National rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
