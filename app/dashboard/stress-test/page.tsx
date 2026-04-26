"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts"
import { 
  Shield, 
  Plus, 
  X, 
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Zap,
  History,
  DollarSign
} from "lucide-react"

// Available assets to add
const AVAILABLE_ASSETS = [
  // TSX Stocks
  { symbol: "RY", name: "Royal Bank", type: "stock", exchange: "TSX" },
  { symbol: "TD", name: "TD Bank", type: "stock", exchange: "TSX" },
  { symbol: "ENB", name: "Enbridge", type: "stock", exchange: "TSX" },
  { symbol: "CNR", name: "CN Rail", type: "stock", exchange: "TSX" },
  { symbol: "SHOP", name: "Shopify", type: "stock", exchange: "TSX" },
  { symbol: "SU", name: "Suncor", type: "stock", exchange: "TSX" },
  { symbol: "BMO", name: "Bank of Montreal", type: "stock", exchange: "TSX" },
  { symbol: "BCE", name: "BCE Inc", type: "stock", exchange: "TSX" },
  { symbol: "ABX", name: "Barrick Gold", type: "stock", exchange: "TSX" },
  { symbol: "MFC", name: "Manulife", type: "stock", exchange: "TSX" },
  // US Stocks
  { symbol: "AAPL", name: "Apple", type: "stock", exchange: "NASDAQ" },
  { symbol: "MSFT", name: "Microsoft", type: "stock", exchange: "NASDAQ" },
  { symbol: "GOOGL", name: "Alphabet", type: "stock", exchange: "NASDAQ" },
  { symbol: "AMZN", name: "Amazon", type: "stock", exchange: "NASDAQ" },
  { symbol: "NVDA", name: "NVIDIA", type: "stock", exchange: "NASDAQ" },
  // Commodities/ETFs
  { symbol: "GLD", name: "Gold ETF", type: "commodity", exchange: "ETF" },
  { symbol: "SLV", name: "Silver ETF", type: "commodity", exchange: "ETF" },
  { symbol: "USO", name: "Oil ETF", type: "commodity", exchange: "ETF" },
  { symbol: "XEG", name: "iShares Energy", type: "etf", exchange: "TSX" },
  { symbol: "XFN", name: "iShares Financials", type: "etf", exchange: "TSX" },
]

// Historical crisis performance data (actual approximate values)
const CRISIS_DATA: Record<string, Record<string, number>> = {
  "2008": {
    RY: -35, TD: -32, ENB: -25, CNR: -30, SU: -55, BMO: -38, BCE: -20, ABX: 15, MFC: -60,
    AAPL: -45, MSFT: -40, GOOGL: -50, AMZN: -45, NVDA: -65,
    GLD: 5, SLV: -20, USO: -55, XEG: -50, XFN: -45, SHOP: -40
  },
  "covid": {
    RY: -25, TD: -28, ENB: -40, CNR: -20, SU: -60, BMO: -30, BCE: -15, ABX: 30, MFC: -35,
    AAPL: -30, MSFT: -25, GOOGL: -28, AMZN: -10, NVDA: -25,
    GLD: 8, SLV: -15, USO: -70, XEG: -50, XFN: -30, SHOP: -20
  },
  "ratehike": {
    RY: -15, TD: -18, ENB: 10, CNR: -8, SU: 25, BMO: -12, BCE: -25, ABX: -10, MFC: -20,
    AAPL: -25, MSFT: -28, GOOGL: -35, AMZN: -40, NVDA: -50,
    GLD: -5, SLV: -15, USO: 30, XEG: 20, XFN: -15, SHOP: -70
  },
  "tariff": {
    RY: -8, TD: -10, ENB: -15, CNR: -12, SU: -20, BMO: -8, BCE: -5, ABX: 10, MFC: -12,
    AAPL: -15, MSFT: -10, GOOGL: -12, AMZN: -18, NVDA: -20,
    GLD: 8, SLV: 5, USO: -10, XEG: -15, XFN: -10, SHOP: -25
  }
}

