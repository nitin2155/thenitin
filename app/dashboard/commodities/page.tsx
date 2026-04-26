"use client"

import useSWR from "swr"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  TrendingUp, 
  TrendingDown, 
  Loader2,
  ArrowRight,
  Gem,
  Flame,
  Factory,
  Wheat,
  RefreshCw
} from "lucide-react"

const CATEGORY_ICONS = {
  "Precious Metals": Gem,
  "Energy": Flame,
  "Industrial Metals": Factory,
  "Agriculture": Wheat,
  "ETF": TrendingUp,
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function CommoditiesPage() {
  const { data, isLoading, mutate } = useSWR("/api/commodities?type=all", fetcher, {
    refreshInterval: 60000
  })
  
  const commodities = data?.commodities || []
  
  // Group by category
  const grouped = commodities.reduce((acc: Record<string, typeof commodities>, item: typeof commodities[0]) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commodities</h1>
          <p className="text-muted-foreground mt-1">
            Real-time commodity prices with geopolitical impact analysis
          </p>
        </div>
        <button
          onClick={() => mutate()}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm"
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          Refresh
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, items]) => {
            const CategoryIcon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || TrendingUp
            
            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-4">
                  <CategoryIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">{category}</h2>
                  <Badge variant="outline" className="ml-2">{(items as typeof commodities).length}</Badge>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(items as typeof commodities).map((commodity: typeof commodities[0]) => {
                    const isPositive = commodity.changePercent >= 0
                    
                    return (
                      <Link 
                        key={commodity.id} 
                        href={`/dashboard/commodities/${commodity.id}`}
                      >
                        <Card className="hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer h-full">
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-semibold">{commodity.name}</h3>
                                <p className="text-xs text-muted-foreground">{commodity.unit}</p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                            
                            <div className="flex items-end justify-between">
                              <div>
                                <p className="text-2xl font-bold">
                                  ${commodity.price.toLocaleString(undefined, { 
                                    minimumFractionDigits: 2, 
                                    maximumFractionDigits: 2 
                                  })}
                                </p>
                              </div>
                              <div className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium",
                                isPositive 
                                  ? "bg-chart-1/10 text-chart-1" 
                                  : "bg-destructive/10 text-destructive"
                              )}>
                                {isPositive ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                {isPositive ? "+" : ""}{commodity.changePercent.toFixed(2)}%
                              </div>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                              <span>Day: ${commodity.dayLow.toFixed(2)} - ${commodity.dayHigh.toFixed(2)}</span>
                              <span>Vol: {(commodity.volume / 1000).toFixed(0)}K</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
