import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

export interface BrutalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const BrutalButton = forwardRef<HTMLButtonElement, BrutalButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'default',
      isLoading = false,
      disabled = false,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'relative inline-flex items-center justify-center font-bold font-oswald tracking-wide rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed';
    
    const sizeStyles = {
      sm: 'text-sm py-2 px-4',
      default: 'text-base py-3 px-6',
      lg: 'text-lg py-4 px-8',
      xl: 'text-xl py-5 px-10',
    };

    const variantStyles = {
      primary: 'bg-gradient-to-r from-brutal-red to-brutal-orange hover:from-brutal-orange hover:to-brutal-red text-white focus:ring-brutal-red/50 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
      secondary: 'bg-brutal-dark hover:bg-brutal-darker text-white border-2 border-brutal-yellow hover:border-brutal-orange focus:ring-brutal-yellow/50',
      outline: 'bg-transparent border-2 border-brutal-dark text-brutal-dark hover:bg-brutal-dark/5 focus:ring-brutal-dark/50',
      ghost: 'bg-transparent hover:bg-brutal-dark/5 text-brutal-dark focus:ring-brutal-dark/20',
      link: 'bg-transparent hover:underline text-brutal-red hover:text-brutal-orange p-0',
    };

    const iconSize = {
      sm: 'h-4 w-4',
      default: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-7 w-7',
    };

    const iconOnly = !children && icon ? 'p-0' : '';
    const iconOnlySize = {
      sm: 'w-8 h-8',
      default: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-14 h-14',
    };

    const iconClasses = cn(
      'flex-shrink-0',
      children && iconPosition === 'left' ? 'mr-2' : '',
      children && iconPosition === 'right' ? 'ml-2' : '',
      iconOnly ? 'm-0' : ''
    );

    const content = (
      <>
        {isLoading && (
          <Loader2 className={cn('animate-spin', iconSize[size], iconClasses)} />
        )}
        {!isLoading && icon && iconPosition === 'left' && (
          <span className={iconClasses}>{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && icon && iconPosition === 'right' && (
          <span className={iconClasses}>{icon}</span>
        )}
      </>
    );

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          fullWidth ? 'w-full' : '',
          iconOnly ? iconOnlySize[size] : '',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {content}
        {/* Efeito de brilho no hover */}
        <span 
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
          }}
          aria-hidden="true"
        />
      </button>
    );
  }
);

BrutalButton.displayName = 'BrutalButton';

export { BrutalButton };
