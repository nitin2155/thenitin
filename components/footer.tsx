import Link from "next/link"
import { AlertTriangle } from "lucide-react"

const footerLinks = {
  product: [
    { href: "/dashboard/stocks", label: "Stocks" },
    { href: "/dashboard/housing", label: "Housing" },
    { href: "/dashboard/commodities", label: "Commodities" },
    { href: "/dashboard/economic-impact", label: "Economic Impact" },
    { href: "/dashboard/immigration", label: "Immigration" },
  ],
  resources: [
    { href: "/dashboard/tariffs", label: "Tariff Analysis" },
    { href: "/dashboard/news", label: "Market News" },
    { href: "/methodology", label: "Methodology" },
    { href: "/data-sources", label: "Data Sources" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy#cookies", label: "Cookie Policy" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Financial Disclaimer */}
        <div className="mb-10 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                Important Disclaimer
              </h4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                <strong>Not Financial Advice:</strong> The information provided on Forewire is for educational and informational purposes only. 
                It should not be construed as financial, investment, legal, or tax advice. Always consult with a qualified financial advisor 
                before making any investment decisions.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                <strong>Data Accuracy:</strong> Market data displayed may be delayed by 15-20 minutes and is sourced from third-party providers 
                including Yahoo Finance. We make no guarantees regarding the accuracy, completeness, or timeliness of any information. 
                Historical performance does not guarantee future results.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                <strong>Risk Warning:</strong> Investing in financial markets involves substantial risk of loss and is not suitable for all investors. 
                Past performance is not indicative of future results. The value of investments can go down as well as up.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="text-xl font-semibold tracking-tight text-foreground">
              Forewire
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Wired into forward signals. Probabilistic forecasting for world events with market impact projections, 
              historical precedents, and real-time sentiment analysis.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              Data auto-refreshes every 60 seconds
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Dashboards</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Forewire. All rights reserved. For educational purposes only.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
