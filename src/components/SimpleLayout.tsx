import { ReactNode } from 'react';

interface SimpleLayoutProps {
  children: ReactNode;
  title: string; 
  subtitle: string; 
  className?: string;
  pageTheme?: 'light' | 'dark'; // 'light' is newspaper, 'dark' is for AIPersonV2
}

export const SimpleLayout = ({ 
  children, 
  title, 
  subtitle, 
  className, 
  pageTheme = 'light' // Default to newspaper/light theme
}: SimpleLayoutProps) => {

  let layoutBaseClasses = 'bg-background text-foreground'; // Default for light (newspaper)
  let headerClasses = 'bg-primary text-primary-foreground shadow-md'; // Red bg, white text for light
  let headerTitleClasses = 'text-primary-foreground';
  let headerSubtitleClasses = 'text-primary-foreground/90';
  let footerBorder = 'border-border/50';
  let dotPatternColorFill = 'hsl(var(--foreground))'; // Uses main text color of the current theme for dots
  let dotPatternOpacityValue = '0.08';

  if (pageTheme === 'dark') {
    layoutBaseClasses = 'bg-brutal-darker text-brutal-paper'; // Main dark background
    headerClasses = 'bg-brutal-dark shadow-lg'; // Header slightly lighter dark
    headerTitleClasses = 'text-brutal-yellow'; // Yellow title on dark header for AIPersonV2
    headerSubtitleClasses = 'text-brutal-paper/80';
    footerBorder = 'border-brutal-paper/20';
    dotPatternColorFill = 'hsl(var(--brutal-paper-hsl))'; // Light dots on dark background
    dotPatternOpacityValue = '0.04'; // Make dots more subtle on dark theme
  }
  
  return (
    <div 
      className={`min-h-screen flex flex-col antialiased font-sans ${layoutBaseClasses} ${className || ''}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='${encodeURIComponent(dotPatternColorFill)}' fill-opacity='${dotPatternOpacityValue}' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        backgroundAttachment: 'fixed',
      }}
    >
      <header 
        className={`py-6 md:py-8 sticky top-0 z-40 transition-colors duration-300 ${headerClasses}`}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className={`text-3xl md:text-4xl font-bold mb-1 font-heading ${headerTitleClasses}`}>{title}</h1> 
          {subtitle && <p className={`text-lg md:text-xl ${headerSubtitleClasses}`}>{subtitle}</p>}
        </div>
      </header>

      <main className="container mx-auto px-0 sm:px-4 py-8 md:py-12 flex-grow">
        {children}
      </main>

      <footer className={`py-8 mt-auto border-t text-center font-sans ${footerBorder} ${pageTheme === 'dark' ? 'bg-brutal-dark' : 'bg-background/70 backdrop-blur-sm'}`}>
        <div className="container mx-auto px-4">
            <p className={`text-sm ${pageTheme === 'dark' ? 'text-brutal-paper/60' : 'text-muted-foreground'}`}>
                © {new Date().getFullYear()} {title}. Todos os direitos reservados.
            </p>
        </div>
      </footer>
    </div>
  );
};

// --------------- Section Component (Themed for SimpleLayout) ---------------
type SectionVariant = 'default' | 'transparent' | 'primary' | 'dark-card' | 'light-card';

interface SectionOwnProps {
  /**
   * Título opcional da seção. Pode ser uma string ou um nó React.
   * Será renderizado como um h2 por padrão.
   */
  title?: ReactNode;
  /**
   * Conteúdo principal da seção.
   */
  children: ReactNode;
  /**
   * Variante de estilo da seção.
   * - 'default': Estilo padrão de cartão com fundo claro
   * - 'transparent': Fundo transparente, útil para herdar cores do container pai
   * - 'primary': Estilo primário com cores temáticas
   * - 'dark-card': Cartão com fundo escuro
   * - 'light-card': Cartão com fundo claro
   */
  variant?: SectionVariant;
  /**
   * Classes CSS adicionais para personalização.
   */
  className?: string;
  /**
   * Nível de título (h1-h6) para o título da seção.
   * Padrão é 'h2'.
   */
  titleLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

type SectionProps = SectionOwnProps & Omit<React.HTMLAttributes<HTMLElement>, keyof SectionOwnProps>;

/**
 * Componente de seção temática que se adapta ao tema do SimpleLayout.
 * Oferece várias variantes de estilo e é totalmente acessível.
 */
export const Section = ({
  title,
  children,
  className = '',
  variant = 'default',
  titleLevel = 2,
  ...props
}: SectionProps) => {
  
  let sectionBaseClasses = 'rounded-lg p-6 md:p-8 my-8 md:my-12 shadow-lg'; // Common classes
  let sectionThemeClasses = '';
  // Title color will be inherited from section's text color or can be set specifically

  switch (variant) {
    case 'transparent':
      sectionBaseClasses = 'my-0 py-12 md:py-16'; // Different padding for transparent sections, often full-width heroes
      sectionThemeClasses = 'bg-transparent text-inherit shadow-none rounded-none'; 
      break;
    case 'primary':
      sectionThemeClasses = 'bg-primary text-primary-foreground border-2 border-primary-foreground/30'; 
      break;
    case 'dark-card': // For use on a light page (like newspaper Index) if you want a dark themed section
      sectionThemeClasses = 'bg-brutal-dark text-brutal-paper border-2 border-brutal-red/50'; 
      break;
    case 'light-card': // For use on a dark page (like AIPersonV2) for a light card effect
      sectionThemeClasses = 'bg-brutal-paper text-brutal-dark border border-brutal-dark/30';
      break;
    case 'default': 
    default:
      // This will use the CSS --card and --card-foreground variables which adapt to light/dark mode 
      // if your ThemeProvider and tailwind.css .dark areset up correctly.
      // For SimpleLayout dark pageTheme, --card should be dark, --card-foreground light.
      // For SimpleLayout light pageTheme (newspaper), --card is light, --card-foreground dark.
      sectionThemeClasses = 'bg-card text-card-foreground border border-border/70';
      break;
  }

  // Extrai as propriedades que não devem ser repassadas para o elemento HTML
  const { id, style, ...restProps } = props;
  
  // Gera um ID único para a seção se não for fornecido
  const sectionId = id || `section-${Math.random().toString(36).substr(2, 9)}`;
  
  // Extrai title e titleLevel de props para evitar erros de tipagem
  const sectionTitle = 'title' in props ? props.title : undefined;
  // Garante que titleLevel seja sempre um número entre 1 e 6
  const sectionTitleLevel = ('titleLevel' in props && typeof props.titleLevel === 'number')
    ? Math.min(Math.max(Number(props.titleLevel), 1), 6)
    : 2;
  
  // Cria o elemento de título dinamicamente com base no nível fornecido
  const renderTitle = () => {
    if (!sectionTitle) return null;
    
    const HeadingTag = `h${Math.min(Math.max(sectionTitleLevel, 1), 6)}` as keyof JSX.IntrinsicElements;
    const titleId = `${sectionId}-title`;
    
    return (
      <HeadingTag 
        id={titleId}
        className="text-2xl md:text-3xl font-bold mb-6 font-heading"
      >
        {typeof sectionTitle === 'string' ? sectionTitle : <>{sectionTitle}</>}
      </HeadingTag>
    );
  };
  
  return (
    <section 
      id={sectionId}
      style={style}
      className={`${sectionBaseClasses} ${sectionThemeClasses} ${className}`}
      {...restProps}
      aria-labelledby={sectionTitle ? `${sectionId}-title` : undefined}
    >
      {renderTitle()}
      <div className="text-base md:text-lg"> 
        {children}
      </div>
    </section>
  );
};