"use client"

import Link from "next/link"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Building2, 
  ArrowRight,
  ExternalLink,
  RefreshCw,
  AlertTriangle
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function USAFedChart() {
  const { data, error, isLoading } = useSWR('/api/economic?market=US', fetcher, {
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
              <Skeleton className="h-5 w-28 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <Skeleton className="h-20 w-full mb-3" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }
  
  if (error || !data?.data) {
    return (
      <Card className="border-border bg-card/50 backdrop-blur border-destructive/50 h-full">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Failed to load economic data</p>
        </CardContent>
      </Card>
    )
  }
  
  const economicData = data.data
  const marketIndicators = data.marketIndicators
  const fedOutlook = economicData.centralBank
  const inflation = economicData.inflation
  const employment = economicData.employment
  const sectorImpacts = economicData.sectorImpacts
  const ratePath = economicData.ratePath
  
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
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  Live Economic Data
                </p>
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
              <p className="text-lg font-bold text-amber-500">{inflation.current}%</p>
            </div>
            <div className="p-2 rounded-lg bg-secondary/30 border border-border text-center">
              <p className="text-[10px] text-muted-foreground mb-0.5">Unemployment</p>
              <p className="text-lg font-bold text-foreground">{employment.unemploymentRate}%</p>
            </div>
          </div>
          
          {/* Market Indicators */}
          {marketIndicators && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Gold</span>
                  <span className={`text-[10px] ${marketIndicators.gold.change >= 0 ? 'text-chart-1' : 'text-destructive'}`}>
                    {marketIndicators.gold.change >= 0 ? '+' : ''}{marketIndicators.gold.change.toFixed(2)}%
                  </span>
                </div>
                <p className="text-sm font-bold text-yellow-500">${marketIndicators.gold.price.toFixed(0)}</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">VIX</span>
                  <span className={`text-[10px] ${marketIndicators.vix.value > 20 ? 'text-destructive' : 'text-chart-1'}`}>
                    {marketIndicators.vix.signal}
                  </span>
                </div>
                <p className="text-sm font-bold text-purple-500">{marketIndicators.vix.value.toFixed(1)}</p>
              </div>
            </div>
          )}
          
          {/* Rate Path Visual */}
          <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-foreground">Rate Path Forecast</span>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                {fedOutlook.expectedRateEndOfYear}% by year-end
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              {ratePath.slice(0, 6).map((point: { period: string; rate: number }, i: number) => (
                <div 
                  key={i}
                  className="flex-1 h-6 rounded bg-emerald-500/20 flex items-center justify-center"
                  style={{ opacity: 1 - (i * 0.1) }}
                >
                  <span className="text-[9px] font-medium text-emerald-400">{point.rate}%</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-muted-foreground">{ratePath[0]?.period}</span>
              <span className="text-[9px] text-muted-foreground">{ratePath[5]?.period}</span>
            </div>
          </div>
          
          {/* Sector Impacts */}
          <div className="space-y-1.5">
            {sectorImpacts.slice(0, 4).map((item: { sector: string; impact: string; reason: string }) => (
              <div 
                key={item.sector}
                className="flex items-center justify-between p-1.5 rounded bg-secondary/20"
              >
                <span className="text-xs text-foreground">{item.sector}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{item.reason}</span>
                  <span className={`text-sm font-bold ${
                    item.impact === '+' ? 'text-chart-1' : 
                    item.impact === '-' ? 'text-destructive' : 
                    'text-muted-foreground'
                  }`}>{item.impact}</span>
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
