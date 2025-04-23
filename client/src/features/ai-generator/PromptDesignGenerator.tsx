import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DesignResult {
  imageUrl: string;
  description: string;
  materials: string[];
  estimatedTime: string;
}

const PromptDesignGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesign, setGeneratedDesign] = useState<DesignResult | null>(null);
  const { toast } = useToast();

  const generateDesignFromPrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt vacío",
        description: "Por favor, describe el diseño que deseas generar",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/design-generator-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setGeneratedDesign(data);

      toast({
        title: "Diseño generado",
        description: "Tu diseño se ha generado exitosamente"
      });
    } catch (error) {
      console.error('Error generando diseño:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el diseño. Intenta con una descripción diferente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Genera diseños con IA usando prompts</CardTitle>
          <CardDescription>
            Describe en detalle el diseño que deseas crear y nuestra IA lo generará para ti
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Descripción detallada</Label>
              <Textarea
                id="prompt"
                placeholder="Ej: Quiero un gabinete de cocina de madera de roble con acabado oscuro, estilo minimalista, con tiradores dorados y dimensiones de 180x80 cm..."
                className="h-32 resize-none"
                value={prompt}
                onChange={handleTextareaChange}
              />
              <p className="text-sm text-muted-foreground">
                Incluye tipo de diseño, materiales, colores, estilo y dimensiones
              </p>
            </div>

            <Button 
              onClick={generateDesignFromPrompt} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                'Generar Diseño'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Diseño Generado</CardTitle>
          <CardDescription>
            Resultado basado en tu descripción
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Generando diseño con IA...</p>
            </div>
          ) : generatedDesign ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-md border">
                <img 
                  src={generatedDesign.imageUrl} 
                  alt="Diseño generado por IA" 
                  className="w-full h-auto aspect-video object-cover" 
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Descripción</h3>
                <p className="text-sm text-muted-foreground">{generatedDesign.description}</p>
                
                <h3 className="font-medium">Materiales Recomendados</h3>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  {generatedDesign.materials.map((material, index) => (
                    <li key={index}>{material}</li>
                  ))}
                </ul>
                
                <h3 className="font-medium">Tiempo Estimado</h3>
                <p className="text-sm text-muted-foreground">{generatedDesign.estimatedTime}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 space-y-2 text-center">
              <p className="text-muted-foreground">Describe tu diseño ideal en el cuadro de texto y generaremos una visualización para ti.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptDesignGenerator;