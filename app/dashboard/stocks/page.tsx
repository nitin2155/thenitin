"use client"

import useSWR from "swr"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  TrendingUp,
  TrendingDown,
  Globe2,
  RefreshCw,
  AlertTriangle,
  Building2,
  MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { StockData } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function StocksPage() {
  const [market, setMarket] = useState<"all" | "tsx" | "us">("all")
  
  const { data, isLoading, mutate } = useSWR<{ 
    stocks: StockData[]
    lastUpdated: string
    total: number 
  }>(
    `/api/stocks?market=${market}`,
    fetcher,
    { refreshInterval: 60000 }
  )

  const stocks = data?.stocks || []
  const gainers = stocks.filter((s) => s.changePercent > 0)
  const losers = stocks.filter((s) => s.changePercent < 0)
  const highExposure = stocks.filter((s) => s.geopoliticalExposure === "high")

  const getExposureBadge = (exposure: string) => {
    switch (exposure) {
      case "high":
        return <Badge variant="destructive">High Risk</Badge>
      case "medium":
        return <Badge variant="default">Medium</Badge>
      case "low":
        return <Badge variant="secondary">Low Risk</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Markets</h1>
          <p className="text-muted-foreground mt-1">
            TSX and US stocks with geopolitical exposure analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => mutate()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          {data?.lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated: {new Date(data.lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Stocks</p>
                <p className="text-2xl font-bold">{stocks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-2/10">
                <TrendingUp className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gainers</p>
                <p className="text-2xl font-bold text-chart-2">{gainers.length}</p>
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
                <p className="text-sm text-muted-foreground">Losers</p>
                <p className="text-2xl font-bold text-destructive">{losers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-1/10">
                <AlertTriangle className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Geo Risk</p>
                <p className="text-2xl font-bold text-chart-1">{highExposure.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Filter Tabs */}
      <Tabs value={market} onValueChange={(v) => setMarket(v as typeof market)}>
        <TabsList>
          <TabsTrigger value="all">All Markets</TabsTrigger>
          <TabsTrigger value="tsx">TSX (Canada)</TabsTrigger>
          <TabsTrigger value="us">US Markets</TabsTrigger>
        </TabsList>

        <TabsContent value={market} className="mt-6">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stocks.map((stock) => (
                <Card key={stock.symbol} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{stock.symbol}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {stock.exchange}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {stock.name}
                        </p>
                      </div>
                      {getExposureBadge(stock.geopoliticalExposure)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Price */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold">
                          {stock.currency === "CAD" ? "C" : ""}${stock.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stock.currency}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-semibold flex items-center gap-1 ${
                            stock.changePercent >= 0 ? "text-chart-2" : "text-destructive"
                          }`}
                        >
                          {stock.changePercent >= 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          {stock.changePercent >= 0 ? "+" : ""}
                          {stock.changePercent.toFixed(2)}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stock.change >= 0 ? "+" : ""}
                          {stock.change.toFixed(2)} today
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 rounded bg-secondary/50">
                        <p className="text-muted-foreground text-xs">Market Cap</p>
                        <p className="font-medium">{stock.marketCap}</p>
                      </div>
                      <div className="p-2 rounded bg-secondary/50">
                        <p className="text-muted-foreground text-xs">Sector</p>
                        <p className="font-medium truncate">{stock.sector}</p>
                      </div>
                    </div>

                    {/* Geopolitical Regions */}
                    <div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <Globe2 className="h-3 w-3" />
                        Affected Regions
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {stock.affectedRegions.map((region) => (
                          <Badge
                            key={region}
                            variant="outline"
                            className="text-xs flex items-center gap-1"
                          >
                            <MapPin className="h-2.5 w-2.5" />
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
