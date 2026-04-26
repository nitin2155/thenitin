"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart
} from "recharts"
import { 
  Sliders, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Fuel,
  Home,
  Landmark,
  Zap,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Base values (current market)
const BASE_VALUES = {
  oilPrice: 75,
  interestRate: 5.0,
  cadUsd: 0.73,
  tsxIndex: 22500,
  goldPrice: 2400,
  housingIndex: 100,
}

// Correlation matrices (simplified economic model)
const CORRELATIONS = {
  oil: {
    cad: 0.4,      // Oil up = CAD up
    tsx: 0.25,     // Oil up = TSX up (energy heavy)
    gold: -0.1,    // Slight inverse
    housing: 0.05, // Minimal direct impact
  },
  interestRate: {
    cad: 0.3,      // Higher rates = stronger CAD
    tsx: -0.2,     // Higher rates = lower stocks
    gold: -0.15,   // Higher rates = lower gold
    housing: -0.35, // Strong inverse - rates up, housing down
  },
  tariff: {
    cad: -0.25,    // Tariffs hurt CAD
    tsx: -0.15,    // Tariffs hurt stocks
    gold: 0.1,     // Safe haven boost
    housing: -0.1, // Economic uncertainty
  }
}

export default function ScenarioSimulatorPage() {
  // Slider values
  const [oilPrice, setOilPrice] = useState(BASE_VALUES.oilPrice)
  const [interestRate, setInterestRate] = useState(BASE_VALUES.interestRate)
  const [tariffLevel, setTariffLevel] = useState(0) // 0-100%
  
  // Calculate projected values based on inputs
  const projections = useMemo(() => {
    const oilChange = (oilPrice - BASE_VALUES.oilPrice) / BASE_VALUES.oilPrice
    const rateChange = (interestRate - BASE_VALUES.interestRate) / BASE_VALUES.interestRate
    const tariffFactor = tariffLevel / 100
    
    // CAD/USD projection
    const cadChange = (oilChange * CORRELATIONS.oil.cad) + 
                      (rateChange * CORRELATIONS.interestRate.cad) + 
                      (tariffFactor * CORRELATIONS.tariff.cad)
    const newCad = BASE_VALUES.cadUsd * (1 + cadChange)
    
    // TSX projection
    const tsxChange = (oilChange * CORRELATIONS.oil.tsx) + 
                      (rateChange * CORRELATIONS.interestRate.tsx) + 
                      (tariffFactor * CORRELATIONS.tariff.tsx)
    const newTsx = BASE_VALUES.tsxIndex * (1 + tsxChange)
    
    // Gold projection
    const goldChange = (oilChange * CORRELATIONS.oil.gold) + 
                       (rateChange * CORRELATIONS.interestRate.gold) + 
                       (tariffFactor * CORRELATIONS.tariff.gold)
    const newGold = BASE_VALUES.goldPrice * (1 + goldChange)
    
    // Housing projection
    const housingChange = (oilChange * CORRELATIONS.oil.housing) + 
                          (rateChange * CORRELATIONS.interestRate.housing) + 
                          (tariffFactor * CORRELATIONS.tariff.housing)
    const newHousing = BASE_VALUES.housingIndex * (1 + housingChange)
    
    return {
      cad: { value: newCad, change: cadChange * 100 },
      tsx: { value: newTsx, change: tsxChange * 100 },
      gold: { value: newGold, change: goldChange * 100 },
      housing: { value: newHousing, change: housingChange * 100 },
    }
  }, [oilPrice, interestRate, tariffLevel])

  // Generate chart data for 12-month projection
  const chartData = useMemo(() => {
    const months = ["Now", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"]
    return months.map((month, i) => {
      const progress = i / 12
      return {
        month,
        tsx: BASE_VALUES.tsxIndex + (projections.tsx.value - BASE_VALUES.tsxIndex) * progress,
        housing: BASE_VALUES.housingIndex + (projections.housing.value - BASE_VALUES.housingIndex) * progress,
        cad: BASE_VALUES.cadUsd + (projections.cad.value - BASE_VALUES.cadUsd) * progress,
        gold: BASE_VALUES.goldPrice + (projections.gold.value - BASE_VALUES.goldPrice) * progress,
      }
    })
  }, [projections])

  const resetToDefaults = () => {
    setOilPrice(BASE_VALUES.oilPrice)
    setInterestRate(BASE_VALUES.interestRate)
    setTariffLevel(0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Sliders className="h-8 w-8 text-primary" />
            What-If Simulator
          </h1>
          <p className="text-muted-foreground mt-1">
            Drag the sliders and watch the markets respond in real-time
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={resetToDefaults}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Control Panel */}
        <div className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Adjust Variables</CardTitle>
              <CardDescription>See how changes propagate through the economy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Oil Price Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-chart-4" />
                    Oil Price (WTI)
                  </Label>
                  <span className="font-mono font-bold text-chart-4">
                    US${oilPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={120}
                  step={5}
                  value={oilPrice}
                  onChange={(e) => setOilPrice(Number(e.target.value))}
                  className="w-full accent-chart-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$40 (Crash)</span>
                  <span>$75 (Now)</span>
                  <span>$120 (Spike)</span>
                </div>
              </div>

              {/* Interest Rate Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-primary" />
                    BoC Interest Rate
                  </Label>
                  <span className="font-mono font-bold text-primary">
                    {interestRate.toFixed(2)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={7}
                  step={0.25}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>2% (Cuts)</span>
                  <span>5% (Now)</span>
                  <span>7% (Hikes)</span>
                </div>
              </div>

              {/* Tariff Level Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-destructive" />
                    US Tariff Level
                  </Label>
                  <span className="font-mono font-bold text-destructive">
                    {tariffLevel}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={tariffLevel}
                  onChange={(e) => setTariffLevel(Number(e.target.value))}
                  className="w-full accent-destructive"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0% (Normal)</span>
                  <span>25% (Threat)</span>
                  <span>100% (Trade War)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Scenarios */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Scenarios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => {
                  setOilPrice(100)
                  setInterestRate(5)
                  setTariffLevel(0)
                }}
              >
                Oil Crisis (+33%)
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => {
                  setOilPrice(75)
                  setInterestRate(3)
                  setTariffLevel(0)
                }}
              >
                Rate Cuts Cycle
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => {
                  setOilPrice(60)
                  setInterestRate(5.5)
                  setTariffLevel(50)
                }}
              >
                Trade War + Recession
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => {
                  setOilPrice(90)
                  setInterestRate(4)
                  setTariffLevel(10)
                }}
              >
                Goldilocks (Best Case)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Impact Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className={projections.cad.change >= 0 ? "border-chart-1/30" : "border-destructive/30"}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <DollarSign className="h-4 w-4" />
                  CAD/USD
                </div>
                <p className="text-2xl font-bold">{projections.cad.value.toFixed(3)}</p>
                <Badge variant={projections.cad.change >= 0 ? "default" : "destructive"} className="mt-1">
                  {projections.cad.change >= 0 ? "+" : ""}{projections.cad.change.toFixed(1)}%
                </Badge>
              </CardContent>
            </Card>

            <Card className={projections.tsx.change >= 0 ? "border-chart-1/30" : "border-destructive/30"}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <TrendingUp className="h-4 w-4" />
                  TSX
                </div>
                <p className="text-2xl font-bold">{projections.tsx.value.toFixed(0)}</p>
                <Badge variant={projections.tsx.change >= 0 ? "default" : "destructive"} className="mt-1">
                  {projections.tsx.change >= 0 ? "+" : ""}{projections.tsx.change.toFixed(1)}%
                </Badge>
              </CardContent>
            </Card>

            <Card className={projections.gold.change >= 0 ? "border-chart-1/30" : "border-destructive/30"}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Zap className="h-4 w-4" />
                  Gold (CAD)
                </div>
                <p className="text-2xl font-bold">C${projections.gold.value.toFixed(0)}</p>
                <Badge variant={projections.gold.change >= 0 ? "default" : "destructive"} className="mt-1">
                  {projections.gold.change >= 0 ? "+" : ""}{projections.gold.change.toFixed(1)}%
                </Badge>
              </CardContent>
            </Card>

            <Card className={projections.housing.change >= 0 ? "border-chart-1/30" : "border-destructive/30"}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Home className="h-4 w-4" />
                  Housing
                </div>
                <p className="text-2xl font-bold">{projections.housing.value.toFixed(0)}</p>
                <Badge variant={projections.housing.change >= 0 ? "default" : "destructive"} className="mt-1">
                  {projections.housing.change >= 0 ? "+" : ""}{projections.housing.change.toFixed(1)}%
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Tabs defaultValue="markets" className="w-full">
            <TabsList>
              <TabsTrigger value="markets">Markets</TabsTrigger>
              <TabsTrigger value="housing">Housing</TabsTrigger>
              <TabsTrigger value="currency">Currency</TabsTrigger>
            </TabsList>

            <TabsContent value="markets">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">TSX & Gold 12-Month Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis yAxisId="tsx" stroke="hsl(var(--chart-1))" fontSize={12} />
                        <YAxis yAxisId="gold" orientation="right" stroke="hsl(var(--accent))" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <ReferenceLine yAxisId="tsx" y={BASE_VALUES.tsxIndex} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                        <Line yAxisId="tsx" type="monotone" dataKey="tsx" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} name="TSX Index" />
                        <Line yAxisId="gold" type="monotone" dataKey="gold" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} name="Gold (CAD)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="housing">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Housing Index 12-Month Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis domain={[85, 115]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <ReferenceLine y={100} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label="Current" />
                        <Area 
                          type="monotone" 
                          dataKey="housing" 
                          stroke="hsl(var(--chart-5))" 
                          fill={projections.housing.change >= 0 ? "hsl(var(--chart-1) / 0.2)" : "hsl(var(--destructive) / 0.2)"}
                          strokeWidth={2}
                          name="Housing Index"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="currency">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">CAD/USD 12-Month Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis domain={[0.65, 0.82]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                          formatter={(value: number) => [value.toFixed(4), "CAD/USD"]}
                        />
                        <ReferenceLine y={0.73} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label="Current" />
                        <Area 
                          type="monotone" 
                          dataKey="cad" 
                          stroke="hsl(var(--primary))" 
                          fill={projections.cad.change >= 0 ? "hsl(var(--chart-1) / 0.2)" : "hsl(var(--destructive) / 0.2)"}
                          strokeWidth={2}
                          name="CAD/USD"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Explanation */}
          <Card className="bg-secondary/30">
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">How this works:</strong> This simulator uses simplified economic correlations to project market movements. 
                Oil prices affect the CAD (petro-currency effect) and TSX (energy sector weight). Interest rates impact housing affordability and stock valuations. 
                Tariffs create economic uncertainty, weakening the CAD and equity markets while boosting safe-haven assets like gold.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
