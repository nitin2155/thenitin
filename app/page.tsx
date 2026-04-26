import Link from "next/link"
import { Brain, BarChart3, Sparkles, Globe2, TrendingUp, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_40%,transparent_100%)]" />
      
      {/* Glowing orb effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      
      <main className="relative z-10 flex flex-col items-center gap-8 text-center">
        {/* Icon cluster */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary border border-border">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary border border-border">
            <BarChart3 className="h-5 w-5 text-accent" />
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary border border-border">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* Main heading */}
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-foreground">the</span>
            <span className="text-primary">nitin</span>
            <span className="text-foreground">.space</span>
          </h1>
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            AI-Powered Analytics Platform
          </p>
        </div>

        {/* Description */}
        <p className="max-w-md text-lg text-muted-foreground leading-relaxed">
          Intelligent insights. Real-time data processing. 
          <span className="text-accent"> Now live.</span>
        </p>

        {/* Feature Card - Stocks Dashboard */}
        <Link 
          href="/stocks" 
          className="group w-full max-w-md rounded-xl bg-card border border-border p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
              <Globe2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">Geopolitical Stock Tracker</h3>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-sm text-muted-foreground">
                Track top 20 stocks with real-time geopolitical impact analysis
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="flex items-center gap-1 text-xs text-chart-2">
                  <TrendingUp className="h-3 w-3" />
                  Live Data
                </span>
                <span className="text-xs text-muted-foreground">|</span>
                <span className="text-xs text-muted-foreground">Free API</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Status indicator */}
        <div className="flex items-center gap-2 rounded-full bg-secondary/50 border border-border px-4 py-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-sm text-muted-foreground">More Features Coming</span>
        </div>
      </main>
    </div>
  )
}
