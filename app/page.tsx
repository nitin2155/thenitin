import Link from "next/link"
import { 
  TrendingUp, 
  Bitcoin, 
  Landmark, 
  Home as HomeIcon, 
  Globe2, 
  Calculator, 
  ArrowRight,
  Zap,
  Activity,
  BarChart3,
  Bell,
  Share2,
  GitCompare
} from "lucide-react"

const features = [
  {
    icon: TrendingUp,
    title: "Stock Markets",
    description: "TSX and US stocks with live prices and geopolitical risk ratings",
    href: "/dashboard/stocks",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    borderColor: "border-chart-1/20"
  },
  {
    icon: Bitcoin,
    title: "Cryptocurrency",
    description: "Top 20 coins with real-time CAD pricing and volatility tracking",
    href: "/dashboard/crypto",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20"
  },
  {
    icon: Landmark,
    title: "Canadian Economy",
    description: "Bank of Canada rates, inflation data, and economic indicators",
    href: "/dashboard/economy",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20"
  },
  {
    icon: HomeIcon,
    title: "Housing Market",
    description: "Regional benchmark prices and affordability across Canada",
    href: "/dashboard/housing",
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
    borderColor: "border-chart-5/20"
  },
  {
    icon: Globe2,
    title: "Geopolitical Analysis",
    description: "Historical events and their impact on markets and the CAD",
    href: "/dashboard/geopolitics",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    borderColor: "border-chart-4/20"
  },
  {
    icon: Calculator,
    title: "Financial Tools",
    description: "Mortgage calculators and investment planners for Canadians",
    href: "/dashboard/tools",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    borderColor: "border-chart-3/20"
  }
]

const highlights = [
  { icon: Activity, label: "Real-time Data", description: "Live market updates" },
  { icon: Bell, label: "Market Alerts", description: "Significant move notifications" },
  { icon: Share2, label: "Shareable", description: "Social-ready insight cards" },
  { icon: GitCompare, label: "Compare", description: "Side-by-side analysis" },
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
        <div className="flex flex-col items-center gap-8 text-center px-4 pt-20 pb-16 max-w-5xl">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 glow-primary">
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              <span className="text-foreground">The</span>
              <span className="text-primary">Nitin</span>
            </h1>
            <p className="text-base font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Real-Time Financial Intelligence
            </p>
          </div>

          {/* Description */}
          <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed text-balance">
            Live market data, economic insights, and geopolitical analysis tailored for 
            Canadian investors. Educational platform with 
            <span className="text-primary font-medium"> free, open APIs</span> - 
            no subscriptions required.
          </p>

          {/* Highlight Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {highlights.map((item) => (
              <div 
                key={item.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border"
              >
                <item.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105 glow-primary"
            >
              <BarChart3 className="h-5 w-5" />
              Launch Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-1 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-chart-1" />
              </span>
              Markets are open
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="w-full max-w-6xl px-4 pb-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className={`group p-6 rounded-xl bg-card/50 backdrop-blur border ${feature.borderColor} hover:border-primary/50 transition-all hover:bg-card hover:scale-[1.02]`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${feature.bgColor} border ${feature.borderColor}`}>
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
        </div>

        {/* Data Sources & Disclaimer */}
        <div className="w-full border-t border-border bg-card/30 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col items-center gap-6">
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
              <span className="font-medium">Data Sources:</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary border border-border">Yahoo Finance</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary border border-border">CoinGecko</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary border border-border">Bank of Canada</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary border border-border">Statistics Canada</span>
            </div>
            
            <p className="text-xs text-muted-foreground max-w-2xl text-center">
              For educational and informational purposes only. This is not financial advice. 
              Always conduct your own research and consult with qualified professionals before making investment decisions.
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Built by</span>
              <span className="font-semibold text-foreground">Nitin</span>
              <span>for the Canadian community</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
