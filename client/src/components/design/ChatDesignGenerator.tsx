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

const ChatDesignGenerator = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSelect, setCurrentSelect] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [designParams, setDesignParams] = useState({
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
        content: '¡Hola! Soy tu asistente de diseño. Te ayudaré a crear un diseño personalizado. ¿Qué tipo de elemento te gustaría diseñar?'
      },
      {
        type: 'options',
        content: 'Selecciona un tipo de diseño:',
        options: [
          { value: 'puerta', label: 'Puerta' },
          { value: 'ventana', label: 'Ventana' },
          { value: 'cocina', label: 'Cocina' },
          { value: 'gabinete', label: 'Gabinete' },
          { value: 'closet', label: 'Closet' }
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
      switch (nextStep) {
        case 1: // Preguntar sobre el material
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
        case 2: // Preguntar sobre el color
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
        case 3: // Preguntar sobre el estilo
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
        case 4: // Preguntar sobre las dimensiones
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
        case 5: // Generar el diseño final
          setMessages(prev => [
            ...prev,
            {
              type: 'assistant',
              content: `¡Perfecto! Estoy generando tu diseño personalizado con estos parámetros...`
            }
          ]);
          
          // Llamar a la API para generar el diseño
          generateDesignWithParams();
          break;
      }
      setIsLoading(false);
    }, 1000); // Un pequeño retraso para simular procesamiento
  };

  const generateDesignWithParams = async () => {
    try {
      const result = await generateDesign(designParams);
      
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
        description: "Tu diseño personalizado ha sido generado exitosamente"
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
    setDesignParams({
      tipo: '',
      material: '',
      color: '',
      estilo: '',
      medidas: '',
      extra: ''
    });
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