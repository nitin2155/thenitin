"use client"

import { useMemo } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts"
import { cn } from "@/lib/utils"
import type { GeopoliticalEvent } from "@/lib/geopolitical-events"

interface HistoricalDataPoint {
  date: string
  timestamp: number
  close: number
  high: number
  low: number
  volume: number
}

interface PriceChartProps {
  data: HistoricalDataPoint[]
  events?: GeopoliticalEvent[]
  commodityId: string
  showEvents?: boolean
  height?: number
  className?: string
}

const EVENT_COLORS: Record<string, string> = {
  conflict: "rgba(239, 68, 68, 0.2)",
  trade: "rgba(245, 158, 11, 0.2)",
  financial: "rgba(99, 102, 241, 0.2)",
  pandemic: "rgba(168, 85, 247, 0.2)",
  political: "rgba(14, 165, 233, 0.2)",
  energy: "rgba(34, 197, 94, 0.2)",
  sanctions: "rgba(236, 72, 153, 0.2)",
}

export function PriceChart({
  data,
  events = [],
  commodityId,
  showEvents = true,
  height = 400,
  className
}: PriceChartProps) {
  const chartData = useMemo(() => {
    return data.map(point => ({
      ...point,
      dateFormatted: new Date(point.timestamp).toLocaleDateString("en-CA", {
        month: "short",
        day: "numeric",
        year: "2-digit"
      })
    }))
  }, [data])
  
  const eventMarkers = useMemo(() => {
    if (!showEvents || events.length === 0) return []
    
    const dataStartTime = data[0]?.timestamp || 0
    const dataEndTime = data[data.length - 1]?.timestamp || 0
    
    return events
      .filter(event => {
        const eventTime = new Date(event.date).getTime()
        return eventTime >= dataStartTime && eventTime <= dataEndTime
      })
      .map(event => {
        const eventTime = new Date(event.date).getTime()
        const closestPoint = data.reduce((prev, curr) => {
          return Math.abs(curr.timestamp - eventTime) < Math.abs(prev.timestamp - eventTime) ? curr : prev
        })
        
        return {
          ...event,
          x: closestPoint.date,
          price: closestPoint.close
        }
      })
  }, [data, events, showEvents])
  
  const priceRange = useMemo(() => {
    const prices = data.map(d => d.close).filter(p => p > 0)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const padding = (max - min) * 0.1
    return {
      min: Math.max(0, min - padding),
      max: max + padding
    }
  }, [data])
  
  const isPositive = data.length > 1 && data[data.length - 1].close >= data[0].close
  
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: HistoricalDataPoint & { dateFormatted: string } }[] }) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload
      const eventOnDate = eventMarkers.find(e => e.x === point.date)
      
      return (
        <div className="bg-card/95 backdrop-blur border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{point.dateFormatted}</p>
          <p className="text-lg font-bold text-foreground">
            ${point.close.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground mt-1">
            <span>H: ${point.high.toFixed(2)}</span>
            <span>L: ${point.low.toFixed(2)}</span>
          </div>
          {eventOnDate && (
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-xs font-medium text-primary">{eventOnDate.shortName}</p>
            </div>
          )}
        </div>
      )
    }
    return null
  }
  
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${commodityId}`} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={isPositive ? "hsl(var(--chart-1))" : "hsl(var(--destructive))"}
                stopOpacity={0.3}
              />
              <stop
                offset="100%"
                stopColor={isPositive ? "hsl(var(--chart-1))" : "hsl(var(--destructive))"}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
          
          <XAxis
            dataKey="dateFormatted"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            tickLine={{ stroke: "hsl(var(--border))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            interval="preserveStartEnd"
            minTickGap={50}
          />
          
          <YAxis
            domain={[priceRange.min, priceRange.max]}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            tickLine={{ stroke: "hsl(var(--border))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            width={70}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {/* Event markers as reference areas */}
          {showEvents && eventMarkers.map((event, idx) => (
            <ReferenceLine
              key={`event-${idx}`}
              x={chartData.find(d => d.date === event.x)?.dateFormatted}
              stroke={EVENT_COLORS[event.category] ? EVENT_COLORS[event.category].replace("0.2", "0.8") : "rgba(255,255,255,0.5)"}
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                value: event.shortName,
                position: "top",
                fill: "hsl(var(--foreground))",
                fontSize: 10,
                fontWeight: 600
              }}
            />
          ))}
          
          <Area
            type="monotone"
            dataKey="close"
            stroke={isPositive ? "hsl(var(--chart-1))" : "hsl(var(--destructive))"}
            strokeWidth={2}
            fill={`url(#gradient-${commodityId})`}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Event Legend */}
      {showEvents && eventMarkers.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {eventMarkers.map((event, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary/50 border border-border text-xs"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: EVENT_COLORS[event.category]?.replace("0.2", "1") || "white" }}
              />
              <span className="text-muted-foreground">{event.shortName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
