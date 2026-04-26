import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: LucideIcon
  iconColor?: string
  description?: string
  trend?: "up" | "down" | "neutral"
  currency?: "CAD" | "USD" | "%"
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = "text-primary",
  description,
  trend,
  currency,
  className
}: StatCardProps) {
  // Determine trend from change if not explicitly provided
  const displayTrend = trend ?? (change !== undefined ? (change > 0 ? "up" : change < 0 ? "down" : "neutral") : undefined)

  const TrendIcon = displayTrend === "up" ? TrendingUp : displayTrend === "down" ? TrendingDown : Minus

  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      if (currency === "CAD") return `C$${val.toLocaleString()}`
      if (currency === "USD") return `$${val.toLocaleString()}`
      if (currency === "%") return `${val}%`
      return val.toLocaleString()
    }
    return val
  }

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{formatValue(value)}</p>
            
            {(change !== undefined || description) && (
              <div className="flex items-center gap-2 pt-1">
                {change !== undefined && (
                  <span
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium",
                      displayTrend === "up" && "text-chart-2",
                      displayTrend === "down" && "text-destructive",
                      displayTrend === "neutral" && "text-muted-foreground"
                    )}
                  >
                    <TrendIcon className="h-3 w-3" />
                    {change > 0 ? "+" : ""}{change}%
                    {changeLabel && <span className="text-muted-foreground ml-1">{changeLabel}</span>}
                  </span>
                )}
                {description && (
                  <span className="text-xs text-muted-foreground">{description}</span>
                )}
              </div>
            )}
          </div>
          
          {Icon && (
            <div className={cn("p-2 rounded-lg bg-secondary", iconColor)}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
