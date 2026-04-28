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
        // Pure black base with time-based overlays
        "bg-black",
        // Time-based overlays
        timeOfDay === "morning" && "dynamic-bg-morning",
        timeOfDay === "day" && "dynamic-bg-day",
        timeOfDay === "evening" && "dynamic-bg-evening",
        timeOfDay === "night" && "dynamic-bg-night"
      )}
    >
      {/* Forewire Watermark Logo */}
      <ForewireWatermark />

      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
        {/* Primary orb */}
        <div
          className={cn(
            "absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-15 transition-all duration-1000",
            timeOfDay === "morning" && "bg-amber-500 top-[-200px] right-[-100px]",
            timeOfDay === "day" && "bg-cyan-500 top-[-150px] right-[10%]",
            timeOfDay === "evening" && "bg-orange-600 top-[-100px] right-[-50px]",
            timeOfDay === "night" && "bg-indigo-700 top-[-200px] right-[5%]"
          )}
        />
        {/* Secondary orb */}
        <div
          className={cn(
            "absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-10 transition-all duration-1000 animate-float-slow",
            timeOfDay === "morning" && "bg-rose-400 bottom-[10%] left-[-100px]",
            timeOfDay === "day" && "bg-teal-500 bottom-[20%] left-[5%]",
            timeOfDay === "evening" && "bg-purple-600 bottom-[15%] left-[-50px]",
            timeOfDay === "night" && "bg-blue-800 bottom-[10%] left-[10%]"
          )}
        />
        {/* Accent orb */}
        <div
          className={cn(
            "absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-8 transition-all duration-1000 animate-float-delayed",
            timeOfDay === "morning" && "bg-yellow-400 top-[40%] left-[60%]",
            timeOfDay === "day" && "bg-emerald-500 top-[30%] left-[70%]",
            timeOfDay === "evening" && "bg-pink-600 top-[50%] left-[65%]",
            timeOfDay === "night" && "bg-purple-600 top-[45%] left-[75%]"
          )}
        />
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none z-[1]" />

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
