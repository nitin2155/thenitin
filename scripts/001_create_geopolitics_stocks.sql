-- Geopolitical events table
CREATE TABLE IF NOT EXISTS geopolitical_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  region TEXT NOT NULL,
  impact_level TEXT CHECK (impact_level IN ('low', 'medium', 'high', 'critical')),
  category TEXT CHECK (category IN ('conflict', 'trade', 'election', 'policy', 'sanctions', 'alliance')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stocks table
CREATE TABLE IF NOT EXISTS stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  country TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stock prices (historical data)
CREATE TABLE IF NOT EXISTS stock_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id UUID REFERENCES stocks(id) ON DELETE CASCADE,
  price DECIMAL(12, 2) NOT NULL,
  volume BIGINT,
  price_date DATE NOT NULL,
  open_price DECIMAL(12, 2),
  high_price DECIMAL(12, 2),
  low_price DECIMAL(12, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(stock_id, price_date)
);

-- Link between geopolitical events and affected stocks
CREATE TABLE IF NOT EXISTS event_stock_impact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES geopolitical_events(id) ON DELETE CASCADE,
  stock_id UUID REFERENCES stocks(id) ON DELETE CASCADE,
  impact_percentage DECIMAL(5, 2),
  impact_direction TEXT CHECK (impact_direction IN ('positive', 'negative', 'neutral')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, stock_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_stock_prices_date ON stock_prices(price_date);
CREATE INDEX IF NOT EXISTS idx_stock_prices_stock ON stock_prices(stock_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON geopolitical_events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_region ON geopolitical_events(region);

-- Disable RLS for public read access (analytics dashboard)
ALTER TABLE geopolitical_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_stock_impact ENABLE ROW LEVEL SECURITY;

-- Allow public read access for all tables
CREATE POLICY "Allow public read access" ON geopolitical_events FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON stocks FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON stock_prices FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON event_stock_impact FOR SELECT USING (true);
