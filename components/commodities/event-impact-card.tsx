"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  Zap,
  Globe2,
  DollarSign,
  Flame,
  Shield,
  Newspaper,
  Calendar,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info
} from "lucide-react"
import type { GeopoliticalEvent } from "@/lib/geopolitical-events"
import { useState } from "react"

interface EventImpactCardProps {
  event: GeopoliticalEvent
  commodityId: string
  expanded?: boolean
}

const CATEGORY_CONFIG = {
  conflict: { icon: Flame, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  trade: { icon: Globe2, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  financial: { icon: DollarSign, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  pandemic: { icon: AlertTriangle, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  political: { icon: Zap, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  energy: { icon: Flame, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  sanctions: { icon: Shield, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
}

const SEVERITY_COLORS = {
  critical: "bg-red-500/20 text-red-300 border-red-500/30",
  high: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  low: "bg-green-500/20 text-green-300 border-green-500/30",
}

function ImpactIndicator({ value, label }: { value: number; label: string }) {
  const isPositive = value > 0
  const isNeutral = Math.abs(value) < 0.5
  
  return (
    <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-secondary/30">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className={cn(
        "flex items-center gap-1 font-bold text-lg",
        isNeutral ? "text-muted-foreground" : isPositive ? "text-chart-1" : "text-destructive"
      )}>
        {isNeutral ? (
          <Minus className="h-4 w-4" />
        ) : isPositive ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <TrendingDown className="h-4 w-4" />
        )}
        <span>{isPositive ? "+" : ""}{value.toFixed(1)}%</span>
      </div>
    </div>
  )
}

export function EventImpactCard({ event, commodityId, expanded: defaultExpanded = false }: EventImpactCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  
  const impact = event.impacts.find(i => i.commodity === commodityId)
  if (!impact) return null
  
  const config = CATEGORY_CONFIG[event.category]
  const CategoryIcon = config.icon
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }
  
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg",
      config.bg,
      config.border,
      "border"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={cn("p-2 rounded-lg", config.bg)}>
              <CategoryIcon className={cn("h-5 w-5", config.color)} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base font-semibold leading-tight">
                {event.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {formatDate(event.date)}
                  {event.endDate && ` - ${formatDate(event.endDate)}`}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={SEVERITY_COLORS[event.severity]}>
              {event.severity}
            </Badge>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-secondary rounded"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Impact Summary */}
        <div className="grid grid-cols-3 gap-2">
          <ImpactIndicator value={impact.immediateImpact} label="Immediate" />
          <ImpactIndicator value={impact.shortTermImpact} label="30 Days" />
          <ImpactIndicator value={impact.longTermImpact} label="90 Days" />
        </div>
        
        {/* Price Journey */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/20">
          <div className="flex-1 text-center">
            <p className="text-xs text-muted-foreground">Before</p>
            <p className="font-semibold">${impact.preBefore.toLocaleString()}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1 text-center">
            <p className="text-xs text-muted-foreground">At Event</p>
            <p className="font-semibold">${impact.priceAtEvent.toLocaleString()}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1 text-center">
            <p className="text-xs text-muted-foreground">After 30D</p>
            <p className="font-semibold">${impact.priceAfter30Days.toLocaleString()}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1 text-center">
            <p className="text-xs text-muted-foreground">After 90D</p>
            <p className="font-semibold">${impact.priceAfter90Days.toLocaleString()}</p>
          </div>
        </div>
        
        {expanded && (
          <>
            {/* Insight */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Key Insight</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {impact.insight}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Event Description */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                What Happened
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </div>
            
            {/* Educational Context */}
            <div className="p-4 rounded-lg bg-secondary/30">
              <div className="flex items-start gap-2">
                <Newspaper className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Educational Context</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {event.educationalContext}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Canadian Impact */}
            {event.canadianImpact && (
              <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/10">
                <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <span className="text-lg">🍁</span> Canadian Impact
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">CAD Change</p>
                    <p className={cn(
                      "font-semibold",
                      event.canadianImpact.cadChange > 0 ? "text-chart-1" : "text-destructive"
                    )}>
                      {event.canadianImpact.cadChange > 0 ? "+" : ""}{event.canadianImpact.cadChange}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">TSX Impact</p>
                    <p className={cn(
                      "font-semibold",
                      event.canadianImpact.tsxImpact > 0 ? "text-chart-1" : "text-destructive"
                    )}>
                      {event.canadianImpact.tsxImpact > 0 ? "+" : ""}{event.canadianImpact.tsxImpact}%
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  {event.canadianImpact.insight}
                </p>
              </div>
            )}
          </>
        )}
        
        {!expanded && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {impact.insight}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// Timeline view of multiple events
export function EventTimeline({ events, commodityId }: { events: GeopoliticalEvent[]; commodityId: string }) {
  const relevantEvents = events.filter(e => e.impacts.some(i => i.commodity === commodityId))
  
  if (relevantEvents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No historical events data available for this commodity.
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {relevantEvents.map((event, idx) => (
        <EventImpactCard 
          key={event.id} 
          event={event} 
          commodityId={commodityId}
          expanded={idx === 0}
        />
      ))}
    </div>
  )
}
