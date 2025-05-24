import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { BrutalButton } from './ui/BrutalButton';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Início', href: '#home' },
  { name: 'Benefícios', href: '#benefits' },
  { name: 'Como Funciona', href: '#how-it-works' },
  { name: 'Depoimentos', href: '#testimonials' },
  { name: 'FAQ', href: '#faq' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    e.preventDefault();
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-brutal-red to-brutal-orange bg-clip-text text-transparent">
                RG PULSE
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToForm(e, item.href.substring(1))}
                className="text-brutal-dark hover:text-brutal-red font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex items-center">
            <BrutalButton 
              onClick={() => {
                const element = document.getElementById('lead-form-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              variant="primary"
              size="sm"
              className="ml-4"
            >
              Quero minha vaga
            </BrutalButton>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-brutal-dark hover:text-brutal-red focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    scrollToForm(e, item.href.substring(1));
                    setMobileMenuOpen(false);
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium text-brutal-dark hover:bg-gray-50 hover:text-brutal-red"
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 pb-2">
                <BrutalButton 
                  onClick={() => {
                    const element = document.getElementById('lead-form-section');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                      setMobileMenuOpen(false);
                    }
                  }}
                  variant="primary"
                  fullWidth
                  className="w-full justify-center"
                >
                  Quero minha vaga
                </BrutalButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
