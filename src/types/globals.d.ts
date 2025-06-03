import { GTMEvent } from '../lib/gtm';

// Estendendo a interface GTMEvent com campos adicionais específicos
interface ExtendedGTMEvent extends GTMEvent {
  lead_info?: {
    has_name?: boolean;
    has_whatsapp?: boolean;
    has_email?: boolean;
    name?: string;
  };
  field_name?: string;
  field_values_complete?: boolean;
}

declare global {
  // Declaração para uso no Node.js (SSR)
  const dataLayer: ExtendedGTMEvent[];
  
  // Extensão da interface Window
  interface Window {
    dataLayer: ExtendedGTMEvent[];
  }
}

export {}; // Este arquivo precisa ser um módulo
