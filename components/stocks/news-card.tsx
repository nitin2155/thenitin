"use client"

import { ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface NewsCardProps {
  title: string
  description: string
  source: string
  publishedAt: string
  url: string
  category: "conflict" | "trade" | "sanctions" | "diplomacy" | "economy"
  affectedStocks: string[]
  sentiment: "positive" | "negative" | "neutral"
  impactLevel: "high" | "medium" | "low"
  region: string
}

export function NewsCard({
  title,
  description,
  source,
  publishedAt,
  category,
  affectedStocks,
  sentiment,
  impactLevel,
  region,
}: NewsCardProps) {
  const categoryColors = {
    conflict: "bg-destructive/10 text-destructive border-destructive/20",
    trade: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    sanctions: "bg-accent/10 text-accent border-accent/20",
    diplomacy: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    economy: "bg-primary/10 text-primary border-primary/20"
  }
  
  const sentimentConfig = {
    positive: { icon: TrendingUp, color: "text-chart-2" },
    negative: { icon: TrendingDown, color: "text-destructive" },
    neutral: { icon: Minus, color: "text-muted-foreground" }
  }
  
  const SentimentIcon = sentimentConfig[sentiment].icon
  
  const impactColors = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-chart-4 text-primary-foreground",
    low: "bg-chart-2 text-primary-foreground"
  }

  const timeAgo = formatDistanceToNow(new Date(publishedAt), { addSuffix: true })

  return (
    <Card className="group hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
            sentimentConfig[sentiment].color,
            "bg-secondary"
          )}>
            <SentimentIcon className="w-4 h-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge 
                variant="outline" 
                className={cn("text-[10px] capitalize", categoryColors[category])}
              >
                {category}
              </Badge>
              <Badge className={cn("text-[10px]", impactColors[impactLevel])}>
                {impactLevel.toUpperCase()} IMPACT
              </Badge>
              <span className="text-xs text-muted-foreground">{region}</span>
            </div>
            
            <h3 className="font-medium text-foreground leading-tight mb-1.5 line-clamp-2">
              {title}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {description}
            </p>
            
            {affectedStocks.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                <span className="text-xs text-muted-foreground">Affected:</span>
                {affectedStocks.slice(0, 5).map((stock) => (
                  <Badge 
                    key={stock} 
                    variant="secondary" 
                    className="text-[10px] px-1.5 py-0 font-mono"
                  >
                    {stock}
                  </Badge>
                ))}
                {affectedStocks.length > 5 && (
                  <span className="text-xs text-muted-foreground">
                    +{affectedStocks.length - 5} more
                  </span>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{source}</span>
              <span className="flex items-center gap-1">
                {timeAgo}
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
