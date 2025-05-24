interface DataLayerEvent {
  event: string;
  lead_info?: {
    has_name?: boolean;
    has_whatsapp?: boolean;
    has_email?: boolean;
    name?: string;
  };
  field_name?: string;
  field_values_complete?: boolean;
}

// Interface para eventos do dataLayer
export interface DataLayerEvent {
  event: string;
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
  const dataLayer: DataLayerEvent[];
  
  // Extensão da interface Window
  interface Window {
    dataLayer: DataLayerEvent[];
  }
}

export {}; // Este arquivo precisa ser um módulo
