"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Home as HomeIcon,
  Fuel,
  Ship,
  Play,
  Sparkles,
  Globe,
  Send
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

// Animated background with thematic line art watermarks
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] radial-glow" />
      
      {/* Stock Chart Line Art - Top Left */}
      <svg className="absolute top-24 left-8 w-48 h-48 opacity-[0.06] animate-float" viewBox="0 0 100 100" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Chart frame */}
        <rect x="10" y="10" width="80" height="70" rx="4" />
        {/* Candlesticks */}
        <line x1="25" y1="25" x2="25" y2="55" />
        <rect x="22" y="30" width="6" height="15" fill="#22d3ee" fillOpacity="0.3" />
        <line x1="40" y1="20" x2="40" y2="50" />
        <rect x="37" y="25" width="6" height="18" fill="#22d3ee" fillOpacity="0.3" />
        <line x1="55" y1="30" x2="55" y2="60" />
        <rect x="52" y="35" width="6" height="15" fill="#22d3ee" fillOpacity="0.3" />
        <line x1="70" y1="22" x2="70" y2="45" />
        <rect x="67" y="28" width="6" height="12" fill="#22d3ee" fillOpacity="0.3" />
        {/* Trend line */}
        <polyline points="20,55 35,45 50,50 65,35 80,25" strokeDasharray="3 2" />
        {/* Arrow up */}
        <polyline points="75,30 80,25 85,30" />
      </svg>
      
      {/* House Line Art - Top Right */}
      <svg className="absolute top-32 right-12 w-40 h-40 opacity-[0.06] animate-float-delayed" viewBox="0 0 100 100" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* House roof */}
        <polyline points="15,50 50,20 85,50" />
        {/* House body */}
        <rect x="22" y="50" width="56" height="35" />
        {/* Door */}
        <rect x="42" y="60" width="16" height="25" />
        {/* Windows */}
        <rect x="28" y="58" width="10" height="10" />
        <rect x="62" y="58" width="10" height="10" />
        {/* Chimney */}
        <rect x="65" y="28" width="10" height="18" />
        {/* Price chart underneath */}
        <polyline points="20,92 35,88 50,90 65,85 80,82" strokeDasharray="2 2" opacity="0.5" />
      </svg>
      
      {/* Oil/Gas Barrel Line Art - Bottom Left */}
      <svg className="absolute bottom-64 left-16 w-36 h-36 opacity-[0.06] animate-float-slow" viewBox="0 0 100 100" fill="none" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Barrel body */}
        <ellipse cx="50" cy="20" rx="25" ry="8" />
        <ellipse cx="50" cy="80" rx="25" ry="8" />
        <line x1="25" y1="20" x2="25" y2="80" />
        <line x1="75" y1="20" x2="75" y2="80" />
        {/* Barrel bands */}
        <ellipse cx="50" cy="35" rx="25" ry="6" strokeDasharray="4 2" />
        <ellipse cx="50" cy="65" rx="25" ry="6" strokeDasharray="4 2" />
        {/* Oil drop */}
        <path d="M50,45 Q55,52 50,60 Q45,52 50,45" fill="#eab308" fillOpacity="0.2" />
        {/* Flame */}
        <path d="M85,70 Q90,60 85,50 Q92,58 88,70 Q85,65 85,70" />
      </svg>
      
      {/* Ship/Trade Line Art - Bottom Right */}
      <svg className="absolute bottom-48 right-20 w-44 h-44 opacity-[0.06] animate-float" viewBox="0 0 100 100" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Ship hull */}
        <path d="M10,70 Q15,80 50,80 Q85,80 90,70 L85,55 L15,55 Z" />
        {/* Deck */}
        <rect x="25" y="45" width="50" height="10" />
        {/* Bridge */}
        <rect x="35" y="30" width="30" height="15" />
        {/* Smoke stack */}
        <rect x="55" y="20" width="8" height="12" />
        {/* Smoke */}
        <path d="M59,20 Q65,15 62,10 Q68,12 65,5" strokeDasharray="2 2" />
        {/* Containers */}
        <rect x="28" y="48" width="8" height="6" />
        <rect x="38" y="48" width="8" height="6" />
        <rect x="54" y="48" width="8" height="6" />
        <rect x="64" y="48" width="8" height="6" />
        {/* Waves */}
        <path d="M5,85 Q15,82 25,85 Q35,88 45,85 Q55,82 65,85 Q75,88 85,85 Q95,82 100,85" />
      </svg>
      
      {/* Dollar/Economy Line Art - Middle */}
      <svg className="absolute top-1/2 left-1/4 w-32 h-32 opacity-[0.04] animate-float-delayed" viewBox="0 0 100 100" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Dollar sign in circle */}
        <circle cx="50" cy="50" r="35" />
        <path d="M50,25 L50,75" />
        <path d="M38,35 Q50,30 62,38 Q50,45 38,50 Q50,55 62,62 Q50,70 38,65" />
      </svg>

      {/* Floating accent dots */}
      <div className="absolute top-1/4 left-24 w-2 h-2 rounded-full bg-primary/30 animate-float" />
      <div className="absolute top-1/3 right-32 w-3 h-3 rounded-full bg-chart-1/20 animate-float-delayed" />
      <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-accent/25 animate-float-slow" />
      <div className="absolute top-2/3 right-1/4 w-2 h-2 rounded-full bg-chart-5/20 animate-float" />
      <div className="absolute bottom-1/4 right-1/3 w-3 h-3 rounded-full bg-primary/15 animate-float-delayed" />
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

