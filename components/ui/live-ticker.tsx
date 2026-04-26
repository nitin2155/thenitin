"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { TrendingUp, TrendingDown, Minus, Gem } from "lucide-react"
import { cn } from "@/lib/utils"

interface TickerItem {
  symbol: string
  price: number
  change: number
  changePercent: number
  type: "stock" | "commodity" | "forex"
  currency: "CAD" | "USD"
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function LiveTicker() {
  const [prevPrices, setPrevPrices] = useState<Record<string, number>>({})
  const [flashingItems, setFlashingItems] = useState<Record<string, "up" | "down">>({})
  
  const { data: stocksData } = useSWR("/api/stocks?market=all", fetcher, {
    refreshInterval: 30000, // 30 seconds
  })
  
  const { data: commoditiesData } = useSWR("/api/commodities", fetcher, {
    refreshInterval: 30000,
  })

  // Combine and format ticker items
  const tickerItems: TickerItem[] = []
  
  // Add top stocks
  if (stocksData?.stocks) {
    stocksData.stocks.slice(0, 10).forEach((stock: { symbol: string; price: number; change: number; changePercent: number; currency?: string }) => {
      tickerItems.push({
        symbol: stock.symbol,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent,
        type: "stock",
        currency: stock.currency === "CAD" ? "CAD" : "USD"
      })
    })
  }
  
  // Add top commodities
  if (commoditiesData?.commodities) {
    commoditiesData.commodities.slice(0, 5).forEach((commodity: { symbol: string; priceCAD: number; change: number; changePercent: number }) => {
      tickerItems.push({
        symbol: commodity.symbol,
        price: commodity.priceCAD,
        change: commodity.change,
        changePercent: commodity.changePercent,
        type: "commodity",
        currency: "CAD"
      })
    })
  }

  // Track price changes for flash effect
  useEffect(() => {
    const newFlashing: Record<string, "up" | "down"> = {}
    
    tickerItems.forEach((item) => {
      const prev = prevPrices[item.symbol]
      if (prev !== undefined && prev !== item.price) {
        newFlashing[item.symbol] = item.price > prev ? "up" : "down"
      }
    })
    
    if (Object.keys(newFlashing).length > 0) {
      setFlashingItems(newFlashing)
      setTimeout(() => setFlashingItems({}), 1000)
    }
    
    const newPrices: Record<string, number> = {}
    tickerItems.forEach((item) => {
      newPrices[item.symbol] = item.price
    })
    setPrevPrices(newPrices)
  }, [stocksData, commoditiesData])

  if (tickerItems.length === 0) {
    return (
      <div className="w-full bg-card/50 border-b border-border py-2">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Loading market data...
        </div>
      </div>
    )
  }

  // Duplicate for seamless loop
  const duplicatedItems = [...tickerItems, ...tickerItems]

  return (
    <div className="w-full bg-card/80 backdrop-blur border-b border-border overflow-hidden">
      <div className="flex animate-ticker">
        {duplicatedItems.map((item, index) => (
          <TickerItemDisplay 
            key={`${item.symbol}-${index}`} 
            item={item} 
            isFlashing={flashingItems[item.symbol]}
          />
        ))}
      </div>
    </div>
  )
}

function TickerItemDisplay({ 
  item, 
  isFlashing 
}: { 
  item: TickerItem
  isFlashing?: "up" | "down"
}) {
  const isPositive = item.changePercent > 0
  const isNegative = item.changePercent < 0
  
  return (
    <div 
      className={cn(
        "flex items-center gap-3 px-6 py-2.5 border-r border-border transition-all duration-300",
        isFlashing === "up" && "bg-chart-1/20",
        isFlashing === "down" && "bg-chart-2/20"
      )}
    >
      {item.type === "commodity" && (
        <Gem className="h-4 w-4 text-accent" />
      )}
      
      <span className="font-semibold text-sm text-foreground whitespace-nowrap">
        {item.symbol}
      </span>
      
      <span className={cn(
        "font-mono text-sm font-medium whitespace-nowrap transition-all",
        isFlashing === "up" && "price-up",
        isFlashing === "down" && "price-down",
        !isFlashing && "text-foreground"
      )}>
        {item.currency === "CAD" ? "C$" : "$"}
        {item.price.toLocaleString(undefined, { 
          minimumFractionDigits: item.price < 1 ? 4 : 2,
          maximumFractionDigits: item.price < 1 ? 4 : 2
        })}
      </span>
      
      <div className={cn(
        "flex items-center gap-1 text-xs font-medium whitespace-nowrap",
        isPositive && "text-chart-1",
        isNegative && "text-chart-2",
        !isPositive && !isNegative && "text-muted-foreground"
      )}>
        {isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : isNegative ? (
          <TrendingDown className="h-3 w-3" />
        ) : (
          <Minus className="h-3 w-3" />
        )}
        <span>
          {isPositive && "+"}
          {item.changePercent.toFixed(2)}%
        </span>
      </div>
    </div>
  )
}

// Compact version for dashboard headers
export function CompactTicker() {
  const { data: stocksData } = useSWR("/api/stocks?market=tsx", fetcher, {
    refreshInterval: 60000,
  })
  
  const { data: economyData } = useSWR("/api/canada/economy", fetcher, {
    refreshInterval: 300000, // 5 minutes
  })

  const items = [
    ...(stocksData?.stocks?.slice(0, 5).map((s: { symbol: string; changePercent: number }) => ({
      label: s.symbol,
      value: `${s.changePercent > 0 ? "+" : ""}${s.changePercent.toFixed(2)}%`,
      isPositive: s.changePercent > 0,
      isNegative: s.changePercent < 0,
    })) || []),
    ...(economyData?.cadUsdRate ? [
      {
        label: "CAD/USD",
        value: economyData.cadUsdRate.value,
        isPositive: false,
        isNegative: false,
      },
      {
        label: "BoC Rate",
        value: `${economyData.interestRate?.value || "---"}%`,
        isPositive: false,
        isNegative: false,
      }
    ] : [])
  ]

  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-hide">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-xs whitespace-nowrap">
          <span className="text-muted-foreground">{item.label}</span>
          <span className={cn(
            "font-mono font-medium",
            item.isPositive && "text-chart-1",
            item.isNegative && "text-chart-2",
            !item.isPositive && !item.isNegative && "text-foreground"
          )}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  )
}
