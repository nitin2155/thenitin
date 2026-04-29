"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  RefreshCw,
  ExternalLink
} from "lucide-react"

interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  exchange: string
  currency: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

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
  
  const { data, isLoading, error } = useSWR<{ stocks: StockData[] }>(
    '/api/stocks?market=us',
    fetcher,
    { refreshInterval: 60000 }
  )
  
  useEffect(() => {
    if (data?.stocks) {
      const newSparklines: Record<string, number[]> = {}
      data.stocks.slice(0, 6).forEach((stock) => {
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
    }
  }, [data])
  
  const topStocks = data?.stocks?.slice(0, 6) || []
  const gainers = topStocks.filter(s => s.changePercent > 0).length
  const losers = topStocks.filter(s => s.changePercent < 0).length
  
  if (error) {
    return (
      <Card className="border-border bg-card/50 backdrop-blur h-full">
        <CardContent className="p-6 text-center text-muted-foreground">
          Unable to load stock data
        </CardContent>
      </Card>
    )
  }

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
                <p className="text-xs text-muted-foreground">S&P 500, Nasdaq, Tech in USD</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin" />
              ) : (
                <>
                  <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20 text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {gainers}
                  </Badge>
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {losers}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-secondary/50 animate-pulse h-16" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {topStocks.map((stock) => {
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
          )}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
            <span className="text-[10px] text-muted-foreground">View all US stocks</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-blue-500 transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
