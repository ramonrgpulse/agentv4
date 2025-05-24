import { useState, useEffect } from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import type { DataLayerEvent } from '@/types/globals';

// Tipos para a tabela de leads
type Lead = {
  id?: string;
  first_name: string;
  whatsapp: string;
  email: string;
  created_at?: string;
  updated_at?: string;
};

// Extensão dos tipos do Supabase
declare module '@supabase/supabase-js' {
  interface Database {
    public: {
      Tables: {
        leads: {
          Row: Lead;
          Insert: Omit<Lead, 'id' | 'created_at'>;
          Update: Partial<Lead>;
        };
      };
    };
  }
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

interface LeadData {
  first_name?: string;
  whatsapp?: string;
  email?: string;
  created_at?: string;
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
    // Only save when form is not complete and we have at least email and whatsapp
    if ((!watchEmail || !watchWhatsapp) || (watchName && watchEmail && watchWhatsapp)) return;
    
    const saveField = async (): Promise<void> => {
      try {
        // Basic validation
        if (!watchEmail || !watchWhatsapp) return;
        
        const leadData = {
          first_name: watchName || 'Não informado',
          whatsapp: watchWhatsapp.replace(/\D/g, ''),
          email: watchEmail,
          created_at: new Date().toISOString()
        };
        
        console.log('Tentando salvar lead:', leadData);
        
        const { data, error } = await supabase
          .from('leads')
          .upsert(leadData, { 
            onConflict: 'email',
            ignoreDuplicates: false
          })
          .select();
        
        if (error) throw error;
        
        console.log('Lead salvo com sucesso:', data);
        
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao salvar campo:', errorMessage);
      }
    };
    
    const debounceTimer = setTimeout(() => {
      saveField().catch(console.error);
    }, 1000);
    
    return () => clearTimeout(debounceTimer);
  }, [watchName, watchWhatsapp, watchEmail]);

  // Função para testar a conexão com o Supabase
  const testSupabaseConnection = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Testa uma inserção simples
      const testData = {
        first_name: 'Teste',
        whatsapp: '5511999999999',
        email: `teste_${Date.now()}@teste.com`,
        created_at: new Date().toISOString()
      };
      
      console.log('Testando inserção com dados:', testData);
      
      const { data, error } = await supabase
        .from('leads')
        .insert(testData)
        .select();
      
      if (error) throw error;
      
      console.log('Dados de teste inseridos:', data);
      
      // Tenta remover os dados de teste
      if (data && data[0]?.id) {
        await supabase
          .from('leads')
          .delete()
          .eq('id', data[0].id);
      }
      
      toast({
        title: "✅ Conexão com o banco de dados bem-sucedida!",
        description: "O banco de dados está respondendo corretamente.",
        variant: "default",
        className: "bg-green-500 text-white"
      });
      
    } catch (error: unknown) {
      console.error('Erro ao testar conexão:', error);
      
      let errorMessage = 'Erro desconhecido ao conectar ao banco de dados';
      
      if (error instanceof Error) {
        if (error.message.includes('permission denied')) {
          errorMessage = 'Erro de permissão. Verifique as políticas de segurança (RLS) no Supabase.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Erro de rede. Verifique sua conexão com a internet.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "❌ Erro na conexão",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      
      // Validação adicional
      if (!formData.email || !formData.whatsapp) {
        throw new Error('E-mail e WhatsApp são obrigatórios');
      }
      
      // Formata o WhatsApp para remover caracteres não numéricos
      const formattedWhatsapp = formData.whatsapp.replace(/\D/g, '');
      
      // Dados do lead para salvar
      const leadData: LeadRecord = {
        first_name: formData.first_name || 'Não informado',
        whatsapp: formattedWhatsapp,
        email: formData.email,
        created_at: new Date().toISOString()
      };
      
      console.log('Enviando dados do formulário:', leadData);
      
      // Salva no Supabase
      const { data, error } = await supabase
        .from('leads')
        .upsert([leadData], { 
          onConflict: 'email',
          ignoreDuplicates: false
        })
        .select();
      
      if (error) throw error;
      
      console.log('Lead salvo com sucesso:', data);
      
      // Track form submission in the data layer
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        const leadInfo = {
          name: formData.first_name,
          has_whatsapp: Boolean(formData.whatsapp),
          has_email: Boolean(formData.email)
        };
        
        const event: DataLayerEvent = {
          event: 'lead_captured',
          lead_info: leadInfo
        };
        
        window.dataLayer.push(event);
      }
      
      // Mostra mensagem de sucesso
      toast({
        title: "✅ Dados salvos com sucesso!",
        description: "Redirecionando para a oferta...",
        variant: "default",
        className: "bg-gradient-to-r from-green-500 to-green-700 text-white"
      });
      
      // Chama a função de conclusão após um pequeno delay
      setTimeout(() => {
        onComplete();
      }, 1000);
      
    } catch (error: unknown) {
      console.error('Erro ao salvar lead:', error);
      
      let errorMessage = 'Erro ao salvar os dados. Por favor, tente novamente.';
      
      if (error instanceof Error) {
        if (error.message.includes('permission denied')) {
          errorMessage = 'Erro de permissão. Verifique as políticas de segurança (RLS) no Supabase.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Erro de rede. Verifique sua conexão com a internet.';
        } else if (error.message.includes('duplicate key')) {
          errorMessage = 'Este e-mail já está cadastrado.';
        } else {
          errorMessage = error.message;
        }
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
