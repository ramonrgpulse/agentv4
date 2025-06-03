import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  image?: string;
  content: string;
  company?: string;
  highlight?: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
  autoplay?: boolean;
  interval?: number;
}

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  testimonials,
  title = "O que nossos alunos estão dizendo",
  subtitle = "Histórias reais de quem transformou seu negócio com nosso método",
  autoplay = true,
  interval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(autoplay);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isAutoplay) {
      timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, interval);
    }
    
    return () => clearInterval(timer);
  }, [isAutoplay, interval, testimonials.length]);

  const handlePrev = () => {
    setIsAutoplay(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setIsAutoplay(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handleDotClick = (index: number) => {
    setIsAutoplay(false);
    setCurrentIndex(index);
  };

  return (
    <div className="w-full py-16 bg-brutal-oldpaper">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-brutal-black mb-3">{title}</h2>
          <p className="text-xl text-brutal-gray max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-brutal-black text-white flex items-center justify-center hover:bg-brutal-red transition-colors duration-300"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          
          <div className="relative overflow-hidden min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl p-8 shadow-lg border-4 border-brutal-black"
              >
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-shrink-0">
                    {testimonials[currentIndex].image ? (
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-brutal-yellow">
                        <img 
                          src={testimonials[currentIndex].image} 
                          alt={testimonials[currentIndex].name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-brutal-gray/20 flex items-center justify-center border-4 border-brutal-yellow">
                        <User size={40} className="text-brutal-gray" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <Quote className="w-10 h-10 text-brutal-red mb-4 opacity-30" />
                    
                    <p className="text-lg text-brutal-black mb-6 italic">
                      {testimonials[currentIndex].highlight && (
                        <span className="font-bold text-brutal-red">"{testimonials[currentIndex].highlight}"</span>
                      )}
                      {" "}{testimonials[currentIndex].content}
                    </p>
                    
                    <div>
                      <h4 className="font-bold text-lg text-brutal-black">{testimonials[currentIndex].name}</h4>
                      <p className="text-brutal-gray">
                        {testimonials[currentIndex].role}
                        {testimonials[currentIndex].company && (
                          <>, {testimonials[currentIndex].company}</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-brutal-black text-white flex items-center justify-center hover:bg-brutal-red transition-colors duration-300"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
        
        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentIndex ? "bg-brutal-red" : "bg-brutal-gray/30 hover:bg-brutal-gray"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
