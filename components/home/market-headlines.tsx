"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Flame,
  Shield,
  Zap,
  AlertTriangle,
  Globe,
  DollarSign,
  Droplets,
  Wheat,
  ArrowRight,
  Newspaper
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MarketHeadline {
  id: string
  title: string
  summary: string
  category: "trade-war" | "oil" | "gold" | "conflict" | "policy" | "economy" | "supply-chain"
  impact: "bullish" | "bearish" | "neutral"
  affectedAssets: string[]
  timestamp: string
  impactLevel: "high" | "medium" | "low"
  insight: string
}

const categoryConfig = {
  "trade-war": { 
    icon: Shield, 
    label: "Trade War",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10 border-chart-2/30"
  },
  "oil": { 
    icon: Droplets, 
    label: "Oil Markets",
    color: "text-accent",
    bgColor: "bg-accent/10 border-accent/30"
  },
  "gold": { 
    icon: DollarSign, 
    label: "Gold & Safe Havens",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10 border-chart-4/30"
  },
  "conflict": { 
    icon: Flame, 
    label: "Geopolitical Conflict",
    color: "text-destructive",
    bgColor: "bg-destructive/10 border-destructive/30"
  },
  "policy": { 
    icon: Globe, 
    label: "Policy Change",
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/30"
  },
  "economy": { 
    icon: TrendingUp, 
    label: "Economic Data",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10 border-chart-1/30"
  },
  "supply-chain": { 
    icon: Wheat, 
    label: "Supply Chain",
    color: "text-chart-5",
    bgColor: "bg-chart-5/10 border-chart-5/30"
  }
}

// Curated headlines focusing on major market-moving events
function getMarketHeadlines(): MarketHeadline[] {
  const now = new Date()
  
  return [
    {
      id: "h1",
      title: "US-China Trade Tensions Escalate: New 25% Tariffs on Tech Imports",
      summary: "The ongoing trade dispute has expanded to include semiconductors and AI hardware, creating supply chain uncertainties for major tech companies.",
      category: "trade-war",
      impact: "bearish",
      affectedAssets: ["Tech Stocks", "NVDA", "AAPL", "CAD"],
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      impactLevel: "high",
      insight: "Trade wars historically strengthen gold (+5-15%) as investors seek safe havens. The 2018-2020 trade war pushed gold from $1,200 to $1,550."
    },
    {
      id: "h2",
      title: "Gold Surges Past $3,000: Central Bank Buying Hits Record Levels",
      summary: "Global central banks purchased 1,037 tonnes of gold in the past year, with China, India, and Turkey leading accumulation amid de-dollarization trends.",
      category: "gold",
      impact: "bullish",
      affectedAssets: ["Gold", "Silver", "Mining Stocks"],
      timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      impactLevel: "high",
      insight: "Central bank gold buying signals distrust in fiat currencies. When central banks buy aggressively, retail investors typically follow 6-12 months later."
    },
    {
      id: "h3",
      title: "OPEC+ Announces Surprise Production Cut of 2M Barrels/Day",
      summary: "Saudi Arabia leads coalition in output reduction to stabilize prices, defying Western pressure to increase supply amid inflation concerns.",
      category: "oil",
      impact: "bullish",
      affectedAssets: ["Crude Oil", "Natural Gas", "Energy Stocks", "CAD"],
      timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      impactLevel: "high",
      insight: "Oil supply cuts typically add 10-20% to crude prices within 3 months. Higher oil supports CAD as Canada is a net energy exporter."
    },
    {
      id: "h4",
      title: "Russia-West Tensions Reignite Over Baltic Region",
      summary: "NATO increases patrols as Russia conducts military exercises near Estonian border, reviving memories of 2022 energy supply disruptions.",
      category: "conflict",
      impact: "bearish",
      affectedAssets: ["European Gas", "Defense Stocks", "Gold", "Euro"],
      timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
      impactLevel: "medium",
      insight: "Geopolitical tensions in Europe drove gas prices 10x higher in 2022. Gold typically rallies 8-12% during major conflict escalations."
    },
    {
      id: "h5",
      title: "Federal Reserve Signals Extended Pause on Rate Cuts",
      summary: "Powell cites persistent services inflation and strong labor market as reasons to maintain current rates through Q3 2026.",
      category: "policy",
      impact: "bearish",
      affectedAssets: ["Bonds", "Real Estate", "Growth Stocks", "Gold"],
      timestamp: new Date(now.getTime() - 10 * 60 * 60 * 1000).toISOString(),
      impactLevel: "high",
      insight: "Higher-for-longer rates strengthen USD but pressure gold. However, fiscal debt concerns provide a floor for gold prices."
    },
    {
      id: "h6",
      title: "China Stockpiles Strategic Commodities Amid Taiwan Tensions",
      summary: "Satellite imagery reveals record copper, nickel, and rare earth stockpiling as Beijing prepares for potential supply chain disruptions.",
      category: "supply-chain",
      impact: "bullish",
      affectedAssets: ["Copper", "Nickel", "Rare Earths", "EV Stocks"],
      timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      impactLevel: "medium",
      insight: "Strategic stockpiling creates artificial demand, supporting prices. China controls 60%+ of rare earth processing, making diversification critical."
    }
  ]
}

