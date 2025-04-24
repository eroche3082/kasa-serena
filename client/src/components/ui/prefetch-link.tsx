import React, { useCallback, MouseEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

interface PrefetchLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  prefetch?: boolean;
  matchExact?: boolean;
  onNavigate?: () => void;
}

export function PrefetchLink({
  href,
  children,
  className = '',
  activeClassName = 'text-primary font-medium',
  prefetch = true,
  matchExact = true,
  onNavigate,
  ...props
}: PrefetchLinkProps) {
  const [location] = useLocation();
  const isActive = matchExact 
    ? location === href 
    : location.startsWith(href) && (href !== '/' || location === '/');
  
  // Prefetch la página al hacer hover sobre el link
  const handleMouseEnter = useCallback(() => {
    if (prefetch) {
      // Para rutas que representan páginas dinámicas, cargar el módulo
      const pagePath = href.split('/')[1] || 'home';
      try {
        // Intentar precarga con dynamic import
        // No usamos await porque no queremos bloquear el evento
        import(`../../pages/${pagePath.charAt(0).toUpperCase() + pagePath.slice(1)}Page.tsx`)
          .catch(() => {
            // Silenciar errores, solo es una optimización
          });
      } catch (error) {
        // Ignorar errores en este contexto
      }
    }
  }, [href, prefetch]);
  
  // Manejar la navegación
  const handleClick = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    // No interferir con clics especiales (con modificadores como Ctrl, etc.)
    if (
      e.button !== 0 || 
      e.ctrlKey || 
      e.metaKey || 
      e.altKey || 
      e.shiftKey || 
      e.defaultPrevented
    ) {
      return;
    }
    
    // Si hay un callback personalizado, ejecutarlo
    if (onNavigate) {
      onNavigate();
    }
  }, [onNavigate]);
  
  return (
    <Link 
      href={href}
      {...props}
      className={cn(
        className,
        isActive && activeClassName
      )}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}

export default PrefetchLink;