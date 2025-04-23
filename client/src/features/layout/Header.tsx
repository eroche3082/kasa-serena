import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import MobileMenu from './MobileMenu';
import { FaUser, FaBars, FaHome } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import logoImage from '@/assets/logo-new.png';

const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(prev => !prev);
  };

  return (
    <header className={`fixed w-full bg-transparent z-50 transition-all duration-300 ${
      scrolled ? 'py-2 backdrop-blur-sm' : 'py-3'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <img src={logoImage} alt="Kasa Serena Designs" className="h-16 md:h-24 max-w-[200px] md:max-w-[300px]" />
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className={`text-white font-medium hover:text-primary transition-colors ${location === '/' ? 'text-primary' : ''}`}>
            Inicio
          </Link>
          <Link href="/design-generator" className={`text-white font-medium hover:text-primary transition-colors ${location === '/design-generator' ? 'text-primary' : ''}`}>
            Diseños con IA
          </Link>
          <Link href="/smart-container" className={`text-white font-medium hover:text-primary transition-colors ${location === '/smart-container' ? 'text-primary' : ''}`}>
            Contenedores Inteligentes
          </Link>
          <Link href="/modular-pool" className={`text-white font-medium hover:text-primary transition-colors ${location === '/modular-pool' ? 'text-primary' : ''}`}>
            Piscinas Modulares
          </Link>
          {isAuthenticated && (
            <Link href="/dashboard" className={`text-white font-medium hover:text-primary transition-colors ${location === '/dashboard' ? 'text-primary' : ''}`}>
              Panel
            </Link>
          )}
          <Link href="/#contacto" className="text-white font-medium hover:text-primary transition-colors">
            Contacto
          </Link>
        </nav>
        
        <div className="flex items-center space-x-3">
          <Link href="/design-generator" className="hidden md:inline-block">
            <Button variant="default" className="bg-primary hover:bg-primary/90 text-white border border-primary">
              Iniciar proyecto
            </Button>
          </Link>
          
          <button 
            className="md:hidden text-white hover:text-primary" 
            onClick={toggleMobileMenu}
          >
            <FaBars className="text-xl" />
          </button>
          
          {isAuthenticated ? (
            <Link href="/profile" className="px-3 py-2 rounded-full bg-primary/20 backdrop-blur-sm text-white hover:bg-primary/30 transition-colors border border-primary/40">
              {user?.username?.charAt(0).toUpperCase() || <FaUser />}
            </Link>
          ) : (
            <Link href="/login" className="px-3 py-2 rounded-full bg-primary/20 backdrop-blur-sm text-white hover:bg-primary/30 transition-colors border border-primary/40">
              <FaUser />
            </Link>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
    </header>
  );
};

export default Header;
