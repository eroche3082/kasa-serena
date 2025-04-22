import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromptDesignGenerator from '@/components/design/PromptDesignGenerator';
import ChatDesignGenerator from '@/components/design/ChatDesignGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AIDesignPage = () => {
  const [activeTab, setActiveTab] = useState('prompt');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Generador de Diseños con IA</h1>
        <p className="text-muted-foreground mt-2">
          Crea diseños personalizados utilizando nuestra avanzada inteligencia artificial
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="prompt">Generador por Prompt</TabsTrigger>
            <TabsTrigger value="chat">Asistente de Diseño</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="prompt" className="mt-4">
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center pb-2">
              <CardTitle>Diseño por Descripción Textual</CardTitle>
              <CardDescription>
                Describe en detalle el diseño que deseas y nuestra IA lo generará para ti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PromptDesignGenerator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="mt-4">
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center pb-2">
              <CardTitle>Asistente Interactivo de Diseño</CardTitle>
              <CardDescription>
                Conversa con nuestro asistente que te guiará paso a paso en la creación de tu diseño personalizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChatDesignGenerator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIDesignPage;