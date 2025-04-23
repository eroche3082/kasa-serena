import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Download, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  SmartContainerParams, 
  generateSmartContainer, 
  usoOptions, 
  tamañoOptions, 
  energiaOptions, 
  fachadaOptions, 
  techOptions, 
  extrasOptions 
} from '@/lib/smartContainer';
import { DesignResult } from '@/lib/designGenerator';
import { generateSmartContainerPDF, createWhatsAppShareLink } from '@/lib/pdfGenerator';

const SmartContainerGenerator = () => {
  const [params, setParams] = useState<SmartContainerParams>({
    uso: '',
    tamaño: '',
    energia: '',
    fachada: '',
    tech: '',
    extras: ''
  });

  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesign, setGeneratedDesign] = useState<DesignResult | null>(null);
  const { toast } = useToast();

  const handleExtraChange = (value: string, checked: boolean) => {
    setSelectedExtras(prev => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter(item => item !== value);
      }
    });
  };

  const updateParams = (key: keyof SmartContainerParams, value: string) => {
    setParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateDesign = async () => {
    // Validar que todos los campos requeridos estén completos
    if (!params.uso || !params.tamaño || !params.energia || !params.fachada || !params.tech) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Combinar los extras seleccionados
      const designParams: SmartContainerParams = {
        ...params,
        extras: selectedExtras.length > 0 ? selectedExtras.join(', ') : undefined
      };

      const result = await generateSmartContainer(designParams);
      setGeneratedDesign(result);

      toast({
        title: "Diseño generado",
        description: "Tu Smart Container ha sido diseñado exitosamente"
      });
    } catch (error) {
      console.error('Error generando Smart Container:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el diseño. Intenta con diferentes parámetros.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Diseñador de Smart Containers</CardTitle>
          <CardDescription>
            Crea contenedores inteligentes personalizados con energía renovable
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="uso">Uso del container</Label>
              <Select 
                value={params.uso} 
                onValueChange={(value) => updateParams('uso', value)}
              >
                <SelectTrigger id="uso">
                  <SelectValue placeholder="Selecciona un uso" />
                </SelectTrigger>
                <SelectContent>
                  {usoOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tamaño">Tamaño</Label>
              <Select 
                value={params.tamaño} 
                onValueChange={(value) => updateParams('tamaño', value)}
              >
                <SelectTrigger id="tamaño">
                  <SelectValue placeholder="Selecciona un tamaño" />
                </SelectTrigger>
                <SelectContent>
                  {tamañoOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="energia">Fuente de energía</Label>
              <Select 
                value={params.energia} 
                onValueChange={(value) => updateParams('energia', value)}
              >
                <SelectTrigger id="energia">
                  <SelectValue placeholder="Selecciona fuente de energía" />
                </SelectTrigger>
                <SelectContent>
                  {energiaOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fachada">Estilo de fachada</Label>
              <Select 
                value={params.fachada} 
                onValueChange={(value) => updateParams('fachada', value)}
              >
                <SelectTrigger id="fachada">
                  <SelectValue placeholder="Selecciona estilo de fachada" />
                </SelectTrigger>
                <SelectContent>
                  {fachadaOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tech">Tecnología integrada</Label>
              <Select 
                value={params.tech} 
                onValueChange={(value) => updateParams('tech', value)}
              >
                <SelectTrigger id="tech">
                  <SelectValue placeholder="Selecciona tecnología" />
                </SelectTrigger>
                <SelectContent>
                  {techOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Extras (opcional)</Label>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {extrasOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`extra-${option.value}`} 
                      checked={selectedExtras.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleExtraChange(option.value, checked as boolean)
                      }
                    />
                    <label 
                      htmlFor={`extra-${option.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={generateDesign} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                'Generar Smart Container'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Diseño Generado</CardTitle>
          <CardDescription>
            Visualización de tu Smart Container personalizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-[580px] space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Generando Smart Container con IA...</p>
            </div>
          ) : generatedDesign ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-md border">
                <img 
                  src={generatedDesign.imageUrl} 
                  alt="Smart Container generado por IA" 
                  className="w-full h-auto aspect-video object-cover" 
                />
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium">Descripción Arquitectónica</h3>
                  <p className="text-sm text-muted-foreground">{generatedDesign.description}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Características Smart</h3>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    {generatedDesign.materials.map((material, index) => (
                      <li key={index}>{material}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium">Tiempo de Instalación</h3>
                  <p className="text-sm text-muted-foreground">{generatedDesign.estimatedTime}</p>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-6">
                  <Button 
                    variant="default"
                    onClick={() => generateSmartContainerPDF({
                      image: generatedDesign.imageUrl,
                      title: `Smart Container para ${params.uso}`,
                      description: generatedDesign.description,
                      materials: generatedDesign.materials,
                      estimatedTime: generatedDesign.estimatedTime
                    })}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Descargar PDF
                  </Button>
                  
                  <a
                    href={createWhatsAppShareLink(generatedDesign.description, "Smart Container")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button variant="outline">
                      <Send className="mr-2 h-4 w-4" />
                      Solicitar Cotización
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[580px] space-y-2 text-center">
              <p className="text-muted-foreground">Completa los parámetros y genera tu Smart Container personalizado.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartContainerGenerator;