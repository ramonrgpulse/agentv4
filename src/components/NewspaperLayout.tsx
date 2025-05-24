import { ReactNode } from 'react';

interface NewspaperLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const NewspaperLayout = ({ children, title, subtitle }: NewspaperLayoutProps) => {
  return (
    <div 
      className="min-h-screen bg-newsprint bg-repeat bg-fixed" 
      style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23e5e5e5\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
        backgroundColor: '#f5f5f0',
        backgroundBlendMode: 'multiply'
      }}
    >
      {/* Cabeçalho do Jornal */}
      <header className="border-b-8 border-black py-4">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xs uppercase tracking-widest text-gray-600 mb-1">{subtitle}</div>
          <h1 className="text-4xl md:text-6xl font-black font-serif tracking-tight">{title}</h1>
          <div className="text-sm text-gray-600 mt-2">Sua fonte de notícias sobre estratégias de marketing eficazes</div>
        </div>
      </header>

      {/* Data e Edição */}
      <div className="border-b border-gray-300 py-2">
        <div className="container mx-auto px-4 flex justify-between text-xs text-gray-600">
          <div>Ano 1, Edição 1</div>
          <div>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div>Preço: Grátis</div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export const Article = ({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) => (
  <article className={`bg-white p-6 shadow-lg border border-gray-200 mb-8 ${className}`}>
    <h2 className="text-3xl font-bold font-serif mb-4">{title}</h2>
    <div className="prose max-w-none">
      {children}
    </div>
  </article>
);

export const Headline = ({ title, subtitle, className = '' }: { title: string; subtitle: string; className?: string }) => (
  <div className={`text-center py-12 ${className}`}>
    <h1 className="text-4xl md:text-6xl font-black font-serif leading-tight mb-4">
      {title}
    </h1>
    <p className="text-xl md:text-2xl font-serif italic max-w-3xl mx-auto">
      {subtitle}
    </p>
  </div>
);
