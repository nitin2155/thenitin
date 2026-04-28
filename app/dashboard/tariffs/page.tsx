"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Globe2, 
  ArrowLeft,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Ship,
  Factory,
  Car,
  Fuel,
  Wheat,
  TreePine,
  DollarSign,
  Building2,
  Users,
  MapPin,
  History,
  ChevronDown,
  ChevronUp,
  Info,
  BarChart3
} from "lucide-react"

// Comprehensive tariff data
const sectorData = [
  {
    id: "auto",
    name: "Automotive Industry",
    icon: Car,
    status: "critical",
    exportValue: 63,
    tariffRate: 25,
    potentialLoss: 15.8,
    jobsAtRisk: 125000,
    majorPlayers: ["Toyota (Cambridge)", "Honda (Alliston)", "Ford (Oakville)", "GM (Oshawa)", "Stellantis (Windsor)"],
    provinces: ["Ontario (95%)", "Quebec (5%)"],
    supplyChainFact: "Auto parts cross the border 6-8 times during manufacturing",
    historicalContext: "The Auto Pact of 1965 integrated US-Canada auto production. USMCA requires 75% North American content.",
    whyItMatters: "Ontario's auto sector accounts for 10% of provincial GDP. Each assembly job supports 7 additional jobs in the supply chain.",
    scenarios: [
      { scenario: "Full 25% tariff", impact: "Production shifts to US/Mexico, 50,000+ job losses within 2 years" },
      { scenario: "Negotiated exemption", impact: "Status quo maintained, minor adjustments" },
      { scenario: "Retaliatory tariffs", impact: "Trade war escalation, consumer prices rise 15-20%" }
    ]
  },
  {
    id: "energy",
    name: "Energy Sector",
    icon: Fuel,
    status: "high",
    exportValue: 180,
    tariffRate: 10,
    potentialLoss: 18,
    jobsAtRisk: 80000,
    majorPlayers: ["Suncor", "Canadian Natural", "Enbridge", "TC Energy", "Imperial Oil"],
    provinces: ["Alberta (75%)", "Saskatchewan (15%)", "BC (10%)"],
    supplyChainFact: "US refineries are optimized for Canadian heavy crude - hard to replace",
    historicalContext: "Canada is the largest supplier of foreign oil to the US, providing 60% of US oil imports.",
    whyItMatters: "Alberta's oil sands are the world's third-largest oil reserve. Energy royalties fund provincial budgets.",
    scenarios: [
      { scenario: "10% tariff on oil", impact: "WCS discount widens, Alberta loses $3-5B/year in royalties" },
      { scenario: "Tariff on electricity", impact: "New England faces higher prices, political backlash" },
      { scenario: "Full energy exemption", impact: "Energy security arguments prevail, status quo" }
    ]
  },
  {
    id: "metals",
    name: "Steel & Aluminum",
    icon: Factory,
    status: "critical",
    exportValue: 12,
    tariffRate: 25,
    potentialLoss: 3,
    jobsAtRisk: 35000,
    majorPlayers: ["Stelco", "ArcelorMittal Dofasco", "Rio Tinto Alcan", "Alcoa", "Novelis"],
    provinces: ["Ontario (60%)", "Quebec (35%)", "Alberta (5%)"],
    supplyChainFact: "Canadian aluminum is 95% hydroelectric-powered, among the world's cleanest",
    historicalContext: "Tariffs first imposed in 2018, temporarily lifted in 2019, threat remains constant.",
    whyItMatters: "Canadian aluminum supplies US aerospace and auto industries. Quebec's cheap hydro power is the competitive advantage.",
    scenarios: [
      { scenario: "25% tariff reinstated", impact: "Quebec smelters cut production, 15,000 jobs lost" },
      { scenario: "Buy American rules", impact: "Excluded from US infrastructure projects" },
      { scenario: "Green steel premium", impact: "Canadian clean production gains market advantage" }
    ]
  },
  {
    id: "agriculture",
    name: "Agriculture & Food",
    icon: Wheat,
    status: "high",
    exportValue: 45,
    tariffRate: 25,
    potentialLoss: 11.3,
    jobsAtRisk: 60000,
    majorPlayers: ["Cargill", "Richardson", "Viterra", "Maple Leaf Foods", "Saputo"],
    provinces: ["Saskatchewan (30%)", "Alberta (25%)", "Ontario (25%)", "Manitoba (15%)"],
    supplyChainFact: "US processes 70% of Canadian beef exports, creating integrated supply chains",
    historicalContext: "Dairy supply management has been a contentious issue since NAFTA. USMCA opened 3.6% of Canadian dairy market.",
    whyItMatters: "Prairie provinces depend heavily on grain exports. Rural communities face existential threat from trade disruptions.",
    scenarios: [
      { scenario: "Dairy tariffs", impact: "Retaliatory targeting of US dairy states" },
      { scenario: "Grain tariffs", impact: "Canadian farmers seek Asian markets, prices drop 20%" },
      { scenario: "Livestock tariffs", impact: "Processing shifts, Canadian ranchers face $500M loss" }
    ]
  },
  {
    id: "lumber",
    name: "Softwood Lumber",
    icon: TreePine,
    status: "high",
    exportValue: 8,
    tariffRate: 14.5,
    potentialLoss: 1.2,
    jobsAtRisk: 25000,
    majorPlayers: ["West Fraser", "Canfor", "Resolute Forest Products", "Mercer International"],
    provinces: ["BC (65%)", "Quebec (20%)", "Ontario (10%)", "Alberta (5%)"],
    supplyChainFact: "US housing starts directly correlate to Canadian lumber demand",
    historicalContext: "Lumber disputes date back to 1982. Current duties around 8-14% depending on company.",
    whyItMatters: "BC forest industry supports hundreds of small towns. Mill closures devastate communities.",
    scenarios: [
      { scenario: "Duties increased to 25%", impact: "BC interior mills close, 10,000 jobs lost" },
      { scenario: "Housing market crash", impact: "Demand drops regardless of tariffs" },
      { scenario: "Negotiated agreement", impact: "Managed trade with quotas, stability returns" }
    ]
  }
]

