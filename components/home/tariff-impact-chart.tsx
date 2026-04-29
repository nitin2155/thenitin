"use client"

import Link from "next/link"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Globe2, 
  ArrowRight,
  TrendingUp,
  ExternalLink,
  AlertTriangle,
  Handshake,
  RefreshCw,
  DollarSign,
  Fuel
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  Cell,
  LabelList
} from "recharts"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function TariffImpactChart() {
  const { data, error, isLoading } = useSWR('/api/trade', fetcher, {
    refreshInterval: 300000, // Refresh every 5 minutes
    revalidateOnFocus: true
  })
  
  if (isLoading) {
    return (
      <Card className="border-border bg-card/50 backdrop-blur">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2 mb-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
          <Skeleton className="h-28 w-full mb-4" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }
  
  if (error || !data?.data) {
    return (
      <Card className="border-border bg-card/50 backdrop-blur border-destructive/50">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Failed to load trade data</p>
        </CardContent>
      </Card>
    )
  }
  
  const tradeData = data.data
  const marketSentiment = data.marketSentiment
  
  // Format sector data for chart
  const sectorData = tradeData.sectorImpacts.map((sector: { sector: string; lossEstimate: number; jobsAffected: string }) => ({
    sector: sector.sector.split('/')[0].substring(0, 5), // Shorten names
    loss: sector.lossEstimate,
    color: sector.lossEstimate > 15 ? "#ef4444" : "#f97316",
    jobs: sector.jobsAffected
  }))
  
  return (
    <Link href="/dashboard/tariffs" className="block group">
      <Card className="border-border bg-card/50 backdrop-blur hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                <Globe2 className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Tariff Impact
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  Live Trade Analysis
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
              <Handshake className="h-3 w-3 mr-1" />
              Diversifying
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {/* Key Numbers Row with Live Data */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="p-2 rounded-lg bg-secondary/30 border border-border text-center">
              <p className="text-sm font-bold text-foreground">${tradeData.canadaUSExports}B</p>
              <p className="text-[9px] text-muted-foreground">US Exports</p>
            </div>
            <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
              <p className="text-sm font-bold text-destructive">${tradeData.atRiskValue}B</p>
              <p className="text-[9px] text-destructive/70">At Risk</p>
            </div>
            <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-center">
              <p className="text-sm font-bold text-accent">{(tradeData.jobsAtRisk / 1000).toFixed(0)}K</p>
              <p className="text-[9px] text-accent/70">Jobs Risk</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
              <p className="text-sm font-bold text-emerald-400">+${tradeData.newTradePartnerships}B</p>
              <p className="text-[9px] text-emerald-400/70">New Trade</p>
            </div>
          </div>
          
          {/* Live Market Indicators */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-blue-400" />
                  <span className="text-[10px] text-muted-foreground">CAD/USD</span>
                </div>
                <span className={`text-[10px] font-medium ${tradeData.currencyImpact.change24h >= 0 ? 'text-chart-1' : 'text-destructive'}`}>
                  {tradeData.currencyImpact.change24h >= 0 ? '+' : ''}{tradeData.currencyImpact.change24h.toFixed(2)}%
                </span>
              </div>
              <p className="text-sm font-bold text-blue-400">${tradeData.currencyImpact.cadUsd.toFixed(4)}</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Fuel className="h-3 w-3 text-amber-400" />
                  <span className="text-[10px] text-muted-foreground">WTI Oil</span>
                </div>
                <span className={`text-[10px] font-medium ${tradeData.oilImpact.change >= 0 ? 'text-chart-1' : 'text-destructive'}`}>
                  {tradeData.oilImpact.change >= 0 ? '+' : ''}{tradeData.oilImpact.change.toFixed(2)}%
                </span>
              </div>
              <p className="text-sm font-bold text-amber-400">${tradeData.oilImpact.wtiPrice.toFixed(2)}</p>
            </div>
          </div>
          
          {/* Sector Impact Bar Chart */}
          <div className="mb-4">
            <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
              Sector Losses (Billions CAD)
            </p>
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorData} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                  <XAxis type="number" domain={[0, 20]} hide />
                  <YAxis 
                    type="category" 
                    dataKey="sector" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }}
                    width={45}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [`-$${value}B`, 'Potential Loss']}
                  />
                  <Bar dataKey="loss" radius={[0, 4, 4, 0]} barSize={20}>
                    {sectorData.map((entry: { color: string }, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <LabelList 
                      dataKey="loss" 
                      position="right" 
                      formatter={(v: number) => `-$${v}B`}
                      style={{ fontSize: 12, fontWeight: 600, fill: '#ef4444' }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Trade Diversification - THE SILVER LINING */}
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 mb-4">
            <p className="text-xs font-semibold text-emerald-400 mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Trade Diversification Gains
            </p>
            <div className="grid grid-cols-4 gap-2">
              {tradeData.diversificationGains.slice(0, 4).map((partner: { country: string; flag: string; changePercent: number; tradeValue: number }) => (
                <div key={partner.country} className="text-center p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <div className="text-lg mb-0.5">{partner.flag}</div>
                  <p className="text-[9px] font-medium text-foreground mb-0.5">{partner.country.split(' ')[0]}</p>
                  <p className="text-sm font-bold text-emerald-400">+{partner.changePercent}%</p>
                  <p className="text-[9px] text-emerald-300/70">${partner.tradeValue}B</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Market Sentiment */}
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
            <Handshake className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Market sentiment:</span> {marketSentiment?.tradeWarSentiment || 'Neutral'} - Tariff threats accelerating deals with EU, UK, Indo-Pacific.
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Click for full trade analysis</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
