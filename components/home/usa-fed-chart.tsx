"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ExternalLink
} from "lucide-react"

// Fed policy outlook and market impacts
const fedOutlook = {
  currentRate: 4.25,
  expectedCuts: 2,
  nextMeeting: "May 2025",
  marketExpectation: "Hold",
  inflation: 2.8,
  unemployment: 4.2,
}

const impacts = [
  { 
    sector: "Tech Stocks", 
    impact: "+", 
    reason: "Lower rates boost growth stocks",
    color: "text-chart-1"
  },
  { 
    sector: "USD Strength", 
    impact: "-", 
    reason: "Rate cuts weaken dollar",
    color: "text-destructive"
  },
  { 
    sector: "Gold", 
    impact: "+", 
    reason: "Dovish Fed bullish for gold",
    color: "text-chart-1"
  },
  { 
    sector: "Bank Stocks", 
    impact: "-", 
    reason: "NIM compression risk",
    color: "text-destructive"
  },
]

export function USAFedChart() {
  return (
    <Link href="/dashboard/commodities?focus=fed" className="block group">
      <Card className="border-border bg-card/50 backdrop-blur hover:border-blue-500/50 transition-all h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Building2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  Fed Policy
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <p className="text-xs text-muted-foreground">Rate Path & Market Impact</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs">
              {fedOutlook.marketExpectation}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {/* Current Stats */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="p-2 rounded-lg bg-secondary/30 border border-border text-center">
              <p className="text-[10px] text-muted-foreground mb-0.5">Fed Rate</p>
              <p className="text-lg font-bold text-emerald-500">{fedOutlook.currentRate}%</p>
            </div>
            <div className="p-2 rounded-lg bg-secondary/30 border border-border text-center">
              <p className="text-[10px] text-muted-foreground mb-0.5">Inflation</p>
              <p className="text-lg font-bold text-amber-500">{fedOutlook.inflation}%</p>
            </div>
            <div className="p-2 rounded-lg bg-secondary/30 border border-border text-center">
              <p className="text-[10px] text-muted-foreground mb-0.5">Unemployment</p>
              <p className="text-lg font-bold text-foreground">{fedOutlook.unemployment}%</p>
            </div>
          </div>
          
          {/* Rate Path Visual */}
          <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-foreground">2025 Rate Path</span>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                {fedOutlook.expectedCuts} cuts expected
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              {[4.25, 4.25, 4.00, 4.00, 3.75, 3.75].map((rate, i) => (
                <div 
                  key={i}
                  className="flex-1 h-6 rounded bg-emerald-500/20 flex items-center justify-center"
                  style={{ opacity: 1 - (i * 0.1) }}
                >
                  <span className="text-[9px] font-medium text-emerald-400">{rate}%</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-muted-foreground">Now</span>
              <span className="text-[9px] text-muted-foreground">Dec 25</span>
            </div>
          </div>
          
          {/* Sector Impacts */}
          <div className="space-y-1.5">
            {impacts.map((item) => (
              <div 
                key={item.sector}
                className="flex items-center justify-between p-1.5 rounded bg-secondary/20"
              >
                <span className="text-xs text-foreground">{item.sector}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{item.reason}</span>
                  <span className={`text-sm font-bold ${item.color}`}>{item.impact}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
            <span className="text-[10px] text-muted-foreground">Next: {fedOutlook.nextMeeting}</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
