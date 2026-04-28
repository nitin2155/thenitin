"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calculator, 
  Home, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Info,
  MapPin,
  Building2,
  Percent,
  ArrowRight,
  Save
} from "lucide-react"

const PROVINCES = [
  { value: "ON", label: "Ontario", avgIncome: 62500, housingAvg: 850000 },
  { value: "BC", label: "British Columbia", avgIncome: 58000, housingAvg: 980000 },
  { value: "AB", label: "Alberta", avgIncome: 68000, housingAvg: 520000 },
  { value: "QC", label: "Quebec", avgIncome: 52000, housingAvg: 480000 },
  { value: "MB", label: "Manitoba", avgIncome: 50000, housingAvg: 350000 },
  { value: "SK", label: "Saskatchewan", avgIncome: 55000, housingAvg: 320000 },
  { value: "NS", label: "Nova Scotia", avgIncome: 48000, housingAvg: 420000 },
  { value: "NB", label: "New Brunswick", avgIncome: 47000, housingAvg: 300000 },
  { value: "NL", label: "Newfoundland", avgIncome: 52000, housingAvg: 280000 },
  { value: "PE", label: "Prince Edward Island", avgIncome: 45000, housingAvg: 380000 },
]

const SECTORS = [
  { value: "auto", label: "Automotive", tariffRisk: "high", rateRisk: "medium" },
  { value: "energy", label: "Energy & Oil", tariffRisk: "high", rateRisk: "low" },
  { value: "tech", label: "Technology", tariffRisk: "medium", rateRisk: "low" },
  { value: "finance", label: "Finance & Banking", tariffRisk: "low", rateRisk: "high" },
  { value: "healthcare", label: "Healthcare", tariffRisk: "low", rateRisk: "low" },
  { value: "manufacturing", label: "Manufacturing", tariffRisk: "high", rateRisk: "medium" },
  { value: "retail", label: "Retail", tariffRisk: "medium", rateRisk: "medium" },
  { value: "construction", label: "Construction", tariffRisk: "medium", rateRisk: "high" },
  { value: "agriculture", label: "Agriculture", tariffRisk: "high", rateRisk: "low" },
  { value: "government", label: "Government/Public", tariffRisk: "low", rateRisk: "low" },
  { value: "other", label: "Other", tariffRisk: "medium", rateRisk: "medium" },
]

const CITIES = {
  ON: ["Toronto", "Ottawa", "Mississauga", "Hamilton", "London", "Kitchener"],
  BC: ["Vancouver", "Victoria", "Surrey", "Burnaby", "Kelowna"],
  AB: ["Calgary", "Edmonton", "Red Deer", "Lethbridge"],
  QC: ["Montreal", "Quebec City", "Laval", "Gatineau"],
  MB: ["Winnipeg", "Brandon"],
  SK: ["Saskatoon", "Regina"],
  NS: ["Halifax", "Dartmouth"],
  NB: ["Saint John", "Moncton", "Fredericton"],
  NL: ["St. John's", "Mount Pearl"],
  PE: ["Charlottetown"],
}

