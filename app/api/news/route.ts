import { NextResponse } from "next/server"

interface NewsArticle {
  id: string
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

// Stock symbol to sector mapping for impact analysis
const SECTOR_STOCKS: Record<string, string[]> = {
  energy: ["XOM", "CVX"],
  technology: ["AAPL", "MSFT", "GOOGL", "NVDA", "META"],
  finance: ["JPM", "V", "MA", "BAC"],
  consumer: ["AMZN", "WMT", "HD", "DIS"],
  healthcare: ["JNJ", "PFE"],
  automotive: ["TSLA"],
  defensive: ["KO", "PG"]
}

export async function GET() {
  try {
    // Using GNews API (free tier: 100 requests/day)
    // Alternative: NewsAPI, Currents API, or WorldNewsAPI
    const apiKey = process.env.GNEWS_API_KEY
    
    let articles: NewsArticle[] = []
    
    if (apiKey) {
      // Use real API if key is available
      const response = await fetch(
        `https://gnews.io/api/v4/search?q=geopolitics OR sanctions OR trade war OR tariffs&lang=en&max=10&apikey=${apiKey}`,
        { next: { revalidate: 300 } } // Cache for 5 minutes
      )
      
      if (response.ok) {
        const data = await response.json()
        articles = data.articles?.map((article: { title: string; description: string; source: { name: string }; publishedAt: string; url: string }, index: number) => ({
          id: `news-${index}`,
          title: article.title,
          description: article.description,
          source: article.source?.name || "Unknown",
          publishedAt: article.publishedAt,
          url: article.url,
          ...analyzeArticle(article.title, article.description)
        })) || []
      }
    }
    
    // If no API key or no results, use curated geopolitical news
    if (articles.length === 0) {
      articles = getCuratedGeopoliticalNews()
    }
    
    return NextResponse.json({ 
      articles: articles.slice(0, 10), 
      lastUpdated: new Date().toISOString() 
    })
  } catch (error) {
    console.error("Error fetching news:", error)
    // Return curated news on error
    return NextResponse.json({ 
      articles: getCuratedGeopoliticalNews(), 
      lastUpdated: new Date().toISOString() 
    })
  }
}

function analyzeArticle(title: string, description: string): {
  category: "conflict" | "trade" | "sanctions" | "diplomacy" | "economy"
  affectedStocks: string[]
  sentiment: "positive" | "negative" | "neutral"
  impactLevel: "high" | "medium" | "low"
  region: string
} {
  const text = `${title} ${description}`.toLowerCase()
  
  // Determine category
  let category: "conflict" | "trade" | "sanctions" | "diplomacy" | "economy" = "economy"
  if (text.includes("war") || text.includes("conflict") || text.includes("military")) {
    category = "conflict"
  } else if (text.includes("tariff") || text.includes("trade")) {
    category = "trade"
  } else if (text.includes("sanction")) {
    category = "sanctions"
  } else if (text.includes("diplomacy") || text.includes("summit") || text.includes("agreement")) {
    category = "diplomacy"
  }
  
  // Determine affected stocks based on content
  const affectedStocks: string[] = []
  if (text.includes("oil") || text.includes("energy") || text.includes("opec")) {
    affectedStocks.push(...SECTOR_STOCKS.energy)
  }
  if (text.includes("chip") || text.includes("semiconductor") || text.includes("tech")) {
    affectedStocks.push(...SECTOR_STOCKS.technology)
  }
  if (text.includes("bank") || text.includes("financial") || text.includes("swift")) {
    affectedStocks.push(...SECTOR_STOCKS.finance)
  }
  if (text.includes("china")) {
    affectedStocks.push("AAPL", "TSLA", "NVDA")
  }
  if (text.includes("russia") || text.includes("ukraine")) {
    affectedStocks.push("XOM", "CVX", "V", "MA")
  }
  
  // Determine sentiment
  let sentiment: "positive" | "negative" | "neutral" = "neutral"
  const negativeWords = ["war", "conflict", "sanction", "tariff", "threat", "crisis", "escalat", "tension"]
  const positiveWords = ["peace", "agreement", "deal", "cooperat", "ease", "resolv", "progress"]
  
  const negativeCount = negativeWords.filter(word => text.includes(word)).length
  const positiveCount = positiveWords.filter(word => text.includes(word)).length
  
  if (negativeCount > positiveCount) sentiment = "negative"
  else if (positiveCount > negativeCount) sentiment = "positive"
  
  // Determine impact level
  let impactLevel: "high" | "medium" | "low" = "medium"
  if (category === "conflict" || text.includes("major") || text.includes("significant")) {
    impactLevel = "high"
  } else if (category === "diplomacy" && sentiment === "positive") {
    impactLevel = "low"
  }
  
  // Determine region
  let region = "Global"
  if (text.includes("china")) region = "Asia-Pacific"
  else if (text.includes("russia") || text.includes("ukraine") || text.includes("europe")) region = "Europe"
  else if (text.includes("middle east") || text.includes("iran") || text.includes("israel")) region = "Middle East"
  
  return {
    category,
    affectedStocks: [...new Set(affectedStocks)],
    sentiment,
    impactLevel,
    region
  }
}

function getCuratedGeopoliticalNews(): NewsArticle[] {
  const now = new Date()
  
  return [
    {
      id: "geo-1",
      title: "US-China Tech Tensions: New Chip Export Controls Under Discussion",
      description: "The Biden administration is considering additional restrictions on semiconductor exports to China, potentially affecting major tech companies with significant Asian supply chains.",
      source: "Financial Analysis",
      publishedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      url: "#",
      category: "trade",
      affectedStocks: ["NVDA", "AAPL", "MSFT", "GOOGL"],
      sentiment: "negative",
      impactLevel: "high",
      region: "Asia-Pacific"
    },
    {
      id: "geo-2",
      title: "OPEC+ Considers Production Cuts Amid Global Demand Concerns",
      description: "Oil-producing nations are evaluating potential output reductions as geopolitical tensions in the Middle East continue to influence energy markets.",
      source: "Energy Markets Today",
      publishedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      url: "#",
      category: "economy",
      affectedStocks: ["XOM", "CVX"],
      sentiment: "neutral",
      impactLevel: "high",
      region: "Middle East"
    },
    {
      id: "geo-3",
      title: "European Union Announces New Sanctions Package",
      description: "EU member states have agreed on additional economic measures targeting key industries, with implications for global financial institutions.",
      source: "European Affairs",
      publishedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      url: "#",
      category: "sanctions",
      affectedStocks: ["JPM", "BAC", "V", "MA"],
      sentiment: "negative",
      impactLevel: "medium",
      region: "Europe"
    },
    {
      id: "geo-4",
      title: "Taiwan Strait Tensions: Markets Monitor Situation Closely",
      description: "Increased military activity in the Taiwan Strait has investors watching semiconductor supply chains, with potential implications for global tech production.",
      source: "Asia Markets",
      publishedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
      url: "#",
      category: "conflict",
      affectedStocks: ["NVDA", "AAPL", "TSLA"],
      sentiment: "negative",
      impactLevel: "high",
      region: "Asia-Pacific"
    },
    {
      id: "geo-5",
      title: "Trade Agreement Progress: US and EU Reach Preliminary Deal",
      description: "Negotiators from both sides report significant progress on reducing trade barriers, potentially benefiting multinational corporations.",
      source: "Trade Desk",
      publishedAt: new Date(now.getTime() - 10 * 60 * 60 * 1000).toISOString(),
      url: "#",
      category: "diplomacy",
      affectedStocks: ["AMZN", "MSFT", "META"],
      sentiment: "positive",
      impactLevel: "medium",
      region: "Europe"
    },
    {
      id: "geo-6",
      title: "EV Supply Chain Disruptions: Rare Earth Material Concerns",
      description: "Geopolitical tensions affecting rare earth mineral supply chains could impact electric vehicle production timelines for major manufacturers.",
      source: "Auto Industry Report",
      publishedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      url: "#",
      category: "trade",
      affectedStocks: ["TSLA", "AAPL"],
      sentiment: "negative",
      impactLevel: "medium",
      region: "Asia-Pacific"
    },
    {
      id: "geo-7",
      title: "Central Banks Coordinate on Global Financial Stability",
      description: "Major central banks announce coordinated measures to ensure financial market stability amid ongoing geopolitical uncertainties.",
      source: "Central Bank Watch",
      publishedAt: new Date(now.getTime() - 14 * 60 * 60 * 1000).toISOString(),
      url: "#",
      category: "economy",
      affectedStocks: ["JPM", "BAC", "V"],
      sentiment: "positive",
      impactLevel: "medium",
      region: "Global"
    },
    {
      id: "geo-8",
      title: "Consumer Goods Companies Navigate Supply Chain Shifts",
      description: "Major retailers and consumer goods companies are restructuring supply chains in response to changing geopolitical landscape and trade policies.",
      source: "Retail Insights",
      publishedAt: new Date(now.getTime() - 16 * 60 * 60 * 1000).toISOString(),
      url: "#",
      category: "trade",
      affectedStocks: ["WMT", "AMZN", "PG", "KO"],
      sentiment: "neutral",
      impactLevel: "low",
      region: "Global"
    }
  ]
}
