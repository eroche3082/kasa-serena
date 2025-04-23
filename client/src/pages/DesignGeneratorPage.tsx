import { useState } from 'react';
import { DesignGenerator, PromptDesignGenerator, ChatDesignGenerator } from '@/features/ai-generator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function DesignGeneratorPage() {
  const [activeTab, setActiveTab] = useState("parameters");

  return (
    <main className="min-h-screen bg-neutral-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-['Didonesque'] text-4xl md:text-5xl font-light mb-6 tracking-wide uppercase">
              Generador de Diseño Visual
            </h1>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto font-['Poppins']">
              Crea diseños personalizados para tus proyectos de Kasa Serena. Simplemente ingresa tus preferencias y nuestra IA generará visualizaciones y especificaciones detalladas.
            </p>
          </div>
          
          <Card className="p-6 bg-white shadow-sm">
            <Tabs defaultValue="parameters" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="parameters" className="flex-1">Generación por Parámetros</TabsTrigger>
                <TabsTrigger value="conversation" className="flex-1">Asistente Conversacional</TabsTrigger>
              </TabsList>
              
              <TabsContent value="parameters" className="mt-0">
                <DesignGenerator />
              </TabsContent>
              
              <TabsContent value="conversation" className="mt-0">
                <ChatDesignGenerator />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </main>
  );
}