import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { Options as ConfettiOptions } from 'canvas-confetti';
import { Input } from "./ui/input"; 
import { Button } from "./ui/button"; 
import { Label } from "./ui/label";   
import { useToast } from "./ui/use-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import type { DataLayerEvent } from '@/types/globals';

// URLs
const WEBHOOK_URL = 'https://programa8webhook.rgpulse.com.br/webhook/persona';
const CHECKOUT_URL = 'https://pay.herospark.com/rg-pulse-agente-criador-de-avatar-aprofundado-412999';

// Função para logar parâmetros da URL
const logUrlParams = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    console.log('Parâmetros da URL encontrados:', Object.fromEntries(params.entries()));
  }
};

// Interface para os dados do lead que serão enviados ao webhook
interface LeadData {
  // Dados do formulário
  first_name: string;
  whatsapp: string;
  email: string;
  
  // Parâmetros da URL
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  fbclid?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  // Outros parâmetros de rastreamento
  [key: string]: string | undefined;
}


interface LeadFormProps {
  onComplete: () => void;
  className?: string;
}

interface FormData {
  first_name: string;
  whatsapp: string;
  email: string;
}

// Função para extrair parâmetros da URL
const getUrlParams = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  
  // Adiciona apenas os parâmetros UTM e de rastreamento relevantes
  const allowedParams = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'fbclid', 'gclid', 'gbraid', 'wbraid', 'ref', 'source'
  ];
  
  params.forEach((value, key) => {
    if (allowedParams.includes(key) || key.startsWith('utm_')) {
      result[key] = value;
    }
  });
  
  return result;
};

