"use client"

import Link from "next/link"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Home as HomeIcon, 
  ArrowRight,
  TrendingDown,
  ExternalLink,
  RefreshCw,
  AlertTriangle
} from "lucide-react"
import { 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  Area,
  ComposedChart,
  Line
} from "recharts"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function USAHousingChart() {
  const { data, error, isLoading } = useSWR('/api/housing?market=US', fetcher, {
    refreshInterval: 300000, // Refresh every 5 minutes
    revalidateOnFocus: true
  })
  
  if (isLoading) {
    return (
      <Card className="border-border bg-card/50 backdrop-blur h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-36 w-full mb-3" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (error || !data?.data) {
    return (
      <Card className="border-border bg-card/50 backdrop-blur border-destructive/50 h-full">
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
  const currentRate = housingData.centralBankRate
  
  return (
    <Link href="/dashboard/housing?market=us" className="block group">
      <Card className="border-border bg-card/50 backdrop-blur hover:border-blue-500/50 transition-all h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <HomeIcon className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  US Housing
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  Live - Fed Rate Impact
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
              {housingChange.toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-36 w-full mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={historicalData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="usHousingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                  interval={3}
                />
                <YAxis 
                  yAxisId="housing"
                  domain={[350, 450]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: '#f97316' }}
                  tickFormatter={(v) => `$${v}K`}
                />
                <YAxis 
                  yAxisId="rate"
                  orientation="right"
                  domain={[0, 6]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: '#3b82f6' }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'housing') return [`$${value}K`, 'Median Home']
                    return [`${value}%`, 'Fed Rate']
                  }}
                />
                <Area
                  yAxisId="housing"
                  type="monotone"
                  dataKey="housing"
                  stroke="#f97316"
                  strokeWidth={2}
                  fill="url(#usHousingGrad)"
                  dot={false}
                />
                <Line
                  yAxisId="rate"
                  type="stepAfter"
                  dataKey="rate"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-2 rounded-lg bg-secondary/30 border border-border">
              <div className="flex items-center gap-1 mb-0.5">
                <HomeIcon className="h-3 w-3 text-orange-500" />
                <span className="text-[10px] text-muted-foreground">Median Price</span>
              </div>
              <p className="text-sm font-bold text-foreground">${currentHousing}K</p>
            </div>
            <div className="p-2 rounded-lg bg-secondary/30 border border-border">
              <div className="flex items-center gap-1 mb-0.5">
                <TrendingDown className="h-3 w-3 text-blue-500" />
                <span className="text-[10px] text-muted-foreground">Fed Rate</span>
              </div>
              <p className="text-sm font-bold text-foreground">{currentRate}%</p>
            </div>
          </div>
          
          {/* Mortgage Rate Estimate */}
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">30Y Mortgage Rate</span>
              <span className="text-xs font-bold text-blue-400">{housingData.mortgageRate30Y?.toFixed(2) || "6.9"}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-[10px] text-muted-foreground">Compare with Canadian housing</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-blue-500 transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
