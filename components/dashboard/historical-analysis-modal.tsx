"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  TrendingUp, 
  TrendingDown, 
  History, 
  BarChart3, 
  Scale,
  AlertCircle,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Globe2,
  DollarSign,
  Home,
  Landmark
} from "lucide-react"
import { cn } from "@/lib/utils"
import { GEOPOLITICAL_EVENTS, type GeopoliticalEvent } from "@/lib/geopolitical-events"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  ReferenceLine,
  Legend
} from "recharts"

interface HistoricalAnalysisModalProps {
  children: React.ReactNode
  category: "housing" | "stocks" | "trade" | "commodities" | "economy"
  title: string
  subtitle?: string
}

// Correlations data
const CORRELATIONS = {
  housing: [
    { name: "Interest Rates vs House Prices", correlation: -0.78, description: "Higher rates = lower prices. BoC rate hikes in 2022-23 caused 15-20% price drops." },
    { name: "CAD Strength vs Foreign Buying", correlation: 0.45, description: "Weaker CAD attracts foreign buyers, particularly in Vancouver and Toronto." },
    { name: "Oil Prices vs Alberta Housing", correlation: 0.62, description: "Calgary/Edmonton housing closely tracks oil prices due to energy sector employment." },
    { name: "Immigration vs Rental Prices", correlation: 0.71, description: "Higher immigration targets correlate with rental price increases." },
  ],
  stocks: [
    { name: "US Markets vs TSX", correlation: 0.85, description: "The TSX follows US markets but with resource sector amplification." },
    { name: "Oil vs TSX Energy", correlation: 0.92, description: "Energy sector moves almost 1:1 with oil prices." },
    { name: "Gold vs TSX Materials", correlation: 0.78, description: "Gold miners outperform when gold rises, underperform when it falls." },
    { name: "USD/CAD vs Exporters", correlation: -0.55, description: "Weak CAD benefits Canadian exporters and resource companies." },
  ],
  trade: [
    { name: "Tariffs vs Trade Volume", correlation: -0.68, description: "Higher tariffs reduce bilateral trade, as seen in US-China tensions." },
    { name: "USMCA Compliance vs Auto Exports", correlation: 0.72, description: "Auto sector performance tied to trade agreement stability." },
    { name: "Softwood Lumber Duties vs BC Economy", correlation: -0.54, description: "US lumber duties hurt BC forestry and housing sectors." },
    { name: "Oil Pipeline Capacity vs WCS Discount", correlation: -0.81, description: "Pipeline constraints widen the discount on Canadian oil." },
  ],
  commodities: [
    { name: "USD Strength vs Commodities", correlation: -0.65, description: "Strong dollar makes commodities more expensive, reducing demand." },
    { name: "China GDP vs Copper", correlation: 0.82, description: "Chinese construction drives global copper demand." },
    { name: "Geopolitical Risk vs Gold", correlation: 0.58, description: "Uncertainty drives safe-haven gold buying." },
    { name: "Real Rates vs Gold", correlation: -0.71, description: "Higher real yields make non-yielding gold less attractive." },
  ],
  economy: [
    { name: "Inflation vs Consumer Spending", correlation: -0.48, description: "High inflation reduces real purchasing power and spending." },
    { name: "Unemployment vs Housing Defaults", correlation: 0.65, description: "Job losses increase mortgage stress and defaults." },
    { name: "BoC Rate vs CAD", correlation: 0.72, description: "Higher rates attract capital flows, strengthening CAD." },
    { name: "US Fed vs BoC Policy", correlation: 0.88, description: "BoC typically follows Fed direction due to USD/CAD linkage." },
  ],
}

// Historical events by category
const CATEGORY_EVENTS: Record<string, string[]> = {
  housing: ["2008-financial-crisis", "covid-19-pandemic", "2022-inflation-crisis", "russia-ukraine-war"],
  stocks: ["2008-financial-crisis", "trump-china-trade-war", "covid-19-pandemic", "2022-inflation-crisis", "trump-2024-election"],
  trade: ["trump-china-trade-war", "trump-2024-election", "russia-ukraine-war"],
  commodities: ["russia-ukraine-war", "oil-price-war-2020", "covid-19-pandemic", "2008-financial-crisis"],
  economy: ["2008-financial-crisis", "covid-19-pandemic", "2022-inflation-crisis", "russia-ukraine-war"],
}

