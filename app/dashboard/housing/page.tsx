"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Info,
  Building2,
  ArrowRight,
  Clock,
  DollarSign,
  Users,
  Warehouse
} from "lucide-react"
import type { CanadianHousingMarket } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Historical eras with analysis
const housingEras = [
  {
    id: "2010-2019",
    title: "The Steady Rise (2010-2019)",
    period: "2010 - 2019",
    priceChange: "+68%",
    avgGrowth: "6.8% per year",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    borderColor: "border-chart-2/20",
    keyEvents: [
      { year: "2010", event: "Post-recession recovery begins", impact: "Prices stabilize after 2008 dip" },
      { year: "2012", event: "Foreign investment surge", impact: "Vancouver prices jump 10% in one year" },
      { year: "2016", event: "BC Foreign Buyer Tax introduced", impact: "Vancouver briefly cools, Toronto accelerates" },
      { year: "2017", event: "Ontario Fair Housing Plan", impact: "15% foreign buyer tax, rent controls expanded" },
      { year: "2018", event: "Stress Test introduced", impact: "Buying power reduced 20%, market cools" },
    ],
    summary: "Canadian housing saw steady appreciation driven by low interest rates (1.75-3%), strong immigration, and limited supply. Vancouver and Toronto led the gains, with prices doubling in some areas. The market was characterized by stable growth until foreign investment created localized bubbles.",
    canadianImpact: {
      avgPrice2010: "$339,000",
      avgPrice2019: "$570,000",
      mortgageRates: "3.0% - 5.0%",
      affordability: "Gradually declining"
    }
  },
  {
    id: "2019-2023",
    title: "The Pandemic Boom (2019-2023)",
    period: "2019 - 2023",
    priceChange: "+52%",
    avgGrowth: "13% per year",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
    keyEvents: [
      { year: "Mar 2020", event: "COVID-19 pandemic begins", impact: "Initial market freeze, sales plummet 70%" },
      { year: "Jul 2020", event: "Bank of Canada cuts to 0.25%", impact: "Lowest rates ever, borrowing explodes" },
      { year: "2021", event: "Work-from-home exodus", impact: "Suburbs and small cities boom, prices up 30%" },
      { year: "Feb 2022", event: "Market peaks", impact: "National average hits $816,720 - all-time high" },
      { year: "Mar 2022", event: "Rate hikes begin", impact: "BoC raises rates, correction starts" },
    ],
    summary: "The pandemic created a perfect storm: record-low 0.25% rates, remote work demand, and FOMO bidding wars. Prices surged 50%+ nationally in just 2 years. Small cities like Halifax and suburbs saw 40-60% gains. This unsustainable growth set the stage for the correction.",
    canadianImpact: {
      avgPrice2019: "$570,000",
      avgPrice2022Peak: "$816,720",
      mortgageRates: "0.25% - 1.5%",
      affordability: "Crisis levels - 50%+ income to housing"
    }
  },
  {
    id: "2023-now",
    title: "The Correction Era (2023-Now)",
    period: "2023 - Present",
    priceChange: "-12%",
    avgGrowth: "-4% per year",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
    keyEvents: [
      { year: "Jan 2023", event: "Rates hit 4.5%", impact: "Mortgage payments up 40% from 2021" },
      { year: "Jul 2023", event: "Peak rate of 5%", impact: "Variable rate holders feel the pain" },
      { year: "2024", event: "Inventory surges 50%+", impact: "Buyer's market returns in many cities" },
      { year: "2024", event: "Price corrections deepen", impact: "Toronto/Vancouver down 15-20% from peak" },
      { year: "2025", event: "Rate cuts begin", impact: "Gradual relief but prices stabilizing, not surging" },
    ],
    summary: "High interest rates (5%+) combined with affordability crisis led to demand collapse. Inventory has surged 50-80% in major markets as sellers struggle to find buyers. Prices have corrected 15-20% from peak but remain elevated vs pre-pandemic. This is a normalization, not a crash.",
    canadianImpact: {
      avgPrice2022Peak: "$816,720",
      avgPriceNow: "$720,000",
      mortgageRates: "4.5% - 5.5%",
      affordability: "Improving but still stretched"
    }
  }
]

