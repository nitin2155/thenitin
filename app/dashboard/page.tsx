"use client"

import useSWR from "swr"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { SectionCard, SectionDivider } from "@/components/dashboard/section-card"
import { HistoricalAnalysisModal } from "@/components/dashboard/historical-analysis-modal"
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
  Warehouse,
  BarChart3,
  Scale,
  Ship,
  History
} from "lucide-react"
import type { StockData, CanadianEconomicData, CanadianHousingMarket } from "@/lib/types"
import { MarketAlerts } from "@/components/ui/market-alerts"
import { cn } from "@/lib/utils"

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

      {/* ==================== STOCKS SECTION ==================== */}
      <SectionDivider 
        title="Stock Markets" 
        icon={TrendingUp}
        description="TSX and equity market performance"
      />
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* TSX Overview */}
        <SectionCard
          title="TSX Canadian Stocks"
          description="Top traded Canadian equities"
          icon={TrendingUp}
          iconColor="text-primary"
          category="stocks"
          href="/dashboard/stocks"
        >
          {stocksLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-4 text-sm">
                <span className="flex items-center gap-1 text-chart-1">
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
                  <HistoricalAnalysisModal
                    key={stock.symbol}
                    category="stocks"
                    title={`${stock.symbol} Analysis`}
                    subtitle={`Historical context for ${stock.name}`}
                  >
                    <div
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors"
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
                              ? "text-xs text-chart-1"
                              : "text-xs text-destructive"
                          }
                        >
                          {stock.changePercent >= 0 ? "+" : ""}
                          {stock.changePercent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </HistoricalAnalysisModal>
                ))}
              </div>
            </>
          )}
        </SectionCard>

        {/* Top Movers */}
        {topGainer && topLoser && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-chart-4" />
                TSX Top Movers Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <HistoricalAnalysisModal
                  category="stocks"
                  title="Market Gainers Analysis"
                  subtitle="What drives stocks to outperform?"
                >
                  <div className="p-4 rounded-lg bg-chart-1/10 border border-chart-1/20 cursor-pointer hover:bg-chart-1/15 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-chart-1" />
                      <span className="text-sm font-medium text-chart-1">Top Gainer</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold">{topGainer.symbol}</p>
                        <p className="text-sm text-muted-foreground">{topGainer.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-chart-1">
                          +{topGainer.changePercent.toFixed(2)}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          C${topGainer.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </HistoricalAnalysisModal>
                
                <HistoricalAnalysisModal
                  category="stocks"
                  title="Market Decliners Analysis"
                  subtitle="Understanding market corrections"
                >
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 cursor-pointer hover:bg-destructive/15 transition-colors">
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
                </HistoricalAnalysisModal>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ==================== HOUSING SECTION ==================== */}
      <SectionDivider 
        title="Housing Market" 
        icon={Home}
        description="Canadian real estate and mortgage rates"
      />
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Housing Overview */}
        <SectionCard
          title="Canadian Housing Market"
          description="Regional price trends and inventory"
          icon={Home}
          iconColor="text-chart-4"
          category="housing"
          href="/dashboard/housing"
          badge="-12% from peak"
          badgeVariant="destructive"
        >
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
              </div>
              <div className="space-y-2">
                {housingData?.regions?.slice(0, 4).map((region) => (
                  <HistoricalAnalysisModal
                    key={region.region}
                    category="housing"
                    title={`${region.region} Housing Analysis`}
                    subtitle={`Market trends for ${region.region}, ${region.province}`}
                  >
                    <div
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors"
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
                              ? "text-xs text-chart-1"
                              : "text-xs text-destructive"
                          }
                        >
                          {region.priceChange1yr >= 0 ? "+" : ""}
                          {region.priceChange1yr}% YoY
                        </p>
                      </div>
                    </div>
                  </HistoricalAnalysisModal>
                ))}
              </div>
              <HistoricalAnalysisModal
                category="housing"
                title="Housing Inventory Analysis"
                subtitle="Supply dynamics and market conditions"
              >
                <div className="mt-3 p-2 rounded-md bg-chart-1/10 border border-chart-1/20 cursor-pointer hover:bg-chart-1/15 transition-colors">
                  <div className="flex items-center gap-2 text-xs">
                    <Warehouse className="h-3.5 w-3.5 text-chart-1" />
                    <span className="text-chart-1 font-medium">Inventory up 65% - Buyer&apos;s market forming</span>
                    <History className="h-3 w-3 text-chart-1 ml-auto" />
                  </div>
                </div>
              </HistoricalAnalysisModal>
            </>
          )}
        </SectionCard>

        {/* Mortgage Rates Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Percent className="h-5 w-5 text-chart-3" />
              Interest Rate Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <HistoricalAnalysisModal
              category="housing"
              title="Interest Rate Analysis"
              subtitle="How BoC decisions affect housing markets"
            >
              <div className="grid grid-cols-2 gap-4 cursor-pointer">
                <div className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                  <p className="text-sm text-muted-foreground">BoC Policy Rate</p>
                  <p className="text-2xl font-bold">{economyData?.interestRate?.value || "---"}%</p>
                  <p className="text-xs text-muted-foreground">Affects variable mortgages</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                  <p className="text-sm text-muted-foreground">5-Year Fixed</p>
                  <p className="text-2xl font-bold">{economyData?.mortgageRate5yr?.value || "---"}%</p>
                  <p className="text-xs text-muted-foreground">Most popular term</p>
                </div>
              </div>
            </HistoricalAnalysisModal>
            
            <div className="p-3 rounded-lg bg-chart-4/10 border border-chart-4/20">
              <div className="flex items-start gap-2">
                <Scale className="h-4 w-4 text-chart-4 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-chart-4">Rate Sensitivity</p>
                  <p className="text-xs text-muted-foreground">
                    Every 1% rate increase reduces buying power by ~10%. Canadian households 
                    have the highest debt-to-income ratio in G7.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ==================== TRADE & COMMODITIES SECTION ==================== */}
      <SectionDivider 
        title="Trade & Commodities" 
        icon={Ship}
        description="Global trade dynamics and commodity prices"
      />
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Commodities Overview */}
        <SectionCard
          title="Commodities (CAD)"
          description="Gold, oil, and key resources"
          icon={Gem}
          iconColor="text-accent"
          category="commodities"
          href="/dashboard/commodities"
        >
          {commoditiesLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-4 text-sm">
                <span className="flex items-center gap-1 text-chart-1">
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
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
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
                            ? "text-xs text-chart-1"
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
        </SectionCard>

        {/* Trade Impact */}
        <SectionCard
          title="Trade Impact Monitor"
          description="Tariffs and trade policy effects"
          icon={Ship}
          iconColor="text-chart-5"
          category="trade"
          href="/dashboard/tariffs"
          badge="Tariff Alert"
          badgeVariant="destructive"
        >
          <div className="space-y-3">
            <HistoricalAnalysisModal
              category="trade"
              title="US-Canada Trade Relations"
              subtitle="Historical tariff impacts and trade dynamics"
            >
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 cursor-pointer hover:bg-destructive/15 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">US Tariff Threats</span>
                  <Badge variant="destructive">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  25% tariffs on Canadian goods under discussion. Auto, energy, and lumber sectors at risk.
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-destructive">
                  <History className="h-3 w-3" />
                  <span>View historical trade war impacts</span>
                </div>
              </div>
            </HistoricalAnalysisModal>
            
            <HistoricalAnalysisModal
              category="trade"
              title="Energy Export Analysis"
              subtitle="Pipeline capacity and oil export dynamics"
            >
              <div className="p-3 rounded-lg bg-chart-4/10 border border-chart-4/20 cursor-pointer hover:bg-chart-4/15 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Energy Exports</span>
                  <Badge variant="outline">Constrained</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  WCS trades at $15-20 discount to WTI due to pipeline capacity limits.
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-chart-4">
                  <History className="h-3 w-3" />
                  <span>View historical price spreads</span>
                </div>
              </div>
            </HistoricalAnalysisModal>
            
            <HistoricalAnalysisModal
              category="trade"
              title="USMCA Analysis"
              subtitle="Trade agreement impacts on Canadian sectors"
            >
              <div className="p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">USMCA Framework</span>
                  <Badge variant="secondary">In Effect</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Rules of origin changes affect auto and dairy sectors. Review scheduled for 2026.
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <History className="h-3 w-3" />
                  <span>View NAFTA to USMCA transition</span>
                </div>
              </div>
            </HistoricalAnalysisModal>
          </div>
        </SectionCard>
      </div>

      {/* ==================== GEOPOLITICAL & ECONOMY SECTION ==================== */}
      <SectionDivider 
        title="Geopolitics & Economy" 
        icon={Globe2}
        description="Global risks and economic indicators"
      />
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Geopolitical Risks */}
        <SectionCard
          title="Geopolitical Risk Monitor"
          description="Global events affecting markets"
          icon={Globe2}
          iconColor="text-chart-5"
          category="economy"
          href="/dashboard/geopolitics"
        >
          <div className="space-y-3">
            {geoData?.currentRisks?.map((risk) => (
              <HistoricalAnalysisModal
                key={risk.region}
                category="economy"
                title={`${risk.region} Risk Analysis`}
                subtitle="Historical geopolitical event impacts"
              >
                <div
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors"
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
                  <div className="flex-1">
                    <p className="font-medium">{risk.region}</p>
                    <p className="text-xs text-muted-foreground">{risk.description}</p>
                  </div>
                  <History className="h-4 w-4 text-muted-foreground" />
                </div>
              </HistoricalAnalysisModal>
            ))}
          </div>
        </SectionCard>

        {/* Canadian Economy Quick View */}
        <SectionCard
          title="Canadian Economic Indicators"
          description="Key macro data points"
          icon={Landmark}
          iconColor="text-primary"
          category="economy"
          href="/dashboard/economy"
        >
          <div className="grid grid-cols-2 gap-3">
            <HistoricalAnalysisModal
              category="economy"
              title="Inflation Analysis"
              subtitle="CPI trends and purchasing power"
            >
              <div className="p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors">
                <p className="text-sm text-muted-foreground">Inflation (CPI)</p>
                <p className="text-xl font-bold">{economyData?.inflationRate?.value || "---"}%</p>
                <p className="text-xs text-muted-foreground">Year-over-year</p>
              </div>
            </HistoricalAnalysisModal>
            
            <HistoricalAnalysisModal
              category="economy"
              title="Interest Rate Analysis"
              subtitle="BoC policy and lending rates"
            >
              <div className="p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors">
                <p className="text-sm text-muted-foreground">Prime Rate</p>
                <p className="text-xl font-bold">{economyData?.primeRate?.value || "---"}%</p>
                <p className="text-xs text-muted-foreground">Bank prime</p>
              </div>
            </HistoricalAnalysisModal>
            
            <HistoricalAnalysisModal
              category="economy"
              title="GDP Growth Analysis"
              subtitle="Economic output and growth trends"
            >
              <div className="p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors">
                <p className="text-sm text-muted-foreground">GDP Growth</p>
                <p className="text-xl font-bold">{economyData?.gdpGrowth?.value || "---"}%</p>
                <p className="text-xs text-muted-foreground">Quarterly</p>
              </div>
            </HistoricalAnalysisModal>
            
            <HistoricalAnalysisModal
              category="economy"
              title="Employment Analysis"
              subtitle="Labor market dynamics"
            >
              <div className="p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors">
                <p className="text-sm text-muted-foreground">Unemployment</p>
                <p className="text-xl font-bold">{economyData?.unemploymentRate?.value || "---"}%</p>
                <p className="text-xs text-muted-foreground">National rate</p>
              </div>
            </HistoricalAnalysisModal>
          </div>
        </SectionCard>
      </div>

      {/* Educational Disclaimer */}
      <Card className="bg-secondary/30 border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-chart-4/10">
              <Scale className="h-5 w-5 text-chart-4" />
            </div>
            <div>
              <p className="font-medium">Educational Platform</p>
              <p className="text-sm text-muted-foreground mt-1">
                This dashboard provides historical analysis, correlations, and market context for 
                educational purposes only. Data presented here is not financial advice. Past performance 
                does not guarantee future results. Always consult qualified financial professionals 
                before making investment decisions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
