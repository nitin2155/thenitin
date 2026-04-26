"use client"

import { TrendingUp, TrendingDown, Globe, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StockCardProps {
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

export function StockCard({
  symbol,
  name,
  price,
  change,
  changePercent,
  marketCap,
  sector,
  geopoliticalExposure,
  affectedRegions,
}: StockCardProps) {
  const isPositive = change >= 0
  
  const exposureColors = {
    high: "bg-destructive/10 text-destructive border-destructive/20",
    medium: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    low: "bg-chart-2/10 text-chart-2 border-chart-2/20"
  }

  return (
    <Card className="group hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-foreground">{symbol}</span>
              <Badge 
                variant="outline" 
                className={cn("text-[10px] px-1.5 py-0", exposureColors[geopoliticalExposure])}
              >
                <AlertTriangle className="w-2.5 h-2.5 mr-0.5" />
                {geopoliticalExposure.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">{name}</p>
            <p className="text-xs text-muted-foreground mt-1">{sector}</p>
          </div>
          
          <div className="text-right">
            <p className="text-lg font-semibold text-foreground">
              ${price > 0 ? price.toFixed(2) : "--"}
            </p>
            <div className={cn(
              "flex items-center justify-end gap-1 text-sm",
              isPositive ? "text-chart-2" : "text-destructive"
            )}>
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>
                {isPositive ? "+" : ""}{change.toFixed(2)} ({isPositive ? "+" : ""}{changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Market Cap</span>
            <span className="text-foreground font-medium">{marketCap}</span>
          </div>
          
          {affectedRegions.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <Globe className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              {affectedRegions.map((region) => (
                <Badge 
                  key={region} 
                  variant="secondary" 
                  className="text-[10px] px-1.5 py-0 bg-secondary/50"
                >
                  {region}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
