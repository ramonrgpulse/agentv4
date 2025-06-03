/**
 * ARQUIVO DE UTILITÁRIOS DE RASTREAMENTO
 * 
 * Este arquivo substitui a antiga integração com o Supabase.
 * Agora, o rastreamento é feito via Google Tag Manager e webhook centralizado.
 * Todos os eventos são enviados para o mesmo webhook utilizado pelos formulários.
 */

// URL do webhook centralizado
export const WEBHOOK_URL = "https://programa8webhook.rgpulse.com.br/webhook/persona";

// Interface para parâmetros de rastreamento
export interface TrackingParams {
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
  [key: string]: string | null | undefined;
}

// Função para salvar dados de lead localmente (se necessário para integrações)
export const saveLead = (leadData: Record<string, unknown>): void => {
  try {
    localStorage.setItem('lead_data', JSON.stringify(leadData));
    console.log('Dados do lead salvos localmente', leadData);
  } catch (error) {
    console.error('Erro ao salvar dados do lead:', error);
  }
};

// Tipos para dados de lead (mantidos para compatibilidade com código existente)
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

// ATENÇÃO: As funções de API para leads foram removidas da integração com Supabase
// Alternativas de implementação podem ser:
// 1. Usar localStorage para dados temporários
// 2. Implementar integração com webhook
// 3. Usar outra solução de armazenamento

// Funções alternativas sem dependência de banco de dados
export const leadsApi = {
  // Salva dados do lead localmente
  async upsertLead(lead: Partial<Lead>) {
    // Salvar em localStorage como solução temporária
    try {
      const storedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
      const existingLeadIndex = storedLeads.findIndex((l: Lead) => l.email === lead.email);
      
      if (existingLeadIndex >= 0) {
        storedLeads[existingLeadIndex] = { ...storedLeads[existingLeadIndex], ...lead };
      } else {
        storedLeads.push({ ...lead, id: crypto.randomUUID(), created_at: new Date().toISOString() });
      }
      
      localStorage.setItem('leads', JSON.stringify(storedLeads));
      return lead;
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
      throw error;
    }
  },

  // Busca um lead por email (apenas localmente)
  async getLeadByEmail(email: string) {
    try {
      const storedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
      return storedLeads.find((lead: Lead) => lead.email === email) || null;
    } catch (error) {
      console.error('Erro ao buscar lead:', error);
      return null;
    }
  },

  // Atualiza o status de checkout de um lead (apenas localmente)
  async updateCheckoutStatus(email: string, status: boolean) {
    try {
      const storedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
      const leadIndex = storedLeads.findIndex((lead: Lead) => lead.email === email);
      
      if (leadIndex >= 0) {
        storedLeads[leadIndex].checkout_completed = status;
        storedLeads[leadIndex].updated_at = new Date().toISOString();
        localStorage.setItem('leads', JSON.stringify(storedLeads));
        return storedLeads[leadIndex];
      }
      return null;
    } catch (error) {
      console.error('Erro ao atualizar status de checkout:', error);
      return null;
    }
  },

  // Apenas para debug - não deve ser usado em produção
  async getAllLeads() {
    try {
      return JSON.parse(localStorage.getItem('leads') || '[]');
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      return [];
    }
  }
};

/**
 * Função para enviar eventos para o webhook
 * Esta função centraliza o envio de qualquer tipo de evento para o webhook
 */
export async function sendEventToWebhook(eventName: string, eventData: Record<string, unknown> = {}): Promise<boolean> {
  try {
    // Prepara os dados para serem enviados
    const cleanedData = cleanDataForSerialization({
      event_name: eventName,
      event_data: eventData,
      created_at: new Date().toISOString(),
      page_url: typeof window !== 'undefined' ? window.location.href : null,
      referrer: typeof document !== 'undefined' ? document.referrer : null,
    });
    
    console.log(`Enviando evento '${eventName}' para o webhook:`, cleanedData);
    
    // Envia para o webhook
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanedData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro do webhook:', errorText);
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Erro ao enviar evento '${eventName}' para o webhook:`, error);
    return false;
  }
}

// Função auxiliar para limpar dados antes da serialização JSON
function cleanDataForSerialization(data: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    // Remove valores indefinidos, funções e símbolos
    if (value === undefined || typeof value === 'function' || typeof value === 'symbol') {
      continue;
    }
    
    // Converte valores nulos, objetos e arrays para serialização segura
    if (value === null) {
      clean[key] = null;
    } else if (typeof value === 'object') {
      if (Array.isArray(value)) {
        clean[key] = value.map(item => 
          typeof item === 'object' && item !== null 
            ? cleanDataForSerialization(item) 
            : item
        );
      } else if (value instanceof Date) {
        clean[key] = value.toISOString();
      } else {
        // Garantir que o valor é um objeto não-nulo que pode ser tratado como Record<string, unknown>
        clean[key] = cleanDataForSerialization(value as Record<string, unknown>);
      }
    } else {
      clean[key] = value;
    }
  }
  
  return clean;
}

// Função para inicializar o rastreamento de página (via GTM e Webhook)
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
  
  // Envia para o webhook centralizado (substitui o envio para o Supabase)
  sendEventToWebhook('page_view', pageData)
    .then(success => {
      if (success) {
        console.log('Evento page_view enviado com sucesso para o webhook');
      }
    });
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

// Removida a exportação padrão do Supabase