// Why prices are falling - educational content
const priceDrivers = [
  {
    icon: TrendingUp,
    title: "Interest Rate Shock",
    description: "Bank of Canada raised rates from 0.25% to 5% in 18 months - fastest increase in history",
    impact: "Monthly payments on $600K mortgage went from $2,100 to $3,500",
    severity: "high"
  },
  {
    icon: Users,
    title: "Affordability Crisis",
    description: "Average family needs 60%+ of income for housing in Toronto/Vancouver",
    impact: "Buyers priced out, demand collapsed 40%",
    severity: "high"
  },
  {
    icon: Warehouse,
    title: "Inventory Surge",
    description: "Listings up 50-80% as sellers try to exit before further drops",
    impact: "5+ months of inventory = buyer's market",
    severity: "medium"
  },
  {
    icon: DollarSign,
    title: "Mortgage Renewals",
    description: "2021-2022 buyers face 2x payments on renewal at higher rates",
    impact: "Forced selling adding to inventory",
    severity: "medium"
  }
]

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Canadian Housing Market</h1>
          <p className="text-muted-foreground mt-1">
            Historical analysis, current data, and why prices are correcting
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            All prices in CAD
          </Badge>
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
      </div>

      {/* Quick Stats */}
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
              <div className="p-2 rounded-lg bg-destructive/10">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">From 2022 Peak</p>
                <p className="text-xl font-bold text-destructive">-12%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-1/10">
                <Warehouse className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inventory Change</p>
                <p className="text-xl font-bold text-chart-1">+65%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">BoC Rate</p>
                <p className="text-xl font-bold">4.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="history" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history" className="gap-2">
            <Clock className="h-4 w-4" />
            Historical Analysis
          </TabsTrigger>
          <TabsTrigger value="why" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Why Prices Are Falling
          </TabsTrigger>
          <TabsTrigger value="current" className="gap-2">
            <MapPin className="h-4 w-4" />
            Current Market Data
          </TabsTrigger>
        </TabsList>

        {/* Historical Analysis Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Canadian Housing: A 15-Year Journey
              </CardTitle>
              <CardDescription>
                From steady growth to pandemic boom to correction - understand each era
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {housingEras.map((era, index) => (
                <div key={era.id} className="space-y-4">
                  {/* Era Header */}
                  <div className={`p-4 rounded-lg ${era.bgColor} border ${era.borderColor}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <div>
                        <h3 className={`text-lg font-bold ${era.color}`}>{era.title}</h3>
                        <p className="text-sm text-muted-foreground">{era.period}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Price Change</p>
                          <p className={`text-xl font-bold ${era.color}`}>{era.priceChange}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Avg/Year</p>
                          <p className="font-semibold text-foreground">{era.avgGrowth}</p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">{era.summary}</p>
                    
                    {/* Key Events Timeline */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Key Events:</p>
                      <div className="space-y-2">
                        {era.keyEvents.map((event, i) => (
                          <div key={i} className="flex items-start gap-3 p-2 rounded-md bg-background/50">
                            <Badge variant="outline" className="shrink-0 mt-0.5">
                              {event.year}
                            </Badge>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{event.event}</p>
                              <p className="text-xs text-muted-foreground">{event.impact}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Era Stats */}
                    <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.entries(era.canadianImpact).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <p className="text-xs text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="font-semibold text-sm">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Connector */}
                  {index < housingEras.length - 1 && (
                    <div className="flex justify-center">
                      <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Price Journey Chart - Visual */}
          <Card>
            <CardHeader>
              <CardTitle>National Average Price Journey (CAD)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-64 flex items-end justify-between gap-2 px-4">
                {/* 2010 */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full bg-chart-2/20 rounded-t-md" style={{ height: '40%' }} />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">2010</p>
                    <p className="text-sm font-bold">$339K</p>
                  </div>
                </div>
                {/* 2015 */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full bg-chart-2/30 rounded-t-md" style={{ height: '50%' }} />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">2015</p>
                    <p className="text-sm font-bold">$432K</p>
                  </div>
                </div>
                {/* 2019 */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full bg-chart-2/50 rounded-t-md" style={{ height: '65%' }} />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">2019</p>
                    <p className="text-sm font-bold">$570K</p>
                  </div>
                </div>
                {/* 2022 Peak */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full bg-destructive/50 rounded-t-md relative" style={{ height: '100%' }}>
                    <Badge className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs" variant="destructive">
                      PEAK
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Feb 2022</p>
                    <p className="text-sm font-bold text-destructive">$817K</p>
                  </div>
                </div>
                {/* Now */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full bg-primary/50 rounded-t-md" style={{ height: '82%' }} />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Now</p>
                    <p className="text-sm font-bold text-primary">$720K</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Why Prices Are Falling Tab */}
        <TabsContent value="why" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Why Canadian Housing Prices Are Correcting
              </CardTitle>
              <CardDescription>
                Understanding the forces driving the current market adjustment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {priceDrivers.map((driver) => (
                <div 
                  key={driver.title}
                  className={`p-4 rounded-lg border ${
                    driver.severity === 'high' 
                      ? 'bg-destructive/5 border-destructive/20' 
                      : 'bg-chart-4/5 border-chart-4/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      driver.severity === 'high' ? 'bg-destructive/10' : 'bg-chart-4/10'
                    }`}>
                      <driver.icon className={`h-5 w-5 ${
                        driver.severity === 'high' ? 'text-destructive' : 'text-chart-4'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{driver.title}</h4>
                        <Badge variant={driver.severity === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                          {driver.severity === 'high' ? 'Major Factor' : 'Contributing'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{driver.description}</p>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-background/50 w-fit">
                        <Info className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-medium">{driver.impact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Inventory Surge Explanation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-chart-1" />
                The Inventory Surge Explained
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Active listings have surged 50-80% in major Canadian markets. This is why:
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <h4 className="font-semibold mb-2">Sellers:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      2021-2022 buyers facing renewal shocks
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      Investors exiting negative cash flow properties
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      Pre-construction buyers unable to close
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      Fear of further price declines
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg bg-secondary/50">
                  <h4 className="font-semibold mb-2">Buyers:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-chart-2">•</span>
                      Waiting for lower rates
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-chart-2">•</span>
                      Cannot qualify at stress test rates
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-chart-2">•</span>
                      Expecting further price drops
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-chart-2">•</span>
                      Down payment savings eroded by inflation
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm">
                  <span className="font-semibold text-primary">Market Implication: </span>
                  When inventory rises faster than demand, prices must fall to find equilibrium. 
                  Markets with 5+ months of inventory typically favor buyers and see price declines.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Current Market Data Tab */}
        <TabsContent value="current" className="space-y-6">
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
                  Highest Inventory
                </CardTitle>
              </CardHeader>
              <CardContent>
                {regions.sort((a, b) => b.monthsOfInventory - a.monthsOfInventory)[0] && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold">{regions.sort((a, b) => b.monthsOfInventory - a.monthsOfInventory)[0].region}</p>
                      <p className="text-sm text-muted-foreground">
                        {regions.sort((a, b) => b.monthsOfInventory - a.monthsOfInventory)[0].monthsOfInventory} months
                      </p>
                    </div>
                    <Badge variant="outline" className="text-primary">Buyer&apos;s Market</Badge>
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
                Benchmark prices and market conditions across Canada (all prices in CAD)
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
                    Ratio of median home price to median household income.
                    Healthy: 3-4x. Above 5x indicates severe challenges.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="font-medium">Stress Test Rate: {data?.stressTestRate}%</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Must prove you can afford payments at your rate + 2% 
                    or {data?.stressTestRate}%, whichever is higher.
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
                    &lt;2 months = Seller&apos;s market (prices rising)<br />
                    2-4 months = Balanced market<br />
                    &gt;4 months = Buyer&apos;s market (prices falling)
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="font-medium">5-Year Price Change</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    National average up {national?.priceChange5yr}% over 5 years,
                    but down 12% from Feb 2022 peak.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Disclaimer */}
      <Card className="bg-secondary/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Educational purposes only.</span> Housing market data 
              is illustrative and updated periodically. For current listings and prices, consult CREA, local 
              real estate boards, or a licensed realtor. This is not financial or investment advice.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
