import React from 'react';
import { Container } from '@/components/ui/container';
import { SEO } from '@/components/ui/seo';
import InspirationChatbot from '@/features/inspiration-chat/InspirationChatbot';

const InspirationChatPage: React.FC = () => {
  return (
    <div className="py-8">
      <SEO 
        title="Chat de Inspiración para Diseños"
        description="Consulta con nuestro asistente virtual para obtener ideas, inspiración y consejos para tus proyectos de diseño arquitectónico."
        keywords={['chat', 'inspiración', 'diseño', 'arquitectura', 'IA', 'asistente virtual']}
      />
      <Container>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold mb-4">Asistente de Inspiración para Diseños</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conversa con nuestro asistente virtual para recibir ideas, consejos y recomendaciones personalizadas para tus proyectos de diseño.
            También puedes subir imágenes para análisis y buscar inspiración en nuestra galería.
          </p>
        </div>
        
        <InspirationChatbot />

        <div className="mt-12 px-6 py-4 bg-muted rounded-md">
          <h3 className="text-lg font-medium mb-2">¿Cómo funciona?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Nuestro asistente de inspiración utiliza inteligencia artificial para ayudarte a:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
            <li>Sugerir materiales, estilos y acabados basados en tus preferencias</li>
            <li>Analizar imágenes de referencia y extraer características de diseño clave</li>
            <li>Mostrar inspiraciones relacionadas con tus consultas</li>
            <li>Responder preguntas técnicas sobre diferentes aspectos de diseño arquitectónico</li>
            <li>Generar ideas personalizadas para tus espacios</li>
          </ul>
        </div>
      </Container>
    </div>
  );
};

export default InspirationChatPage;