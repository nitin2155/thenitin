"use client"

import useSWR from "swr"
import { RefreshCw, TrendingUp, Globe2, AlertTriangle, Newspaper } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { StockCard } from "./stock-card"
import { NewsCard } from "./news-card"
import { cn } from "@/lib/utils"

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: string
  sector: string
  geopoliticalExposure: "high" | "medium" | "low"
  affectedRegions: string[]
}

interface NewsArticle {
  id: string
  title: string
  description: string
  source: string
  publishedAt: string
  url: string
  category: "conflict" | "trade" | "sanctions" | "diplomacy" | "economy"
  affectedStocks: string[]
  sentiment: "positive" | "negative" | "neutral"
  impactLevel: "high" | "medium" | "low"
  region: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function StocksDashboard() {
  const { data: stocksData, error: stocksError, isLoading: stocksLoading, mutate: mutateStocks } = useSWR<{
    stocks: Stock[]
    lastUpdated: string
  }>("/api/stocks", fetcher, {
    refreshInterval: 60000, // Refresh every minute
    revalidateOnFocus: true
  })
  
  const { data: newsData, error: newsError, isLoading: newsLoading, mutate: mutateNews } = useSWR<{
    articles: NewsArticle[]
    lastUpdated: string
  }>("/api/news", fetcher, {
    refreshInterval: 300000, // Refresh every 5 minutes
    revalidateOnFocus: true
  })
  
  const stocks = stocksData?.stocks || []
  const news = newsData?.articles || []
  
  // Calculate summary stats
  const highExposureCount = stocks.filter(s => s.geopoliticalExposure === "high").length
  const positiveStocks = stocks.filter(s => s.change > 0).length
  const negativeStocks = stocks.filter(s => s.change < 0).length
  const highImpactNews = news.filter(n => n.impactLevel === "high").length
  
  const handleRefresh = () => {
    mutateStocks()
    mutateNews()
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Globe2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Geopolitical Stock Tracker
                </h1>
                <p className="text-xs text-muted-foreground">
                  Real-time market data with geopolitical analysis
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {stocksData?.lastUpdated && (
                <span className="text-xs text-muted-foreground hidden sm:block">
                  Updated: {new Date(stocksData.lastUpdated).toLocaleTimeString()}
                </span>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={stocksLoading || newsLoading}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", (stocksLoading || newsLoading) && "animate-spin")} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-chart-2" />
                <span className="text-xs text-muted-foreground">Gainers</span>
              </div>
              <p className="text-2xl font-bold text-chart-2">{positiveStocks}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-destructive rotate-180" />
                <span className="text-xs text-muted-foreground">Decliners</span>
              </div>
              <p className="text-2xl font-bold text-destructive">{negativeStocks}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-chart-4" />
                <span className="text-xs text-muted-foreground">High Exposure</span>
              </div>
              <p className="text-2xl font-bold text-chart-4">{highExposureCount}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Newspaper className="h-4 w-4 text-destructive" />
                <span className="text-xs text-muted-foreground">High Impact News</span>
              </div>
              <p className="text-2xl font-bold text-destructive">{highImpactNews}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="stocks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="stocks">
              <TrendingUp className="h-4 w-4 mr-2" />
              Stocks ({stocks.length})
            </TabsTrigger>
            <TabsTrigger value="news">
              <Newspaper className="h-4 w-4 mr-2" />
              Geopolitical News ({news.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stocks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top 20 Stocks with Geopolitical Impact</CardTitle>
                <CardDescription>
                  Tracking major stocks and their exposure to global political events
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stocksError ? (
                  <div className="text-center py-8">
                    <p className="text-destructive">Failed to load stock data</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => mutateStocks()}>
                      Retry
                    </Button>
                  </div>
                ) : stocksLoading ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-4 space-y-3">
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-4 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Filter by exposure */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        High Exposure: {stocks.filter(s => s.geopoliticalExposure === "high").length}
                      </Badge>
                      <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20">
                        Medium: {stocks.filter(s => s.geopoliticalExposure === "medium").length}
                      </Badge>
                      <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                        Low: {stocks.filter(s => s.geopoliticalExposure === "low").length}
                      </Badge>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {stocks.map((stock) => (
                        <StockCard key={stock.symbol} {...stock} />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="news" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Geopolitical News Feed</CardTitle>
                <CardDescription>
                  Latest news affecting global markets with impact analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {newsError ? (
                  <div className="text-center py-8">
                    <p className="text-destructive">Failed to load news</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => mutateNews()}>
                      Retry
                    </Button>
                  </div>
                ) : newsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-4 space-y-3">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-32" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {news.map((article) => (
                      <NewsCard key={article.id} {...article} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Disclaimer:</strong> This dashboard is for informational purposes only. 
            Stock data is provided via free APIs and may be delayed. 
            Geopolitical exposure ratings are algorithmic estimates and should not be used as investment advice.
          </p>
        </div>
      </main>
    </div>
  )
}
