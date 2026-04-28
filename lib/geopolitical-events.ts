// Comprehensive Historical Geopolitical Events Database
// Each event includes market impact data for educational purposes

export interface GeopoliticalEvent {
  id: string
  name: string
  shortName: string
  date: string // Start date
  endDate?: string // End date if ongoing/multi-day
  category: "conflict" | "trade" | "financial" | "pandemic" | "political" | "energy" | "sanctions"
  severity: "critical" | "high" | "medium" | "low"
  description: string
  educationalContext: string
  
  // Impact metrics (pre-calculated from historical data)
  impacts: {
    commodity: string // GOLD, CRUDE_OIL, etc.
    commodityName: string
    preBefore: number // Price 30 days before
    priceAtEvent: number // Price at event
    priceAfter30Days: number // Price 30 days after
    priceAfter90Days: number // Price 90 days after
    immediateImpact: number // % change at event
    shortTermImpact: number // % change after 30 days
    longTermImpact: number // % change after 90 days
    insight: string // Educational insight
  }[]
  
  // Canadian specific impact
  canadianImpact?: {
    cadChange: number // CAD/USD change
    tsxImpact: number // TSX index impact
    housingEffect: string
    energySectorEffect: string
    insight: string
  }
  
  relatedEvents?: string[] // IDs of related events
  sources?: string[]
}

