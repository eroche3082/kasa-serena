import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8; // Más lento para mejor efecto
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <section id="inicio" className="pt-24 md:pt-36 pb-24 md:pb-36 relative overflow-hidden bg-neutral-900">
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 z-10"></div>
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <video 
          ref={videoRef}
          autoPlay 
          muted={isMuted} 
          loop 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>
      </div>
      
      <button 
        onClick={toggleMute} 
        className="absolute bottom-6 right-6 z-20 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all"
        aria-label={isMuted ? "Activar sonido" : "Silenciar"}
      >
        {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
      </button>
      
      <div className="container mx-auto px-4 relative z-20 text-white h-full flex items-center justify-center">
        <div className="text-center mt-8">
          <div className="flex flex-col md:flex-row gap-6 justify-center mt-6">
            <Link href="/login">
              <Button className="w-full md:w-auto px-8 py-6 bg-primary hover:bg-primary/90 text-white text-lg tracking-wide">
                INICIAR PROYECTO
              </Button>
            </Link>
            <Link href="/servicios">
              <Button variant="outline" className="w-full md:w-auto px-8 py-6 bg-transparent border border-white hover:bg-white/10 text-white text-lg tracking-wide">
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
