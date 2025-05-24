-- Inserir dados de exemplo na tabela de leads
-- Isso é útil para desenvolvimento e testes

-- Limpar a tabela (opcional, descomente se necessário)
-- TRUNCATE TABLE public.leads RESTART IDENTITY CASCADE;

-- Inserir leads de exemplo
INSERT INTO public.leads (
  first_name,
  whatsapp,
  email,
  utm_source,
  utm_medium,
  utm_campaign,
  checkout_completed,
  created_at
) VALUES 
  ('João', '5511999991111', 'joao@exemplo.com', 'google', 'cpc', 'campanha_verao', true, NOW() - INTERVAL '5 days'),
  ('Maria', '5511999992222', 'maria@exemplo.com', 'facebook', 'social', 'promo_inverno', false, NOW() - INTERVAL '3 days'),
  ('Carlos', '5511999993333', 'carlos@exemplo.com', 'instagram', 'social', 'influencer_maio', true, NOW() - INTERVAL '1 day'),
  ('Ana', '5511999994444', 'ana@exemplo.com', 'google', 'organic', NULL, false, NOW() - INTERVAL '2 hours'),
  ('Pedro', '5511999995555', 'pedro@exemplo.com', 'facebook', 'cpc', 'blackfriday', true, NOW() - INTERVAL '30 minutes');

-- Atualizar o campo updated_at para ser diferente de created_at em alguns registros
UPDATE public.leads 
SET updated_at = created_at + INTERVAL '1 hour' 
WHERE first_name IN ('João', 'Carlos', 'Pedro');

-- Verificar os dados inseridos
SELECT 
  id,
  first_name,
  email,
  whatsapp,
  utm_source,
  checkout_completed,
  created_at,
  updated_at
FROM 
  public.leads
ORDER BY 
  created_at DESC;
