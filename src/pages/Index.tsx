import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Target, TrendingUp, Zap, Brain, DollarSign } from "lucide-react";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { NewspaperLayout, Article, Headline } from "@/components/NewspaperLayout";
import { PullQuote, FeatureBox, ThematicSeparator } from "@/components/NewspaperElements";

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

  const scrollToForm = (section: string) => {
    setShowForm(true);
    setFormSection(section);
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
      <Headline 
        title="Seu Marketing é um Lixo? A Verdade que Ninguém Ousa Dizer (Mas Seu Bolso Grita)."
        subtitle="Chega de queimar dinheiro e falar sozinho. A CLAREZA BRUTAL para vender como gente grande está aqui."
      />
      
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <FeatureBox 
              icon={<Zap className="w-8 h-8 text-brutal-orange" />}
              title="Comunicação na Jugular"
              description="Acerte o alvo (e o bolso) com mensagens que realmente conectam."
              className="hover:scale-105 transition-transform duration-300"
            />
            <FeatureBox 
              icon={<Target className="w-8 h-8 text-brutal-red" />}
              title="Ofertas Irresistíveis"
              description="Saiba TUDO sobre seu cliente e crie propostas que ele não pode recusar."
              className="hover:scale-105 transition-transform duration-300"
            />
            <FeatureBox 
              icon={<DollarSign className="w-8 h-8 text-brutal-yellow" />}
              title="Marketing Sem Desperdício"
              description="Cada centavo investido se torna um míssil teleguiado para o lucro."
              className="hover:scale-105 transition-transform duration-300"
            />
            <FeatureBox 
              icon={<Brain className="w-8 h-8 text-brutal-purple" />}
              title="Autoridade Incontestável"
              description="Posicione-se como o especialista que seu público procura e confia."
              className="hover:scale-105 transition-transform duration-300"
            />
            <FeatureBox 
              icon={<TrendingUp className="w-8 h-8 text-brutal-green" />}
              title="Resultados Crescentes"
              description="Obtenha um fluxo previsível de resultados que impulsionam seu negócio."
              className="hover:scale-105 transition-transform duration-300"
            />
             <FeatureBox 
              icon={<CheckCircle className="w-8 h-8 text-brutal-blue" />}
              title="Processo Validado"
              description="Metodologia testada e aprovada, direto do campo de batalha para suas mãos."
              className="hover:scale-105 transition-transform duration-300"
            />
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
          <div className="text-center mt-10 mb-8">
            <Button 
              onClick={() => scrollToForm('cta_final')} 
              className="bg-gradient-to-r from-brutal-red to-brutal-orange hover:from-brutal-orange hover:to-brutal-red text-white font-bold py-4 px-8 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
            >
              <Zap className="mr-2 h-5 w-5" />
              QUERO MEU CLIENTE DESNUDADO E PARAR DE RASGAR DINHEIRO AGORA!
            </Button>
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
        <div id="lead-form-section" className="max-w-2xl mx-auto text-center">
          <p className="text-gray-700 mb-8 max-w-lg mx-auto">
            Preencha o formulário abaixo para ter acesso ao material exclusivo e começar a transformar seus resultados hoje mesmo.
          </p>
          
          <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-300">
            <LeadCaptureForm onComplete={handleFormComplete} />
            <p className="text-sm text-gray-500 mt-4">
              Seus dados estão seguros. Nós respeitamos sua privacidade.
            </p>
          </div>
        </div>
      </Article>
    </NewspaperLayout>
  );
};

export default Index;