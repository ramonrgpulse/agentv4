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
const WEBHOOK_URL = 'https://programa8webhook.rgpulse.com.br/webhook/persons';
const CHECKOUT_URL = 'https://pay.herospark.com/rg-pulse-agente-criador-de-avatar-aprofundado-412999';

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
  
  // Adiciona todos os parâmetros da URL ao objeto de resultado
  params.forEach((value, key) => {
    result[key] = value;
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
    // Check ancestor elements for dark theme classes or specific dark background colors
    let parent = firstNameInputRef.current?.closest('.bg-brutal-darker, .bg-brutal-dark, .dark-theme-section');
    if (parent) return true;

    // More robust check based on computed styles (can be slow if overused)
    // This is a fallback if classes aren't specific enough
    // Consider passing a theme prop down instead of this intensive check
    const formElement = firstNameInputRef.current?.closest('form');
    if (formElement) {
        const formBgColor = getComputedStyle(formElement).backgroundColor;
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
  
  const formatPhoneNumber = (value: string) => {
    const onlyNums = value.replace(/\D/g, '');
    if (onlyNums.length <= 2) return `(${onlyNums}`;
    if (onlyNums.length <= 6) return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2)}`;
    if (onlyNums.length <= 10) return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2, 6)}-${onlyNums.slice(6)}`;
    return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2, 7)}-${onlyNums.slice(7, 11)}`;
  };
  
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
  }, [whatsappValue, setValue]);

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

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      // 1. Validação dos dados
      const formattedWhatsapp = formData.whatsapp.replace(/\D/g, '');
      if (formattedWhatsapp.length < 10 || formattedWhatsapp.length > 11) {
        throw new Error('Número de WhatsApp inválido. Inclua o DDD (mínimo 10 dígitos).');
      }

      // 2. Obter parâmetros da URL
      const urlParams = getUrlParams();
      
      // 3. Preparar dados do lead para o webhook
      const leadData: LeadData = {
        // Dados do formulário
        first_name: formData.first_name.trim() || 'Leitor Interessado',
        whatsapp: formattedWhatsapp,
        email: formData.email.toLowerCase().trim(),
        
        // Adiciona todos os parâmetros da URL ao payload
        ...urlParams,
        
        // Garante que os parâmetros UTM e de rastreamento estejam no nível raiz
        utm_source: urlParams.utm_source,
        utm_medium: urlParams.utm_medium,
        utm_campaign: urlParams.utm_campaign,
        utm_term: urlParams.utm_term,
        utm_content: urlParams.utm_content,
        fbclid: urlParams.fbclid,
        gclid: urlParams.gclid,
        gbraid: urlParams.gbraid,
        wbraid: urlParams.wbraid,
      };
      
      // 4. Feedback visual para o usuário
      toast({
        title: "PROCESSANDO SEUS DADOS...",
        description: "Aguarde um instante, estamos confirmando sua inscrição.",
      });
      
      // 5. Enviar para o webhook com timeout
      const fetchPromise = fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      // Timeout para evitar espera infinita
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Tempo de conexão esgotado. Tente novamente.')), 10000)
      );

      // Usa Promise.race para implementar o timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]);

      // Verificar se a requisição foi bem-sucedida
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao enviar dados. Tente novamente.');
      }

      // 5. Integração com Google Tag Manager (se disponível)
      if (typeof window !== 'undefined' && window.dataLayer) {
        try {
          window.dataLayer.push({
            event: 'formSubmissionSuccess',
            formId: 'lead_capture_main',
            leadData: { 
              email: leadData.email, 
              has_name: !!leadData.first_name, 
              has_whatsapp: !!leadData.whatsapp 
            }
          } as DataLayerEvent);
        } catch (e) {
          console.error('Erro ao enviar para GTM:', e);
        }
      }
      
      // 6. Feedback de sucesso
      setSubmitSuccess(true);
      fireConfetti();
      
      toast({
        title: "✅ INSCRIÇÃO CONFIRMADA!",
        description: "Redirecionando para o checkout...",
        className: "bg-brutal-yellow text-brutal-darker font-bold border-2 border-brutal-dark",
        duration: 3000
      });
      
      // 7. Redirecionamento após um pequeno delay
      setTimeout(() => {
        try { 
          confetti?.reset();
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

  const inputClasses = `font-sans mt-1 w-full border-2 rounded-sm shadow-inner py-2.5 sm:py-3 px-4 text-sm sm:text-base transition-colors duration-200 ease-in-out hover:border-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 ${darkMode ? 'bg-brutal-dark/30 border-brutal-paper/30 text-brutal-paper placeholder:text-brutal-paper/50 focus:ring-brutal-yellow focus:border-brutal-yellow' : 'bg-brutal-oldpaper/50 border-foreground/30 text-foreground placeholder:text-muted-foreground/70 focus:ring-brutal-red focus:border-brutal-red'}`;
  const labelClasses = `font-oswald text-xs sm:text-sm uppercase tracking-wider font-bold select-none flex items-center gap-1 ${darkMode ? 'text-brutal-paper/90' : 'text-foreground'}`;
  const errorMsgClasses = `text-xs mt-1 font-sans flex items-start gap-1 ${darkMode ? 'text-brutal-yellow' : 'text-destructive'}`;
  const reqAsterisk = <span className={`${darkMode ? 'text-brutal-yellow' : 'text-destructive'}`} aria-hidden="true">*</span>;

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className={`space-y-5 sm:space-y-6 ${className}`}
      noValidate 
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
          <Label htmlFor="whatsapp" className={labelClasses}>Seu WhatsApp {reqAsterisk}</Label>
          {errors.whatsapp && <span className={errorMsgClasses} role="alert">{errors.whatsapp.message}</span>}
        </div>
        <Input
          id="whatsapp"
          type="tel"
          placeholder="(XX) XXXXX-XXXX (Obrigatório)"
          autoComplete="tel"
          className={`${inputClasses} ${errors.whatsapp ? (darkMode ? '!border-brutal-yellow/70' : '!border-destructive') : ''}`}
          {...register('whatsapp', {
            required: 'WhatsApp é chave para contato.',
            pattern: {
              value: /^\(\d{2}\) \d{4,5}-\d{4}$/,
              message: 'Use (XX) XXXXX-XXXX.'
            }
          })}
          aria-required="true"
          aria-invalid={!!errors.whatsapp}
        />
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
      <div className="pt-2 space-y-3">
        <Button
          type="submit"
          disabled={loading || !isFormValid || (isDirty && !isFormValid) || submitSuccess} // More robust disabled check
          className={`w-full font-oswald font-bold py-3.5 sm:py-4 px-4 sm:px-8 text-base sm:text-lg rounded-sm shadow-brutal-md border-2 hover:shadow-brutal-lg active:translate-y-0.5 active:shadow-brutal-base disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-100 uppercase tracking-wider
            ${submitSuccess
              ? 'bg-brutal-green text-brutal-darker border-brutal-darker hover:bg-brutal-green/90'
              : darkMode
                ? 'bg-gradient-to-r from-brutal-yellow to-brutal-orange text-brutal-darker border-brutal-darker hover:from-brutal-orange hover:to-brutal-yellow'
                : 'bg-gradient-to-r from-brutal-red via-brutal-orange to-brutal-yellow text-brutal-darker border-brutal-darker hover:from-brutal-yellow hover:to-brutal-red'
            }
          `}
          aria-busy={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className={`h-4 w-4 border-2 rounded-full animate-spin ${darkMode ? 'border-brutal-darker border-t-transparent' : 'border-primary-foreground border-t-transparent'}`} />
              PROCESSANDO...
            </span>
          ) : submitSuccess ? (
            <span className="flex items-center justify-center gap-2">✓ SUCESSO! REDIRECIONANDO...</span>
          ) : (
            <span className="drop-shadow-sm">DESTRAVAR MINHA OFERTA AGORA!</span>
          )}
        </Button>
        
        {submitError && (
          <div className={`p-3 text-center text-sm font-medium rounded-sm border ${darkMode ? 'border-brutal-yellow/50 bg-brutal-yellow/10 text-brutal-yellow' : 'border-destructive/30 bg-destructive/10 text-destructive'} animate-fade-in`} role="alert">
            <strong className="font-oswald block mb-0.5">❌ Falha na Missão:</strong> {submitError}
          </div>
        )}

        {!isFormValid && isDirty && !loading && !submitError && ( // Show validation hint only if form is dirty, not valid, not loading, and no submit error
          <div className={`mt-2 p-3 text-xs rounded-sm border-l-4 ${darkMode ? 'bg-brutal-dark/50 border-brutal-orange text-brutal-paper/80' : 'bg-amber-50 border-amber-500 text-amber-700'} font-sans`} role="alert">
            <p className="font-semibold">Quase lá!</p>
            <p>Verifique os campos em destaque e preencha corretamente para ativar o botão.</p>
          </div>
        )}
      </div>
    </form>
  );
};

export default LeadCaptureForm;