import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Zap } from "lucide-react";

interface BenefitItem {
  text: string;
}

interface ConversionCTAProps {
  title?: string;
  subtitle?: string;
  description?: string;
  benefits?: BenefitItem[];
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundColor?: "black" | "red" | "yellow" | "oldpaper";
}

export const ConversionCTA: React.FC<ConversionCTAProps> = ({
  title = "Pronto para transformar sua forma de vender?",
  subtitle = "INSCRIÇÕES ABERTAS",
  description = "Tenha acesso a um método completo e comprovado para vender seus produtos e serviços digitais com mais consistência e menos estresse.",
  benefits = [
    { text: "14 módulos de conteúdo estratégico" },
    { text: "Templates prontos para usar" },
    { text: "Acesso vitalício às atualizações" },
    { text: "Comunidade exclusiva de suporte" },
    { text: "Garantia de 30 dias incondicional" },
  ],
  primaryButtonText = "QUERO VENDER COMO GENTE GRANDE",
  primaryButtonLink = "#inscricao",
  secondaryButtonText = "Saiba mais",
  secondaryButtonLink = "#detalhes",
  backgroundColor = "black",
}) => {
  const getBgColor = () => {
    switch (backgroundColor) {
      case "red": return "bg-brutal-red";
      case "yellow": return "bg-brutal-yellow";
      case "oldpaper": return "bg-brutal-oldpaper";
      default: return "bg-brutal-black";
    }
  };

  const getTextColor = () => {
    return backgroundColor === "black" || backgroundColor === "red" 
      ? "text-white" 
      : "text-brutal-black";
  };

  const getSecondaryBgColor = () => {
    switch (backgroundColor) {
      case "red": return "bg-brutal-yellow";
      case "yellow": return "bg-brutal-red";
      case "oldpaper": return "bg-brutal-red";
      default: return "bg-brutal-yellow";
    }
  };

  const getSecondaryTextColor = () => {
    return backgroundColor === "yellow" ? "text-white" : "text-brutal-black";
  };

  return (
    <div className={`w-full py-16 ${getBgColor()}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {subtitle && (
              <span className={`inline-block px-4 py-1 rounded-full ${backgroundColor === "black" || backgroundColor === "red" ? "bg-brutal-yellow text-brutal-black" : "bg-brutal-red text-white"} font-bold text-sm mb-4`}>
                {subtitle}
              </span>
            )}
            <h2 className={`text-4xl md:text-5xl font-bold ${getTextColor()} mb-4`}>{title}</h2>
            {description && (
              <p className={`text-xl ${backgroundColor === "black" || backgroundColor === "red" ? "text-brutal-gray-light" : "text-brutal-gray"} max-w-3xl mx-auto`}>
                {description}
              </p>
            )}
          </motion.div>
          
          {benefits && benefits.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                >
                  <CheckCircle className={`flex-shrink-0 ${backgroundColor === "black" || backgroundColor === "red" ? "text-brutal-yellow" : "text-brutal-red"}`} />
                  <span className={getTextColor()}>{benefit.text}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <a
              href={primaryButtonLink}
              className={`px-8 py-4 ${getSecondaryBgColor()} ${getSecondaryTextColor()} font-bold rounded-lg text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 text-lg w-full sm:w-auto`}
            >
              {primaryButtonText} <Zap className="animate-pulse" />
            </a>
            
            {secondaryButtonText && (
              <a
                href={secondaryButtonLink}
                className={`px-8 py-4 ${backgroundColor === "black" || backgroundColor === "red" ? "bg-transparent border-2 border-white text-white" : "bg-transparent border-2 border-brutal-black text-brutal-black"} rounded-lg text-center transition-all duration-300 hover:bg-white/10 flex items-center justify-center gap-2 w-full sm:w-auto`}
              >
                {secondaryButtonText} <ArrowRight size={18} />
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
