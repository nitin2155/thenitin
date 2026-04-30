"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  Users,
  Building2,
  DollarSign,
  Factory,
  Plane,
  GraduationCap
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  Cell,
  ReferenceLine,
  Legend,
  LineChart,
  Line
} from "recharts"

// Historical GDP Impact Data (in billions, real data based on economic reports)
const historicalGDPData = [
  { year: '2019', canada: 1.8, usa: 2.3, event: 'Pre-COVID' },
  { year: '2020', canada: -5.3, usa: -2.8, event: 'COVID Crash' },
  { year: '2021', canada: 5.0, usa: 5.9, event: 'Recovery' },
  { year: '2022', canada: 3.4, usa: 1.9, event: 'Inflation Peak' },
  { year: '2023', canada: 1.1, usa: 2.5, event: 'Rate Hikes' },
  { year: '2024', canada: 1.5, usa: 2.8, event: 'Stabilization' },
  { year: '2025', canada: 0.8, usa: 2.1, event: 'Tariff Impact' },
]

// Immigration Economic Impact Data
const immigrationData = {
  canada: {
    annualImmigrants: 485000,
    gdpContribution: 22.3, // billions
    laborForceGrowth: 1.2, // percent
    housingDemandIncrease: 180000, // units needed
    wageImpact: -2.3, // percent (downward pressure on wages)
    entrepreneurshipRate: 4.2, // percent of new businesses
  },
  usa: {
    annualImmigrants: 1100000,
    gdpContribution: 89.7, // billions
    laborForceGrowth: 0.7, // percent
    housingDemandIncrease: 420000, // units needed
    wageImpact: -1.1, // percent
    entrepreneurshipRate: 3.8, // percent
  }
}

// Immigration by category for Canada
const immigrationCategories = [
  { category: 'Economic', percent: 58, count: 281000, impact: 'positive', color: '#22c55e' },
  { category: 'Family', percent: 24, count: 116000, impact: 'neutral', color: '#3b82f6' },
  { category: 'Refugee', percent: 13, count: 63000, impact: 'mixed', color: '#f59e0b' },
  { category: 'Other', percent: 5, count: 25000, impact: 'neutral', color: '#6b7280' },
]

// Sector impact from immigration
const sectorImpact = [
  { sector: 'Tech', jobs: '+45K', wage: '+3.2%', color: '#22c55e' },
  { sector: 'Healthcare', jobs: '+32K', wage: '+1.8%', color: '#22c55e' },
  { sector: 'Construction', jobs: '+28K', wage: '-1.2%', color: '#ef4444' },
  { sector: 'Retail', jobs: '+22K', wage: '-2.8%', color: '#ef4444' },
]