// Economic impact on provinces
const provincialImpact = [
  { province: "Ontario", gdpRisk: -2.5, jobsAtRisk: 180000, mainExposure: "Auto, Steel", color: "bg-destructive" },
  { province: "Alberta", gdpRisk: -3.5, jobsAtRisk: 95000, mainExposure: "Energy", color: "bg-destructive" },
  { province: "Quebec", gdpRisk: -1.8, jobsAtRisk: 65000, mainExposure: "Aluminum, Aerospace", color: "bg-accent" },
  { province: "BC", gdpRisk: -1.5, jobsAtRisk: 45000, mainExposure: "Lumber, LNG", color: "bg-accent" },
  { province: "Saskatchewan", gdpRisk: -2.0, jobsAtRisk: 25000, mainExposure: "Agriculture, Potash", color: "bg-accent" },
  { province: "Manitoba", gdpRisk: -1.2, jobsAtRisk: 15000, mainExposure: "Agriculture, Manufacturing", color: "bg-primary" }
]

// Historical tariff timeline
const tariffHistory = [
  { year: "2018", event: "US imposes 25% steel, 10% aluminum tariffs", impact: "Canada retaliates with C$16B in tariffs" },
  { year: "2019", event: "Steel/aluminum tariffs lifted after USMCA", impact: "Trade normalizes temporarily" },
  { year: "2020", event: "Aluminum tariffs briefly reimposed", impact: "Removed after Canadian threats" },
  { year: "2024", event: "US threatens 25% tariffs on all imports", impact: "CAD drops, markets volatile" },
  { year: "2025", event: "Tariff implementation delayed", impact: "Negotiations ongoing, uncertainty persists" }
]

// CAD impact analysis
const cadImpact = [
  { scenario: "Base case (status quo)", cadUsd: 0.73, change: 0 },
  { scenario: "10% tariffs implemented", cadUsd: 0.70, change: -4.1 },
  { scenario: "25% tariffs implemented", cadUsd: 0.65, change: -11.0 },
  { scenario: "Full trade war", cadUsd: 0.60, change: -17.8 }
]

