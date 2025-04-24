import React from 'react';
import { LazyImage } from '@/components/ui/lazy-image';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { updateMetaTags } from '@/lib/seo';
import { cn } from '@/lib/utils';

// Ejemplo de galería optimizada con los nuevos componentes
interface GalleryOptimizedProps {
  images: {
    src: string;
    alt: string;
    href?: string;
    lowQualitySrc?: string;
  }[];
  className?: string;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  aspectRatio?: '1:1' | '16:9' | '4:3' | '2:3';
}

// Componente de galería optimizado
export function GalleryOptimized({
  images,
  className,
  columns = 3,
  gap = 'md',
  rounded = true,
  aspectRatio = '4:3',
}: GalleryOptimizedProps) {
  // Actualizar metadatos SEO para la galería
  React.useEffect(() => {
    updateMetaTags({
      title: 'Galería de Proyectos',
      description: 'Explora nuestra galería de proyectos de diseño arquitectónico creados con Kasa Serena Designs',
      keywords: ['galería', 'proyectos', 'diseño', 'arquitectura', 'Puerto Rico', 'Kasa Serena']
    });
  }, []);

  // Mapeo de valores para las clases
  const gapMap = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const columnsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  const aspectRatioMap = {
    '1:1': 'aspect-square',
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '2:3': 'aspect-[2/3]',
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'grid w-full',
          columnsMap[columns],
          gapMap[gap]
        )}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              'group relative overflow-hidden',
              aspectRatioMap[aspectRatio],
              rounded && 'rounded-lg'
            )}
          >
            {image.href ? (
              <PrefetchLink href={image.href} className="block h-full w-full">
                <LazyImage
                  src={image.src}
                  lowQualitySrc={image.lowQualitySrc}
                  alt={image.alt}
                  className={cn(
                    'h-full w-full object-cover transition-transform duration-300 group-hover:scale-105',
                    rounded && 'rounded-lg'
                  )}
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 w-full p-4 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-sm font-medium">{image.alt}</p>
                </div>
              </PrefetchLink>
            ) : (
              <LazyImage
                src={image.src}
                lowQualitySrc={image.lowQualitySrc}
                alt={image.alt}
                className={cn(
                  'h-full w-full object-cover',
                  rounded && 'rounded-lg'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GalleryOptimized;