const LeadCaptureForm = ({ onComplete, className = "" }: LeadFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const firstNameInputRef = useRef<HTMLInputElement>(null);
  
  const checkDarkMode = useCallback(() => {
    if (typeof document === 'undefined') return false;
    // Check if html or body has .dark class
    if (document.documentElement.classList.contains('dark') || document.body.classList.contains('dark')) {
        return true;
    }
    // Verifica elementos ancestrais por classes de tema escuro
    const parent = firstNameInputRef.current?.closest('.bg-brutal-darker, .bg-brutal-dark, .dark-theme-section');
    if (parent) return true;

    // Verificação baseada em estilos computados
    const formElement = firstNameInputRef.current?.closest('form');
    if (formElement) {
        const formBgColor = getComputedStyle(formElement).backgroundColor;
        // Verifica se a cor de fundo é escura
        if (formBgColor) {
            const rgb = formBgColor.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
                const [r, g, b] = rgb.map(Number);
                // Fórmula para calcular o brilho (luminosidade)
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                return brightness < 128; // Se for menor que 128, é um fundo escuro
            }
        }
        if (formBgColor === 'rgb(23, 23, 23)' || formBgColor === 'rgb(15, 15, 15)') { // Matches your dark colors
            return true;
        }
        // Check background of the form's direct parent card as well
        const cardParent = formElement.parentElement;
        if(cardParent){
            const cardParentBgColor = getComputedStyle(cardParent).backgroundColor;
             if (cardParentBgColor === 'rgb(23, 23, 23)' || cardParentBgColor === 'rgb(15, 15, 15)') {
                return true;
            }
        }
    }
    return false;
  }, []);
  
  useEffect(() => {
    setDarkMode(checkDarkMode());
    const observer = new MutationObserver(() => {
      setDarkMode(checkDarkMode());
    });
    if (document.body) {
        observer.observe(document.body, { 
        attributes: true, 
        attributeFilter: ['class', 'style'], // Observe style changes too
        childList: true,
        subtree: true 
        });
    }
    return () => observer.disconnect();
  }, [checkDarkMode]);
  
  const fireConfetti = useCallback(() => { /* ... your confetti logic (looks good) ... */ 
    const count = 200;
    const defaults = { origin: { y: 0.6 }, spread: 100, startVelocity: 30, ticks: 60} as const;
    type FireOptions = ConfettiOptions & { angle?: number; spread?: number; startVelocity?: number; decay?: number; scalar?: number; };
    function fire(particleRatio: number, opts: FireOptions) { confetti?.({...defaults, ...opts, particleCount: Math.floor(count * particleRatio),});}
    fire(0.25, { angle: 60, spread: 55, startVelocity: 65 }); fire(0.2, { angle: 120, spread: 60 });
    fire(0.35, { angle: 100, spread: 100, decay: 0.91, scalar: 0.8 }); fire(0.1, { angle: 150, spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { angle: 30, spread: 120, startVelocity: 45 });
  }, []);
  
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid: isFormValid, isDirty },
    watch,
    setValue,
    // trigger // You might not need trigger if mode is onChange
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: { first_name: '', whatsapp: '', email: '' }
  });
  
  const formatPhoneNumber = useCallback((value: string): string => {
    if (!value) return '';
    
    // Remove tudo que não for dígito
    const phoneNumber = value.replace(/\D/g, '');
    
    // Aplica a máscara (XX) XXXXX-XXXX
    if (phoneNumber.length <= 2) return phoneNumber;
    if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    if (phoneNumber.length <= 10) return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6)}`;
    
    // Limita a 11 dígitos (DDD + 9 dígitos)
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
  }, []);

  const whatsappValue = watch('whatsapp');
  const prevWhatsappValue = useRef('');
  
  useEffect(() => {
    if (whatsappValue && whatsappValue !== prevWhatsappValue.current) {
      const formattedValue = formatPhoneNumber(whatsappValue);
      if (formattedValue !== whatsappValue) {
        setValue('whatsapp', formattedValue, { shouldValidate: true, shouldDirty: true });
      }
    }
    prevWhatsappValue.current = whatsappValue || '';
  }, [whatsappValue, setValue, formatPhoneNumber]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (firstNameInputRef.current) {
        // Your focus logic here - make sure Tailwind focus ring styles are applied
        firstNameInputRef.current.focus({ preventScroll: true }); // preventScroll can be useful
        // Example visual highlight using Tailwind (applied and removed for effect)
        const tempFocusClasses = ['ring-2', 'ring-brutal-blue', 'ring-offset-2', 'ring-offset-background']; // Define ring offset color from theme if possible
        firstNameInputRef.current.classList.add(...tempFocusClasses);
        setTimeout(() => {
          firstNameInputRef.current?.classList.remove(...tempFocusClasses);
        }, 2000);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);


  // Função para redirecionar para o checkout com os parâmetros originais
  const redirectToCheckout = useCallback(() => {
    try {
      // Adiciona os parâmetros da URL ao redirecionamento
      const urlParams = new URLSearchParams(window.location.search);
      const checkoutUrl = new URL(CHECKOUT_URL);
      
      // Copia todos os parâmetros da URL atual para a URL de checkout
      urlParams.forEach((value, key) => {
        checkoutUrl.searchParams.append(key, value);
      });
      
      // Redireciona para a URL de checkout com os parâmetros
      window.location.href = checkoutUrl.toString();
    } catch (error) {
      console.error('Erro ao redirecionar:', error);
      // Em caso de erro, redireciona para a URL base
      window.location.href = CHECKOUT_URL;
    }
  }, []);

  // Função para limpar dados circulares antes do envio
  const cleanDataForSerialization = <T extends object>(data: T): Record<string, unknown> => {
    // Se não for um objeto ou for nulo, retorna como está
    if (data === null || typeof data !== 'object') {
      return data as Record<string, unknown>;
    }
    
    // Se for um array, retorna um novo array
    if (Array.isArray(data)) {
      return data.map(item => 
        typeof item === 'object' && item !== null 
          ? cleanDataForSerialization(item) 
          : item
      ) as unknown as Record<string, unknown>;
    }
    
    // Cria um novo objeto para evitar modificar o original
    const result: Record<string, unknown> = {};
    
    // Itera sobre as chaves do objeto
    for (const key in data) {
      // Ignora propriedades que podem causar referências circulares
      if (key.startsWith('__react') || key === '_owner' || key === '_store') {
        continue;
      }
      
      const value = (data as Record<string, unknown>)[key];
      
      // Se for um elemento DOM, pega apenas as propriedades necessárias
      if (value instanceof HTMLElement) {
        result[key] = {
          tagName: value.tagName,
          id: value.id,
          className: value.className,
          textContent: value.textContent?.substring(0, 100) // Limita o tamanho
        };
      } 
      // Se for um objeto e não for nulo, chama recursivamente
      else if (typeof value === 'object' && value !== null) {
        result[key] = cleanDataForSerialization(value);
      } 
      // Para outros tipos, mantém o valor
      else {
        result[key] = value;
      }
    }
    
    return result;
  };

  // Efeito para rolar suavemente até o topo do formulário quando houver erro
  useEffect(() => {
    if (submitError) {
      // Rola suavemente para o topo do formulário
      const formElement = document.getElementById('lead-capture-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [submitError]);

  // Manipulador de mudança para o campo de WhatsApp
  const handleWhatsAppChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    e.target.value = formattedValue;
    // Dispara o evento de mudança do react-hook-form
    const { onChange } = register('whatsapp');
    if (onChange) {
      const event = { ...e, target: { ...e.target, value: formattedValue } };
      onChange(event);
    }
  }, [formatPhoneNumber, register]);

  // Função para verificar se o webhook está acessível
  const checkWebhookConnectivity = async (): Promise<boolean> => {
    try {
      console.log('Verificando conectividade com o webhook...');
      const response = await fetch(WEBHOOK_URL, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store'
      });
      // Se chegou até aqui, a requisição foi bem-sucedida (mesmo sem acesso à resposta em no-cors)
      console.log('Conexão com o webhook parece estar OK');
      return true;
    } catch (error) {
      console.error('Erro ao conectar ao webhook:', error);
      return false;
    }
  };

  // Função para enviar dados para o webhook de teste
  const sendToWebhook = async (data: LeadData): Promise<boolean> => {
    if (!WEBHOOK_URL) {
      console.error('URL do webhook não definida!');
      return false;
    }
    
    // Prepara os dados do formulário
    const formData = new FormData();
    formData.append('first_name', data.first_name.trim());
    formData.append('whatsapp', `+55${data.whatsapp.replace(/\D/g, '')}`);
    formData.append('email', data.email.trim());
    
    // Adiciona parâmetros da URL se existirem
    const urlParams = getUrlParams();
    Object.entries(urlParams).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    
    try {
      console.log('Enviando dados para o webhook:', {
        url: WEBHOOK_URL,
        data: Object.fromEntries(formData.entries())
      });
      
      // Envia diretamente para o webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
        credentials: 'omit'
      });
      
      console.log('Resposta do webhook (status):', response.status);
      
      // Em modo no-cors, não temos acesso à resposta real
      // Se não deu erro, assumimos que foi enviado
      return true;
      
    } catch (error) {
      console.error('Erro ao enviar para o webhook:', error);
      return false;
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      // 1. Validar campos obrigatórios
      if (!formData.first_name || !formData.whatsapp || !formData.email) {
        throw new Error('Por favor, preencha todos os campos obrigatórios.');
      }

      // 2. Validar formato do email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Por favor, insira um e-mail válido.');
      }

      // 3. Validar formato do WhatsApp
      const whatsappDigits = formData.whatsapp.replace(/\D/g, '');
      if (whatsappDigits.length < 10) {
        throw new Error('Número de WhatsApp inválido. Inclua o DDD (mínimo 10 dígitos).');
      }

      // 4. Preparar dados para o webhook
      const leadData = {
        first_name: formData.first_name.trim(),
        whatsapp: `+55${whatsappDigits}`,
        email: formData.email.trim(),
        ...getUrlParams()
      };

      // 5. Enviar para o webhook
      const webhookSuccess = await sendToWebhook(leadData);
      
      if (!webhookSuccess) {
        throw new Error('Não foi possível enviar seus dados. Por favor, tente novamente mais tarde.');
      }

      // 6. Marcar como sucesso
      setSubmitSuccess(true);
      fireConfetti();
      
      // 7. Feedback visual de sucesso
      toast({
        title: "✅ INSCRIÇÃO CONCLUÍDA!",
        description: "Redirecionando para o checkout...",
        className: "bg-brutal-yellow text-brutal-darker font-bold border-2 border-brutal-dark",
        duration: 3000
      });
      
          // 8. Integração com Google Tag Manager (se disponível)
      if (typeof window !== 'undefined' && window.dataLayer) {
        try {
          window.dataLayer.push({
            event: 'formSubmissionSuccess',
            formId: 'lead_capture_main',
            leadData: { 
              email: formData.email, 
              has_name: !!formData.first_name, 
              has_whatsapp: !!formData.whatsapp 
            }
          } as DataLayerEvent);
        } catch (e) {
          console.error('Erro ao enviar para GTM:', e);
        }
      }
      
      // 9. Redirecionar para o checkout
      const checkoutUrl = new URL(CHECKOUT_URL);
      checkoutUrl.searchParams.set('first_name', leadData.first_name);
      checkoutUrl.searchParams.set('email', leadData.email);
      checkoutUrl.searchParams.set('whatsapp', leadData.whatsapp.replace(/\D/g, ''));
      
      // 10. Redirecionar após um pequeno delay
      setTimeout(() => {
        try { 
          confetti?.reset();
          window.location.href = checkoutUrl.toString();
        } catch (e) {
          console.error('Erro ao limpar confetti:', e);
        } finally {
          // Redireciona para o checkout com os parâmetros da URL
          redirectToCheckout();
          
          // Chama o onComplete para limpar qualquer estado se necessário
          onComplete();
        }
      }, 2000);
      
    } catch (error: unknown) {
      const err = error as Error & { code?: string; details?: string; message?: string };
      console.error('Erro ao salvar lead:', error);
      
      // Mapeamento de erros
      let errorMessage = 'Erro ao processar sua inscrição. Por favor, tente novamente.';
      
      if (err.code === '23505' || err.message?.includes('duplicate key')) {
        errorMessage = 'Este e-mail já está cadastrado. Redirecionando...';
        // Se for um erro de duplicado, consideramos sucesso para redirecionar
        setTimeout(() => onComplete(), 1500);
      } else if (err.message?.includes('permission denied') || err.code === '42501') {
        errorMessage = 'Erro de permissão. Por favor, entre em contato com o suporte.';
      } else if (err.message?.match(/network|timeout|falha de rede/i)) {
        errorMessage = 'Problema de conexão. Verifique sua internet e tente novamente.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Só mostra erro se não for um erro de duplicado
      if (!err.message?.includes('duplicate') && err.code !== '23505') {
        setSubmitError(errorMessage);
        toast({
          title: "❌ ERRO AO SALVAR", 
          description: errorMessage,
          variant: "destructive",
          duration: 6000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Classes reutilizáveis para estilização consistente
  const inputClasses = `
    font-sans w-full border-2 rounded-md shadow-sm 
    py-4 px-4 text-base transition-all duration-200 ease-in-out 
    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-opacity-50
    ${darkMode 
      ? 'bg-brutal-dark/30 border-brutal-paper/30 text-brutal-paper placeholder:text-brutal-paper/60 focus:ring-brutal-yellow focus:border-brutal-yellow' 
      : 'bg-white/90 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-brutal-red focus:border-brutal-red focus:ring-opacity-50'
    }
    sm:text-base sm:py-4
    hover:shadow-md hover:border-opacity-80
  `;
  const labelClasses = `
    font-sans text-sm font-medium select-none 
    mb-2 block ${darkMode ? 'text-brutal-paper/90' : 'text-gray-700'}
    sm:text-sm
  `;
  const errorMsgClasses = `text-xs mt-1.5 font-sans flex items-center gap-1.5 ${darkMode ? 'text-brutal-yellow' : 'text-red-600'}`;
  const reqAsterisk = <span className={`ml-0.5 ${darkMode ? 'text-brutal-yellow' : 'text-red-600'}`} aria-hidden="true">*</span>;
  
  // Estilos para o botão de envio
  const submitButtonClasses = `
    w-full py-5 px-6 text-lg font-bold rounded-lg shadow-lg
    transition-all duration-200 ease-in-out transform active:scale-95
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-75
    h-auto whitespace-normal
    ${darkMode 
      ? 'bg-brutal-yellow text-brutal-darker hover:bg-brutal-yellow/90 hover:shadow-xl hover:-translate-y-1 focus:ring-brutal-yellow' 
      : 'bg-brutal-red text-white hover:bg-brutal-red/90 hover:shadow-xl hover:-translate-y-1 focus:ring-brutal-red'
    }
    disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md
    sm:text-xl sm:py-5
  `;

  return (
    <form 
      id="lead-capture-form"
      onSubmit={handleSubmit(onSubmit)} 
      className={`space-y-5 sm:space-y-6 ${className}`}
      noValidate
      aria-label="Formulário de captação de leads"
      aria-live="polite"
    >
      <div className="space-y-1.5"> {/* Nome */}
        <div className="flex items-baseline justify-between">
          <Label htmlFor="first_name" className={labelClasses}>Seu Nome {reqAsterisk}</Label>
          {errors.first_name && <span className={errorMsgClasses} role="alert">{errors.first_name.message}</span>}
        </div>
        <Input
          id="first_name"
          ref={firstNameInputRef}
          placeholder="Nome Completo (Obrigatório)"
          autoComplete="name"
          className={`${inputClasses} ${errors.first_name ? (darkMode ? '!border-brutal-yellow/70' : '!border-destructive') : ''}`}
          {...register('first_name', {
            required: 'Seu nome é fundamental.',
            minLength: { value: 3, message: 'Pelo menos 3 letras no nome.' }
          })}
          aria-required="true"
          aria-invalid={!!errors.first_name}
        />
      </div>

      <div className="space-y-1.5"> {/* WhatsApp */}
        <div className="flex items-baseline justify-between">
          <Label htmlFor="whatsapp" className={labelClasses}>
            Seu WhatsApp {reqAsterisk}
          </Label>
          {errors.whatsapp && (
            <span className={errorMsgClasses} role="alert">
              {errors.whatsapp.message}
            </span>
          )}
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </div>
          <Input
            id="whatsapp"
            type="tel"
            placeholder="(XX) XXXXX-XXXX"
            autoComplete="tel"
            className={`pl-10 ${inputClasses} ${errors.whatsapp ? (darkMode ? '!border-brutal-yellow/70' : '!border-red-500') : ''}`}
            {...register('whatsapp', {
              required: 'Informe um número de WhatsApp',
              pattern: {
                value: /^\(\d{2}\) \d{4,5}-\d{4}$/,
                message: 'Formato: (XX) XXXXX-XXXX'
              },
              minLength: {
                value: 15, // (XX) XXXXX-XXXX tem 15 caracteres
                message: 'Número incompleto'
              }
            })}
            onChange={handleWhatsAppChange}
            aria-required="true"
            aria-invalid={!!errors.whatsapp}
            aria-describedby={errors.whatsapp ? 'whatsapp-error' : undefined}
          />
        </div>
        {!errors.whatsapp && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enviaremos um código de confirmação por WhatsApp
          </p>
        )}
      </div>

      <div className="space-y-1.5"> {/* Email */}
        <div className="flex items-baseline justify-between">
          <Label htmlFor="email" className={labelClasses}>Seu Melhor E-mail {reqAsterisk}</Label>
          {errors.email && <span className={errorMsgClasses} role="alert">{errors.email.message}</span>}
        </div>
        <Input
          id="email"
          type="email"
          placeholder="seu.melhor@email.com (Obrigatório)"
          autoComplete="email"
          className={`${inputClasses} ${errors.email ? (darkMode ? '!border-brutal-yellow/70' : '!border-destructive') : ''}`}
          {...register('email', {
            required: 'Email é vital para o acesso.',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Este e-mail parece incorreto.'
            }
          })}
          aria-required="true"
          aria-invalid={!!errors.email}
        />
      </div>
        
      {/* Submit Button and Messages */}
      <div className="pt-1 space-y-3">
        <Button
          type="submit"
          disabled={loading || !isFormValid || submitSuccess}
          className={`${submitButtonClasses} ${!isFormValid ? 'opacity-70 cursor-not-allowed' : ''}`}
          aria-busy={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className={`h-4 w-4 border-2 rounded-full animate-spin ${darkMode ? 'border-brutal-darker border-t-transparent' : 'border-white border-t-transparent'}`} />
              PROCESSANDO...
            </span>
          ) : submitSuccess ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              SUCESSO! REDIRECIONANDO...
            </span>
          ) : (
            <span className="font-medium">DESTRAVAR MINHA OFERTA AGORA!</span>
          )}
        </Button>
        
        {submitError && (
          <div 
            className={`p-3 text-sm rounded-lg border ${darkMode 
              ? 'border-red-500/30 bg-red-900/20 text-red-200' 
              : 'border-red-300 bg-red-50 text-red-700'
            } animate-fade-in`} 
            role="alert"
          >
            <div className="flex items-start">
              <svg className="w-5 h-5 flex-shrink-0 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-semibold">Ocorreu um erro</p>
                <p className="mt-0.5">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        {!isFormValid && isDirty && !loading && !submitError && (
          <div 
            className={`p-3 rounded-lg border ${darkMode 
              ? 'border-amber-500/30 bg-amber-900/20 text-amber-200' 
              : 'border-amber-300 bg-amber-50 text-amber-700'
            }`} 
            role="alert"
          >
            <div className="flex items-start">
              <svg className="w-5 h-5 flex-shrink-0 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">Preencha corretamente</p>
                <p className="text-sm mt-0.5">Verifique os campos em destaque para continuar.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default LeadCaptureForm;