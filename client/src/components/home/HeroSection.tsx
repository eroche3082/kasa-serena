import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8; // Más lento para mejor efecto
    }
  }, []);

  return (
    <section id="inicio" className="pt-24 md:pt-32 pb-16 md:pb-24 relative overflow-hidden bg-neutral-900">
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 z-10"></div>
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>
      </div>
      
      <div className="container mx-auto px-4 relative z-20 text-white">
        <div className="max-w-3xl mt-16 md:mt-24">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-wide mb-8 leading-tight">
            EN KASA SERENA, DISEÑAMOS Y CONSTRUIMOS COCINAS, PUERTAS, Y VENTANAS PERSONALIZADAS
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-neutral-100 opacity-90 font-light tracking-wide">
            TENEMOS MÁS DE 20 AÑOS DE EXPERIENCIA. CREAMOS ESPACIOS ÚNICOS QUE COMBINAN ELEGANCIA, FUNCIONALIDAD Y DURABILIDAD.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 mt-10">
            <Link href="/design-studio">
              <Button className="w-full sm:w-auto px-8 py-6 bg-primary hover:bg-primary/90 text-white text-lg tracking-wide">
                INICIAR PROYECTO
              </Button>
            </Link>
            <Link href="/#servicios">
              <Button variant="outline" className="w-full sm:w-auto px-8 py-6 bg-transparent border border-white hover:bg-white/10 text-white text-lg tracking-wide">
                VER SERVICIOS
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
