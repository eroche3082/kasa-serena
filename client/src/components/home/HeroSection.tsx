import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section id="inicio" className="pt-28 md:pt-40 pb-16 md:pb-24 relative overflow-hidden bg-neutral-900">
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 z-10"></div>
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <img 
          src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Cocina moderna diseñada por Kasa Serena" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-20 text-white">
        <div className="max-w-2xl">
          <h1 className="font-['Playfair_Display'] text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Tu espacio, rediseñado con inteligencia
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-neutral-100 opacity-90">
            Diseño y construcción personalizada de cocinas, puertas, ventanas y gabinetes en Puerto Rico.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/design-studio">
              <Button className="w-full sm:w-auto px-8 py-6 bg-primary hover:bg-primary/90 text-white text-lg">
                Comienza tu diseño
              </Button>
            </Link>
            <Link href="/#servicios">
              <Button variant="outline" className="w-full sm:w-auto px-8 py-6 bg-transparent border border-white hover:bg-white/10 text-white text-lg">
                Ver servicios
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
