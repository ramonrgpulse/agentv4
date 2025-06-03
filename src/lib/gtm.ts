// ID do GTM
export const GTM_ID = 'GTM-PWR9KZC';

// Tipos de eventos personalizados
export interface GTMEvent {
  event: string;
  facebook_pixel?: boolean;
  google_ads?: boolean;
  page_location?: string;
  page_path?: string;
  page_title?: string;
  timestamp?: string;
  page_url?: string;
  cta_section?: string;
  form_id?: string;
  page?: string;
  scroll_position?: number;
  milestone?: number;
  time_on_page?: number;
  duration?: number;
  scroll_progress?: number;
  conversion_type?: string;
  form_source?: string;
  value?: number;
  currency?: string;
  lead_data?: Record<string, unknown>;
  send_to?: string;
  pixel_id?: string;
  error_type?: string;
  error_message?: string;
  [key: string]: unknown;
}

// Configurações de conversão (substitua pelos seus IDs reais)
export const CONVERSION_CONFIG = {
  google_ads: {
    conversion_id: 'AW-CONVERSION_ID',
    conversion_label: 'CONVERSION_LABEL'
  },
  facebook: {
    pixel_id: 'YOUR_PIXEL_ID'
  }
};

// Função para enviar eventos para o GTM
export const sendGTMEvent = (event: GTMEvent) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    try {
      // Verifica se o evento é para o Facebook Pixel
      if (event.facebook_pixel === true && typeof (window as any).fbq !== 'function') {
        // Registra um aviso mais amigável ao invés de lançar um erro
        console.warn('Facebook Pixel não está disponível, mas o evento foi enviado para o GTM');
      }
      
      window.dataLayer.push({
        ...event,
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
        page_title: document.title
      });
    } catch (error) {
      console.error('Erro ao enviar evento para GTM:', error);
    }
  }
};

