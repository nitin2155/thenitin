"use client"

import useSWR from "swr"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Globe2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  Zap,
  Shield,
  Scale,
  Landmark,
  Flame,
  DollarSign,
  Vote
} from "lucide-react"
import type { GeopoliticalEvent } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const categoryIcons: Record<string, typeof Globe2> = {
  conflict: Flame,
  trade: Scale,
  sanctions: Shield,
  diplomacy: Globe2,
  economy: DollarSign,
  election: Vote
}

const categoryColors: Record<string, string> = {
  conflict: "bg-destructive/10 text-destructive border-destructive/20",
  trade: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  sanctions: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  diplomacy: "bg-primary/10 text-primary border-primary/20",
  economy: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  election: "bg-accent/10 text-accent border-accent/20"
}

const severityColors: Record<string, string> = {
  critical: "destructive",
  high: "default",
  medium: "secondary",
  low: "outline"
}

export default function GeopoliticsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  
  const { data, isLoading } = useSWR<{
    historicalEvents: GeopoliticalEvent[]
    currentRisks: { region: string; riskLevel: string; description: string; assets: string[] }[]
  }>("/api/geopolitics", fetcher)

  const events = data?.historicalEvents || []
  const currentRisks = data?.currentRisks || []

  const filteredEvents = selectedCategory === "all" 
    ? events 
    : events.filter(e => e.category === selectedCategory)

  const categories = ["all", "conflict", "trade", "sanctions", "economy", "diplomacy"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Geopolitical Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Historical events and their impact on markets, with Canadian context
        </p>
      </div>

      {/* Current Risk Monitor */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Current Risk Monitor
          </CardTitle>
          <CardDescription>
            Active geopolitical situations affecting markets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentRisks.map((risk) => (
              <div
                key={risk.region}
                className={`p-4 rounded-lg border ${
                  risk.riskLevel === "high" 
                    ? "bg-destructive/5 border-destructive/30" 
                    : "bg-secondary/50 border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{risk.region}</span>
                  </div>
                  <Badge variant={risk.riskLevel === "high" ? "destructive" : "secondary"}>
                    {risk.riskLevel}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {risk.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {risk.assets.slice(0, 3).map((asset) => (
                    <Badge key={asset} variant="outline" className="text-xs">
                      {asset}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historical Events */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold">Historical Events & Market Impact</h2>
          <TabsList>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="capitalize">
                {cat === "all" ? "All" : cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={selectedCategory} className="mt-0">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => {
                const Icon = categoryIcons[event.category] || Globe2
                const colorClass = categoryColors[event.category] || categoryColors.diplomacy
                
                return (
                  <Card key={event.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg border ${colorClass}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{event.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(event.date).toLocaleDateString("en-CA", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={severityColors[event.severity] as "destructive" | "default" | "secondary" | "outline"}>
                            {event.severity}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {event.category}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{event.description}</p>

                      {/* Regions */}
                      <div className="flex flex-wrap gap-2">
                        {event.regions.map((region) => (
                          <Badge key={region} variant="outline" className="gap-1">
                            <MapPin className="h-3 w-3" />
                            {region}
                          </Badge>
                        ))}
                      </div>

                      {/* Historical Impact */}
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {event.historicalImpact.map((impact, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-secondary/50"
                          >
                            <p className="text-sm font-medium">{impact.asset}</p>
                            <p
                              className={`text-lg font-bold flex items-center gap-1 ${
                                impact.change >= 0 ? "text-chart-2" : "text-destructive"
                              }`}
                            >
                              {impact.change >= 0 ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                              {impact.change >= 0 ? "+" : ""}
                              {impact.change}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {impact.timeframe}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Affected Assets */}
                      <div className="grid gap-3 sm:grid-cols-3">
                        {event.affectedAssets.stocks.length > 0 && (
                          <div className="p-3 rounded-lg bg-secondary/30">
                            <p className="text-xs text-muted-foreground mb-2">
                              Affected Stocks
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {event.affectedAssets.stocks.slice(0, 5).map((stock) => (
                                <Badge key={stock} variant="outline" className="text-xs">
                                  {stock}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {event.affectedAssets.crypto.length > 0 && (
                          <div className="p-3 rounded-lg bg-secondary/30">
                            <p className="text-xs text-muted-foreground mb-2">
                              Affected Crypto
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {event.affectedAssets.crypto.map((c) => (
                                <Badge key={c} variant="outline" className="text-xs">
                                  {c}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {event.affectedAssets.commodities.length > 0 && (
                          <div className="p-3 rounded-lg bg-secondary/30">
                            <p className="text-xs text-muted-foreground mb-2">
                              Affected Commodities
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {event.affectedAssets.commodities.map((c) => (
                                <Badge key={c} variant="outline" className="text-xs">
                                  {c}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Canada Impact */}
                      <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Landmark className="h-4 w-4 text-destructive" />
                          <span className="font-medium text-destructive">Impact on Canada</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.canadaImpact}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Educational Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-chart-4" />
            Understanding Geopolitical Risk
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg bg-secondary/50">
              <h4 className="font-medium mb-2">Conflict Events</h4>
              <p className="text-sm text-muted-foreground">
                Wars and military tensions typically cause energy prices to spike, 
                safe-haven assets (gold, USD) to rise, and stock markets to fall 
                initially before recovering.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <h4 className="font-medium mb-2">Trade Wars</h4>
              <p className="text-sm text-muted-foreground">
                Tariffs and trade disputes affect specific sectors. Companies with 
                global supply chains (tech, auto) are most vulnerable. Currency 
                markets react strongly.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <h4 className="font-medium mb-2">Economic Crises</h4>
              <p className="text-sm text-muted-foreground">
                Banking crises and recessions cause broad market selloffs. Central 
                banks typically respond with rate cuts, benefiting bonds and 
                eventually equities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
