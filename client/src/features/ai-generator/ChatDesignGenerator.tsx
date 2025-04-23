import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateDesign } from '@/lib/gemini';

interface ChatMessage {
  type: 'assistant' | 'user' | 'options' | 'result';
  content: string;
  options?: Option[];
  design?: DesignResult;
}

interface Option {
  value: string;
  label: string;
}

interface DesignResult {
  imageUrl: string;
  description: string;
  materials: string[];
  estimatedTime: string;
}

// Extendemos la interfaz para incluir todos los posibles parámetros de diseño
interface DesignParams {
  // Parámetros básicos
  tipo: string;
  material: string;
  color: string;
  estilo: string;
  medidas: string;
  extra: string;
  
  // Parámetros para Contenedor Inteligente
  uso?: string;
  tamaño?: string;
  energia?: string;
  fachada?: string;
  tech?: string;
  extras?: string;
  
  // Parámetros para Piscina Modular
  forma?: string;
  profundidad?: string;
  acabados?: string;
  vidrio?: string;
  entorno?: string;
  
  // Parámetros para Oficina/Espacio Creativo
  capacidad?: string;
  tecnologia?: string;
  bienestar?: string;
  
  [key: string]: string | undefined; // Para acceso dinámico a propiedades
}

const ChatDesignGenerator = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSelect, setCurrentSelect] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [designParams, setDesignParams] = useState<DesignParams>({
    tipo: '',
    material: '',
    color: '',
    estilo: '',
    medidas: '',
    extra: ''
  });
  const [currentStep, setCurrentStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Iniciar el chat cuando se monta el componente
  useEffect(() => {
    startChat();
  }, []);

  const startChat = () => {
    setMessages([
      {
        type: 'assistant',
        content: '¡Hola! Soy tu asistente de diseño. Te ayudaré a crear un diseño personalizado. ¿Qué tipo de proyecto te gustaría diseñar hoy?'
      },
      {
        type: 'options',
        content: 'Selecciona un tipo de proyecto:',
        options: [
          { value: 'contenedor', label: 'Contenedor Inteligente' },
          { value: 'piscina', label: 'Piscina Modular' },
          { value: 'oficina', label: 'Oficina/Espacio Creativo' },
          { value: 'puerta', label: 'Puerta' },
          { value: 'ventana', label: 'Ventana' },
          { value: 'cocina', label: 'Cocina' }
        ]
      }
    ]);
    setCurrentQuestion('tipo');
    setCurrentStep(0);
  };

  const handleOptionSelect = async (value: string) => {
    if (isLoading) return;

    // Añadir la selección del usuario como mensaje
    setMessages(prev => [
      ...prev,
      { type: 'user', content: value }
    ]);

    // Actualizar los parámetros del diseño
    setDesignParams(prev => ({
      ...prev,
      [currentQuestion]: value
    }));

    setIsLoading(true);

    // Procesamiento según el paso actual
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    // Lógica para cada paso
    setTimeout(() => {
      // Primer paso - Selección del tipo de proyecto
      if (currentQuestion === 'tipo') {
        // Lógica específica según el tipo de proyecto seleccionado
        switch (value) {
          case 'contenedor':
            setMessages(prev => [
              ...prev,
              {
                type: 'assistant',
                content: `¡Excelente elección! Los Contenedores Inteligentes son una solución moderna y versátil. ¿Qué uso principal tendrá tu contenedor?`
              },
              {
                type: 'options',
                content: 'Selecciona el uso principal:',
                options: [
                  { value: 'casa', label: 'Casa o Vivienda' },
                  { value: 'oficina', label: 'Oficina' },
                  { value: 'spa', label: 'Spa o Centro de Bienestar' },
                  { value: 'café', label: 'Café o Restaurante' },
                  { value: 'estudio', label: 'Estudio Creativo' }
                ]
              }
            ]);
            setCurrentQuestion('uso');
            break;
            
          case 'piscina':
            setMessages(prev => [
              ...prev,
              {
                type: 'assistant',
                content: `¡Genial! Las Piscinas Modulares son perfectas para espacios personalizados. ¿Qué forma te gustaría para tu piscina?`
              },
              {
                type: 'options',
                content: 'Selecciona la forma:',
                options: [
                  { value: 'rectangular', label: 'Rectangular' },
                  { value: 'cuadrada', label: 'Cuadrada' },
                  { value: 'circular', label: 'Circular' },
                  { value: 'infinity', label: 'Infinity (Borde Infinito)' }
                ]
              }
            ]);
            setCurrentQuestion('forma');
            break;
            
          case 'oficina':
            setMessages(prev => [
              ...prev,
              {
                type: 'assistant',
                content: `¡Perfecto! Vamos a diseñar un espacio creativo o de trabajo. ¿Para cuántas personas necesitas este espacio?`
              },
              {
                type: 'options',
                content: 'Selecciona la capacidad:',
                options: [
                  { value: '1-2', label: '1-2 personas (Pequeño)' },
                  { value: '3-5', label: '3-5 personas (Mediano)' },
                  { value: '6-10', label: '6-10 personas (Grande)' },
                  { value: '10+', label: 'Más de 10 personas (Extra grande)' }
                ]
              }
            ]);
            setCurrentQuestion('capacidad');
            break;
            
          default: // Elementos tradicionales como puertas, ventanas, etc.
            setMessages(prev => [
              ...prev,
              {
                type: 'assistant',
                content: `Excelente elección. ¿Qué material prefieres para tu ${value}?`
              },
              {
                type: 'options',
                content: 'Selecciona un material:',
                options: [
                  { value: 'madera', label: 'Madera' },
                  { value: 'aluminio', label: 'Aluminio' },
                  { value: 'pvc', label: 'PVC' },
                  { value: 'vidrio', label: 'Vidrio' },
                  { value: 'acero', label: 'Acero' }
                ]
              }
            ]);
            setCurrentQuestion('material');
            break;
        }
      }
      // Segundo paso - Varía según el proyecto seleccionado
      else if (nextStep === 2) {
        switch (designParams.tipo) {
          case 'contenedor':
            setMessages(prev => [
              ...prev,
              {
                type: 'assistant',
                content: `¿Qué tamaño prefieres para tu contenedor inteligente?`
              },
              {
                type: 'options',
                content: 'Selecciona el tamaño:',
                options: [
                  { value: '20pies', label: '20 pies (Pequeño)' },
                  { value: '40pies', label: '40 pies (Grande)' },
                  { value: 'tiny', label: 'Tiny (Ultra compacto)' },
                  { value: 'doble', label: 'Doble Nivel' },
                  { value: 'modular', label: 'Modular (Combinado)' }
                ]
              }
            ]);
            setCurrentQuestion('tamaño');
            break;
            
          case 'piscina':
            setMessages(prev => [
              ...prev,
              {
                type: 'assistant',
                content: `¿Qué tamaño te gustaría para tu piscina ${value}?`
              },
              {
                type: 'options',
                content: 'Selecciona el tamaño:',
                options: [
                  { value: '3x2m', label: 'Pequeña (3x2m)' },
                  { value: '5x3m', label: 'Mediana (5x3m)' },
                  { value: '6x4m', label: 'Grande (6x4m)' },
                  { value: '8x4m', label: 'Extra grande (8x4m)' }
                ]
              }
            ]);
            setCurrentQuestion('tamaño');
            break;
            
          case 'oficina':
            setMessages(prev => [
              ...prev,
              {
                type: 'assistant',
                content: `¿Qué estilo de diseño prefieres para tu espacio creativo?`
              },
              {
                type: 'options',
                content: 'Selecciona el estilo:',
                options: [
                  { value: 'moderno', label: 'Moderno y Minimalista' },
                  { value: 'industrial', label: 'Industrial' },
                  { value: 'ecologico', label: 'Ecológico/Sostenible' },
                  { value: 'creativo', label: 'Creativo/Artístico' },
                  { value: 'tradicional', label: 'Tradicional/Ejecutivo' }
                ]
              }
            ]);
            setCurrentQuestion('estilo');
            break;
            
          default:
            setMessages(prev => [
              ...prev,
              {
                type: 'assistant',
                content: `¿Qué color te gustaría para tu ${designParams.tipo} de ${value}?`
              },
              {
                type: 'options',
                content: 'Selecciona un color:',
                options: [
                  { value: 'natural', label: 'Natural' },
                  { value: 'blanco', label: 'Blanco' },
                  { value: 'negro', label: 'Negro' },
                  { value: 'gris', label: 'Gris' },
                  { value: 'cafe', label: 'Café' }
                ]
              }
            ]);
            setCurrentQuestion('color');
            break;
        }
      }
      // Tercer paso - Más detalles específicos
      else if (nextStep === 3) {
        switch (designParams.tipo) {
          case 'contenedor':
            setMessages(prev => [
              ...prev,
              {
                type: 'assistant',
                content: `¿Qué tipo de sistema energético prefieres para tu contenedor?`
              },
              {
                type: 'options',
                content: 'Selecciona el sistema energético:',
                options: [
                  { value: 'solar', label: 'Paneles Solares' },
                  { value: 'eolica', label: 'Energía Eólica' },
                  { value: 'mixta', label: 'Sistema Mixto (Solar+Eólica)' },
                  { value: 'bateria', label: 'Paneles con Batería de Respaldo' },
                  { value: 'convencional', label: 'Conexión Convencional' }
                ]
              }
            ]);
            setCurrentQuestion('energia');
            break;
            
          case 'piscina':
            setMessages(prev => [
              ...prev,
              {
                type: 'assistant',
                content: `¿Qué profundidad deseas para tu piscina?`
              },
              {
                type: 'options',
                content: 'Selecciona la profundidad:',
                options: [
                  { value: '1.2m', label: 'Baja (1.2m)' },
                  { value: '1.5m', label: 'Media (1.5m)' },
                  { value: '2m', label: 'Profunda (2m)' },
                  { value: 'variable', label: 'Profundidad Variable' }
                ]
              }
            ]);
            setCurrentQuestion('profundidad');
            break;
            
          case 'oficina':
            setMessages(prev => [
              ...prev,
              {
                type: 'assistant',
                content: `¿Qué características tecnológicas deseas incluir en tu espacio?`
              },
              {
                type: 'options',
                content: 'Selecciona las características:',
                options: [
                  { value: 'conectividad', label: 'Alta Conectividad/Fibra' },
                  { value: 'automatizacion', label: 'Automatización/Smart Office' },
                  { value: 'videoconferencia', label: 'Sistema de Videoconferencia' },
                  { value: 'colaboracion', label: 'Herramientas de Colaboración' },
                  { value: 'basica', label: 'Tecnología Básica' }
                ]
              }
            ]);
            setCurrentQuestion('tecnologia');
            break;
            
          default:
            setMessages(prev => [
              ...prev,
              {
                type: 'assistant',
                content: `¿Qué estilo prefieres para tu diseño?`
              },
              {
                type: 'options',
                content: 'Selecciona un estilo:',
                options: [
                  { value: 'moderno', label: 'Moderno' },
                  { value: 'minimalista', label: 'Minimalista' },
                  { value: 'clásico', label: 'Clásico' },
                  { value: 'rústico', label: 'Rústico' },
                  { value: 'industrial', label: 'Industrial' }
                ]
              }
            ]);
            setCurrentQuestion('estilo');
            break;
        }
      }
      // Cuarto paso - Características adicionales 
      else if (nextStep === 4) {
        switch (designParams.tipo) {
          case 'contenedor':
            setMessages(prev => [
              ...prev,
              {
                type: 'assistant',
                content: `¿Qué tipo de fachada te gustaría para tu contenedor?`
              },
              {
                type: 'options',
                content: 'Selecciona el tipo de fachada:',
                options: [
                  { value: 'madera', label: 'Madera Minimalista' },
                  { value: 'aluminio', label: 'Aluminio Negro' },
                  { value: 'verde', label: 'Verde Natural/Ecológica' },
                  { value: 'cristal', label: 'Cristal Panorámico' },
                  { value: 'combinado', label: 'Combinación de Materiales' }
                ]
              }
            ]);
            setCurrentQuestion('fachada');
            break;
            
          case 'piscina':
            setMessages(prev => [
              ...prev,
              {
                type: 'assistant',
                content: `¿Qué tipo de acabado prefieres para tu piscina?`
              },
              {
                type: 'options',
                content: 'Selecciona el acabado:',
                options: [
                  { value: 'mosaico', label: 'Mosaico Azul' },
                  { value: 'cemento', label: 'Cemento Pulido' },
                  { value: 'marmol', label: 'Mármol Blanco' },
                  { value: 'pasto', label: 'Borde con Pasto Sintético' },
                  { value: 'piedra', label: 'Piedra Natural' }
                ]
              }
            ]);
            setCurrentQuestion('acabados');
            break;
            
          case 'oficina':
            setMessages(prev => [
              ...prev,
              {
                type: 'assistant',
                content: `¿Qué elementos de bienestar te gustaría incluir en tu espacio?`
              },
              {
                type: 'options',
                content: 'Selecciona elementos de bienestar:',
                options: [
                  { value: 'areas-verdes', label: 'Áreas Verdes/Plantas' },
                  { value: 'ergonomia', label: 'Mobiliario Ergonómico' },
                  { value: 'luz-natural', label: 'Maximización de Luz Natural' },
                  { value: 'zonas-descanso', label: 'Zonas de Descanso' },
                  { value: 'acustica', label: 'Tratamiento Acústico' }
                ]
              }
            ]);
            setCurrentQuestion('bienestar');
            break;
            
          default:
            setMessages(prev => [
              ...prev,
              {
                type: 'assistant',
                content: `¿Qué dimensiones necesitas para tu ${designParams.tipo}?`
              },
              {
                type: 'options',
                content: 'Selecciona las dimensiones:',
                options: [
                  { value: '80x200', label: 'Pequeño (80x200 cm)' },
                  { value: '100x200', label: 'Mediano (100x200 cm)' },
                  { value: '120x200', label: 'Grande (120x200 cm)' },
                  { value: '150x200', label: 'Extra grande (150x200 cm)' },
                  { value: 'personalizado', label: 'Personalizado' }
                ]
              }
            ]);
            setCurrentQuestion('medidas');
            break;
        }
      }
      // Quinto paso - Extras o generar diseño
      else if (nextStep === 5) {
        if (designParams.tipo === 'contenedor' || designParams.tipo === 'piscina' || designParams.tipo === 'oficina') {
          // Paso de extras específicos
          setMessages(prev => [
            ...prev,
            {
              type: 'assistant',
              content: `¿Te gustaría incluir algún extra o característica adicional?`
            },
            {
              type: 'options',
              content: 'Selecciona extras (opcional):',
              options: designParams.tipo === 'contenedor' ? [
                { value: 'paneles-moviles', label: 'Paneles Móviles' },
                { value: 'jardines-verticales', label: 'Jardines Verticales' },
                { value: 'techo-verde', label: 'Techo Verde' },
                { value: 'domótica', label: 'Sistema Domótico' },
                { value: 'ninguno', label: 'Ninguno' }
              ] : designParams.tipo === 'piscina' ? [
                { value: 'panel-solar', label: 'Panel Solar' },
                { value: 'calentador', label: 'Calentador' },
                { value: 'led', label: 'Iluminación LED' },
                { value: 'escalones', label: 'Escalones Internos' },
                { value: 'ninguno', label: 'Ninguno' }
              ] : [
                { value: 'muro-verde', label: 'Muro Verde' },
                { value: 'cafeteria', label: 'Área de Cafetería' },
                { value: 'sala-reuniones', label: 'Sala de Reuniones' },
                { value: 'recepcion', label: 'Recepción Elegante' },
                { value: 'ninguno', label: 'Ninguno' }
              ]
            }
          ]);
          setCurrentQuestion('extras');
        } else {
          // Para los demás tipos, generar diseño directamente
          setMessages(prev => [
            ...prev,
            {
              type: 'assistant',
              content: `¡Perfecto! Estoy generando tu diseño personalizado con estos parámetros...`
            }
          ]);
          
          // Llamar a la API para generar el diseño
          generateDesignWithParams();
        }
      }
      // Sexto paso - Generar diseño para los tipos especiales
      else if (nextStep === 6 && (designParams.tipo === 'contenedor' || designParams.tipo === 'piscina' || designParams.tipo === 'oficina')) {
        setMessages(prev => [
          ...prev,
          {
            type: 'assistant',
            content: `¡Excelente! Con toda esta información, estoy generando un diseño personalizado para ti...`
          }
        ]);
        
        // Llamar a la API para generar el diseño
        generateDesignWithParams();
      }
      
      setIsLoading(false);
    }, 1000); // Un pequeño retraso para simular procesamiento
  };

  const generateDesignWithParams = async () => {
    try {
      let result;
      
      // Llamar a la API correspondiente según el tipo de proyecto
      switch (designParams.tipo) {
        case 'contenedor':
          // Llamar a la API de generación de Smart Container
          result = await fetch('/api/generate-smart-container', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uso: designParams.uso || 'casa',
              tamaño: designParams.tamaño || '20pies',
              energia: designParams.energia || 'solar',
              fachada: designParams.fachada || 'madera',
              tech: designParams.tecnologia || 'app',
              extras: designParams.extras || ''
            }),
          }).then(res => res.json());
          break;
          
        case 'piscina':
          // Llamar a la API de generación de Piscina Modular
          result = await fetch('/api/generate-pool', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              forma: designParams.forma || 'rectangular',
              tamaño: designParams.tamaño || '5x3m',
              profundidad: designParams.profundidad || '1.5m',
              vidrio: 'Sin vidrio',
              acabados: designParams.acabados || 'mosaico',
              extras: designParams.extras || '',
              estilo: 'moderno',
              entorno: 'Jardín tropical'
            }),
          }).then(res => res.json());
          break;
          
        case 'oficina':
          // Para oficinas y espacios creativos, usar el generador genérico
          result = await generateDesign({
            ...designParams,
            tipo: 'oficina-creativa'
          });
          break;
          
        default:
          // Para los diseños tradicionales (puertas, ventanas, etc.)
          result = await generateDesign(designParams);
          break;
      }
      
      setMessages(prev => [
        ...prev,
        {
          type: 'result',
          content: '¡Tu diseño está listo!',
          design: result
        }
      ]);

      toast({
        title: "Diseño generado",
        description: "Tu diseño personalizado ha sido generado exitosamente",
        variant: "default"
      });
    } catch (error) {
      console.error('Error generando diseño:', error);
      setMessages(prev => [
        ...prev,
        {
          type: 'assistant',
          content: 'Lo siento, hubo un problema al generar tu diseño. ¿Te gustaría intentarlo de nuevo?'
        }
      ]);

      toast({
        title: "Error",
        description: "No se pudo generar el diseño. Por favor, intenta de nuevo.",
        variant: "destructive"
      });
    }
  };

  const resetChat = () => {
    // Reiniciar todos los parámetros posibles
    setDesignParams({
      tipo: '',
      material: '',
      color: '',
      estilo: '',
      medidas: '',
      extra: '',
      // Contenedor inteligente
      uso: '',
      tamaño: '',
      energia: '',
      fachada: '',
      tech: '',
      extras: '',
      // Piscina modular
      forma: '',
      profundidad: '',
      acabados: '',
      vidrio: '',
      entorno: '',
      // Oficina/espacio creativo
      capacidad: '',
      tecnologia: '',
      bienestar: ''
    });
    
    // Resetear el select actual
    setCurrentSelect('');
    
    // Iniciar la conversación desde el principio
    startChat();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Asistente de Diseño Interactivo</CardTitle>
        <CardDescription>
          Conversa con nuestro asistente para crear un diseño personalizado paso a paso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ScrollArea className="h-[400px] pr-4">
            {messages.map((message, index) => (
              <div key={index} className="mb-4">
                {message.type === 'assistant' && (
                  <div className="flex">
                    <div className="bg-primary bg-opacity-10 rounded-lg p-3 max-w-[80%]">
                      <p className="text-neutral-800">{message.content}</p>
                    </div>
                  </div>
                )}
                
                {message.type === 'user' && (
                  <div className="flex justify-end">
                    <div className="bg-neutral-100 rounded-lg p-3 max-w-[80%]">
                      <p className="text-neutral-800">{message.content}</p>
                    </div>
                  </div>
                )}
                
                {message.type === 'options' && message.options && (
                  <div className="my-2">
                    <p className="text-sm mb-2">{message.content}</p>
                    <Select 
                      value={currentSelect} 
                      onValueChange={(value) => {
                        setCurrentSelect(value);
                        handleOptionSelect(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        {message.options.map((option, i) => (
                          <SelectItem key={i} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {message.type === 'result' && message.design && (
                  <div className="my-4 p-4 border rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Diseño Generado</h3>
                    <div className="overflow-hidden rounded-md border mb-4">
                      <img 
                        src={message.design.imageUrl} 
                        alt="Diseño generado por IA" 
                        className="w-full h-auto aspect-video object-cover" 
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Descripción</h4>
                      <p className="text-sm text-muted-foreground mb-2">{message.design.description}</p>
                      
                      <h4 className="font-medium">Materiales Recomendados</h4>
                      <ul className="text-sm text-muted-foreground list-disc list-inside mb-2">
                        {message.design.materials.map((material, i) => (
                          <li key={i}>{material}</li>
                        ))}
                      </ul>
                      
                      <h4 className="font-medium">Tiempo Estimado</h4>
                      <p className="text-sm text-muted-foreground">{message.design.estimatedTime}</p>
                      
                      <Button 
                        onClick={resetChat}
                        variant="outline" 
                        className="mt-4"
                      >
                        Crear Nuevo Diseño
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center space-x-2">
                <div className="bg-primary bg-opacity-10 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatDesignGenerator;