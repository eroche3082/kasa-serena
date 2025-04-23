// Re-exportamos los componentes principales de la feature
export { default as Header } from './Header';
export { default as Footer } from './Footer';
export { default as MobileMenu } from './MobileMenu';

// Constantes relacionadas con la navegación
export const NAVIGATION_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/herramientas", label: "Herramientas de Diseño" },
  { href: "/materiales", label: "Materiales" },
  { href: "/distribuidores", label: "Distribuidores" },
  { href: "/contacto", label: "Contacto" }
];

// Tipos relacionados con el layout
export interface NavigationItem {
  href: string;
  label: string;
  children?: NavigationItem[];
}