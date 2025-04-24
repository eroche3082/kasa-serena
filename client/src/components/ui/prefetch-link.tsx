import { Link } from 'wouter';
import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface PrefetchLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onPrefetch?: () => Promise<any>;
  prefetchOnHover?: boolean;
}

/**
 * Un componente de enlace mejorado que permite prefetch de recursos al hacer hover
 * Utiliza un mecanismo simple de prefetching para mejorar la experiencia de usuario
 */
export const PrefetchLink = ({
  href,
  children,
  className,
  onPrefetch,
  prefetchOnHover = true,
}: PrefetchLinkProps) => {
  const [isPrefetched, setIsPrefetched] = useState(false);
  
  // Función de prefetch
  const prefetch = async () => {
    if (isPrefetched || !prefetchOnHover) return;
    
    try {
      // Si hay una función personalizada de prefetch, la ejecutamos
      if (onPrefetch) {
        await onPrefetch();
      }
      
      // Marcar como prefetched para no repetir
      setIsPrefetched(true);
    } catch (error) {
      console.error('Error durante el prefetch:', error);
    }
  };
  
  return (
    <Link 
      href={href}
      onMouseEnter={prefetch}
      onFocus={prefetch}
      className={cn(className)}
    >
      {children}
    </Link>
  );
};

export default PrefetchLink;