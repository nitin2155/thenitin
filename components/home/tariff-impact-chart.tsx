"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Globe2, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  ExternalLink,
  AlertTriangle,
  Ship,
  Factory,
  Car,
  Fuel
} from "lucide-react"

// Trump Tariff Impact Data for Canada
const tariffImpacts = [
  {
    sector: "Auto Industry",
    icon: Car,
    exportValue: "$63B",
    tariffRate: "25%",
    potentialLoss: "-$15.8B",
    jobsAtRisk: "125,000",
    status: "critical",
    description: "Ontario auto plants heavily exposed to US market"
  },
  {
    sector: "Energy",
    icon: Fuel,
    exportValue: "$180B",
    tariffRate: "10%",
    potentialLoss: "-$18B",
    jobsAtRisk: "80,000",
    status: "high",
    description: "Oil, gas, and electricity exports threatened"
  },
  {
    sector: "Steel & Aluminum",
    icon: Factory,
    exportValue: "$12B",
    tariffRate: "25%",
    potentialLoss: "-$3B",
    jobsAtRisk: "35,000",
    status: "critical",
    description: "Already facing tariffs since 2018"
  },
  {
    sector: "Agriculture",
    icon: Ship,
    exportValue: "$45B",
    tariffRate: "25%",
    potentialLoss: "-$11.3B",
    jobsAtRisk: "60,000",
    status: "high",
    description: "Dairy, lumber, and grains affected"
  }
]

// Trade balance visualization
const tradeData = {
  totalExports: "$450B",
  percentToUS: "75%",
  tradeBalance: "+$85B surplus",
  cadImpact: "-3-5%",
  gdpRisk: "-1.5 to -2.5%"
}

// Timeline of tariff announcements
const timeline = [
  { date: "Nov 2024", event: "Trump elected", impact: "CAD drops 2%" },
  { date: "Jan 2025", event: "25% tariff threat", impact: "TSX falls 3%" },
  { date: "Feb 2025", event: "Tariffs delayed", impact: "Markets stabilize" },
  { date: "Apr 2025", event: "Negotiations ongoing", impact: "Uncertainty persists" }
]

export function TariffImpactChart() {
  const criticalSectors = tariffImpacts.filter(t => t.status === "critical").length
  const totalJobsAtRisk = tariffImpacts.reduce((sum, t) => sum + parseInt(t.jobsAtRisk.replace(/,/g, '')), 0)
  
  return (
    <Link href="/dashboard/tariffs" className="block group">
      <Card className="border-border bg-card/50 backdrop-blur hover:border-primary/50 transition-all hover:bg-card/80">
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
                <p className="text-xs text-muted-foreground">Canada-US Trade Analysis</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {criticalSectors} Critical
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {/* Key Numbers */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="p-2.5 rounded-lg bg-secondary/30 border border-border text-center">
              <p className="text-lg font-bold text-foreground">{tradeData.totalExports}</p>
              <p className="text-[10px] text-muted-foreground">Annual Exports</p>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary/30 border border-border text-center">
              <p className="text-lg font-bold text-primary">{tradeData.percentToUS}</p>
              <p className="text-[10px] text-muted-foreground">To US</p>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary/30 border border-border text-center">
              <p className="text-lg font-bold text-destructive">{tradeData.cadImpact}</p>
              <p className="text-[10px] text-muted-foreground">CAD Risk</p>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary/30 border border-border text-center">
              <p className="text-lg font-bold text-accent">{totalJobsAtRisk.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Jobs at Risk</p>
            </div>
          </div>
          
          {/* Sector Impact Bars */}
          <div className="space-y-2.5 mb-4">
            {tariffImpacts.map((sector) => {
              const lossNum = parseFloat(sector.potentialLoss.replace(/[^0-9.]/g, ''))
              const maxLoss = 20
              const barWidth = (lossNum / maxLoss) * 100
              
              return (
                <div key={sector.sector} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <sector.icon className={`h-3.5 w-3.5 ${
                        sector.status === 'critical' ? 'text-destructive' : 'text-accent'
                      }`} />
                      <span className="text-xs font-medium text-foreground">{sector.sector}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{sector.tariffRate}</span>
                      <span className={`text-xs font-bold ${
                        sector.status === 'critical' ? 'text-destructive' : 'text-accent'
                      }`}>
                        {sector.potentialLoss}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        sector.status === 'critical' ? 'bg-destructive' : 'bg-accent'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Timeline */}
          <div className="p-3 rounded-lg bg-secondary/30 border border-border mb-4">
            <p className="text-xs font-medium text-foreground mb-2">Recent Timeline</p>
            <div className="flex items-center justify-between">
              {timeline.map((item, idx) => (
                <div key={item.date} className="flex flex-col items-center text-center relative">
                  <div className={`w-2 h-2 rounded-full mb-1 ${
                    idx === timeline.length - 1 ? 'bg-primary animate-pulse' : 'bg-muted-foreground'
                  }`} />
                  <p className="text-[9px] font-medium text-foreground">{item.date}</p>
                  <p className="text-[8px] text-muted-foreground">{item.event}</p>
                  {idx < timeline.length - 1 && (
                    <div className="absolute top-1 left-1/2 w-full h-px bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Bottom insight */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-destructive/5 border border-destructive/20">
            <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
            <p className="text-[11px] text-muted-foreground">
              <span className="font-medium text-foreground">GDP at risk:</span> {tradeData.gdpRisk} if full tariffs implemented
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Click for full trade & tariff analysis</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
