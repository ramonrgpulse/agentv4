import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";

interface ModernHeroProps {
  title: string;
  subtitle: string;
  highlightWords?: string[];
  ctaText: string;
  onCtaClick: (section: string) => void;
  ctaSection: string;
  backgroundVariant?: "red" | "orange" | "dark";
  particleColor?: string;
  className?: string;
}

export const ModernHero = ({
  title,
  subtitle,
  highlightWords = [],
  ctaText,
  onCtaClick,
  ctaSection,
  backgroundVariant = "dark",
  particleColor,
  className = "",
}: ModernHeroProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleIdRef = useRef(0);

  // Handle mouse move for the gradient effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Create ripple effect on click
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newRipple = {
        id: rippleIdRef.current,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      rippleIdRef.current += 1;
      setRipples((prev) => [...prev, newRipple]);

      // Remove ripple after animation completes
      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
      }, 1000);
    }
  };

  // Background gradient classes based on variant
  const getBackgroundClass = () => {
    switch (backgroundVariant) {
      case "red":
        return "bg-gradient-to-br from-brutal-red/10 to-brutal-darker";
      case "orange":
        return "bg-gradient-to-br from-brutal-orange/10 to-brutal-darker";
      case "dark":
      default:
        return "bg-gradient-to-br from-brutal-darker to-black";
    }
  };

  // Highlight words in title
  const highlightTitle = (text: string) => {
    if (highlightWords.length === 0) return text;

    let highlightedText = text;
    highlightWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        `<span class="text-brutal-red font-bold">$&</span>`
      );
    });
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      className={`relative overflow-hidden min-h-[80vh] flex items-center justify-center px-4 py-16 ${getBackgroundClass()} ${className}`}
    >
      {/* Interactive background gradient */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-30 blur-[100px] transition-all duration-300 ease-out pointer-events-none"
        style={{
          background: particleColor 
            ? `radial-gradient(circle, ${particleColor} 0%, rgba(0,0,0,0) 70%)` 
            : backgroundVariant === "red" 
              ? "radial-gradient(circle, rgba(220,38,38,0.5) 0%, rgba(0,0,0,0) 70%)" 
              : backgroundVariant === "orange" 
                ? "radial-gradient(circle, rgba(234,88,12,0.5) 0%, rgba(0,0,0,0) 70%)"
                : "radial-gradient(circle, rgba(59,130,246,0.5) 0%, rgba(0,0,0,0) 70%)",
          left: `${mousePosition.x - 250}px`,
          top: `${mousePosition.y - 250}px`,
        }}
      />

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full bg-brutal-red/20 pointer-events-none animate-ripple"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: "10px",
            height: "10px",
          }}
        />
      ))}

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated title with staggered entrance */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-brutal-paper mb-6 font-oswald tracking-tight"
          >
            {highlightTitle(title)}
          </motion.h1>

          {/* Animated subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-brutal-paper/80 mb-8 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>

          {/* Animated CTA button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => onCtaClick(ctaSection)}
              size="lg"
              className="bg-gradient-to-r from-brutal-red to-brutal-orange hover:from-brutal-orange hover:to-brutal-red text-white font-bold py-6 px-8 rounded-lg shadow-xl hover:shadow-brutal-red/30 transition-all duration-300 h-auto"
            >
              {ctaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          {/* Decorative element */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 flex justify-center"
          >
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-brutal-paper/30 to-transparent"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
