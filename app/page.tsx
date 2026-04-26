import Link from "next/link"
import { 
  ArrowRight,
  BarChart3,
  BookOpen,
  GraduationCap,
  Activity
} from "lucide-react"
import { StockLineChart } from "@/components/home/stock-line-chart"
import { HousingRatesChart } from "@/components/home/housing-rates-chart"
import { TariffImpactChart } from "@/components/home/tariff-impact-chart"

const highlights = [
  { icon: Activity, label: "Real-time Data" },
  { icon: BarChart3, label: "CAD Prices" },
  { icon: GraduationCap, label: "Educational" },
  { icon: BookOpen, label: "Free Forever" },
]

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-background">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_40%,transparent_100%)]" />
      
      {/* Glowing orb effects */}
      <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[150px]" />
      <div className="absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px]" />
      
      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center w-full">
        <div className="flex flex-col items-center gap-6 text-center px-4 pt-12 pb-8 max-w-5xl">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 glow-primary">
              <BarChart3 className="h-7 w-7 text-primary" />
            </div>
          </div>
          
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="text-primary">Statistica</span>
            </h1>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Your Own Hub
            </p>
          </div>

          {/* Description */}
          <p className="max-w-2xl text-base text-muted-foreground leading-relaxed text-balance">
            Understand how global events impact Canadian markets. Real-time data, 
            economic insights, and educational analysis.
            <span className="text-primary font-medium"> 100% free, no subscriptions.</span>
          </p>

          {/* Highlight Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {highlights.map((item) => (
              <div 
                key={item.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-xs"
              >
                <item.icon className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Visualizations */}
        <div className="w-full max-w-7xl px-4 pb-8 space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">Live Market Intelligence</h2>
              <p className="text-sm text-muted-foreground">Click any section for detailed analysis</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-1 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-chart-1" />
              </span>
              Auto-updating
            </div>
          </div>
          
          {/* Stock Line Chart - Full Width */}
          <StockLineChart />
          
          {/* Two Column Layout */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Housing vs Rates */}
            <HousingRatesChart />
            
            {/* Tariff Impact */}
            <TariffImpactChart />
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full max-w-4xl px-4 pb-8">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Explore the Full Dashboard</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Commodities, stocks, Canadian economy, housing market analysis, and geopolitical impact - all in one place.
            </p>
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105 glow-primary"
            >
              <BarChart3 className="h-5 w-5" />
              Launch Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Data Sources & Disclaimer */}
        <div className="w-full border-t border-border bg-card/30 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
              <span className="font-medium">Data Sources:</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary border border-border">Yahoo Finance</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary border border-border">Bank of Canada</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary border border-border">Statistics Canada</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary border border-border">CREA</span>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 max-w-2xl">
              <BookOpen className="h-4 w-4 text-destructive shrink-0" />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Educational purposes only.</span> Not financial advice. 
                Consult professionals before making investment decisions.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Built by</span>
              <span className="font-semibold text-foreground">Nitin</span>
              <span>|</span>
              <span>For the Canadian community</span>
              <span>|</span>
              <span className="text-primary">Statistica</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
