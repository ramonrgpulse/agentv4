import { createClient } from '@supabase/supabase-js';

// Verifica se as variáveis de ambiente estão definidas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessárias');
}

// Configuração global de headers
const globalHeaders: HeadersInit = {
  'Content-Type': 'application/json',
  'apikey': supabaseAnonKey,
  'Authorization': `Bearer ${supabaseAnonKey}`,
};

// Cria e exporta a instância do cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Não persistir sessão no localStorage
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'sb-auth-token',
  },
  global: {
    headers: globalHeaders,
  },
  db: {
    schema: 'public',
  },
});

// Tipos para a tabela de leads
export interface Lead {
  id?: string;
  first_name: string;
  whatsapp: string;
  email: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  fbclid?: string | null;
  gclid?: string | null;
  gclsrc?: string | null;
  referrer?: string | null;
  user_agent?: string | null;
  checkout_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Funções específicas para a tabela de leads
export const leadsApi = {
  // Cria ou atualiza um lead
  async upsertLead(lead: Partial<Lead>) {
    const { data, error } = await supabase
      .from('leads')
      .upsert(lead, { onConflict: 'email' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Busca um lead por email
  async getLeadByEmail(email: string) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = nenhum resultado
    return data;
  },

  // Atualiza o status de checkout de um lead
  async updateCheckoutStatus(email: string, status: boolean) {
    const { data, error } = await supabase
      .from('leads')
      .update({ checkout_completed: status })
      .eq('email', email)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Obtém todos os leads (apenas para admin)
  async getAllLeads() {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// Função para inicializar o rastreamento de página
export function trackPageView() {
  if (typeof window === 'undefined') return;

  // Captura dados da página
  const pageData = {
    event: 'page_view',
    page_title: document.title,
    page_path: window.location.pathname + window.location.search,
    page_location: window.location.href,
    referrer: document.referrer,
  };

  // Envia para o dataLayer (Google Tag Manager)
  if (window.dataLayer) {
    window.dataLayer.push(pageData);
  }

  // Envia para o Supabase (opcional)
  if (supabase) {
    supabase
      .from('analytics_events')
      .insert([{
        event_name: 'page_view',
        event_data: pageData,
        page_url: window.location.href,
        referrer: document.referrer,
      }])
      .then(({ error }) => {
        if (error) console.error('Error tracking page view:', error);
      });
  }
}

// Inicializa o rastreamento quando o módulo é carregado
if (typeof window !== 'undefined') {
  // Garante que o dataLayer está inicializado
  window.dataLayer = window.dataLayer || [];
  
  // Rastreia a visualização da página inicial
  trackPageView();
  
  // Rastreia navegação em SPA (se estiver usando React Router)
  window.addEventListener('popstate', trackPageView);
}

export default supabase;
