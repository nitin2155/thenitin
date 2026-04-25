import { Zap, Shield, BarChart3, Users, Globe, Clock } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for speed with optimized performance that keeps your workflow running smoothly.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description: "Enterprise-grade security with end-to-end encryption to protect your data.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Gain insights with comprehensive analytics and reporting dashboards.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time collaboration features.",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Deploy worldwide with our distributed infrastructure for low latency.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our dedicated support team is always available to help you succeed.",
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-border bg-muted/50 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-pretty text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to succeed
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Powerful features designed to help you build, ship, and scale with confidence.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <feature.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
