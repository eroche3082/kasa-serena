import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Download, Send, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { queryClient } from '@/lib/queryClient';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  PoolParams, 
  generateModularPool, 
  formaOptions, 
  tamañoOptions, 
  profundidadOptions, 
  vidrioOptions, 
  acabadosOptions, 
  extrasOptions, 
  estiloOptions, 
  entornoOptions 
} from '@/lib/poolDesigner';
import { DesignResult } from '@/lib/designGenerator';
import { generateDesignPDF, createWhatsAppShareLink } from '@/lib/pdfGenerator';
import { submitQuote } from '@/lib/quoteService';

const ModularPoolDesigner = () => {
  const [params, setParams] = useState<PoolParams>({
    forma: '',
    tamaño: '',
    profundidad: '',
    vidrio: '',
    acabados: '',
    estilo: '',
    entorno: ''
  });

  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [generatedDesign, setGeneratedDesign] = useState<DesignResult | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleExtraChange = (value: string, checked: boolean) => {
    setSelectedExtras(prev => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter(item => item !== value);
      }
    });
  };

  const updateParams = (key: keyof PoolParams, value: string) => {
    setParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateDesign = async () => {
    // Validar que todos los campos requeridos estén completos
    if (!params.forma || !params.tamaño || !params.profundidad || !params.vidrio || 
        !params.acabados || !params.estilo || !params.entorno) {
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
      const designParams: PoolParams = {
        ...params,
        extras: selectedExtras.length > 0 ? selectedExtras.join(', ') : undefined
      };

      const result = await generateModularPool(designParams);
      setGeneratedDesign(result);

      toast({
        title: "Diseño generado",
        description: "Tu piscina modular ha sido diseñada exitosamente"
      });
    } catch (error) {
      console.error('Error generando piscina modular:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el diseño. Intenta con diferentes parámetros.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Genera y descarga el PDF del diseño
  const handleGeneratePDF = async () => {
    if (!generatedDesign) return;
    
    const poolInfo = {
      title: "Piscina Modular Personalizada",
      description: generatedDesign.description,
      materials: generatedDesign.materials,
      estimatedTime: generatedDesign.estimatedTime,
      type: "Piscina-Modular",
      image: generatedDesign.imageUrl
    };

    try {
      await generateDesignPDF(poolInfo);
      
      toast({
        title: "PDF generado",
        description: "El PDF de tu piscina modular ha sido descargado exitosamente"
      });
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el PDF. Intenta nuevamente.",
        variant: "destructive"
      });
    }
  };

  // Comparte el diseño por WhatsApp
  const handleShareWhatsApp = () => {
    if (!generatedDesign) return;
    
    const poolInfo = `
🏊‍♂️ *PISCINA MODULAR PERSONALIZADA* 🏊‍♂️

*Detalles:*
• Forma: ${params.forma}
• Tamaño: ${params.tamaño}
• Profundidad: ${params.profundidad}
• Vidrio/Acrílico: ${params.vidrio}
• Acabados: ${params.acabados}
• Estilo: ${params.estilo}
• Entorno: ${params.entorno}
${selectedExtras.length > 0 ? `• Extras: ${selectedExtras.join(', ')}` : ''}

*Tiempo de Instalación:* ${generatedDesign.estimatedTime}

Me gustaría recibir una cotización para este diseño.
    `;
    
    const whatsappLink = createWhatsAppShareLink(poolInfo, "Piscina Modular");
    window.open(whatsappLink, '_blank');
  };

  // Envía la cotización para guardarse en el sistema
  const handleSubmitQuote = async () => {
    if (!generatedDesign || !user) {
      if (!user) {
        toast({
          title: "Inicia sesión",
          description: "Debes iniciar sesión para guardar cotizaciones",
          variant: "destructive"
        });
      }
      return;
    }
    
    setIsSubmittingQuote(true);
    
    try {
      const poolParameters = {
        forma: params.forma,
        tamaño: params.tamaño,
        profundidad: params.profundidad,
        vidrio: params.vidrio,
        acabados: params.acabados,
        estilo: params.estilo,
        entorno: params.entorno,
        extras: selectedExtras.length > 0 ? selectedExtras.join(', ') : '',
      };
      
      const quoteData = {
        tipo: "Piscina Modular",
        datos: poolParameters,
        imageUrl: generatedDesign.imageUrl,
        descripcion: generatedDesign.description
      };
      
      await submitQuote(quoteData);
      
      queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
      
      toast({
        title: "Cotización enviada",
        description: "Tu cotización ha sido guardada exitosamente"
      });
    } catch (error) {
      console.error('Error enviando cotización:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la cotización. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Diseñador de Piscinas Modulares</CardTitle>
          <CardDescription>
            Crea piscinas modulares prefabricadas personalizadas para tu espacio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forma">Forma de la piscina</Label>
              <Select 
                value={params.forma} 
                onValueChange={(value) => updateParams('forma', value)}
              >
                <SelectTrigger id="forma">
                  <SelectValue placeholder="Selecciona una forma" />
                </SelectTrigger>
                <SelectContent>
                  {formaOptions.map((option) => (
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
              <Label htmlFor="profundidad">Profundidad</Label>
              <Select 
                value={params.profundidad} 
                onValueChange={(value) => updateParams('profundidad', value)}
              >
                <SelectTrigger id="profundidad">
                  <SelectValue placeholder="Selecciona la profundidad" />
                </SelectTrigger>
                <SelectContent>
                  {profundidadOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vidrio">Tipo de vidrio/acrílico</Label>
              <Select 
                value={params.vidrio} 
                onValueChange={(value) => updateParams('vidrio', value)}
              >
                <SelectTrigger id="vidrio">
                  <SelectValue placeholder="Selecciona el tipo de vidrio" />
                </SelectTrigger>
                <SelectContent>
                  {vidrioOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="acabados">Acabados</Label>
              <Select 
                value={params.acabados} 
                onValueChange={(value) => updateParams('acabados', value)}
              >
                <SelectTrigger id="acabados">
                  <SelectValue placeholder="Selecciona los acabados" />
                </SelectTrigger>
                <SelectContent>
                  {acabadosOptions.map((option) => (
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

            <div className="space-y-2">
              <Label htmlFor="estilo">Estilo de diseño</Label>
              <Select 
                value={params.estilo} 
                onValueChange={(value) => updateParams('estilo', value)}
              >
                <SelectTrigger id="estilo">
                  <SelectValue placeholder="Selecciona el estilo" />
                </SelectTrigger>
                <SelectContent>
                  {estiloOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entorno">Entorno de instalación</Label>
              <Select 
                value={params.entorno} 
                onValueChange={(value) => updateParams('entorno', value)}
              >
                <SelectTrigger id="entorno">
                  <SelectValue placeholder="Selecciona el entorno" />
                </SelectTrigger>
                <SelectContent>
                  {entornoOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                'Generar Piscina Modular'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Diseño Generado</CardTitle>
          <CardDescription>
            Visualización de tu piscina modular personalizada
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-[600px] space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Generando piscina modular con IA...</p>
            </div>
          ) : generatedDesign ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-md border">
                <img 
                  src={generatedDesign.imageUrl} 
                  alt="Piscina modular generada por IA" 
                  className="w-full h-auto aspect-video object-cover" 
                />
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium">Descripción</h3>
                  <p className="text-sm text-muted-foreground">{generatedDesign.description}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Materiales y Características</h3>
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-4">
                  <Button 
                    onClick={handleGeneratePDF} 
                    variant="outline" 
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Descargar PDF</span>
                  </Button>
                  
                  <Button 
                    onClick={handleShareWhatsApp} 
                    variant="outline" 
                    className="flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Compartir</span>
                  </Button>
                  
                  <Button 
                    onClick={handleSubmitQuote} 
                    disabled={isSubmittingQuote || !user}
                    className="flex items-center space-x-2"
                  >
                    {isSubmittingQuote ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        <span>Guardar Cotización</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[600px] space-y-2 text-center">
              <p className="text-muted-foreground">Completa los parámetros y genera tu piscina modular personalizada.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModularPoolDesigner;