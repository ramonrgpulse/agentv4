
import { useState, useEffect } from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";

interface LeadFormProps {
  onComplete: () => void;
  className?: string;
}

interface FormData {
  first_name: string;
  whatsapp: string;
  email: string;
}

interface LeadData {
  first_name?: string;
  whatsapp?: string;
  email?: string;
}

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

declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
  }
}

const LeadCaptureForm = ({ onComplete, className = "" }: LeadFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formComplete, setFormComplete] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      first_name: '',
      whatsapp: '',
      email: ''
    }
  });
  
  // Watch all fields to check if form is complete
  const watchName = watch("first_name", "") as string;
  const watchWhatsapp = watch("whatsapp", "") as string;
  const watchEmail = watch("email", "") as string;
  
  // Check if all fields have values to enable the button
  useEffect(() => {
    if (watchName && watchWhatsapp && watchEmail) {
      setFormComplete(true);
      
      // Track form completion in the data layer
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        const leadInfo = {
          has_name: Boolean(watchName),
          has_whatsapp: Boolean(watchWhatsapp),
          has_email: Boolean(watchEmail)
        };
        
        const event: DataLayerEvent = {
          event: 'form_complete',
          lead_info: leadInfo
        };
        
        window.dataLayer.push(event);
      }
    } else {
      setFormComplete(false);
    }
  }, [watchName, watchWhatsapp, watchEmail]);
  
  // Save field to Supabase as user types
  useEffect(() => {
    // Only save data when a field has a value
    if (!watchName && !watchWhatsapp && !watchEmail) return;
    
    const saveField = async () => {
      try {
        const data: LeadData = {};
        
        // Only include fields with values
        if (watchName) data.first_name = watchName;
        if (watchWhatsapp) data.whatsapp = watchWhatsapp;
        if (watchEmail) data.email = watchEmail;
        
        // Only try to save if we have at least one field with value
        if (Object.keys(data).length > 0) {
          const { error } = await supabase
            .from('leads')
            .upsert([data], { onConflict: 'email' });
          
          if (error) throw error;
          
          console.log('Field saved successfully:', data);
          
          // Track field completion in data layer
          if (typeof window !== 'undefined') {
            window.dataLayer = window.dataLayer || [];
            const fieldEvent: DataLayerEvent = {
              event: 'field_complete',
              field_name: Object.keys(data).join('_'),
              field_values_complete: Object.values(data).some(Boolean)
            };
            window.dataLayer.push(fieldEvent);
          }
        }
      } catch (error) {
        console.error('Error saving field:', error);
      }
    };
    
    const debounceTimer = setTimeout(() => {
      saveField();
    }, 800); // Increased debounce time for better UX
    
    return () => clearTimeout(debounceTimer);
  }, [watchName, watchWhatsapp, watchEmail]);

  // Função para testar a conexão com o Supabase
  const testSupabaseConnection = async () => {
    try {
      setLoading(true);
      
      // Testa uma consulta simples à tabela leads
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .limit(1);
      
      if (error) throw error;
      
      toast({
        title: "Conexão com o banco de dados bem-sucedida!",
        description: `Encontrados ${data?.length || 0} registros.`,
        variant: "default",
        className: "bg-green-500 text-white"
      });
      
    } catch (error: any) {
      console.error('Erro ao testar conexão:', error);
      toast({
        title: "Erro na conexão com o banco de dados",
        description: error?.message || 'Não foi possível conectar ao banco de dados',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      
      // Validação adicional
      if (!data.email || !data.whatsapp) {
        throw new Error('E-mail e WhatsApp são obrigatórios');
      }
      
      // Formata o WhatsApp para remover caracteres não numéricos
      const formattedWhatsapp = data.whatsapp.replace(/\D/g, '');
      
      // Final save to make sure we have all data
      const { data: result, error } = await supabase
        .from('leads')
        .upsert([{ 
          first_name: data.first_name || 'Não informado',
          whatsapp: formattedWhatsapp,
          email: data.email,
          created_at: new Date().toISOString()
        }], { 
          onConflict: 'email',
          ignoreDuplicates: false
        })
        .select();
      
      if (error) throw error;
      
      console.log('Lead salvo com sucesso:', result);
      
      // Track form submission in the data layer
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        const leadInfo = {
          name: data.first_name,
          has_whatsapp: Boolean(data.whatsapp),
          has_email: Boolean(data.email)
        };
        window.dataLayer.push({
          event: 'lead_captured',
          lead_info: leadInfo
        });
      }
      
      toast({
        title: "✅ Dados salvos com sucesso!",
        description: "Redirecionando para a oferta...",
        variant: "default",
        className: "bg-gradient-to-r from-green-500 to-green-700 text-white"
      });
      
      // Call the onComplete callback to redirect
      setTimeout(() => {
        onComplete();
      }, 1000);
    } catch (error: any) {
      console.error('Erro ao salvar lead:', error);
      
      let errorMessage = 'Erro ao salvar os dados. Por favor, tente novamente.';
      
      // Mensagens de erro mais específicas
      if (error.message.includes('permission denied')) {
        errorMessage = 'Erro de permissão. Verifique as políticas de segurança do banco de dados.';
      } else if (error.message.includes('connection')) {
        errorMessage = 'Erro de conexão com o servidor. Verifique sua conexão com a internet.';
      } else if (error.message.includes('duplicate key')) {
        errorMessage = 'Este e-mail já está cadastrado.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "❌ Erro ao salvar",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${className}`}>
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold text-lg mb-2">Teste de Conexão</h3>
        <p className="text-sm text-gray-600 mb-3">Verifique se o banco de dados está respondendo</p>
        <Button 
          type="button" 
          onClick={testSupabaseConnection}
          disabled={loading}
          variant="outline"
          className="w-full"
        >
          {loading ? 'Testando...' : 'Testar Conexão com o Banco'}
        </Button>
      </div>
      
      <div>
        <Label htmlFor="first_name" className="font-bold text-brutal-red text-lg">
          Seu Nome
        </Label>
        <Input
          id="first_name"
          placeholder="Digite seu nome"
          {...register("first_name", { required: "Nome é obrigatório" })}
          className="mt-2 bg-white border-brutal-red border-2"
        />
        {errors.first_name && (
          <p className="text-brutal-red text-sm mt-1">{errors.first_name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="whatsapp" className="font-bold text-brutal-red text-lg">
          WhatsApp
        </Label>
        <Input
          id="whatsapp"
          placeholder="(00) 00000-0000"
          {...register("whatsapp", { 
            required: "WhatsApp é obrigatório",
            pattern: {
              value: /^\(?([0-9]{2})\)?[-. ]?([0-9]{5})[-. ]?([0-9]{4})$/,
              message: "Digite um número de WhatsApp válido"
            }
          })}
          className="mt-2 bg-white border-brutal-red border-2"
        />
        {errors.whatsapp && (
          <p className="text-brutal-red text-sm mt-1">{errors.whatsapp.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email" className="font-bold text-brutal-red text-lg">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="seuemail@exemplo.com"
          {...register("email", { 
            required: "Email é obrigatório",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Digite um email válido"
            }
          })}
          className="mt-2 bg-white border-brutal-red border-2"
        />
        {errors.email && (
          <p className="text-brutal-red text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {formComplete && (
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-brutal-red via-brutal-orange to-brutal-yellow hover:from-brutal-yellow hover:to-brutal-red text-black font-bold py-6 px-12 text-xl md:text-2xl rounded-lg transition-all duration-300 transform hover:scale-110 animate-pulse-brutal w-full shadow-2xl"
        >
          {loading ? "Enviando..." : "LIBERAR MINHA OFERTA AGORA!"}
        </Button>
      )}
    </form>
  );
};

export default LeadCaptureForm;
