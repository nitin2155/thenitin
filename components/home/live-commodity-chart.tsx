"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { 
  TrendingUp, 
  TrendingDown, 
  Loader2,
  ArrowRight,
  AlertTriangle,
  History,
  Zap
} from "lucide-react"
import { GEOPOLITICAL_EVENTS } from "@/lib/geopolitical-events"

const fetcher = (url: string) => fetch(url).then(res => res.json())

// Key commodities for the homepage display
const KEY_COMMODITIES = ["GOLD", "SILVER", "CRUDE_OIL", "NATURAL_GAS", "COPPER"]

const COMMODITY_COLORS: Record<string, string> = {
  GOLD: "from-yellow-500 to-amber-600",
  SILVER: "from-slate-400 to-slate-500",
  CRUDE_OIL: "from-orange-500 to-red-600",
  NATURAL_GAS: "from-blue-400 to-cyan-500",
  COPPER: "from-orange-400 to-amber-500",
}

const COMMODITY_BG_COLORS: Record<string, string> = {
  GOLD: "bg-yellow-500/10 border-yellow-500/20",
  SILVER: "bg-slate-400/10 border-slate-400/20",
  CRUDE_OIL: "bg-orange-500/10 border-orange-500/20",
  NATURAL_GAS: "bg-blue-400/10 border-blue-400/20",
  COPPER: "bg-orange-400/10 border-orange-400/20",
}

const GEOPOLITICAL_SENSITIVITY: Record<string, { level: string; factor: string }> = {
  GOLD: { level: "high", factor: "Safe haven - rises during conflicts and uncertainty" },
  SILVER: { level: "medium", factor: "Precious + industrial - mixed geopolitical response" },
  CRUDE_OIL: { level: "critical", factor: "Supply disruptions from Middle East/Russia" },
  NATURAL_GAS: { level: "high", factor: "Europe-Russia tensions drive prices" },
  COPPER: { level: "medium", factor: "China demand + green energy transition" },
}

interface CommodityData {
  id: string
  name: string
  price: number
  change: number
  changePercent: number
  unit: string
}

export function LiveCommodityChart() {
  const { data, isLoading, error } = useSWR("/api/commodities?type=commodities", fetcher, {
    refreshInterval: 60000, // Refresh every minute
  })
  
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const recentEvents = GEOPOLITICAL_EVENTS.slice(0, 5)
  
  // Rotate through events
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventIndex(prev => (prev + 1) % recentEvents.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [recentEvents.length])
  
  const commodities: CommodityData[] = data?.commodities?.filter(
    (c: CommodityData) => KEY_COMMODITIES.includes(c.id)
  ) || []
  
  // Sort by our preferred order
  const sortedCommodities = KEY_COMMODITIES
    .map(id => commodities.find(c => c.id === id))
    .filter(Boolean) as CommodityData[]
  
  const currentEvent = recentEvents[currentEventIndex]
  
  // Find the max absolute change for scaling
  const maxChange = Math.max(
    ...sortedCommodities.map(c => Math.abs(c.changePercent)),
    1 // Minimum to avoid division by zero
  )
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Event Ticker */}
      <div className="mb-6 p-4 rounded-xl bg-secondary/30 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <History className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Historical Event Impact
          </span>
        </div>
        
        <div className="flex items-center gap-4 transition-all duration-500">
          <div className="flex-1">
            <p className="font-semibold text-foreground">{currentEvent?.shortName}</p>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {currentEvent?.description}
            </p>
          </div>
          <Link 
            href="/dashboard/geopolitics"
            className="text-xs text-primary hover:underline flex items-center gap-1 shrink-0"
          >
            See all events <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        
        {/* Event dots */}
        <div className="flex items-center gap-1.5 mt-3">
          {recentEvents.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentEventIndex(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                idx === currentEventIndex 
                  ? "w-6 bg-primary" 
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      </div>
      
      {/* Live Prices Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Real-Time Commodity Prices</h3>
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-chart-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-1 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-chart-1" />
              </span>
              LIVE
            </span>
          )}
        </div>
      </div>
      
      {error ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Unable to load commodity data
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-3">
          {sortedCommodities.map((commodity) => {
            const isPositive = commodity.changePercent >= 0
            const barWidth = (Math.abs(commodity.changePercent) / maxChange) * 100
            const sensitivity = GEOPOLITICAL_SENSITIVITY[commodity.id]
            
            return (
              <Link
                key={commodity.id}
                href={`/dashboard/commodities/${commodity.id}`}
                className="block group"
              >
                <div className={cn(
                  "p-4 rounded-xl border transition-all duration-200",
                  "hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30",
                  COMMODITY_BG_COLORS[commodity.id]
                )}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-3 h-3 rounded-full bg-gradient-to-r",
                        COMMODITY_COLORS[commodity.id]
                      )} />
                      <div>
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {commodity.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {sensitivity?.factor}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        ${commodity.price.toLocaleString(undefined, { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </p>
                      <div className={cn(
                        "flex items-center justify-end gap-1 text-sm font-medium",
                        isPositive ? "text-chart-1" : "text-destructive"
                      )}>
                        {isPositive ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {isPositive ? "+" : ""}{commodity.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Change Bar */}
                  <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r",
                        isPositive 
                          ? "from-chart-1/50 to-chart-1" 
                          : "from-destructive/50 to-destructive"
                      )}
                      style={{ 
                        width: `${Math.max(barWidth, 5)}%`,
                      }}
                    />
                  </div>
                  
                  {/* Sensitivity Badge */}
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full",
                      sensitivity?.level === "critical" 
                        ? "bg-red-500/20 text-red-400"
                        : sensitivity?.level === "high"
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    )}>
                      {sensitivity?.level} geopolitical sensitivity
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                      View analysis <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
      
      {/* View All Link */}
      <div className="mt-6 text-center">
        <Link 
          href="/dashboard/commodities"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors"
        >
          View All Commodities & ETFs
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
