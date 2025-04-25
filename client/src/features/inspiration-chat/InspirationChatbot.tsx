import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, ImagePlus, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

interface DesignInspiration {
  imageUrl: string;
  title: string;
  description: string;
  style: string;
  tags: string[];
}

const InspirationChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inspirations, setInspirations] = useState<DesignInspiration[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Iniciar el chat cuando se monta el componente
  useEffect(() => {
    const initialMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'assistant',
      content: '¡Hola! Soy el asistente de inspiración para diseños de Kasa Serena. Puedo ayudarte a encontrar ideas para tu proyecto de diseño, responder preguntas sobre estilos arquitectónicos, o sugerir combinaciones de materiales. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    };
    
    setMessages([initialMessage]);
    
    // Cargar inspiraciones iniciales
    fetchInitialInspirations();
  }, []);

  // Auto-scroll al último mensaje
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchInitialInspirations = async () => {
    try {
      setIsLoading(true);
      // Llamada a la API para obtener inspiraciones iniciales
      const response = await fetch('/api/design-inspirations?limit=3');
      
      if (!response.ok) {
        throw new Error('Error al obtener inspiraciones');
      }
      
      const data = await response.json();
      setInspirations(data);
    } catch (error) {
      console.error('Error fetching inspirations:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las inspiraciones de diseño. Mostrando alternativas.",
        variant: "destructive"
      });
      
      // Fallback a inspiraciones locales en caso de error
      setInspirations([
        {
          imageUrl: '/src/features/home/assets/kitchen-marble-1.jpg',
          title: 'Cocina de Mármol y Madera',
          description: 'Combinación de mármol claro y madera oscura para un contraste elegante',
          style: 'Contemporáneo',
          tags: ['cocina', 'mármol', 'madera', 'elegante']
        },
        {
          imageUrl: '/src/features/home/assets/wooden-door-detail-2.jpg',
          title: 'Puerta Artesanal de Roble',
          description: 'Puerta con detalles tallados a mano por artesanos locales',
          style: 'Tradicional',
          tags: ['puerta', 'madera', 'artesanal', 'tallado']
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Aquí haríamos la llamada a la API en una implementación real
      const response = await apiRequest(
        'POST', 
        '/api/chat-assistant', 
        {
          message: inputMessage,
          projectType: 'inspiration'
        }
      );
      
      // Procesamos la respuesta
      const data = await response.json();
      
      // Esperamos un momento para simular el tiempo de respuesta
      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        
        // Buscar nuevas inspiraciones basadas en la consulta
        fetchRelatedInspirations(inputMessage);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const fetchRelatedInspirations = async (query: string) => {
    try {
      setIsLoading(true);
      // Extraemos posibles categorías o estilos de la consulta
      const keywords = query.toLowerCase().split(/\s+/);
      const commonCategories = ['cocina', 'puerta', 'ventana', 'baño', 'dormitorio', 'sala', 'comedor', 'gabinete'];
      const commonStyles = ['moderno', 'contemporáneo', 'tradicional', 'minimalista', 'industrial', 'rústico', 'mediterráneo'];
      
      // Buscamos coincidencias en la consulta
      const categoryMatch = keywords.find(word => commonCategories.includes(word));
      const styleMatch = keywords.find(word => commonStyles.includes(word));
      
      // Construimos la URL con los parámetros encontrados
      let url = '/api/design-inspirations?limit=3';
      if (categoryMatch) url += `&category=${categoryMatch}`;
      if (styleMatch) url += `&style=${styleMatch}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error al obtener inspiraciones relacionadas');
      }
      
      const data = await response.json();
      
      // Si no hay resultados, mantenemos las inspiraciones actuales
      if (data.length > 0) {
        setInspirations(data);
      } else {
        // Si no hay resultados específicos, solicitamos inspiraciones generales
        const fallbackResponse = await fetch('/api/design-inspirations?limit=3');
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          setInspirations(fallbackData);
        }
      }
    } catch (error) {
      console.error('Error fetching related inspirations:', error);
      // En caso de error, mezclamos las inspiraciones actuales para dar sensación de cambio
      setInspirations(prev => [...prev].sort(() => Math.random() - 0.5));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const processImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Verificar que sea una imagen
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Por favor, selecciona un archivo de imagen válido.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Convertir a base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result?.toString().split(',')[1];
        
        if (!base64Image) {
          throw new Error('No se pudo procesar la imagen');
        }
        
        // Añadir mensaje del usuario con la imagen
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: 'user',
          content: 'He subido una imagen para análisis de diseño.',
          timestamp: new Date(),
          imageUrl: reader.result?.toString()
        };
        
        setMessages(prev => [...prev, userMessage]);
        
        try {
          // Aquí haríamos la llamada al API para analizar la imagen
          const response = await apiRequest(
            'POST',
            '/api/analyze-image',
            {
              imageBase64: base64Image,
              projectType: 'inspiration'
            }
          );
          
          const data = await response.json();
          
          // Crear mensaje de respuesta
          const recommendations = data.recommendations.map((rec: string) => `• ${rec}`).join('\n');
          const materials = data.materials.map((mat: string) => `• ${mat}`).join('\n');
          
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            content: 
              `**Análisis de la imagen**\n\n` +
              `**Descripción:** ${data.description}\n\n` +
              `**Estilo identificado:** ${data.style}\n\n` +
              `**Materiales detectados:**\n${materials}\n\n` +
              `**Recomendaciones:**\n${recommendations}`,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, assistantMessage]);
          
          // Buscar inspiraciones similares al estilo detectado
          fetchRelatedInspirations(data.style);
          
        } catch (error) {
          console.error('Error analyzing image:', error);
          toast({
            title: "Error",
            description: "No se pudo analizar la imagen. Inténtalo de nuevo.",
            variant: "destructive"
          });
          
          // Añadir un mensaje de error
          const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            content: "Lo siento, no pude procesar esta imagen. Por favor, intenta con otra imagen o haz una pregunta sobre diseño.",
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, errorMessage]);
        }
        
        setIsLoading(false);
      };
      
      reader.onerror = () => {
        throw new Error('Error al leer el archivo');
      };
      
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la imagen. Inténtalo de nuevo.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  // Función para formatear el contenido con markdown simple
  const formatContent = (content: string) => {
    // Procesar negritas
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Procesar listas
    content = content.replace(/• (.*?)(\n|$)/g, '<li>$1</li>');
    content = content.replace(/<li>/g, '<ul><li>').replace(/<\/li>$/, '</li></ul>');
    content = content.replace(/<\/li>\n<ul>/g, '</li>');
    
    // Procesar saltos de línea
    content = content.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>');
    
    return content;
  };

  const getInspirationCard = (inspiration: DesignInspiration) => (
    <Card key={inspiration.title} className="flex flex-col overflow-hidden h-full">
      <div className="aspect-video overflow-hidden">
        <img 
          src={inspiration.imageUrl} 
          alt={inspiration.title} 
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-base line-clamp-1">{inspiration.title}</CardTitle>
        <CardDescription className="text-xs">Estilo: {inspiration.style}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm line-clamp-2">{inspiration.description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex flex-wrap gap-1">
          {inspiration.tags.map(tag => (
            <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto">
      {/* Sección del chat */}
      <Card className="w-full lg:w-2/3">
        <CardHeader>
          <CardTitle>Chat de Inspiración para Diseños</CardTitle>
          <CardDescription>
            Consulta ideas, estilos y recomendaciones para tu proyecto de diseño
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col h-[500px]">
            <ScrollArea className="flex-grow p-4">
              <div className="flex flex-col gap-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Avatar>
                        <AvatarImage src={message.sender === 'assistant' ? "/src/assets/logo-new.png" : ""} />
                        <AvatarFallback>
                          {message.sender === 'user' ? 'U' : 'AI'}
                        </AvatarFallback>
                      </Avatar>
                      <div 
                        className={`rounded-lg px-4 py-3 ${
                          message.sender === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        {message.imageUrl && (
                          <div className="mb-2 rounded overflow-hidden">
                            <img 
                              src={message.imageUrl} 
                              alt="Imagen de diseño" 
                              className="w-full max-h-[200px] object-contain bg-black"
                            />
                          </div>
                        )}
                        <div dangerouslySetInnerHTML={{ __html: formatContent(message.content) }} />
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <Avatar>
                        <AvatarFallback>
                          <Loader2 className="h-5 w-5 animate-spin" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg px-4 py-3 bg-muted">
                        Generando respuesta...
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <Separator />
            <div className="p-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Escribe tu mensaje aquí..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[60px] resize-none"
                  disabled={isLoading}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleImageUpload}
                    disabled={isLoading}
                    title="Subir imagen"
                  >
                    <ImagePlus className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="default"
                    size="icon"
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </Button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={processImageUpload}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección de inspiraciones */}
      <Card className="w-full lg:w-1/3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Inspiraciones</CardTitle>
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          <CardDescription>
            Diseños que podrían inspirarte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {inspirations.map(inspiration => 
              getInspirationCard(inspiration)
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InspirationChatbot;