import { Database as DatabaseGenerated } from '@/lib/database.types';

// Tipos para a tabela de leads
export type Lead = {
  id?: string;
  first_name: string;
  whatsapp: string;
  email: string;
  created_at?: string;
  updated_at?: string;
};

// Extensão dos tipos do Supabase
declare global {
  type Database = DatabaseGenerated;
}

export type Tables = Database['public']['Tables'];
export type LeadsRow = Tables['leads']['Row'];
export type InsertLeads = Tables['leads']['Insert'];
export type UpdateLeads = Tables['leads']['Update'];
