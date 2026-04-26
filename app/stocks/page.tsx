import type { Metadata } from "next"
import { StocksDashboard } from "@/components/stocks/stocks-dashboard"

export const metadata: Metadata = {
  title: "Geopolitical Stock Tracker | Nitin's space",
  description: "Track top 20 stocks with real-time geopolitical impact analysis. Monitor how global events affect your investments.",
}

export default function StocksPage() {
  return <StocksDashboard />
}
