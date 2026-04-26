"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  X,
  ChevronRight,
  Globe2,
  Landmark,
  Bitcoin
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Alert {
  id: string
  type: "gain" | "loss" | "news" | "economic" | "crypto"
  severity: "high" | "medium" | "low"
  title: string
  description: string
  timestamp: Date
  link?: string
  symbol?: string
  value?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function MarketAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [isExpanded, setIsExpanded] = useState(false)
  
  const { data: stocksData } = useSWR("/api/stocks?market=all", fetcher, {
    refreshInterval: 60000,
  })
  
  const { data: cryptoData } = useSWR("/api/crypto", fetcher, {
    refreshInterval: 60000,
  })
  
  const { data: newsData } = useSWR("/api/news", fetcher, {
    refreshInterval: 300000,
  })

  // Generate alerts from market data
  useEffect(() => {
    const newAlerts: Alert[] = []
    
    // Stock alerts - significant movers (>3%)
    if (stocksData?.stocks) {
      stocksData.stocks.forEach((stock: { symbol: string; name: string; changePercent: number }) => {
        if (Math.abs(stock.changePercent) >= 3) {
          newAlerts.push({
            id: `stock-${stock.symbol}`,
            type: stock.changePercent > 0 ? "gain" : "loss",
            severity: Math.abs(stock.changePercent) >= 5 ? "high" : "medium",
            title: `${stock.symbol} ${stock.changePercent > 0 ? "surging" : "dropping"}`,
            description: `${stock.name} is ${stock.changePercent > 0 ? "up" : "down"} ${Math.abs(stock.changePercent).toFixed(2)}% today`,
            timestamp: new Date(),
            link: "/dashboard/stocks",
            symbol: stock.symbol,
            value: `${stock.changePercent > 0 ? "+" : ""}${stock.changePercent.toFixed(2)}%`
          })
        }
      })
    }
    
    // Crypto alerts - significant movers (>5%)
    if (cryptoData?.coins) {
      cryptoData.coins.forEach((coin: { symbol: string; name: string; change24h: number }) => {
        if (Math.abs(coin.change24h) >= 5) {
          newAlerts.push({
            id: `crypto-${coin.symbol}`,
            type: "crypto",
            severity: Math.abs(coin.change24h) >= 10 ? "high" : "medium",
            title: `${coin.symbol.toUpperCase()} ${coin.change24h > 0 ? "rallying" : "falling"}`,
            description: `${coin.name} moved ${coin.change24h > 0 ? "up" : "down"} ${Math.abs(coin.change24h).toFixed(2)}% in 24h`,
            timestamp: new Date(),
            link: "/dashboard/crypto",
            symbol: coin.symbol.toUpperCase(),
            value: `${coin.change24h > 0 ? "+" : ""}${coin.change24h.toFixed(2)}%`
          })
        }
      })
    }
    
    // News alerts - high impact only
    if (newsData?.articles) {
      newsData.articles
        .filter((article: { impactLevel: string }) => article.impactLevel === "high")
        .slice(0, 3)
        .forEach((article: { id: string; title: string; category: string }, i: number) => {
          newAlerts.push({
            id: `news-${article.id || i}`,
            type: "news",
            severity: "high",
            title: "Breaking News",
            description: article.title,
            timestamp: new Date(),
            link: "/dashboard/geopolitics"
          })
        })
    }
    
    // Sort by severity
    newAlerts.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 }
      return severityOrder[a.severity] - severityOrder[b.severity]
    })
    
    setAlerts(newAlerts)
  }, [stocksData, cryptoData, newsData])

  const visibleAlerts = alerts.filter(a => !dismissed.has(a.id))
  const highPriorityCount = visibleAlerts.filter(a => a.severity === "high").length

  if (visibleAlerts.length === 0) {
    return null
  }

  const displayedAlerts = isExpanded ? visibleAlerts : visibleAlerts.slice(0, 3)

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="h-5 w-5 text-primary" />
            {highPriorityCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-chart-2 text-[10px] font-bold text-white">
                {highPriorityCount}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-foreground">Market Alerts</h3>
          <span className="text-xs text-muted-foreground">
            ({visibleAlerts.length} active)
          </span>
        </div>
        
        {visibleAlerts.length > 3 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            {isExpanded ? "Show less" : `Show all (${visibleAlerts.length})`}
          </Button>
        )}
      </div>

      {/* Alert List */}
      <div className="space-y-2">
        {displayedAlerts.map((alert) => (
          <AlertItem 
            key={alert.id} 
            alert={alert} 
            onDismiss={() => setDismissed(prev => new Set([...prev, alert.id]))}
          />
        ))}
      </div>
    </div>
  )
}

