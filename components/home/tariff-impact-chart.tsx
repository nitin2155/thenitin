"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Globe2, 
  ArrowRight,
  TrendingUp,
  ExternalLink,
  AlertTriangle,
  Ship,
  Factory,
  Car,
  Fuel,
  Handshake
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

// Sector impact data for bar chart
const sectorData = [
  { sector: "Auto", loss: 15.8, color: "#ef4444", jobs: "125K" },
  { sector: "Energy", loss: 18.0, color: "#f97316", jobs: "80K" },
  { sector: "Steel", loss: 3.0, color: "#ef4444", jobs: "35K" },
  { sector: "Agri", loss: 11.3, color: "#f97316", jobs: "60K" },
]

// Canada's trade diversification gains
const diversificationGains = [
  { country: "EU", flag: "🇪🇺", change: "+18%", value: "$12B", trend: "up" },
  { country: "UK", flag: "🇬🇧", change: "+24%", value: "$8B", trend: "up" },
  { country: "Japan", flag: "🇯🇵", change: "+15%", value: "$5B", trend: "up" },
  { country: "India", flag: "🇮🇳", change: "+32%", value: "$3B", trend: "up" },
]

// Key stats
const keyStats = {
  usExports: "$450B",
  atRisk: "$48B",
  jobsAtRisk: "300K",
  newPartners: "+$28B"
}

export function TariffImpactChart() {
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
                  Trump Tariff Impact
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <p className="text-xs text-muted-foreground">Trade War Analysis + New Partners</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
              <Handshake className="h-3 w-3 mr-1" />
              Diversifying
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {/* Key Numbers Row */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="p-2 rounded-lg bg-secondary/30 border border-border text-center">
              <p className="text-sm font-bold text-foreground">{keyStats.usExports}</p>
              <p className="text-[9px] text-muted-foreground">US Exports</p>
            </div>
            <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
              <p className="text-sm font-bold text-destructive">{keyStats.atRisk}</p>
              <p className="text-[9px] text-destructive/70">At Risk</p>
            </div>
            <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-center">
              <p className="text-sm font-bold text-accent">{keyStats.jobsAtRisk}</p>
              <p className="text-[9px] text-accent/70">Jobs Risk</p>
            </div>
            <div className="p-2 rounded-lg bg-chart-1/10 border border-chart-1/20 text-center">
              <p className="text-sm font-bold text-chart-1">{keyStats.newPartners}</p>
              <p className="text-[9px] text-chart-1/70">New Trade</p>
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
                  <Bar dataKey="loss" radius={[0, 4, 4, 0]} barSize={18}>
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <LabelList 
                      dataKey="loss" 
                      position="right" 
                      formatter={(v: number) => `-$${v}B`}
                      style={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Trade Diversification - THE SILVER LINING */}
          <div className="p-3 rounded-lg bg-chart-1/5 border border-chart-1/20 mb-4">
            <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-chart-1" />
              Canada&apos;s Trade Diversification Gains
            </p>
            <div className="grid grid-cols-4 gap-2">
              {diversificationGains.map((partner) => (
                <div key={partner.country} className="text-center">
                  <div className="text-lg mb-0.5">{partner.flag}</div>
                  <p className="text-[10px] font-medium text-foreground">{partner.country}</p>
                  <p className="text-xs font-bold text-chart-1">{partner.change}</p>
                  <p className="text-[9px] text-muted-foreground">{partner.value}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Key Insight */}
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
            <Handshake className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Silver lining:</span> Tariff threats accelerating trade deals with EU, UK, Indo-Pacific. Canada gaining $28B+ in new trade partnerships.
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
