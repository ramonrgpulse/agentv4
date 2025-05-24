
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

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      
      // Final save to make sure we have all data
      const { error } = await supabase
        .from('leads')
        .upsert([{ 
          first_name: data.first_name,
          whatsapp: data.whatsapp,
          email: data.email,
        }], { onConflict: 'email' });
      
      if (error) throw error;
      
      console.log('Lead captured successfully:', data);
      
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
        title: "Dados salvos com sucesso!",
        description: "Redirecionando para a oferta...",
        variant: "default",
        className: "bg-gradient-to-r from-brutal-red to-brutal-orange text-white"
      });
      
      // Call the onComplete callback to redirect
      setTimeout(() => {
        onComplete();
      }, 1000);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erro ao salvar dados",
        description: "Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${className}`}>
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
