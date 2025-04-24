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

  // Determinar si está en la página de inicio para usar estilos específicos
  const isHomePage = location === '/';

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'py-2 backdrop-blur-md bg-white/90 shadow-sm' 
        : isHomePage 
          ? 'py-3 bg-transparent' 
          : 'py-3 bg-white/95 shadow-sm'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <img src={logoImage} alt="Kasa Serena Designs" className="h-16 md:h-20 max-w-[180px] md:max-w-[250px]" />
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link 
            href="/" 
            className={`font-medium hover:text-primary transition-colors ${
              location === '/' 
                ? 'text-primary' 
                : isHomePage || scrolled ? 'text-neutral-800' : 'text-neutral-800'
            }`}
          >
            Inicio
          </Link>
          <Link 
            href="/design-generator" 
            className={`font-medium hover:text-primary transition-colors ${
              location === '/design-generator' 
                ? 'text-primary' 
                : isHomePage || scrolled ? 'text-neutral-800' : 'text-neutral-800'
            }`}
          >
            Diseños con IA
          </Link>
          <Link 
            href="/smart-container" 
            className={`font-medium hover:text-primary transition-colors ${
              location === '/smart-container' 
                ? 'text-primary' 
                : isHomePage || scrolled ? 'text-neutral-800' : 'text-neutral-800'
            }`}
          >
            Contenedores Inteligentes
          </Link>
          <Link 
            href="/modular-pool" 
            className={`font-medium hover:text-primary transition-colors ${
              location === '/modular-pool' 
                ? 'text-primary' 
                : isHomePage || scrolled ? 'text-neutral-800' : 'text-neutral-800'
            }`}
          >
            Piscinas Modulares
          </Link>
          {isAuthenticated && (
            <>
              <Link 
                href="/dashboard" 
                className={`font-medium hover:text-primary transition-colors ${
                  location === '/dashboard' 
                    ? 'text-primary' 
                    : isHomePage || scrolled ? 'text-neutral-800' : 'text-neutral-800'
                }`}
              >
                Panel
              </Link>
              <Link 
                href="/cotizaciones" 
                className={`font-medium hover:text-primary transition-colors ${
                  location === '/cotizaciones' 
                    ? 'text-primary' 
                    : isHomePage || scrolled ? 'text-neutral-800' : 'text-neutral-800'
                }`}
              >
                Mis Cotizaciones
              </Link>
            </>
          )}
          <Link 
            href="/#contacto" 
            className={`font-medium hover:text-primary transition-colors ${
              isHomePage || scrolled ? 'text-neutral-800' : 'text-neutral-800'
            }`}
          >
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
            className={`md:hidden hover:text-primary ${
              isHomePage && !scrolled ? 'text-white' : 'text-neutral-800'
            }`} 
            onClick={toggleMobileMenu}
          >
            <FaBars className="text-xl" />
          </button>
          
          {isAuthenticated ? (
            <Link 
              href="/profile" 
              className={`px-3 py-2 rounded-full transition-colors border ${
                isHomePage && !scrolled 
                  ? 'bg-primary/20 backdrop-blur-sm text-white hover:bg-primary/30 border-primary/40' 
                  : 'bg-primary/10 text-neutral-800 hover:bg-primary/20 border-primary/30'
              }`}
            >
              {user?.username?.charAt(0).toUpperCase() || <FaUser />}
            </Link>
          ) : (
            <Link 
              href="/login" 
              className={`px-3 py-2 rounded-full transition-colors border ${
                isHomePage && !scrolled 
                  ? 'bg-primary/20 backdrop-blur-sm text-white hover:bg-primary/30 border-primary/40' 
                  : 'bg-primary/10 text-neutral-800 hover:bg-primary/20 border-primary/30'
              }`}
            >
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
