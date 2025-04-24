import { useEffect } from 'react';
import { updateMetaTags, MetaTagsOptions } from '@/lib/seo';

interface SEOProps extends MetaTagsOptions {
  children?: React.ReactNode;
}

/**
 * Componente SEO para establecer metadatos en las páginas
 * 
 * Ejemplo de uso:
 * ```tsx
 * <SEO 
 *   title="Diseño de Contenedores" 
 *   description="Diseños inteligentes para contenedores de varios tamaños"
 *   keywords={['contenedores', 'diseño modular', 'smart containers']}
 * />
 * ```
 */
export function SEO({ children, ...metaProps }: SEOProps) {
  useEffect(() => {
    // Actualizar los meta tags cuando el componente se monta o cuando cambian las props
    updateMetaTags(metaProps);

    // Limpiar al desmontar (opcional, pero buena práctica)
    return () => {
      // Si es necesario, puedes resetear a valores por defecto
    };
  }, [
    metaProps.title,
    metaProps.description,
    metaProps.keywords?.join(','),
    metaProps.ogImage,
    metaProps.ogUrl,
    metaProps.ogType,
    metaProps.twitterCard
  ]);

  // El componente no renderiza nada visible
  return <>{children}</>;
}

export default SEO;