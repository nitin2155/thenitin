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

// Mini sparkline component
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
      className="w-20 h-8"
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? "hsl(var(--chart-1))" : "hsl(var(--destructive))"}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function StockLineChart() {
  const [sparklineData, setSparklineData] = useState<Record<string, number[]>>({})
  
  const { data, isLoading, error } = useSWR<{ stocks: StockData[] }>(
    '/api/stocks?market=all',
    fetcher,
    { refreshInterval: 60000 }
  )
  
  // Generate sparkline data for visualization
  useEffect(() => {
    if (data?.stocks) {
      const newSparklines: Record<string, number[]> = {}
      data.stocks.slice(0, 8).forEach((stock) => {
        // Generate realistic-looking price history based on current price and change
        const basePrice = stock.price / (1 + stock.changePercent / 100)
        const points: number[] = []
        for (let i = 0; i < 20; i++) {
          const progress = i / 19
          const randomVariation = (Math.random() - 0.5) * 0.02 * basePrice
          const trendValue = basePrice + (stock.price - basePrice) * progress
          points.push(trendValue + randomVariation)
        }
        points[points.length - 1] = stock.price // Ensure last point is current price
        newSparklines[stock.symbol] = points
      })
      setSparklineData(newSparklines)
    }
  }, [data])
  
  const topStocks = data?.stocks?.slice(0, 8) || []
  const gainers = topStocks.filter(s => s.changePercent > 0).length
  const losers = topStocks.filter(s => s.changePercent < 0).length
  
  if (error) {
    return (
      <Card className="border-border bg-card/50 backdrop-blur">
        <CardContent className="p-6 text-center text-muted-foreground">
          Unable to load stock data
        </CardContent>
      </Card>
    )
  }

  return (
    <Link href="/dashboard/stocks" className="block group">
      <Card className="border-border bg-card/50 backdrop-blur hover:border-primary/50 transition-all hover:bg-card/80">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-1/10 border border-chart-1/20">
                <TrendingUp className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Live Stock Markets
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <p className="text-xs text-muted-foreground">TSX &amp; US Stocks in CAD</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin" />
              ) : (
                <>
                  <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {gainers}
                  </Badge>
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="p-3 rounded-lg bg-secondary/50 animate-pulse h-20" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {topStocks.map((stock) => {
                const isPositive = stock.changePercent >= 0
                return (
                  <div 
                    key={stock.symbol}
                    className="p-3 rounded-lg bg-secondary/30 border border-border hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-foreground">{stock.symbol}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] px-1.5 py-0 ${
                          stock.exchange === 'TSX' 
                            ? 'bg-primary/10 text-primary border-primary/20' 
                            : 'bg-muted text-muted-foreground border-border'
                        }`}
                      >
                        {stock.exchange}
                      </Badge>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-lg font-bold text-foreground">
                          C${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className={`text-xs font-medium ${isPositive ? 'text-chart-1' : 'text-destructive'}`}>
                          {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </p>
                      </div>
                      <Sparkline 
                        data={sparklineData[stock.symbol] || [stock.price, stock.price]} 
                        isPositive={isPositive} 
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Click to see all stocks with geopolitical analysis</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
