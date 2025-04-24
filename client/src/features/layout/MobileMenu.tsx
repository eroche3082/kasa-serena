import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

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
        <Link href="/" onClick={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
          Inicio
        </Link>
        <Link href="/design-generator" onClick={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
          Diseños con IA
        </Link>
        <Link href="/smart-container" onClick={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
          Contenedores Inteligentes
        </Link>
        <Link href="/modular-pool" onClick={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
          Piscinas Modulares
        </Link>
        <Link href="/galeria" onClick={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
          Galería
        </Link>
        
        {isAuthenticated ? (
          <>
            <Link href="/dashboard" onClick={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
              Panel
            </Link>
            <Link href="/cotizaciones" onClick={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
              Mis Cotizaciones
            </Link>
            <Link href="/profile" onClick={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
              Mi Perfil
            </Link>
          </>
        ) : (
          <Link href="/login" onClick={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
            Iniciar Sesión
          </Link>
        )}
        
        <Link href="/#contacto" onClick={handleLinkClick} className="text-neutral-700 hover:text-primary py-2">
          Contacto
        </Link>
        <Link href="/design-generator" onClick={handleLinkClick}>
          <Button className="w-full bg-primary hover:bg-primary/90 text-white">
            Iniciar proyecto
          </Button>
        </Link>
      </nav>
    </div>
  );
};

export default MobileMenu;