function AlertItem({ 
  alert, 
  onDismiss 
}: { 
  alert: Alert
  onDismiss: () => void 
}) {
  const icons = {
    gain: TrendingUp,
    loss: TrendingDown,
    news: Globe2,
    economic: Landmark,
    crypto: Bitcoin
  }
  
  const Icon = icons[alert.type]
  
  const colors = {
    high: {
      border: "border-chart-2/50",
      bg: "bg-chart-2/10",
      icon: alert.type === "gain" ? "text-chart-1" : "text-chart-2"
    },
    medium: {
      border: "border-accent/50",
      bg: "bg-accent/10",
      icon: alert.type === "gain" ? "text-chart-1" : alert.type === "loss" ? "text-chart-2" : "text-accent"
    },
    low: {
      border: "border-border",
      bg: "bg-secondary/50",
      icon: "text-muted-foreground"
    }
  }
  
  const style = colors[alert.severity]

  return (
    <div className={cn(
      "group flex items-start gap-3 p-3 rounded-lg border transition-all",
      style.border,
      style.bg,
      "hover:border-primary/30"
    )}>
      <div className={cn("mt-0.5", style.icon)}>
        <Icon className="h-4 w-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-medium text-sm text-foreground">{alert.title}</span>
          {alert.value && (
            <span className={cn(
              "text-xs font-mono font-medium px-1.5 py-0.5 rounded",
              alert.type === "gain" ? "bg-chart-1/20 text-chart-1" : 
              alert.type === "loss" || (alert.type === "crypto" && alert.value.startsWith("-")) 
                ? "bg-chart-2/20 text-chart-2" 
                : "bg-chart-1/20 text-chart-1"
            )}>
              {alert.value}
            </span>
          )}
          {alert.severity === "high" && (
            <AlertTriangle className="h-3 w-3 text-chart-2" />
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {alert.description}
        </p>
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {alert.link && (
          <Link href={alert.link}>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Floating alert notification for critical alerts
export function FloatingAlert() {
  const [show, setShow] = useState(false)
  const [alert, setAlert] = useState<Alert | null>(null)
  
  const { data: stocksData } = useSWR("/api/stocks?market=all", fetcher, {
    refreshInterval: 60000,
  })

  useEffect(() => {
    if (stocksData?.stocks) {
      // Find any stock with >5% move
      const bigMover = stocksData.stocks.find(
        (s: { changePercent: number }) => Math.abs(s.changePercent) >= 5
      )
      
      if (bigMover) {
        setAlert({
          id: bigMover.symbol,
          type: bigMover.changePercent > 0 ? "gain" : "loss",
          severity: "high",
          title: `${bigMover.symbol} Major Move`,
          description: `${bigMover.changePercent > 0 ? "Up" : "Down"} ${Math.abs(bigMover.changePercent).toFixed(2)}%`,
          timestamp: new Date(),
          symbol: bigMover.symbol,
          value: `${bigMover.changePercent > 0 ? "+" : ""}${bigMover.changePercent.toFixed(2)}%`
        })
        setShow(true)
        
        // Auto-dismiss after 10 seconds
        setTimeout(() => setShow(false), 10000)
      }
    }
  }, [stocksData])

  if (!show || !alert) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in">
      <div className={cn(
        "flex items-center gap-3 p-4 rounded-lg border shadow-lg",
        alert.type === "gain" 
          ? "bg-chart-1/10 border-chart-1/50 glow-green" 
          : "bg-chart-2/10 border-chart-2/50 glow-red"
      )}>
        {alert.type === "gain" ? (
          <TrendingUp className="h-5 w-5 text-chart-1" />
        ) : (
          <TrendingDown className="h-5 w-5 text-chart-2" />
        )}
        
        <div>
          <p className="font-semibold text-foreground">{alert.title}</p>
          <p className="text-sm text-muted-foreground">{alert.description}</p>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShow(false)}
          className="ml-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
