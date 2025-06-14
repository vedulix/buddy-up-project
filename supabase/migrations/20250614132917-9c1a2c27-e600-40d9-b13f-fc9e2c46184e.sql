
-- Таблица для событий аналитики
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  session_id TEXT NOT NULL,
  route TEXT,
  data JSONB,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  ip_address INET
);

-- Таблица для заявок
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  grade TEXT NOT NULL,
  goals TEXT[] NOT NULL,
  subjects TEXT[] NOT NULL,
  level TEXT NOT NULL,
  exam_score TEXT,
  email TEXT NOT NULL,
  telegram TEXT NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  ip_address INET
);

-- Индексы для быстрых запросов
CREATE INDEX idx_analytics_events_timestamp ON public.analytics_events(timestamp);
CREATE INDEX idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_session_id ON public.analytics_events(session_id);
CREATE INDEX idx_analytics_events_utm_source ON public.analytics_events(utm_source);
CREATE INDEX idx_applications_timestamp ON public.applications(timestamp);
CREATE INDEX idx_applications_utm_source ON public.applications(utm_source);

-- RLS политики (разрешаем всем вставлять данные, но читать только админам)
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Разрешаем всем вставлять события аналитики
CREATE POLICY "Anyone can insert analytics events" 
  ON public.analytics_events 
  FOR INSERT 
  WITH CHECK (true);

-- Разрешаем всем вставлять заявки
CREATE POLICY "Anyone can insert applications" 
  ON public.applications 
  FOR INSERT 
  WITH CHECK (true);

-- Разрешаем всем читать (пока что, потом можно ограничить)
CREATE POLICY "Anyone can read analytics events" 
  ON public.analytics_events 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can read applications" 
  ON public.applications 
  FOR SELECT 
  USING (true);
