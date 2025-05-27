# Guia de Implementação do Google Tag Manager (GTM)

## Visão Geral

Este projeto implementa um sistema completo de rastreamento usando o Google Tag Manager (GTM) com o ID `GTM-PWR9KZC`. O rastreamento está configurado de forma centralizada e abrange todas as principais interações do usuário.

## Arquitetura do Rastreamento

### 1. Configuração Centralizada (`src/lib/gtm.ts`)

Todos os eventos e configurações do GTM estão centralizados em um único arquivo:

- **GTM_ID**: `GTM-PWR9KZC`
- **Eventos pré-configurados**: Funções prontas para diferentes tipos de eventos
- **Inicialização automática**: Configuração do GTM e dataLayer
- **Rastreamento de UTM**: Captura automática de parâmetros de campanha

### 2. Eventos Implementados

#### Eventos de Navegação
- **page_view**: Visualização de página (automático em mudanças de rota)
- **route_change**: Mudança de rota específica

#### Eventos de Interação
- **cta_click**: Cliques em Call-to-Action
- **scroll_milestone**: Marcos de rolagem (25%, 50%, 75%, 90%)
- **time_on_page**: Tempo na página (30s, 1m, 2m, 5m)

#### Eventos de Conversão
- **lead_conversion**: Conversão de lead principal
- **conversion**: Evento genérico de conversão
- **gtag_conversion**: Evento específico para Google Ads
- **fbq_lead**: Evento para Facebook Pixel

#### Eventos de Formulário
- **form_start**: Início de preenchimento
- **form_progress**: Progresso no formulário
- **form_error**: Erros no formulário
- **checkout_redirect**: Redirecionamento para checkout

### 3. Implementação por Componente

#### Main.tsx
```typescript
import { initializeGTM, trackUTMParameters } from '@/lib/gtm';

// Inicialização automática do GTM
if (typeof window !== "undefined") {
  initializeGTM();
  trackUTMParameters();
}
```

#### App.tsx - RouteTracker
```typescript
import { GTMEvents } from '@/lib/gtm';

// Rastreamento automático de mudanças de rota
GTMEvents.pageView({
  page_path: location.pathname + location.search,
  route_change: true
});
```

#### Páginas (Index.tsx, AIPersonV2.tsx)
```typescript
import { GTMEvents } from '@/lib/gtm';

// Cliques em CTA
GTMEvents.ctaClick(ctaSection, 'page_name', {
  reading_progress: scrollProgress
});

// Marcos de rolagem
GTMEvents.scrollMilestone(milestone, 'page_name', timeOnPage);

// Tempo na página
GTMEvents.timeOnPage(duration, 'page_name', scrollProgress);
```

#### LeadCaptureForm.tsx
```typescript
import { GTMEvents } from '@/lib/gtm';

// Conversão de lead completa
GTMEvents.leadConversion('lead-capture-form', formData);
```

### 4. Hook Personalizado (useTracking)

O hook `useTracking` foi atualizado para usar a configuração centralizada:

```typescript
import { sendGTMEvent, getSavedUTMParams } from '@/lib/gtm';

// Envio de eventos personalizados
sendGTMEvent({
  event: eventName,
  ...eventData,
  tracking_params: trackingParams
});
```

## Configuração no Google Tag Manager

### 1. Variáveis Recomendadas

Crie as seguintes variáveis no GTM para capturar os dados enviados:

- `DLV - Event` (Data Layer Variable: event)
- `DLV - Page Path` (Data Layer Variable: page_path)
- `DLV - CTA Section` (Data Layer Variable: cta_section)
- `DLV - Milestone` (Data Layer Variable: milestone)
- `DLV - Duration` (Data Layer Variable: duration)
- `DLV - Form ID` (Data Layer Variable: form_id)
- `DLV - Lead Data` (Data Layer Variable: lead_data)
- `DLV - UTM Source` (Data Layer Variable: utm_source)
- `DLV - UTM Medium` (Data Layer Variable: utm_medium)
- `DLV - UTM Campaign` (Data Layer Variable: utm_campaign)

### 2. Triggers Recomendados

Configure os seguintes triggers:

- **Page View**: `event equals page_view`
- **CTA Click**: `event equals cta_click`
- **Scroll Milestone**: `event equals scroll_milestone`
- **Time on Page**: `event equals time_on_page`
- **Lead Conversion**: `event equals lead_conversion`
- **Form Start**: `event equals form_start`
- **Form Progress**: `event equals form_progress`

