import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { sendGTMEvent, getSavedUTMParams } from '@/lib/gtm';

// Declare global dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}

// Interface para os parâmetros de rastreamento
interface TrackingParams {
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

/**
 * Hook para gerenciar o rastreamento de eventos e parâmetros UTM
 */
export function useTracking() {
  const [searchParams] = useSearchParams();

  // Salva os parâmetros de rastreamento no localStorage
  const saveTrackingParams = useCallback((): TrackingParams => {
    if (typeof window === 'undefined') return {};

    const params: TrackingParams = {
      // Parâmetros UTM
      utm_source: searchParams.get('utm_source'),
      utm_medium: searchParams.get('utm_medium'),
      utm_campaign: searchParams.get('utm_campaign'),
      utm_term: searchParams.get('utm_term'),
      utm_content: searchParams.get('utm_content'),
      
      // IDs de clique
      fbclid: searchParams.get('fbclid'),
      gclid: searchParams.get('gclid'),
      gclsrc: searchParams.get('gclsrc'),
      
      // Referência
      referrer: document.referrer || null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    };

    // Filtra valores nulos/indefinidos
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null)
    ) as TrackingParams;

    // Salva no localStorage
    localStorage.setItem('tracking_params', JSON.stringify(filteredParams));

    // Envia para o dataLayer (Google Tag Manager)
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'tracking_params_updated',
        ...filteredParams,
      });
    }

    return filteredParams;
  }, [searchParams]);

  // Rastreia um evento personalizado
  const trackEvent = useCallback(async (
    eventName: string, 
    eventData: Record<string, any> = {}
  ) => {
    try {
      // Obtém os parâmetros de rastreamento salvos
      const trackingParams = JSON.parse(
        localStorage.getItem('tracking_params') || '{}'
      );

      // Envia para o Google Tag Manager usando a função centralizada
      sendGTMEvent({
        event: eventName,
        ...eventData,
        tracking_params: trackingParams
      });

      // Envia para o Supabase (opcional)
      if (eventData.saveToSupabase !== false) {
        await supabase.from('events').insert({
          event_name: eventName,
          event_data: {
            ...eventData,
            tracking_params: trackingParams
          },
          created_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Erro ao rastrear evento:', error);
    }
  }, []);

  // Rastreia o progresso do formulário
  const trackFormStep = useCallback((
    step: string,
    field?: string,
    value?: string
  ) => {
    trackEvent('form_step', {
      form_type: 'lead_form',
      step,
      field,
      value: value ? anonymizeValue(field, value) : undefined,
    });
  }, [trackEvent]);

  // Função para anonimizar valores sensíveis
  const anonymizeValue = (
    field: string | undefined,
    value: string
  ): string => {
    if (!field || !value) return '';
    
    // Anonimiza e-mails
    if (field.toLowerCase().includes('email') && value.includes('@')) {
      const [user, domain] = value.split('@');
      return `${user.substring(0, 3)}***@${domain}`;
    }
    
    // Anonimiza telefones
    if (field.toLowerCase().includes('phone') || field.toLowerCase().includes('whatsapp')) {
      return `${value.substring(0, 4)}****${value.slice(-3)}`;
    }
    
    return value;
  };

  // Efeito para salvar os parâmetros de rastreamento na inicialização
  useEffect(() => {
    const params = saveTrackingParams();
    
    // Rastreia a visualização da página
    trackEvent('page_view', {
      ...params,
      page_title: document.title,
      page_path: window.location.pathname + window.location.search,
    });
    
    // Se houver um GCLID, podemos configurar um cookie de conversão
    if (params.gclid) {
      document.cookie = `_gcl_aw=${params.gclid}; path=/; max-age=63072000; samesite=lax`;
    }
    
    // Se houver um FBCLID, podemos configurar um cookie do Facebook
    if (params.fbclid) {
      document.cookie = `_fbp=fb.1.${Date.now()}.${params.fbclid}; path=/; max-age=63072000; samesite=lax`;
    }
  }, [saveTrackingParams, trackEvent]);

  return {
    trackEvent,
    trackFormStep,
    saveTrackingParams,
    anonymizeValue,
  };
}

// Hook para obter os parâmetros de rastreamento atuais
export function useTrackingParams() {
  if (typeof window === 'undefined') return {};
  
  try {
    return JSON.parse(localStorage.getItem('tracking_params') || '{}');
  } catch (error) {
    console.error('Error parsing tracking params:', error);
    return {};
  }
}
