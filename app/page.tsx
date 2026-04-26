import { Brain, BarChart3, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_40%,transparent_100%)]" />
      
      {/* Glowing orb effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      
      <main className="relative z-10 flex flex-col items-center gap-8 text-center">
        {/* Icon cluster */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary border border-border">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary border border-border">
            <BarChart3 className="h-5 w-5 text-accent" />
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary border border-border">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* Main heading */}
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-foreground">the</span>
            <span className="text-primary">nitin</span>
            <span className="text-foreground">.space</span>
          </h1>
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            AI-Powered Analytics Platform
          </p>
        </div>

        {/* Description */}
        <p className="max-w-md text-lg text-muted-foreground leading-relaxed">
          Intelligent insights. Real-time data processing. 
          <span className="text-accent"> Coming soon.</span>
        </p>

        {/* Status indicator */}
        <div className="flex items-center gap-2 rounded-full bg-secondary/50 border border-border px-4 py-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-sm text-muted-foreground">In Development</span>
        </div>
      </main>
    </div>
  )
}
