import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  lowQualitySrc?: string;
  placeholderColor?: string;
  transitionDuration?: number;
  fallbackSrc?: string;
  blur?: boolean;
}

export function LazyImage({
  src,
  lowQualitySrc,
  alt,
  className,
  placeholderColor = '#f3f4f6',
  transitionDuration = 500,
  fallbackSrc,
  blur = true,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (imgRef.current) {
              observer.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        rootMargin: '200px 0px', // Comenzar a cargar cuando esté a 200px de distancia
        threshold: 0.01
      }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);
  
  const handleLoad = () => {
    setIsLoaded(true);
  };
  
  const handleError = () => {
    if (fallbackSrc && !useFallback) {
      setUseFallback(true);
    }
  };
  
  const currentSrc = useFallback 
    ? fallbackSrc 
    : (!isInView ? (lowQualitySrc || '') : src);
  
  const imageTransitionStyle = {
    transition: `opacity ${transitionDuration}ms ease, filter ${transitionDuration}ms ease`,
    opacity: (!isInView || (!isLoaded && isInView)) ? 0.5 : 1,
    filter: (!isLoaded && isInView && blur) ? 'blur(8px)' : 'blur(0)',
    backgroundColor: placeholderColor,
  };
  
  // Precargar la imagen de alta calidad cuando esté en el viewport
  useEffect(() => {
    if (isInView && src) {
      const highResImage = new Image();
      highResImage.src = src;
      highResImage.onload = handleLoad;
      highResImage.onerror = handleError;
    }
  }, [isInView, src]);
  
  return (
    <img
      ref={imgRef}
      src={isInView ? currentSrc : (lowQualitySrc || '')}
      alt={alt}
      style={imageTransitionStyle}
      className={cn('w-full h-auto', className)}
      loading="lazy"
      onLoad={isInView ? handleLoad : undefined}
      onError={handleError}
      {...props}
    />
  );
}

export default LazyImage;