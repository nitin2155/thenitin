"use client"

import useSWR from "swr"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"
import { Skeleton } from "@/components/ui/skeleton"
import { SectionCard, SectionDivider } from "@/components/dashboard/section-card"
import { HistoricalAnalysisModal } from "@/components/dashboard/historical-analysis-modal"
import { ScenarioCard, TrendingScenarios, ProbabilityGauge } from "@/components/dashboard/scenario-card"
import { MARKET_SCENARIOS, getTrendingScenarios, getScenariosByCategory } from "@/lib/scenarios"
import {
  TrendingUp,
  TrendingDown,
  Home,
  AlertTriangle,
  DollarSign,
  Percent,
  Gem,
  Warehouse,
  BarChart3,
  Scale,
  Ship,
  HelpCircle,
  Sparkles,
  Globe2,
  Target,
  Activity
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

  // Get trending scenarios
  const trendingScenarios = getTrendingScenarios()
  const tradeScenarios = getScenariosByCategory("trade")
  const geopoliticsScenarios = getScenariosByCategory("geopolitics")
  const monetaryScenarios = getScenariosByCategory("monetary")
  const marketScenarios = getScenariosByCategory("markets")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Market Analysis
            <Badge variant="outline" className="text-xs font-normal">
              <Activity className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1">
            Probabilistic forecasting and scenario analysis - All prices in CAD
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
          title="Active Scenarios"
          value={MARKET_SCENARIOS.filter(s => s.status === "active").length}
          icon={Target}
          iconColor="text-primary"
          description="What-If Analysis"
        />
      </div>

      {/* ==================== WHAT IF SCENARIOS SECTION ==================== */}
      <SectionDivider 
        title="What If Scenarios" 
        icon={HelpCircle}
        description="Probabilistic forecasting - Click any scenario for detailed analysis"
      />
      
      {/* Featured Scenarios */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main featured scenario */}
        <div className="lg:col-span-2">
          <Card className="h-full border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Featured Scenario</span>
              </div>
              <CardTitle className="text-xl">
                {trendingScenarios[0]?.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <ProbabilityGauge probability={trendingScenarios[0]?.probability || 0} size="large" />
                <div className="flex-1 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {trendingScenarios[0]?.description}
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground mb-1">24h Volume</p>
                      <p className="font-bold">${((trendingScenarios[0]?.volume24h || 0) / 1_000_000).toFixed(1)}M</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground mb-1">Participants</p>
                      <p className="font-bold">{(trendingScenarios[0]?.participants || 0).toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground mb-1">Sentiment</p>
                      <p className={cn(
                        "font-bold capitalize",
                        trendingScenarios[0]?.sentiment === "bullish" ? "text-chart-1" :
                        trendingScenarios[0]?.sentiment === "bearish" ? "text-destructive" : "text-foreground"
                      )}>
                        {trendingScenarios[0]?.sentiment}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2">Top projected impacts:</p>
                    <div className="flex flex-wrap gap-2">
                      {trendingScenarios[0]?.projectedImpacts.slice(0, 4).map((impact) => (
                        <Badge 
                          key={impact.asset}
                          variant="secondary"
                          className={cn(
                            impact.projectedChange > 0 ? "text-chart-1" : "text-destructive"
                          )}
                        >
                          {impact.asset} {impact.projectedChange > 0 ? "+" : ""}{impact.projectedChange}%
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Click to view full analysis */}
              <div className="mt-4">
                <ScenarioCard scenario={trendingScenarios[0]} compact />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Trending sidebar */}
        <TrendingScenarios scenarios={trendingScenarios.slice(1)} />
      </div>

      {/* Scenario Categories */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Trade Scenarios */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Ship className="h-5 w-5 text-chart-5" />
              Trade & Tariffs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {tradeScenarios.slice(0, 3).map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} compact />
            ))}
          </CardContent>
        </Card>

        {/* Monetary Policy Scenarios */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Percent className="h-5 w-5 text-chart-3" />
              Monetary Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {monetaryScenarios.slice(0, 3).map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} compact />
            ))}
          </CardContent>
        </Card>

        {/* Geopolitical Scenarios */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-destructive" />
              Geopolitical Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {geopoliticsScenarios.slice(0, 3).map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} compact />
            ))}
          </CardContent>
        </Card>

        {/* Market Scenarios */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-chart-1" />
              Market Predictions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {marketScenarios.slice(0, 3).map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} compact />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* All Scenarios Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5" />
          All Active Scenarios
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MARKET_SCENARIOS.filter(s => s.status === "active").map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}
        </div>
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
                  25% tariff threats on Canadian goods could impact $450B in annual trade
                </p>
              </div>
            </HistoricalAnalysisModal>
            
            <HistoricalAnalysisModal
              category="trade"
              title="Energy Trade Analysis"
              subtitle="Canada-US energy export dynamics"
            >
              <div className="p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Energy Exports</span>
                  <Badge variant="outline">Monitoring</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Canada supplies 60% of US crude oil imports - $120B annually
                </p>
              </div>
            </HistoricalAnalysisModal>
            
            <HistoricalAnalysisModal
              category="trade"
              title="Auto Sector Impact"
              subtitle="Cross-border automotive supply chains"
            >
              <div className="p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Auto Industry</span>
                  <Badge variant="outline">At Risk</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Parts cross the border 6+ times during production - $100B+ sector
                </p>
              </div>
            </HistoricalAnalysisModal>
          </div>
        </SectionCard>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Educational Purpose Only</p>
            <p className="text-xs text-muted-foreground mt-1">
              This platform provides probabilistic analysis and historical context for educational purposes. 
              Scenario probabilities are illustrative and do not represent actual prediction market data. 
              This is not financial advice. Always conduct your own research and consult qualified professionals 
              before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
