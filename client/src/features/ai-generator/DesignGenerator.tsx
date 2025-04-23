import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { generateDesign } from '@/lib/gemini';
import { DesignParams, DesignResult, materialCategories, availableStyles } from '@/lib/designGenerator';
import { Loader2 } from 'lucide-react';

// Esquema de validación
const designGeneratorSchema = z.object({
  tipo: z.string().min(1, { message: 'Por favor, selecciona un tipo de diseño' }),
  material: z.string().min(1, { message: 'Por favor, ingresa un material' }),
  color: z.string().min(1, { message: 'Por favor, ingresa un color' }),
  estilo: z.string().min(1, { message: 'Por favor, selecciona un estilo' }),
  medidas: z.string().min(1, { message: 'Por favor, ingresa las medidas' }),
  extra: z.string().optional(),
});

type DesignGeneratorFormValues = z.infer<typeof designGeneratorSchema>;

export default function DesignGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [designResult, setDesignResult] = useState<DesignResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<DesignGeneratorFormValues>({
    resolver: zodResolver(designGeneratorSchema),
    defaultValues: {
      tipo: '',
      material: '',
      color: '',
      estilo: '',
      medidas: '',
      extra: '',
    },
  });

  async function onSubmit(data: DesignGeneratorFormValues) {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateDesign(data);
      setDesignResult(result);
    } catch (err: any) {
      console.error('Error al generar el diseño:', err);
      setError(err.message || 'Ocurrió un error al generar el diseño. Por favor, intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-['Didonesque'] mb-6 text-center">Generador de Diseño Visual</h1>
      <p className="text-lg text-center text-neutral-600 mb-10">
        Selecciona los parámetros para generar un diseño personalizado con inteligencia artificial
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Diseño</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tipo de diseño" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="puerta">Puerta</SelectItem>
                            <SelectItem value="ventana">Ventana</SelectItem>
                            <SelectItem value="cocina">Cocina</SelectItem>
                            <SelectItem value="gabinete">Gabinete</SelectItem>
                            <SelectItem value="piscina">Piscina</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          El tipo de elemento que deseas diseñar
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="material"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: madera de roble, aluminio, vidrio templado..." {...field} />
                        </FormControl>
                        <FormDescription>
                          El material principal del diseño
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: blanco, negro mate, caoba oscuro..." {...field} />
                        </FormControl>
                        <FormDescription>
                          El color principal del diseño
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="estilo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estilo</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un estilo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableStyles.map(style => (
                              <SelectItem key={style.id} value={style.id}>{style.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          El estilo de diseño deseado
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="medidas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dimensiones</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 80x200cm, 2m x 1.5m..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Las medidas aproximadas del diseño
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="extra"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Características Adicionales (opcional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Ej: resistente a la humedad, con vidrio templado, diseño ergonómico..." rows={3} {...field} />
                        </FormControl>
                        <FormDescription>
                          Cualquier característica o detalle adicional
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isGenerating}
                  >
                    {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isGenerating ? 'Generando diseño...' : 'Generar diseño con IA'}
                  </Button>
                </form>
              </Form>
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-500 rounded border border-red-200">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          {designResult ? (
            <Card className="h-full">
              <CardContent className="pt-6 h-full flex flex-col">
                <h3 className="text-xl font-medium mb-4">Diseño Generado</h3>
                
                <div className="mb-6 w-full">
                  <img 
                    src={designResult.imageUrl} 
                    alt="Diseño generado" 
                    className="w-full h-auto max-h-80 object-contain rounded-md"
                  />
                </div>
                
                <div className="space-y-4 flex-1">
                  <div>
                    <h4 className="font-medium text-neutral-700">Descripción</h4>
                    <p className="mt-1 text-neutral-600">{designResult.description}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium text-neutral-700">Materiales Necesarios</h4>
                    <ul className="mt-1 list-disc list-inside text-neutral-600">
                      {designResult.materials.map((material, index) => (
                        <li key={index}>{material}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium text-neutral-700">Tiempo Estimado de Producción</h4>
                    <p className="mt-1 text-neutral-600">{designResult.estimatedTime}</p>
                  </div>
                  
                  <div className="mt-6">
                    <Button variant="outline" onClick={() => window.print()} className="mr-2">
                      Imprimir Diseño
                    </Button>
                    <Button variant="outline" onClick={() => window.open(designResult.imageUrl, '_blank')}>
                      Ver Imagen Completa
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center bg-neutral-50 rounded-lg border border-dashed border-neutral-300 p-12">
              <div className="text-center">
                <h3 className="text-xl font-medium text-neutral-700 mb-2">Visualización del Diseño</h3>
                <p className="text-neutral-500">
                  Completa el formulario y genera un diseño para ver los resultados aquí
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}