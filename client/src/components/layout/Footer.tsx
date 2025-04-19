import { Link } from 'wouter';
import { FaHome, FaFacebookF, FaInstagram, FaPinterest, FaPaperPlane } from 'react-icons/fa';
import { SiHouzz } from 'react-icons/si';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Por favor, ingresa tu correo electrónico",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call an API endpoint
    toast({
      title: "¡Suscripción exitosa!",
      description: "Gracias por suscribirte a nuestro boletín",
    });
    
    setEmail('');
  };

  return (
    <footer className="bg-neutral-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="text-primary">
                <FaHome className="text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-['Playfair_Display'] font-bold tracking-tight">
                  Kasa Serena <span className="text-primary">Designs</span>
                </h3>
              </div>
            </Link>
            <p className="text-neutral-400 mb-6">
              Tu espacio, rediseñado con inteligencia. Soluciones personalizadas de diseño y construcción en Puerto Rico.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-500 hover:text-primary transition-colors">
                <FaFacebookF />
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary transition-colors">
                <FaPinterest />
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary transition-colors">
                <SiHouzz />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Servicios</h4>
            <ul className="space-y-2">
              <li><Link href="/design-studio?type=cocina" className="text-neutral-400 hover:text-primary transition-colors">Diseño de cocinas</Link></li>
              <li><Link href="/design-studio?type=puerta" className="text-neutral-400 hover:text-primary transition-colors">Puertas personalizadas</Link></li>
              <li><Link href="/design-studio?type=ventana" className="text-neutral-400 hover:text-primary transition-colors">Ventanas a medida</Link></li>
              <li><Link href="/design-studio?type=gabinete" className="text-neutral-400 hover:text-primary transition-colors">Gabinetes</Link></li>
              <li><Link href="/#contacto" className="text-neutral-400 hover:text-primary transition-colors">Consultoría de diseño</Link></li>
              <li><Link href="/#contacto" className="text-neutral-400 hover:text-primary transition-colors">Instalación profesional</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-neutral-400 hover:text-primary transition-colors">Sobre nosotros</Link></li>
              <li><Link href="/design-studio" className="text-neutral-400 hover:text-primary transition-colors">Proyectos</Link></li>
              <li><Link href="/#socios" className="text-neutral-400 hover:text-primary transition-colors">Distribuidores</Link></li>
              <li><Link href="/login" className="text-neutral-400 hover:text-primary transition-colors">Cuenta profesional</Link></li>
              <li><Link href="/" className="text-neutral-400 hover:text-primary transition-colors">Preguntas frecuentes</Link></li>
              <li><Link href="/#contacto" className="text-neutral-400 hover:text-primary transition-colors">Contacto</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Boletín informativo</h4>
            <p className="text-neutral-400 mb-4">
              Suscríbete para recibir noticias, tendencias de diseño y ofertas exclusivas.
            </p>
            <form className="mb-4" onSubmit={handleSubscribe}>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="rounded-r-none bg-neutral-800 text-white border-neutral-700 focus-visible:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button 
                  type="submit" 
                  className="px-4 py-2 bg-primary text-white rounded-l-none hover:bg-opacity-90"
                >
                  <FaPaperPlane />
                </Button>
              </div>
            </form>
            <p className="text-xs text-neutral-500">Al suscribirte, aceptas nuestra política de privacidad.</p>
          </div>
        </div>
        
        <div className="pt-8 border-t border-neutral-800 text-sm text-neutral-500 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Kasa Serena Designs. Todos los derechos reservados.
          </div>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-primary transition-colors">Política de privacidad</Link>
            <Link href="#" className="hover:text-primary transition-colors">Términos y condiciones</Link>
            <Link href="#" className="hover:text-primary transition-colors">Política de cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
