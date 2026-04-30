import Link from "next/link"
import { ArrowLeft, Zap, Target, Shield, Users } from "lucide-react"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "About | Forewire",
  description: "Learn about Forewire - an educational platform for market data visualization and probabilistic forecasting.",
}

export default function AboutPage() {
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
              About Forewire
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Wired into forward signals. An educational platform designed to help you understand 
              market dynamics, economic indicators, and the interconnected nature of global finance.
            </p>
          </div>

          {/* Mission */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Forewire exists to democratize access to market intelligence. We believe everyone deserves 
              the ability to understand how global events, economic policies, and market movements 
              interconnect - without needing a finance degree or expensive terminal subscriptions.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We aggregate publicly available data, present it in intuitive visualizations, and provide 
              educational context to help you develop your own understanding of market dynamics.
            </p>
          </section>

          {/* Values */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">What We Stand For</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3 rounded-lg border border-border bg-card p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Transparency</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All our data sources are clearly documented. We show you exactly where information 
                  comes from and any limitations in the data.
                </p>
              </div>

              <div className="space-y-3 rounded-lg border border-border bg-card p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Education First</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We&apos;re not here to tell you what to buy or sell. Our goal is to help you 
                  understand market mechanics so you can make your own informed decisions.
                </p>
              </div>

              <div className="space-y-3 rounded-lg border border-border bg-card p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">No Hidden Agendas</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We don&apos;t sell your data or push specific investment products. Our revenue model 
                  is straightforward and transparent.
                </p>
              </div>

              <div className="space-y-3 rounded-lg border border-border bg-card p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Community Driven</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We listen to our users. Feature requests, bug reports, and feedback directly 
                  shape our development roadmap.
                </p>
              </div>
            </div>
          </section>

          {/* What We Are Not */}
          <section className="space-y-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-6">
            <h2 className="text-xl font-semibold text-amber-600 dark:text-amber-400">
              What Forewire Is NOT
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">-</span>
                <span>
                  <strong>Not a financial advisor.</strong> We do not provide personalized investment 
                  advice and are not licensed to do so.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">-</span>
                <span>
                  <strong>Not a trading platform.</strong> You cannot buy or sell securities through 
                  Forewire. We only display information.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">-</span>
                <span>
                  <strong>Not a prediction service.</strong> Our probabilistic forecasts are 
                  educational models, not guaranteed predictions.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">-</span>
                <span>
                  <strong>Not real-time data.</strong> Market data may be delayed 15-20 minutes 
                  depending on the data source.
                </span>
              </li>
            </ul>
          </section>

          {/* Team/Contact */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Get in Touch</h2>
            <p className="text-muted-foreground leading-relaxed">
              Have questions, feedback, or partnership inquiries? We&apos;d love to hear from you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Contact Us
              </Link>
              <Link
                href="/methodology"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
              >
                View Methodology
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
