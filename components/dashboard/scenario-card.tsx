"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Users,
  Clock,
  ChevronRight,
  BarChart3,
  History,
  Lightbulb,
  Target,
  AlertCircle,
  Zap,
  Scale
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { MarketScenario } from "@/lib/scenarios"

interface ScenarioCardProps {
  scenario: MarketScenario
  compact?: boolean
}

export function ScenarioCard({ scenario, compact = false }: ScenarioCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const sentimentIcon = scenario.sentiment === "bullish" 
    ? TrendingUp 
    : scenario.sentiment === "bearish" 
      ? TrendingDown 
      : Minus
      
  const sentimentColor = scenario.sentiment === "bullish"
    ? "text-chart-1"
    : scenario.sentiment === "bearish"
      ? "text-destructive"
      : "text-muted-foreground"
  
  const probabilityColor = scenario.probability >= 70 
    ? "bg-chart-1" 
    : scenario.probability >= 40 
      ? "bg-chart-4" 
      : "bg-muted-foreground"
  
  const formatVolume = (vol: number) => {
    if (vol >= 1_000_000) return `$${(vol / 1_000_000).toFixed(1)}M`
    if (vol >= 1_000) return `$${(vol / 1_000).toFixed(0)}K`
    return `$${vol}`
  }
  
  const SentimentIcon = sentimentIcon
  
  if (compact) {
    return (
      <>
        <div 
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer group"
        >
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{scenario.shortTitle}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("text-xs flex items-center gap-1", sentimentColor)}>
                <SentimentIcon className="h-3 w-3" />
                {scenario.sentiment}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatVolume(scenario.volume24h)} 24h
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className={cn(
                "text-lg font-bold",
                scenario.probability >= 60 ? "text-chart-1" : 
                scenario.probability <= 30 ? "text-destructive" : "text-foreground"
              )}>
                {scenario.probability}%
              </p>
              <p className={cn(
                "text-xs",
                scenario.probabilityChange24h > 0 ? "text-chart-1" : "text-destructive"
              )}>
                {scenario.probabilityChange24h > 0 ? "+" : ""}{scenario.probabilityChange24h.toFixed(1)}%
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </div>
        <ScenarioModal scenario={scenario} open={isOpen} onOpenChange={setIsOpen} />
      </>
    )
  }
  
  return (
    <>
      <Card 
        className="cursor-pointer hover:border-primary/50 transition-all group"
        onClick={() => setIsOpen(true)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <Badge 
                variant="outline" 
                className="mb-2 text-xs capitalize"
              >
                {scenario.category}
              </Badge>
              <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                {scenario.question}
              </h3>
            </div>
            <div className="text-right shrink-0">
              <p className={cn(
                "text-2xl font-bold",
                scenario.probability >= 60 ? "text-chart-1" : 
                scenario.probability <= 30 ? "text-destructive" : "text-foreground"
              )}>
                {scenario.probability}%
              </p>
              <p className={cn(
                "text-xs flex items-center justify-end gap-0.5",
                scenario.probabilityChange24h > 0 ? "text-chart-1" : "text-destructive"
              )}>
                {scenario.probabilityChange24h > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {scenario.probabilityChange24h > 0 ? "+" : ""}{scenario.probabilityChange24h.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Probability bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Probability</span>
              <span className="font-medium">{scenario.probability}% likely</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all", probabilityColor)}
                style={{ width: `${scenario.probability}%` }}
              />
            </div>
          </div>
          
          {/* Stats row */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Activity className="h-3.5 w-3.5" />
              {formatVolume(scenario.volume24h)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {scenario.participants.toLocaleString()}
            </span>
            <span className={cn("flex items-center gap-1", sentimentColor)}>
              <SentimentIcon className="h-3.5 w-3.5" />
              {scenario.sentiment}
            </span>
          </div>
          
          {/* Impact preview */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">If YES, projected impacts:</p>
            <div className="flex flex-wrap gap-1.5">
              {scenario.projectedImpacts.slice(0, 3).map((impact) => (
                <Badge 
                  key={impact.asset}
                  variant="secondary"
                  className={cn(
                    "text-xs",
                    impact.projectedChange > 0 ? "text-chart-1" : "text-destructive"
                  )}
                >
                  {impact.asset} {impact.projectedChange > 0 ? "+" : ""}{impact.projectedChange}%
                </Badge>
              ))}
              {scenario.projectedImpacts.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{scenario.projectedImpacts.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <ScenarioModal scenario={scenario} open={isOpen} onOpenChange={setIsOpen} />
    </>
  )
}

interface ScenarioModalProps {
  scenario: MarketScenario
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ScenarioModal({ scenario, open, onOpenChange }: ScenarioModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="capitalize">{scenario.category}</Badge>
            <Badge 
              variant={scenario.status === "active" ? "default" : "secondary"}
              className="capitalize"
            >
              {scenario.status}
            </Badge>
          </div>
          <DialogTitle className="text-xl leading-tight">
            {scenario.question}
          </DialogTitle>
          <DialogDescription>
            {scenario.description}
          </DialogDescription>
        </DialogHeader>
        
        {/* Main probability display */}
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="text-center p-4 rounded-lg bg-secondary/50">
            <p className={cn(
              "text-4xl font-bold",
              scenario.probability >= 60 ? "text-chart-1" : 
              scenario.probability <= 30 ? "text-destructive" : "text-foreground"
            )}>
              {scenario.probability}%
            </p>
            <p className="text-sm text-muted-foreground">Current Probability</p>
            <p className={cn(
              "text-xs mt-1",
              scenario.probabilityChange24h > 0 ? "text-chart-1" : "text-destructive"
            )}>
              {scenario.probabilityChange24h > 0 ? "+" : ""}{scenario.probabilityChange24h}% (24h)
            </p>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold">${(scenario.volume24h / 1_000_000).toFixed(1)}M</p>
            <p className="text-sm text-muted-foreground">24h Volume</p>
            <p className="text-xs text-muted-foreground mt-1">
              ${(scenario.totalVolume / 1_000_000).toFixed(0)}M total
            </p>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-secondary/50">
            <p className={cn(
              "text-2xl font-bold",
              scenario.sentimentScore > 20 ? "text-chart-1" : 
              scenario.sentimentScore < -20 ? "text-destructive" : "text-foreground"
            )}>
              {scenario.sentimentScore > 0 ? "+" : ""}{scenario.sentimentScore}
            </p>
            <p className="text-sm text-muted-foreground">Sentiment Score</p>
            <p className="text-xs capitalize mt-1">{scenario.sentiment}</p>
          </div>
        </div>
        
        <Tabs defaultValue="impacts" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="impacts" className="text-xs">
              <Target className="h-3.5 w-3.5 mr-1" />
              Impacts
            </TabsTrigger>
            <TabsTrigger value="factors" className="text-xs">
              <Zap className="h-3.5 w-3.5 mr-1" />
              Factors
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs">
              <History className="h-3.5 w-3.5 mr-1" />
              Precedent
            </TabsTrigger>
            <TabsTrigger value="insight" className="text-xs">
              <Lightbulb className="h-3.5 w-3.5 mr-1" />
              Insight
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="impacts" className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              Projected market impacts if this scenario occurs:
            </p>
            {scenario.projectedImpacts.map((impact) => (
              <div 
                key={impact.asset}
                className="p-4 rounded-lg bg-secondary/30 border border-border/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{impact.asset}</p>
                    <Badge variant="outline" className="text-xs capitalize">
                      {impact.assetType}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-xl font-bold",
                      impact.projectedChange > 0 ? "text-chart-1" : "text-destructive"
                    )}>
                      {impact.projectedChange > 0 ? "+" : ""}{impact.projectedChange}%
                    </p>
                    <Badge 
                      variant="secondary"
                      className="text-xs capitalize"
                    >
                      {impact.confidence} confidence
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{impact.rationale}</p>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="factors" className="mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Key factors influencing this scenario:
            </p>
            <div className="space-y-2">
              {scenario.keyFactors.map((factor, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {idx + 1}
                  </div>
                  <p className="text-sm">{factor}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Historical precedent and similar events:
            </p>
            {scenario.historicalPrecedent && scenario.historicalPrecedent.length > 0 ? (
              <div className="space-y-4">
                {scenario.historicalPrecedent.map((precedent, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-lg bg-secondary/30 border border-border/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{precedent.event}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(precedent.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <History className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-2 mt-3">
                      <div className="p-2 rounded bg-secondary/50">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Outcome</p>
                        <p className="text-sm">{precedent.outcome}</p>
                      </div>
                      <div className="p-2 rounded bg-secondary/50">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Market Impact</p>
                        <p className="text-sm">{precedent.marketImpact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No historical precedent available</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="insight" className="mt-4">
            <div className="p-4 rounded-lg bg-chart-2/10 border border-chart-2/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-chart-2/20">
                  <Scale className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="font-medium text-chart-2 mb-2">Neutral Analysis</p>
                  <p className="text-sm leading-relaxed">{scenario.insight}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 rounded-lg bg-secondary/30 border border-border/50">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  This analysis is for educational purposes only. It represents observed patterns and correlations, 
                  not investment advice. Past performance does not guarantee future results. 
                  Always conduct your own research before making financial decisions.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Resolution date */}
        {scenario.resolutionDate && (
          <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Resolution Date
            </span>
            <span className="font-medium">
              {new Date(scenario.resolutionDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Trending scenarios widget
export function TrendingScenarios({ scenarios }: { scenarios: MarketScenario[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-chart-4" />
            Trending Scenarios
          </h3>
          <Badge variant="outline" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            High Volume
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {scenarios.slice(0, 5).map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} compact />
        ))}
      </CardContent>
    </Card>
  )
}

// Probability gauge component
export function ProbabilityGauge({ probability, size = "default" }: { probability: number; size?: "small" | "default" | "large" }) {
  const sizeClasses = {
    small: "w-16 h-16",
    default: "w-24 h-24",
    large: "w-32 h-32"
  }
  
  const textSizes = {
    small: "text-lg",
    default: "text-2xl",
    large: "text-3xl"
  }
  
  const strokeWidth = size === "small" ? 4 : size === "large" ? 8 : 6
  const radius = size === "small" ? 28 : size === "large" ? 56 : 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (probability / 100) * circumference
  
  const color = probability >= 70 
    ? "stroke-chart-1" 
    : probability >= 40 
      ? "stroke-chart-4" 
      : "stroke-muted-foreground"
  
  return (
    <div className={cn("relative", sizeClasses[size])}>
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-secondary"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("transition-all duration-500", color)}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("font-bold", textSizes[size])}>{probability}%</span>
      </div>
    </div>
  )
}
