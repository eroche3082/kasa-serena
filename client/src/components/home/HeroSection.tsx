import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0; // Velocidad normal
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <section id="inicio" className="h-screen w-full relative overflow-hidden bg-neutral-900">
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
        {/* Contenido hero vacío - sin botones */}
      </div>
    </section>
  );
};

export default HeroSection;
