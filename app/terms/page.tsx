import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Forewire",
  description: "Terms of Service for Forewire - Educational financial data platform",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl px-4 py-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Forewire (&quot;the Service&quot;), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Educational Purpose Only</h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Forewire is an educational and informational platform only.</strong> The Service provides 
              market data, analysis tools, and educational content for learning purposes. Nothing on this platform 
              constitutes financial, investment, legal, or tax advice.
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
              <li>We do not provide personalized investment recommendations</li>
              <li>We do not manage money or assets for users</li>
              <li>We do not hold any securities licenses in Canada or elsewhere</li>
              <li>All forecasts and projections are hypothetical and for educational demonstration only</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. No Financial Advice</h2>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 mb-4">
              <p className="text-sm text-muted-foreground">
                <strong className="text-amber-600 dark:text-amber-400">Important:</strong> The information provided on Forewire should not be 
                construed as financial advice. You should always consult with a qualified, licensed financial advisor 
                before making any investment decisions. We are not registered as securities broker-dealers, investment 
                advisers, or in any similar capacity with any regulatory authority in Canada or any other jurisdiction.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Data Accuracy and Sources</h2>
            <p className="text-muted-foreground leading-relaxed">
              Market data displayed on Forewire is sourced from third-party providers including Yahoo Finance. We make 
              reasonable efforts to ensure accuracy but cannot guarantee:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
              <li>The accuracy, completeness, or timeliness of any data</li>
              <li>Real-time pricing (data may be delayed by 15-20 minutes)</li>
              <li>The availability of the Service at all times</li>
              <li>That forecasts or projections will be accurate</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Risk Acknowledgment</h2>
            <p className="text-muted-foreground leading-relaxed">
              By using this Service, you acknowledge that:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
              <li>Investing in financial markets involves substantial risk of loss</li>
              <li>Past performance does not guarantee future results</li>
              <li>The value of investments can go down as well as up</li>
              <li>You may lose some or all of your invested capital</li>
              <li>You are solely responsible for your own investment decisions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. User Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to use Forewire only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
              <li>Use the Service for any commercial purpose without our consent</li>
              <li>Redistribute or resell any data obtained from the Service</li>
              <li>Attempt to circumvent any security measures</li>
              <li>Use automated systems to scrape or extract data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the fullest extent permitted by law, Forewire and its operators shall not be liable for any direct, 
              indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, 
              including but not limited to financial losses from investment decisions made based on information 
              obtained from the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">8. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. Continued use of the Service after changes 
              constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">9. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Canada and the 
              province of Ontario, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">10. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us at legal@forewire.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
