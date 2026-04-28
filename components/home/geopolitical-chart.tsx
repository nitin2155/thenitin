"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe2, ArrowRight, ExternalLink } from "lucide-react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  ReferenceLine
} from "recharts"

// Geopolitical events and their market impact
const geopoliticalData = [
  { month: "Jan 24", cad: 100, impact: "neutral", event: null },
  { month: "Feb 24", cad: 98, impact: "negative", event: "Russia-Ukraine escalation" },
  { month: "Mar 24", cad: 97, impact: "negative", event: null },
  { month: "Apr 24", cad: 99, impact: "neutral", event: null },
  { month: "May 24", cad: 98, impact: "neutral", event: null },
  { month: "Jun 24", cad: 96, impact: "negative", event: "US-China tensions" },
  { month: "Jul 24", cad: 95, impact: "negative", event: null },
  { month: "Aug 24", cad: 97, impact: "neutral", event: null },
  { month: "Sep 24", cad: 94, impact: "negative", event: "Middle East conflict" },
  { month: "Oct 24", cad: 93, impact: "negative", event: null },
  { month: "Nov 24", cad: 91, impact: "negative", event: "US tariff fears" },
  { month: "Dec 24", cad: 89, impact: "negative", event: null },
  { month: "Jan 25", cad: 87, impact: "negative", event: "Tariffs enacted" },
  { month: "Feb 25", cad: 86, impact: "negative", event: null },
  { month: "Mar 25", cad: 88, impact: "neutral", event: "Trade talks" },
]

const majorEvents = [
  { label: "Russia-Ukraine", date: "Feb 24", change: "-2%" },
  { label: "US-China Tensions", date: "Jun 24", change: "-3%" },
  { label: "Middle East", date: "Sep 24", change: "-4%" },
  { label: "US Tariffs", date: "Nov 24", change: "-5%" },
]

export function GeopoliticalChart() {
  const currentValue = geopoliticalData[geopoliticalData.length - 1].cad
  const startValue = geopoliticalData[0].cad
  const totalChange = ((currentValue - startValue) / startValue * 100)
  
  return (
    <Link href="/dashboard/geopolitics" className="block group">
      <Card className="border-border bg-card/50 backdrop-blur hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Globe2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Geopolitical Impact
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <p className="text-xs text-muted-foreground">CAD vs Global Events</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
              {totalChange.toFixed(1)}% YTD
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {/* Chart */}
          <div className="h-44 w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={geopoliticalData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="cadGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                  interval={2}
                />
                <YAxis 
                  domain={[80, 105]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(v) => v}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                  formatter={(value: number) => [`Index: ${value}`, 'CAD Strength']}
                  labelFormatter={(label) => {
                    const point = geopoliticalData.find(d => d.month === label)
                    return point?.event ? `${label} - ${point.event}` : label
                  }}
                />
                <ReferenceLine y={100} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" strokeOpacity={0.3} />
                {/* Event markers */}
                <ReferenceLine x="Feb 24" stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
                <ReferenceLine x="Sep 24" stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
                <ReferenceLine x="Nov 24" stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
                <Area
                  type="monotone"
                  dataKey="cad"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  fill="url(#cadGradient)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#22d3ee' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Major Events Timeline */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {majorEvents.map((event) => (
              <div 
                key={event.label}
                className="p-2 rounded-lg bg-destructive/5 border border-destructive/10 text-center"
              >
                <p className="text-[10px] font-medium text-foreground truncate">{event.label}</p>
                <p className="text-xs font-bold text-destructive">{event.change}</p>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Click for detailed event analysis</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
