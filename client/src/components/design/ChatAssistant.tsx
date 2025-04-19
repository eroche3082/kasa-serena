import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { chatWithAssistant } from '@/lib/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hola, soy el asistente de diseño de Kasa Serena. ¿En qué puedo ayudarte hoy?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: inputMessage
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Get response from AI assistant
      const botResponse = await chatWithAssistant(
        inputMessage, 
        messages.map(msg => ({ role: msg.role, content: msg.content }))
      );
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      // Handle error case
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Lo siento, he tenido un problema al procesar tu pregunta. ¿Podrías intentarlo de nuevo?'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-neutral-200 rounded-lg min-h-[250px] flex flex-col">
      {/* Chat messages */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[300px]">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex items-start ${
              message.role === 'user' ? 'justify-end' : ''
            }`}
          >
            <div className={`${
              message.role === 'user' 
                ? 'bg-neutral-100 rounded-lg p-3 mr-2' 
                : 'bg-primary bg-opacity-10 rounded-lg p-3 ml-2'
            } max-w-[80%]`}>
              <p className="text-neutral-800">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start">
            <div className="bg-primary bg-opacity-10 rounded-lg p-3 ml-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef}></div>
      </div>
      
      {/* Chat input */}
      <div className="p-4 border-t border-neutral-200">
        <form onSubmit={handleSendMessage} className="flex">
          <Input
            type="text"
            placeholder="Escribe tu pregunta aquí..."
            className="flex-1 rounded-r-none border-r-0 focus-visible:ring-1 focus-visible:ring-primary"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="px-4 py-2 bg-primary text-white rounded-l-none hover:bg-primary/90"
            disabled={isLoading}
          >
            <FaPaperPlane />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant;
