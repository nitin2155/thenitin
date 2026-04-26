import Link from "next/link"
import { 
  TrendingUp, 
  Bitcoin, 
  Landmark, 
  Home, 
  Globe2, 
  Calculator, 
  ArrowRight,
  MapleLeaf,
  BarChart3
} from "lucide-react"

const features = [
  {
    icon: TrendingUp,
    title: "Stock Markets",
    description: "TSX & US stocks with geopolitical exposure ratings",
    href: "/dashboard/stocks",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10"
  },
  {
    icon: Bitcoin,
    title: "Cryptocurrency",
    description: "Top 20 coins with CAD pricing and risk factors",
    href: "/dashboard/crypto",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10"
  },
  {
    icon: Landmark,
    title: "Canadian Economy",
    description: "Bank of Canada rates, inflation, and economic data",
    href: "/dashboard/economy",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10"
  },
  {
    icon: Home,
    title: "Housing Market",
    description: "Regional prices and affordability across Canada",
    href: "/dashboard/housing",
    color: "text-accent",
    bgColor: "bg-accent/10"
  },
  {
    icon: Globe2,
    title: "Geopolitical Analysis",
    description: "Historical events and their market impact",
    href: "/dashboard/geopolitics",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Calculator,
    title: "Financial Tools",
    description: "Mortgage and investment calculators for Canadians",
    href: "/dashboard/tools",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10"
  }
]

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-16">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_40%,transparent_100%)]" />
      
      {/* Glowing orb effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      
      <main className="relative z-10 flex flex-col items-center gap-10 text-center max-w-5xl w-full">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 border border-destructive/20">
              <MapleLeaf className="h-6 w-6 text-destructive" />
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="text-foreground">Maple</span>
              <span className="text-primary">Markets</span>
            </h1>
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Canadian Financial Intelligence Platform
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed text-balance">
          Real-time market data, economic indicators, and geopolitical analysis 
          tailored for Canadian investors. All data from 
          <span className="text-primary font-medium"> free, open APIs</span> - 
          no subscriptions required.
        </p>

        {/* CTA Button */}
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          <BarChart3 className="h-5 w-5" />
          Open Dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>

        {/* Feature Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full mt-4">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 text-left"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${feature.bgColor} border border-current/20`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Data Sources */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground mt-4">
          <span>Data from:</span>
          <span className="px-2 py-1 rounded bg-secondary">Yahoo Finance</span>
          <span className="px-2 py-1 rounded bg-secondary">CoinGecko</span>
          <span className="px-2 py-1 rounded bg-secondary">Bank of Canada</span>
          <span className="px-2 py-1 rounded bg-secondary">CREA Stats</span>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 rounded-full bg-secondary/50 border border-border px-4 py-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-2 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-chart-2" />
          </span>
          <span className="text-sm text-muted-foreground">Live Data - No API Key Required</span>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground max-w-xl">
          For educational and informational purposes only. Not financial advice. 
          Always do your own research before making investment decisions.
        </p>
      </main>
    </div>
  )
}
