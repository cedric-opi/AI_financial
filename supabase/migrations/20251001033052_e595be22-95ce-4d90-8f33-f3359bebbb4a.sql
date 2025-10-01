-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop existing tables that will be replaced
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_conversations CASCADE;
DROP TABLE IF EXISTS expert_activities CASCADE;
DROP TABLE IF EXISTS expert_follows CASCADE;
DROP TABLE IF EXISTS experts CASCADE;
DROP TABLE IF EXISTS portfolio_holdings CASCADE;
DROP TABLE IF EXISTS portfolio_performance CASCADE;
DROP TABLE IF EXISTS portfolios CASCADE;
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_packages CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop existing functions and triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  primary_name text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  is_active boolean DEFAULT true,
  activated_at timestamp with time zone,
  telegram_code text,
  updated_code text,
  preferred_includes text[],
  amount_code numeric,
  account_state text
);

-- Create profiles_user_form table
CREATE TABLE public.profiles_user_form (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  bid text,
  sub_form text,
  portfolio_id uuid,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create portfolio table
CREATE TABLE public.portfolio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  portfolio_name text NOT NULL,
  description text,
  total_value numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create user_portfolio_trading table
CREATE TABLE public.user_portfolio_trading (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid REFERENCES public.portfolio(id) ON DELETE CASCADE NOT NULL,
  follower_drive text,
  followed_since timestamp with time zone,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create market_data table
CREATE TABLE public.market_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_trading_id uuid REFERENCES public.user_portfolio_trading(id) ON DELETE CASCADE,
  portfolio_id uuid REFERENCES public.portfolio(id) ON DELETE CASCADE,
  performance_id uuid,
  user_profile uuid REFERENCES public.users(id) ON DELETE CASCADE,
  open numeric,
  close numeric,
  high numeric,
  low numeric,
  volume bigint,
  date date NOT NULL,
  return numeric,
  vwap numeric,
  user_updated timestamp with time zone DEFAULT now(),
  user_performance_id uuid,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  feed_two_id uuid,
  type text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create transaction table
CREATE TABLE public.transaction (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  transaction_type text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create user_sessions table
CREATE TABLE public.user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  summary text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create user_messages table
CREATE TABLE public.user_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.user_sessions(id) ON DELETE CASCADE NOT NULL,
  person_sent text NOT NULL,
  message_text text NOT NULL,
  question_answer text,
  created_name text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create bot_accounts table
CREATE TABLE public.bot_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text,
  email text UNIQUE,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create bot_messages table
CREATE TABLE public.bot_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES public.user_messages(id) ON DELETE CASCADE,
  person_sent text NOT NULL,
  person_text text NOT NULL,
  is_triggered boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create user_profile_embeddings table
CREATE TABLE public.user_profile_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES public.user_messages(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.user_sessions(id) ON DELETE CASCADE,
  user_name text,
  member_date date,
  user_profile uuid REFERENCES public.users(id) ON DELETE CASCADE,
  embedding vector(1536),
  model_name text,
  create_name text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create portfolio_embeddings table
CREATE TABLE public.portfolio_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_embeddings vector(1536),
  single_index integer,
  multi_index integer[],
  embedding vector(1536),
  model_name text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create partner_packages table
CREATE TABLE public.partner_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text,
  duration_weeks integer,
  available_access text[],
  is_active boolean DEFAULT true,
  price numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create user_payments table
CREATE TABLE public.user_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  partner_id uuid REFERENCES public.partner_packages(id) ON DELETE CASCADE,
  payment_hash text,
  status text DEFAULT 'pending',
  period integer,
  transaction_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles_user_form ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_portfolio_trading ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profile_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON public.users
  FOR ALL USING (auth.uid() = id);

-- RLS Policies for profiles_user_form
CREATE POLICY "Users can manage own form" ON public.profiles_user_form
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for portfolio
CREATE POLICY "Users can manage own portfolio" ON public.portfolio
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user_portfolio_trading
CREATE POLICY "Users can manage own trading" ON public.user_portfolio_trading
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for market_data
CREATE POLICY "Users can view own market data" ON public.market_data
  FOR SELECT USING (auth.uid() = user_profile);

-- RLS Policies for notifications
CREATE POLICY "Users can manage own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for transaction
CREATE POLICY "Users can view own transactions" ON public.transaction
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user_sessions
CREATE POLICY "Users can manage own sessions" ON public.user_sessions
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user_messages
CREATE POLICY "Users can manage own messages" ON public.user_messages
  FOR ALL USING (
    session_id IN (
      SELECT id FROM public.user_sessions WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for bot_accounts (read-only for all authenticated users)
CREATE POLICY "Anyone can view bot accounts" ON public.bot_accounts
  FOR SELECT USING (is_active = true);

-- RLS Policies for bot_messages (read-only)
CREATE POLICY "Users can view bot messages" ON public.bot_messages
  FOR SELECT USING (true);

-- RLS Policies for user_profile_embeddings
CREATE POLICY "Users can manage own embeddings" ON public.user_profile_embeddings
  FOR ALL USING (auth.uid() = user_profile);

-- RLS Policies for portfolio_embeddings (read-only)
CREATE POLICY "Users can view portfolio embeddings" ON public.portfolio_embeddings
  FOR SELECT USING (true);

-- RLS Policies for partner_packages (read-only)
CREATE POLICY "Anyone can view packages" ON public.partner_packages
  FOR SELECT USING (is_active = true);

-- RLS Policies for user_payments
CREATE POLICY "Users can view own payments" ON public.user_payments
  FOR ALL USING (auth.uid() = user_id);

-- Create update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_user_form_updated_at BEFORE UPDATE ON public.profiles_user_form
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_updated_at BEFORE UPDATE ON public.portfolio
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON public.user_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bot_accounts_updated_at BEFORE UPDATE ON public.bot_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profile_embeddings_updated_at BEFORE UPDATE ON public.user_profile_embeddings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_embeddings_updated_at BEFORE UPDATE ON public.portfolio_embeddings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partner_packages_updated_at BEFORE UPDATE ON public.partner_packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, primary_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_portfolio_user_id ON public.portfolio(user_id);
CREATE INDEX idx_user_portfolio_trading_portfolio_id ON public.user_portfolio_trading(portfolio_id);
CREATE INDEX idx_market_data_portfolio_id ON public.market_data(portfolio_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_messages_session_id ON public.user_messages(session_id);
CREATE INDEX idx_user_payments_user_id ON public.user_payments(user_id);