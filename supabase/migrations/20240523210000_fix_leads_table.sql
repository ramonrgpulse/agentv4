-- Verifica se a tabela leads existe e sua estrutura
DO $$
BEGIN
    -- Verifica se a tabela existe
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leads' AND table_schema = 'public') THEN
        RAISE NOTICE 'A tabela "leads" existe no esquema público.';
        
        -- Lista as colunas da tabela
        RAISE NOTICE 'Colunas da tabela "leads":';
        PERFORM 
            column_name, data_type, is_nullable
        FROM 
            information_schema.columns 
        WHERE 
            table_name = 'leads' 
            AND table_schema = 'public'
        ORDER BY 
            ordinal_position;
            
        -- Verifica se a coluna first_name existe
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'leads' 
            AND column_name = 'first_name'
            AND table_schema = 'public'
        ) THEN
            RAISE NOTICE 'A coluna "first_name" não existe na tabela "leads". Adicionando...';
            ALTER TABLE public.leads ADD COLUMN first_name TEXT NOT NULL DEFAULT '';
            RAISE NOTICE 'Coluna "first_name" adicionada com sucesso.';
        END IF;
        
    ELSE
        RAISE NOTICE 'A tabela "leads" não existe no esquema público. Criando...';
        
        -- Cria a tabela leads se não existir
        CREATE TABLE public.leads (
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
        
        -- Cria índices
        CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads (email);
        CREATE INDEX IF NOT EXISTS idx_leads_whatsapp ON public.leads (whatsapp);
        CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at);
        
        -- Cria função para atualizar o campo updated_at
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
        
        -- Habilita RLS (Row Level Security)
        ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
        
        -- Cria políticas de segurança
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
        
        -- Adiciona comentários
        COMMENT ON TABLE public.leads IS 'Tabela para armazenar leads capturados pelo formulário';
        COMMENT ON COLUMN public.leads.first_name IS 'Primeiro nome do lead';
        COMMENT ON COLUMN public.leads.whatsapp IS 'Número de WhatsApp do lead (apenas números)';
        COMMENT ON COLUMN public.leads.email IS 'Endereço de e-mail do lead';
        COMMENT ON COLUMN public.leads.checkout_completed IS 'Indica se o lead completou o checkout';
        
        RAISE NOTICE 'Tabela "leads" criada com sucesso.';
    END IF;
    
    -- Verifica se a função track_lead_update existe
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_proc p 
        JOIN pg_namespace n ON p.pronamespace = n.oid 
        WHERE p.proname = 'track_lead_update' 
        AND n.nspname = 'public'
    ) THEN
        RAISE NOTICE 'A função "track_lead_update" não existe. Criando...';
        
        -- Cria a função track_lead_update
        CREATE OR REPLACE FUNCTION public.track_lead_update()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Lógica para rastrear atualizações
            IF NEW.checkout_completed = true AND (OLD.checkout_completed = false OR OLD.checkout_completed IS NULL) THEN
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
        
        RAISE NOTICE 'Função "track_lead_update" criada com sucesso.';
    END IF;
    
    -- Verifica se o trigger existe
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_trigger t 
        JOIN pg_class c ON t.tgrelid = c.oid 
        JOIN pg_namespace n ON c.relnamespace = n.oid 
        WHERE t.tgname = 'trigger_track_lead_update' 
        AND n.nspname = 'public'
    ) THEN
        RAISE NOTICE 'O trigger "trigger_track_lead_update" não existe. Criando...';
        
        -- Cria o trigger
        CREATE TRIGGER trigger_track_lead_update
        AFTER UPDATE ON public.leads
        FOR EACH ROW
        WHEN (OLD.* IS DISTINCT FROM NEW.*)
        EXECUTE FUNCTION public.track_lead_update();
        
        RAISE NOTICE 'Trigger "trigger_track_lead_update" criado com sucesso.';
    END IF;
    
    RAISE NOTICE 'Verificação concluída com sucesso!';
END
$$;
