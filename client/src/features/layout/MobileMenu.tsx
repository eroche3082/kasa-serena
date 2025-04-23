import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
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
    <div className="md:hidden bg-white px-4 py-2 shadow-md">
      <nav className="flex flex-col space-y-3 py-3">
        <Link href="/" onClick={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
          Inicio
        </Link>
        <Link href="/design-studio" onClick={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
          Diseñador
        </Link>
        <Link href="/#servicios" onClick={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
          Servicios
        </Link>
        <Link href="/#estimador" onClick={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
          Estimador
        </Link>
        <Link href="/#socios" onClick={handleLinkClick} className="text-neutral-700 hover:text-primary py-2 border-b border-neutral-200">
          Distribuidores
        </Link>
        <Link href="/#contacto" onClick={handleLinkClick} className="text-neutral-700 hover:text-primary py-2">
          Contacto
        </Link>
        <Link href="/design-studio" onClick={handleLinkClick}>
          <Button className="w-full bg-primary hover:bg-primary/90 text-white">
            Iniciar proyecto
          </Button>
        </Link>
      </nav>
    </div>
  );
};

export default MobileMenu;
