import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  ModernHero,
  FeaturesGrid, 
  GlowCTA, 
  ModernLeadForm,
  CountdownTimer,
  TestimonialsCarousel,
  FaqAccordion,
  ConversionCTA
} from "../components/landing";
import { Button } from "../components/ui/button";

// Lucide Icons
import { 
  Eye, Zap, AlertTriangle, CheckCircle, Target, TrendingUp, Brain, DollarSign, 
  Shield, Award, Users, Clock, ArrowRight, Lightbulb, ThumbsUp, MessageSquare, 
  BarChart2, Settings, Palette, PlayCircle, BookOpen, Gift, Map, Search, RadioTower, 
  Edit3, Filter, Mic, Handshake, Activity, FileText, MessageCircle as MessageCircleIcon, 
  GitFork, HeartCrack, Share2, User, Phone, Mail, LineChart, ExternalLink, 
  BrainCircuit, Webhook, ScrollText, ScrollText as ScrollTextIcon, Heart,
  Globe, Presentation, SendHorizonal, LucideIcon, ArrowRightCircle, PenTool
} from "lucide-react";
import { useTracking } from "@/hooks/useTracking";
import { GTMEvents } from "@/lib/gtm";

// Interface para o objeto dataLayer global
type DataLayerEvent = {
  event: string;
  [key: string]: unknown;
};

// Nota: Evitamos declarar novamente a interface global do dataLayer,
// pois ela já está definida em outro lugar do código

const SectionWrapper: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => (
  <motion.section 
    className={`py-12 md:py-20 ${className}`}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6 }}
  >
    <div className="container mx-auto px-4 md:px-6">
      {children}
    </div>
  </motion.section>
);

