import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, AlertTriangle } from "lucide-react";

interface CountdownTimerProps {
  endDate: Date;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  onComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endDate,
  title = "Oferta por tempo limitado!",
  subtitle = "Essa oportunidade acaba em:",
  ctaText = "Garantir minha vaga agora",
  ctaLink = "#inscricao",
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        onComplete && onComplete();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate, onComplete]);

  if (timeLeft.isExpired) {
    return null;
  }

  return (
    <motion.div 
      className="w-full py-4 bg-brutal-black rounded-lg shadow-lg border-4 border-brutal-red"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-brutal-yellow animate-pulse" />
            <div>
              <h3 className="text-xl font-bold text-brutal-yellow">{title}</h3>
              <p className="text-white">{subtitle}</p>
            </div>
          </div>
          
          <div className="flex gap-3 items-center">
            <div className="flex gap-2">
              <div className="flex flex-col items-center">
                <div className="bg-brutal-red w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <span className="text-white text-xs mt-1">Dias</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-brutal-red w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span className="text-white text-xs mt-1">Horas</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-brutal-red w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span className="text-white text-xs mt-1">Min</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-brutal-red w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <span className="text-white text-xs mt-1">Seg</span>
              </div>
            </div>
            
            <a 
              href={ctaLink} 
              className="px-6 py-3 bg-brutal-yellow hover:bg-brutal-yellow/90 text-brutal-black font-bold rounded-lg text-center transition-all duration-300 whitespace-nowrap"
            >
              {ctaText}
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
