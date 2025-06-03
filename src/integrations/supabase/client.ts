/**
 * ATENÇÃO: INTEGRAÇÃO COM SUPABASE REMOVIDA
 * 
 * Este arquivo foi esvaziado deliberadamente para remover a integração com o Supabase.
 * O projeto agora utiliza apenas webhooks para envio de dados de leads e Google Tag Manager
 * para rastreamento de eventos.
 * 
 * Se precisar de funcionalidades anteriormente fornecidas pelo Supabase:
 * - Para cadastro de leads: utilize o webhook configurado no ModernLeadForm
 * - Para rastreamento: utilize o hook useTracking que agora envia apenas para o GTM
 */

// Objeto vazio para manter compatibilidade com imports existentes
export const supabase = {};

// Tipo para compatibilidade com código existente
export type Database = Record<string, unknown>