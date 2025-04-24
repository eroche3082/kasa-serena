import { useState, useEffect } from 'react';

interface LazyImageOptions {
  lowQualitySrc?: string;
  highQualitySrc: string;
  alt: string;
  preloadHighQuality?: boolean;
}

export function useLazyImage({
  lowQualitySrc,
  highQualitySrc,
  alt,
  preloadHighQuality = false,
}: LazyImageOptions) {
  const [src, setSrc] = useState(lowQualitySrc || highQualitySrc);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Si no hay versión de baja calidad, o se solicita precarga de alta calidad
    // cargamos directamente la versión de alta calidad
    if (!lowQualitySrc || preloadHighQuality) {
      setSrc(highQualitySrc);
      return;
    }
    
    // Precargar la imagen de alta calidad
    const img = new Image();
    img.src = highQualitySrc;
    
    img.onload = () => {
      // Una vez cargada la imagen de alta calidad, la mostramos
      setSrc(highQualitySrc);
      setIsLoaded(true);
    };
    
    return () => {
      // Limpiar el evento onload si el componente se desmonta
      img.onload = null;
    };
  }, [lowQualitySrc, highQualitySrc, preloadHighQuality]);
  
  return {
    src,
    alt,
    isLoaded,
    imgProps: {
      src,
      alt,
      loading: 'lazy' as const, // Usar el lazy loading nativo del navegador
      onLoad: () => setIsLoaded(true),
    },
  };
}

export default useLazyImage;