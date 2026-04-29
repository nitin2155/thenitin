"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Home as HomeIcon, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  ExternalLink
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  Area,
  ComposedChart
} from "recharts"

// US Housing data: Median home prices vs Fed Funds Rate
const usHousingData = [
  { month: "Jan 22", housing: 375, rate: 0.25 },
  { month: "Apr 22", housing: 391, rate: 0.50 },
  { month: "Jul 22", housing: 403, rate: 2.50 },
  { month: "Oct 22", housing: 379, rate: 4.00 },
  { month: "Jan 23", housing: 361, rate: 4.50 },
  { month: "Apr 23", housing: 388, rate: 5.00 },
  { month: "Jul 23", housing: 416, rate: 5.25 },
  { month: "Oct 23", housing: 391, rate: 5.50 },
  { month: "Jan 24", housing: 379, rate: 5.50 },
  { month: "Apr 24", housing: 407, rate: 5.50 },
  { month: "Jul 24", housing: 427, rate: 5.25 },
  { month: "Oct 24", housing: 418, rate: 4.75 },
  { month: "Jan 25", housing: 396, rate: 4.50 },
  { month: "Apr 25", housing: 402, rate: 4.25 },
]

export function USAHousingChart() {
  const currentHousing = usHousingData[usHousingData.length - 1].housing
  const peakHousing = Math.max(...usHousingData.map(d => d.housing))
  const housingChange = ((currentHousing - peakHousing) / peakHousing * 100)
  const currentRate = usHousingData[usHousingData.length - 1].rate
  
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
                <p className="text-xs text-muted-foreground">Median Price vs Fed Rate</p>
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
              <ComposedChart data={usHousingData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
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
          
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-[10px] text-muted-foreground">Compare with Canadian housing</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-blue-500 transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
