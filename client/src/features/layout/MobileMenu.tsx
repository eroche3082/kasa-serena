import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PrefetchLink } from '@/components/ui/prefetch-link';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { isAuthenticated } = useAuth();

  // Close menu when clicking anchor links
  const handleLinkClick = () => {
    onClose();
  };
  
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed top-[60px] left-0 right-0 z-50 bg-white px-4 py-2 shadow-md max-h-[calc(100vh-60px)] overflow-y-auto">
      <nav className="flex flex-col space-y-3 py-3">
        <PrefetchLink href="/" onNavigate={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
          Inicio
        </PrefetchLink>
        <PrefetchLink href="/design-generator" onNavigate={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
          Diseños con IA
        </PrefetchLink>
        <PrefetchLink href="/smart-container" onNavigate={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
          Contenedores Inteligentes
        </PrefetchLink>
        <PrefetchLink href="/modular-pool" onNavigate={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
          Piscinas Modulares
        </PrefetchLink>
        <PrefetchLink href="/galeria" onNavigate={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
          Galería
        </PrefetchLink>
        <PrefetchLink href="/inspiracion" onNavigate={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
          Inspiración IA
        </PrefetchLink>
        
        {isAuthenticated ? (
          <>
            <PrefetchLink href="/dashboard" onNavigate={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
              Panel
            </PrefetchLink>
            <PrefetchLink href="/cotizaciones" onNavigate={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
              Mis Cotizaciones
            </PrefetchLink>
            <PrefetchLink href="/profile" onNavigate={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
              Mi Perfil
            </PrefetchLink>
          </>
        ) : (
          <PrefetchLink href="/login" onNavigate={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
            Iniciar Sesión
          </PrefetchLink>
        )}
        
        <Link href="/#contacto" onClick={handleLinkClick} className="text-neutral-700 hover:text-primary py-2">
          Contacto
        </Link>
        <PrefetchLink href="/design-generator" onNavigate={handleLinkClick}>
          <Button className="w-full bg-primary hover:bg-primary/90 text-white">
            Iniciar proyecto
          </Button>
        </PrefetchLink>
      </nav>
    </div>
  );
};

export default MobileMenu;
