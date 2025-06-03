import { useState, useEffect, useRef } from "react";
import { 
  CheckCircle, 
  Target, 
  TrendingUp, 
  Zap, 
  Brain, 
  DollarSign, 
  Clock, 
  Users, 
  Star, 
  MousePointer, 
  Shield, 
  BadgeCheck, 
  Award
} from "lucide-react";
import { useTracking } from "@/hooks/useTracking";
import { GTMEvents } from "@/lib/gtm";
import { 
  ModernHero, 
  FeaturesGrid, 
  GlowCTA, 
  ModernLeadForm,
  TestimonialSlider 
} from "@/components/landing";
import { Button } from "@/components/ui/button";

// Interface para o objeto dataLayer global
type DataLayerEvent = {
  event: string;
  [key: string]: unknown;
};

// Extendendo a interface Window global
declare global {
  // eslint-disable-next-line no-var
  var dataLayer: DataLayerEvent[] | undefined;
}

const ModernIndex = () => {
  const [formSection, setFormSection] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  const [readingProgress, setReadingProgress] = useState(0);
  const [formCompleted, setFormCompleted] = useState(false);
  const { trackEvent } = useTracking();
  const formRef = useRef<HTMLDivElement>(null);

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Reading progress and scroll tracking effect
  useEffect(() => {
    let scrollMilestones = [25, 50, 75, 90];
    let trackedMilestones = new Set();
    let timeOnPage = Date.now();

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);

      // Track scroll milestones
      scrollMilestones.forEach(milestone => {
        if (progress >= milestone && !trackedMilestones.has(milestone)) {
          trackedMilestones.add(milestone);
          const timeOnPageSeconds = Math.floor((Date.now() - timeOnPage) / 1000);
          
          // Rastreamento usando eventos centralizados do GTM
          GTMEvents.scrollMilestone(milestone, 'modern_index', timeOnPageSeconds);
          
          // Rastreamento personalizado
          trackEvent('scroll_milestone', {
            milestone: milestone,
            page: 'modern_index',
            time_on_page: Date.now() - timeOnPage
          });
        }
      });
    };

    // Track time milestones
    const timeIntervals = [30000, 60000, 120000, 300000]; // 30s, 1m, 2m, 5m
    const timeouts = timeIntervals.map(interval => 
      setTimeout(() => {
        trackEvent('time_on_page', {
          duration: interval,
          page: 'modern_index',
          scroll_progress: readingProgress
        });
      }, interval)
    );

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [trackEvent, readingProgress]);

  // Visibility effect
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Função para rolar até o formulário
  const scrollToForm = (section: string) => {
    setFormSection(section);
    
    // Rastreamento usando eventos centralizados do GTM
    GTMEvents.ctaClick(section, 'modern_index', {
      reading_progress: Math.round(readingProgress)
    });

    // Rastreamento personalizado
    trackEvent('cta_click', {
      cta_section: section,
      page: 'modern_index',
      scroll_position: window.scrollY,
      reading_progress: readingProgress
    });
    
    // Rolar até o formulário
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Função para quando o formulário for preenchido
  const handleFormComplete = (data: { name: string; email: string; phone?: string }) => {
    setFormCompleted(true);
    
    // Rastreamento usando eventos centralizados do GTM
    GTMEvents.leadCapture('modern_index', formSection || 'unknown', data);
    
    // Rastreamento personalizado
    trackEvent('lead_captured', {
      section: formSection,
      page: 'modern_index',
      email_domain: data.email.split('@')[1],
      has_phone: !!data.phone
    });
  };

  // Recursos (features) para a seção de features
  const features = [
    {
      icon: Target,
      title: "Estratégia Precisa",
      description: "Metodologia testada e aprovada por mais de 1.000 empresas para definir alvos certeiros.",
      color: "red"
    },
    {
      icon: TrendingUp,
      title: "Crescimento Acelerado",
      description: "Aumente seus resultados em até 300% nos primeiros 90 dias de implementação.",
      color: "orange"
    },
    {
      icon: Brain,
      title: "IA Avançada",
      description: "Algoritmos inteligentes que aprendem com seus dados e otimizam campanhas automaticamente.",
      color: "yellow"
    },
    {
      icon: Zap,
      title: "Implementação Rápida",
      description: "Sistema plug-and-play que você começa a usar em menos de 24 horas.",
      color: "red"
    },
    {
      icon: DollarSign,
      title: "ROI Garantido",
      description: "Retorno sobre investimento médio de 500% para nossos clientes mais dedicados.",
      color: "orange"
    },
    {
      icon: Shield,
      title: "Proteção Total",
      description: "Segurança de dados em conformidade com LGPD e padrões internacionais.",
      color: "yellow"
    }
  ];

  // Depoimentos para o slider de testimonials
  const testimonials = [
    {
      id: 1,
      name: "João Silva",
      role: "CEO, Empresa XYZ",
      content: "Implementamos o sistema há apenas 2 meses e já dobramos nosso faturamento. A metodologia é simplesmente revolucionária!",
      rating: 5,
      avatar: "JS"
    },
    {
      id: 2,
      name: "Maria Oliveira",
      role: "Diretora de Marketing, Tech Solutions",
      content: "Depois de anos testando diferentes estratégias, finalmente encontramos algo que realmente funciona. Os resultados são consistentes e escaláveis.",
      rating: 5,
      avatar: "MO"
    },
    {
      id: 3,
      name: "Pedro Santos",
      role: "Fundador, Startup Growth",
      content: "Se você está cansado de jogar dinheiro fora com marketing ineficiente, essa é a solução que você precisa. Simples, direto e eficaz.",
      rating: 4,
      avatar: "PS"
    }
  ];

  return (
    <div className="bg-brutal-oldpaper min-h-screen">
      {/* Hero Section */}
      <ModernHero
        title="Descubra o Método Definitivo para Escalar seu Negócio"
        subtitle="A estratégia que transformou mais de 1.000 empresas e pode triplicar seus resultados em 90 dias ou menos"
        highlightWords={["Método Definitivo", "triplicar", "90 dias"]}
        ctaText="Quero Conhecer Agora"
        onCtaClick={scrollToForm}
        ctaSection="hero_cta"
        backgroundVariant="dark"
      />

      {/* Features Section */}
      <FeaturesGrid
        title="Por Que Nossa Metodologia é Diferente"
        subtitle="Combinamos estratégia, tecnologia e psicologia para criar um sistema completo de crescimento"
        features={features}
        columns={3}
      />

      {/* Testimonials Section */}
      <section className="py-16 bg-brutal-darker">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brutal-paper font-oswald">
              O Que Nossos Clientes Dizem
            </h2>
            <p className="text-lg text-brutal-paper/70 max-w-2xl mx-auto">
              Resultados reais de pessoas que implementaram nossa metodologia
            </p>
          </div>
          
          <TestimonialSlider
            testimonials={testimonials}
            variant="dark"
          />

          <div className="mt-12 text-center">
            <p className="text-brutal-paper/70 flex items-center justify-center gap-2 mb-4">
              <BadgeCheck className="h-5 w-5 text-brutal-red" />
              <span>Resultados verificados e documentados</span>
            </p>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-12 bg-brutal-red">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white font-oswald">
              OFERTA POR TEMPO LIMITADO
            </h3>
            <p className="text-white/80 mb-6">
              Essa oportunidade exclusiva termina em:
            </p>
            
            <div className="flex justify-center gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-20 md:w-24">
                <div className="text-3xl md:text-4xl font-bold text-white font-mono">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-white/70 uppercase">Horas</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-20 md:w-24">
                <div className="text-3xl md:text-4xl font-bold text-white font-mono">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-white/70 uppercase">Minutos</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-20 md:w-24">
                <div className="text-3xl md:text-4xl font-bold text-white font-mono">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-white/70 uppercase">Segundos</div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button
                onClick={() => scrollToForm('countdown_cta')}
                size="lg"
                className="bg-white text-brutal-red hover:bg-gray-100 font-bold py-6 px-8 rounded-lg shadow-xl transition-all duration-300 h-auto transform hover:-translate-y-1"
              >
                Garantir Minha Vaga
              </Button>
            </div>
            
            <p className="mt-4 text-white/70 text-sm flex items-center justify-center gap-1">
              <Users className="h-4 w-4" />
              <span>347 pessoas online agora</span>
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section with Icons */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brutal-darker font-oswald">
              O Que Você Vai Conquistar
            </h2>
            <p className="text-lg text-brutal-darker/70 max-w-2xl mx-auto">
              Transforme sua abordagem de marketing e vendas com estas poderosas vantagens
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="h-10 w-10 text-brutal-red" />,
                title: "Posicionamento Estratégico",
                description: "Destaque-se da concorrência com uma proposta de valor irresistível"
              },
              {
                icon: <TrendingUp className="h-10 w-10 text-brutal-red" />,
                title: "Escalabilidade Garantida",
                description: "Sistemas que crescem com seu negócio sem adicionar complexidade"
              },
              {
                icon: <Award className="h-10 w-10 text-brutal-red" />,
                title: "Autoridade no Mercado",
                description: "Seja reconhecido como referência no seu segmento"
              },
              {
                icon: <Users className="h-10 w-10 text-brutal-red" />,
                title: "Clientes de Alta Qualidade",
                description: "Atraia clientes ideais que valorizam e pagam pelo seu serviço"
              },
              {
                icon: <Brain className="h-10 w-10 text-brutal-red" />,
                title: "Automação Inteligente",
                description: "Libere seu tempo com processos automatizados de captação"
              },
              {
                icon: <DollarSign className="h-10 w-10 text-brutal-red" />,
                title: "Aumento de Receita",
                description: "Veja seu faturamento crescer mês após mês com previsibilidade"
              }
            ].map((benefit, index) => (
              <div 
                key={index}
                className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-brutal-red/20 group"
              >
                <div className="mb-4 text-center">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-brutal-darker font-oswald text-center group-hover:text-brutal-red transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-brutal-darker/70 text-center">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <GlowCTA
        title="Pronto para Transformar Seu Negócio?"
        description="Junte-se a mais de 1.000 empresários que já transformaram seus resultados com nossa metodologia"
        ctaText="Quero Começar Agora"
        onCtaClick={scrollToForm}
        ctaSection="main_cta"
        variant="primary"
        className="mx-4 md:mx-auto md:max-w-5xl -mt-8 mb-16"
      />

      {/* Form Section */}
      <section className="py-16 bg-brutal-oldpaper" id="form-section" ref={formRef}>
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brutal-darker font-oswald">
                Garanta Seu Acesso Agora
              </h2>
              <p className="text-brutal-darker/70">
                Preencha o formulário abaixo para ter acesso exclusivo à nossa metodologia
              </p>
              
              <div className="flex items-center justify-center gap-4 mt-4 text-sm text-brutal-darker/60">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Acesso Imediato</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span>100% Seguro</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>Garantia de 30 dias</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-1 rounded-xl shadow-2xl">
              <ModernLeadForm
                onSubmit={handleFormComplete}
                showPhone={true}
                variant="light"
                ctaText="Quero Ter Acesso Agora"
                formTitle="ACESSO EXCLUSIVO POR TEMPO LIMITADO"
              />
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-brutal-darker/60 text-sm flex items-center justify-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Mais de 1.000 empresários já transformaram seus negócios</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brutal-darker py-12 text-brutal-paper/70">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4 text-brutal-paper font-oswald">
                RG Pulse
              </h3>
              <p className="mb-4">
                Transformando negócios através de estratégias inovadoras de marketing e vendas.
              </p>
              <div className="flex space-x-4">
                {/* Social icons would go here */}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-brutal-paper font-oswald">
                Links Rápidos
              </h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-brutal-red transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-brutal-red transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-brutal-red transition-colors">Serviços</a></li>
                <li><a href="#" className="hover:text-brutal-red transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-brutal-paper font-oswald">
                Legal
              </h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-brutal-red transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-brutal-red transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-brutal-red transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-brutal-dark/30 text-center text-sm">
            <p>
              © {new Date().getFullYear()} RG Pulse. Todos os direitos reservados.
            </p>
            <p className="mt-2 text-xs text-brutal-paper/40">
              Este site não é afiliado ao Facebook ou a qualquer entidade do Facebook. Depois de sair do Facebook, a responsabilidade não é deles e sim do nosso site.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => scrollToForm('floating_cta')}
          className="bg-brutal-red hover:bg-brutal-orange text-white rounded-full p-4 shadow-2xl hover:shadow-brutal-red/50 transition-all duration-300 transform hover:scale-110 animate-bounce"
        >
          <Zap className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default ModernIndex;
