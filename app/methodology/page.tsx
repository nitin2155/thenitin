import Link from "next/link"
import { ArrowLeft, Database, RefreshCw, Calculator, AlertTriangle } from "lucide-react"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Methodology | Forewire",
  description: "Learn how Forewire collects, processes, and displays market data. Understand our data sources, refresh rates, and calculation methods.",
}

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="space-y-12">
          {/* Hero */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Methodology
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Transparency is core to our mission. Here&apos;s exactly how we collect, process, 
              and present market data on Forewire.
            </p>
          </div>

          {/* Data Collection */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Data Collection</h2>
            </div>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                All market data displayed on Forewire is collected from publicly available sources via 
                official APIs. We do not scrape websites or use unofficial data sources.
              </p>
              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-3">Primary Data Sources</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Stock Prices:</strong> Yahoo Finance API - delayed 15-20 minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Economic Indicators:</strong> Federal Reserve Economic Data (FRED), Bank of Canada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Commodity Prices:</strong> Yahoo Finance API</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Currency Rates:</strong> Yahoo Finance API, Bank of Canada daily rates</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Refresh */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Data Refresh Rates</h2>
            </div>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Different data types refresh at different intervals to balance freshness with API rate limits:
              </p>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Data Type</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Refresh Interval</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Delay</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3">Stock Prices</td>
                      <td className="px-4 py-3">60 seconds</td>
                      <td className="px-4 py-3">15-20 min</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Currency Rates</td>
                      <td className="px-4 py-3">60 seconds</td>
                      <td className="px-4 py-3">15-20 min</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Commodities</td>
                      <td className="px-4 py-3">60 seconds</td>
                      <td className="px-4 py-3">15-20 min</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Interest Rates</td>
                      <td className="px-4 py-3">1 hour</td>
                      <td className="px-4 py-3">Daily</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Economic Indicators</td>
                      <td className="px-4 py-3">6 hours</td>
                      <td className="px-4 py-3">Varies</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Calculations */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Calculations & Metrics</h2>
            </div>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We use standard financial calculations to derive metrics from raw data:
              </p>
              
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-card p-5">
                  <h3 className="font-semibold text-foreground mb-2">Percentage Change</h3>
                  <code className="block rounded bg-muted px-3 py-2 text-sm font-mono">
                    Change % = ((Current Price - Previous Close) / Previous Close) * 100
                  </code>
                </div>

                <div className="rounded-lg border border-border bg-card p-5">
                  <h3 className="font-semibold text-foreground mb-2">Market Cap</h3>
                  <code className="block rounded bg-muted px-3 py-2 text-sm font-mono">
                    Market Cap = Current Price * Shares Outstanding
                  </code>
                </div>

                <div className="rounded-lg border border-border bg-card p-5">
                  <h3 className="font-semibold text-foreground mb-2">52-Week Range Position</h3>
                  <code className="block rounded bg-muted px-3 py-2 text-sm font-mono">
                    Position % = ((Current - 52W Low) / (52W High - 52W Low)) * 100
                  </code>
                </div>
              </div>
            </div>
          </section>

          {/* Limitations */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Known Limitations</h2>
            </div>
            
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-6">
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">1.</span>
                  <span>
                    <strong>Data delays:</strong> Stock and currency data is delayed 15-20 minutes. 
                    This is not suitable for real-time trading decisions.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">2.</span>
                  <span>
                    <strong>Market hours:</strong> Data may appear stale outside of market hours 
                    as no trading is occurring.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">3.</span>
                  <span>
                    <strong>API reliability:</strong> We depend on third-party APIs. Occasionally, 
                    data may be unavailable or delayed due to upstream issues.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">4.</span>
                  <span>
                    <strong>Coverage:</strong> We focus on major North American markets. 
                    International markets have limited coverage.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">5.</span>
                  <span>
                    <strong>Historical data:</strong> Historical charts may have gaps due to 
                    data availability from our sources.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* More Info */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Questions?</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about our methodology or notice any data discrepancies, 
              please let us know.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Contact Us
              </Link>
              <Link
                href="/data-sources"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
              >
                View Data Sources
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