const VenderComoGenteGrande = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 1,
    minutes: 28,
    seconds: 42
  });
  const [readingProgress, setReadingProgress] = useState(0);
  const [viewersCount, setViewersCount] = useState(3); // Apenas 3 pessoas online

  const { trackEvent } = useTracking();
  const pageRef = useRef<HTMLDivElement>(null);

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev; // Stop at 00:00:00
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Reading progress and scroll tracking effect
  useEffect(() => {
    const scrollMilestones = [25, 50, 75, 90];
    const trackedMilestones = new Set();
    const timeOnPage = Date.now();

    const handleScroll = () => {
      if (!pageRef.current) return;
      const element = pageRef.current;
      const totalHeight = element.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setReadingProgress(Math.min(100, Math.max(0, progress)));

      scrollMilestones.forEach(milestone => {
        if (progress >= milestone && !trackedMilestones.has(milestone)) {
          trackedMilestones.add(milestone);
          const timeOnPageSeconds = Math.floor((Date.now() - timeOnPage) / 1000);
          GTMEvents.scrollMilestone(milestone, 'vender_como_gente_grande', timeOnPageSeconds);
          trackEvent('scroll_milestone', {
            milestone: milestone,
            page: 'vender_como_gente_grande',
            time_on_page_seconds: timeOnPageSeconds
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackEvent]);

  // Visibility and Viewers Count Effect
  useEffect(() => {
    setIsVisible(true);
    
    // Diminuir gradualmente as pessoas online
    const viewersInterval = setInterval(() => {
      setViewersCount(prev => {
        // Garantir que não vá abaixo de 1 pessoa
        if (prev <= 1) return 1;
        // 80% de chance de diminuir em 1, criando senso de urgência
        const shouldDecrease = Math.random() < 0.8;
        return shouldDecrease ? prev - 1 : prev;
      });
    }, 30000); // A cada 30 segundos
    
    return () => clearInterval(viewersInterval);
  }, []);
  
  // Efeito para rolar para o topo quando a página carrega
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCTA = (ctaName: string) => {
    trackEvent('cta_click', {
      cta_name: ctaName,
      page: 'vender_como_gente_grande',
      scroll_progress: readingProgress
    });
    GTMEvents.ctaClick(ctaName, 'vender_como_gente_grande', { reading_progress: Math.round(readingProgress) });
    
    // Rolar suavemente até o formulário de captura de leads em vez de redirecionar para checkout
    const formElement = document.getElementById('vender-como-gente-grande-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Destacar visualmente o formulário brevemente para atrair atenção
      formElement.classList.add('highlight-pulse');
      setTimeout(() => {
        formElement.classList.remove('highlight-pulse');
      }, 2000);
    }
  };

  // Data para o final da oferta (7 dias a partir de agora)
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);
  
  // Dados para os depoimentos
  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Criador de Conteúdo Digital",
      content: "Antes do método, eu estava vendendo apenas 2-3 cursos por mês. Depois de aplicar as estratégias, consegui vender 47 cursos no primeiro mês e agora mantenho uma média de 30 vendas mensais com muito menos esforço.",
      highlight: "47 cursos no primeiro mês",
      image: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&h=250&q=80"
    },
    {
      name: "Ana Rodrigues",
      role: "Coach de Negócios",
      company: "Evolua Coaching",
      content: "Eu tinha medo de parecer 'vendedora' e isso estava limitando meu crescimento. Com o método, aprendi a vender de forma autêntica e humana. Minha receita triplicou em 3 meses e o melhor: sem me sentir desconfortável!",
      highlight: "Minha receita triplicou em 3 meses",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&h=250&q=80"
    },
    {
      name: "Marcos Andrade",
      role: "Especialista em Marketing Digital",
      content: "O método mudou completamente minha forma de criar funis de vendas. Abandonei as táticas manipulativas e adotei uma abordagem mais transparente. Resultado: taxa de conversão de 8.4% e quase zero pedidos de reembolso.",
      highlight: "taxa de conversão de 8.4%",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&h=250&q=80"
    },
    {
      name: "Luciana Costa",
      role: "Mentora de Produtividade",
      company: "Tempo Produtivo",
      content: "Eu sabia criar conteúdo, mas não sabia vender. O método me deu um passo-a-passo claro para criar ofertas irresistíveis sem parecer desesperada. Meu último lançamento gerou R$97.500 em apenas 5 dias.",
      highlight: "R$97.500 em apenas 5 dias",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&h=250&q=80"
    }
  ];
  
  // Dados para as FAQs
  const faqItems = [
    {
      question: "Este método funciona para quem está começando do zero?",
      answer: "Sim! O método foi desenvolvido justamente para ajudar pessoas que têm conhecimento valioso mas não sabem como vender. Começamos do básico e avançamos progressivamente, permitindo que mesmo iniciantes possam implementar as estratégias desde o primeiro módulo."
    },
    {
      question: "Quanto tempo leva para ver resultados?",
      answer: "A maioria dos nossos alunos começa a ver resultados nos primeiros 30 dias após implementar as estratégias iniciais. Claro que os resultados variam de acordo com seu nicho, audiência e esforço de implementação, mas fornecemos um roteiro claro para maximizar suas chances de sucesso rápido."
    },
    {
      question: "Preciso ter um grande público nas redes sociais?",
      answer: "Não! O método ensina estratégias que funcionam mesmo com audiências pequenas. Na verdade, vários de nossos casos de sucesso começaram com menos de 1.000 seguidores. Ensinamos como qualificar melhor sua audiência em vez de apenas aumentá-la, o que gera conversões melhores mesmo com números menores."
    },
    {
      question: "O que me diferencia das outras soluções do mercado?",
      answer: "Diferente de outros métodos que apenas ensinam 'táticas de persuasão', nosso foco é na venda ética e humanizada que cria relacionamentos de longo prazo com seus clientes. Além disso, o método é constantemente atualizado com as estratégias que estão funcionando AGORA, não técnicas ultrapassadas de 5 anos atrás."
    },
    {
      question: "Existe garantia de resultados?",
      answer: "Oferecemos uma garantia incondicional de 30 dias. Se você implementar as estratégias e não ver resultados, ou simplesmente sentir que o método não é para você, basta solicitar o reembolso que devolveremos 100% do seu investimento, sem perguntas ou burocracia."
    },
    {
      question: "Como funciona o suporte durante o programa?",
      answer: "Você terá acesso à nossa comunidade exclusiva onde poderá tirar dúvidas diretamente com nossa equipe e outros participantes. Além disso, realizamos calls mensais de suporte em grupo onde analisamos casos reais e oferecemos feedback personalizado para acelerar seu progresso."
    }
  ];

  // Estilo para o efeito de destaque do formulário
  const highlightPulseStyle = `
    @keyframes highlightPulse {
      0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7); }
      70% { box-shadow: 0 0 0 20px rgba(255, 215, 0, 0); }
      100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
    }
    .highlight-pulse {
      animation: highlightPulse 2s ease-out;
    }
  `;

  return (
    <div className="bg-brutal-dark text-brutal-paper font-inter antialiased" ref={pageRef}>
      <style>{highlightPulseStyle}</style>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-[100]">
        <div 
          className="h-full bg-gradient-to-r from-brutal-red via-brutal-orange to-brutal-yellow transition-all duration-100 ease-linear"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Live Viewers Counter */}
      <div className={`fixed top-4 left-2 sm:left-4 z-[90] bg-brutal-red/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg shadow-xl transform transition-all duration-500 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold">
          <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
          <Eye className="w-4 h-4" />
          <span>{viewersCount}</span>
          <span className="hidden sm:inline">pessoas online</span>
        </div>
      </div>

      {/* Floating CTA */}
      <motion.div 
        className="fixed bottom-6 right-6 z-[90]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5, type: "spring", stiffness: 120 }}
      >
        <Button
          onClick={() => handleCTA('floating_cta_vender_grande')}
          className="bg-brutal-yellow text-brutal-dark hover:bg-brutal-orange p-4 rounded-full shadow-2xl hover:shadow-brutal-yellow/50 transition-all duration-300 transform hover:scale-110 aspect-square h-16 w-16 flex items-center justify-center"
          aria-label="Quero Vender Como Gente Grande"
        >
          <Zap className="w-7 h-7" />
        </Button>
      </motion.div>

      {/* Timer de Contagem Regressiva */}
      <div id="inscricao">
        <CountdownTimer 
          endDate={endDate}
          title="Oferta Especial de Lançamento!"
          subtitle="Preço promocional termina em:"
          ctaText="Garantir minha vaga com desconto"
          ctaLink="#inscricao"
        />
      </div>

      {/* Hero Section */}
      <ModernHero 
        title="Cansado de Gritar no Vazio e Ver Seu Dinheiro Queimar?"
        subtitle="O Caminho para Vender Como Gente Grande Está Aqui (E a Verdade Que Ninguém Te Conta)."
        ctaText="QUERO VENDER COMO GENTE GRANDE"
        onCtaClick={() => handleCTA('hero_cta_vender_grande')}
        ctaSection="hero_vender_grande"
        backgroundVariant="dark"
        particleColor="#FFD700" // Gold-ish yellow for brutal theme
        highlightWords={["Vender Como Gente Grande", "Verdade Que Ninguém Te Conta"]}
        className="min-h-[80vh] md:min-h-screen"
      />

      {/* Problema Section */}
      <SectionWrapper className="bg-brutal-darker">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-oswald text-brutal-yellow uppercase tracking-wider">
            O Jogo Mudou. E Você?
          </h2>
          <p className="mt-4 md:mt-6 text-lg md:text-xl max-w-3xl mx-auto text-brutal-paper font-medium">
            Você está aqui. De novo. Encarando mais uma promessa de "revolucionar seus resultados". Já ouviu essa música antes, não é? Cursos mirabolantes, "hacks" infalíveis, gurus que brotam do chão como erva daninha. E no final do dia? Sua mensagem continua perdida no mar de ruído, suas campanhas parecem um tiro no escuro e a única coisa que cresce é a sua frustração – e o buraco no seu orçamento.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
          <div className="prose prose-lg prose-invert text-brutal-paper font-medium max-w-none">
            <p className="text-xl md:text-2xl font-semibold text-brutal-orange">
              Para começar a vender como gente grande, precisamos ser honestos: o marketing tradicional, aquele cheio de eufemismos e métricas de vaidade, está ULTRAPASSADO. Enterrado. E quem insiste em seguir essa cartilha está fadado a uma morte lenta e dolorosa no mercado.
            </p>
            <p>
              Você sente isso na pele, não sente? Aquele incômodo persistente, aquela sensação de que algo está fundamentalmente errado. Você investe tempo, energia, rios de dinheiro... para quê? Para ver seus posts serem ignorados? Seus e-mails irem direto para a lixeira? Seus anúncios virarem paisagem?
            </p>
            <p className="font-bold text-brutal-yellow">
              O problema não é você. O problema é o JOGO COM REGRAS OBSOLETAS que te ensinaram a jogar.
            </p>
            <p>
              Um jogo onde "conhecer o cliente" se resume a meia dúzia de dados demográficos vazios e suposições superficiais. Um jogo onde "estratégia" é sinônimo de seguir a manada e replicar o que todo mundo já está fazendo – geralmente, fazendo mal.
            </p>
          </div>
          <div className="flex justify-center">
            <img src="https://images.unsplash.com/photo-1629189858605-9e5fb36ecb61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=80" alt="Empresário Frustrado" className="rounded-lg shadow-2xl max-h-[400px] w-full object-cover border-4 border-brutal-red"/>
          </div>
        </div>

        <div>
          <h3 className="text-2xl md:text-3xl font-bold font-oswald text-brutal-red text-center mb-8 md:mb-10">
            E a consequência disso?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: DollarSign, title: "Dinheiro Rasgado", text: "Cada real investido sem um entendimento PROFUNDO de quem você quer alcançar é dinheiro jogado no lixo. Ponto final." },
              { icon: Clock, title: "Tempo Desperdiçado", text: "Horas e horas quebrando a cabeça para criar conteúdo que ninguém consome, campanhas que não convertem. Tempo que você NUNCA vai recuperar." },
              { icon: Users, title: "Oportunidades Perdidas", text: "Clientes que poderiam ser seus, mas que você nunca alcançou porque sua mensagem era genérica, fria, DESCONECTADA da realidade deles." },
              { icon: AlertTriangle, title: "Frustração Crônica", text: "Aquele sentimento amargo de dar murro em ponta de faca, de não saber mais o que fazer para virar o jogo." },
              { icon: TrendingUp, title: "Estagnação ou Declínio", text: "Seu negócio patinando, incapaz de crescer, ou pior, vendo a concorrência – talvez menos competente, mas mais esperta na comunicação – te engolir." },
              { icon: Brain, title: "Falta de Clareza Mental", text: "A constante sensação de estar perdido, sem um norte claro para suas ações de marketing e vendas." }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className="bg-brutal-dark p-6 rounded-xl border-2 border-brutal-paper/20 hover:border-brutal-red transition-colors duration-300 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <item.icon className="w-10 h-10 md:w-12 md:h-12 text-brutal-red mb-4" />
                <h4 className="text-xl md:text-2xl font-bold font-oswald text-brutal-yellow mb-2">{item.title}</h4>
                <p className="text-brutal-paper/80 text-sm md:text-base">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Seção de Depoimentos */}
      <TestimonialsCarousel 
        testimonials={testimonials}
        title="Resultados Reais de Alunos Reais"
        subtitle="Veja como o método tem transformado negócios digitais por todo o Brasil"
      />

      {/* Solução Section */}
      <SectionWrapper className="bg-brutal-paper text-brutal-dark">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-oswald text-brutal-red uppercase tracking-wider mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Chega de Amadorismo. É Hora de <span className="text-brutal-orange">Vender Como Gente Grande.</span>
          </motion.h2>
          <motion.p 
            className="mt-4 md:mt-6 text-lg md:text-xl max-w-3xl mx-auto text-brutal-dark font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            Imagine por um instante: você não apenas entende o que seu cliente quer, você <strong className="text-brutal-red">SENTE</strong> o que ele precisa. Você não só atrai leads, você constrói uma <strong className="text-brutal-red">audiência faminta</strong> pelo que você oferece. Você não só vende, você cria <strong className="text-brutal-red">defensores apaixonados</strong> da sua marca.
          </motion.p>
          <motion.p 
            className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-brutal-dark font-semibold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          >
            Isso não é um sonho distante. É o resultado de uma <strong className="text-brutal-orange">metodologia testada e validada</strong>, um processo que vai te tirar do limbo do achismo e te colocar no controle da sua narrativa e dos seus resultados.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=80" alt="Parceria de Sucesso" className="rounded-lg shadow-2xl max-h-[450px] w-full object-cover border-4 border-brutal-orange"/>
          </motion.div>
          <motion.div 
            className="prose prose-lg text-brutal-dark font-medium max-w-none"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h3 className="text-2xl md:text-3xl font-bold font-oswald text-brutal-red mb-4">O Que Te Separa do Sucesso Sustentável?</h3>
            <p>
              Não é falta de esforço. Não é falta de produto ou serviço de qualidade. O que te falta é <strong className="text-brutal-orange">CLAREZA PROFUNDA</strong> e um <strong className="text-brutal-orange">PROCESSO INTELIGENTE</strong>.
            </p>
            <ul className="list-none p-0 space-y-3">
              <li className="flex items-start"><CheckCircle className="w-6 h-6 text-brutal-green mr-3 mt-1 flex-shrink-0" /><span><strong className="text-brutal-red">Clareza sobre quem é seu cliente ideal DE VERDADE:</strong> além dos dados demográficos, mergulhando nas suas dores, sonhos, medos e desejos mais profundos.</span></li>
              <li className="flex items-start"><CheckCircle className="w-6 h-6 text-brutal-green mr-3 mt-1 flex-shrink-0" /><span><strong className="text-brutal-red">Clareza sobre qual problema REAL você resolve:</strong> e como articular isso de forma que seu cliente se sinta instantaneamente compreendido.</span></li>
              <li className="flex items-start"><CheckCircle className="w-6 h-6 text-brutal-green mr-3 mt-1 flex-shrink-0" /><span><strong className="text-brutal-red">Clareza sobre sua mensagem ÚNICA:</strong> o que te torna diferente e por que diabos alguém deveria escolher você e não o seu concorrente.</span></li>
              <li className="flex items-start"><CheckCircle className="w-6 h-6 text-brutal-green mr-3 mt-1 flex-shrink-0" /><span><strong className="text-brutal-red">Um processo para transformar essa clareza em VENDAS REAIS:</strong> de forma consistente, previsível e escalável.</span></li>
            </ul>
            <p className="mt-6 text-xl font-semibold">
              A metodologia <strong className="text-brutal-orange">"Vender Como Gente Grande"</strong> não é mágica. É ciência. É estratégia. É a porra do caminho das pedras que ninguém te mostrou ainda.
            </p>
          </motion.div>
        </div>
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
        >
          <Button 
            onClick={() => handleCTA('solution_cta_vender_grande')}
            className="bg-brutal-red text-brutal-paper hover:bg-brutal-red/90 text-lg md:text-xl font-bold py-4 px-8 md:py-6 md:px-12 rounded-lg shadow-lg hover:shadow-brutal-red/50 transition-all duration-300 transform hover:scale-105"
            size="lg"
          >
            QUERO DESCARTAR O AMADORISMO AGORA!
            <ArrowRight className="ml-3 w-6 h-6" />
          </Button>
        </motion.div>
      </SectionWrapper>

      {/* CTA Forte de Conversão */}
      <ConversionCTA 
        title="Pronto para vender mais, sem parecer desesperado?"
        subtitle="VAGAS LIMITADAS"
        description="Domine as 14 estratégias do método Vender Como Gente Grande e transforme seu negócio digital em uma máquina de vendas ética e lucrativa."
        benefits={[
          { text: "14 módulos de conteúdo estratégico" },
          { text: "6 workshops práticos de implementação" },
          { text: "Templates prontos para usar" },
          { text: "Comunidade privada de suporte" },
          { text: "Acesso vitalício e atualizações" },
          { text: "Garantia incondicional de 30 dias" }
        ]}
        primaryButtonText="QUERO TRANSFORMAR MINHAS VENDAS AGORA"
        primaryButtonLink="#inscricao"
        backgroundColor="black"
      />

      {/* Metodologia Section */}
      <SectionWrapper className="bg-brutal-darker">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-oswald text-brutal-yellow uppercase tracking-wider mb-4"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            A Metodologia Descomplicada: Os <span className="text-brutal-orange">15 Passos</span> Para Vender Como Gente Grande
          </motion.h2>
          <motion.p 
            className="mt-4 md:mt-6 text-lg md:text-xl max-w-3xl mx-auto text-brutal-paper font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            Chega de blábláblá. Vamos direto ao ponto. Este é o mapa da mina, o GPS que vai te guiar passo a passo, sem firulas, sem enrolação, para você finalmente dominar a arte e a ciência de vender com inteligência e impacto. <strong className="text-brutal-red">Cada passo é crucial. Ignore um e o castelo desmorona.</strong>
          </motion.p>
        </div>

        <FeaturesGrid 
          title="A Metodologia Descomplicada"
          subtitle="Os 15 passos fundamentais para transformar seu marketing e vendas"
          features={[
            { 
              icon: Target, 
              title: "1. Mergulho Profundo no Cliente Ideal", 
              description: "(O Avatar NÃO é Suficiente). Entenda dores, sonhos e medos reais que vão além do superficial.",
              color: "red"
            },
            { 
              icon: Map, 
              title: "2. Mapeamento da Jornada REAL do Cliente", 
              description: "(Não a que Você ACHA que Ele Faz). Descubra cada ponto de contato e emoção do seu cliente.",
              color: "orange"
            },
            { 
              icon: Search, 
              title: "3. Identificação das Dores REAIS e Desejos OCULTOS", 
              description: "(A Raiz de Tudo). Conecte-se com as motivações mais profundas que impulsionam a decisão de compra.",
              color: "yellow"
            },
            { 
              icon: Award, 
              title: "4. Criação da Sua Proposta Única de Valor IRRESISTÍVEL", 
              description: "(O \"Porquê EU?\"). Defina claramente o que te torna a escolha óbvia e insubstituível.",
              color: "red"
            },
            { 
              icon: Lightbulb, 
              title: "5. Definição da Sua Mensagem Central MAGNÉTICA", 
              description: "(O Que Fica na Cabeça). Crie uma mensagem poderosa que ressoa e é lembrada.",
              color: "orange"
            },
            { 
              icon: RadioTower, 
              title: "6. Escolha Estratégica dos Canais CERTOS", 
              description: "(Onde Seu Cliente REALMENTE Está). Maximize seu alcance e impacto nos lugares certos.",
              color: "yellow"
            },
            { 
              icon: Edit3, 
              title: "7. Desenvolvimento de Conteúdo que CONVERTE", 
              description: "(Não Que Só Enche Linguiça). Produza material valioso que guia o cliente à ação.",
              color: "red"
            },
            { 
              icon: Filter, 
              title: "8. Construção de Funis de Venda INTELIGENTES", 
              description: "(Que Trabalham POR Você). Automatize processos e guie leads de forma eficaz até a conversão.",
              color: "orange"
            },
            { 
              icon: Mic, 
              title: "9. Implementação de Copywriting PERSUASIVO de Verdade", 
              description: "(Que Vende Sem Ser Tosco). Use palavras que convencem, conectam e convertem.",
              color: "yellow"
            },
            { 
              icon: Palette, 
              title: "10. Design que Impacta e Comunica", 
              description: "(A Roupa Certa Para a Festa Certa). Garanta que sua identidade visual fortaleça sua mensagem.",
              color: "red"
            },
            { 
              icon: BarChart2, 
              title: "11. Estratégias de Tráfego PAGO Eficientes", 
              description: "(Dinheiro Bem Gasto, Não Queimado). Invista de forma inteligente para atrair o público certo.",
              color: "orange"
            },
            { 
              icon: Users, 
              title: "12. Nutrição de Leads AVANÇADA", 
              description: "(Relacionamento Que Gera Venda). Construa confiança e mantenha o interesse até a compra.",
              color: "yellow"
            },
            { 
              icon: Handshake, 
              title: "13. Técnicas de Fechamento HUMANIZADAS", 
              description: "(Sem Pressão Idiota, Com Conexão). Conclua vendas de forma natural e positiva.",
              color: "red"
            },
            { 
              icon: Activity, 
              title: "14. Análise de Métricas QUE IMPORTAM", 
              description: "(Foco no Que Dá Resultado, Esqueça a Vaidade). Monitore o que realmente impacta seu sucesso.",
              color: "orange"
            },
            { 
              icon: Settings, 
              title: "15. Otimização Contínua e Iteração", 
              description: "(O Jogo Nunca Acaba, Ele EVOLUI). Adapte-se e melhore constantemente para resultados duradouros.",
              color: "yellow"
            }
          ]}
          columns={3}
        />
      </SectionWrapper>

      {/* Seção de FAQ */}
      <SectionWrapper className="bg-brutal-paper">
        <FaqAccordion 
          items={faqItems}
          title="Perguntas Frequentes"
          subtitle="Tudo o que você precisa saber antes de começar sua jornada"
          ctaText="Ainda tem dúvidas? Fale diretamente com um especialista"
          ctaLink="#contato"
          titleClassName="text-brutal-red font-bold"
          subtitleClassName="text-brutal-dark font-medium"
          questionClassName="text-brutal-dark font-bold"
          answerClassName="text-brutal-dark font-medium"
          bgClassName="bg-brutal-paper border-brutal-orange"
        />
      </SectionWrapper>

      {/* Benefícios Section */}
      <SectionWrapper className="bg-brutal-paper text-brutal-dark">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-oswald text-brutal-red uppercase tracking-wider mb-4"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            O Que Você <span className="text-brutal-orange">REALMENTE Leva</span> (Além de Mais Dinheiro no Bolso)
          </motion.h2>
          <motion.p 
            className="mt-4 md:mt-6 text-lg md:text-xl max-w-3xl mx-auto text-brutal-dark font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            Sim, o objetivo é vender mais. Mas "Vender Como Gente Grande" é sobre construir algo <strong className="text-brutal-red font-bold">sólido, duradouro e que te dê orgulho</strong>. É sobre transformar a maneira como você se posiciona e se conecta com o mercado.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {[
            {
              icon: Brain, // Ou Lightbulb para Clareza
              title: "Clareza Absoluta",
              text: "Você finalmente saberá EXATAMENTE quem é seu cliente, o que ele quer e como sua solução se encaixa PERFEITAMENTE na vida dele. Adeus, achismos!"
            },
            {
              icon: Users, // Ou Heart para Conexão
              title: "Conexão Genuína",
              text: "Sua comunicação deixará de ser um monólogo chato para se tornar um diálogo magnético, criando uma tribo de fãs, não apenas clientes."
            },
            {
              icon: TrendingUp,
              title: "Conversões Reais (e Previsíveis!)",
              text: "Com funis inteligentes e mensagens que acertam na veia, suas vendas se tornarão uma consequência natural, não um golpe de sorte."
            },
            {
              icon: Award,
              title: "Autoridade Incontestável",
              text: "Você será visto como A REFERÊNCIA no seu nicho, a primeira opção que vem à mente quando alguém precisa do que você oferece."
            },
            {
              icon: Shield, // Ou Coffee para Paz de Espírito
              title: "Paz de Espírito Estratégica",
              text: "Chega de ansiedade e noites em claro. Você terá um PLANO, um processo, e a confiança de que está no caminho certo."
            },
            {
              icon: DollarSign, // Ou Zap para Crescimento
              title: "Crescimento Sustentável",
              text: "Não apenas picos de venda, mas um crescimento consistente e escalável, construído sobre uma base sólida de entendimento e estratégia."
            }
          ].map((item, index) => (
            <motion.div 
              key={index} 
              className="bg-brutal-dark text-brutal-paper p-6 md:p-8 rounded-xl border-2 border-brutal-orange hover:border-brutal-yellow transition-all duration-300 shadow-xl hover:shadow-brutal-yellow/40 transform hover:-translate-y-1"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <item.icon className="w-10 h-10 md:w-12 md:h-12 text-brutal-orange mb-5" />
              <h3 className="text-xl md:text-2xl font-bold font-oswald text-brutal-yellow mb-3">{item.title}</h3>
              <p className="text-brutal-paper text-sm md:text-base leading-relaxed font-medium">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Decisão/CTA Section */}
      <SectionWrapper className="bg-brutal-darker">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-oswald text-brutal-yellow uppercase tracking-wider mb-4"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            A Escolha é Sua: Continuar Patinando ou <span className="text-brutal-orange">Decolar de Vez?</span>
          </motion.h2>
          <motion.p 
            className="mt-4 md:mt-6 text-lg md:text-xl max-w-3xl mx-auto text-brutal-paper font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            Você já viu o problema. Você já vislumbrou a solução. Você conheceu o caminho das pedras. Agora, a bola está com você. Continuar fazendo mais do mesmo e esperando resultados diferentes é a definição de insanidade. Ou você pode tomar uma decisão <strong className="text-brutal-red font-bold">AGORA</strong> e começar a trilhar o caminho para vender como gente grande.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 md:gap-12 items-start">
          <motion.div 
            className="lg:col-span-3 bg-brutal-dark p-6 sm:p-8 md:p-10 rounded-xl border-2 border-brutal-yellow shadow-2xl shadow-brutal-yellow/30"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h3 className="text-2xl md:text-3xl font-bold font-oswald text-brutal-yellow mb-6 text-center">Preencha Seus Dados e Receba o Contato de Nossos Especialistas:</h3>
            <ModernLeadForm 
              formId="vender-como-gente-grande-form"
              ctaSection="lead_form_vender_grande"
              onSubmitSuccess={() => {
                trackEvent('form_submission_success', { page: 'vender_como_gente_grande', form_id: 'vender-como-gente-grande-form' });
                GTMEvents.formSubmission('vender_como_gente_grande', 'vender-como-gente-grande-form');
              }}
              buttonText="QUERO SER CONTATADO PARA VENDER MAIS"
              buttonClassName="w-full bg-brutal-red hover:bg-brutal-red/90 text-lg"
              inputVariant="brutal"
              privacyPolicyLink="/politica-de-privacidade"
              redirectUrl="https://pay.herospark.com/rg-pulse-agente-criador-de-avatar-aprofundado-412999"
            />
            <p className="text-xs text-brutal-paper/60 mt-4 text-center">Seus dados estão seguros conosco. Odiamos spam tanto quanto você.</p>
          </motion.div>

          <motion.div 
            className="lg:col-span-2 flex flex-col items-center justify-center space-y-6 lg:pt-10"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="text-center p-6 bg-brutal-dark rounded-lg border border-brutal-orange">
              <h4 className="text-xl font-oswald font-bold text-brutal-orange mb-2">TEMPO LIMITADO!</h4>
              <p className="text-sm text-brutal-paper font-medium mb-3">Esta oportunidade não vai durar para sempre. Aja agora ou perca a chance.</p>
              <div className="font-mono text-3xl text-brutal-yellow bg-black/30 px-4 py-2 rounded inline-block tabular-nums">
                {`${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
              </div>
            </div>
            <GlowCTA
              title="Ainda em Dúvida?"
              description="Clique aqui para falar diretamente com um especialista e tirar todas as suas dúvidas antes de se comprometer."
              ctaText="FALAR COM ESPECIALISTA AGORA"
              onCtaClick={() => handleCTA('speak_to_specialist_cta_vender_grande')}
              ctaSection="speak_to_specialist_vender_grande"
              className="w-full"
              glowColor="rgba(255, 165, 0, 0.6)" // Orange glow
            />
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Formulário de Inscrição */}
      <SectionWrapper className="bg-brutal-yellow py-16 md:py-24">
        <div id="vender-como-gente-grande-form">
          <ModernLeadForm
            title="Quero Garantir Minha Vaga Agora!"
            subtitle="Preencha o formulário abaixo para garantir sua vaga com condições especiais"
            buttonText="GARANTIR MINHA VAGA AGORA"
            formId="vender-como-gente-grande"
            trackingSection="form_vender_como_gente_grande"
            redirectUrl="https://pay.herospark.com/rg-pulse-agente-criador-de-avatar-aprofundado-412999"
            onSubmitSuccess={() => {
              // Executa qualquer lógica de rastreamento personalizada aqui se necessário
              console.log('Formulário enviado com sucesso, redirecionando...');
            }}
            fields={[
              { name: 'Nome', placeholder: 'Seu nome completo', required: true },
              { name: 'Email', placeholder: 'Seu melhor e-mail', required: true },
              { name: 'Telefone', placeholder: 'Seu WhatsApp com DDD', required: true },
              { name: 'Estado', placeholder: 'Qual seu estado?', required: false },
              { name: 'O que vai diferenciar você da concorrência?', placeholder: 'O que vai diferenciar você da concorrência?', required: false },
              { name: 'Qual o tamanho do seu negócio?', placeholder: 'Qual o tamanho do seu negócio?', required: false },
            ]}
          />
        </div>
      </SectionWrapper>

      {/* P.S. Section */}
      <SectionWrapper className="bg-brutal-paper text-brutal-dark py-12 md:py-16">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h3 className="text-2xl md:text-3xl font-bold font-oswald text-brutal-red mb-6">
            P.S. Ainda está na dúvida? Deixe-me perguntar uma coisa...
          </h3>
          <p className="text-lg md:text-xl text-brutal-dark mb-4 font-medium">
            Quanto vale para você <strong className="text-brutal-red font-bold">parar de perder tempo e dinheiro</strong> com estratégias que não funcionam? Quanto vale ter um <strong className="text-brutal-red font-bold">processo claro e eficaz</strong> que te traga clientes de forma consistente?
          </p>
          <p className="text-lg md:text-xl text-brutal-dark mb-6 font-medium">
            Pense nisso. O investimento que você faz aqui não é um custo, é um <strong className="text-brutal-orange font-bold">atalho para o crescimento acelerado</strong> do seu negócio. É a diferença entre continuar sonhando e começar a <strong className="text-brutal-red font-bold">REALIZAR</strong>.
          </p>
          <p className="text-md md:text-lg text-brutal-dark italic font-medium">
            Lembre-se: a insanidade é continuar fazendo sempre a mesma coisa e esperar resultados diferentes. A hora de mudar é <strong className="text-brutal-red uppercase font-bold">AGORA</strong>.
          </p>
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          >
            <Button 
              size="lg"
              variant="destructive"
              className="font-oswald uppercase tracking-wider text-lg md:text-xl shadow-lg hover:shadow-brutal-red/60 transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                const formSection = document.getElementById('vender-como-gente-grande-form');
                formSection?.scrollIntoView({ behavior: 'smooth' });
                handleCTA('ps_cta_scroll_to_form_vender_grande');
              }}
            >
              Sim, Quero Vender Como Gente Grande!
            </Button>
          </motion.div>
        </motion.div>
      </SectionWrapper>

      {/* Footer - Basic */}
      <footer className="py-12 bg-black text-brutal-paper/60 text-center">
        <p>&copy; {new Date().getFullYear()} RG Pulse. Todos os direitos reservados.</p>
        <p className="text-xs mt-2">Este site não é afiliado ao Facebook ou a qualquer entidade do Facebook.</p>
      </footer>
    </div>
  );
};

export default VenderComoGenteGrande;
