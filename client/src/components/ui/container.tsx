import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  size?: "default" | "small" | "large" | "full";
}

/**
 * Componente de contenedor que aplica anchos máximos consistentes
 * para mantener el contenido centrado y con márgenes adecuados
 */
export function Container({
  className,
  size = "default",
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-4 md:px-6",
        {
          "max-w-screen-sm": size === "small",
          "max-w-screen-xl": size === "default",
          "max-w-screen-2xl": size === "large",
          "w-full": size === "full",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Container;