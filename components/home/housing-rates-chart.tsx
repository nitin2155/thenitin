"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Home, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Percent,
  ExternalLink,
  AlertTriangle
} from "lucide-react"

// Historical data: Housing prices vs BoC interest rates (3 years)
const historicalData = [
  { month: "Jan 2022", housing: 816, rate: 0.25, label: "Peak Prices" },
  { month: "Mar 2022", housing: 796, rate: 0.50, label: "First Hike" },
  { month: "Jun 2022", housing: 745, rate: 1.50, label: "" },
  { month: "Sep 2022", housing: 710, rate: 3.25, label: "" },
  { month: "Dec 2022", housing: 685, rate: 4.25, label: "" },
  { month: "Mar 2023", housing: 680, rate: 4.50, label: "Prices Bottom" },
  { month: "Jun 2023", housing: 695, rate: 4.75, label: "" },
  { month: "Sep 2023", housing: 700, rate: 5.00, label: "Peak Rates" },
  { month: "Dec 2023", housing: 705, rate: 5.00, label: "" },
  { month: "Mar 2024", housing: 710, rate: 5.00, label: "" },
  { month: "Jun 2024", housing: 715, rate: 4.75, label: "First Cut" },
  { month: "Sep 2024", housing: 720, rate: 4.25, label: "" },
  { month: "Dec 2024", housing: 718, rate: 3.75, label: "" },
  { month: "Mar 2025", housing: 720, rate: 3.25, label: "Current" },
]

// Key insights
const insights = [
  {
    title: "The Correlation",
    description: "As rates rose 4.75%, housing fell 17%",
    icon: TrendingDown,
    color: "text-destructive"
  },
  {
    title: "Current Trend",
    description: "Rate cuts stabilizing prices",
    icon: TrendingUp,
    color: "text-chart-1"
  },
  {
    title: "Warning",
    description: "Mortgage renewals at 5%+ rates",
    icon: AlertTriangle,
    color: "text-accent"
  }
]

export function HousingRatesChart() {
  const housingPrices = historicalData.map(d => d.housing)
  const rates = historicalData.map(d => d.rate)
  
  const housingMin = Math.min(...housingPrices) - 50
  const housingMax = Math.max(...housingPrices) + 50
  const rateMin = 0
  const rateMax = 6
  
  // Generate SVG path for housing prices
  const housingPath = historicalData.map((d, i) => {
    const x = (i / (historicalData.length - 1)) * 100
    const y = 100 - ((d.housing - housingMin) / (housingMax - housingMin)) * 100
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')
  
  // Generate SVG path for interest rates
  const ratePath = historicalData.map((d, i) => {
    const x = (i / (historicalData.length - 1)) * 100
    const y = 100 - ((d.rate - rateMin) / (rateMax - rateMin)) * 100
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')
  
  // Find key points for labels
  const peakHousingIdx = housingPrices.indexOf(Math.max(...housingPrices))
  const peakRateIdx = rates.indexOf(Math.max(...rates))
  
  const currentHousing = housingPrices[housingPrices.length - 1]
  const peakHousing = Math.max(...housingPrices)
  const housingChange = ((currentHousing - peakHousing) / peakHousing * 100)
  
  const currentRate = rates[rates.length - 1]
  const peakRate = Math.max(...rates)
  
  return (
    <Link href="/dashboard/housing" className="block group">
      <Card className="border-border bg-card/50 backdrop-blur hover:border-primary/50 transition-all hover:bg-card/80">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-5/10 border border-chart-5/20">
                <Home className="h-5 w-5 text-chart-5" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Housing vs Interest Rates
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <p className="text-xs text-muted-foreground">3-Year Canadian Correlation</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                {housingChange.toFixed(1)}% from peak
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {/* Chart */}
          <div className="relative h-48 mb-4">
            {/* Y-axis labels - Housing */}
            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-[10px] text-chart-5">
              <span>C${housingMax}K</span>
              <span>C${housingMin}K</span>
            </div>
            
            {/* Y-axis labels - Rates */}
            <div className="absolute right-0 top-0 bottom-0 w-10 flex flex-col justify-between text-[10px] text-primary text-right">
              <span>{rateMax}%</span>
              <span>{rateMin}%</span>
            </div>
            
            {/* Chart area */}
            <div className="absolute left-14 right-12 top-2 bottom-6">
              <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                {/* Grid lines */}
                <line x1="0" y1="25" x2="100" y2="25" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2,2" />
                
                {/* Housing price line */}
                <path
                  d={housingPath}
                  fill="none"
                  stroke="hsl(var(--chart-5))"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Interest rate line */}
                <path
                  d={ratePath}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="4,2"
                />
                
                {/* Peak housing marker */}
                <circle 
                  cx={(peakHousingIdx / (historicalData.length - 1)) * 100}
                  cy={100 - ((housingPrices[peakHousingIdx] - housingMin) / (housingMax - housingMin)) * 100}
                  r="3"
                  fill="hsl(var(--chart-5))"
                />
                
                {/* Peak rate marker */}
                <circle 
                  cx={(peakRateIdx / (historicalData.length - 1)) * 100}
                  cy={100 - ((rates[peakRateIdx] - rateMin) / (rateMax - rateMin)) * 100}
                  r="3"
                  fill="hsl(var(--primary))"
                />
              </svg>
            </div>
            
            {/* X-axis labels */}
            <div className="absolute left-14 right-12 bottom-0 flex justify-between text-[10px] text-muted-foreground">
              <span>2022</span>
              <span>2023</span>
              <span>2024</span>
              <span>2025</span>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-chart-5 rounded" />
              <span className="text-xs text-muted-foreground">Avg Home Price (C$K)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-primary rounded" style={{ borderStyle: 'dashed' }} />
              <span className="text-xs text-muted-foreground">BoC Rate (%)</span>
            </div>
          </div>
          
          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-3">
            {insights.map((insight) => (
              <div 
                key={insight.title}
                className="p-2.5 rounded-lg bg-secondary/30 border border-border"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <insight.icon className={`h-3.5 w-3.5 ${insight.color}`} />
                  <span className="text-xs font-medium text-foreground">{insight.title}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{insight.description}</p>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Click for 2010-2025 housing analysis</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
