import React from 'react';
import { Container } from '@/components/ui/container';
import { GalleryOptimized } from '@/components/ui/gallery-optimized';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Ejemplo de imágenes para la galería (normalmente vendrían de una API)
const galeriaImages = [
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/kasaserena-designs.appspot.com/o/gallery%2Fwooden-door-1.jpg?alt=media',
    lowQualitySrc: 'https://firebasestorage.googleapis.com/v0/b/kasaserena-designs.appspot.com/o/gallery%2Fwooden-door-1-low.jpg?alt=media',
    alt: 'Puerta de madera personalizada',
    href: '/smart-container'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/kasaserena-designs.appspot.com/o/gallery%2Fmarble-kitchen.jpg?alt=media',
    lowQualitySrc: 'https://firebasestorage.googleapis.com/v0/b/kasaserena-designs.appspot.com/o/gallery%2Fmarble-kitchen-low.jpg?alt=media',
    alt: 'Cocina de mármol elegante',
    href: '/design-generator'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/kasaserena-designs.appspot.com/o/gallery%2Fpool-design.jpg?alt=media',
    lowQualitySrc: 'https://firebasestorage.googleapis.com/v0/b/kasaserena-designs.appspot.com/o/gallery%2Fpool-design-low.jpg?alt=media',
    alt: 'Diseño de piscina modular',
    href: '/modular-pool'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/kasaserena-designs.appspot.com/o/gallery%2Fcustom-window.jpg?alt=media',
    lowQualitySrc: 'https://firebasestorage.googleapis.com/v0/b/kasaserena-designs.appspot.com/o/gallery%2Fcustom-window-low.jpg?alt=media',
    alt: 'Ventana personalizada con acabados de lujo',
    href: '/ai-design'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/kasaserena-designs.appspot.com/o/gallery%2Fsmart-container.jpg?alt=media',
    lowQualitySrc: 'https://firebasestorage.googleapis.com/v0/b/kasaserena-designs.appspot.com/o/gallery%2Fsmart-container-low.jpg?alt=media',
    alt: 'Contenedor inteligente para vivienda',
    href: '/smart-container'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/kasaserena-designs.appspot.com/o/gallery%2Fluxury-cabinet.jpg?alt=media',
    lowQualitySrc: 'https://firebasestorage.googleapis.com/v0/b/kasaserena-designs.appspot.com/o/gallery%2Fluxury-cabinet-low.jpg?alt=media',
    alt: 'Gabinete de lujo para cocina',
    href: '/design-generator'
  }
];

// Componente de página para mostrar la galería optimizada
export function GaleriaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Container className="py-10 md:py-16">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-didonesque text-primary">Galería de Proyectos</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore nuestra colección de proyectos arquitectónicos personalizados, 
              diseñados con precisión y atención al detalle para nuestros clientes.
            </p>
          </div>
          
          <Card className="border-0 shadow-sm bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-didonesque">Proyectos Destacados</CardTitle>
              <CardDescription>
                Estos son algunos de nuestros proyectos más recientes y destacados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GalleryOptimized 
                images={galeriaImages} 
                columns={3} 
                gap="md" 
                rounded={true} 
                aspectRatio="4:3"
              />
            </CardContent>
            <CardFooter className="flex justify-center pt-4">
              <Button variant="secondary" size="lg">
                Ver más proyectos
              </Button>
            </CardFooter>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <Card className="border border-primary/10">
              <CardHeader>
                <CardTitle>Solicita una cotización</CardTitle>
                <CardDescription>
                  ¿Te inspiró alguno de nuestros diseños? Solicita una cotización personalizada.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="default" asChild>
                  <a href="/solicitar-cotizacion">Cotizar ahora</a>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border border-primary/10">
              <CardHeader>
                <CardTitle>Diseño a medida</CardTitle>
                <CardDescription>
                  Utiliza nuestro generador de diseños para visualizar tu próximo proyecto.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" asChild>
                  <a href="/design-generator">Crear diseño</a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default GaleriaPage;