import Link from "next/link"
import { 
  TrendingUp, 
  Landmark, 
  Home as HomeIcon, 
  Globe2, 
  ArrowRight,
  Activity,
  BarChart3,
  Bell,
  Share2,
  GitCompare,
  BookOpen,
  GraduationCap,
  Lightbulb,
  Gem,
  Building2,
  TrendingDown
} from "lucide-react"
import { LiveCommodityChart } from "@/components/home/live-commodity-chart"

const features = [
  {
    icon: Gem,
    title: "Commodities",
    description: "Gold, silver, oil, gas with real-time CAD prices and geopolitical impact analysis",
    href: "/dashboard/commodities",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20"
  },
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
    description: "From 2010 boom to post-COVID correction - understand what drives Canadian housing",
    href: "/dashboard/housing",
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
    borderColor: "border-chart-5/20"
  },
  {
    icon: Globe2,
    title: "Geopolitical Analysis",
    description: "Historical events and their impact on Canadian markets and the CAD",
    href: "/dashboard/geopolitics",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    borderColor: "border-chart-4/20"
  }
]

const highlights = [
  { icon: Activity, label: "Real-time Data", description: "Live market updates" },
  { icon: Bell, label: "Market Alerts", description: "Significant move notifications" },
  { icon: Share2, label: "Shareable", description: "Social-ready insight cards" },
  { icon: GitCompare, label: "Compare", description: "Side-by-side analysis" },
]

const educationalTopics = [
  {
    icon: Globe2,
    title: "How Wars Affect Your Portfolio",
    description: "Learn how conflicts drive safe-haven demand for gold and create energy supply shocks",
    insight: "Gold rose 25% during the 2022 Ukraine conflict"
  },
  {
    icon: Landmark,
    title: "Interest Rates & Your Mortgage",
    description: "Understand how Bank of Canada decisions impact housing affordability",
    insight: "Every 1% rate hike = ~10% less buying power"
  },
  {
    icon: TrendingUp,
    title: "TSX Energy Sector Dynamics",
    description: "Canadian energy stocks correlation with global oil prices and OPEC decisions",
    insight: "TSX Energy moves ~0.7 with WTI crude"
  },
  {
    icon: Building2,
    title: "Canadian Housing Crisis Explained",
    description: "From pre-COVID stability to pandemic boom and the 2023+ correction",
    insight: "Prices fell 15-20% from peak in major cities"
  }
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
        <div className="flex flex-col items-center gap-6 text-center px-4 pt-16 pb-10 max-w-5xl">
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
            Understand how global events impact your investments. Real-time market data, 
            economic insights, and educational analysis for Canadian investors.
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

        {/* Live Commodity Prices with Geopolitical Context */}
        <div className="w-full px-4 pb-12">
          <LiveCommodityChart />
        </div>

        {/* Educational Section */}
        <div className="w-full max-w-6xl px-4 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
              <GraduationCap className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Learn While You Track</h2>
              <p className="text-sm text-muted-foreground">Educational insights for smarter decisions</p>
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {educationalTopics.map((topic) => (
              <div 
                key={topic.title}
                className="p-5 rounded-xl bg-card/60 border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                    <topic.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-chart-1/10 border border-chart-1/20 w-fit">
                      <Lightbulb className="h-3.5 w-3.5 text-chart-1" />
                      <span className="text-xs font-medium text-chart-1">{topic.insight}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full max-w-4xl px-4 pb-12">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Start Exploring the Markets</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Access real-time data from Yahoo Finance and Bank of Canada. 
              All prices in CAD. All free, all educational.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
                Markets updating live
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="w-full max-w-6xl px-4 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10 border border-chart-4/20">
              <BookOpen className="h-5 w-5 text-chart-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Explore All Modules</h2>
              <p className="text-sm text-muted-foreground">Your complete Canadian finance toolkit</p>
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className={`group p-5 rounded-xl bg-card/50 backdrop-blur border ${feature.borderColor} hover:border-primary/50 transition-all hover:bg-card hover:scale-[1.02]`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-lg ${feature.bgColor} border ${feature.borderColor}`}>
                    <feature.icon className={`h-5 w-5 ${feature.color}`} />
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
              <span className="font-medium">Free Data Sources:</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary border border-border">Yahoo Finance</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary border border-border">Bank of Canada</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary border border-border">Statistics Canada</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary border border-border">CREA</span>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 max-w-2xl">
              <div className="p-2 rounded-lg bg-destructive/20 shrink-0">
                <BookOpen className="h-4 w-4 text-destructive" />
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Educational purposes only.</span> This is not financial advice. 
                Always do your own research and consult qualified professionals before making investment decisions.
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