const CRISIS_INFO = {
  "2008": {
    name: "2008 Financial Crisis",
    period: "Sep 2008 - Mar 2009",
    description: "Global banking collapse triggered by subprime mortgage crisis",
    icon: "💥"
  },
  "covid": {
    name: "COVID-19 Crash",
    period: "Feb - Mar 2020",
    description: "Fastest market crash in history due to pandemic lockdowns",
    icon: "🦠"
  },
  "ratehike": {
    name: "2022 Rate Hike Cycle",
    period: "Jan 2022 - Oct 2022",
    description: "Central banks raised rates aggressively to fight inflation",
    icon: "📈"
  },
  "tariff": {
    name: "Trade War Scenario",
    period: "Projected",
    description: "Simulated impact of escalated US-Canada tariffs",
    icon: "🚢"
  }
}

interface PortfolioItem {
  symbol: string
  name: string
  type: string
  exchange: string
  amount: number
}

export default function StressTestPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    { symbol: "RY", name: "Royal Bank", type: "stock", exchange: "TSX", amount: 10000 },
    { symbol: "ENB", name: "Enbridge", type: "stock", exchange: "TSX", amount: 8000 },
    { symbol: "GLD", name: "Gold ETF", type: "commodity", exchange: "ETF", amount: 5000 },
  ])
  const [selectedCrisis, setSelectedCrisis] = useState<string>("covid")
  const [showAddAsset, setShowAddAsset] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [newAmount, setNewAmount] = useState(5000)

  // Calculate portfolio value and stress test results
  const results = useMemo(() => {
    const totalValue = portfolio.reduce((sum, item) => sum + item.amount, 0)
    const crisisData = CRISIS_DATA[selectedCrisis]
    
    const itemResults = portfolio.map(item => {
      const changePercent = crisisData[item.symbol] || -20 // default -20% if no data
      const changeAmount = (item.amount * changePercent) / 100
      const newValue = item.amount + changeAmount
      
      return {
        ...item,
        changePercent,
        changeAmount,
        newValue,
        weight: (item.amount / totalValue) * 100
      }
    })
    
    const totalLoss = itemResults.reduce((sum, item) => sum + item.changeAmount, 0)
    const totalLossPercent = (totalLoss / totalValue) * 100
    const newTotalValue = totalValue + totalLoss
    
    // Find best and worst performers
    const sorted = [...itemResults].sort((a, b) => b.changePercent - a.changePercent)
    const best = sorted[0]
    const worst = sorted[sorted.length - 1]
    
    return {
      totalValue,
      totalLoss,
      totalLossPercent,
      newTotalValue,
      items: itemResults,
      best,
      worst
    }
  }, [portfolio, selectedCrisis])

  // Chart data
  const chartData = results.items.map(item => ({
    name: item.symbol,
    change: item.changePercent,
    amount: item.changeAmount
  }))

  const addAsset = (asset: typeof AVAILABLE_ASSETS[0]) => {
    if (portfolio.find(p => p.symbol === asset.symbol)) return
    setPortfolio([...portfolio, { ...asset, amount: newAmount }])
    setShowAddAsset(false)
    setSearchTerm("")
  }

  const removeAsset = (symbol: string) => {
    setPortfolio(portfolio.filter(p => p.symbol !== symbol))
  }

  const updateAmount = (symbol: string, amount: number) => {
    setPortfolio(portfolio.map(p => 
      p.symbol === symbol ? { ...p, amount } : p
    ))
  }

  const filteredAssets = AVAILABLE_ASSETS.filter(
    a => !portfolio.find(p => p.symbol === a.symbol) &&
    (a.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
     a.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getRiskLevel = () => {
    if (results.totalLossPercent > -20) return { level: "Low", color: "text-chart-1", bg: "bg-chart-1/10" }
    if (results.totalLossPercent > -35) return { level: "Moderate", color: "text-accent", bg: "bg-accent/10" }
    return { level: "High", color: "text-destructive", bg: "bg-destructive/10" }
  }

  const risk = getRiskLevel()
  const crisisInfo = CRISIS_INFO[selectedCrisis as keyof typeof CRISIS_INFO]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          Portfolio Stress Test
        </h1>
        <p className="text-muted-foreground mt-1">
          See how your holdings would perform during major market crises
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Portfolio Builder */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Your Portfolio</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAddAsset(!showAddAsset)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <CardDescription>
                Total: C${results.totalValue.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {showAddAsset && (
                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-3 mb-4">
                  <Input
                    placeholder="Search assets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <Label className="text-xs whitespace-nowrap">Amount:</Label>
                    <Input
                      type="number"
                      value={newAmount}
                      onChange={(e) => setNewAmount(Number(e.target.value))}
                      className="w-24 h-8 text-sm"
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {filteredAssets.slice(0, 8).map(asset => (
                      <button
                        key={asset.symbol}
                        onClick={() => addAsset(asset)}
                        className="w-full p-2 text-left rounded-md hover:bg-secondary text-sm flex justify-between items-center"
                      >
                        <span>
                          <span className="font-medium">{asset.symbol}</span>
                          <span className="text-muted-foreground ml-2">{asset.name}</span>
                        </span>
                        <Badge variant="outline" className="text-xs">{asset.exchange}</Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {portfolio.map(item => (
                <div key={item.symbol} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.symbol}</span>
                      <Badge variant="outline" className="text-xs">{item.exchange}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.name}</p>
                  </div>
                  <Input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateAmount(item.symbol, Number(e.target.value))}
                    className="w-24 h-8 text-sm"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => removeAsset(item.symbol)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {portfolio.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Add assets to test your portfolio
                </p>
              )}
            </CardContent>
          </Card>

          {/* Crisis Selector */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-4 w-4" />
                Select Crisis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(CRISIS_INFO).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCrisis(key)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedCrisis === key 
                      ? "border-2 border-primary bg-primary/10" 
                      : "border border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{info.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{info.name}</p>
                      <p className="text-xs text-muted-foreground">{info.period}</p>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <DollarSign className="h-4 w-4" />
                  Before
                </div>
                <p className="text-xl font-bold">C${results.totalValue.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className={results.totalLoss < 0 ? "border-destructive/30" : "border-chart-1/30"}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <TrendingDown className="h-4 w-4" />
                  After
                </div>
                <p className="text-xl font-bold">C${results.newTotalValue.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className={results.totalLoss < 0 ? "border-destructive/30" : "border-chart-1/30"}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Zap className="h-4 w-4" />
                  Change
                </div>
                <p className={`text-xl font-bold ${results.totalLoss < 0 ? "text-destructive" : "text-chart-1"}`}>
                  {results.totalLoss >= 0 ? "+" : ""}C${results.totalLoss.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card className={risk.bg}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Level
                </div>
                <p className={`text-xl font-bold ${risk.color}`}>{risk.level}</p>
              </CardContent>
            </Card>
          </div>

          {/* Crisis Info */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{crisisInfo.icon}</span>
                <div>
                  <h3 className="font-bold text-lg">{crisisInfo.name}</h3>
                  <p className="text-sm text-muted-foreground">{crisisInfo.period}</p>
                  <p className="text-sm mt-1">{crisisInfo.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Asset Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={60} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)}%`, "Change"]}
                    />
                    <Bar dataKey="change" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.change >= 0 ? "hsl(var(--chart-1))" : "hsl(var(--destructive))"} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Best/Worst */}
          <div className="grid md:grid-cols-2 gap-4">
            {results.best && (
              <Card className="border-chart-1/30">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-1/10">
                      <CheckCircle2 className="h-5 w-5 text-chart-1" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Best Performer</p>
                      <p className="font-bold">{results.best.symbol} <span className="text-chart-1">({results.best.changePercent >= 0 ? "+" : ""}{results.best.changePercent}%)</span></p>
                      <p className="text-xs text-muted-foreground">{results.best.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {results.worst && (
              <Card className="border-destructive/30">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Worst Performer</p>
                      <p className="font-bold">{results.worst.symbol} <span className="text-destructive">{results.worst.changePercent}%</span></p>
                      <p className="text-xs text-muted-foreground">{results.worst.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Insights */}
          <Card className="bg-secondary/30">
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Portfolio Insight:</strong>{" "}
                {results.totalLossPercent > -15 
                  ? "Your portfolio shows good resilience with diversification across sectors. The gold/commodity allocation helps offset equity losses."
                  : results.totalLossPercent > -30
                    ? "Moderate risk exposure. Consider adding more defensive assets like gold or dividend stocks to reduce volatility."
                    : "High concentration in volatile sectors. Diversifying into defensive assets and bonds could significantly reduce drawdown risk."
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