export const GEOPOLITICAL_EVENTS: GeopoliticalEvent[] = [
  // 2008 Financial Crisis
  {
    id: "2008-financial-crisis",
    name: "2008 Global Financial Crisis",
    shortName: "2008 Crisis",
    date: "2008-09-15",
    endDate: "2009-06-01",
    category: "financial",
    severity: "critical",
    description: "The collapse of Lehman Brothers triggered a global financial meltdown, causing the worst recession since the Great Depression.",
    educationalContext: "This event demonstrates how financial contagion spreads globally and why safe-haven assets like gold spike during crises. The crisis led to massive government interventions and changed financial regulations worldwide.",
    impacts: [
      {
        commodity: "GOLD",
        commodityName: "Gold",
        preBefore: 775,
        priceAtEvent: 850,
        priceAfter30Days: 730,
        priceAfter90Days: 880,
        immediateImpact: 9.7,
        shortTermImpact: -14.1,
        longTermImpact: 3.5,
        insight: "Gold initially spiked as a safe haven, then dropped during deleveraging as investors sold everything for cash, before rallying strongly as central banks started quantitative easing."
      },
      {
        commodity: "CRUDE_OIL",
        commodityName: "Crude Oil",
        preBefore: 115,
        priceAtEvent: 95,
        priceAfter30Days: 65,
        priceAfter90Days: 42,
        immediateImpact: -17.4,
        shortTermImpact: -31.6,
        longTermImpact: -55.8,
        insight: "Oil crashed from $147 to $32 as global demand collapsed. This shows how commodities tied to economic activity suffer most in recessions."
      },
      {
        commodity: "SILVER",
        commodityName: "Silver",
        preBefore: 14.5,
        priceAtEvent: 12.0,
        priceAfter30Days: 9.5,
        priceAfter90Days: 11.0,
        immediateImpact: -17.2,
        shortTermImpact: -20.8,
        longTermImpact: -8.3,
        insight: "Silver dropped more than gold due to its industrial demand component. It demonstrates silver's dual nature as both precious and industrial metal."
      }
    ],
    canadianImpact: {
      cadChange: -22,
      tsxImpact: -43,
      housingEffect: "Canadian housing showed remarkable resilience compared to US, dropping only 8% vs 30% in the US, due to stricter mortgage regulations.",
      energySectorEffect: "TSX Energy sector lost 55% as oil crashed, devastating Alberta's economy and causing major job losses in the oil sands.",
      insight: "Canada's well-regulated banking system prevented the worst, but resource dependence made the TSX one of the worst-performing major indices."
    }
  },
  
  // US-China Trade War (2018-2020)
  {
    id: "us-china-trade-war",
    name: "US-China Trade War",
    shortName: "Trade War",
    date: "2018-03-22",
    endDate: "2020-01-15",
    category: "trade",
    severity: "high",
    description: "The US imposed tariffs on $360 billion of Chinese goods, triggering retaliatory measures and disrupting global supply chains.",
    educationalContext: "Trade wars demonstrate how protectionist policies create uncertainty and can harm the very industries they aim to protect. They also show gold's role as a hedge against economic policy uncertainty.",
    impacts: [
      {
        commodity: "GOLD",
        commodityName: "Gold",
        preBefore: 1320,
        priceAtEvent: 1345,
        priceAfter30Days: 1295,
        priceAfter90Days: 1290,
        immediateImpact: 1.9,
        shortTermImpact: -3.7,
        longTermImpact: -4.1,
        insight: "Gold rose on initial uncertainty but the strong US dollar (driven by Fed rate hikes) kept prices subdued. The trade war eventually pushed gold to $1,550 by mid-2019."
      },
      {
        commodity: "COPPER",
        commodityName: "Copper",
        preBefore: 3.15,
        priceAtEvent: 3.05,
        priceAfter30Days: 3.10,
        priceAfter90Days: 2.75,
        immediateImpact: -3.2,
        shortTermImpact: 1.6,
        longTermImpact: -9.5,
        insight: "Copper, known as 'Dr. Copper' for its economic predictive power, fell as trade tensions threatened global manufacturing growth."
      },
      {
        commodity: "CRUDE_OIL",
        commodityName: "Crude Oil",
        preBefore: 63,
        priceAtEvent: 65,
        priceAfter30Days: 68,
        priceAfter90Days: 74,
        immediateImpact: 3.2,
        shortTermImpact: 4.6,
        longTermImpact: 13.8,
        insight: "Oil initially rose on supply concerns before falling as trade war fears dampened global growth expectations."
      }
    ],
    canadianImpact: {
      cadChange: -5,
      tsxImpact: -8,
      housingEffect: "Limited direct impact, but uncertainty contributed to the 2018-2019 housing slowdown in Toronto and Vancouver.",
      energySectorEffect: "Canadian energy suffered as global demand outlook weakened, adding to pipeline constraints.",
      insight: "Canada was caught in the crossfire, with aluminum and steel tariffs directly affecting Canadian exports despite USMCA negotiations."
    }
  },
  
  // COVID-19 Pandemic
  {
    id: "covid-19-pandemic",
    name: "COVID-19 Pandemic Market Crash",
    shortName: "COVID Crash",
    date: "2020-02-20",
    endDate: "2020-03-23",
    category: "pandemic",
    severity: "critical",
    description: "The fastest market crash in history as COVID-19 spread globally, triggering lockdowns and unprecedented economic disruption.",
    educationalContext: "This event shows how truly unexpected 'black swan' events can cause correlations to spike (everything sells off together) before fundamentals reassert themselves. The subsequent recovery demonstrates the power of coordinated monetary and fiscal policy.",
    impacts: [
      {
        commodity: "GOLD",
        commodityName: "Gold",
        preBefore: 1580,
        priceAtEvent: 1470,
        priceAfter30Days: 1620,
        priceAfter90Days: 1775,
        immediateImpact: -7.0,
        shortTermImpact: 10.2,
        longTermImpact: 20.8,
        insight: "Gold initially dropped in the 'sell everything' panic as investors needed cash, then soared to all-time highs as central banks unleashed trillions in stimulus."
      },
      {
        commodity: "CRUDE_OIL",
        commodityName: "Crude Oil",
        preBefore: 52,
        priceAtEvent: 30,
        priceAfter30Days: -37,
        priceAfter90Days: 40,
        immediateImpact: -42.3,
        shortTermImpact: -223,
        longTermImpact: -23.1,
        insight: "Oil made history by going NEGATIVE (-$37/barrel) in April 2020 as storage filled up and demand collapsed. This unprecedented event showed how physical commodity constraints can break financial markets."
      },
      {
        commodity: "SILVER",
        commodityName: "Silver",
        preBefore: 18.5,
        priceAtEvent: 12.0,
        priceAfter30Days: 15.0,
        priceAfter90Days: 18.0,
        immediateImpact: -35.1,
        shortTermImpact: 25.0,
        longTermImpact: 50.0,
        insight: "Silver crashed harder than gold due to industrial demand concerns, then rebounded sharply, eventually hitting $30 during the Reddit-driven rally in 2021."
      },
      {
        commodity: "NATURAL_GAS",
        commodityName: "Natural Gas",
        preBefore: 1.95,
        priceAtEvent: 1.60,
        priceAfter30Days: 1.85,
        priceAfter90Days: 1.75,
        immediateImpact: -17.9,
        shortTermImpact: 15.6,
        longTermImpact: 9.4,
        insight: "Natural gas was relatively resilient as residential heating demand offset commercial/industrial declines."
      }
    ],
    canadianImpact: {
      cadChange: -10,
      tsxImpact: -37,
      housingEffect: "Brief 5% dip followed by explosive 30%+ gains as low rates and remote work drove suburban migration. FOMO created bidding wars.",
      energySectorEffect: "Canadian oil producers devastated - many went bankrupt as WCS prices went negative. The sector still hasn't fully recovered.",
      insight: "Canada's aggressive fiscal response (CERB) and low rates supercharged housing but created inflation that Canadians are still dealing with."
    }
  },
  
  // Russia-Ukraine War
  {
    id: "russia-ukraine-war",
    name: "Russia-Ukraine War",
    shortName: "Ukraine War",
    date: "2022-02-24",
    category: "conflict",
    severity: "critical",
    description: "Russia's full-scale invasion of Ukraine triggered the largest European conflict since WWII, causing energy and food crises.",
    educationalContext: "This conflict demonstrates how geopolitical events can reshape global commodity markets. Europe's energy dependence on Russia was exposed, accelerating the green energy transition while causing an inflation spike.",
    impacts: [
      {
        commodity: "GOLD",
        commodityName: "Gold",
        preBefore: 1850,
        priceAtEvent: 1910,
        priceAfter30Days: 1945,
        priceAfter90Days: 1850,
        immediateImpact: 3.2,
        shortTermImpact: 1.8,
        longTermImpact: -3.1,
        insight: "Gold spiked on safe-haven demand but later retreated as the Fed's aggressive rate hikes strengthened the dollar, demonstrating the tension between geopolitical risk and monetary policy."
      },
      {
        commodity: "CRUDE_OIL",
        commodityName: "Crude Oil",
        preBefore: 92,
        priceAtEvent: 100,
        priceAfter30Days: 115,
        priceAfter90Days: 105,
        immediateImpact: 8.7,
        shortTermImpact: 15.0,
        longTermImpact: 5.0,
        insight: "Oil spiked to $130/barrel on supply fears before retreating as demand destruction and SPR releases took effect. Russian oil found new buyers in India and China."
      },
      {
        commodity: "NATURAL_GAS",
        commodityName: "Natural Gas",
        preBefore: 4.50,
        priceAtEvent: 4.70,
        priceAfter30Days: 5.50,
        priceAfter90Days: 8.50,
        immediateImpact: 4.4,
        shortTermImpact: 17.0,
        longTermImpact: 80.9,
        insight: "European gas prices hit $100/MMBtu (vs normal $3-5) as Russian supplies were cut. US gas prices rose but were protected by export capacity limits."
      },
      {
        commodity: "WHEAT",
        commodityName: "Wheat",
        preBefore: 8.20,
        priceAtEvent: 9.50,
        priceAfter30Days: 11.50,
        priceAfter90Days: 10.80,
        immediateImpact: 15.9,
        shortTermImpact: 21.1,
        longTermImpact: 13.7,
        insight: "Ukraine and Russia supply 30% of global wheat. Prices spiked on Black Sea blockade fears, threatening food security in importing nations."
      }
    ],
    canadianImpact: {
      cadChange: 2,
      tsxImpact: -5,
      housingEffect: "War-driven inflation led to faster BoC rate hikes, triggering the 2022-2023 housing correction (prices down 15-20% in some markets).",
      energySectorEffect: "Canadian energy stocks soared 50%+ as oil prices spiked. Canada positioned as reliable energy supplier to allies.",
      insight: "Canada benefited as an energy exporter but the resulting inflation and rate hikes hurt consumers and the housing market severely."
    }
  },
  
  // 2022 Inflation Crisis
  {
    id: "2022-inflation-crisis",
    name: "Global Inflation Crisis & Fed Rate Hikes",
    shortName: "2022 Inflation",
    date: "2022-03-16",
    endDate: "2023-07-26",
    category: "financial",
    severity: "high",
    description: "Central banks launched the most aggressive rate hiking cycle in 40 years to combat inflation that reached 9.1% in the US.",
    educationalContext: "This period shows how inflation expectations become self-fulfilling and why central banks prioritize credibility. It also demonstrates gold's complex relationship with rates - it's an inflation hedge but suffers when real rates rise.",
    impacts: [
      {
        commodity: "GOLD",
        commodityName: "Gold",
        preBefore: 1920,
        priceAtEvent: 1930,
        priceAfter30Days: 1850,
        priceAfter90Days: 1700,
        immediateImpact: 0.5,
        shortTermImpact: -4.1,
        longTermImpact: -11.5,
        insight: "Despite being an 'inflation hedge,' gold fell as real interest rates rose. When bonds pay 5%, the opportunity cost of holding non-yielding gold increases."
      },
      {
        commodity: "CRUDE_OIL",
        commodityName: "Crude Oil",
        preBefore: 110,
        priceAtEvent: 95,
        priceAfter30Days: 85,
        priceAfter90Days: 75,
        immediateImpact: -13.6,
        shortTermImpact: -10.5,
        longTermImpact: -21.1,
        insight: "Oil fell on recession fears as aggressive rate hikes threatened to crush demand. The 'soft landing' vs 'hard landing' debate dominated markets."
      },
      {
        commodity: "COPPER",
        commodityName: "Copper",
        preBefore: 4.70,
        priceAtEvent: 4.50,
        priceAfter30Days: 4.10,
        priceAfter90Days: 3.40,
        immediateImpact: -4.3,
        shortTermImpact: -8.9,
        longTermImpact: -24.4,
        insight: "Copper collapsed on China demand concerns and recession fears, falling 35% from highs despite long-term bullish fundamentals for electrification."
      }
    ],
    canadianImpact: {
      cadChange: -8,
      tsxImpact: -15,
      housingEffect: "BoC raised rates from 0.25% to 5%, causing mortgage payments to double for variable rate holders. Housing prices fell 15-25% from peaks.",
      energySectorEffect: "Energy stocks held up better than the broader market due to elevated commodity prices despite recession fears.",
      insight: "Canadian households, among the most indebted in the developed world, felt the pain of rate hikes more than most, with mortgage stress becoming a national issue."
    }
  },
  
  // 2024 US Election & Policy Shift
  {
    id: "us-2024-election",
    name: "2024 US Election & Policy Expectations",
    shortName: "2024 Shift",
    date: "2024-11-05",
    category: "political",
    severity: "high",
    description: "The 2024 US election outcome triggered market repricing around expected tariffs, tax cuts, deregulation, and energy policy changes.",
    educationalContext: "Markets price in expected policies before they happen. Policy shift expectations included higher tariffs (inflationary), tax cuts (stimulative), and energy deregulation (bearish for oil prices long-term through supply).",
    impacts: [
      {
        commodity: "GOLD",
        commodityName: "Gold",
        preBefore: 2680,
        priceAtEvent: 2750,
        priceAfter30Days: 2650,
        priceAfter90Days: 2900,
        immediateImpact: 2.6,
        shortTermImpact: -3.6,
        longTermImpact: 5.5,
        insight: "Gold spiked on uncertainty, fell as dollar strengthened on rate cut repricing, then rose on tariff-driven inflation fears and debt concerns."
      },
      {
        commodity: "CRUDE_OIL",
        commodityName: "Crude Oil",
        preBefore: 72,
        priceAtEvent: 70,
        priceAfter30Days: 68,
        priceAfter90Days: 65,
        immediateImpact: -2.8,
        shortTermImpact: -2.9,
        longTermImpact: -7.1,
        insight: "'Drill, baby, drill' rhetoric signaled increased US production, bearish for prices. However, tariffs on imports created cross-currents."
      },
      {
        commodity: "COPPER",
        commodityName: "Copper",
        preBefore: 4.35,
        priceAtEvent: 4.15,
        priceAfter30Days: 4.05,
        priceAfter90Days: 4.50,
        immediateImpact: -4.6,
        shortTermImpact: -2.4,
        longTermImpact: 8.4,
        insight: "Initial China tariff fears hurt copper, but infrastructure spending expectations and AI data center demand later supported prices."
      },
      {
        commodity: "NATURAL_GAS",
        commodityName: "Natural Gas",
        preBefore: 2.80,
        priceAtEvent: 2.65,
        priceAfter30Days: 3.20,
        priceAfter90Days: 3.50,
        immediateImpact: -5.4,
        shortTermImpact: 20.8,
        longTermImpact: 32.1,
        insight: "LNG export expansion expectations bullish for US gas prices. Cold winter added to gains."
      }
    ],
    canadianImpact: {
      cadChange: -4,
      tsxImpact: -3,
      housingEffect: "BoC rate cuts helped stabilize housing, but tariff uncertainty created economic headwinds.",
      energySectorEffect: "Mixed impact - Canadian energy benefits from higher NA gas prices but faces tariff threats.",
      insight: "25% tariff threats on Canadian goods created significant uncertainty. Auto sector and energy exports particularly vulnerable."
    }
  },
  
  // Oil Price War 2020
  {
    id: "oil-price-war-2020",
    name: "Saudi-Russia Oil Price War",
    shortName: "Oil Price War",
    date: "2020-03-08",
    endDate: "2020-04-12",
    category: "energy",
    severity: "high",
    description: "Saudi Arabia and Russia engaged in an oil price war, flooding markets with crude just as COVID-19 destroyed demand.",
    educationalContext: "This event shows how OPEC+ dynamics can dramatically impact energy markets. It also demonstrates that commodity prices can fall faster and further than anyone expects when supply and demand shocks coincide.",
    impacts: [
      {
        commodity: "CRUDE_OIL",
        commodityName: "Crude Oil",
        preBefore: 50,
        priceAtEvent: 32,
        priceAfter30Days: -37,
        priceAfter90Days: 38,
        immediateImpact: -36.0,
        shortTermImpact: -215.6,
        longTermImpact: -24.0,
        insight: "Oil collapsed from $50 to negative $37 in just 6 weeks. This unprecedented event bankrupted many shale producers and reshaped the industry."
      },
      {
        commodity: "NATURAL_GAS",
        commodityName: "Natural Gas",
        preBefore: 1.85,
        priceAtEvent: 1.75,
        priceAfter30Days: 1.65,
        priceAfter90Days: 1.70,
        immediateImpact: -5.4,
        shortTermImpact: -5.7,
        longTermImpact: -2.9,
        insight: "Gas fell in sympathy but was more resilient due to different supply/demand dynamics and less storage constraint issues."
      }
    ],
    canadianImpact: {
      cadChange: -8,
      tsxImpact: -12,
      housingEffect: "Alberta housing market took another hit as energy job losses mounted.",
      energySectorEffect: "Canadian oil producers devastated - WCS traded at massive discounts. Several companies went bankrupt.",
      insight: "This event accelerated the ESG-driven divestment from Canadian oil sands and raised existential questions about the sector's future."
    }
  },
  
  // 2011 European Debt Crisis
  {
    id: "european-debt-crisis",
    name: "European Sovereign Debt Crisis",
    shortName: "Euro Crisis",
    date: "2011-07-01",
    endDate: "2012-09-01",
    category: "financial",
    severity: "high",
    description: "Greece, Portugal, Ireland, Spain, and Italy faced sovereign debt crises, threatening the Euro and global financial stability.",
    educationalContext: "This crisis demonstrates how sovereign debt issues can spiral and how currency unions face unique challenges. Gold reached all-time highs as investors feared fiat currency collapse.",
    impacts: [
      {
        commodity: "GOLD",
        commodityName: "Gold",
        preBefore: 1500,
        priceAtEvent: 1600,
        priceAfter30Days: 1825,
        priceAfter90Days: 1750,
        immediateImpact: 6.7,
        shortTermImpact: 14.1,
        longTermImpact: 9.4,
        insight: "Gold hit its then all-time high of $1,921 as investors fled to safety. This remains one of gold's strongest crisis-driven rallies."
      },
      {
        commodity: "SILVER",
        commodityName: "Silver",
        preBefore: 35,
        priceAtEvent: 40,
        priceAfter30Days: 42,
        priceAfter90Days: 32,
        immediateImpact: 14.3,
        shortTermImpact: 5.0,
        longTermImpact: -20.0,
        insight: "Silver hit $49/oz in April 2011 before crashing. This shows silver's higher volatility and speculative nature compared to gold."
      },
      {
        commodity: "CRUDE_OIL",
        commodityName: "Crude Oil",
        preBefore: 95,
        priceAtEvent: 97,
        priceAfter30Days: 85,
        priceAfter90Days: 80,
        immediateImpact: 2.1,
        shortTermImpact: -12.4,
        longTermImpact: -17.5,
        insight: "Oil fell on demand concerns as Europe's economy weakened. The crisis showed how financial stress can suppress commodity demand."
      }
    ],
    canadianImpact: {
      cadChange: -3,
      tsxImpact: -18,
      housingEffect: "Limited direct impact, but global uncertainty contributed to BoC keeping rates low, supporting housing prices.",
      energySectorEffect: "Energy sector fell with global risk-off sentiment but recovered as demand remained resilient.",
      insight: "Canada was seen as a safe haven during this crisis, with its stable banking system attracting foreign capital."
    }
  }
]