// Neutral insights by category
const NEUTRAL_INSIGHTS = {
  housing: [
    {
      title: "Interest Rate Sensitivity",
      observation: "Canadian housing is highly leveraged, making it among the most rate-sensitive in the developed world.",
      context: "Variable rate mortgages represented 30%+ of new originations during low-rate period.",
      implication: "Rate movements have outsized impact compared to other markets."
    },
    {
      title: "Immigration-Driven Demand",
      observation: "Canada's immigration targets (500k+/year) create structural demand in major cities.",
      context: "New immigrants disproportionately settle in Toronto, Vancouver, and Montreal.",
      implication: "Long-term demand support, but doesn't prevent cyclical corrections."
    },
    {
      title: "Supply Constraints",
      observation: "Housing starts lag population growth in most major markets.",
      context: "Zoning restrictions and approval processes slow new construction.",
      implication: "Supply/demand imbalance likely to persist absent policy changes."
    },
  ],
  stocks: [
    {
      title: "Resource Dependence",
      observation: "TSX is heavily weighted to financials (32%) and resources (25%).",
      context: "Less tech exposure means less volatility but also less growth.",
      implication: "TSX tends to outperform in commodity bull markets, underperform in tech rallies."
    },
    {
      title: "Currency Hedge",
      observation: "Many TSX companies earn USD revenues but report in CAD.",
      context: "Weak CAD boosts reported earnings for exporters and multinationals.",
      implication: "Currency movements can mask underlying business performance."
    },
    {
      title: "Dividend Culture",
      observation: "TSX has higher average dividend yield than US markets.",
      context: "Canadian tax treatment favors dividends for domestic investors.",
      implication: "Income-focused investors may find TSX attractive in low-rate environments."
    },
  ],
  trade: [
    {
      title: "US Dependency",
      observation: "75%+ of Canadian exports go to the United States.",
      context: "Auto parts, energy, and lumber are largest export categories.",
      implication: "Canadian economy highly sensitive to US trade policy changes."
    },
    {
      title: "USMCA Framework",
      observation: "The USMCA replaced NAFTA in 2020 with stricter rules of origin.",
      context: "Auto sector must source more parts from North America.",
      implication: "Some industries benefit from protectionism, others face higher costs."
    },
    {
      title: "Energy Export Challenges",
      observation: "Canada has struggled to diversify oil export markets beyond the US.",
      context: "Pipeline constraints and opposition have limited coastal access.",
      implication: "Canadian oil sells at discount compared to global benchmarks."
    },
  ],
  commodities: [
    {
      title: "Safe Haven Dynamics",
      observation: "Gold often moves opposite to risk assets, but correlations spike in crises.",
      context: "During acute stress, all assets can sell off for liquidity.",
      implication: "Gold's hedge value is best measured over full market cycles."
    },
    {
      title: "China's Influence",
      observation: "China consumes 50%+ of industrial metals like copper and iron ore.",
      context: "Chinese policy changes immediately impact global commodity prices.",
      implication: "Commodity investors must monitor Chinese economic indicators closely."
    },
    {
      title: "Energy Transition",
      observation: "Electrification increases demand for copper, lithium, nickel.",
      context: "Traditional energy commodities face long-term demand uncertainty.",
      implication: "Winners and losers among commodities as transition accelerates."
    },
  ],
  economy: [
    {
      title: "Household Debt",
      observation: "Canadian household debt-to-income ratio exceeds 180%.",
      context: "Among highest in developed world, concentrated in mortgages.",
      implication: "Consumer spending vulnerable to rate increases or job losses."
    },
    {
      title: "BoC Independence",
      observation: "Bank of Canada follows mandate but considers CAD implications.",
      context: "Large rate divergence from Fed creates currency pressure.",
      implication: "BoC policy partly constrained by Fed decisions."
    },
    {
      title: "Regional Divergence",
      observation: "Alberta's economy correlates with oil; Ontario/Quebec with manufacturing.",
      context: "National averages can mask significant regional differences.",
      implication: "Policies that help one region may hurt another."
    },
  ],
}

function CorrelationBar({ correlation }: { correlation: number }) {
  const isPositive = correlation > 0
  const width = Math.abs(correlation) * 100

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="w-12 text-right text-xs font-mono">
        {correlation > 0 ? "+" : ""}{correlation.toFixed(2)}
      </div>
      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isPositive ? "bg-chart-1" : "bg-destructive"
          )}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

