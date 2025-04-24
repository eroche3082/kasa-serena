/**
 * Utilidad para gestionar metadatos SEO de forma dinámica
 */

export interface MetaTagsOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogUrl?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
}

const BASE_TITLE = 'Kasa Serena Designs';
const BASE_DESCRIPTION = 'Soluciones de diseño arquitectónico personalizadas en Puerto Rico con tecnología de IA';
const BASE_KEYWORDS = ['diseño', 'arquitectura', 'Puerto Rico', 'IA', 'Kasa Serena'];
const BASE_IMAGE = '/og-image.jpg';

/**
 * Actualiza las meta tags del documento con los valores proporcionados
 */
export function updateMetaTags(options: MetaTagsOptions = {}): void {
  const {
    title,
    description = BASE_DESCRIPTION,
    keywords = BASE_KEYWORDS,
    ogImage = BASE_IMAGE,
    ogUrl,
    ogType = 'website',
    twitterCard = 'summary_large_image',
  } = options;

  // Establecer el título
  const fullTitle = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
  document.title = fullTitle;

  // Función para actualizar o crear meta tags
  const setMetaTag = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  const setPropertyTag = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  // Actualizar meta tags básicos
  setMetaTag('description', description);
  setMetaTag('keywords', keywords.join(', '));

  // Actualizar Open Graph tags
  setPropertyTag('og:title', fullTitle);
  setPropertyTag('og:description', description);
  setPropertyTag('og:image', ogImage);
  setPropertyTag('og:type', ogType);
  
  if (ogUrl) {
    setPropertyTag('og:url', ogUrl);
  }

  // Actualizar Twitter Card tags
  setMetaTag('twitter:card', twitterCard);
  setMetaTag('twitter:title', fullTitle);
  setMetaTag('twitter:description', description);
  setMetaTag('twitter:image', ogImage);
}

/**
 * Hook para utilizar en páginas específicas
 */
export function usePageMeta(options: MetaTagsOptions = {}) {
  return () => updateMetaTags(options);
}

export default {
  updateMetaTags,
  usePageMeta
};