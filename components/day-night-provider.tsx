"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type TimeOfDay = "morning" | "day" | "evening" | "night"

interface DayNightContextType {
  timeOfDay: TimeOfDay
  isDark: boolean
  currentHour: number
}

const DayNightContext = createContext<DayNightContextType>({
  timeOfDay: "day",
  isDark: false,
  currentHour: 12,
})

export function useDayNight() {
  return useContext(DayNightContext)
}

function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 9) return "morning"
  if (hour >= 9 && hour < 17) return "day"
  if (hour >= 17 && hour < 21) return "evening"
  return "night"
}

export function DayNightProvider({ children }: { children: ReactNode }) {
  const [currentHour, setCurrentHour] = useState(12)
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("day")

  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours()
      setCurrentHour(hour)
      setTimeOfDay(getTimeOfDay(hour))
    }

    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const isDark = timeOfDay === "night" || timeOfDay === "evening"

  return (
    <DayNightContext.Provider value={{ timeOfDay, isDark, currentHour }}>
      {children}
    </DayNightContext.Provider>
  )
}
