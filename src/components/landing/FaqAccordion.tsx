import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  questionClassName?: string;
  answerClassName?: string;
  bgClassName?: string;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  items,
  title = "Perguntas Frequentes",
  subtitle = "Tudo o que você precisa saber antes de começar",
  ctaText = "Ainda tem dúvidas? Fale conosco",
  ctaLink = "#contato",
  titleClassName = "text-brutal-black",
  subtitleClassName = "text-brutal-gray",
  questionClassName = "font-bold text-lg",
  answerClassName = "text-brutal-gray",
  bgClassName = "bg-brutal-oldpaper",
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`w-full py-16 ${bgClassName}`}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={`text-4xl font-bold ${titleClassName} mb-3`}>{title}</h2>
          <p className={`text-xl ${subtitleClassName} max-w-2xl mx-auto`}>{subtitle}</p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          {items.map((item, index) => (
            <motion.div 
              key={index}
              className="mb-4 border-4 border-brutal-black rounded-lg overflow-hidden bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <button
                className={`w-full p-5 text-left flex justify-between items-center ${
                  openIndex === index ? "bg-brutal-yellow" : "bg-white hover:bg-brutal-yellow/20"
                } transition-colors duration-300`}
                onClick={() => toggleItem(index)}
              >
                <span className={questionClassName}>{item.question}</span>
                <ChevronDown 
                  className={`transition-transform duration-300 ${
                    openIndex === index ? "transform rotate-180" : ""
                  }`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 border-t-2 border-brutal-black/20">
                      <p className={`whitespace-pre-line ${answerClassName}`}>{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="text-brutal-red" />
            <p className="text-brutal-black">{ctaText}</p>
          </div>
          <a 
            href={ctaLink}
            className="inline-block px-8 py-4 bg-brutal-red hover:bg-brutal-red/90 text-white font-bold rounded-lg transition-colors duration-300"
          >
            Falar com um especialista
          </a>
        </motion.div>
      </div>
    </div>
  );
};
