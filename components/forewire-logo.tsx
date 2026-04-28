"use client"

import { cn } from "@/lib/utils"

interface ForewireLogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl" | "watermark"
  variant?: "full" | "icon" | "watermark"
  animated?: boolean
}

export function ForewireLogo({
  className,
  size = "md",
  variant = "full",
  animated = false,
}: ForewireLogoProps) {
  const sizes = {
    sm: { width: 32, height: 32, stroke: 2 },
    md: { width: 48, height: 48, stroke: 2.5 },
    lg: { width: 64, height: 64, stroke: 3 },
    xl: { width: 96, height: 96, stroke: 3.5 },
    watermark: { width: 400, height: 400, stroke: 1 },
  }

  const { width, height, stroke } = sizes[size]

  if (variant === "watermark") {
    return (
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("text-primary", className)}
        style={{ width, height }}
      >
        {/* Outer circuit ring */}
        <circle
          cx="200"
          cy="200"
          r="180"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="4 8"
          opacity="0.15"
          className={animated ? "animate-spin-slow" : ""}
          style={{ animationDuration: "60s" }}
        />
        
        {/* Inner circuit ring */}
        <circle
          cx="200"
          cy="200"
          r="140"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="2 6"
          opacity="0.1"
          className={animated ? "animate-spin-reverse" : ""}
          style={{ animationDuration: "45s" }}
        />

        {/* Signal wave lines - representing forward signals */}
        <g opacity="0.08">
          {/* Wave 1 */}
          <path
            d="M 60 200 Q 100 160 140 200 Q 180 240 220 200 Q 260 160 300 200 Q 340 240 340 200"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Wave 2 - offset */}
          <path
            d="M 60 180 Q 100 140 140 180 Q 180 220 220 180 Q 260 140 300 180 Q 340 220 340 180"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Wave 3 - offset */}
          <path
            d="M 60 220 Q 100 180 140 220 Q 180 260 220 220 Q 260 180 300 220 Q 340 260 340 220"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>

        {/* Analytics bars - stylized */}
        <g opacity="0.06" transform="translate(120, 240)">
          <rect x="0" y="60" width="20" height="40" fill="currentColor" rx="2" />
          <rect x="30" y="40" width="20" height="60" fill="currentColor" rx="2" />
          <rect x="60" y="20" width="20" height="80" fill="currentColor" rx="2" />
          <rect x="90" y="0" width="20" height="100" fill="currentColor" rx="2" />
          <rect x="120" y="30" width="20" height="70" fill="currentColor" rx="2" />
        </g>

        {/* Central icon - Lightning bolt with wire */}
        <g transform="translate(170, 150)">
          {/* Wire path */}
          <path
            d="M 0 50 L 20 50 L 30 30 L 40 70 L 50 50 L 60 50"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.12"
          />
          
          {/* Lightning bolt */}
          <path
            d="M 35 0 L 20 45 L 35 45 L 25 100 L 50 40 L 35 40 L 45 0 Z"
            fill="currentColor"
            opacity="0.08"
          />
        </g>

        {/* Connection nodes */}
        <g opacity="0.1">
          <circle cx="80" cy="200" r="4" fill="currentColor" />
          <circle cx="320" cy="200" r="4" fill="currentColor" />
          <circle cx="200" cy="80" r="4" fill="currentColor" />
          <circle cx="200" cy="320" r="4" fill="currentColor" />
          <circle cx="120" cy="120" r="3" fill="currentColor" />
          <circle cx="280" cy="120" r="3" fill="currentColor" />
          <circle cx="120" cy="280" r="3" fill="currentColor" />
          <circle cx="280" cy="280" r="3" fill="currentColor" />
        </g>

        {/* Wire connections between nodes */}
        <g stroke="currentColor" strokeWidth="0.5" opacity="0.06">
          <line x1="80" y1="200" x2="120" y2="120" />
          <line x1="80" y1="200" x2="120" y2="280" />
          <line x1="320" y1="200" x2="280" y2="120" />
          <line x1="320" y1="200" x2="280" y2="280" />
          <line x1="200" y1="80" x2="120" y2="120" />
          <line x1="200" y1="80" x2="280" y2="120" />
          <line x1="200" y1="320" x2="120" y2="280" />
          <line x1="200" y1="320" x2="280" y2="280" />
        </g>

        {/* FOREWIRE text at bottom */}
        <text
          x="200"
          y="365"
          textAnchor="middle"
          fill="currentColor"
          fontSize="24"
          fontWeight="600"
          letterSpacing="8"
          opacity="0.06"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          FOREWIRE
        </text>
      </svg>
    )
  }

  // Icon variant - just the symbol
  if (variant === "icon") {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("text-primary", className)}
        style={{ width, height }}
      >
        {/* Signal wave background */}
        <path
          d="M 8 24 Q 14 16 20 24 Q 26 32 32 24 Q 38 16 40 24"
          stroke="currentColor"
          strokeWidth={stroke * 0.6}
          fill="none"
          strokeLinecap="round"
          opacity="0.3"
        />
        
        {/* Lightning bolt */}
        <path
          d="M 26 8 L 18 23 L 24 23 L 20 40 L 32 20 L 26 20 L 30 8 Z"
          fill="currentColor"
          className={animated ? "animate-pulse" : ""}
        />
        
        {/* Wire connector dots */}
        <circle cx="8" cy="24" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="40" cy="24" r="2" fill="currentColor" opacity="0.5" />
      </svg>
    )
  }

  // Full variant - icon with text
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ForewireLogo size={size} variant="icon" animated={animated} />
      <span className="font-bold text-xl tracking-tight">
        <span className="text-foreground">Fore</span>
        <span className="text-primary">wire</span>
      </span>
    </div>
  )
}

// Watermark background component
export function ForewireWatermark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none overflow-hidden z-0",
        className
      )}
    >
      {/* Center watermark - more visible on light backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60">
        <ForewireLogo variant="watermark" size="watermark" animated />
      </div>
      
      {/* Additional subtle pattern elements */}
      <div className="absolute top-[10%] right-[5%] opacity-10">
        <ForewireLogo variant="icon" size="xl" />
      </div>
      <div className="absolute bottom-[15%] left-[8%] opacity-8">
        <ForewireLogo variant="icon" size="lg" />
      </div>
    </div>
  )
}
