"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HistoricalAnalysisModal } from "./historical-analysis-modal"
import { 
  History,
  ArrowRight,
  ChevronRight,
  LucideIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface SectionCardProps {
  title: string
  description?: string
  icon: LucideIcon
  iconColor?: string
  category: "housing" | "stocks" | "trade" | "commodities" | "economy"
  children: ReactNode
  href?: string
  badge?: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
}

export function SectionCard({
  title,
  description,
  icon: Icon,
  iconColor = "text-primary",
  category,
  children,
  href,
  badge,
  badgeVariant = "outline"
}: SectionCardProps) {
  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border">
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg",
              "bg-secondary/50 group-hover:bg-secondary/80 transition-colors"
            )}>
              <Icon className={cn("h-5 w-5", iconColor)} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{title}</CardTitle>
                {badge && (
                  <Badge variant={badgeVariant} className="text-xs">
                    {badge}
                  </Badge>
                )}
              </div>
              {description && (
                <CardDescription className="mt-0.5">{description}</CardDescription>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <HistoricalAnalysisModal 
              category={category} 
              title={`${title} Analysis`}
              subtitle={`Historical events, correlations, and insights for ${title.toLowerCase()}`}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
              </Button>
            </HistoricalAnalysisModal>
            
            {href && (
              <Link href={href}>
                <Button variant="ghost" size="sm" className="gap-1">
                  View all
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        {children}
      </CardContent>
    </Card>
  )
}

// Section divider with label
export function SectionDivider({ 
  title, 
  icon: Icon,
  description 
}: { 
  title: string
  icon?: LucideIcon
  description?: string
}) {
  return (
    <div className="flex items-center gap-4 py-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
    </div>
  )
}
