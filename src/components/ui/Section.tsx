import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  variant?: 'default' | 'dark' | 'gradient' | 'pattern';
  containerClass?: string;
  fullWidth?: boolean;
  padded?: boolean;
}

const Section = ({
  id,
  className,
  children,
  variant = 'default',
  containerClass,
  fullWidth = false,
  padded = true,
  ...props
}: SectionProps) => {
  const baseStyles = 'relative w-full';
  
  const variantStyles = {
    default: 'bg-brutal-oldpaper',
    dark: 'bg-brutal-darker text-white',
    gradient: 'bg-gradient-to-br from-brutal-dark to-brutal-darker text-white',
    pattern: 'relative overflow-hidden bg-brutal-oldpaper',
  };

  const paddingStyles = padded ? 'py-16 md:py-24 lg:py-32' : '';

  return (
    <section
      id={id}
      className={cn(
        baseStyles,
        variantStyles[variant],
        paddingStyles,
        className
      )}
      {...props}
    >
      {variant === 'pattern' && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
      )}
      
      <div className={cn(
        'relative',
        !fullWidth && 'container mx-auto px-4 sm:px-6 lg:px-8',
        containerClass
      )}>
        {children}
      </div>
    </section>
  );
};

export default Section;
