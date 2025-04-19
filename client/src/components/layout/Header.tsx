import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import MobileMenu from './MobileMenu';
import { FaUser, FaBars } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { FaHome } from 'react-icons/fa';

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
    <header className={`fixed w-full bg-white bg-opacity-95 shadow-sm z-50 transition-all duration-300 ${
      scrolled ? 'py-2 shadow-md' : 'py-3'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-primary">
            <FaHome className="text-2xl" />
          </div>
          <div>
            <h1 className="text-xl font-['Playfair_Display'] font-bold text-neutral-900 tracking-tight">
              Kasa Serena <span className="text-primary">Designs</span>
            </h1>
          </div>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className={`text-neutral-700 hover:text-primary transition-colors ${location === '/' ? 'text-primary' : ''}`}>
            Inicio
          </Link>
          <Link href="/design-studio" className={`text-neutral-700 hover:text-primary transition-colors ${location === '/design-studio' ? 'text-primary' : ''}`}>
            Diseñador
          </Link>
          <Link href="/#servicios" className="text-neutral-700 hover:text-primary transition-colors">
            Servicios
          </Link>
          <Link href="/#estimador" className="text-neutral-700 hover:text-primary transition-colors">
            Estimador
          </Link>
          <Link href="/#socios" className="text-neutral-700 hover:text-primary transition-colors">
            Distribuidores
          </Link>
          <Link href="/#contacto" className="text-neutral-700 hover:text-primary transition-colors">
            Contacto
          </Link>
        </nav>
        
        <div className="flex items-center space-x-3">
          <Link href="/design-studio" className="hidden md:inline-block">
            <Button variant="default" className="bg-primary hover:bg-primary/90 text-white">
              Iniciar proyecto
            </Button>
          </Link>
          
          <button 
            className="md:hidden text-neutral-700 hover:text-primary" 
            onClick={toggleMobileMenu}
          >
            <FaBars className="text-xl" />
          </button>
          
          {isAuthenticated ? (
            <Link href="/profile" className="px-3 py-2 rounded-full bg-neutral-200 text-neutral-700 hover:bg-neutral-300 transition-colors">
              {user?.username?.charAt(0).toUpperCase() || <FaUser />}
            </Link>
          ) : (
            <Link href="/login" className="px-3 py-2 rounded-full bg-neutral-200 text-neutral-700 hover:bg-neutral-300 transition-colors">
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
