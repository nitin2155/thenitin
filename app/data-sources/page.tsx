import Link from "next/link"
import { ArrowLeft, ExternalLink, CheckCircle2 } from "lucide-react"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Data Sources | Forewire",
  description: "Complete list of data providers and APIs used by Forewire to display market information.",
}

const dataSources = [
  {
    name: "Yahoo Finance",
    url: "https://finance.yahoo.com",
    description: "Primary source for stock prices, ETF data, commodity prices, and currency exchange rates.",
    dataTypes: ["Stock Prices", "ETF Prices", "Commodities", "Forex", "Index Data"],
    delay: "15-20 minutes",
    license: "Public API",
  },
  {
    name: "Federal Reserve Economic Data (FRED)",
    url: "https://fred.stlouisfed.org",
    description: "Economic indicators, interest rates, and macroeconomic data for the United States.",
    dataTypes: ["Interest Rates", "Treasury Yields", "Economic Indicators", "Employment Data"],
    delay: "Varies by indicator",
    license: "Public Domain",
  },
  {
    name: "Bank of Canada",
    url: "https://www.bankofcanada.ca",
    description: "Official Canadian interest rates, CAD exchange rates, and monetary policy data.",
    dataTypes: ["CAD Exchange Rates", "Bank Rate", "Policy Interest Rate"],
    delay: "Daily updates",
    license: "Open Government License",
  },
]

const upcomingSources = [
  {
    name: "Statistics Canada",
    description: "Housing data, CPI, and Canadian economic indicators.",
  },
  {
    name: "U.S. Bureau of Labor Statistics",
    description: "Employment data, inflation metrics, and labor market statistics.",
  },
]

export default function DataSourcesPage() {
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
              Data Sources
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              We believe in full transparency about where our data comes from. Here&apos;s a complete 
              list of the APIs and data providers we use.
            </p>
          </div>

          {/* Current Sources */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Current Data Providers</h2>
            
            <div className="space-y-4">
              {dataSources.map((source) => (
                <div 
                  key={source.name} 
                  className="rounded-lg border border-border bg-card p-6 space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{source.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{source.description}</p>
                    </div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline underline-offset-4"
                    >
                      Visit
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {source.dataTypes.map((type) => (
                      <span
                        key={type}
                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                      >
                        {type}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">Data Delay: </span>
                      <span className="text-foreground">{source.delay}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">License: </span>
                      <span className="text-foreground">{source.license}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Data Accuracy */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Data Accuracy Commitment</h2>
            <div className="rounded-lg border border-border bg-card p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-chart-1 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    We only use official APIs - no web scraping or unofficial data sources
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-chart-1 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Data delays are clearly disclosed throughout the platform
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-chart-1 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    We implement caching to reduce load on data providers while maintaining freshness
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-chart-1 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Error states are clearly indicated when data is unavailable
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Upcoming Sources */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Planned Integrations</h2>
            <p className="text-muted-foreground">
              We&apos;re working on adding more data sources to improve coverage:
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {upcomingSources.map((source) => (
                <div 
                  key={source.name}
                  className="rounded-lg border border-dashed border-border bg-muted/30 p-4"
                >
                  <h3 className="font-medium text-foreground">{source.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{source.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Attribution */}
          <section className="space-y-4 rounded-lg border border-border bg-muted/30 p-6">
            <h2 className="text-lg font-semibold text-foreground">Attribution & Licensing</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All data displayed on Forewire is sourced from the providers listed above and used 
              in accordance with their respective terms of service and licensing agreements. 
              We make no claim of ownership over this data. All trademarks and brand names belong 
              to their respective owners.
            </p>
          </section>

          {/* CTA */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Suggest a Data Source</h2>
            <p className="text-muted-foreground leading-relaxed">
              Know of a reliable data source we should integrate? We&apos;d love to hear about it.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Contact Us
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
