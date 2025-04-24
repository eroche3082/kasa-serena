import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Schema de validación para el formulario
const quoteFormSchema = z.object({
  projectId: z.string().optional(),
  projectType: z.string().min(1, { message: 'Selecciona un tipo de proyecto' }),
  materials: z.string().min(1, { message: 'Especifica los materiales' }),
  dimensions: z.string().min(1, { message: 'Indica las dimensiones' }),
  startDate: z.date().optional(),
  additionalDetails: z.string().optional(),
  contactName: z.string().min(1, { message: 'Indica tu nombre completo' }),
  contactEmail: z.string().email({ message: 'Email inválido' }),
  contactPhone: z.string().min(8, { message: 'Teléfono inválido' }),
  shareOnWhatsApp: z.boolean().default(false),
  receiveEmail: z.boolean().default(true),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

// Opciones de tipos de proyecto
const projectTypes = [
  { value: 'contenedor', label: 'Contenedor Inteligente' },
  { value: 'piscina', label: 'Piscina Modular' },
  { value: 'cocina', label: 'Cocina Personalizada' },
  { value: 'puerta', label: 'Puerta' },
  { value: 'ventana', label: 'Ventana' },
  { value: 'gabinete', label: 'Gabinete' },
  { value: 'oficina', label: 'Oficina/Espacio Creativo' },
  { value: 'otro', label: 'Otro diseño personalizado' },
];

interface QuoteRequestFormProps {
  projectId?: string;
  projectType?: string;
  projectDetails?: {
    materials?: string;
    dimensions?: string;
    imageUrl?: string;
  };
}

export const QuoteRequestForm = ({ 
  projectId, 
  projectType, 
  projectDetails 
}: QuoteRequestFormProps) => {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [dateOpen, setDateOpen] = useState(false);
  
  // Definir valores por defecto
  const defaultValues: Partial<QuoteFormValues> = {
    projectId: projectId || '',
    projectType: projectType || '',
    materials: projectDetails?.materials || '',
    dimensions: projectDetails?.dimensions || '',
    startDate: undefined,
    additionalDetails: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    shareOnWhatsApp: false,
    receiveEmail: true,
  };
  
  // Configurar el formulario con react-hook-form
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues,
  });
  
  // Mutación para enviar la cotización
  const submitQuoteMutation = useMutation({
    mutationFn: async (data: QuoteFormValues) => {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: data.projectId,
          details: {
            tipo: data.projectType,
            materiales: data.materials,
            dimensiones: data.dimensions,
            fechaInicio: data.startDate,
            informacionAdicional: data.additionalDetails,
            contacto: {
              nombre: data.contactName,
              email: data.contactEmail,
              telefono: data.contactPhone,
            },
            imageUrl: projectDetails?.imageUrl,
          },
          shareOptions: {
            whatsapp: data.shareOnWhatsApp,
            email: data.receiveEmail,
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar la cotización');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      // Invalidar la caché para actualizar la lista de cotizaciones
      queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
      
      toast({
        title: "Cotización enviada",
        description: "Hemos recibido tu solicitud de cotización. Te contactaremos pronto.",
      });
      
      // Generar enlace de WhatsApp si la opción está seleccionada
      if (form.getValues('shareOnWhatsApp')) {
        const whatsappText = `Hola, solicito una cotización para un proyecto de ${form.getValues('projectType')} con las siguientes características:
- Materiales: ${form.getValues('materials')}
- Dimensiones: ${form.getValues('dimensions')}
- Detalles adicionales: ${form.getValues('additionalDetails') || 'No especificados'}

Mi nombre es ${form.getValues('contactName')}, mi correo es ${form.getValues('contactEmail')} y mi teléfono es ${form.getValues('contactPhone')}.`;

        const whatsappLink = `https://wa.me/+17874567890?text=${encodeURIComponent(whatsappText)}`;
        window.open(whatsappLink, '_blank');
      }
      
      // Redirigir a la página de cotizaciones
      setLocation('/cotizaciones');
    },
    onError: (error) => {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: `No se pudo enviar la cotización: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Manejar envío del formulario
  const onSubmit = (data: QuoteFormValues) => {
    submitQuoteMutation.mutate(data);
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-['Playfair_Display']">Solicitar Cotización</CardTitle>
        <CardDescription>
          Completa el formulario para recibir un presupuesto detallado de tu proyecto
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Detalles del Proyecto</h3>
              
              {/* Tipo de proyecto */}
              <FormField
                control={form.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Proyecto</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                      disabled={!!projectType}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo de proyecto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projectTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Materiales */}
              <FormField
                control={form.control}
                name="materials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Materiales</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe los materiales a utilizar (ej. madera de roble, aluminio, etc.)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Dimensiones */}
              <FormField
                control={form.control}
                name="dimensions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensiones</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Indica las dimensiones (ej. 3x4 metros, 250cm x 180cm)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Fecha estimada */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha estimada de inicio (opcional)</FormLabel>
                    <Popover open={dateOpen} onOpenChange={setDateOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setDateOpen(false);
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Detalles adicionales */}
              <FormField
                control={form.control}
                name="additionalDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detalles Adicionales (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Incluye cualquier otra información relevante para tu proyecto"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <h3 className="text-lg font-medium pt-4">Información de Contacto</h3>
              
              {/* Nombre de contacto */}
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Tu nombre completo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Email de contacto */}
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="tu@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Teléfono de contacto */}
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="+1 (787) 123-4567"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2 pt-2">
                <h3 className="text-lg font-medium">Opciones de Comunicación</h3>
                
                {/* Opción de WhatsApp */}
                <FormField
                  control={form.control}
                  name="shareOnWhatsApp"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2 py-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label htmlFor="share-whatsapp">Compartir cotización por WhatsApp</Label>
                    </div>
                  )}
                />
                
                {/* Opción de email */}
                <FormField
                  control={form.control}
                  name="receiveEmail"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2 py-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label htmlFor="receive-email">Recibir confirmación por email</Label>
                    </div>
                  )}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={submitQuoteMutation.isPending}
            >
              {submitQuoteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Solicitar Cotización'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2 text-sm text-muted-foreground">
        <p>
          Al enviar este formulario, nuestro equipo revisará tu solicitud y te enviará un presupuesto detallado
          en las próximas 24-48 horas.
        </p>
        <p>
          Si necesitas una cotización urgente, puedes llamarnos directamente al +1 (787) 456-7890.
        </p>
      </CardFooter>
    </Card>
  );
};

export default QuoteRequestForm;