export default function HomePage() {
  const [sparklines, setSparklines] = useState({
    stocks: Array(20).fill(50),
    housing: Array(20).fill(50),
    gas: Array(20).fill(50),
    trade: Array(20).fill(50),
  })
  
  // Generate sparklines on client only to avoid hydration mismatch
  useEffect(() => {
    setSparklines({
      stocks: generateSparkline("up"),
      housing: generateSparkline("down"),
      gas: generateSparkline("volatile"),
      trade: generateSparkline("up"),
    })
  }, [])

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
                  <HomeIcon className="h-4 w-4 text-chart-5" />
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

      {/* World Map Section */}
      <section className="relative z-10 px-4 py-16 border-t border-border bg-gradient-to-b from-background to-card/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Global Expansion</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">More Analysis Coming</h2>
            <p className="text-muted-foreground">Currently focused on Canada. Global markets coming soon.</p>
          </div>
          
          {/* Region Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {/* Canada - Active */}
            <div className="relative p-6 rounded-xl bg-primary/10 border-2 border-primary overflow-hidden group">
              <div className="absolute top-2 right-2">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-1 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-chart-1" />
                </span>
              </div>
              <div className="text-4xl mb-3">🇨🇦</div>
              <h3 className="font-bold text-foreground mb-1">Canada</h3>
              <p className="text-xs text-primary font-semibold">LIVE NOW</p>
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary">TSX</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary">Housing</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary">BoC</span>
              </div>
            </div>
            
            {/* USA - Coming Soon */}
            <div className="relative p-6 rounded-xl bg-card border border-border opacity-60 hover:opacity-80 transition-opacity">
              <div className="absolute top-2 right-2 text-[10px] text-muted-foreground">SOON</div>
              <div className="text-4xl mb-3 grayscale">🇺🇸</div>
              <h3 className="font-bold text-foreground mb-1">United States</h3>
              <p className="text-xs text-muted-foreground">Q2 2026</p>
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">S&P 500</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">Fed</span>
              </div>
            </div>
            
            {/* Europe - Coming Soon */}
            <div className="relative p-6 rounded-xl bg-card border border-border opacity-60 hover:opacity-80 transition-opacity">
              <div className="absolute top-2 right-2 text-[10px] text-muted-foreground">SOON</div>
              <div className="text-4xl mb-3 grayscale">🇪🇺</div>
              <h3 className="font-bold text-foreground mb-1">Europe</h3>
              <p className="text-xs text-muted-foreground">Q3 2026</p>
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">FTSE</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">ECB</span>
              </div>
            </div>
            
            {/* India - Coming Soon */}
            <div className="relative p-6 rounded-xl bg-card border border-border opacity-60 hover:opacity-80 transition-opacity">
              <div className="absolute top-2 right-2 text-[10px] text-muted-foreground">SOON</div>
              <div className="text-4xl mb-3 grayscale">🇮🇳</div>
              <h3 className="font-bold text-foreground mb-1">India</h3>
              <p className="text-xs text-muted-foreground">Q4 2026</p>
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">NIFTY</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">RBI</span>
              </div>
            </div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-8">
            Want us to prioritize a specific market? Let us know below!
          </p>
        </div>
      </section>

      {/* Suggestions Section - Black Background */}
      <section className="relative z-10 bg-black py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              What Should We Build Next?
            </h2>
            <p className="text-gray-400">
              Your feedback shapes this hub. Tell us what analysis would help you most.
            </p>
          </div>
          
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input 
                placeholder="Your name (optional)" 
                className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-primary"
              />
              <Input 
                placeholder="Email (optional)" 
                type="email"
                className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-primary"
              />
            </div>
            <Textarea 
              placeholder="What would you like to see? More sectors? Different countries? Specific analysis tools? Let us know..."
              rows={4}
              className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-primary resize-none"
            />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs cursor-pointer hover:bg-gray-700 transition-colors">US Markets</span>
                <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs cursor-pointer hover:bg-gray-700 transition-colors">UK Analysis</span>
                <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs cursor-pointer hover:bg-gray-700 transition-colors">India Markets</span>
                <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs cursor-pointer hover:bg-gray-700 transition-colors">Currency Tools</span>
              </div>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
                Submit Suggestion
              </Button>
            </div>
          </form>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-500">
              Built with care by <span className="text-white">Nitin</span> for the community
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black border-t border-gray-800 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">
                <span className="text-white">Nitin&apos;s</span>
                <span className="text-primary ml-1">space</span>
              </span>
              <span>| Hub is growing</span>
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