// Eventos pré-configurados
export const GTMEvents = {
  // Visualização de página
  pageView: (additionalData: Record<string, any> = {}) => {
    sendGTMEvent({
      event: 'page_view',
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.search,
      page_title: document.title,
      ...additionalData
    });
  },

  // Clique em CTA
  ctaClick: (ctaSection: string, page: string, additionalData: Record<string, any> = {}) => {
    sendGTMEvent({
      event: 'cta_click',
      cta_section: ctaSection,
      page: page,
      scroll_position: window.scrollY,
      ...additionalData
    });
  },

  // Milestone de scroll
  scrollMilestone: (milestone: number, page: string, timeOnPage: number) => {
    sendGTMEvent({
      event: 'scroll_milestone',
      milestone: milestone,
      page: page,
      time_on_page: timeOnPage
    });
  },

  // Tempo na página
  timeOnPage: (duration: number, page: string, scrollProgress: number) => {
    sendGTMEvent({
      event: 'time_on_page',
      duration: duration,
      page: page,
      scroll_progress: scrollProgress
    });
  },

  // Conversão de lead
  leadConversion: (formSource: string, leadData: Record<string, unknown>) => {
    // Evento principal
    sendGTMEvent({
      event: 'lead_conversion',
      conversion_type: 'lead_capture',
      form_source: formSource,
      value: 1,
      currency: 'BRL',
      lead_data: leadData
    });

    // Evento para Google Ads
    sendGTMEvent({
      event: 'conversion',
      google_ads: true,
      send_to: `${CONVERSION_CONFIG.google_ads.conversion_id}/${CONVERSION_CONFIG.google_ads.conversion_label}`,
      value: 1,
      currency: 'BRL'
    });
    
    // Verifica se o Facebook Pixel está disponível
    if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
      // Evento para Facebook Pixel
      sendGTMEvent({
        event: 'Lead',
        facebook_pixel: true,
        pixel_id: CONVERSION_CONFIG.facebook.pixel_id,
        value: 1,
        currency: 'BRL'
      });
    }
  },
  
  // Submissão de formulário
  formSubmission: (page: string, formId: string, additionalData: Record<string, unknown> = {}) => {
    // Evento principal de submissão
    sendGTMEvent({
      event: 'form_submission',
      form_id: formId,
      page: page,
      ...additionalData
    });

    // Verifica se o Facebook Pixel está disponível
    if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
      // Evento para Facebook Pixel apenas se estiver disponível
      sendGTMEvent({
        event: 'Lead',
        facebook_pixel: true,
        pixel_id: CONVERSION_CONFIG.facebook.pixel_id,
        value: 1,
        currency: 'BRL'
      });
    }
  },

  // Erro de formulário
  formError: (formSource: string, errorType: string, errorMessage: string) => {
    sendGTMEvent({
      event: 'form_error',
      form_source: formSource,
      error_type: errorType,
      error_message: errorMessage
    });
  },

  // Início de preenchimento de formulário
  formStart: (formSource: string) => {
    sendGTMEvent({
      event: 'form_start',
      form_source: formSource
    });
  },

  // Abandono de formulário
  formAbandon: (formSource: string, fieldsCompleted: number, totalFields: number) => {
    sendGTMEvent({
      event: 'form_abandon',
      form_source: formSource,
      fields_completed: fieldsCompleted,
      total_fields: totalFields,
      completion_rate: (fieldsCompleted / totalFields) * 100
    });
  },

  // Visualização de vídeo
  videoView: (videoId: string, progress: number) => {
    sendGTMEvent({
      event: 'video_view',
      video_id: videoId,
      progress: progress
    });
  },

  // Clique em link externo
  externalLinkClick: (url: string, linkText: string) => {
    sendGTMEvent({
      event: 'external_link_click',
      link_url: url,
      link_text: linkText
    });
  },

  // Download de arquivo
  fileDownload: (fileName: string, fileType: string) => {
    sendGTMEvent({
      event: 'file_download',
      file_name: fileName,
      file_type: fileType
    });
  },

  // Busca no site
  siteSearch: (searchTerm: string, resultsCount: number) => {
    sendGTMEvent({
      event: 'site_search',
      search_term: searchTerm,
      results_count: resultsCount
    });
  },

  // Erro 404
  pageNotFound: (attemptedUrl: string, referrer: string) => {
    sendGTMEvent({
      event: 'page_not_found',
      attempted_url: attemptedUrl,
      referrer: referrer
    });
  },

  // Evento personalizado genérico
  customEvent: (eventName: string, eventData: Record<string, any> = {}) => {
    sendGTMEvent({
      event: eventName,
      ...eventData
    });
  }
};

// Função para inicializar o GTM
export const initializeGTM = () => {
  if (typeof window === 'undefined') return;

  // Cria o dataLayer se não existir
  window.dataLayer = window.dataLayer || [];

  // Adiciona o script do GTM
  const script = document.createElement('script');
  script.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');
  `;
  document.head.appendChild(script);

  // Adiciona o noscript do GTM
  const noscript = document.createElement('noscript');
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
  iframe.height = '0';
  iframe.width = '0';
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';
  noscript.appendChild(iframe);
  document.body.prepend(noscript);

  // Envia evento inicial
  GTMEvents.pageView({
    gtm_initialized: true,
    user_agent: navigator.userAgent,
    screen_resolution: `${screen.width}x${screen.height}`,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`
  });
};

// Função para rastrear parâmetros UTM
export const trackUTMParameters = () => {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = {
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
    utm_term: urlParams.get('utm_term'),
    utm_content: urlParams.get('utm_content'),
    gclid: urlParams.get('gclid'),
    fbclid: urlParams.get('fbclid'),
    referrer: document.referrer
  };

  // Filtra parâmetros não nulos
  const filteredParams = Object.fromEntries(
    Object.entries(utmParams).filter(([_, value]) => value !== null)
  );

  if (Object.keys(filteredParams).length > 0) {
    sendGTMEvent({
      event: 'utm_parameters',
      ...filteredParams
    });

    // Salva no localStorage para uso posterior
    localStorage.setItem('utm_params', JSON.stringify(filteredParams));
  }
};

// Função para obter parâmetros UTM salvos
export const getSavedUTMParams = () => {
  if (typeof window === 'undefined') return {};
  
  try {
    return JSON.parse(localStorage.getItem('utm_params') || '{}');
  } catch {
    return {};
  }
};