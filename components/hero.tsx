import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
          Introducing our new platform
        </div>
        <h1 className="text-pretty text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Build something amazing with our platform
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Streamline your workflow, boost productivity, and create exceptional experiences. 
          Our platform provides everything you need to succeed.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="w-full sm:w-auto">
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            See How It Works
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          No credit card required. Start your 14-day free trial today.
        </p>
      </div>
    </section>
  )
}
