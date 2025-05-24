-- Criação da tabela de leads
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  fbclid TEXT,
  gclid TEXT,
  gclsrc TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  checkout_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adiciona índices para melhorar consultas
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_whatsapp ON public.leads (whatsapp);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at);

-- Cria uma função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Cria o trigger para atualizar o campo updated_at
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Adiciona permissões para o usuário anônimo do Supabase
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Cria políticas de segurança (RLS)
CREATE POLICY "Permitir inserção de leads"
ON public.leads
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Permitir leitura de leads para o próprio usuário"
ON public.leads
FOR SELECT
TO anon
USING (auth.uid() IS NOT NULL);

-- Comentários para documentação
COMMENT ON TABLE public.leads IS 'Tabela para armazenar leads capturados pelo formulário';
COMMENT ON COLUMN public.leads.first_name IS 'Primeiro nome do lead';
COMMENT ON COLUMN public.leads.whatsapp IS 'Número de WhatsApp do lead (apenas números)';
COMMENT ON COLUMN public.leads.email IS 'Endereço de e-mail do lead';
COMMENT ON COLUMN public.leads.checkout_completed IS 'Indica se o lead completou o checkout';

-- Cria uma função para rastrear atualizações
CREATE OR REPLACE FUNCTION public.track_lead_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Aqui você pode adicionar lógica para registrar alterações ou notificações
  -- Por exemplo, enviar um webhook quando um lead completar o checkout
  IF NEW.checkout_completed = true AND OLD.checkout_completed = false THEN
    -- Exemplo: Chamar um webhook externo
    -- PERFORM net.http_post(
    --   'https://webhook.seusite.com/checkout-completed',
    --   json_build_object('lead_id', NEW.id, 'email', NEW.email)::text,
    --   'application/json',
    --   '{}'::jsonb
    -- );
    NULL; -- Placeholder para lógica futura
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cria o trigger para rastrear atualizações
CREATE TRIGGER trigger_track_lead_update
AFTER UPDATE ON public.leads
FOR EACH ROW
WHEN (OLD.* IS DISTINCT FROM NEW.*)
EXECUTE FUNCTION public.track_lead_update();
