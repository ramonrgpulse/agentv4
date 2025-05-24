// Tipos para o dataLayer do Google Tag Manager
interface BaseEventParams {
  event: string;
  [key: string]: unknown;
}

interface ScrollToFormEvent extends BaseEventParams {
  event: 'scroll_to_form';
  form_trigger: string;
}

interface CheckoutRedirectEvent extends BaseEventParams {
  event: 'checkout_redirect';
  form_completion: boolean;
}

type DataLayerEvent = ScrollToFormEvent | CheckoutRedirectEvent | BaseEventParams;

declare global {
  // Extensão da interface Window para incluir o dataLayer
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export {}; // Este arquivo precisa ser um módulo
