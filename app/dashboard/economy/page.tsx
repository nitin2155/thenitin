"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Landmark,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Home,
  Briefcase,
  RefreshCw,
  Info,
  ExternalLink
} from "lucide-react"
import type { CanadianEconomicData } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function EconomyPage() {
  const { data, isLoading, mutate } = useSWR<CanadianEconomicData>(
    "/api/canada/economy",
    fetcher,
    { refreshInterval: 300000 } // 5 minutes
  )

  const indicators = [
    {
      key: "interestRate",
      icon: Landmark,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
      data: data?.interestRate,
      suffix: "%",
      interpretation: "Higher rates = higher borrowing costs, lower housing demand"
    },
    {
      key: "inflationRate",
      icon: TrendingUp,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
      data: data?.inflationRate,
      suffix: "%",
      interpretation: "Target is 2%. Higher = purchasing power decreases"
    },
    {
      key: "cadUsdRate",
      icon: DollarSign,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      data: data?.cadUsdRate,
      prefix: "",
      suffix: " CAD",
      interpretation: "Higher = weaker CAD, imports cost more"
    },
    {
      key: "primeRate",
      icon: Percent,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      data: data?.primeRate,
      suffix: "%",
      interpretation: "Base rate for variable mortgages and LOCs"
    },
    {
      key: "mortgageRate5yr",
      icon: Home,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      data: data?.mortgageRate5yr,
      suffix: "%",
      interpretation: "Most common mortgage term in Canada"
    },
    {
      key: "mortgageRate3yr",
      icon: Home,
      color: "text-accent",
      bgColor: "bg-accent/10",
      data: data?.mortgageRate3yr,
      suffix: "%",
      interpretation: "Shorter term, often lower rate"
    },
    {
      key: "unemploymentRate",
      icon: Briefcase,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      data: data?.unemploymentRate,
      suffix: "%",
      interpretation: "Job market health indicator"
    },
    {
      key: "gdpGrowth",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
      data: data?.gdpGrowth,
      suffix: "%",
      interpretation: "Annual economic growth rate"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Canadian Economy</h1>
          <p className="text-muted-foreground mt-1">
            Key economic indicators from the Bank of Canada
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => mutate()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <a
            href="https://www.bankofcanada.ca/rates/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              BoC Website
            </Button>
          </a>
        </div>
      </div>

      {/* Data Source Info */}
      <Card className="bg-secondary/30 border-primary/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium">Data Source: Bank of Canada Valet API</p>
            <p className="text-sm text-muted-foreground">
              All economic indicators are sourced directly from the Bank of Canada&apos;s 
              free public API. No API key required.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Indicators Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))
          : indicators.map((indicator) => (
              <Card key={indicator.key} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${indicator.bgColor}`}>
                      <indicator.icon className={`h-5 w-5 ${indicator.color}`} />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {indicator.data?.date}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-1">
                    {indicator.data?.label}
                  </p>
                  <p className="text-3xl font-bold">
                    {indicator.prefix}
                    {indicator.data?.value}
                    {indicator.suffix}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {indicator.interpretation}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Detailed Explanations */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Interest Rates Impact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-chart-1" />
              Interest Rates Impact
            </CardTitle>
            <CardDescription>
              How Bank of Canada rates affect Canadians
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="font-medium">Mortgages</p>
                <p className="text-sm text-muted-foreground">
                  Variable rate mortgages are tied to the prime rate. A 0.25% increase 
                  adds ~$15/month per $100,000 borrowed.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="font-medium">Savings</p>
                <p className="text-sm text-muted-foreground">
                  Higher rates mean better returns on GICs and savings accounts.
                  Currently, high-interest savings offer {data?.primeRate?.value ? (data.primeRate.value - 2).toFixed(2) : "~4"}%+.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="font-medium">Credit Cards & LOCs</p>
                <p className="text-sm text-muted-foreground">
                  Lines of credit rates typically = Prime + 1-2%. 
                  Current variable LOC rates: {data?.primeRate?.value ? (data.primeRate.value + 1).toFixed(2) : "~7.5"}%+
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CAD Exchange Impact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-chart-2" />
              Canadian Dollar Impact
            </CardTitle>
            <CardDescription>
              How CAD/USD affects your finances
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="font-medium">Cross-Border Shopping</p>
                <p className="text-sm text-muted-foreground">
                  At {data?.cadUsdRate?.value || 1.36} CAD/USD, a $100 USD purchase 
                  costs you C${((data?.cadUsdRate?.value || 1.36) * 100).toFixed(2)}.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="font-medium">US Investments</p>
                <p className="text-sm text-muted-foreground">
                  Holding US stocks? Currency affects returns. A weaker CAD boosts 
                  USD investment values when converted back.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="font-medium">Travel</p>
                <p className="text-sm text-muted-foreground">
                  Planning a US trip? Factor in the exchange rate. 
                  $1000 USD vacation = C${((data?.cadUsdRate?.value || 1.36) * 1000).toFixed(0)} currently.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Economic Outlook */}
      <Card>
        <CardHeader>
          <CardTitle>Current Economic Context</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 mb-2">
                {(data?.inflationRate?.value || 0) > 3 ? (
                  <TrendingUp className="h-5 w-5 text-destructive" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-chart-2" />
                )}
                <span className="font-medium">Inflation</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {(data?.inflationRate?.value || 0) > 3
                  ? "Above target - BoC may hold or raise rates"
                  : "Approaching target - rate cuts possible"}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-5 w-5 text-chart-4" />
                <span className="font-medium">Housing</span>
              </div>
              <p className="text-sm text-muted-foreground">
                High mortgage rates continue to affect affordability.
                Stress test rate: {Math.max(5.25, (data?.mortgageRate5yr?.value || 5) + 2).toFixed(2)}%
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <span className="font-medium">Employment</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {(data?.unemploymentRate?.value || 6) > 6
                  ? "Labour market softening - may support rate cuts"
                  : "Labour market remains resilient"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
