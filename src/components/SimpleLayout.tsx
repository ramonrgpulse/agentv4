import { ReactNode } from 'react';

interface SimpleLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const SimpleLayout = ({ children, title, subtitle }: SimpleLayoutProps) => {
  return (
    <div 
      className="min-h-screen bg-gray-50"
      style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23e5e5e5\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Cabeçalho Simples */}
      <header className="bg-gradient-to-r from-brutal-red to-brutal-orange text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{title}</h1>
          {subtitle && <p className="text-xl opacity-90">{subtitle}</p>}
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

interface BaseSectionProps {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}

export type SectionProps = BaseSectionProps & Omit<React.HTMLAttributes<HTMLElement>, 'title'>;

export const Section = ({ 
  title, 
  children, 
  className = '',
  ...props 
}: SectionProps) => (
  <section 
    className={`bg-white rounded-lg shadow-sm p-6 mb-6 ${className}`}
    {...props}
  >
    {title && <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>}
    <div className="text-gray-700">
      {children}
    </div>
  </section>
);

export const Heading = ({ title, subtitle, className = '' }: { title: string; subtitle?: string; className?: string }) => (
  <div className={`text-center py-8 ${className}`}>
    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
      {title}
    </h1>
    {subtitle && (
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        {subtitle}
      </p>
    )}
  </div>
);
