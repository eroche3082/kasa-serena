import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { 
  FaCloudUploadAlt, 
  FaMagic, 
  FaRobot,
  FaPaperPlane,
  FaChevronRight
} from 'react-icons/fa';
import { MdTune } from 'react-icons/md';
import ImageUploader from '@/components/design/ImageUploader';
import AIVisualization from '@/components/design/AIVisualization';
import SelectionPanel from '@/components/design/SelectionPanel';
import ChatAssistant from '@/components/design/ChatAssistant';

const DesignToolsSection = () => {
  const [activeCategory, setActiveCategory] = useState("cocinas");

  return (
    <section id="empezar" className="py-16 md:py-24 bg-gradient-to-b from-neutral-100 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold mb-4">
            Herramientas de diseño inteligente
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Nuestra plataforma combina tecnología de IA con tu visión para crear el espacio perfecto.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image uploader tool */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <h3 className="font-['Playfair_Display'] text-2xl font-bold flex items-center">
                <FaCloudUploadAlt className="text-primary mr-3" />
                Carga tu espacio
              </h3>
              <p className="text-neutral-600 mt-2">
                Sube fotos de tu espacio actual y nuestra IA analizará las dimensiones y características.
              </p>
            </div>
            
            <div className="p-6">
              <ImageUploader />
            </div>
          </div>
          
          {/* AI visualization */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <h3 className="font-['Playfair_Display'] text-2xl font-bold flex items-center">
                <FaMagic className="text-primary mr-3" />
                Visualiza tu transformación
              </h3>
              <p className="text-neutral-600 mt-2">
                La IA generará recomendaciones y una visualización en tiempo real de tu nuevo espacio.
              </p>
            </div>
            
            <div className="p-6">
              <AIVisualization />
            </div>
          </div>
        </div>
        
        {/* Interactive selection panel */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="p-6 border-b border-neutral-200">
            <h3 className="font-['Playfair_Display'] text-2xl font-bold flex items-center">
              <MdTune className="text-primary mr-3" />
              Panel de selección interactivo
            </h3>
            <p className="text-neutral-600 mt-2">
              Personaliza cada aspecto de tu diseño con nuestras opciones de materiales, colores y acabados.
            </p>
          </div>
          
          <div className="p-6">
            <SelectionPanel />
          </div>
        </div>
        
        {/* AI Assistant chatbot */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <h3 className="font-['Playfair_Display'] text-2xl font-bold flex items-center">
              <FaRobot className="text-primary mr-3" />
              Asistente virtual de diseño
            </h3>
            <p className="text-neutral-600 mt-2">
              Nuestro asistente de IA responderá tus preguntas sobre materiales, estilos y opciones.
            </p>
          </div>
          
          <div className="p-6">
            <ChatAssistant />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignToolsSection;
