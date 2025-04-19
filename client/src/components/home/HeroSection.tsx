import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0; // Velocidad normal
      videoRef.current.muted = isMuted;
      
      // Precarga del video
      videoRef.current.preload = "auto";
      
      // Eventos para controlar la carga y reproducción
      const handleLoadStart = () => setIsLoading(true);
      const handleCanPlay = () => {
        setIsLoading(false);
        // Intentar reproducir el video solo cuando esté listo
        videoRef.current?.play().catch(error => {
          console.error("Error al reproducir el video:", error);
        });
      };
      const handlePlaying = () => setIsPlaying(true);
      const handleWaiting = () => setIsLoading(true);
      
      const video = videoRef.current;
      
      video.addEventListener('loadstart', handleLoadStart);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('playing', handlePlaying);
      video.addEventListener('waiting', handleWaiting);
      
      return () => {
        // Limpiar los event listeners
        video.removeEventListener('loadstart', handleLoadStart);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('waiting', handleWaiting);
      };
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <section id="inicio" className="h-screen w-full relative overflow-hidden bg-neutral-900">
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 z-10"></div>
      
      {/* Indicador de carga */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black bg-opacity-75">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <video 
          ref={videoRef}
          autoPlay 
          muted={isMuted} 
          loop 
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
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
