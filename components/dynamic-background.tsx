"use client"

import { useDayNight } from "./day-night-provider"
import { cn } from "@/lib/utils"
import { ForewireWatermark } from "./forewire-logo"

export function DynamicBackground({ children }: { children: React.ReactNode }) {
  const { timeOfDay } = useDayNight()

  return (
    <div
      className={cn(
        "min-h-screen transition-all duration-1000 relative overflow-hidden",
        // White base with subtle time-based overlays
        "bg-white",
        // Time-based overlays (subtle for light mode)
        timeOfDay === "morning" && "dynamic-bg-morning-light",
        timeOfDay === "day" && "dynamic-bg-day-light",
        timeOfDay === "evening" && "dynamic-bg-evening-light",
        timeOfDay === "night" && "dynamic-bg-night-light"
      )}
    >
      {/* Forewire Watermark Logo */}
      <ForewireWatermark />

      {/* Animated gradient orbs - subtle for light mode */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
        {/* Primary orb */}
        <div
          className={cn(
            "absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 transition-all duration-1000",
            timeOfDay === "morning" && "bg-amber-200 top-[-200px] right-[-100px]",
            timeOfDay === "day" && "bg-cyan-200 top-[-150px] right-[10%]",
            timeOfDay === "evening" && "bg-orange-200 top-[-100px] right-[-50px]",
            timeOfDay === "night" && "bg-indigo-200 top-[-200px] right-[5%]"
          )}
        />
        {/* Secondary orb */}
        <div
          className={cn(
            "absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-15 transition-all duration-1000 animate-float-slow",
            timeOfDay === "morning" && "bg-rose-200 bottom-[10%] left-[-100px]",
            timeOfDay === "day" && "bg-teal-200 bottom-[20%] left-[5%]",
            timeOfDay === "evening" && "bg-purple-200 bottom-[15%] left-[-50px]",
            timeOfDay === "night" && "bg-blue-200 bottom-[10%] left-[10%]"
          )}
        />
        {/* Accent orb */}
        <div
          className={cn(
            "absolute w-[300px] h-[300px] rounded-full blur-[100px] opacity-10 transition-all duration-1000 animate-float-delayed",
            timeOfDay === "morning" && "bg-yellow-200 top-[40%] left-[60%]",
            timeOfDay === "day" && "bg-emerald-200 top-[30%] left-[70%]",
            timeOfDay === "evening" && "bg-pink-200 top-[50%] left-[65%]",
            timeOfDay === "night" && "bg-purple-200 top-[45%] left-[75%]"
          )}
        />
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 bg-grid-pattern-light opacity-30 pointer-events-none z-[1]" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// Time indicator component
export function TimeIndicator() {
  const { timeOfDay, currentHour } = useDayNight()

  const timeLabels = {
    morning: { label: "Morning Session", icon: "sunrise" },
    day: { label: "Trading Hours", icon: "sun" },
    evening: { label: "After Hours", icon: "sunset" },
    night: { label: "Markets Closed", icon: "moon" },
  }

  const { label, icon } = timeLabels[timeOfDay]

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="relative flex h-2 w-2">
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
            timeOfDay === "day" ? "bg-chart-1" : "bg-chart-4"
          )}
        />
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            timeOfDay === "day" ? "bg-chart-1" : "bg-chart-4"
          )}
        />
      </span>
      <span>{label}</span>
      <span className="text-muted-foreground/60">
        {currentHour.toString().padStart(2, "0")}:00
      </span>
    </div>
  )
}
