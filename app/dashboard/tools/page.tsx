"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  Home,
  Calculator,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  PiggyBank,
  Info
} from "lucide-react"
import type { CanadianEconomicData } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Canadian CMHC insurance premiums
function getCMHCPremium(ltv: number): number {
  if (ltv <= 0.65) return 0.006
  if (ltv <= 0.75) return 0.017
  if (ltv <= 0.80) return 0.024
  if (ltv <= 0.85) return 0.028
  if (ltv <= 0.90) return 0.031
  if (ltv <= 0.95) return 0.04
  return 0
}

export default function ToolsPage() {
  const { data: economyData } = useSWR<CanadianEconomicData>(
    "/api/canada/economy",
    fetcher
  )

  // Mortgage Calculator State
  const [homePrice, setHomePrice] = useState(500000)
  const [downPayment, setDownPayment] = useState(100000)
  const [mortgageRate, setMortgageRate] = useState(economyData?.mortgageRate5yr?.value || 5.5)
  const [amortization, setAmortization] = useState(25)
  const [householdIncome, setHouseholdIncome] = useState(100000)

  // Investment Calculator State
  const [initialInvestment, setInitialInvestment] = useState(10000)
  const [monthlyContribution, setMonthlyContribution] = useState(500)
  const [investmentYears, setInvestmentYears] = useState(20)
  const [expectedReturn, setExpectedReturn] = useState(7)

  // Mortgage Calculations
  const mortgageCalc = useMemo(() => {
    const downPaymentPercent = (downPayment / homePrice) * 100
    const mortgageAmount = homePrice - downPayment
    const ltv = mortgageAmount / homePrice
    
    // CMHC insurance required if down payment < 20%
    const cmhcRate = downPaymentPercent < 20 ? getCMHCPremium(ltv) : 0
    const cmhcInsurance = mortgageAmount * cmhcRate
    const totalMortgage = mortgageAmount + cmhcInsurance
    
    // Monthly payment calculation
    const monthlyRate = mortgageRate / 100 / 12
    const numPayments = amortization * 12
    const monthlyPayment = totalMortgage * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    
    const totalCost = monthlyPayment * numPayments
    const totalInterest = totalCost - totalMortgage
    
    // Stress test (rate + 2% or 5.25%, whichever is higher)
    const stressTestRate = Math.max(mortgageRate + 2, 5.25) / 100 / 12
    const stressTestPayment = totalMortgage * (stressTestRate * Math.pow(1 + stressTestRate, numPayments)) / (Math.pow(1 + stressTestRate, numPayments) - 1)
    
    // GDS ratio (mortgage payment + property tax + heat should be < 39% of gross income)
    const monthlyIncome = householdIncome / 12
    const estimatedPropertyTax = (homePrice * 0.01) / 12 // ~1% of home value annually
    const estimatedHeat = 150
    const gdsRatio = ((monthlyPayment + estimatedPropertyTax + estimatedHeat) / monthlyIncome) * 100
    
    // Required income for stress test (GDS < 39%)
    const totalMonthlyObligations = stressTestPayment + estimatedPropertyTax + estimatedHeat
    const requiredIncome = (totalMonthlyObligations / 0.39) * 12
    
    return {
      downPaymentPercent: downPaymentPercent.toFixed(1),
      mortgageAmount,
      cmhcInsurance,
      totalMortgage,
      monthlyPayment,
      totalInterest,
      totalCost,
      stressTestRate: Math.max(mortgageRate + 2, 5.25),
      stressTestPayment,
      gdsRatio,
      requiredIncome,
      qualifies: householdIncome >= requiredIncome
    }
  }, [homePrice, downPayment, mortgageRate, amortization, householdIncome])

  // Investment Calculations
  const investmentCalc = useMemo(() => {
    const monthlyRate = expectedReturn / 100 / 12
    const months = investmentYears * 12
    
    // Future value formula with regular contributions
    const futureValue = initialInvestment * Math.pow(1 + monthlyRate, months) +
      monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    
    const totalContributions = initialInvestment + (monthlyContribution * months)
    const totalGrowth = futureValue - totalContributions
    
    // Year by year breakdown
    const yearlyBreakdown = []
    let balance = initialInvestment
    for (let year = 1; year <= investmentYears; year++) {
      for (let month = 0; month < 12; month++) {
        balance = balance * (1 + monthlyRate) + monthlyContribution
      }
      yearlyBreakdown.push({
        year,
        balance: Math.round(balance),
        contributions: initialInvestment + (monthlyContribution * year * 12),
        growth: Math.round(balance - (initialInvestment + monthlyContribution * year * 12))
      })
    }
    
    return {
      futureValue,
      totalContributions,
      totalGrowth,
      yearlyBreakdown
    }
  }, [initialInvestment, monthlyContribution, investmentYears, expectedReturn])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Tools</h1>
        <p className="text-muted-foreground mt-1">
          Canadian mortgage and investment calculators
        </p>
      </div>

      <Tabs defaultValue="mortgage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="mortgage" className="gap-2">
            <Home className="h-4 w-4" />
            Mortgage
          </TabsTrigger>
          <TabsTrigger value="investment" className="gap-2">
            <PiggyBank className="h-4 w-4" />
            Investment
          </TabsTrigger>
        </TabsList>

        {/* Mortgage Calculator */}
        <TabsContent value="mortgage" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Inputs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Mortgage Calculator
                </CardTitle>
                <CardDescription>
                  Canadian mortgage with CMHC insurance and stress test
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="homePrice">Home Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="homePrice"
                      type="number"
                      value={homePrice}
                      onChange={(e) => setHomePrice(Number(e.target.value))}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="downPayment">Down Payment</Label>
                    <span className="text-sm text-muted-foreground">
                      {mortgageCalc.downPaymentPercent}%
                    </span>
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="downPayment"
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="pl-9"
                    />
                  </div>
                  <Slider
                    value={[downPayment]}
                    onValueChange={([v]) => setDownPayment(v)}
                    max={homePrice * 0.5}
                    min={homePrice * 0.05}
                    step={5000}
                    className="mt-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="rate">Interest Rate (%)</Label>
                    <span className="text-sm text-muted-foreground">
                      BoC 5yr: {economyData?.mortgageRate5yr?.value || 5.5}%
                    </span>
                  </div>
                  <Input
                    id="rate"
                    type="number"
                    step="0.01"
                    value={mortgageRate}
                    onChange={(e) => setMortgageRate(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Amortization</Label>
                    <span className="text-sm text-muted-foreground">
                      {amortization} years
                    </span>
                  </div>
                  <Slider
                    value={[amortization]}
                    onValueChange={([v]) => setAmortization(v)}
                    max={30}
                    min={10}
                    step={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="income">Household Income (Annual)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="income"
                      type="number"
                      value={householdIncome}
                      onChange={(e) => setHouseholdIncome(Number(e.target.value))}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Monthly Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-primary">
                    C${mortgageCalc.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    per month for {amortization} years
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mortgage Amount</span>
                    <span className="font-medium">
                      C${mortgageCalc.mortgageAmount.toLocaleString()}
                    </span>
                  </div>
                  {mortgageCalc.cmhcInsurance > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CMHC Insurance</span>
                      <span className="font-medium text-chart-1">
                        +C${mortgageCalc.cmhcInsurance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Interest</span>
                    <span className="font-medium">
                      C${mortgageCalc.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="font-medium">Total Cost</span>
                    <span className="font-bold">
                      C${mortgageCalc.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Stress Test */}
              <Card className={mortgageCalc.qualifies ? "border-chart-2/30" : "border-destructive/30"}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {mortgageCalc.qualifies ? (
                      <CheckCircle2 className="h-5 w-5 text-chart-2" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    )}
                    Stress Test
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Banks test at {mortgageCalc.stressTestRate.toFixed(2)}% 
                    (your rate + 2% or 5.25%, whichever is higher)
                  </p>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stress Test Payment</span>
                    <span className="font-medium">
                      C${mortgageCalc.stressTestPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GDS Ratio</span>
                    <span className={`font-medium ${mortgageCalc.gdsRatio > 39 ? "text-destructive" : "text-chart-2"}`}>
                      {mortgageCalc.gdsRatio.toFixed(1)}% (max 39%)
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-muted-foreground">Required Income</span>
                    <span className="font-bold">
                      C${mortgageCalc.requiredIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CMHC Info */}
          <Card className="bg-secondary/30">
            <CardContent className="p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">About CMHC Insurance</p>
                <p className="text-sm text-muted-foreground">
                  In Canada, if your down payment is less than 20%, you must pay mortgage 
                  default insurance (CMHC). This protects the lender and is added to your 
                  mortgage. Rates range from 2.4% to 4% of the mortgage amount.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investment Calculator */}
        <TabsContent value="investment" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Inputs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-chart-2" />
                  Investment Growth Calculator
                </CardTitle>
                <CardDescription>
                  Project your investment growth over time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="initial">Initial Investment</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="initial"
                      type="number"
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(Number(e.target.value))}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly">Monthly Contribution</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="monthly"
                      type="number"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Investment Period</Label>
                    <span className="text-sm text-muted-foreground">
                      {investmentYears} years
                    </span>
                  </div>
                  <Slider
                    value={[investmentYears]}
                    onValueChange={([v]) => setInvestmentYears(v)}
                    max={40}
                    min={1}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Expected Annual Return</Label>
                    <span className="text-sm text-muted-foreground">
                      {expectedReturn}%
                    </span>
                  </div>
                  <Slider
                    value={[expectedReturn]}
                    onValueChange={([v]) => setExpectedReturn(v)}
                    max={15}
                    min={1}
                    step={0.5}
                  />
                  <p className="text-xs text-muted-foreground">
                    Historical S&P 500 avg: ~10% | TSX: ~8% | Conservative: ~5%
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Future Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-chart-2">
                    C${investmentCalc.futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    after {investmentYears} years at {expectedReturn}% return
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Contributions</span>
                    <span className="font-medium">
                      C${investmentCalc.totalContributions.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Investment Growth</span>
                    <span className="font-medium text-chart-2">
                      +C${investmentCalc.totalGrowth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="font-medium">Growth Multiple</span>
                    <span className="font-bold text-chart-2">
                      {(investmentCalc.futureValue / investmentCalc.totalContributions).toFixed(2)}x
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Growth Milestones */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Growth Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[5, 10, 15, 20].filter(y => y <= investmentYears).map((year) => {
                      const milestone = investmentCalc.yearlyBreakdown.find(yb => yb.year === year)
                      if (!milestone) return null
                      return (
                        <div
                          key={year}
                          className="flex items-center justify-between p-2 rounded bg-secondary/50"
                        >
                          <span className="text-sm text-muted-foreground">Year {year}</span>
                          <span className="font-medium">
                            C${milestone.balance.toLocaleString()}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* TFSA/RRSP Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-secondary/30">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">TFSA (Tax-Free Savings Account)</h4>
                <p className="text-sm text-muted-foreground">
                  Contributions are not tax-deductible, but all growth and withdrawals 
                  are tax-free. 2024 contribution room: $7,000. Lifetime max: ~$95,000.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-secondary/30">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">RRSP (Registered Retirement Savings Plan)</h4>
                <p className="text-sm text-muted-foreground">
                  Contributions are tax-deductible, growth is tax-deferred, but 
                  withdrawals are taxed as income. Best if you&apos;ll be in a lower tax bracket at retirement.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