export default function TariffsPage() {
  const [expandedSector, setExpandedSector] = useState<string | null>("auto")
  
  const totalExports = sectorData.reduce((sum, s) => sum + s.exportValue, 0)
  const totalJobsAtRisk = sectorData.reduce((sum, s) => sum + s.jobsAtRisk, 0)
  const totalPotentialLoss = sectorData.reduce((sum, s) => sum + s.potentialLoss, 0)
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard"
          className="p-2 rounded-lg bg-secondary border border-border hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20">
              <Globe2 className="h-5 w-5 text-destructive" />
            </div>
            Tariff Impact Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            Understanding the potential impact on Canadian trade, jobs, and economy
          </p>
        </div>
      </div>
      
      {/* Key Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">C${totalExports}B</p>
                <p className="text-xs text-muted-foreground">Annual Exports to US</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">-C${totalPotentialLoss.toFixed(1)}B</p>
                <p className="text-xs text-muted-foreground">Potential Annual Loss</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">{(totalJobsAtRisk / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground">Jobs at Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-5/10">
                <BarChart3 className="h-5 w-5 text-chart-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-chart-5">-2.5%</p>
                <p className="text-xs text-muted-foreground">GDP Risk (Worst Case)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="sectors" className="space-y-4">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="sectors">Sectors at Risk</TabsTrigger>
          <TabsTrigger value="provinces">Provincial Impact</TabsTrigger>
          <TabsTrigger value="cad">CAD Impact</TabsTrigger>
          <TabsTrigger value="history">Timeline</TabsTrigger>
        </TabsList>
        
        {/* Sectors Tab */}
        <TabsContent value="sectors" className="space-y-4">
          {sectorData.map((sector) => (
            <Card key={sector.id} className="bg-card/50 border-border overflow-hidden">
              <div 
                className="p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                onClick={() => setExpandedSector(expandedSector === sector.id ? null : sector.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      sector.status === 'critical' ? 'bg-destructive/10' : 'bg-accent/10'
                    }`}>
                      <sector.icon className={`h-6 w-6 ${
                        sector.status === 'critical' ? 'text-destructive' : 'text-accent'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{sector.name}</h3>
                        <Badge variant="outline" className={`${
                          sector.status === 'critical' 
                            ? 'bg-destructive/10 text-destructive border-destructive/20' 
                            : 'bg-accent/10 text-accent border-accent/20'
                        }`}>
                          {sector.status === 'critical' ? 'CRITICAL' : 'HIGH RISK'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        C${sector.exportValue}B exports | {sector.tariffRate}% tariff threat | {sector.jobsAtRisk.toLocaleString()} jobs at risk
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-destructive">-C${sector.potentialLoss}B</p>
                      <p className="text-xs text-muted-foreground">Potential Loss</p>
                    </div>
                    {expandedSector === sector.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>
              
              {expandedSector === sector.id && (
                <div className="border-t border-border p-4 bg-secondary/20 space-y-4">
                  {/* Key Facts Grid */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-3 rounded-lg bg-card border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Major Players</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{sector.majorPlayers.join(", ")}</p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-card border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Provincial Exposure</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{sector.provinces.join(", ")}</p>
                    </div>
                  </div>
                  
                  {/* Supply Chain Fact */}
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Supply Chain Fact</p>
                        <p className="text-sm text-muted-foreground">{sector.supplyChainFact}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Why It Matters */}
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="text-sm font-medium text-foreground mb-1">Why This Matters for Canadians</p>
                    <p className="text-sm text-muted-foreground">{sector.whyItMatters}</p>
                  </div>
                  
                  {/* Historical Context */}
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <History className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">Historical Context</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{sector.historicalContext}</p>
                  </div>
                  
                  {/* Scenarios */}
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Possible Scenarios</p>
                    <div className="space-y-2">
                      {sector.scenarios.map((s, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2 rounded-lg bg-card border border-border">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            idx === 0 ? 'bg-destructive' : idx === 1 ? 'bg-chart-1' : 'bg-accent'
                          }`} />
                          <div>
                            <p className="text-sm font-medium text-foreground">{s.scenario}</p>
                            <p className="text-xs text-muted-foreground">{s.impact}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </TabsContent>
        
        {/* Provinces Tab */}
        <TabsContent value="provinces">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>Provincial Economic Exposure</CardTitle>
              <CardDescription>GDP and job risk by province if full tariffs implemented</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {provincialImpact.map((prov) => (
                <div key={prov.province} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-foreground w-32">{prov.province}</span>
                      <span className="text-sm text-muted-foreground">{prov.mainExposure}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{prov.jobsAtRisk.toLocaleString()} jobs</span>
                      <span className="font-bold text-destructive w-16 text-right">{prov.gdpRisk}% GDP</span>
                    </div>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${prov.color} rounded-full transition-all`}
                      style={{ width: `${Math.abs(prov.gdpRisk) / 4 * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              
              <div className="mt-6 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">National Impact</p>
                    <p className="text-sm text-muted-foreground">
                      Full tariff implementation could push Canada into recession, with GDP contracting 1.5-2.5% and unemployment rising 2-3 percentage points. The hardest hit would be Ontario and Alberta, which together account for 60% of Canada-US trade.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* CAD Impact Tab */}
        <TabsContent value="cad">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>Canadian Dollar Impact Scenarios</CardTitle>
              <CardDescription>How tariffs could affect the CAD/USD exchange rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cadImpact.map((scenario, idx) => (
                  <div 
                    key={scenario.scenario}
                    className={`p-4 rounded-lg border ${
                      idx === 0 ? 'bg-chart-1/5 border-chart-1/20' : 'bg-card border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{scenario.scenario}</p>
                        <p className="text-sm text-muted-foreground">
                          {scenario.change === 0 ? 'Current rate' : `${scenario.change > 0 ? '+' : ''}${scenario.change}% change`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">${scenario.cadUsd.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">CAD/USD</p>
                      </div>
                    </div>
                    {idx > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-destructive" />
                          <span className="text-sm text-muted-foreground">
                            Impact: {idx === 1 ? 'Imports more expensive, moderate inflation pressure' : 
                                     idx === 2 ? 'Significant inflation, BoC may pause rate cuts' :
                                     'Economic crisis, emergency policy response needed'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Silver Lining:</span> A weaker CAD makes Canadian exports more competitive globally and could partially offset tariff impacts by making Canadian goods cheaper in non-US markets.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Timeline Tab */}
        <TabsContent value="history">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>Tariff Timeline</CardTitle>
              <CardDescription>History of US-Canada trade tensions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-6">
                  {tariffHistory.map((item, idx) => (
                    <div key={idx} className="relative pl-10">
                      <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                        idx === tariffHistory.length - 1 
                          ? 'bg-primary border-primary animate-pulse' 
                          : 'bg-card border-muted-foreground'
                      }`} />
                      <div className="p-4 rounded-lg bg-card border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="bg-secondary">{item.year}</Badge>
                          {idx === tariffHistory.length - 1 && (
                            <Badge className="bg-primary/10 text-primary border-primary/20">Current</Badge>
                          )}
                        </div>
                        <p className="font-medium text-foreground">{item.event}</p>
                        <p className="text-sm text-muted-foreground mt-1">{item.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Educational Footer */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
              <Info className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Understanding the Bigger Picture</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Trade disputes are complex negotiations. While tariff threats create uncertainty, they&apos;re often used as leverage. Canada and the US share the world&apos;s largest trading relationship - over $900B annually in total trade. Neither country benefits from a prolonged trade war, which is why negotiations typically lead to compromise.
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">For investors:</span> Focus on diversification and long-term fundamentals. Short-term tariff noise creates volatility but rarely changes decade-long investment outcomes. Companies with diversified markets (not just US-dependent) tend to weather trade disputes better.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
