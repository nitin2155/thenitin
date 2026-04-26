"use client"

import { useEffect, useState, useCallback } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  Droplets, 
  Gem, 
  Zap as ZapIcon,
  Globe2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CommodityData {
  id: string
  name: string
  symbol: string
  icon: React.ElementType
  price: number
  change: number
  changePercent: number
  geopoliticalFactor: string
  impactLevel: "high" | "medium" | "low"
  trend: "up" | "down" | "stable"
  color: string
  bgColor: string
}

// Simulated real-time data with geopolitical context
const COMMODITIES_BASE: Omit<CommodityData, "price" | "change" | "changePercent" | "trend">[] = [
  {
    id: "gold",
    name: "Gold",
    symbol: "XAU",
    icon: Gem,
    geopoliticalFactor: "Safe haven during conflicts",
    impactLevel: "high",
    color: "text-amber-400",
    bgColor: "bg-amber-400"
  },
  {
    id: "silver",
    name: "Silver",
    symbol: "XAG",
    icon: Gem,
    geopoliticalFactor: "Industrial + safe haven demand",
    impactLevel: "medium",
    color: "text-slate-300",
    bgColor: "bg-slate-300"
  },
  {
    id: "oil",
    name: "Crude Oil",
    symbol: "WTI",
    icon: Droplets,
    geopoliticalFactor: "Middle East tensions drive prices",
    impactLevel: "high",
    color: "text-orange-500",
    bgColor: "bg-orange-500"
  },
  {
    id: "natgas",
    name: "Natural Gas",
    symbol: "NG",
    icon: Flame,
    geopoliticalFactor: "Russia-Europe supply dynamics",
    impactLevel: "high",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400"
  },
  {
    id: "energy",
    name: "Energy ETF",
    symbol: "XLE",
    icon: ZapIcon,
    geopoliticalFactor: "Global energy security concerns",
    impactLevel: "medium",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400"
  }
]

// Base prices for simulation
const BASE_PRICES: Record<string, number> = {
  gold: 2650,
  silver: 31.50,
  oil: 78.50,
  natgas: 2.85,
  energy: 92.40
}

function generateRealisticChange(basePrice: number, volatility: number = 0.005): { price: number; change: number; changePercent: number } {
  const maxChange = basePrice * volatility
  const change = (Math.random() - 0.5) * 2 * maxChange
  const price = basePrice + change
  const changePercent = (change / basePrice) * 100
  return { price, change, changePercent }
}

