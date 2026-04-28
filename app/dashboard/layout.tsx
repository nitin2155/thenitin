import { MainNav } from "@/components/layout/main-nav"
import { LiveTicker } from "@/components/ui/live-ticker"
import { FloatingAlert } from "@/components/ui/market-alerts"
import { DayNightProvider } from "@/components/day-night-provider"
import { DynamicBackground, TimeIndicator } from "@/components/dynamic-background"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DayNightProvider>
      <DynamicBackground>
        <div className="min-h-screen flex flex-col">
          <MainNav />
          <LiveTicker />
          <main className="container px-4 py-6 flex-1">
            {children}
          </main>
          <FloatingAlert />
          <footer className="border-t border-border/50 py-6 backdrop-blur-sm">
        <div className="container px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            Data for educational purposes only. Not financial advice.
          </p>
          <div className="flex items-center gap-4">
            <TimeIndicator />
            <span>|</span>
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-1 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-chart-1" />
              </span>
              Live Data
            </span>
            <span>|</span>
            <span className="font-medium"><span className="text-foreground">Fore</span><span className="text-primary">wire</span></span>
          </div>
        </div>
      </footer>
        </div>
      </DynamicBackground>
    </DayNightProvider>
  )
}