export default function PersonalImpactCalculatorPage() {
  // User inputs
  const [province, setProvince] = useState("ON")
  const [city, setCity] = useState("Toronto")
  const [mortgageAmount, setMortgageAmount] = useState(500000)
  const [currentRate, setCurrentRate] = useState(5.5)
  const [householdIncome, setHouseholdIncome] = useState(85000)
  const [sector, setSector] = useState("tech")
  
  // Scenario adjustments
  const [rateChange, setRateChange] = useState(0)
  const [tariffScenario, setTariffScenario] = useState<"none" | "partial" | "full">("partial")
  
  // Results
  const [results, setResults] = useState<{
    currentPayment: number
    newPayment: number
    paymentChange: number
    affordabilityRatio: number
    newAffordabilityRatio: number
    jobRiskLevel: string
    incomeAtRisk: number
    housingValueChange: number
    totalMonthlyImpact: number
  } | null>(null)

  // Calculate impacts
  useEffect(() => {
    const monthlyRate = currentRate / 100 / 12
    const newMonthlyRate = (currentRate + rateChange) / 100 / 12
    const numPayments = 25 * 12 // 25-year amortization
    
    // Current monthly payment
    const currentPayment = mortgageAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    
    // New monthly payment with rate change
    const newPayment = mortgageAmount * (newMonthlyRate * Math.pow(1 + newMonthlyRate, numPayments)) / 
      (Math.pow(1 + newMonthlyRate, numPayments) - 1)
    
    const paymentChange = newPayment - currentPayment
    
    // Affordability ratio (mortgage payment as % of gross monthly income)
    const monthlyIncome = householdIncome / 12
    const affordabilityRatio = (currentPayment / monthlyIncome) * 100
    const newAffordabilityRatio = (newPayment / monthlyIncome) * 100
    
    // Job risk based on sector and tariff scenario
    const sectorData = SECTORS.find(s => s.value === sector)
    let jobRiskLevel = "Low"
    let incomeAtRisk = 0
    
    if (tariffScenario !== "none" && sectorData) {
      if (sectorData.tariffRisk === "high") {
        jobRiskLevel = tariffScenario === "full" ? "High" : "Medium"
        incomeAtRisk = tariffScenario === "full" ? householdIncome * 0.15 : householdIncome * 0.05
      } else if (sectorData.tariffRisk === "medium") {
        jobRiskLevel = tariffScenario === "full" ? "Medium" : "Low"
        incomeAtRisk = tariffScenario === "full" ? householdIncome * 0.08 : householdIncome * 0.02
      }
    }
    
    // Housing value change estimate based on rate changes
    let housingValueChange = 0
    if (rateChange > 0) {
      housingValueChange = -rateChange * 3.5 // ~3.5% drop per 1% rate increase
    } else if (rateChange < 0) {
      housingValueChange = -rateChange * 2.5 // ~2.5% rise per 1% rate decrease
    }
    
    // Total monthly impact
    const totalMonthlyImpact = paymentChange + (incomeAtRisk / 12)
    
    setResults({
      currentPayment,
      newPayment,
      paymentChange,
      affordabilityRatio,
      newAffordabilityRatio,
      jobRiskLevel,
      incomeAtRisk,
      housingValueChange,
      totalMonthlyImpact
    })
  }, [mortgageAmount, currentRate, rateChange, householdIncome, sector, tariffScenario])

  const provinceData = PROVINCES.find(p => p.value === province)
  const sectorData = SECTORS.find(s => s.value === sector)
  const cities = CITIES[province as keyof typeof CITIES] || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Calculator className="h-8 w-8 text-primary" />
          Personal Impact Calculator
        </h1>
        <p className="text-muted-foreground mt-1">
          See exactly how interest rate changes and tariffs affect YOUR finances
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Your Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Province</Label>
                <select 
                  value={province} 
                  onChange={(e) => {
                    setProvince(e.target.value)
                    setCity(CITIES[e.target.value as keyof typeof CITIES]?.[0] || "")
                  }}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {PROVINCES.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <select 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {cities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Home className="h-4 w-4 text-chart-5" />
                Your Mortgage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mortgage Balance (C$)</Label>
                <Input 
                  type="number" 
                  value={mortgageAmount}
                  onChange={(e) => setMortgageAmount(Number(e.target.value))}
                  min={0}
                  step={10000}
                />
                <p className="text-xs text-muted-foreground">
                  Avg in {provinceData?.label}: C${(provinceData?.housingAvg || 0).toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Current Interest Rate (%)</Label>
                <Input 
                  type="number" 
                  value={currentRate}
                  onChange={(e) => setCurrentRate(Number(e.target.value))}
                  min={0}
                  max={15}
                  step={0.25}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-accent" />
                Your Employment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Household Income (C$/year)</Label>
                <Input 
                  type="number" 
                  value={householdIncome}
                  onChange={(e) => setHouseholdIncome(Number(e.target.value))}
                  min={0}
                  step={5000}
                />
                <p className="text-xs text-muted-foreground">
                  Avg in {provinceData?.label}: C${(provinceData?.avgIncome || 0).toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Industry Sector</Label>
                <select 
                  value={sector} 
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {SECTORS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <div className="flex gap-2 mt-2">
                  <Badge variant={sectorData?.tariffRisk === "high" ? "destructive" : sectorData?.tariffRisk === "medium" ? "secondary" : "outline"} className="text-xs">
                    Tariff Risk: {sectorData?.tariffRisk}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scenario Controls & Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* Scenario Controls */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Test Scenarios</CardTitle>
              <CardDescription>Adjust these to see how changes would affect you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Interest Rate Change
                  </Label>
                  <span className={`font-bold ${rateChange > 0 ? "text-destructive" : rateChange < 0 ? "text-chart-1" : "text-muted-foreground"}`}>
                    {rateChange > 0 ? "+" : ""}{rateChange}%
                  </span>
                </div>
                <input
                  type="range"
                  min={-2}
                  max={2}
                  step={0.25}
                  value={rateChange}
                  onChange={(e) => setRateChange(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>-2% (Rate Cuts)</span>
                  <span>No Change</span>
                  <span>+2% (Rate Hikes)</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  US Tariff Scenario
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={tariffScenario === "none" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setTariffScenario("none")}
                  >
                    No Tariffs
                  </Button>
                  <Button 
                    variant={tariffScenario === "partial" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setTariffScenario("partial")}
                  >
                    25% Tariffs
                  </Button>
                  <Button 
                    variant={tariffScenario === "full" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setTariffScenario("full")}
                  >
                    Full Trade War
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <div className="space-y-4">
              {/* Summary Card */}
              <Card className={results.totalMonthlyImpact > 500 ? "border-destructive/50" : results.totalMonthlyImpact > 200 ? "border-accent/50" : "border-chart-1/50"}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Your Total Monthly Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <span className={`text-4xl font-bold ${results.totalMonthlyImpact > 0 ? "text-destructive" : "text-chart-1"}`}>
                      {results.totalMonthlyImpact > 0 ? "+" : ""}C${Math.abs(results.totalMonthlyImpact).toFixed(0)}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                    {results.totalMonthlyImpact > 500 ? (
                      <Badge variant="destructive" className="ml-auto">Significant Impact</Badge>
                    ) : results.totalMonthlyImpact > 200 ? (
                      <Badge className="ml-auto bg-accent text-accent-foreground">Moderate Impact</Badge>
                    ) : (
                      <Badge variant="outline" className="ml-auto border-chart-1 text-chart-1">Manageable</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Results */}
              <Tabs defaultValue="mortgage" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="mortgage">Mortgage</TabsTrigger>
                  <TabsTrigger value="job">Job Risk</TabsTrigger>
                  <TabsTrigger value="housing">Housing Value</TabsTrigger>
                </TabsList>

                <TabsContent value="mortgage">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Mortgage Payment Impact
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-secondary/50">
                          <p className="text-sm text-muted-foreground">Current Payment</p>
                          <p className="text-2xl font-bold">C${results.currentPayment.toFixed(0)}</p>
                          <p className="text-xs text-muted-foreground">/month</p>
                        </div>
                        <div className={`p-4 rounded-lg ${results.paymentChange > 0 ? "bg-destructive/10" : "bg-chart-1/10"}`}>
                          <p className="text-sm text-muted-foreground">New Payment</p>
                          <p className="text-2xl font-bold">C${results.newPayment.toFixed(0)}</p>
                          <p className={`text-xs ${results.paymentChange > 0 ? "text-destructive" : "text-chart-1"}`}>
                            {results.paymentChange > 0 ? "+" : ""}C${results.paymentChange.toFixed(0)}/mo
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border border-border space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Affordability Ratio</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{results.affordabilityRatio.toFixed(1)}%</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <span className={`text-sm font-bold ${results.newAffordabilityRatio > 35 ? "text-destructive" : results.newAffordabilityRatio > 30 ? "text-accent" : "text-chart-1"}`}>
                              {results.newAffordabilityRatio.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${results.newAffordabilityRatio > 35 ? "bg-destructive" : results.newAffordabilityRatio > 30 ? "bg-accent" : "bg-chart-1"}`}
                            style={{ width: `${Math.min(results.newAffordabilityRatio, 50) * 2}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Info className="h-3 w-3" />
                          Banks recommend keeping this under 32%
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="job">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Employment Risk Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                        {results.jobRiskLevel === "High" ? (
                          <AlertTriangle className="h-8 w-8 text-destructive" />
                        ) : results.jobRiskLevel === "Medium" ? (
                          <AlertTriangle className="h-8 w-8 text-accent" />
                        ) : (
                          <CheckCircle2 className="h-8 w-8 text-chart-1" />
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground">Your Job Risk Level</p>
                          <p className={`text-xl font-bold ${results.jobRiskLevel === "High" ? "text-destructive" : results.jobRiskLevel === "Medium" ? "text-accent" : "text-chart-1"}`}>
                            {results.jobRiskLevel}
                          </p>
                        </div>
                      </div>

                      {results.incomeAtRisk > 0 && (
                        <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                          <p className="text-sm text-muted-foreground">Potential Income at Risk</p>
                          <p className="text-2xl font-bold text-destructive">C${results.incomeAtRisk.toFixed(0)}/year</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Based on {sectorData?.label} sector exposure to tariffs
                          </p>
                        </div>
                      )}

                      <div className="p-4 rounded-lg bg-secondary/30 text-sm space-y-2">
                        <p className="font-medium">Why this matters:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• {sectorData?.label} has {sectorData?.tariffRisk} exposure to US tariffs</li>
                          <li>• {tariffScenario === "full" ? "Full trade war could affect 10-15% of sector jobs" : tariffScenario === "partial" ? "25% tariffs may slow hiring and reduce bonuses" : "Current trade situation has minimal job impact"}</li>
                          <li>• {province === "ON" || province === "AB" ? "Your province has higher exposure to US trade" : "Your province has moderate US trade exposure"}</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="housing">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Housing Value Projection
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className={`p-4 rounded-lg ${results.housingValueChange >= 0 ? "bg-chart-1/10" : "bg-destructive/10"}`}>
                        <p className="text-sm text-muted-foreground">Estimated Home Value Change</p>
                        <div className="flex items-center gap-2">
                          {results.housingValueChange >= 0 ? (
                            <TrendingUp className="h-6 w-6 text-chart-1" />
                          ) : (
                            <TrendingDown className="h-6 w-6 text-destructive" />
                          )}
                          <p className={`text-2xl font-bold ${results.housingValueChange >= 0 ? "text-chart-1" : "text-destructive"}`}>
                            {results.housingValueChange >= 0 ? "+" : ""}{results.housingValueChange.toFixed(1)}%
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          On a C${mortgageAmount.toLocaleString()} home: {results.housingValueChange >= 0 ? "+" : ""}C${((mortgageAmount * results.housingValueChange) / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-secondary/30 text-sm space-y-2">
                        <p className="font-medium">Market Context for {city}, {province}:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Interest rates and housing prices move inversely</li>
                          <li>• Every 1% rate increase typically reduces prices 3-5%</li>
                          <li>• {rateChange < 0 ? "Rate cuts would likely boost demand and prices" : rateChange > 0 ? "Rate hikes would cool the market further" : "Stable rates suggest sideways price movement"}</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
