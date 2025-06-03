import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { CheckCircle, XCircle, Lock, ArrowRight, Send } from "lucide-react";
import { Label } from "../../components/ui/label";
import type { DataLayerEvent } from '../../types/globals';
import { GTMEvents } from '../../lib/gtm';

// URL do webhook para envio dos dados
const WEBHOOK_URL = 'https://programa8webhook.rgpulse.com.br/webhook/persona';

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

interface ModernLeadFormProps {
  onSubmit?: (data: { name: string; email: string; phone?: string }) => void;
  onSubmitSuccess?: () => void;
  showPhone?: boolean;
  variant?: "light" | "dark" | "paper";
  ctaText?: string;
  buttonText?: string;
  formTitle?: string;
  formId?: string;
  ctaSection?: string;
  buttonClassName?: string;
  inputVariant?: string;
  privacyPolicyLink?: string;
  title?: string;
  subtitle?: string;
  trackingSection?: string;
  fields?: { name: string; placeholder: string; required: boolean }[];
  showSuccessMessage?: boolean;
  redirectUrl?: string;
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

export const ModernLeadForm = ({
  onSubmit,
  onSubmitSuccess,
  showPhone = true,
  variant = "light",
  ctaText = "Quero receber agora",
  buttonText,
  formTitle = "Acesse agora mesmo",
  formId,
  ctaSection,
  buttonClassName = "",
  inputVariant,
  privacyPolicyLink = "/politica-de-privacidade",
  title,
  subtitle,
  trackingSection,
  fields,
  showSuccessMessage = true,
  redirectUrl,
}: ModernLeadFormProps) => {
  const firstNameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = showPhone ? 3 : 2;

  // Verificar formato de email
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validar o campo atual
  const validateCurrentField = () => {
    const newErrors = { ...errors };
    
    if (currentStep === 1 && !name.trim()) {
      newErrors.name = "Por favor, informe seu nome";
      setErrors(newErrors);
      return false;
    }
    
    if (currentStep === 2 && !validateEmail(email)) {
      newErrors.email = "Por favor, informe um email válido";
      setErrors(newErrors);
      return false;
    }
    
    if (currentStep === 3 && showPhone && !phone.trim()) {
      newErrors.phone = "Por favor, informe seu telefone";
      setErrors(newErrors);
      return false;
    }
    
    return true;
  };

  // Avançar para o próximo passo
  const goToNextStep = () => {
    if (validateCurrentField()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  // Função para limpar dados circulares antes do envio
  const cleanDataForSerialization = <T extends Record<string, unknown>>(data: T): Record<string, unknown> => {
    const cleaned: Record<string, unknown> = {};
    
    // Lista de tipos primitivos ou seguros para serialização
    const safeTypes = ['string', 'number', 'boolean', 'undefined'];
    
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        const valueType = typeof value;
        
        // Se for um tipo primitivo, adiciona diretamente
        if (safeTypes.includes(valueType)) {
          cleaned[key] = value;
        }
        // Se for null, adiciona como null
        else if (value === null) {
          cleaned[key] = null;
        }
        // Se for um array, mapeia recursivamente
        else if (Array.isArray(value)) {
          cleaned[key] = value.map(item => {
            if (typeof item === 'object' && item !== null) {
              return cleanDataForSerialization(item as Record<string, unknown>);
            }
            return item;
          });
        }
        // Se for um objeto, processa recursivamente
        else if (valueType === 'object') {
          try {
            // Testa se é serializável
            JSON.stringify(value);
            cleaned[key] = value;
          } catch (e) {
            // Se não for serializável, converte para string ou remove
            if (value && typeof value.toString === 'function' && value.toString() !== '[object Object]') {
              cleaned[key] = value.toString();
            } else {
              // Remove propriedades não serializáveis
              cleaned[key] = `[Objeto não serializável: ${key}]`;
            }
          }
        }
        // Para outros tipos (como funções), converte para string ou ignora
        else {
          if (value && typeof value.toString === 'function' && value.toString() !== '[object Object]') {
            cleaned[key] = value.toString();
          }
        }
      }
    }
    
    return cleaned;
  };

  // Função para enviar dados para o webhook
  const sendToWebhook = async (data: LeadData): Promise<boolean> => {
    try {
      const cleanedData = cleanDataForSerialization(data);
      console.log('Enviando dados para o webhook:', cleanedData);
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro do webhook:', errorText);
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('Resposta do webhook:', responseData);
      return true;
    } catch (error) {
      console.error('Erro ao enviar para o webhook:', error);
      return false;
    }
  };

  // Processar o envio do formulário
  const handleSubmit = async () => {
    if (validateCurrentField()) {
      setIsSubmitting(true);
      
      try {
        // Preparar dados para envio ao webhook
        const leadData: LeadData = {
          first_name: name,
          whatsapp: phone,
          email: email,
          ...getUrlParams(),
        };
        
        // Enviar dados para o webhook (não para o Supabase)
        const success = await sendToWebhook(leadData);
        
        if (!success) {
          throw new Error('Falha ao enviar dados para o webhook.');
        }
        
        console.log('Dados enviados com sucesso para o webhook');
        
        // Se onSubmit for fornecido, chamar com os dados do formulário
        if (onSubmit) {
          onSubmit({ name, email, phone });
        }
        
        // Mostrar mensagem de sucesso se configurado
        if (showSuccessMessage) {
          setIsSuccess(true);
        }
        
        // Chamar o callback de sucesso se fornecido
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
        
        // Redirecionar para checkout após 1.5 segundos se uma URL for fornecida
        if (redirectUrl) {
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 1500);
        }
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
        setErrors({ ...errors, email: "Ocorreu um erro. Tente novamente." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Obter classes de estilo baseadas na variante
  const getStyleClasses = () => {
    switch (variant) {
      case "dark":
        return {
          bg: "bg-brutal-darker",
          input: "bg-brutal-dark border-brutal-dark/50 text-brutal-paper focus:border-brutal-red/50",
          text: "text-brutal-paper",
          button: "bg-gradient-to-r from-brutal-red to-brutal-orange hover:from-brutal-orange hover:to-brutal-red",
          label: "text-brutal-paper/80",
          error: "text-brutal-red",
        };
      case "paper":
        return {
          bg: "bg-brutal-oldpaper",
          input: "bg-white border-gray-300 text-brutal-darker focus:border-brutal-red/50",
          text: "text-brutal-darker",
          button: "bg-gradient-to-r from-brutal-red to-brutal-orange hover:from-brutal-orange hover:to-brutal-red",
          label: "text-brutal-darker/80",
          error: "text-brutal-red",
        };
      case "light":
      default:
        return {
          bg: "bg-white",
          input: "bg-gray-50 border-gray-200 text-brutal-darker focus:border-brutal-red/50",
          text: "text-brutal-darker",
          button: "bg-gradient-to-r from-brutal-red to-brutal-orange hover:from-brutal-orange hover:to-brutal-red",
          label: "text-brutal-darker/80",
          error: "text-brutal-red",
        };
    }
  };

  const styles = getStyleClasses();

  // Variantes de animação para os campos
  const fieldVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div id={formId} className={`rounded-xl overflow-hidden ${styles.bg} p-6 sm:p-8`}>
      {!isSuccess ? (
        <>
          <div className="mb-6 text-center">
            <h3 className={`text-xl md:text-2xl font-bold mb-2 ${styles.text} font-oswald`}>
              {formTitle}
            </h3>
            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i + 1 <= currentStep ? "w-8 bg-brutal-red" : "w-4 bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>
          </div>
          
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); goToNextStep(); }}>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="name-field"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={fieldVariants}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="name" className={styles.label}>
                      Como podemos te chamar?
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setErrors({ ...errors, name: undefined });
                      }}
                      placeholder="Seu nome"
                      className={`${styles.input} transition-all duration-300 h-12`}
                      autoFocus
                    />
                    {errors.name && (
                      <p className={`text-sm ${styles.error} flex items-center gap-1`}>
                        <XCircle className="h-4 w-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="email-field"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={fieldVariants}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="email" className={styles.label}>
                      Qual seu melhor email?
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({ ...errors, email: undefined });
                      }}
                      placeholder="Seu email"
                      className={`${styles.input} transition-all duration-300 h-12`}
                      autoFocus
                    />
                    {errors.email && (
                      <p className={`text-sm ${styles.error} flex items-center gap-1`}>
                        <XCircle className="h-4 w-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && showPhone && (
                <motion.div
                  key="phone-field"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={fieldVariants}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="phone" className={styles.label}>
                      Qual seu número de telefone?
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setErrors({ ...errors, phone: undefined });
                      }}
                      placeholder="Seu telefone"
                      className={`${styles.input} transition-all duration-300 h-12`}
                      autoFocus
                    />
                    {errors.phone && (
                      <p className={`text-sm ${styles.error} flex items-center gap-1`}>
                        <XCircle className="h-4 w-4" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${styles.button} text-white font-bold py-6 rounded-lg shadow-lg transition-all duration-300 h-auto transform hover:-translate-y-0.5`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {currentStep < totalSteps ? (
                      <>
                        Continuar
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    ) : (
                      <>
                        {ctaText}
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </div>
                )}
              </Button>
            </motion.div>
          </form>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
            <Lock className="h-3 w-3" />
            <span>Seus dados estão seguros</span>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h3 className={`text-xl font-bold mb-2 ${styles.text} font-oswald`}>
            Obrigado, {name}!
          </h3>
          <p className={`${styles.label} mb-4`}>
            {redirectUrl ? "Você será redirecionado em instantes..." : "Seu acesso foi liberado. Verifique seu email para as próximas instruções."}
          </p>
          <div className="w-16 h-1 bg-brutal-red/30 mx-auto"></div>
        </motion.div>
      )}
    </div>
  );
};