function HeadlineCard({ headline }: { headline: MarketHeadline }) {
  const config = categoryConfig[headline.category]
  const CategoryIcon = config.icon
  
  const impactColors = {
    bullish: "text-chart-1",
    bearish: "text-chart-2",
    neutral: "text-muted-foreground"
  }
  
  const ImpactIcon = headline.impact === "bullish" 
    ? TrendingUp 
    : headline.impact === "bearish" 
      ? TrendingDown 
      : Minus

  const timeAgo = getTimeAgo(headline.timestamp)

  return (
    <div className="group p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all">
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border",
          config.bgColor
        )}>
          <CategoryIcon className={cn("w-5 h-5", config.color)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Badge variant="outline" className={cn("text-[10px]", config.bgColor, config.color)}>
              {config.label}
            </Badge>
            {headline.impactLevel === "high" && (
              <Badge className="text-[10px] bg-destructive/80 text-destructive-foreground gap-1">
                <AlertTriangle className="w-2.5 h-2.5" />
                HIGH IMPACT
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
          
          <h3 className="font-semibold text-foreground leading-tight mb-1.5 text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {headline.title}
          </h3>
          
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {headline.summary}
          </p>
          
          {/* Affected Assets */}
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            <ImpactIcon className={cn("w-3.5 h-3.5", impactColors[headline.impact])} />
            {headline.affectedAssets.slice(0, 4).map((asset) => (
              <Badge 
                key={asset} 
                variant="secondary" 
                className="text-[10px] px-1.5 py-0"
              >
                {asset}
              </Badge>
            ))}
          </div>
          
          {/* Insight Box */}
          <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">Market Insight</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {headline.insight}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function getTimeAgo(timestamp: string): string {
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  
  if (diffHours < 1) return "Just now"
  if (diffHours === 1) return "1 hour ago"
  if (diffHours < 24) return `${diffHours} hours ago`
  return "1 day ago"
}

export function MarketHeadlines() {
  const [headlines, setHeadlines] = useState<MarketHeadline[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading then show headlines
    const timer = setTimeout(() => {
      setHeadlines(getMarketHeadlines())
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <section className="relative z-10 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Newspaper className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-xl font-bold text-foreground">Market-Moving Headlines</h2>
                <p className="text-sm text-muted-foreground">Events driving our analysis</p>
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-card border border-border animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-24" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative z-10 px-4 py-8 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Newspaper className="h-5 w-5 text-primary" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-chart-1 animate-live-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Market-Moving Headlines</h2>
              <p className="text-sm text-muted-foreground">Key events driving our analysis today</p>
            </div>
          </div>
          <Link 
            href="/dashboard/geopolitics"
            className="hidden sm:flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            Full Analysis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        {/* Category Legend */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(categoryConfig).map(([key, config]) => {
            const Icon = config.icon
            return (
              <div 
                key={key}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border text-xs text-muted-foreground"
              >
                <Icon className={cn("w-3 h-3", config.color)} />
                {config.label}
              </div>
            )
          })}
        </div>

        {/* Headlines Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {headlines.map((headline) => (
            <HeadlineCard key={headline.id} headline={headline} />
          ))}
        </div>

        {/* Mobile Link */}
        <div className="mt-6 text-center sm:hidden">
          <Link 
            href="/dashboard/geopolitics"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            View Full Geopolitical Analysis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Educational Note */}
        <div className="mt-6 p-4 rounded-xl bg-card border border-dashed border-primary/30">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">Understanding Market Drivers</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                These headlines represent major macro forces currently impacting markets. Trade tensions typically strengthen safe-haven assets like gold, 
                while oil supply disruptions support energy stocks and the Canadian dollar. Our analysis connects these events to historical patterns 
                to help you understand potential market trajectories.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
