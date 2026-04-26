"use client"

import { useState } from "react"
import useSWR from "swr"
import { 
  GitCompare, 
  TrendingUp, 
  TrendingDown,
  Plus,
  X,
  Search,
  Share2,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ShareButton } from "@/components/ui/shareable-card"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface ComparisonItem {
  id: string
  symbol: string
  name: string
  type: "stock" | "crypto"
  price: number
  change: number
  changePercent: number
  volume?: string
  marketCap?: string
  exchange?: string
  currency: string
}

export default function ComparePage() {
  const [compareMode, setCompareMode] = useState<"stocks" | "crypto" | "mixed">("stocks")
  const [selectedItems, setSelectedItems] = useState<ComparisonItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  
  const { data: stocksData } = useSWR("/api/stocks?market=all", fetcher)
  const { data: cryptoData } = useSWR("/api/crypto", fetcher)

  // Prepare available items for selection
  const availableStocks: ComparisonItem[] = stocksData?.stocks?.map((s: Record<string, unknown>) => ({
    id: `stock-${s.symbol}`,
    symbol: s.symbol as string,
    name: s.name as string,
    type: "stock" as const,
    price: s.price as number,
    change: s.change as number,
    changePercent: s.changePercent as number,
    volume: formatNumber(s.volume as number),
    marketCap: s.marketCap as string,
    exchange: s.exchange as string,
    currency: s.currency as string || "USD"
  })) || []

  const availableCrypto: ComparisonItem[] = cryptoData?.coins?.map((c: Record<string, unknown>) => ({
    id: `crypto-${c.symbol}`,
    symbol: (c.symbol as string).toUpperCase(),
    name: c.name as string,
    type: "crypto" as const,
    price: c.priceCAD as number,
    change: (c.change24h as number) * (c.priceCAD as number) / 100,
    changePercent: c.change24h as number,
    volume: c.volume24h as string,
    marketCap: c.marketCap as string,
    currency: "CAD"
  })) || []

  const allItems = compareMode === "stocks" 
    ? availableStocks 
    : compareMode === "crypto" 
      ? availableCrypto 
      : [...availableStocks, ...availableCrypto]

  const filteredItems = allItems.filter(item => 
    !selectedItems.find(s => s.id === item.id) &&
    (item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const addItem = (item: ComparisonItem) => {
    if (selectedItems.length < 4) {
      setSelectedItems([...selectedItems, item])
    }
  }

  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id))
  }

  // Calculate comparison metrics
  const bestPerformer = selectedItems.length > 0 
    ? selectedItems.reduce((best, item) => item.changePercent > best.changePercent ? item : best)
    : null

  const worstPerformer = selectedItems.length > 0
    ? selectedItems.reduce((worst, item) => item.changePercent < worst.changePercent ? item : worst)
    : null

  const avgChange = selectedItems.length > 0
    ? selectedItems.reduce((sum, item) => sum + item.changePercent, 0) / selectedItems.length
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <GitCompare className="h-8 w-8 text-primary" />
            Compare Assets
          </h1>
          <p className="text-muted-foreground mt-1">
            Side-by-side comparison of up to 4 assets
          </p>
        </div>
        
        {selectedItems.length > 0 && (
          <ShareButton 
            text={`Comparing: ${selectedItems.map(i => i.symbol).join(" vs ")} - via TheNitin.space`}
          />
        )}
      </div>

      {/* Mode Selection */}
      <Tabs value={compareMode} onValueChange={(v) => {
        setCompareMode(v as typeof compareMode)
        setSelectedItems([])
      }}>
        <TabsList>
          <TabsTrigger value="stocks">Stocks Only</TabsTrigger>
          <TabsTrigger value="crypto">Crypto Only</TabsTrigger>
          <TabsTrigger value="mixed">Mixed</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Asset Selector */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Select Assets</CardTitle>
            <CardDescription>
              Choose up to 4 assets to compare
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by symbol or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Selected Items */}
            {selectedItems.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Selected ({selectedItems.length}/4)
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedItems.map(item => (
                    <Badge 
                      key={item.id}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {item.symbol}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-1 rounded-full hover:bg-muted p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Available Items */}
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {filteredItems.slice(0, 20).map(item => (
                <button
                  key={item.id}
                  onClick={() => addItem(item)}
                  disabled={selectedItems.length >= 4}
                  className={cn(
                    "w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors",
                    "hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{item.symbol}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs font-medium",
                      item.changePercent > 0 && "text-chart-1",
                      item.changePercent < 0 && "text-chart-2"
                    )}>
                      {item.changePercent > 0 && "+"}
                      {item.changePercent.toFixed(2)}%
                    </span>
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comparison View */}
        <div className="lg:col-span-2 space-y-6">
          {selectedItems.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <GitCompare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Assets Selected</h3>
                <p className="text-muted-foreground max-w-sm">
                  Select assets from the list to start comparing. You can compare up to 4 assets side by side.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-chart-1/10 border-chart-1/30">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Best Performer</p>
                    <p className="font-bold text-lg text-chart-1">
                      {bestPerformer?.symbol}
                    </p>
                    <p className="text-sm text-chart-1">
                      +{bestPerformer?.changePercent.toFixed(2)}%
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-chart-2/10 border-chart-2/30">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Worst Performer</p>
                    <p className="font-bold text-lg text-chart-2">
                      {worstPerformer?.symbol}
                    </p>
                    <p className="text-sm text-chart-2">
                      {worstPerformer?.changePercent.toFixed(2)}%
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Average Change</p>
                    <p className={cn(
                      "font-bold text-lg",
                      avgChange > 0 && "text-chart-1",
                      avgChange < 0 && "text-chart-2"
                    )}>
                      {avgChange > 0 && "+"}{avgChange.toFixed(2)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedItems.length} assets
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Comparison Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {selectedItems.map((item, index) => (
                  <Card 
                    key={item.id}
                    className={cn(
                      "relative overflow-hidden",
                      item.id === bestPerformer?.id && "ring-2 ring-chart-1"
                    )}
                  >
                    {item.id === bestPerformer?.id && (
                      <div className="absolute top-0 right-0 px-2 py-1 bg-chart-1 text-xs font-medium text-primary-foreground rounded-bl">
                        BEST
                      </div>
                    )}
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-xl">{item.symbol}</h3>
                            <Badge variant="outline" className="text-xs">
                              {item.type === "stock" ? item.exchange : "Crypto"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.name}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="text-2xl font-bold font-mono">
                            ${item.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: item.price < 1 ? 4 : 2
                            })}
                            <span className="text-sm font-normal text-muted-foreground ml-1">
                              {item.currency}
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded",
                            item.changePercent > 0 && "bg-chart-1/20 text-chart-1",
                            item.changePercent < 0 && "bg-chart-2/20 text-chart-2",
                            item.changePercent === 0 && "bg-secondary text-muted-foreground"
                          )}>
                            {item.changePercent > 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : item.changePercent < 0 ? (
                              <TrendingDown className="h-4 w-4" />
                            ) : null}
                            <span className="font-medium">
                              {item.changePercent > 0 && "+"}
                              {item.changePercent.toFixed(2)}%
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({item.change > 0 && "+"}
                            ${Math.abs(item.change).toFixed(2)})
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                          {item.marketCap && (
                            <div>
                              <p className="text-xs text-muted-foreground">Market Cap</p>
                              <p className="font-medium text-sm">{item.marketCap}</p>
                            </div>
                          )}
                          {item.volume && (
                            <div>
                              <p className="text-xs text-muted-foreground">Volume</p>
                              <p className="font-medium text-sm">{item.volume}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Performance Bar */}
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Relative Performance</p>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all duration-500",
                              item.changePercent > 0 ? "bg-chart-1" : "bg-chart-2"
                            )}
                            style={{
                              width: `${Math.min(100, Math.abs(item.changePercent) * 10 + 10)}%`
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Comparison Table */}
              {selectedItems.length >= 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Side-by-Side Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Metric</th>
                            {selectedItems.map(item => (
                              <th key={item.id} className="text-right py-3 px-4 font-medium">
                                {item.symbol}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border">
                            <td className="py-3 px-4 text-muted-foreground">Price</td>
                            {selectedItems.map(item => (
                              <td key={item.id} className="text-right py-3 px-4 font-mono">
                                ${item.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b border-border">
                            <td className="py-3 px-4 text-muted-foreground">Change %</td>
                            {selectedItems.map(item => (
                              <td key={item.id} className={cn(
                                "text-right py-3 px-4 font-medium",
                                item.changePercent > 0 && "text-chart-1",
                                item.changePercent < 0 && "text-chart-2"
                              )}>
                                {item.changePercent > 0 && "+"}
                                {item.changePercent.toFixed(2)}%
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b border-border">
                            <td className="py-3 px-4 text-muted-foreground">Market Cap</td>
                            {selectedItems.map(item => (
                              <td key={item.id} className="text-right py-3 px-4">
                                {item.marketCap || "—"}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-muted-foreground">Volume</td>
                            {selectedItems.map(item => (
                              <td key={item.id} className="text-right py-3 px-4">
                                {item.volume || "—"}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function formatNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
  return num.toString()
}
