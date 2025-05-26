import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ArrowRight,
  Lightbulb,
  BarChart2,
  Users,
  MessageSquareWarning,
  ArrowUpRight,
  ChevronRight,
  Check,
  X,
  Clock,
  Award,
  Brain,
  ZapOff,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  Eye,
  Target
} from "lucide-react";
import LeadCaptureForm from "@/components/LeadCaptureForm"; 
import { SimpleLayout, Section } from "@/components/SimpleLayout";

const AIPersonV2 = () => {
  const [formSection, setFormSection] = useState<string | null>(null);

  const scrollToForm = (section: string) => {
    setFormSection(section);
    document.getElementById('ai-lead-form-section')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  };

  const handleFormComplete = () => {
    window.location.href = "https://pay.herospark.com/rg-pulse-agente-criador-de-avatar-aprofundado-412999";
  };

  return (
    <SimpleLayout 
      title="RG Pulse - Agente de Criação de Avatar"
      subtitle="A Verdade Nua, Crua e DOLOROSA Sobre o Marketing Que NINGUÉM Tem Coragem de Te Dizer"
      pageTheme="dark"
    >
      {/* Hero Section */}
      <Section 
        variant="transparent" 
        className="pt-16 pb-20 md:pt-24 md:pb-32 text-center !my-0"
      >
        <div className="container px-4 mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-brutal-red bg-brutal-red/10 rounded-full border border-brutal-red/30">
            <AlertTriangle className="w-4 h-4 mr-2" />
            ALERTA: Conteúdo sem filtros
          </div>
          
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-brutal-paper sm:text-5xl md:text-6xl lg:text-7xl font-oswald leading-tight">
            RG Pulse - Agente de Criação de Avatar
            <span className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-brutal-red via-brutal-orange to-brutal-yellow">
              Gritar Para as Paredes?
            </span>
          </h1>
          
          <p className="max-w-4xl mx-auto mt-8 text-xl sm:text-2xl font-medium text-brutal-paper/90 font-sans leading-relaxed">
            Você está aí. De novo. Olhando para essa tela, esperando mais uma pílula mágica, mais uma promessa vazia de "resultados explosivos".
            <span className="block mt-4 text-brutal-yellow font-bold">
              Chega de marketing de mentira. Hora da verdade.
            </span>
          </p>
          
          <div className="flex flex-col items-center w-full max-w-2xl gap-4 mt-12 sm:flex-row sm:justify-center mx-auto">
            <Button 
              size="lg" 
              onClick={() => scrollToForm('hero_cta_parar_perder_dinheiro')}
              className="font-oswald uppercase tracking-wider w-full sm:w-auto bg-gradient-to-r from-brutal-red to-brutal-orange hover:from-brutal-orange hover:to-brutal-red text-brutal-darker font-bold py-4 px-6 text-base sm:py-5 sm:px-8 sm:text-lg shadow-brutal-md border-2 border-brutal-dark hover:shadow-brutal-lg focus:ring-brutal-yellow active:translate-y-0.5 active:shadow-brutal-base rounded-sm h-auto whitespace-normal"
            >
              Quero Parar de Perder Dinheiro Agora
              <Zap className="w-5 h-5 ml-2 animate-pulse" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => scrollToForm('hero_cta_como_funciona')}
              className="font-oswald uppercase tracking-wider w-full sm:w-auto font-bold py-4 px-6 text-base sm:py-5 sm:px-8 sm:text-lg border-2 border-brutal-paper/50 hover:text-brutal-red hover:border-brutal-red text-brutal-paper shadow-brutal-base focus:ring-brutal-red active:translate-y-0.5 active:shadow-none rounded-sm bg-brutal-dark/70 backdrop-blur-sm h-auto whitespace-normal"
            >
              Me Mostre Como Isso Funciona
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center mt-10 gap-x-6 gap-y-3 text-sm text-brutal-paper/60 font-sans">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-brutal-yellow mr-2" />
              <span>Implementação Imediata</span>
            </div>
            <div className="hidden sm:block text-brutal-paper/30">•</div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-brutal-yellow mr-2" />
              <span>Resultados Comprovados</span>
            </div>
            <div className="hidden sm:block text-brutal-paper/30">•</div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-brutal-yellow mr-2" />
              <span>Garantia de 7 Dias</span>
            </div>
          </div>
        </div>
      </Section>

      {/* O Jogo Manipulado */}
      <Section 
        variant="dark-card"
        className="py-16 md:py-24 bg-gradient-to-br from-brutal-darker to-brutal-dark/95"
      >
        <div className="container px-4 mx-auto">
          <div className="max-w-5xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-extrabold text-brutal-paper sm:text-4xl md:text-5xl font-oswald leading-tight">
              A CULPA NÃO É SUA.
              <span className="block text-brutal-red mt-2">
                A CULPA É DO JOGO MANIPULADO E VICIADO
              </span>
            </h2>
            <p className="mt-6 text-lg text-brutal-paper/80 font-sans leading-relaxed max-w-4xl mx-auto">
              Um jogo onde "entender o cliente" é preencher uma planilha ridícula com dados demográficos inúteis e achismos patéticos. Um jogo onde "estratégia" é copiar o que o concorrente fez mês passado.
            </p>
          </div>

          {/* Problemas Reais */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {[
              {
                icon: <DollarSign className="w-8 h-8 text-brutal-red" />,
                title: "Dinheiro Queimando",
                description: "Você investe em anúncios, conteúdo, redes sociais... e o retorno? Uma planilha cheia de números que não significam NADA para seu caixa.",
                solution: "Solução: IA que mostra EXATAMENTE o que traz retorno e o que é só gasto inútil."
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-brutal-orange" />,
                title: "Resultados Inexistentes",
                description: "Seus gráficos estão mais planos que pista de aeroporto. Nada de crescimento, só despesa atrás de despesa.",
                solution: "Solução: Estratégias baseadas em dados reais, não em palpites de 'especialista'."
              },
              {
                icon: <Eye className="w-8 h-8 text-brutal-yellow" />,
                title: "Invisibilidade Digital",
                description: "Seu negócio é um fantasma online. Ninguém te acha, ninguém te vê, ninguém se importa.",
                solution: "Solução: Posicionamento estratégico que coloca sua mensagem na frente das pessoas certas, na hora certa."
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="group relative p-6 bg-brutal-dark/50 backdrop-blur-sm border border-brutal-dark/50 rounded-xl hover:border-brutal-red/50 transition-all duration-300 hover:shadow-lg hover:shadow-brutal-red/10"
              >
                <div className="absolute -top-4 left-6 w-10 h-10 flex items-center justify-center bg-brutal-red rounded-full border-4 border-brutal-dark">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold font-oswald text-brutal-yellow mt-6 mb-3">{item.title}</h3>
                <p className="text-brutal-paper/80 font-sans mb-4">{item.description}</p>
                <div className="mt-4 p-3 bg-brutal-darker/70 rounded-lg border border-brutal-dark/50 text-sm text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="font-bold text-brutal-yellow">SOLUÇÃO:</span> {item.solution}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Intermediário */}
          <div className="max-w-4xl mx-auto px-6 py-8 text-center bg-gradient-to-r from-brutal-red/10 to-brutal-orange/5 border border-brutal-red/30 rounded-xl">
            <h3 className="text-2xl font-bold text-brutal-paper font-oswald mb-4">
              Se você se identificou com <span className="text-brutal-yellow">QUALQUER COISA</span> acima...
            </h3>
            <p className="text-brutal-paper/80 font-sans mb-6 max-w-2xl mx-auto">
              Não é você que está falhando. É o jogo que está viciado. E nós temos a chave para mudar isso.
            </p>
            <Button 
              size="lg"
              onClick={() => scrollToForm('game_over_cta')}
              className="font-oswald uppercase tracking-wider w-full md:w-auto bg-gradient-to-r from-brutal-yellow to-brutal-orange hover:from-brutal-orange hover:to-brutal-yellow text-brutal-darker font-bold py-4 px-4 text-base sm:py-4 sm:px-6 md:px-10 shadow-brutal-md border-2 border-brutal-dark hover:shadow-brutal-lg focus:ring-brutal-red active:translate-y-0.5 active:shadow-brutal-base rounded-sm sm:text-lg h-auto whitespace-normal"
            >
              Quero Virar o Jogo Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </Section>

      {/* Oferta Irrecusável */}
      <Section 
        id="ai-lead-form-section"
        variant="dark-card"
        className="py-16 md:py-24 bg-gradient-to-br from-brutal-dark to-brutal-darker !my-0"
      >
        <div className="container px-4 mx-auto">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <span className="inline-block px-4 py-2 mb-4 text-sm font-medium text-brutal-yellow bg-brutal-yellow/10 rounded-full border border-brutal-yellow/30">
              OFERTA POR TEMPO LIMITADO
            </span>
            <h2 className="text-3xl font-extrabold text-brutal-paper sm:text-4xl md:text-5xl font-oswald leading-tight">
              A Hora da Virada Começa <span className="text-brutal-yellow">Agora</span>
            </h2>
            <p className="mt-4 text-lg text-brutal-paper/80 font-sans max-w-3xl mx-auto">
              Você tem duas opções: continuar fazendo a mesma coisa e esperar resultados diferentes (loucura, certo?) ou dar o primeiro passo para uma revolução no seu negócio.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
            {/* Coluna da Esquerda - Benefícios */}
            <div className="lg:w-3/5 space-y-6">
              <div className="p-8 bg-brutal-dark/50 backdrop-blur-sm border border-brutal-dark/50 rounded-xl">
                <h3 className="text-2xl font-bold text-brutal-yellow font-oswald mb-6">O Que Você Vai Levar:</h3>
                
                <div className="space-y-6">
                  {[
                    {
                      icon: <Lightbulb className="w-6 h-6 text-brutal-yellow" />,
                      title: "Diagnóstico Completo",
                      description: "Análise detalhada de onde seu dinheiro está vazando e como recuperá-lo."
                    },
                    {
                      icon: <BarChart2 className="w-6 h-6 text-brutal-yellow" />,
                      title: "Estratégia Personalizada",
                      description: "Um plano de ação claro, sem jargões, focado apenas no que traz resultado."
                    },
                    {
                      icon: <Users className="w-6 h-6 text-brutal-yellow" />,
                      title: "Acesso à Comunidade",
                      description: "Conecte-se com outros empreendedores que estão na mesma jornada de transformação."
                    },
                    {
                      icon: <MessageSquareWarning className="w-6 h-6 text-brutal-yellow" />,
                      title: "Suporte Prioritário",
                      description: "Nossa equipe está pronta para te ajudar a superar qualquer obstáculo."
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {item.icon}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-bold text-brutal-paper font-oswald">{item.title}</h4>
                        <p className="mt-1 text-brutal-paper/70 font-sans">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-brutal-red/10 border border-brutal-red/20 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-brutal-red" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-brutal-paper/90 font-sans">
                        <span className="font-bold">Atenção:</span> Esta oferta é exclusiva para quem está realmente pronto para agir. Se você está procurando mais uma solução mágica, este não é o lugar certo para você.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna da Direita - Formulário */}
            <div className="lg:w-2/5">
              <div className="sticky top-6">
                <div className="bg-brutal-darker border border-brutal-dark/50 rounded-xl overflow-hidden shadow-xl">
                  <div className="p-6 bg-gradient-to-r from-brutal-red to-brutal-orange">
                    <h3 className="text-2xl font-bold text-brutal-darker font-oswald text-center">
                      Comece Agora
                    </h3>
                    <p className="mt-1 text-center text-brutal-dark font-medium text-sm">
                      Preencha para falar com um especialista
                    </p>
                  </div>
                  
                  <div className="p-6">
                    <LeadCaptureForm onComplete={handleFormComplete} />
                    
                    <div className="mt-6 text-center">
                      <p className="text-xs text-brutal-paper/60 font-sans">
                        Seus dados estão seguros. Odiamos spam tanto quanto você.
                      </p>
                      <div className="mt-4 flex items-center justify-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-brutal-green" />
                        <span className="text-xs text-brutal-paper/50">Protegido e seguro</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Garantia */}
          <div className="max-w-3xl mx-auto mt-16 p-6 bg-brutal-dark/50 border border-brutal-dark rounded-xl">
            <div className="flex flex-col md:flex-row items-center text-center md:text-left">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brutal-yellow/10 border border-brutal-yellow/30">
                  <Award className="w-8 h-8 text-brutal-yellow" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-brutal-yellow font-oswald">Garantia de Satisfação</h3>
                <p className="mt-1 text-brutal-paper/80 font-sans">
                  Se em 7 dias você não estiver completamente satisfeito, devolvemos seu dinheiro. Sem perguntas, sem burocracia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Depoimentos Reais */}
      <Section 
        variant="dark-card"
        className="py-16 md:py-24 bg-brutal-darker"
      >
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-extrabold text-brutal-paper sm:text-4xl font-oswald">
              Quem já <span className="text-brutal-yellow">Virou o Jogo</span>
            </h2>
            <p className="mt-4 text-lg text-brutal-paper/70 font-sans max-w-2xl mx-auto">
              Não acredite em nós. Acredite em quem já passou por isso e está colhendo os resultados.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Marcela R.",
                role: "Dona de E-commerce",
                content: "Em 45 dias, aumentamos o faturamento em 318%. Antes, eu só via dinheiro indo embora em anúncios que não davam retorno. Hoje, cada centavo é investido com sabedoria.",
                avatar: "MR"
              },
              {
                name: "Ricardo T.",
                role: "Consultor Financeiro",
                content: "Sempre fui cético com marketing digital, mas os números não mentem. Tripliquei minha base de clientes em 2 meses. Meu único arrependimento foi não ter começado antes.",
                avatar: "RT"
              },
              {
                name: "Fernanda L.",
                role: "Coach de Carreira",
                content: "Estava prestes a desistir do meu negócio quando encontrei essa solução. Em 30 dias, já estava com agenda cheia e precisando contratar ajuda. Simplesmente transformador.",
                avatar: "FL"
              },
              {
                name: "Gustavo M.",
                role: "Dono de Agência",
                content: "Implementamos para nossos clientes e os resultados foram tão bons que dobramos nosso preço. E ainda assim, continuamos com fila de espera. Isso sim é escalabilidade real.",
                avatar: "GM"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="p-6 bg-brutal-dark/50 backdrop-blur-sm border border-brutal-dark/50 rounded-xl hover:border-brutal-yellow/30 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brutal-yellow to-brutal-orange flex items-center justify-center text-brutal-darker font-bold text-lg mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-brutal-paper font-oswald">{testimonial.name}</h4>
                    <p className="text-sm text-brutal-paper/60 font-sans">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-brutal-paper/80 font-sans italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>

          {/* CTA Final */}
          <div className="mt-16 max-w-4xl mx-auto p-8 bg-gradient-to-r from-brutal-red/10 to-brutal-orange/5 border border-brutal-red/30 rounded-xl text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-brutal-paper font-oswald mb-4">
              Chega de Ficar para Trás
            </h3>
            <p className="text-brutal-paper/80 font-sans mb-6 max-w-2xl mx-auto">
              O sucesso não espera. Enquanto você hesita, seu concorrente já está aplicando essas estratégias.
            </p>
            <Button 
              size="lg"
              onClick={() => scrollToForm('final_cta')}
              className="font-oswald uppercase tracking-wider w-full md:w-auto bg-gradient-to-r from-brutal-yellow to-brutal-orange hover:from-brutal-orange hover:to-brutal-yellow text-brutal-darker font-bold py-4 px-4 text-base sm:py-4 sm:px-6 md:px-10 rounded-lg sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 h-auto whitespace-normal"
            >
              Quero Começar Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </Section>

      {/* Rodapé */}
      <footer className="bg-brutal-darker border-t border-brutal-dark/50 py-8">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-brutal-paper/60 text-sm font-sans">
                © {new Date().getFullYear()} RG Pulse. Todos os direitos reservados.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-brutal-paper/60 hover:text-brutal-yellow transition-colors text-sm font-sans">
                Termos de Uso
              </a>
              <a href="#" className="text-brutal-paper/60 hover:text-brutal-yellow transition-colors text-sm font-sans">
                Política de Privacidade
              </a>
              <a href="mailto:suporte@rgpulse.com.br" className="text-brutal-paper/60 hover:text-brutal-yellow transition-colors text-sm font-sans">
                Contato
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-brutal-dark/30 text-center">
            <p className="text-xs text-brutal-paper/40 font-sans">
              Este site não é afiliado ao Facebook ou a qualquer entidade do Facebook. Depois de sair do Facebook, a responsabilidade não é deles e sim do nosso site. Fazemos todos os esforços para indicar claramente e mostrar todas as provas do produto e usamos resultados reais.
            </p>
            <p className="mt-2 text-xs text-brutal-paper/40 font-sans">
              Resultados podem variar de pessoa para pessoa. Esses depoimentos não são garantia de que você obterá os mesmos resultados.
            </p>
          </div>
        </div>
      </footer>
    </SimpleLayout>
  );
};

export default AIPersonV2;