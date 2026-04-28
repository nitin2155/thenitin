"use client"

import { useDayNight } from "./day-night-provider"
import { cn } from "@/lib/utils"

export function DynamicBackground({ children }: { children: React.ReactNode }) {
  const { timeOfDay } = useDayNight()

  return (
    <div
      className={cn(
        "min-h-screen transition-all duration-1000 relative overflow-hidden",
        // Base background
        "bg-background",
        // Time-based overlays
        timeOfDay === "morning" && "dynamic-bg-morning",
        timeOfDay === "day" && "dynamic-bg-day",
        timeOfDay === "evening" && "dynamic-bg-evening",
        timeOfDay === "night" && "dynamic-bg-night"
      )}
    >
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Primary orb */}
        <div
          className={cn(
            "absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 transition-all duration-1000",
            timeOfDay === "morning" && "bg-amber-400 top-[-200px] right-[-100px]",
            timeOfDay === "day" && "bg-cyan-400 top-[-150px] right-[10%]",
            timeOfDay === "evening" && "bg-orange-500 top-[-100px] right-[-50px]",
            timeOfDay === "night" && "bg-indigo-600 top-[-200px] right-[5%]"
          )}
        />
        {/* Secondary orb */}
        <div
          className={cn(
            "absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-15 transition-all duration-1000 animate-float-slow",
            timeOfDay === "morning" && "bg-rose-300 bottom-[10%] left-[-100px]",
            timeOfDay === "day" && "bg-teal-400 bottom-[20%] left-[5%]",
            timeOfDay === "evening" && "bg-purple-500 bottom-[15%] left-[-50px]",
            timeOfDay === "night" && "bg-blue-700 bottom-[10%] left-[10%]"
          )}
        />
        {/* Accent orb */}
        <div
          className={cn(
            "absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-10 transition-all duration-1000 animate-float-delayed",
            timeOfDay === "morning" && "bg-yellow-300 top-[40%] left-[60%]",
            timeOfDay === "day" && "bg-emerald-400 top-[30%] left-[70%]",
            timeOfDay === "evening" && "bg-pink-500 top-[50%] left-[65%]",
            timeOfDay === "night" && "bg-purple-500 top-[45%] left-[75%]"
          )}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none z-0" />

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
