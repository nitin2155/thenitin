-- Insert sample stocks
INSERT INTO stocks (symbol, name, sector, country) VALUES
  ('LMT', 'Lockheed Martin', 'Defense', 'USA'),
  ('RTX', 'RTX Corporation', 'Defense', 'USA'),
  ('NOC', 'Northrop Grumman', 'Defense', 'USA'),
  ('BA', 'Boeing', 'Aerospace & Defense', 'USA'),
  ('GD', 'General Dynamics', 'Defense', 'USA'),
  ('XOM', 'Exxon Mobil', 'Energy', 'USA'),
  ('CVX', 'Chevron', 'Energy', 'USA'),
  ('BP', 'BP plc', 'Energy', 'UK'),
  ('SHEL', 'Shell plc', 'Energy', 'UK'),
  ('TTE', 'TotalEnergies', 'Energy', 'France'),
  ('RIO', 'Rio Tinto', 'Materials', 'UK'),
  ('BHP', 'BHP Group', 'Materials', 'Australia'),
  ('FCX', 'Freeport-McMoRan', 'Materials', 'USA'),
  ('NEM', 'Newmont Corp', 'Materials', 'USA'),
  ('GOLD', 'Barrick Gold', 'Materials', 'Canada')
ON CONFLICT (symbol) DO NOTHING;

-- Insert sample geopolitical events
INSERT INTO geopolitical_events (title, description, event_date, region, impact_level, category) VALUES
  ('US-China Trade Tensions Escalate', 'New tariffs announced on semiconductor exports', '2024-03-15', 'Asia-Pacific', 'high', 'trade'),
  ('Middle East Conflict Intensifies', 'Regional tensions drive oil price volatility', '2024-02-20', 'Middle East', 'critical', 'conflict'),
  ('EU Energy Policy Shift', 'European Union announces new renewable energy mandates', '2024-01-10', 'Europe', 'medium', 'policy'),
  ('Russia Sanctions Extended', 'Western nations extend and expand economic sanctions', '2024-02-01', 'Europe', 'high', 'sanctions'),
  ('US Defense Budget Increase', 'Congress approves record defense spending', '2024-03-01', 'North America', 'high', 'policy'),
  ('NATO Alliance Expansion', 'New member states join defensive alliance', '2024-01-20', 'Europe', 'medium', 'alliance'),
  ('OPEC Production Cuts', 'Oil cartel announces production reductions', '2024-02-15', 'Middle East', 'high', 'policy'),
  ('Taiwan Strait Tensions', 'Military exercises increase regional concerns', '2024-03-10', 'Asia-Pacific', 'critical', 'conflict'),
  ('Rare Earth Export Controls', 'China tightens critical mineral exports', '2024-02-25', 'Asia-Pacific', 'high', 'trade'),
  ('African Mining Rights Dispute', 'Multiple nations contest mineral extraction rights', '2024-01-05', 'Africa', 'medium', 'policy');

-- Insert stock prices with realistic historical data
DO $$
DECLARE
  stock_rec RECORD;
  price_date DATE;
  base_price DECIMAL(12, 2);
  current_price DECIMAL(12, 2);
  daily_change DECIMAL(5, 4);
BEGIN
  FOR stock_rec IN SELECT id, symbol FROM stocks LOOP
    -- Set base prices based on stock
    base_price := CASE stock_rec.symbol
      WHEN 'LMT' THEN 450.00
      WHEN 'RTX' THEN 95.00
      WHEN 'NOC' THEN 475.00
      WHEN 'BA' THEN 200.00
      WHEN 'GD' THEN 280.00
      WHEN 'XOM' THEN 105.00
      WHEN 'CVX' THEN 155.00
      WHEN 'BP' THEN 35.00
      WHEN 'SHEL' THEN 65.00
      WHEN 'TTE' THEN 70.00
      WHEN 'RIO' THEN 75.00
      WHEN 'BHP' THEN 60.00
      WHEN 'FCX' THEN 45.00
      WHEN 'NEM' THEN 40.00
      WHEN 'GOLD' THEN 18.00
      ELSE 100.00
    END;
    
    current_price := base_price;
    
    -- Generate 90 days of price data
    FOR i IN 0..89 LOOP
      price_date := CURRENT_DATE - (90 - i);
      daily_change := (RANDOM() - 0.48) * 0.04; -- Slight upward bias
      current_price := current_price * (1 + daily_change);
      
      INSERT INTO stock_prices (stock_id, price, volume, price_date, open_price, high_price, low_price)
      VALUES (
        stock_rec.id,
        ROUND(current_price, 2),
        FLOOR(RANDOM() * 10000000 + 1000000),
        price_date,
        ROUND(current_price * (1 - RANDOM() * 0.01), 2),
        ROUND(current_price * (1 + RANDOM() * 0.02), 2),
        ROUND(current_price * (1 - RANDOM() * 0.02), 2)
      )
      ON CONFLICT (stock_id, price_date) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- Link events to affected stocks
INSERT INTO event_stock_impact (event_id, stock_id, impact_percentage, impact_direction, notes)
SELECT 
  e.id,
  s.id,
  ROUND((RANDOM() * 10 - 2)::DECIMAL, 2),
  CASE 
    WHEN RANDOM() > 0.6 THEN 'positive'
    WHEN RANDOM() > 0.3 THEN 'negative'
    ELSE 'neutral'
  END,
  'Impact assessment based on historical correlation'
FROM geopolitical_events e
CROSS JOIN stocks s
WHERE 
  (e.category IN ('conflict', 'sanctions') AND s.sector = 'Defense')
  OR (e.category IN ('conflict', 'policy') AND s.sector = 'Energy' AND e.region = 'Middle East')
  OR (e.category = 'trade' AND s.sector = 'Materials')
ON CONFLICT (event_id, stock_id) DO NOTHING;