function EventImpactChart({ event }: { event: GeopoliticalEvent }) {
  const data = event.impacts.map(impact => ({
    name: impact.commodityName,
    immediate: impact.immediateImpact,
    short: impact.shortTermImpact,
    long: impact.longTermImpact,
  }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis type="number" tickFormatter={(v) => `${v}%`} />
        <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
          formatter={(value: number) => [`${value.toFixed(2)}%`, ""]}
        />
        <Legend />
        <Bar dataKey="immediate" name="At Event" fill="hsl(var(--chart-3))" />
        <Bar dataKey="short" name="30 Days" fill="hsl(var(--chart-4))" />
        <Bar dataKey="long" name="90 Days" fill="hsl(var(--chart-1))" />
        <ReferenceLine x={0} stroke="hsl(var(--foreground))" strokeWidth={2} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function HistoricalAnalysisModal({ 
  children, 
  category, 
  title,
  subtitle 
}: HistoricalAnalysisModalProps) {
  const [open, setOpen] = useState(false)
  
  const correlations = CORRELATIONS[category]
  const eventIds = CATEGORY_EVENTS[category]
  const events = eventIds
    .map(id => GEOPOLITICAL_EVENTS.find(e => e.id === id))
    .filter((e): e is GeopoliticalEvent => e !== undefined)
  const insights = NEUTRAL_INSIGHTS[category]

  const categoryIcons = {
    housing: <Home className="h-5 w-5" />,
    stocks: <TrendingUp className="h-5 w-5" />,
    trade: <Globe2 className="h-5 w-5" />,
    commodities: <DollarSign className="h-5 w-5" />,
    economy: <Landmark className="h-5 w-5" />,
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
              {categoryIcons[category]}
            </div>
            <div>
              <DialogTitle className="text-xl">{title}</DialogTitle>
              <DialogDescription>{subtitle || "Historical analysis and market insights"}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="history" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              Historical Events
            </TabsTrigger>
            <TabsTrigger value="correlations" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Correlations
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <Scale className="h-4 w-4" />
              Neutral Insights
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4 pr-4 h-[60vh]">
            <TabsContent value="history" className="mt-0 space-y-4">
              <p className="text-sm text-muted-foreground">
                Explore how major geopolitical and economic events have historically impacted this sector.
              </p>
              
              <Accordion type="single" collapsible className="space-y-2">
                {events.map((event) => (
                  <AccordionItem 
                    key={event.id} 
                    value={event.id}
                    className="border rounded-lg bg-card px-4"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline">
                      <div className="flex items-start gap-4 text-left">
                        <Badge 
                          variant={
                            event.severity === "critical" ? "destructive" :
                            event.severity === "high" ? "default" : "secondary"
                          }
                        >
                          {event.severity}
                        </Badge>
                        <div>
                          <p className="font-semibold">{event.name}</p>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      
                      <div className="rounded-lg bg-secondary/30 p-4">
                        <p className="text-sm font-medium mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          Educational Context
                        </p>
                        <p className="text-sm text-muted-foreground">{event.educationalContext}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-3">Price Impacts</p>
                        <EventImpactChart event={event} />
                      </div>

                      {event.canadianImpact && (
                        <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-4 space-y-2">
                          <p className="text-sm font-medium flex items-center gap-2">
                            <span>Canadian Impact</span>
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">CAD Change:</span>{" "}
                              <span className={event.canadianImpact.cadChange >= 0 ? "text-chart-1" : "text-destructive"}>
                                {event.canadianImpact.cadChange >= 0 ? "+" : ""}{event.canadianImpact.cadChange}%
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">TSX Impact:</span>{" "}
                              <span className={event.canadianImpact.tsxImpact >= 0 ? "text-chart-1" : "text-destructive"}>
                                {event.canadianImpact.tsxImpact >= 0 ? "+" : ""}{event.canadianImpact.tsxImpact}%
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">{event.canadianImpact.insight}</p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="correlations" className="mt-0 space-y-4">
              <p className="text-sm text-muted-foreground">
                Understanding correlations helps identify how different factors influence this sector. 
                Positive correlations move together; negative correlations move opposite.
              </p>
              
              <div className="space-y-4">
                {correlations.map((corr, idx) => (
                  <Card key={idx} className="bg-secondary/30">
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{corr.name}</p>
                          <p className="text-sm text-muted-foreground">{corr.description}</p>
                        </div>
                        <Badge variant={corr.correlation > 0 ? "default" : "destructive"}>
                          {corr.correlation > 0 ? "Positive" : "Inverse"}
                        </Badge>
                      </div>
                      <CorrelationBar correlation={corr.correlation} />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Correlation Disclaimer</p>
                      <p className="text-sm text-muted-foreground">
                        Past correlations do not guarantee future relationships. Market dynamics 
                        change over time, and correlations can break down during periods of stress.
                        Use these as one input among many for your analysis.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="mt-0 space-y-4">
              <p className="text-sm text-muted-foreground">
                Balanced perspectives on key factors affecting this sector. These insights present 
                observations without recommending specific actions.
              </p>

              <div className="space-y-4">
                {insights.map((insight, idx) => (
                  <Card key={idx}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Scale className="h-4 w-4 text-chart-4" />
                        {insight.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Observation</p>
                        <p className="text-sm">{insight.observation}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Context</p>
                        <p className="text-sm text-muted-foreground">{insight.context}</p>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Implication</p>
                        <p className="text-sm font-medium text-primary">{insight.implication}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-chart-4/5 border-chart-4/20">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Scale className="h-5 w-5 text-chart-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Neutrality Statement</p>
                      <p className="text-sm text-muted-foreground">
                        These insights are provided for educational purposes only. They present 
                        multiple perspectives and are not intended as financial advice or 
                        recommendations. Always consult qualified professionals before making 
                        investment decisions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
