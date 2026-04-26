"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Home,
  Fuel,
  Ship,
  Play,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { StockLineChart } from "@/components/home/stock-line-chart"
import { HousingRatesChart } from "@/components/home/housing-rates-chart"
import { TariffImpactChart } from "@/components/home/tariff-impact-chart"
import { GeopoliticalChart } from "@/components/home/geopolitical-chart"

// Mini sparkline data generators
const generateSparkline = (trend: "up" | "down" | "volatile", points: number = 20) => {
  const data = []
  let value = 50
  for (let i = 0; i < points; i++) {
    if (trend === "up") {
      value += Math.random() * 3 - 0.5
    } else if (trend === "down") {
      value -= Math.random() * 3 - 0.5
    } else {
      value += Math.random() * 6 - 3
    }
    value = Math.max(10, Math.min(90, value))
    data.push(value)
  }
  return data
}

// Animated mini chart component
function MiniSparkline({ data, color }: { data: number[], color: string }) {
  const [offset, setOffset] = useState(500)
  
  useEffect(() => {
    const timer = setTimeout(() => setOffset(0), 100)
    return () => clearTimeout(timer)
  }, [])

  const width = 120
  const height = 40
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * height
    return `${x},${y}`
  }).join(" ")

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`gradient-${color.replace("#", "")}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#gradient-${color.replace("#", "")})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ 
          strokeDasharray: 500, 
          strokeDashoffset: offset,
          transition: "stroke-dashoffset 2s ease-out"
        }}
      />
      <circle
        cx={width}
        cy={height - ((data[data.length - 1] - min) / range) * height}
        r="4"
        fill={color}
        className="animate-live-pulse"
      />
    </svg>
  )
}

// Animated background
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] radial-glow" />
      
      {/* Floating chart lines */}
      <svg className="absolute top-32 left-10 w-72 h-36 opacity-[0.07] animate-float" viewBox="0 0 200 100">
        <polyline points="0,80 30,60 60,70 90,40 120,50 150,20 180,30 200,10" fill="none" stroke="#22c55e" strokeWidth="3" />
      </svg>
      
      <svg className="absolute top-48 right-16 w-56 h-28 opacity-[0.07] animate-float-delayed" viewBox="0 0 200 100">
        <polyline points="0,20 40,40 80,30 120,60 160,50 200,80" fill="none" stroke="#ef4444" strokeWidth="3" />
      </svg>
      
      <svg className="absolute bottom-48 left-1/4 w-64 h-32 opacity-[0.07] animate-float-slow" viewBox="0 0 200 100">
        <polyline points="0,50 50,30 100,60 150,40 200,50" fill="none" stroke="#22d3ee" strokeWidth="3" />
      </svg>

      {/* Floating dots */}
      <div className="absolute top-1/4 left-16 w-3 h-3 rounded-full bg-chart-1/20 animate-float" />
      <div className="absolute top-1/3 right-24 w-4 h-4 rounded-full bg-primary/20 animate-float-delayed" />
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 rounded-full bg-accent/20 animate-float-slow" />
      <div className="absolute top-2/3 right-1/3 w-2 h-2 rounded-full bg-chart-5/20 animate-float" />
    </div>
  )
}

// Quick stats with live animation
const quickStats = [
  { label: "TSX", value: "+0.8%", trend: "up" as const },
  { label: "Gold", value: "+1.2%", trend: "up" as const },
  { label: "CAD/USD", value: "-0.3%", trend: "down" as const },
  { label: "Oil", value: "+2.4%", trend: "up" as const },
]

export default function Home() {
  const [sparklines] = useState(() => ({
    stocks: generateSparkline("up"),
    housing: generateSparkline("down"),
    gas: generateSparkline("volatile"),
    trade: generateSparkline("up"),
  }))

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Live Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-chart-1/10 border border-chart-1/30 mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-1 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-chart-1" />
            </span>
            <span className="text-sm font-semibold text-chart-1 uppercase tracking-wider">Live Data</span>
          </div>
          
          {/* Brand */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-3">
            <span className="text-foreground">Nitin&apos;s</span>
            <span className="text-primary ml-3">space</span>
          </h1>
          
          <p className="text-lg text-muted-foreground flex items-center justify-center gap-2 mb-4">
            Hub is growing
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-chart-1 animate-live-pulse" />
          </p>
          
          <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-6">
            Real-time Canadian financial intelligence. Stocks, housing, commodities, and geopolitical impact - all in CAD.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {quickStats.map((stat) => (
              <div 
                key={stat.label}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/60 border border-border backdrop-blur-sm"
              >
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <span className={`text-sm font-bold ${stat.trend === "up" ? "text-chart-1" : "text-chart-2"}`}>
                  {stat.value}
                </span>
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3.5 w-3.5 text-chart-1" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-chart-2" />
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 text-base px-8 glow-primary">
              <Play className="h-4 w-4" />
              Explore Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Mini Sparkline Cards - Visual Preview */}
      <section className="relative z-10 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Stocks */}
            <Link 
              href="/dashboard/stocks"
              className="group p-4 rounded-xl bg-card border border-border hover:border-chart-1/50 transition-all card-hover"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-chart-1" />
                  <span className="text-xs font-medium text-muted-foreground">Stocks</span>
                </div>
                <span className="text-xs font-bold text-chart-1">+1.2%</span>
              </div>
              <MiniSparkline data={sparklines.stocks} color="#22c55e" />
              <p className="mt-2 text-[10px] text-muted-foreground">TSX Composite</p>
            </Link>

            {/* Housing */}
            <Link 
              href="/dashboard/housing"
              className="group p-4 rounded-xl bg-card border border-border hover:border-chart-5/50 transition-all card-hover"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-chart-5" />
                  <span className="text-xs font-medium text-muted-foreground">Housing</span>
                </div>
                <span className="text-xs font-bold text-chart-2">-12%</span>
              </div>
              <MiniSparkline data={sparklines.housing} color="#a855f7" />
              <p className="mt-2 text-[10px] text-muted-foreground">From 2022 Peak</p>
            </Link>

            {/* Gas */}
            <Link 
              href="/dashboard/commodities"
              className="group p-4 rounded-xl bg-card border border-border hover:border-accent/50 transition-all card-hover"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-accent" />
                  <span className="text-xs font-medium text-muted-foreground">Gas</span>
                </div>
                <span className="text-xs font-bold text-chart-1">+3.8%</span>
              </div>
              <MiniSparkline data={sparklines.gas} color="#f59e0b" />
              <p className="mt-2 text-[10px] text-muted-foreground">CAD/MMBtu</p>
            </Link>

            {/* Trade */}
            <Link 
              href="/dashboard/tariffs"
              className="group p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all card-hover"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Ship className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">Trade</span>
                </div>
                <span className="text-xs font-bold text-chart-2">-$180B</span>
              </div>
              <MiniSparkline data={sparklines.trade} color="#22d3ee" />
              <p className="mt-2 text-[10px] text-muted-foreground">US Tariff Impact</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Charts Section */}
      <section className="relative z-10 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Live Market Intelligence</h2>
              <p className="text-sm text-muted-foreground">Click any chart for detailed analysis</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-1 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-chart-1" />
              </span>
              Auto-updating
            </div>
          </div>
          
          {/* Stock Chart */}
          <div className="mb-6 card-hover">
            <StockLineChart />
          </div>
          
          {/* Three Column - Key Insights */}
          <div className="grid gap-6 lg:grid-cols-3 mb-6">
            <div className="card-hover">
              <HousingRatesChart />
            </div>
            <div className="card-hover">
              <TariffImpactChart />
            </div>
            <div className="card-hover">
              <GeopoliticalChart />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tools */}
      <section className="relative z-10 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-primary/20 p-8 text-center">
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="text-xl font-bold text-foreground mb-2">Interactive Tools</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Test your own scenarios - see how rate changes, tariffs, and market shifts would affect YOU.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/dashboard/calculator">
                <Button variant="outline" size="sm">Personal Impact</Button>
              </Link>
              <Link href="/dashboard/simulator">
                <Button variant="outline" size="sm">What-If Simulator</Button>
              </Link>
              <Link href="/dashboard/learn">
                <Button variant="outline" size="sm">Guess & Learn</Button>
              </Link>
              <Link href="/dashboard/stress-test">
                <Button variant="outline" size="sm">Stress Test</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">
                <span className="text-foreground">Nitin&apos;s</span>
                <span className="text-primary ml-1">space</span>
              </span>
              <span className="text-muted-foreground">| Hub is growing</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Educational only</span>
              <span>|</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-chart-1 animate-live-pulse" />
                Live
              </span>
              <span>|</span>
              <span>All in CAD</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
