"use client"

import { useParams } from "next/navigation"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { PriceChart } from "@/components/commodities/price-chart"
import { EventTimeline } from "@/components/commodities/event-impact-card"
import { ShareableInsightCard } from "@/components/ui/shareable-card"
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Clock,
  BarChart3,
  History,
  BookOpen,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { GEOPOLITICAL_EVENTS, getEventsForCommodity } from "@/lib/geopolitical-events"

const COMMODITY_INFO: Record<string, { 
  name: string
  description: string
  unit: string
  category: string
  geopoliticalFactors: string[]
  keyDrivers: string[]
}> = {
  GOLD: {
    name: "Gold",
    description: "Gold is the ultimate safe-haven asset. When geopolitical tensions rise, investors flee to gold as a store of value that has maintained purchasing power for thousands of years.",
    unit: "per oz",
    category: "Precious Metals",
    geopoliticalFactors: [
      "Wars and military conflicts increase safe-haven demand",
      "Currency devaluation fears drive physical gold buying",
      "Central bank policies (QE) historically boost gold prices",
      "Real interest rates inversely affect gold prices"
    ],
    keyDrivers: [
      "Federal Reserve interest rate decisions",
      "US Dollar strength (inverse correlation)",
      "Inflation expectations",
      "Central bank gold purchases",
      "Jewelry demand from India and China"
    ]
  },
  SILVER: {
    name: "Silver",
    description: "Silver is both a precious metal and an industrial commodity. It's more volatile than gold and has significant industrial demand in electronics, solar panels, and medical equipment.",
    unit: "per oz",
    category: "Precious Metals",
    geopoliticalFactors: [
      "Safe-haven demand during crises (less than gold)",
      "Industrial demand affected by trade tensions",
      "Solar panel manufacturing affects demand",
      "Retail investor speculation during market stress"
    ],
    keyDrivers: [
      "Gold price movements (high correlation)",
      "Industrial production levels",
      "Solar energy adoption rates",
      "Retail investor sentiment",
      "Mining supply disruptions"
    ]
  },
  CRUDE_OIL: {
    name: "Crude Oil (WTI)",
    description: "West Texas Intermediate is the benchmark for North American oil. Oil prices are extremely sensitive to geopolitical events in producing regions and directly impact Canadian energy stocks.",
    unit: "per barrel",
    category: "Energy",
    geopoliticalFactors: [
      "Middle East conflicts disrupt supply",
      "OPEC+ production decisions",
      "Russia sanctions affect global supply",
      "US-Venezuela relations",
      "Trade wars affect demand outlook"
    ],
    keyDrivers: [
      "OPEC+ production quotas",
      "US shale production levels",
      "Global economic growth",
      "Strategic Petroleum Reserve releases",
      "Refinery capacity and utilization"
    ]
  },
  NATURAL_GAS: {
    name: "Natural Gas",
    description: "Natural gas prices are driven by weather, storage levels, and increasingly by LNG export demand. Canada is a major producer, making TSX energy stocks sensitive to gas prices.",
    unit: "per MMBtu",
    category: "Energy",
    geopoliticalFactors: [
      "Russia-Europe gas relations",
      "LNG export terminal approvals",
      "Pipeline politics (Nord Stream)",
      "US energy policy changes"
    ],
    keyDrivers: [
      "Weather (heating/cooling demand)",
      "Storage inventory levels",
      "LNG export demand",
      "Associated gas from oil drilling",
      "Renewable energy competition"
    ]
  },
  COPPER: {
    name: "Copper",
    description: "Known as 'Dr. Copper' for its ability to predict economic trends, copper is essential for construction, electronics, and the green energy transition (EVs, renewable infrastructure).",
    unit: "per lb",
    category: "Industrial Metals",
    geopoliticalFactors: [
      "China economic policy (largest consumer)",
      "US-China trade relations",
      "Chilean political stability (largest producer)",
      "EV adoption policies globally"
    ],
    keyDrivers: [
      "Chinese construction activity",
      "Electric vehicle production",
      "Global manufacturing PMIs",
      "Green infrastructure spending",
      "Mining supply disruptions"
    ]
  },
  WHEAT: {
    name: "Wheat",
    description: "Wheat is a staple food commodity. Ukraine and Russia together supply about 30% of global wheat exports, making prices extremely sensitive to Black Sea region conflicts.",
    unit: "per bushel",
    category: "Agriculture",
    geopoliticalFactors: [
      "Russia-Ukraine war (major exporters)",
      "Black Sea export corridor agreements",
      "Food security policies",
      "Export restrictions by major producers"
    ],
    keyDrivers: [
      "Weather in major growing regions",
      "Black Sea export availability",
      "Global food inflation",
      "Biofuel policies",
      "Currency fluctuations in exporting countries"
    ]
  }
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function CommodityDetailPage() {
  const params = useParams()
  const commodityId = params.id as string
  
  const { data: priceData, isLoading: priceLoading } = useSWR(
    `/api/commodities?id=${commodityId}`,
    fetcher,
    { refreshInterval: 60000 }
  )
  
  const { data: historyData, isLoading: historyLoading } = useSWR(
    `/api/commodities/history?id=${commodityId}&range=1y&interval=1d`,
    fetcher
  )
  
  const commodity = priceData?.commodities?.[0]
  const info = COMMODITY_INFO[commodityId]
  const events = getEventsForCommodity(commodityId)
  
  if (!info) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Commodity Not Found</h2>
        <p className="text-muted-foreground">The requested commodity data is not available.</p>
        <Link href="/dashboard" className="text-primary hover:underline flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    )
  }
  
  const isPositive = commodity?.changePercent >= 0
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href="/dashboard" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Badge variant="outline">{info.category}</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{info.name}</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">{info.description}</p>
        </div>
        
        {priceLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        ) : commodity && (
          <div className="text-right">
            <div className="text-3xl font-bold">
              ${commodity.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={cn(
              "flex items-center justify-end gap-1 text-lg font-medium",
              isPositive ? "text-chart-1" : "text-destructive"
            )}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {isPositive ? "+" : ""}{commodity.changePercent.toFixed(2)}%
              <span className="text-sm text-muted-foreground ml-1">today</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-end gap-1">
              <Clock className="h-3 w-3" />
              {new Date(commodity.lastUpdated).toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>
      
      {/* Quick Stats */}
      {commodity && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="bg-secondary/30">
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">Day Range</p>
              <p className="text-sm font-medium">
                ${commodity.dayLow.toFixed(2)} - ${commodity.dayHigh.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/30">
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">52 Week Range</p>
              <p className="text-sm font-medium">
                ${commodity.week52Low?.toFixed(2) || "N/A"} - ${commodity.week52High?.toFixed(2) || "N/A"}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/30">
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">Previous Close</p>
              <p className="text-sm font-medium">${commodity.previousClose.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/30">
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">Volume</p>
              <p className="text-sm font-medium">{commodity.volume.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Shareable Card */}
      {commodity && (
        <ShareableInsightCard
          title={info.name}
          value={`$${commodity.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          change={commodity.changePercent}
          subtitle={`${info.unit} | ${info.category}`}
          badge={info.category}
        />
      )}
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="chart" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Price Chart
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <History className="h-4 w-4" />
            Historical Events
          </TabsTrigger>
          <TabsTrigger value="learn" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Learn
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>1 Year Price History</CardTitle>
                  <CardDescription>
                    Historical prices with major geopolitical events marked
                  </CardDescription>
                </div>
                {historyData?.statistics && (
                  <div className={cn(
                    "text-right",
                    historyData.statistics.totalChangePercent >= 0 ? "text-chart-1" : "text-destructive"
                  )}>
                    <p className="text-sm text-muted-foreground">1Y Change</p>
                    <p className="text-lg font-bold">
                      {historyData.statistics.totalChangePercent >= 0 ? "+" : ""}
                      {historyData.statistics.totalChangePercent.toFixed(2)}%
                    </p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : historyData?.history ? (
                <PriceChart 
                  data={historyData.history} 
                  events={events}
                  commodityId={commodityId}
                  showEvents={true}
                  height={400}
                />
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  No historical data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Historical Geopolitical Events</h3>
                <p className="text-sm text-muted-foreground">
                  How major world events impacted {info.name} prices
                </p>
              </div>
              <Badge variant="outline">{events.length} events</Badge>
            </div>
            
            <EventTimeline events={events} commodityId={commodityId} />
          </div>
        </TabsContent>
        
        <TabsContent value="learn">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Geopolitical Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Geopolitical Factors
                </CardTitle>
                <CardDescription>
                  Key geopolitical events that affect {info.name} prices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {info.geopoliticalFactors.map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-muted-foreground">{factor}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Key Drivers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Key Price Drivers
                </CardTitle>
                <CardDescription>
                  Primary factors that drive {info.name} prices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {info.keyDrivers.map((driver, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-muted-foreground">{driver}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Canadian Relevance */}
            <Card className="md:col-span-2 bg-destructive/5 border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">🍁</span>
                  Why This Matters for Canadians
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {commodityId === "GOLD" && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Canada is the 4th largest gold producer globally. Gold mining stocks like Barrick Gold (ABX.TO) 
                      and Kinross Gold (K.TO) are major TSX components. Gold prices directly impact these stocks and 
                      the broader Canadian materials sector.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Canadian investors often use gold as a hedge against CAD weakness and global uncertainty. 
                      When the USD/CAD rises, Canadian gold miners can benefit from higher USD-denominated gold prices.
                    </p>
                  </>
                )}
                {commodityId === "CRUDE_OIL" && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Oil is critical to the Canadian economy. Energy represents ~15% of the TSX, and oil prices 
                      directly impact stocks like Suncor (SU.TO), Canadian Natural Resources (CNQ.TO), and Enbridge (ENB.TO).
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Alberta's economy is highly correlated with oil prices. Low oil prices led to recessions in 
                      2015-16 and 2020. The CAD often moves with oil prices, affecting purchasing power for all Canadians.
                    </p>
                  </>
                )}
                {commodityId === "NATURAL_GAS" && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Canada is the 4th largest natural gas producer. Western Canadian Select (WCS) gas prices affect 
                      producers like Tourmaline Oil (TOU.TO) and ARC Resources (ARX.TO).
                    </p>
                    <p className="text-sm text-muted-foreground">
                      LNG Canada and other export projects are positioning Canada to export gas to Asia, potentially 
                      reducing the historical discount to US prices and benefiting Canadian producers.
                    </p>
                  </>
                )}
                {!["GOLD", "CRUDE_OIL", "NATURAL_GAS"].includes(commodityId) && (
                  <p className="text-sm text-muted-foreground">
                    Commodity prices impact the Canadian economy through the TSX materials and energy sectors, 
                    currency fluctuations, and overall economic activity. Higher commodity prices generally 
                    strengthen the CAD and boost related stocks.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
