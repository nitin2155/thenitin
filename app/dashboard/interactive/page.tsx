"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calculator, 
  Sliders, 
  GraduationCap, 
  Shield, 
  ArrowRight,
  Sparkles,
  Users,
  Target,
  TrendingUp,
  Clock,
  Zap
} from "lucide-react"

const interactiveTools = [
  {
    id: "calculator",
    title: "Personal Impact Calculator",
    description: "Enter your city, mortgage, income, and job sector to see exactly how rate changes and tariffs affect YOU personally",
    icon: Calculator,
    href: "/dashboard/calculator",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
    stats: [
      { label: "Inputs", value: "6 personal factors" },
      { label: "Outputs", value: "Mortgage, job risk, housing" }
    ],
    badge: "Most Personal",
    badgeColor: "bg-primary"
  },
  {
    id: "simulator",
    title: "What-If Scenario Simulator",
    description: "Drag sliders to adjust oil prices, interest rates, and tariff levels - watch how markets respond in real-time",
    icon: Sliders,
    href: "/dashboard/simulator",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
    stats: [
      { label: "Variables", value: "Oil, Rates, Tariffs" },
      { label: "Projections", value: "12-month forecasts" }
    ],
    badge: "Most Interactive",
    badgeColor: "bg-accent"
  },
  {
    id: "learn",
    title: "Guess & Learn Game",
    description: "Test your market intuition - predict what happened during real historical events and learn why",
    icon: GraduationCap,
    href: "/dashboard/learn",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    borderColor: "border-chart-1/20",
    stats: [
      { label: "Questions", value: "8 historical events" },
      { label: "Topics", value: "Gold, Oil, TSX, Housing" }
    ],
    badge: "Most Fun",
    badgeColor: "bg-chart-1"
  },
  {
    id: "stress-test",
    title: "Portfolio Stress Test",
    description: "Build your portfolio and see how it would perform during the 2008 crisis, COVID crash, or a trade war",
    icon: Shield,
    href: "/dashboard/stress-test",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    borderColor: "border-chart-4/20",
    stats: [
      { label: "Assets", value: "20+ stocks & ETFs" },
      { label: "Scenarios", value: "4 crisis simulations" }
    ],
    badge: "Most Practical",
    badgeColor: "bg-chart-4"
  }
]

const benefits = [
  {
    icon: Target,
    title: "Test Your Assumptions",
    description: "Don't just read about markets - actively test your theories and see the data"
  },
  {
    icon: Users,
    title: "Personal Relevance",
    description: "Generic charts don't matter. Your mortgage, your job, your city - that's what matters"
  },
  {
    icon: TrendingUp,
    title: "Learn by Doing",
    description: "Interactive learning sticks better than passive reading. Try, fail, understand."
  }
]

export default function InteractiveHubPage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
          <Sparkles className="h-3 w-3 mr-1" />
          Interactive Learning
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Stop Reading. Start Doing.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Static charts are forgettable. These tools let you test your own assumptions, 
          see personal impacts, and learn through interaction.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-3 gap-4">
        {benefits.map((benefit) => (
          <Card key={benefit.title} className="bg-secondary/30 border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {interactiveTools.map((tool) => (
          <Link key={tool.id} href={tool.href} className="group">
            <Card className={`h-full border-2 transition-all hover:shadow-lg hover:shadow-${tool.color.replace("text-", "")}/10 ${tool.borderColor} hover:border-${tool.color.replace("text-", "")}/50`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${tool.bgColor}`}>
                    <tool.icon className={`h-7 w-7 ${tool.color}`} />
                  </div>
                  <Badge className={`${tool.badgeColor} text-white`}>
                    {tool.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl mt-4 flex items-center gap-2">
                  {tool.title}
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </CardTitle>
                <CardDescription className="text-base">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {tool.stats.map((stat) => (
                    <div key={stat.label} className="flex-1 p-3 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-sm font-medium">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Start */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">New here? Start with the Quiz</h3>
              <p className="text-muted-foreground">
                The Guess & Learn game is the fastest way to build market intuition. 
                Takes 5 minutes, teaches you how major events move markets.
              </p>
            </div>
            <Link href="/dashboard/learn">
              <Button size="lg" className="gap-2">
                <Zap className="h-4 w-4" />
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Time Estimates */}
      <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Quiz: ~5 min</span>
        </div>
        <span className="text-border">|</span>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Simulator: ~3 min</span>
        </div>
        <span className="text-border">|</span>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Calculator: ~2 min</span>
        </div>
        <span className="text-border">|</span>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Stress Test: ~5 min</span>
        </div>
      </div>
    </div>
  )
}
