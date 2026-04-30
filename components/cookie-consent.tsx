"use client"

import { useState, useEffect } from "react"
import { X, Cookie } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("forewire-cookie-consent")
    if (!consent) {
      // Small delay to avoid flash on page load
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem("forewire-cookie-consent", "all")
    setIsVisible(false)
  }

  const acceptEssential = () => {
    localStorage.setItem("forewire-cookie-consent", "essential")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-lg border border-border bg-card/95 backdrop-blur-md shadow-lg">
          <div className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                <Cookie className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Cookie Preferences
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                      You can choose to accept all cookies or only essential ones required for the site to function.
                    </p>
                  </div>
                  <button
                    onClick={acceptEssential}
                    className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={acceptAll}
                    size="sm"
                    className="h-8"
                  >
                    Accept All
                  </Button>
                  <Button
                    onClick={acceptEssential}
                    variant="outline"
                    size="sm"
                    className="h-8"
                  >
                    Essential Only
                  </Button>
                  <Link
                    href="/privacy#cookies"
                    className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
