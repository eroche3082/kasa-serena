import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ImageUploader from '@/components/design/ImageUploader';
import BasicAIVisualization from '@/components/design/BasicAIVisualization';
import { useDesign } from '@/context/DesignContext';

const AIVisualizationDemo = () => {
  const { analysisResult } = useDesign();
  const { toast } = useToast();
  const [savedDesigns, setSavedDesigns] = useState<any[]>([]);

  const handleSaveDesign = (designData: any) => {
    // En producción, esto guardaría el diseño en la base de datos
    setSavedDesigns([...savedDesigns, { 
      id: Date.now(),
      ...designData,
      createdAt: new Date().toISOString()
    }]);
    
    toast({
      title: "Diseño guardado",
      description: "Tu diseño ha sido guardado exitosamente.",
    });
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-['Didonesque'] mb-2 text-center">Visualización de Diseño con IA</h1>
      <p className="text-center text-neutral-600 mb-12 max-w-3xl mx-auto">
        Sube tu imagen, analízala con nuestra inteligencia artificial y obtén visualizaciones, recomendaciones 
        y estimaciones de costo personalizadas para tu proyecto.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-['Didonesque'] mb-4">Selecciona o sube una imagen</h2>
          <ImageUploader />
        </div>
        
        <div>
          <h2 className="text-2xl font-['Didonesque'] mb-4">Visualización Avanzada</h2>
          <BasicAIVisualization onSave={handleSaveDesign} />
        </div>
      </div>
      
      {savedDesigns.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-['Didonesque'] mb-6 text-center">Diseños Guardados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDesigns.map((design) => (
              <Card key={design.id} className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src={design.previewImage}
                    alt="Diseño guardado"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">{design.style}</h3>
                  <p className="text-sm text-neutral-600 line-clamp-3 mb-3">
                    {design.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-500">
                      {new Date(design.createdAt).toLocaleDateString()}
                    </span>
                    <Button size="sm" variant="outline">Ver detalles</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIVisualizationDemo;