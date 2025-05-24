import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Target, TrendingUp, Zap, Eye, Brain, DollarSign } from "lucide-react";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { SimpleLayout, Section as BaseSection, SectionProps } from "@/components/SimpleLayout";

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

// Componente Section simplificado
const Section = BaseSection;

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
    <SimpleLayout 
      title="Sua Jornada para o Sucesso no Marketing Digital"
      subtitle="Descubra como transformar sua estratégia e obter resultados reais"
    >
      {/* Seção Principal */}
      <Section className="mt-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block bg-gradient-to-r from-brutal-red to-brutal-orange text-white text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-6">
            Destaque Especial
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            Seu Marketing é um Lixo?{' '}
            <span className="text-brutal-red">A Verdade Brutal</span> que Vai Mudar Tudo
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Descubra por que 96% dos agentes imobiliários estão desperdiçando dinheiro com marketing ineficaz e como você pode estar entre os 4% que dominam o jogo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-brutal-red to-brutal-orange hover:opacity-90 transition-opacity text-lg font-bold py-6 px-8 shadow-lg"
              onClick={() => scrollToForm('hero')}
            >
              <Zap className="mr-2 h-5 w-5" />
              Quero Melhorar Meu Agora
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-gray-300 hover:border-brutal-red text-gray-700 hover:text-brutal-red text-lg font-bold py-6 px-8 transition-colors"
              onClick={() => scrollToForm('learn_more')}
            >
              <Eye className="mr-2 h-5 w-5" />
              Me Mostre Como Funciona
            </Button>
          </div>
        </div>
      </Section>

      {/* Seção da Verdade */}
      <Section className="bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="text-brutal-yellow">A Verdade que Ninguém Ousa Dizer</span>
          </h2>
          <p className="text-gray-700 text-lg mb-8">Mas Seu Bolso Grita</p>
          
          <div className="bg-gradient-to-r from-brutal-red to-brutal-orange p-6 rounded-lg mb-8 border-2 border-brutal-yellow">
            <p className="text-2xl md:text-3xl font-bold text-white text-center">
              Chega de queimar dinheiro e falar sozinho.<br/>
              A <span className="text-brutal-yellow">CLAREZA BRUTAL</span> para vender como gente grande está aqui.
            </p>
          </div>

          <p className="mb-6 text-lg text-gray-700">
            Você já se perguntou por que algumas empresas conseguem vender com tanta facilidade enquanto você luta para fechar cada negócio? A resposta pode te surpreender.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 bg-white border-2 border-gray-200 hover:border-brutal-red transition-colors">
              <h3 className="text-xl font-bold mb-3 text-gray-800">O Erro Fatal</h3>
              <p className="text-gray-700">
                A maioria dos profissionais de marketing está focada nas coisas erradas: design bonito, textos criativos e campanhas virais. Mas esquecem do principal: a mensagem certa para a pessoa certa.
              </p>
            </Card>
            
            <Card className="p-6 bg-white border-2 border-gray-200 hover:border-brutal-orange transition-colors">
              <h3 className="text-xl font-bold mb-3 text-gray-800">A Solução</h3>
              <p className="text-gray-700">
                Descubra como criar mensagens que ressoam profundamente com seu público-alvo e transforme sua taxa de conversão da noite para o dia.
              </p>
            </Card>
          </div>

          <div className="text-center mt-10 mb-8">
            <Button 
              onClick={() => scrollToForm('cta1')} 
              className="bg-gradient-to-r from-brutal-red to-brutal-orange hover:from-brutal-orange hover:to-brutal-red text-white font-bold py-4 px-8 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Zap className="mr-2 h-5 w-5" />
              QUERO APRENDER AGORA
            </Button>
          </div>
        </div>
      </Section>

      {/* Seção de Destaque */}
      <Section className="bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">O Que Você Vai Aprender</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Target className="h-10 w-10 mb-4 text-brutal-red mx-auto" />,
                title: "Foco Estratégico",
                description: "Aprenda a identificar e focar nos 20% que geram 80% dos resultados."
              },
              {
                icon: <TrendingUp className="h-10 w-10 mb-4 text-brutal-orange mx-auto" />,
                title: "Crescimento Acelerado",
                description: "Estratégias comprovadas para escalar suas vendas de forma sustentável."
              },
              {
                icon: <DollarSign className="h-10 w-10 mb-4 text-brutal-yellow mx-auto" />,
                title: "Retorno Garantido",
                description: "Métodos que já geraram milhões em vendas para nossos clientes."
              }
            ].map((item, index) => (
              <Card key={index} className="p-8 text-center bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow h-full">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Seção do Formulário */}
      <Section id="lead-form-section" className="bg-white py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            <span className="text-brutal-red">Garanta Sua Vaga Agora</span>
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Preencha o formulário abaixo para ter acesso ao material exclusivo e começar a transformar seus resultados hoje mesmo.
          </p>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <LeadCaptureForm onComplete={handleFormComplete} />
            <p className="text-sm text-gray-500 mt-4">
              Seus dados estão seguros. Nós respeitamos sua privacidade.
            </p>
          </div>
        </div>
      </Section>
    </SimpleLayout>
  );
};

export default Index;
