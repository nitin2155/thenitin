"use client"

import { useRef, useState } from "react"
import { 
  Share2, 
  Download, 
  Copy, 
  Check, 
  Twitter, 
  Linkedin,
  TrendingUp,
  TrendingDown,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ShareableCardProps {
  type: "stock" | "crypto" | "economy" | "insight"
  title: string
  value: string
  change?: number
  subtitle?: string
  details?: Array<{ label: string; value: string }>
  timestamp?: Date
}

export function ShareableCard({
  type,
  title,
  value,
  change,
  subtitle,
  details,
  timestamp = new Date()
}: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0
  
  const shareText = `${title}: ${value}${change !== undefined ? ` (${isPositive ? "+" : ""}${change.toFixed(2)}%)` : ""} - via TheNitin.space`
  
  const handleCopyLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    await navigator.clipboard.writeText(`${shareText}\n${url}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const handleShareTwitter = () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`
    window.open(tweetUrl, "_blank", "noopener,noreferrer")
  }
  
  const handleShareLinkedIn = () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    window.open(linkedInUrl, "_blank", "noopener,noreferrer")
  }

  const handleDownload = async () => {
    // For now, copy to clipboard as image download requires canvas libraries
    await handleCopyLink()
  }

  const typeColors = {
    stock: "from-chart-1/20 to-chart-3/20 border-chart-1/30",
    crypto: "from-accent/20 to-chart-4/20 border-accent/30",
    economy: "from-primary/20 to-chart-5/20 border-primary/30",
    insight: "from-chart-4/20 to-accent/20 border-chart-4/30"
  }

  return (
    <div className="relative group">
      {/* The Card */}
      <div 
        ref={cardRef}
        className={cn(
          "relative overflow-hidden rounded-xl border p-6 bg-gradient-to-br",
          typeColors[type]
        )}
      >
        {/* Watermark */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-background/80 backdrop-blur text-xs">
          <Zap className="h-3 w-3 text-primary" />
          <span className="font-medium text-muted-foreground">TheNitin</span>
        </div>
        
        {/* Content */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{subtitle || type.toUpperCase()}</p>
            <h3 className="text-2xl font-bold text-foreground">{title}</h3>
          </div>
          
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold font-mono text-foreground">
              {value}
            </span>
            {change !== undefined && (
              <span className={cn(
                "flex items-center gap-1 text-lg font-semibold",
                isPositive && "text-chart-1",
                isNegative && "text-chart-2",
                !isPositive && !isNegative && "text-muted-foreground"
              )}>
                {isPositive ? <TrendingUp className="h-5 w-5" /> : isNegative ? <TrendingDown className="h-5 w-5" /> : null}
                {isPositive && "+"}
                {change.toFixed(2)}%
              </span>
            )}
          </div>
          
          {details && details.length > 0 && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
              {details.map((detail, i) => (
                <div key={i}>
                  <p className="text-xs text-muted-foreground">{detail.label}</p>
                  <p className="font-medium text-foreground">{detail.value}</p>
                </div>
              ))}
            </div>
          )}
          
          <p className="text-xs text-muted-foreground pt-2">
            {timestamp.toLocaleDateString("en-CA", { 
              year: "numeric",
              month: "short", 
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })} EST
          </p>
        </div>
      </div>

      {/* Share Button */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="shadow-lg gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem onClick={handleCopyLink}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied!" : "Copy Link"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareTwitter}>
              <Twitter className="h-4 w-4 mr-2" />
              Share on X
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareLinkedIn}>
              <Linkedin className="h-4 w-4 mr-2" />
              Share on LinkedIn
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Save as Image
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// Quick share button for inline use
export function ShareButton({ 
  text, 
  compact = false 
}: { 
  text: string
  compact?: boolean 
}) {
  const [copied, setCopied] = useState(false)
  
  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "TheNitin - Financial Intelligence",
          text: text,
          url: url
        })
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (compact) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        onClick={handleShare}
      >
        {copied ? <Check className="h-4 w-4 text-chart-1" /> : <Share2 className="h-4 w-4" />}
      </Button>
    )
  }

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleShare}
      className="gap-2"
    >
      {copied ? <Check className="h-4 w-4 text-chart-1" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Copied!" : "Share"}
    </Button>
  )
}

// Preset cards for common insights
export function StockInsightCard({ 
  symbol, 
  name, 
  price, 
  change, 
  volume, 
  marketCap 
}: {
  symbol: string
  name: string
  price: number
  change: number
  volume: string
  marketCap: string
}) {
  return (
    <ShareableCard
      type="stock"
      title={symbol}
      subtitle={name}
      value={`$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
      change={change}
      details={[
        { label: "Volume", value: volume },
        { label: "Market Cap", value: marketCap }
      ]}
    />
  )
}

export function CryptoInsightCard({
  symbol,
  name,
  priceCAD,
  change24h,
  marketCap,
  volume24h
}: {
  symbol: string
  name: string
  priceCAD: number
  change24h: number
  marketCap: string
  volume24h: string
}) {
  return (
    <ShareableCard
      type="crypto"
      title={symbol.toUpperCase()}
      subtitle={name}
      value={`$${priceCAD.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD`}
      change={change24h}
      details={[
        { label: "24h Volume", value: volume24h },
        { label: "Market Cap", value: marketCap }
      ]}
    />
  )
}

export function EconomyInsightCard({
  indicator,
  value,
  previousValue,
  trend
}: {
  indicator: string
  value: string
  previousValue?: string
  trend?: "up" | "down" | "stable"
}) {
  const changePercent = previousValue && trend !== "stable"
    ? trend === "up" ? 0.5 : -0.5
    : undefined

  return (
    <ShareableCard
      type="economy"
      title={indicator}
      subtitle="Bank of Canada"
      value={value}
      change={changePercent}
      details={previousValue ? [
        { label: "Previous", value: previousValue },
        { label: "Trend", value: trend === "up" ? "Increasing" : trend === "down" ? "Decreasing" : "Stable" }
      ] : undefined}
    />
  )
}
