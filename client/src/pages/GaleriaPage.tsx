import React from 'react';
import { Container } from '@/components/ui/container';
import { LazyImage } from '@/components/ui/lazy-image';
import { HeicImageUploader } from '@/components/ui/heic-image-uploader';
import { SEO } from '@/components/ui/seo';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

import { Upload, Image as ImageIcon } from 'lucide-react';

// Lista de imágenes para la galería
const galleryImages = [
  {
    src: '/src/features/home/assets/kitchen-marble-1.jpg',
    alt: 'Cocina con mármol y detalles dorados',
    title: 'Cocina Elegante',
    description: 'Diseño de cocina con mármol y detalles dorados para un ambiente sofisticado'
  },
  {
    src: '/src/features/home/assets/wooden-door-detail-2.jpg',
    alt: 'Puerta de madera tallada a mano',
    title: 'Puerta Artesanal',
    description: 'Puerta de madera con detalles tallados a mano por nuestros expertos artesanos'
  },
  {
    src: '/src/features/home/assets/family-kitchen-1.jpg',
    alt: 'Familia en cocina moderna',
    title: 'Espacio Familiar',
    description: 'Creamos espacios donde la familia puede disfrutar momentos especiales'
  },
  {
    src: '/src/features/home/assets/kitchen-cabinets-1.jpg',
    alt: 'Gabinetes de cocina elegantes',
    title: 'Gabinetes Premium',
    description: 'Gabinetes de cocina de alta calidad con acabados personalizados'
  },
  {
    src: '/src/assets/images/wooden-door-1.jpg',
    alt: 'Puerta de madera con herrajes',
    title: 'Carpintería Fina',
    description: 'Puerta de madera con herrajes de alta calidad'
  },
  {
    src: '/src/assets/images/wooden-window-1.jpg',
    alt: 'Ventana de madera con detalles arquitectónicos',
    title: 'Ventana Arquitectónica',
    description: 'Ventana de madera con detalles arquitectónicos que realzan cualquier espacio'
  },
  {
    src: '/src/assets/images/kitchen-wooden-3.jpg',
    alt: 'Cocina con acabados en madera',
    title: 'Cocina Cálida',
    description: 'Cocina con acabados en madera natural para un ambiente cálido y acogedor'
  },
  {
    src: '/src/features/home/assets/craftsman-3.jpg',
    alt: 'Artesano trabajando en madera',
    title: 'Maestro Artesano',
    description: 'Nuestros maestros artesanos trabajan con pasión en cada detalle'
  }
];

// Función para generar versiones de baja calidad simuladas
const getLowQualitySrc = (src: string) => {
  const parts = src.split('.');
  const ext = parts.pop();
  return `${parts.join('.')}-low.${ext}`;
};

const GaleriaPage: React.FC = () => {
  const { toast } = useToast();
  
  const handleImageUpload = (imageData: any) => {
    // Aquí manejaríamos la imagen optimizada en una aplicación real
    toast({
      title: 'Imagen subida con éxito',
      description: `La imagen ha sido optimizada y guardada: ${imageData.optimized || imageData.original}`,
    });
  };
  
  return (
    <div className="py-8">
      <SEO 
        title="Galería de Diseños"
        description="Explora nuestra galería de diseños arquitectónicos personalizados y optimizados para Puerto Rico."
        keywords={['galería', 'diseños', 'arquitectura', 'imágenes optimizadas', 'Puerto Rico']}
      />
      <Container>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold mb-4">Galería de Diseños</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explora nuestra galería de diseños personalizados y descubre cómo utilizamos 
            la tecnología para optimizar las imágenes y mejorar la experiencia de usuario.
          </p>
        </div>
        
        <Tabs defaultValue="galeria" className="mb-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="galeria">Galería</TabsTrigger>
            <TabsTrigger value="subir">Subir Imágenes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="galeria" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <Card key={index} className="overflow-hidden h-full flex flex-col">
                  <div className="relative aspect-video">
                    <LazyImage 
                      src={image.src}
                      lowQualitySrc={getLowQualitySrc(image.src)}
                      alt={image.alt}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{image.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4 flex-grow">
                    <CardDescription>
                      {image.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 px-6 py-4 bg-muted rounded-md">
              <h3 className="text-lg font-medium mb-2">Optimización de Imágenes</h3>
              <p className="text-sm text-muted-foreground">
                Todas las imágenes en esta galería utilizan carga progresiva y lazy loading para 
                optimizar la velocidad de carga. Notarás que las imágenes aparecen primero en baja 
                resolución y luego se cargan en alta calidad a medida que haces scroll.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="subir" className="mt-6">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Subir Nueva Imagen</CardTitle>
                  <CardDescription>
                    Sube imágenes en cualquier formato, incluido HEIC (usado por iPhones y iPads).
                    Las imágenes serán convertidas automáticamente a formatos web optimizados.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HeicImageUploader 
                    onImageUpload={handleImageUpload}
                    buttonText="Seleccionar Imagen"
                  />
                </CardContent>
                <CardFooter className="flex flex-col items-start text-sm text-muted-foreground">
                  <p className="mb-2">Formatos soportados: JPEG, PNG, HEIC/HEIF</p>
                  <p>Tamaño máximo: 10MB</p>
                </CardFooter>
              </Card>
              
              <div className="mt-8 px-6 py-4 bg-muted rounded-md">
                <h3 className="text-lg font-medium mb-2">Tecnología de Conversión</h3>
                <p className="text-sm text-muted-foreground">
                  Nuestro sistema convierte automáticamente los archivos HEIC (formato usado por 
                  dispositivos Apple) a formatos web optimizados y genera versiones de baja calidad
                  para carga progresiva, mejorando la experiencia de usuario y el rendimiento del sitio.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
};

export default GaleriaPage;