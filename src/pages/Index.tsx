import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Target, TrendingUp, Zap, Brain, DollarSign, AlertTriangle, Clock, Users, Star, ArrowDown, MousePointer } from "lucide-react";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { NewspaperLayout, Article, Headline } from "@/components/NewspaperLayout";
import { PullQuote, FeatureBox, ThematicSeparator } from "@/components/NewspaperElements";
import { useTracking } from "@/hooks/useTracking";
import { GTMEvents } from "@/lib/gtm";

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

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [formSection, setFormSection] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  const [readingProgress, setReadingProgress] = useState(0);
  const { trackEvent } = useTracking();

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
          GTMEvents.scrollMilestone(milestone, 'index', timeOnPageSeconds);
          trackEvent('scroll_milestone', {
            milestone: milestone,
            page: 'index',
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
          page: 'index',
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

  const scrollToForm = (section: string) => {
    setShowForm(true);
    setFormSection(section);
    
    // Rastreamento usando eventos centralizados do GTM
    GTMEvents.ctaClick(section, 'index', {
      reading_progress: Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)
    });

    // Rastreamento personalizado
    trackEvent('cta_click', {
      cta_section: section,
      page: 'index',
      scroll_position: window.scrollY,
      reading_progress: readingProgress
    });
    
    document.getElementById('lead-form-section')?.scrollIntoView({ behavior: 'smooth' });
    
    // Track scroll to form in data layer
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'scroll_to_form',
        form_trigger: section
      } as DataLayerEvent);
    }
  };

  const handleFormComplete = () => {
    // Track checkout redirect in data layer
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'checkout_redirect',
        form_completion: true
      } as DataLayerEvent);
    }
    
    // Redirect to checkout page
    window.location.href = "https://pay.herospark.com/rg-pulse-agente-criador-de-avatar-aprofundado-412999";
  };

  return (
    <NewspaperLayout 
      title="RG PULSE NEWS"
      subtitle="EDIÇÃO ESPECIAL: MARKETING DE RESULTADOS"
    >
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-brutal-red to-brutal-orange transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Urgency Timer */}
      <div className={`fixed top-4 right-2 sm:right-4 z-40 bg-brutal-red text-white p-2 sm:p-3 rounded-lg shadow-lg transform transition-all duration-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} max-w-[calc(100vw-1rem)]`}>
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-bold">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
          <span className="hidden sm:inline">OFERTA EXPIRA EM:</span>
          <span className="sm:hidden">EXPIRA:</span>
        </div>
        <div className="flex space-x-1 text-sm sm:text-lg font-mono mt-1">
          <span className="bg-white text-brutal-red px-1 sm:px-2 py-1 rounded text-xs sm:text-base">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-xs sm:text-base">:</span>
          <span className="bg-white text-brutal-red px-1 sm:px-2 py-1 rounded text-xs sm:text-base">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-xs sm:text-base">:</span>
          <span className="bg-white text-brutal-red px-1 sm:px-2 py-1 rounded text-xs sm:text-base">{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
      </div>

      <Headline 
        title="Seu Marketing é um Lixo? A Verdade que Ninguém Ousa Dizer (Mas Seu Bolso Grita)."
        subtitle="Chega de queimar dinheiro e falar sozinho. A CLAREZA BRUTAL para vender como gente grande está aqui."
      />

      {/* Attention Grabber */}
      <div className="max-w-4xl mx-auto mb-12 p-4 sm:p-6 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-brutal-red rounded-r-lg shadow-lg animate-pulse">
        <div className="flex flex-col sm:flex-row items-start">
          <AlertTriangle className="w-6 h-6 text-brutal-red mb-2 sm:mb-0 sm:mt-1 sm:mr-3 animate-bounce flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-brutal-red mb-2">⚠️ ATENÇÃO: Mais de 10.000 empreendedores já transformaram seus negócios</h3>
            <p className="text-sm sm:text-base text-gray-700">Enquanto você lê isso, seus concorrentes estão implementando estratégias que você nem imagina que existem.</p>
          </div>
        </div>
      </div>
      
      <Article title="A Dura Realidade do Marketing Atual">
        <PullQuote attribution="Um Agente Frustrado">
          Sua mensagem morre na praia, suas campanhas são um fiasco e sua frustração só aumenta.
        </PullQuote>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Você está patinando. De novo. Cursos, "hacks", gurus… e NADA. Sua mensagem morre na praia, suas campanhas são um fiasco e sua frustração só aumenta. O marketing tradicional? MORREU. E você está abraçado no cadáver.
          </p>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            A CULPA NÃO É SÓ SUA. É DO JOGO VICIADO que te ensinaram. Um jogo de achismos, onde "conhecer o cliente" é piada e "estratégia" é copiar o fracasso alheio.
          </p>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Consequências? DINHEIRO NO LIXO. Tempo irrecuperável. Oportunidades esmagadas. Frustração que corrói. Seu negócio estagnado, enquanto a concorrência (mesmo a mais burra) te engole.
          </p>
          <p className="text-2xl md:text-3xl font-bold text-brutal-red mb-8">
            BASTA DE ENGANAÇÃO!
          </p>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Você não precisa de mais "diquinhas". Precisa de CLAREZA. Uma clareza tão CORTANTE que vai te fazer questionar cada centavo investido até hoje.
          </p>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Pronto para a verdade que liberta e VENDE? O que temos aqui não é para covardes. É para quem está de SACO CHEIO de ser invisível e PRONTO para uma comunicação que ARROMBA PORTAS e FAZ CHOVER DINHEIRO.
          </p>
        </div>
      </Article>

      <ThematicSeparator />

      <Article title="A Máquina de Clareza Estratégica: Desnude Seu Cliente, Multiplique Seus Lucros.">
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-6 text-lg text-gray-700">
            Já sentiu o gosto amargo do fracasso. TEM SAÍDA? Sim. Um MÉTODO IMPLACÁVEL, forjado no campo de batalha: o Agente de Criação de Avatar Profundo da RG Pulse.
          </p>
          <p className="mb-6 text-lg text-gray-700">
            Esqueça "personas" de papelaria. Isso é uma AUTÓPSIA da mente e alma do seu cliente. Um mergulho que arranca o que ele DESESPERADAMENTE precisa, seus medos secretos, frustrações e desejos inconfessáveis.
          </p>
          <p className="mb-6 text-lg text-gray-700">
            Como? 15 ETAPAS ESTRATÉGICAS, brutais e reveladoras: Do DNA do cliente e suas frustrações passadas, passando pela solução ideal e transformação de identidade, até a jornada do herói, arquétipos, a Big Idea e um arsenal de conteúdo e gatilhos para você COPIAR E COLAR RESULTADOS.
          </p>
          <p className="text-xl font-bold text-gray-800 mb-6 text-center">Isso é uma MÁQUINA DE CLAREZA BRUTAL que te entrega:</p>
          {/* Interactive Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <FeatureBox 
              icon={<Zap className="w-8 h-8 text-brutal-orange" />}
              title="Comunicação na Jugular"
              description="Acerte o alvo (e o bolso) com mensagens que realmente conectam."
              className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-brutal-orange/20 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brutal-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <MousePointer className="w-4 h-4 text-brutal-orange" />
              </div>
            </FeatureBox>
            <FeatureBox 
              icon={<Target className="w-8 h-8 text-brutal-red" />}
              title="Ofertas Irresistíveis"
              description="Saiba TUDO sobre seu cliente e crie propostas que ele não pode recusar."
              className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-brutal-red/20 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brutal-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <MousePointer className="w-4 h-4 text-brutal-red" />
              </div>
            </FeatureBox>
            <FeatureBox 
              icon={<DollarSign className="w-8 h-8 text-brutal-yellow" />}
              title="Marketing Sem Desperdício"
              description="Cada centavo investido se torna um míssil teleguiado para o lucro."
              className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-brutal-yellow/20 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brutal-yellow/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <MousePointer className="w-4 h-4 text-brutal-yellow" />
              </div>
            </FeatureBox>
            <FeatureBox 
              icon={<Brain className="w-8 h-8 text-brutal-purple" />}
              title="Autoridade Incontestável"
              description="Posicione-se como o especialista que seu público procura e confia."
              className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <MousePointer className="w-4 h-4 text-purple-500" />
              </div>
            </FeatureBox>
            <FeatureBox 
              icon={<TrendingUp className="w-8 h-8 text-brutal-green" />}
              title="Resultados Crescentes"
              description="Obtenha um fluxo previsível de resultados que impulsionam seu negócio."
              className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <MousePointer className="w-4 h-4 text-green-500" />
              </div>
            </FeatureBox>
             <FeatureBox 
              icon={<CheckCircle className="w-8 h-8 text-brutal-blue" />}
              title="Processo Validado"
              description="Metodologia testada e aprovada, direto do campo de batalha para suas mãos."
              className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <MousePointer className="w-4 h-4 text-blue-500" />
              </div>
            </FeatureBox>
          </div>

          {/* Social Proof Counter */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
              <div className="flex flex-col items-center min-w-0">
                <div className="flex items-center space-x-1 text-xl sm:text-2xl font-bold text-green-600">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="animate-pulse">10,247+</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-600">Clientes Transformados</span>
              </div>
              <div className="flex flex-col items-center min-w-0">
                <div className="flex items-center space-x-1 text-xl sm:text-2xl font-bold text-blue-600">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                  <span>4.9/5</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-600">Avaliação Média</span>
              </div>
              <div className="flex flex-col items-center min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-purple-600 animate-pulse">
                  R$ 2.3M+
                </div>
                <span className="text-xs sm:text-sm text-gray-600">Faturamento Gerado</span>
              </div>
            </div>
          </div>
          <p className="mb-6 text-lg text-gray-700">
            Por que isso é diferente? Metodologia RG Pulse. Testada. Validada. Sem medo de ir fundo e esfregar a verdade na sua cara. Enquanto outros te dão um mapa infantil, nós te damos o GPS da mente do seu cliente.
          </p>
          <p className="mb-6 text-lg text-gray-700">
            Isso NÃO é para quem quer mais do mesmo. É para quem está FAMINTO por resultados REAIS e pronto para construir um negócio SÓLIDO.
          </p>
          <p className="mb-6 text-lg text-gray-700">
            A pergunta é simples: Vai continuar queimando dinheiro e se frustrando? Ou vai tomar a decisão INTELIGENTE de ter um nível de clareza que seus concorrentes nem sonham?
          </p>
        </div>
      </Article>

      <ThematicSeparator />

      <Article title="A Escolha é Sua: Escuridão ou o Farol da Clareza Brutal?">
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-6 text-lg text-gray-700">
            Opção 1: Feche a página. Continue no lodo, esperando um milagre. Seja mais um na multidão. Patético, mas é uma escolha.
          </p>
          <p className="mb-6 text-lg text-gray-700">
            Opção 2: DÊ UM BASTA. Abrace a clareza estratégica. Decida que você MERECE MAIS. Tenha em mãos um diagnóstico profundo e um plano de ataque IMPLACÁVEL.
          </p>
          <p className="mb-6 text-lg text-gray-700">
            O Agente de Criação de Avatar Profundo da RG Pulse é um INVESTIMENTO CIRÚRGICO para ESTANCAR A HEMORRAGIA de dinheiro e construir uma MÁQUINA DE VENDAS.
          </p>
          <p className="mb-6 text-lg text-gray-700">
            Você recebe um ARSENAL NUCLEAR de inteligência: Mapa da mente do cliente, linguagem que converte, direcionamento estratégico, fim da adivinhação.
          </p>
          <p className="mb-6 text-lg text-gray-700">
            IMAGINE: Anúncios que imprimem dinheiro. Conteúdo que vicia. E-mails devorados. Vendas no piloto automático. PAZ DE ESPÍRITO.
          </p>
          <p className="text-2xl md:text-3xl font-bold text-brutal-red mb-8">
            CHEGOU A HORA. A clareza MONSTRUOSA está a um clique.
          </p>
          {/* Enhanced CTA with Urgency */}
          <div className="text-center mt-10 mb-8 px-4">
            <div className="relative inline-block w-full sm:w-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-brutal-red to-brutal-orange rounded-lg blur opacity-75 animate-pulse"></div>
              <Button 
                onClick={() => scrollToForm('cta_final')} 
                className="relative bg-gradient-to-r from-brutal-red to-brutal-orange hover:from-brutal-orange hover:to-brutal-red text-white font-bold py-4 sm:py-6 px-4 sm:px-8 text-sm sm:text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 group w-full sm:w-auto"
              >
                <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-spin" />
                <span className="hidden sm:inline">QUERO MEU CLIENTE DESNUDADO E PARAR DE RASGAR DINHEIRO AGORA!</span>
                <span className="sm:hidden">QUERO PARAR DE RASGAR DINHEIRO!</span>
                <ArrowDown className="ml-2 h-4 w-4 sm:h-5 sm:w-5 animate-bounce" />
              </Button>
            </div>
            <p className="mt-4 text-xs sm:text-sm text-red-600 font-semibold animate-pulse">
              ⚡ Últimas 24 horas: 127 pessoas garantiram sua vaga
            </p>
          </div>
          <p className="mb-6 text-lg text-gray-700">
            Se está pronto para jogar na Champions League do marketing, ESTA É A SUA CHANCE.
          </p>
          <p className="mb-6 text-lg text-gray-700">
            Clareza precede a fortuna. Confusão precede a falência. De que lado você vai estar?
          </p>
          <hr className="my-8 border-gray-400" />
          <p className="text-md text-gray-600 mb-2">
            P.S.: NÃO É PARA QUALQUER UM. Medo de verdades dolorosas? Acredita em fadas? NÃO CLIQUE. Agora, se quer CLAREZA BRUTAL que FORJA IMPÉRIOS... bem-vindo ao jogo dos adultos.
          </p>
        </div>
      </Article>

      {/* Seção do Formulário como um Artigo */}
      <Article title="Garanta Sua Vaga Agora">
        <div id="lead-form-section" className="max-w-2xl mx-auto text-center px-4">
          <div className="mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">🔥 ACESSO LIBERADO POR TEMPO LIMITADO</h3>
            <p className="text-sm sm:text-base text-gray-700 mb-4 max-w-lg mx-auto">
              Preencha o formulário abaixo para ter acesso ao material exclusivo e começar a transformar seus resultados hoje mesmo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span>347 pessoas online agora</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>Resposta em 2 minutos</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-brutal-red to-brutal-orange rounded-xl blur opacity-25"></div>
            <div className="relative bg-white p-8 rounded-xl shadow-2xl border-2 border-gray-200">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-brutal-red text-white px-4 py-1 rounded-full text-sm font-bold">
                  OFERTA ESPECIAL
                </div>
              </div>
              <LeadCaptureForm onComplete={handleFormComplete} />
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span>Dados 100% seguros</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span>Sem spam</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span>Acesso imediato</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Article>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => scrollToForm('floating_cta')}
          className="bg-brutal-red hover:bg-brutal-orange text-white rounded-full p-4 shadow-2xl hover:shadow-brutal-red/50 transition-all duration-300 transform hover:scale-110 animate-bounce"
        >
          <Zap className="w-6 h-6" />
        </Button>
      </div>

      {/* Exit Intent Popup Trigger */}
      <div className="hidden" id="exit-intent-trigger"></div>
    </NewspaperLayout>
  );
};

export default Index;