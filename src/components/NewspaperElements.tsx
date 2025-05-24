import { ReactNode } from 'react';
import { QuoteIcon } from 'lucide-react';

export const PullQuote = ({ children, attribution, className = '' }: { children: ReactNode; attribution?: string; className?: string }) => (
  <blockquote 
    className={`my-6 md:my-8 ml-4 md:ml-0 mr-2 md:mr-6 float-right w-full sm:w-[45%] md:w-[38%] 
                 clear-right p-4 border-l-4 border-brutal-orange 
                 bg-brutal-oldpaper/80 text-foreground/90 font-serif relative shadow-md rounded-sm ${className}`}
    // This will break column flow for the text it displaces.
    // Alternatively, for multi-column layouts, avoid float or use specific column-span properties if the browser supports it well enough for your needs.
    // For now, float is a classic approach. Consider not using columns in articles with pull quotes or very complex layouts.
  >
    <QuoteIcon 
      className="absolute -top-3 -left-2.5 w-12 h-12 text-brutal-orange opacity-25 transform -translate-x-1/4 -translate-y-1/4"
      aria-hidden="true"
      strokeWidth={1}
    />
    <p className="mb-2 text-md lg:text-lg italic !leading-snug relative z-10 font-semibold">{children}</p> {/* prose might override font, use !leading-snug */}
    {attribution && <cite className="block text-xs text-right font-sans not-italic text-foreground/70 z-10 relative">— {attribution}</cite>}
  </blockquote>
);

export const FeatureBox = ({ 
  icon, 
  title, 
  description, 
  className = '' 
}: { 
  icon?: ReactNode; 
  title: string; 
  description: string; 
  className?: string; 
}) => (
  // Using bg-card (cleaner paper) to stand out on the bg-background (old paper) if section is transparent
  <div className={`p-6 border border-border/50 bg-card rounded-md shadow-lg flex flex-col text-center hover:shadow-xl transition-shadow duration-300 ${className}`}> 
    {icon && <div className="mb-4 flex justify-center items-center text-3xl md:text-4xl text-foreground/80 flex-shrink-0">{icon}</div>}
    <h3 className="text-lg md:text-xl font-oswald font-black mb-3 text-foreground uppercase tracking-wider">{title}</h3>
    <p className="text-sm text-foreground/85 font-sans leading-relaxed flex-grow">{description}</p>
  </div>
);

export const ThematicSeparator = ({ className = '' }: { className?: string }) => (
  <div className={`w-full my-12 md:my-20 flex items-center text-center ${className}`}> {/* Increased spacing */}
    <div className="flex-grow border-t-2 border-dotted border-foreground/25"></div>
    <span className="px-4 sm:px-6 text-2xl sm:text-3xl text-muted-foreground font-serif select-none opacity-70 tracking-widest transform rotate-[-2deg]"><i> finis </i></span> {/* Italicized and rotated for style */}
    <div className="flex-grow border-t-2 border-dotted border-foreground/25"></div>
  </div>
);