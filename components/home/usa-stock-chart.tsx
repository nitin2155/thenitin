"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  ExternalLink
} from "lucide-react"

// US Stock data simulation
const usStocks = [
  { symbol: "SPY", name: "S&P 500 ETF", price: 587.42, change: 1.23, changePercent: 0.21 },
  { symbol: "QQQ", name: "Nasdaq 100 ETF", price: 512.18, change: -2.45, changePercent: -0.48 },
  { symbol: "AAPL", name: "Apple Inc", price: 198.75, change: 3.21, changePercent: 1.64 },
  { symbol: "MSFT", name: "Microsoft", price: 445.32, change: 5.67, changePercent: 1.29 },
  { symbol: "NVDA", name: "NVIDIA", price: 924.15, change: 18.45, changePercent: 2.04 },
  { symbol: "GOOGL", name: "Alphabet", price: 178.92, change: -1.23, changePercent: -0.68 },
]

function Sparkline({ data, isPositive }: { data: number[], isPositive: boolean }) {
  if (data.length < 2) return null
  
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')
  
  return (
    <svg 
      viewBox="0 0 100 100" 
      className="w-16 h-6"
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? "#22c55e" : "#ef4444"}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function USAStockChart() {
  const [sparklineData, setSparklineData] = useState<Record<string, number[]>>({})
  
  useEffect(() => {
    const newSparklines: Record<string, number[]> = {}
    usStocks.forEach((stock) => {
      const basePrice = stock.price / (1 + stock.changePercent / 100)
      const points: number[] = []
      for (let i = 0; i < 20; i++) {
        const progress = i / 19
        const randomVariation = (Math.random() - 0.5) * 0.02 * basePrice
        const trendValue = basePrice + (stock.price - basePrice) * progress
        points.push(trendValue + randomVariation)
      }
      points[points.length - 1] = stock.price
      newSparklines[stock.symbol] = points
    })
    setSparklineData(newSparklines)
  }, [])
  
  const gainers = usStocks.filter(s => s.changePercent > 0).length
  const losers = usStocks.filter(s => s.changePercent < 0).length

  return (
    <Link href="/dashboard/stocks?market=us" className="block group">
      <Card className="border-border bg-card/50 backdrop-blur hover:border-blue-500/50 transition-all hover:bg-card/80 h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  US Markets
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <p className="text-xs text-muted-foreground">S&P 500, Nasdaq, Tech</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20 text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                {gainers}
              </Badge>
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                <TrendingDown className="h-3 w-3 mr-1" />
                {losers}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-2 gap-2">
            {usStocks.map((stock) => {
              const isPositive = stock.changePercent >= 0
              return (
                <div 
                  key={stock.symbol}
                  className="p-2.5 rounded-lg bg-secondary/30 border border-border hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-foreground">{stock.symbol}</span>
                    <Sparkline 
                      data={sparklineData[stock.symbol] || [stock.price, stock.price]} 
                      isPositive={isPositive} 
                    />
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-sm font-bold text-foreground">
                      ${stock.price.toFixed(2)}
                    </p>
                    <p className={`text-xs font-medium ${isPositive ? 'text-chart-1' : 'text-destructive'}`}>
                      {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
            <span className="text-[10px] text-muted-foreground">View all US stocks</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-blue-500 transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
