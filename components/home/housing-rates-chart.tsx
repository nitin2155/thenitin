"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Home as HomeIcon, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ExternalLink
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  ReferenceLine,
  Area,
  ComposedChart
} from "recharts"

// Historical data: Housing prices vs BoC interest rates (3 years)
// Affordability = % of median income needed for mortgage payments (lower is better)
const historicalData = [
  { month: "Jan 22", housing: 816, rate: 0.25, affordability: 45, label: "Peak" },
  { month: "Mar 22", housing: 796, rate: 0.50, affordability: 48 },
  { month: "Jun 22", housing: 745, rate: 1.50, affordability: 52 },
  { month: "Sep 22", housing: 710, rate: 3.25, affordability: 58 },
  { month: "Dec 22", housing: 685, rate: 4.25, affordability: 62 },
  { month: "Mar 23", housing: 680, rate: 4.50, affordability: 65, label: "Bottom" },
  { month: "Jun 23", housing: 695, rate: 4.75, affordability: 68 },
  { month: "Sep 23", housing: 700, rate: 5.00, affordability: 72, label: "Peak Rate" },
  { month: "Dec 23", housing: 705, rate: 5.00, affordability: 71 },
  { month: "Mar 24", housing: 710, rate: 5.00, affordability: 70 },
  { month: "Jun 24", housing: 715, rate: 4.75, affordability: 66, label: "Cut" },
  { month: "Sep 24", housing: 720, rate: 4.25, affordability: 62 },
  { month: "Dec 24", housing: 718, rate: 3.75, affordability: 58 },
  { month: "Mar 25", housing: 720, rate: 3.25, affordability: 55, label: "Now" },
]

// Key insights
const insights = [
  {
    title: "The Correlation",
    description: "Rates up 4.75% → Housing down 17%",
    icon: TrendingDown,
    color: "text-destructive"
  },
  {
    title: "Recovery",
    description: "Rate cuts stabilizing prices",
    icon: TrendingUp,
    color: "text-chart-1"
  },
  {
    title: "Warning",
    description: "1.2M mortgages renewing 2025",
    icon: AlertTriangle,
    color: "text-accent"
  }
]

export function HousingRatesChart() {
  const currentHousing = historicalData[historicalData.length - 1].housing
  const peakHousing = Math.max(...historicalData.map(d => d.housing))
  const housingChange = ((currentHousing - peakHousing) / peakHousing * 100)
  
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
                  Housing vs Interest Rates
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <p className="text-xs text-muted-foreground">3-Year Inverse Correlation</p>
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
                <ReferenceLine yAxisId="housing" y={816} stroke="#f97316" strokeDasharray="3 3" strokeOpacity={0.5} />
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
              <span className="text-[10px] text-muted-foreground">Home Price</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-0.5 bg-[#22d3ee] rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #22d3ee 0, #22d3ee 3px, transparent 3px, transparent 6px)' }} />
              <span className="text-[10px] text-muted-foreground">BoC Rate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-0.5 bg-[#ef4444] rounded" />
              <span className="text-[10px] text-muted-foreground">Affordability Impact</span>
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
            <span className="text-xs text-muted-foreground">Click for 2010-2025 housing timeline</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