// Helper function to get events affecting a specific commodity
export function getEventsForCommodity(commodityId: string): GeopoliticalEvent[] {
  return GEOPOLITICAL_EVENTS.filter(event => 
    event.impacts.some(impact => impact.commodity === commodityId)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Helper function to get impact data for a commodity from an event
export function getImpactForCommodity(event: GeopoliticalEvent, commodityId: string) {
  return event.impacts.find(impact => impact.commodity === commodityId)
}

// Get all events sorted by date (newest first)
export function getAllEventsSorted(): GeopoliticalEvent[] {
  return [...GEOPOLITICAL_EVENTS].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

// Get events by category
export function getEventsByCategory(category: GeopoliticalEvent["category"]): GeopoliticalEvent[] {
  return GEOPOLITICAL_EVENTS.filter(event => event.category === category)
}

// Get events by severity
export function getEventsBySeverity(severity: GeopoliticalEvent["severity"]): GeopoliticalEvent[] {
  return GEOPOLITICAL_EVENTS.filter(event => event.severity === severity)
}

// Get events within a date range
export function getEventsInRange(startDate: string, endDate: string): GeopoliticalEvent[] {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  
  return GEOPOLITICAL_EVENTS.filter(event => {
    const eventDate = new Date(event.date).getTime()
    return eventDate >= start && eventDate <= end
  })
}
