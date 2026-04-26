import { NextResponse } from "next/server"
import type { CryptoData } from "@/lib/types"

// Geopolitical factors for major cryptocurrencies
const CRYPTO_GEOPOLITICS: Record<string, string[]> = {
  bitcoin: ["US Regulation", "China Mining Ban", "El Salvador Adoption", "Global Inflation Hedge"],
  ethereum: ["DeFi Regulation", "US SEC Scrutiny", "Energy Concerns"],
  tether: ["Stablecoin Regulation", "US Treasury Oversight", "Banking Relationships"],
  "usd-coin": ["US Regulation", "Circle/Coinbase Backing", "Banking Sector"],
  "binance-coin": ["SEC Lawsuit", "Exchange Regulation", "Global Crypto Policy"],
  "xrp": ["SEC Lawsuit", "Cross-border Payments", "Banking Partnerships"],
  cardano: ["Developing Nations Adoption", "Africa Focus"],
  solana: ["VC Backing", "FTX Association", "Network Stability"],
  dogecoin: ["Social Media Influence", "Retail Speculation"],
  polkadot: ["Web3 Infrastructure", "EU Regulation"],
  "shiba-inu": ["Retail Speculation", "Meme Economy"],
  "avalanche-2": ["DeFi Ecosystem", "Institutional Adoption"],
  litecoin: ["Payment Networks", "Mining Economics"],
  chainlink: ["Oracle Networks", "DeFi Infrastructure"],
  polygon: ["Ethereum Scaling", "Institutional Partnerships"],
  "bitcoin-cash": ["Payment Adoption", "Mining Economics"],
  stellar: ["Cross-border Payments", "CBDC Partnerships"],
  cosmos: ["Interoperability", "Blockchain Sovereignty"],
  monero: ["Privacy Regulation", "Exchange Delistings"],
  tron: ["Asia Markets", "Stablecoin Volume"]
}

export async function GET() {
  try {
    // Fetch CAD/USD exchange rate first
    let cadRate = 1.36 // Fallback rate
    try {
      const rateResponse = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD",
        { next: { revalidate: 3600 } }
      )
      if (rateResponse.ok) {
        const rateData = await rateResponse.json()
        cadRate = rateData.rates?.CAD || 1.36
      }
    } catch {
      // Use fallback rate
    }

    // CoinGecko API - Free, no key required
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?" +
      "vs_currency=usd" +
      "&order=market_cap_desc" +
      "&per_page=20" +
      "&page=1" +
      "&sparkline=false" +
      "&price_change_percentage=24h,7d",
      {
        headers: {
          "Accept": "application/json",
        },
        next: { revalidate: 60 } // Cache for 60 seconds
      }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()

    const cryptos: CryptoData[] = data.map((coin: {
      id: string
      symbol: string
      name: string
      image: string
      current_price: number
      market_cap: number
      market_cap_rank: number
      price_change_24h: number
      price_change_percentage_24h: number
      price_change_percentage_7d_in_currency?: number
      total_volume: number
      circulating_supply: number
      ath: number
      ath_change_percentage: number
    }) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      currentPrice: coin.current_price,
      priceCAD: Number((coin.current_price * cadRate).toFixed(2)),
      marketCap: coin.market_cap,
      marketCapRank: coin.market_cap_rank,
      priceChange24h: coin.price_change_24h,
      priceChangePercentage24h: Number((coin.price_change_percentage_24h || 0).toFixed(2)),
      priceChangePercentage7d: Number((coin.price_change_percentage_7d_in_currency || 0).toFixed(2)),
      totalVolume: coin.total_volume,
      circulatingSupply: coin.circulating_supply,
      ath: coin.ath,
      athChangePercentage: Number((coin.ath_change_percentage || 0).toFixed(2)),
      geopoliticalFactors: CRYPTO_GEOPOLITICS[coin.id] || ["Global Crypto Regulation"]
    }))

    return NextResponse.json({
      cryptos,
      cadRate,
      lastUpdated: new Date().toISOString(),
      total: cryptos.length
    })
  } catch (error) {
    console.error("Error fetching crypto data:", error)
    return NextResponse.json(
      { error: "Failed to fetch cryptocurrency data" },
      { status: 500 }
    )
  }
}
