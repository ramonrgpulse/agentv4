import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating?: number;
  avatar?: string | React.ReactNode;
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
  variant?: "light" | "dark" | "paper";
}

export const TestimonialSlider = ({
  testimonials,
  autoPlay = true,
  interval = 5000,
  variant = "light",
}: TestimonialSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Estilos baseados na variante
  const getStyles = () => {
    switch (variant) {
      case "dark":
        return {
          bg: "bg-brutal-darker",
          cardBg: "bg-brutal-dark",
          text: "text-brutal-paper",
          border: "border-brutal-dark/50",
          quote: "text-brutal-red/30",
        };
      case "paper":
        return {
          bg: "bg-brutal-oldpaper",
          cardBg: "bg-white",
          text: "text-brutal-darker",
          border: "border-gray-200",
          quote: "text-brutal-red/30",
        };
      case "light":
      default:
        return {
          bg: "bg-white",
          cardBg: "bg-gray-50",
          text: "text-brutal-darker",
          border: "border-gray-200",
          quote: "text-brutal-red/30",
        };
    }
  };

  const styles = getStyles();

  // Controle de autoplay
  useEffect(() => {
    if (autoPlay) {
      const startAutoPlay = () => {
        autoPlayRef.current = setInterval(() => {
          if (!isAnimating) {
            goToNext();
          }
        }, interval);
      };

      startAutoPlay();
      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }
  }, [autoPlay, interval, isAnimating]);

  const goToPrevious = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToIndex = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    setCurrentIndex(index);
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Renderizar estrelas para avaliação
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-brutal-yellow fill-brutal-yellow" : "text-gray-300"
        }`}
      />
    ));
  };

  // Variantes de animação
  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
  };

  // Direção do slide
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    const newPage = page + newDirection;
    const nextIndex = 
      newPage >= testimonials.length
        ? 0
        : newPage < 0
        ? testimonials.length - 1
        : newPage;
    
    setPage([nextIndex, newDirection]);
    setCurrentIndex(nextIndex);
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className={`py-12 ${styles.bg}`}>
      <div className="container mx-auto px-4">
        <div className="relative max-w-4xl mx-auto">
          {/* Quotation mark decorations */}
          <div className="absolute top-0 left-0 transform -translate-x-6 -translate-y-6">
            <Quote className={`h-16 w-16 ${styles.quote} transform rotate-180`} />
          </div>
          <div className="absolute bottom-0 right-0 transform translate-x-6 translate-y-6">
            <Quote className={`h-16 w-16 ${styles.quote}`} />
          </div>
          
          {/* Testimonial slider */}
          <div className={`relative overflow-hidden rounded-xl shadow-lg ${styles.cardBg} ${styles.border} border p-6 md:p-10`}>
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="w-full"
              >
                <div className="text-center">
                  {/* Avatar/Image */}
                  {currentTestimonial.avatar && (
                    <div className="mb-6 flex justify-center">
                      {typeof currentTestimonial.avatar === "string" ? (
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-brutal-red/20 shadow-lg">
                          <img
                            src={currentTestimonial.avatar as string}
                            alt={currentTestimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brutal-yellow to-brutal-orange flex items-center justify-center text-brutal-darker font-bold text-xl border-4 border-brutal-red/20 shadow-lg">
                          {currentTestimonial.avatar}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Conteúdo */}
                  <blockquote className="mb-6">
                    <p className={`text-lg md:text-xl italic mb-6 ${styles.text}`}>
                      "{currentTestimonial.content}"
                    </p>
                  </blockquote>
                  
                  {/* Rating (se existir) */}
                  {currentTestimonial.rating && (
                    <div className="flex justify-center mb-4">
                      {renderStars(currentTestimonial.rating)}
                    </div>
                  )}
                  
                  {/* Info da pessoa */}
                  <div>
                    <h4 className={`font-bold text-lg ${styles.text} font-oswald`}>
                      {currentTestimonial.name}
                    </h4>
                    <p className={`${styles.text} opacity-70`}>
                      {currentTestimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation arrows */}
            <button
              onClick={() => paginate(-1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6 text-brutal-darker" />
            </button>
            
            <button
              onClick={() => paginate(1)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6 text-brutal-darker" />
            </button>
          </div>
          
          {/* Pagination dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-brutal-red w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