export function GeopoliticalImpactChart() {
  const [commodities, setCommodities] = useState<CommodityData[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [activeEvent, setActiveEvent] = useState<number>(0)
  const [flashingId, setFlashingId] = useState<string | null>(null)

  const geopoliticalEvents = [
    { text: "Middle East tensions escalate", impact: "Oil +2.3%, Gold +1.1%", region: "Middle East" },
    { text: "Trade negotiations progress", impact: "Energy -0.8%, Markets rally", region: "US-China" },
    { text: "Currency volatility increases", impact: "Gold +0.9%, Safe havens rise", region: "Global" },
    { text: "Supply chain disruptions reported", impact: "Nat Gas +1.5%, Silver +0.7%", region: "Europe" },
    { text: "Central bank policy shifts", impact: "Gold +0.6%, USD weakens", region: "Federal Reserve" },
  ]

  const updatePrices = useCallback(() => {
    const updated = COMMODITIES_BASE.map((commodity) => {
      const basePrice = BASE_PRICES[commodity.id]
      const volatility = commodity.impactLevel === "high" ? 0.008 : 0.004
      const { price, change, changePercent } = generateRealisticChange(basePrice, volatility)
      
      return {
        ...commodity,
        price,
        change,
        changePercent,
        trend: change > 0 ? "up" as const : change < 0 ? "down" as const : "stable" as const
      }
    })
    
    setCommodities(updated)
    setLastUpdate(new Date())
    
    // Flash a random commodity to simulate real-time update
    const randomIndex = Math.floor(Math.random() * updated.length)
    setFlashingId(updated[randomIndex].id)
    setTimeout(() => setFlashingId(null), 500)
  }, [])

  useEffect(() => {
    updatePrices()
    const priceInterval = setInterval(updatePrices, 3000)
    const eventInterval = setInterval(() => {
      setActiveEvent(prev => (prev + 1) % geopoliticalEvents.length)
    }, 5000)
    
    return () => {
      clearInterval(priceInterval)
      clearInterval(eventInterval)
    }
  }, [updatePrices, geopoliticalEvents.length])

  const maxAbsChange = Math.max(...commodities.map(c => Math.abs(c.changePercent)), 1)

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10 border border-chart-4/20">
            <Globe2 className="h-5 w-5 text-chart-4" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Live Geopolitical Impact</h3>
            <p className="text-xs text-muted-foreground">How global events move markets</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-1 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-chart-1" />
          </span>
          Updated {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Geopolitical Event Ticker */}
      <div className="mb-6 p-4 rounded-lg bg-card/80 border border-border overflow-hidden">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-chart-5 shrink-0" />
          <div className="flex-1 overflow-hidden">
            <div 
              className="transition-all duration-500 ease-in-out"
              key={activeEvent}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 text-xs font-medium rounded bg-chart-4/20 text-chart-4 border border-chart-4/30">
                  {geopoliticalEvents[activeEvent].region}
                </span>
                <span className="text-sm text-foreground font-medium">
                  {geopoliticalEvents[activeEvent].text}
                </span>
                <span className="text-sm text-muted-foreground">|</span>
                <span className="text-sm text-chart-1">
                  {geopoliticalEvents[activeEvent].impact}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commodity Bars */}
      <div className="space-y-4">
        {commodities.map((commodity) => {
          const barWidth = Math.min(Math.abs(commodity.changePercent) / maxAbsChange * 100, 100)
          const isPositive = commodity.changePercent >= 0
          const isFlashing = flashingId === commodity.id
          
          return (
            <div 
              key={commodity.id}
              className={cn(
                "p-4 rounded-lg bg-card/60 border border-border transition-all duration-300",
                isFlashing && "ring-2 ring-primary/50 bg-card"
              )}
            >
              <div className="flex items-center gap-4">
                {/* Icon and Name */}
                <div className="flex items-center gap-3 w-32 shrink-0">
                  <div className={cn(
                    "p-2 rounded-lg",
                    commodity.impactLevel === "high" ? "bg-destructive/10" : "bg-secondary"
                  )}>
                    <commodity.icon className={cn("h-5 w-5", commodity.color)} />
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{commodity.name}</div>
                    <div className="text-xs text-muted-foreground">{commodity.symbol}</div>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="flex-1">
                  <div className="h-8 relative flex items-center">
                    {/* Center line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
                    
                    {/* Bar */}
                    <div className="absolute inset-y-1 left-1/2 right-1/2">
                      <div
                        className={cn(
                          "absolute top-0 bottom-0 rounded transition-all duration-500 ease-out",
                          isPositive ? "left-0" : "right-0",
                          isPositive ? commodity.bgColor : "bg-destructive"
                        )}
                        style={{
                          width: `${barWidth}%`,
                          opacity: 0.8
                        }}
                      />
                    </div>
                    
                    {/* Labels on sides */}
                    <span className="absolute left-2 text-xs text-muted-foreground">-{maxAbsChange.toFixed(1)}%</span>
                    <span className="absolute right-2 text-xs text-muted-foreground">+{maxAbsChange.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Price and Change */}
                <div className="text-right w-28 shrink-0">
                  <div className="font-mono font-semibold text-foreground">
                    ${commodity.price.toFixed(2)}
                  </div>
                  <div className={cn(
                    "flex items-center justify-end gap-1 text-sm font-medium",
                    isPositive ? "text-chart-1" : "text-destructive"
                  )}>
                    {isPositive ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    <span>{isPositive ? "+" : ""}{commodity.changePercent.toFixed(2)}%</span>
                  </div>
                </div>

                {/* Trend Indicator */}
                <div className="w-8 shrink-0 flex justify-center">
                  {isPositive ? (
                    <TrendingUp className="h-5 w-5 text-chart-1" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  )}
                </div>
              </div>

              {/* Geopolitical Factor */}
              <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{commodity.geopoliticalFactor}</span>
                <span className={cn(
                  "px-2 py-0.5 text-xs font-medium rounded",
                  commodity.impactLevel === "high" 
                    ? "bg-destructive/10 text-destructive border border-destructive/20" 
                    : "bg-chart-4/10 text-chart-4 border border-chart-4/20"
                )}>
                  {commodity.impactLevel === "high" ? "High Impact" : "Medium Impact"}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Educational Note */}
      <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
            <Globe2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-foreground text-sm mb-1">Understanding the Impact</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Geopolitical events create immediate market reactions. Gold and silver typically rise during uncertainty as 
              safe-haven assets. Energy commodities like oil and natural gas are highly sensitive to regional conflicts 
              and supply disruptions. Canadian investors should watch CAD/USD correlation with oil prices.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
