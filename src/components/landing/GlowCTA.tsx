import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { ArrowRight } from "lucide-react";

interface GlowCTAProps {
  title: string;
  description?: string;
  ctaText: string;
  onCtaClick: (section: string) => void;
  ctaSection: string;
  variant?: "primary" | "secondary" | "accent";
  className?: string;
  glowColor?: string;
}

export const GlowCTA = ({
  title,
  description,
  ctaText,
  onCtaClick,
  ctaSection,
  variant = "primary",
  className = "",
}: GlowCTAProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Efeito de pulsação para atrair atenção periodicamente
  const [isPulsing, setIsPulsing] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1000);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Lidar com movimento do mouse para efeito de brilho
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Obter cores baseadas na variante
  const getColors = () => {
    switch (variant) {
      case "primary":
        return {
          bgFrom: "from-brutal-red/10",
          bgTo: "to-brutal-red/5",
          border: "border-brutal-red/30",
          glowColor: "rgba(220, 38, 38, 0.4)",
          buttonFrom: "from-brutal-red",
          buttonTo: "to-brutal-red/80",
        };
      case "secondary":
        return {
          bgFrom: "from-brutal-orange/10",
          bgTo: "to-brutal-orange/5",
          border: "border-brutal-orange/30",
          glowColor: "rgba(234, 88, 12, 0.4)",
          buttonFrom: "from-brutal-orange",
          buttonTo: "to-brutal-orange/80",
        };
      case "accent":
        return {
          bgFrom: "from-brutal-yellow/10",
          bgTo: "to-brutal-yellow/5",
          border: "border-brutal-yellow/30",
          glowColor: "rgba(234, 179, 8, 0.4)",
          buttonFrom: "from-brutal-yellow",
          buttonTo: "to-brutal-yellow/80",
        };
      default:
        return {
          bgFrom: "from-brutal-red/10",
          bgTo: "to-brutal-red/5",
          border: "border-brutal-red/30",
          glowColor: "rgba(220, 38, 38, 0.4)",
          buttonFrom: "from-brutal-red",
          buttonTo: "to-brutal-red/80",
        };
    }
  };

  const colors = getColors();

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`relative overflow-hidden rounded-xl ${className}`}
    >
      {/* Background container */}
      <div className={`bg-gradient-to-r ${colors.bgFrom} ${colors.bgTo} ${colors.border} border p-8 md:p-12 rounded-xl relative z-10`}>
        {/* Glow effect */}
        <div
          className="absolute rounded-full blur-[80px] opacity-50 transition-all duration-300 ease-out"
          style={{
            background: `radial-gradient(circle, ${colors.glowColor} 0%, rgba(0,0,0,0) 70%)`,
            width: isHovered ? "600px" : "300px",
            height: isHovered ? "600px" : "300px",
            left: isHovered ? `${mousePosition.x - 300}px` : "50%",
            top: isHovered ? `${mousePosition.y - 300}px` : "50%",
            transform: isHovered ? "none" : "translate(-50%, -50%)",
          }}
        />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Título com animação */}
          <motion.h3
            animate={isPulsing ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-brutal-darker font-oswald"
          >
            {title}
          </motion.h3>

          {/* Descrição opcional */}
          {description && (
            <p className="text-lg text-brutal-darker/80 mb-8 max-w-2xl mx-auto">
              {description}
            </p>
          )}

          {/* Botão CTA */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => onCtaClick(ctaSection)}
              size="lg"
              className={`bg-gradient-to-r ${colors.buttonFrom} ${colors.buttonTo} text-white font-bold py-6 px-8 rounded-lg shadow-xl hover:shadow-brutal-red/30 transition-all duration-300 h-auto transform hover:-translate-y-0.5`}
            >
              {ctaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
