-- User profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  city TEXT,
  province TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User scenarios (What-If simulator saves)
CREATE TABLE IF NOT EXISTS public.user_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  scenario_type TEXT NOT NULL, -- 'rate', 'tariff', 'housing', 'commodity'
  inputs JSONB NOT NULL, -- Store all slider values
  results JSONB, -- Store calculated results
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scenarios_select_own" ON public.user_scenarios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "scenarios_insert_own" ON public.user_scenarios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "scenarios_delete_own" ON public.user_scenarios FOR DELETE USING (auth.uid() = user_id);

-- User watchlist
CREATE TABLE IF NOT EXISTS public.user_watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL, -- 'stock', 'commodity'
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  alert_above NUMERIC,
  alert_below NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, asset_type, symbol)
);

ALTER TABLE public.user_watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "watchlist_select_own" ON public.user_watchlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "watchlist_insert_own" ON public.user_watchlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "watchlist_delete_own" ON public.user_watchlist FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "watchlist_update_own" ON public.user_watchlist FOR UPDATE USING (auth.uid() = user_id);

-- User quiz scores (Guess & Learn game)
CREATE TABLE IF NOT EXISTS public.user_quiz_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  user_guess TEXT NOT NULL, -- 'up', 'down', 'stable'
  actual_result TEXT NOT NULL,
  was_correct BOOLEAN NOT NULL,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_quiz_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quiz_select_own" ON public.user_quiz_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "quiz_insert_own" ON public.user_quiz_scores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User portfolio for stress testing
CREATE TABLE IF NOT EXISTS public.user_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  asset_type TEXT NOT NULL, -- 'stock', 'etf', 'commodity'
  quantity NUMERIC NOT NULL DEFAULT 1,
  purchase_price NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, symbol)
);

ALTER TABLE public.user_portfolio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "portfolio_select_own" ON public.user_portfolio FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "portfolio_insert_own" ON public.user_portfolio FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "portfolio_delete_own" ON public.user_portfolio FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "portfolio_update_own" ON public.user_portfolio FOR UPDATE USING (auth.uid() = user_id);

-- Personal impact calculator settings
CREATE TABLE IF NOT EXISTS public.user_impact_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mortgage_amount NUMERIC,
  current_rate NUMERIC,
  household_income NUMERIC,
  job_sector TEXT,
  city TEXT,
  province TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_impact_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "impact_select_own" ON public.user_impact_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "impact_insert_own" ON public.user_impact_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "impact_update_own" ON public.user_impact_settings FOR UPDATE USING (auth.uid() = user_id);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create trigger for auto-creating profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
