"use client"

import Link from "next/link"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Home as HomeIcon, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ExternalLink,
  RefreshCw
} from "lucide-react"
import { 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  ReferenceLine,
  Area,
  ComposedChart,
  Line
} from "recharts"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function HousingRatesChart() {
  const { data, error, isLoading } = useSWR('/api/housing?market=CA', fetcher, {
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
              <Skeleton className="h-5 w-40 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-52 w-full mb-4" />
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (error || !data?.data) {
    return (
      <Card className="border-border bg-card/50 backdrop-blur border-destructive/50">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Failed to load housing data</p>
        </CardContent>
      </Card>
    )
  }
  
  const housingData = data.data
  const historicalData = housingData.historicalData
  const currentHousing = housingData.currentMedianPrice
  const peakHousing = Math.max(...historicalData.map((d: { housing: number }) => d.housing))
  const housingChange = ((currentHousing - peakHousing) / peakHousing * 100)
  
  const insights = [
    {
      title: "The Correlation",
      description: `Rates up → Housing ${housingChange < 0 ? 'down' : 'up'} ${Math.abs(housingChange).toFixed(0)}%`,
      icon: housingChange < 0 ? TrendingDown : TrendingUp,
      color: housingChange < 0 ? "text-destructive" : "text-chart-1"
    },
    {
      title: "BoC Rate",
      description: `${housingData.centralBankRate}% (${housingData.rateChange > 0 ? '+' : ''}${housingData.rateChange}%)`,
      icon: housingData.rateChange < 0 ? TrendingDown : TrendingUp,
      color: housingData.rateChange < 0 ? "text-chart-1" : "text-destructive"
    },
    {
      title: "Affordability",
      description: `${housingData.affordabilityIndex}% of income`,
      icon: AlertTriangle,
      color: housingData.affordabilityIndex > 60 ? "text-destructive" : "text-accent"
    }
  ]
  
  return (
    <Link href="/dashboard/housing" className="block group">
      <Card className="border-border bg-card/50 backdrop-blur hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-5/10 border border-chart-5/20">
                <HomeIcon className="h-5 w-5 text-chart-5" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Housing vs BoC Rates
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  Live Data - 5min refresh
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
              {housingChange.toFixed(1)}% from peak
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {/* Recharts Line Chart */}
          <div className="h-52 w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={historicalData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="housingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  interval={2}
                />
                <YAxis 
                  yAxisId="housing"
                  orientation="left"
                  domain={[650, 850]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#f97316' }}
                  tickFormatter={(v) => `$${v}K`}
                />
                <YAxis 
                  yAxisId="rate"
                  orientation="right"
                  domain={[0, 6]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#22d3ee' }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'housing') return [`C$${value}K`, 'Avg Home Price']
                    if (name === 'affordability') return [`${value}%`, 'Income for Mortgage']
                    return [`${value}%`, 'BoC Rate']
                  }}
                />
                <ReferenceLine yAxisId="housing" y={peakHousing} stroke="#f97316" strokeDasharray="3 3" strokeOpacity={0.5} />
                <Area
                  yAxisId="housing"
                  type="monotone"
                  dataKey="housing"
                  stroke="#f97316"
                  strokeWidth={3}
                  fill="url(#housingGradient)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#f97316' }}
                />
                <Line
                  yAxisId="rate"
                  type="stepAfter"
                  dataKey="rate"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  strokeDasharray="8 4"
                  dot={false}
                  activeDot={{ r: 5, fill: '#22d3ee' }}
                />
                <Line
                  yAxisId="rate"
                  type="monotone"
                  dataKey="affordability"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#ef4444' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-1 bg-[#f97316] rounded" />
              <span className="text-[10px] text-muted-foreground">Home Price (C${currentHousing}K)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-0.5 bg-[#22d3ee] rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #22d3ee 0, #22d3ee 3px, transparent 3px, transparent 6px)' }} />
              <span className="text-[10px] text-muted-foreground">BoC Rate ({housingData.centralBankRate}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-0.5 bg-[#ef4444] rounded" />
              <span className="text-[10px] text-muted-foreground">Affordability</span>
            </div>
          </div>
          
          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-2">
            {insights.map((insight) => (
              <div 
                key={insight.title}
                className="p-2.5 rounded-lg bg-secondary/30 border border-border"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <insight.icon className={`h-3.5 w-3.5 ${insight.color}`} />
                  <span className="text-xs font-medium text-foreground">{insight.title}</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">{insight.description}</p>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Click for detailed housing analysis</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
