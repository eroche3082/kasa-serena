import { useState, useEffect, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  lowQualitySrc?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const LazyImage = ({
  src,
  lowQualitySrc,
  alt,
  className,
  width,
  height,
  ...props
}: LazyImageProps) => {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src);
  const [isLoaded, setIsLoaded] = useState(!lowQualitySrc);
  
  useEffect(() => {
    if (!lowQualitySrc) return;
    
    const highResImage = new Image();
    highResImage.src = src;
    
    highResImage.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
    
    return () => {
      highResImage.onload = null;
    };
  }, [lowQualitySrc, src]);
  
  return (
    <div className={cn('relative overflow-hidden', className)} style={{ width, height }}>
      <img
        src={currentSrc}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-500',
          isLoaded ? 'opacity-100' : 'opacity-80'
        )}
        loading="lazy"
        {...props}
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
      )}
    </div>
  );
};

export default LazyImage;