### 3. Tags Recomendadas

#### Google Analytics 4
```
Tag Type: Google Analytics: GA4 Event
Measurement ID: [SEU_GA4_ID]
Event Name: {{DLV - Event}}
Parameters:
  - page_path: {{DLV - Page Path}}
  - cta_section: {{DLV - CTA Section}}
  - milestone: {{DLV - Milestone}}
  - duration: {{DLV - Duration}}
```

#### Google Ads Conversion
```
Tag Type: Google Ads: Conversion Tracking
Conversion ID: [SEU_CONVERSION_ID]
Conversion Label: [SEU_CONVERSION_LABEL]
Trigger: Lead Conversion
```

#### Facebook Pixel
```
Tag Type: Custom HTML
HTML:
<script>
  fbq('track', 'Lead', {
    content_name: {{DLV - Content Name}},
    value: {{DLV - Value}},
    currency: 'BRL'
  });
</script>
Trigger: Lead Conversion
```

## Parâmetros UTM Rastreados

O sistema captura automaticamente:

- `utm_source`: Fonte da campanha
- `utm_medium`: Meio da campanha
- `utm_campaign`: Nome da campanha
- `utm_term`: Termo da campanha
- `utm_content`: Conteúdo da campanha
- `gclid`: Google Click ID
- `fbclid`: Facebook Click ID
- `referrer`: Página de referência

## Dados Enviados em Cada Evento

Todos os eventos incluem automaticamente:

- `timestamp`: Data/hora do evento
- `page_url`: URL atual da página
- `page_title`: Título da página
- `tracking_params`: Parâmetros UTM salvos

## Configurações de Conversão

Para configurar as conversões, edite o arquivo `src/lib/gtm.ts`:

```typescript
export const CONVERSION_CONFIG = {
  google_ads: {
    conversion_id: 'AW-SEU_CONVERSION_ID',
    conversion_label: 'SEU_CONVERSION_LABEL'
  },
  facebook: {
    pixel_id: 'SEU_PIXEL_ID'
  }
};
```

## Debugging e Monitoramento

### 1. Console do Navegador
Todos os eventos são logados no console para debugging.

### 2. GTM Preview Mode
Use o modo de preview do GTM para verificar se os eventos estão sendo enviados corretamente.

### 3. Google Analytics Real-time
Verifique os eventos em tempo real no Google Analytics.

### 4. Facebook Pixel Helper
Use a extensão Facebook Pixel Helper para verificar os eventos do Facebook.

## Manutenção e Atualizações

### Adicionando Novos Eventos

1. Adicione a função do evento em `src/lib/gtm.ts`:
```typescript
export const GTMEvents = {
  // ... eventos existentes
  
  novoEvento: (parametro1: string, parametro2: number) => {
    sendGTMEvent({
      event: 'novo_evento',
      parametro_1: parametro1,
      parametro_2: parametro2
    });
  }
};
```

2. Use o evento no componente:
```typescript
import { GTMEvents } from '@/lib/gtm';

GTMEvents.novoEvento('valor1', 123);
```

3. Configure o trigger e tag correspondentes no GTM.

### Atualizando Configurações

Para alterar o ID do GTM ou outras configurações, edite apenas o arquivo `src/lib/gtm.ts`. Todas as outras partes do código usarão automaticamente as novas configurações.

## Checklist de Implementação

- [x] GTM inicializado com ID correto
- [x] Rastreamento de visualizações de página
- [x] Rastreamento de cliques em CTA
- [x] Rastreamento de marcos de rolagem
- [x] Rastreamento de tempo na página
- [x] Rastreamento de conversões de lead
- [x] Rastreamento de parâmetros UTM
- [x] Configuração centralizada
- [x] Hook personalizado atualizado
- [x] Documentação completa

## Próximos Passos

1. Configure as tags no Google Tag Manager
2. Teste todos os eventos em modo preview
3. Configure as conversões do Google Ads
4. Configure o Facebook Pixel
5. Monitore os dados no Google Analytics
6. Ajuste as configurações conforme necessário

---

**Nota**: Lembre-se de substituir os IDs de exemplo (`AW-CONVERSION_ID`, `SEU_GA4_ID`, etc.) pelos seus IDs reais antes de colocar em produção.