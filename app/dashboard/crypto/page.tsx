"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Globe2,
  DollarSign,
  BarChart3,
  Activity
} from "lucide-react"
import type { CryptoData } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function formatNumber(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  return `$${num.toLocaleString()}`
}

export default function CryptoPage() {
  const { data, isLoading, mutate } = useSWR<{
    cryptos: CryptoData[]
    cadRate: number
    lastUpdated: string
  }>("/api/crypto", fetcher, { refreshInterval: 60000 })

  const cryptos = data?.cryptos || []
  const cadRate = data?.cadRate || 1.36

  const totalMarketCap = cryptos.reduce((sum, c) => sum + c.marketCap, 0)
  const totalVolume = cryptos.reduce((sum, c) => sum + c.totalVolume, 0)
  const gainers24h = cryptos.filter((c) => c.priceChangePercentage24h > 0).length
  const btcDominance = cryptos[0]
    ? ((cryptos[0].marketCap / totalMarketCap) * 100).toFixed(1)
    : "0"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cryptocurrency</h1>
          <p className="text-muted-foreground mt-1">
            Top 20 cryptocurrencies with CAD pricing and geopolitical factors
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
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-1/10">
                <BarChart3 className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Market Cap</p>
                <p className="text-xl font-bold">{formatNumber(totalMarketCap)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-2/10">
                <Activity className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <p className="text-xl font-bold">{formatNumber(totalVolume)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">BTC Dominance</p>
                <p className="text-xl font-bold">{btcDominance}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-4/10">
                <DollarSign className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CAD/USD Rate</p>
                <p className="text-xl font-bold">{cadRate.toFixed(4)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crypto Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cryptos.map((crypto) => (
            <Card key={crypto.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {crypto.symbol}
                        <Badge variant="outline" className="text-xs">
                          #{crypto.marketCapRank}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{crypto.name}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price in CAD */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Price (CAD)</p>
                    <p className="text-2xl font-bold">
                      C${crypto.priceCAD.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">Price (USD)</p>
                    <p className="text-lg font-medium text-muted-foreground">
                      ${crypto.currentPrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Price Changes */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-secondary/50">
                    <p className="text-muted-foreground text-xs">24h Change</p>
                    <p
                      className={`font-semibold flex items-center gap-1 ${
                        crypto.priceChangePercentage24h >= 0
                          ? "text-chart-2"
                          : "text-destructive"
                      }`}
                    >
                      {crypto.priceChangePercentage24h >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {crypto.priceChangePercentage24h >= 0 ? "+" : ""}
                      {crypto.priceChangePercentage24h.toFixed(2)}%
                    </p>
                  </div>
                  <div className="p-2 rounded bg-secondary/50">
                    <p className="text-muted-foreground text-xs">7d Change</p>
                    <p
                      className={`font-semibold flex items-center gap-1 ${
                        crypto.priceChangePercentage7d >= 0
                          ? "text-chart-2"
                          : "text-destructive"
                      }`}
                    >
                      {crypto.priceChangePercentage7d >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {crypto.priceChangePercentage7d >= 0 ? "+" : ""}
                      {crypto.priceChangePercentage7d.toFixed(2)}%
                    </p>
                  </div>
                </div>

                {/* Market Stats */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 rounded bg-secondary/50">
                    <p className="text-muted-foreground text-xs">Market Cap</p>
                    <p className="font-medium">{formatNumber(crypto.marketCap)}</p>
                  </div>
                  <div className="p-2 rounded bg-secondary/50">
                    <p className="text-muted-foreground text-xs">ATH Change</p>
                    <p className="font-medium text-destructive">
                      {crypto.athChangePercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Geopolitical Factors */}
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <Globe2 className="h-3 w-3" />
                    Geopolitical Factors
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {crypto.geopoliticalFactors.slice(0, 3).map((factor) => (
                      <Badge key={factor} variant="outline" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <Card className="bg-secondary/30">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> Cryptocurrency prices are highly volatile. 
            Data provided is for informational purposes only and should not be considered 
            financial advice. All prices are fetched from CoinGecko API and converted to 
            CAD using current exchange rates.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