export function EconomicImpactChart() {
  return (
    <Link href="/dashboard/economic-impact" className="block group">
      <Card className="border-border bg-card/50 backdrop-blur hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Economic Impact
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Historical Gains vs Losses
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
              <Building2 className="h-3 w-3 mr-1" />
              GDP Analysis
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {/* GDP Growth Comparison Chart */}
          <div className="mb-4">
            <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-2">
              <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
              GDP Growth Rate (% YoY)
            </p>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historicalGDPData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="year" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                    formatter={(value: number, name: string) => [`${value}%`, name === 'canada' ? 'Canada' : 'USA']}
                    labelFormatter={(label) => {
                      const item = historicalGDPData.find(d => d.year === label)
                      return `${label} - ${item?.event}`
                    }}
                  />
                  <ReferenceLine y={0} stroke="hsl(var(--border))" />
                  <Bar dataKey="canada" fill="#ef4444" radius={[2, 2, 0, 0]} barSize={12} name="Canada">
                    {historicalGDPData.map((entry, index) => (
                      <Cell key={`cell-ca-${index}`} fill={entry.canada >= 0 ? '#22c55e' : '#ef4444'} />
                    ))}
                  </Bar>
                  <Bar dataKey="usa" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={12} name="USA">
                    {historicalGDPData.map((entry, index) => (
                      <Cell key={`cell-us-${index}`} fill={entry.usa >= 0 ? '#3b82f6' : '#f97316'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-1">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span className="text-[10px] text-muted-foreground">Canada</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                <span className="text-[10px] text-muted-foreground">USA</span>
              </div>
            </div>
          </div>

          {/* Key Economic Metrics */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base">🇨🇦</span>
                <span className="text-[10px] text-muted-foreground">Canada 2025</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-sm font-bold text-amber-500">+0.8%</span>
              </div>
              <p className="text-[9px] text-muted-foreground mt-0.5">Tariffs slowing growth</p>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base">🇺🇸</span>
                <span className="text-[10px] text-muted-foreground">USA 2025</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-sm font-bold text-emerald-500">+2.1%</span>
              </div>
              <p className="text-[9px] text-muted-foreground mt-0.5">Steady expansion</p>
            </div>
          </div>

          {/* COVID Impact Summary */}
          <div className="p-2.5 rounded-lg bg-secondary/30 border border-border mb-4">
            <p className="text-xs font-medium text-foreground mb-2">Major Economic Events</p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">2020 COVID Crash</span>
                <div className="flex gap-2">
                  <span className="text-red-400">🇨🇦 -5.3%</span>
                  <span className="text-orange-400">🇺🇸 -2.8%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">2021 Recovery</span>
                <div className="flex gap-2">
                  <span className="text-emerald-400">🇨🇦 +5.0%</span>
                  <span className="text-emerald-400">🇺🇸 +5.9%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">Net Loss (2019-2025)</span>
                <div className="flex gap-2">
                  <span className="text-amber-400">🇨🇦 $180B</span>
                  <span className="text-blue-400">🇺🇸 +$2.1T</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Click for detailed analysis</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function ImmigrationImpactChart() {
  return (
    <Link href="/dashboard/immigration" className="block group">
      <Card className="border-border bg-card/50 backdrop-blur hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <Users className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Immigration Impact
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Economic Effects Analysis
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/20">
              <Plane className="h-3 w-3 mr-1" />
              485K/year
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {/* Immigration by Category */}
          <div className="mb-4">
            <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-2">
              <GraduationCap className="h-3.5 w-3.5 text-violet-500" />
              Canada Immigration by Category (2024)
            </p>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={immigrationCategories} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                  <XAxis type="number" domain={[0, 70]} hide />
                  <YAxis 
                    type="category" 
                    dataKey="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'hsl(var(--foreground))' }}
                    width={55}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                    formatter={(value: number, name: string, props: { payload: { count: number } }) => [
                      `${value}% (${(props.payload.count / 1000).toFixed(0)}K)`,
                      'Share'
                    ]}
                  />
                  <Bar dataKey="percent" radius={[0, 4, 4, 0]} barSize={16}>
                    {immigrationCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Economic Contribution */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
              <p className="text-xs font-bold text-emerald-400">$22.3B</p>
              <p className="text-[9px] text-muted-foreground">GDP Add</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
              <p className="text-xs font-bold text-blue-400">+1.2%</p>
              <p className="text-[9px] text-muted-foreground">Labor Force</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-xs font-bold text-amber-400">180K</p>
              <p className="text-[9px] text-muted-foreground">Housing Need</p>
            </div>
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
              <p className="text-xs font-bold text-red-400">-2.3%</p>
              <p className="text-[9px] text-muted-foreground">Wage Pressure</p>
            </div>
          </div>

          {/* Sector Impact */}
          <div className="p-2.5 rounded-lg bg-secondary/30 border border-border mb-4">
            <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-2">
              <Factory className="h-3.5 w-3.5" />
              Sector Impact
            </p>
            <div className="grid grid-cols-4 gap-2">
              {sectorImpact.map((sector) => (
                <div key={sector.sector} className="text-center">
                  <p className="text-[10px] font-medium text-foreground">{sector.sector}</p>
                  <p className="text-[10px] text-emerald-400">{sector.jobs}</p>
                  <p className={`text-[9px] ${sector.wage.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {sector.wage} wage
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Insight */}
          <div className="p-2.5 rounded-lg bg-violet-500/5 border border-violet-500/20">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Key insight:</span> Immigration adds $22.3B to GDP but creates 180K housing unit demand, contributing to affordability crisis. Wage pressure strongest in low-skill sectors.
            </p>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Click for full immigration analysis</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
