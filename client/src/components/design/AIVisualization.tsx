import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Componentes simples para reemplazar los que faltan
const Separator = () => <hr className="my-4 border-t border-neutral-200" />;
const Badge = ({ children, variant, className }: any) => (
  <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
    variant === 'secondary' ? 'bg-neutral-100 text-neutral-800' : 'bg-neutral-800 text-white'
  } ${className}`}>
    {children}
  </span>
);
const Progress = ({ value, className }: any) => (
  <div className={`w-full bg-neutral-200 rounded-full h-2.5 ${className}`}>
    <div className="bg-neutral-600 h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
  </div>
);
import { FaImage, FaInfoCircle, FaEye, FaPaintBrush, FaCalculator, FaSave } from 'react-icons/fa';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/context/AuthContext';
import { useDesign } from '@/context/DesignContext';

interface AIVisualizationProps {
  onSave?: (analysis: any) => void;
}

const AIVisualization = ({ onSave }: AIVisualizationProps) => {
  const { isAuthenticated } = useAuth();
  const { 
    projectType, 
    uploadedImage, 
    imagePreview,
    isAnalyzing,
    analysisResult,
    analyzeCurrentImage
  } = useDesign();
  
  const [activeTab, setActiveTab] = useState('analysis');
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [estimatingCost, setEstimatingCost] = useState(false);
  const [costEstimate, setCostEstimate] = useState<any>(null);
  
  const { toast } = useToast();

  const handleGeneratePreview = async () => {
    if (!analysisResult) {
      toast({
        title: "Análisis requerido",
        description: "Primero debes analizar una imagen para generar una previsualización",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setGeneratingPreview(true);
      setPreviewImage(null);
      
      const response = await apiRequest("POST", "/api/generate-preview", {
        description: analysisResult.description,
        style: analysisResult.style,
        materials: analysisResult.materialRecommendations.map((item: any) => item.name),
        projectType
      });
      
      if (!response.ok) {
        throw new Error("Error generando la previsualización");
      }
      
      const data = await response.json();
      setPreviewImage(data.imageUrl);
      
      toast({
        title: "Previsualización generada",
        description: "La IA ha generado una visualización basada en tu diseño",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error generando la previsualización",
        variant: "destructive",
      });
    } finally {
      setGeneratingPreview(false);
    }
  };
  
  const handleEstimateCost = async () => {
    if (!analysisResult) {
      toast({
        title: "Análisis requerido",
        description: "Primero debes analizar una imagen para estimar los costos",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setEstimatingCost(true);
      setCostEstimate(null);
      
      const response = await apiRequest("POST", "/api/estimate-cost", {
        projectType,
        materials: analysisResult.materialRecommendations.map((item: any) => item.name),
        size: "Medio" // Por defecto
      });
      
      if (!response.ok) {
        throw new Error("Error estimando los costos");
      }
      
      const data = await response.json();
      setCostEstimate(data);
      
      toast({
        title: "Estimación completada",
        description: "Se ha generado una estimación de costos para tu proyecto",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error estimando los costos",
        variant: "destructive",
      });
    } finally {
      setEstimatingCost(false);
    }
  };
  
  const renderAnalysisTab = () => {
    if (isAnalyzing) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Progress value={45} className="w-full mb-4" />
          <p className="text-neutral-600">
            Analizando tu imagen... Esto puede tomar unos momentos.
          </p>
        </div>
      );
    }
    
    if (!analysisResult) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FaInfoCircle className="text-4xl text-neutral-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No hay análisis disponible</h3>
          <p className="text-neutral-600 mb-4">
            Sube una imagen y haz clic en "Analizar" para obtener recomendaciones de diseño.
          </p>
          {uploadedImage && (
            <Button 
              onClick={() => analyzeCurrentImage()}
              disabled={!uploadedImage}
              className="bg-neutral-700 hover:bg-neutral-800"
            >
              Analizar imagen
            </Button>
          )}
        </div>
      );
    }
    
    return (
      <div className="space-y-6 p-1">
        <div>
          <h3 className="text-lg font-medium mb-2">Descripción</h3>
          <p className="text-neutral-600">{analysisResult.description}</p>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-2">Estilo identificado</h3>
          <Badge variant="secondary" className="text-base py-1 px-3">
            {analysisResult.style}
          </Badge>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-2">Materiales recomendados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {analysisResult.materialRecommendations.map((material: any, index: number) => (
              <div key={index} className="bg-neutral-100 p-2 rounded">
                {material.name} {material.area && `(${material.area})`}
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-2">Sugerencias de diseño</h3>
          <ul className="list-disc pl-5 space-y-1">
            {analysisResult.designSuggestions.map((suggestion: string, index: number) => (
              <li key={index} className="text-neutral-600">{suggestion}</li>
            ))}
          </ul>
        </div>
        
        <Separator />
        
        <div className="flex space-x-4">
          <Button 
            onClick={handleGeneratePreview}
            className="bg-neutral-700 hover:bg-neutral-800"
          >
            <FaEye className="mr-2" /> Generar previsualización
          </Button>
          
          <Button 
            onClick={handleEstimateCost}
            variant="outline"
          >
            <FaCalculator className="mr-2" /> Estimar costos
          </Button>
        </div>
      </div>
    );
  };
  
  const renderVisualizationTab = () => {
    if (generatingPreview) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Progress value={60} className="w-full mb-4" />
          <p className="text-neutral-600">
            Generando previsualización... Esto puede tomar hasta un minuto.
          </p>
        </div>
      );
    }
    
    if (!previewImage) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FaImage className="text-4xl text-neutral-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No hay previsualización disponible</h3>
          <p className="text-neutral-600 mb-4">
            Genera una previsualización para ver cómo podría quedar tu diseño.
          </p>
          {analysisResult && (
            <Button 
              onClick={handleGeneratePreview}
              className="bg-neutral-700 hover:bg-neutral-800"
            >
              <FaEye className="mr-2" /> Generar previsualización
            </Button>
          )}
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="border rounded-lg overflow-hidden">
          <img 
            src={previewImage} 
            alt="Previsualización generada por IA" 
            className="w-full h-auto"
          />
        </div>
        
        <div className="flex justify-between">
          <Button 
            onClick={handleGeneratePreview}
            variant="outline"
          >
            <FaPaintBrush className="mr-2" /> Generar otra versión
          </Button>
          
          {isAuthenticated && (
            <Button 
              onClick={() => onSave && onSave({ ...analysisResult, previewImage })}
              className="bg-neutral-700 hover:bg-neutral-800"
            >
              <FaSave className="mr-2" /> Guardar diseño
            </Button>
          )}
        </div>
      </div>
    );
  };
  
  const renderCostTab = () => {
    if (estimatingCost) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Progress value={70} className="w-full mb-4" />
          <p className="text-neutral-600">
            Calculando estimación de costos... Esto tomará un momento.
          </p>
        </div>
      );
    }
    
    if (!costEstimate) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FaCalculator className="text-4xl text-neutral-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No hay estimación disponible</h3>
          <p className="text-neutral-600 mb-4">
            Genera una estimación de costos para tu proyecto.
          </p>
          {analysisResult && (
            <Button 
              onClick={handleEstimateCost}
              className="bg-neutral-700 hover:bg-neutral-800"
            >
              <FaCalculator className="mr-2" /> Estimar costos
            </Button>
          )}
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="bg-neutral-100 p-4 rounded-lg">
          <h3 className="text-xl font-['Didonesque'] mb-4 text-center">Estimación de Costos</h3>
          
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <span className="font-medium">Rango de costo estimado:</span>
            <span className="text-xl font-semibold">
              ${costEstimate.estimatedCost.min} - ${costEstimate.estimatedCost.max}
            </span>
          </div>
          
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <span className="font-medium">Tiempo de ejecución:</span>
            <span className="font-semibold">{costEstimate.timeFrame}</span>
          </div>
          
          <h4 className="text-lg font-medium mb-3">Desglose de costos:</h4>
          <div className="space-y-2">
            {Object.entries(costEstimate.breakdown).map(([category, value]: [string, any]) => (
              <div key={category} className="flex justify-between">
                <span>{category}:</span>
                <span>${value}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-600">
            <FaInfoCircle className="inline-block mr-2" />
            Esta es una estimación aproximada basada en los materiales y dimensiones identificados.
            Los precios reales pueden variar según disponibilidad, calidad y otros factores.
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="border-neutral-200 shadow-sm">
      <CardContent className="p-0">
        <Tabs 
          defaultValue="analysis" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="border-b">
            <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0">
              <TabsTrigger 
                value="analysis"
                className="data-[state=active]:border-b-2 data-[state=active]:border-neutral-800 data-[state=active]:shadow-none rounded-none px-4 py-3 font-medium"
              >
                Análisis
              </TabsTrigger>
              <TabsTrigger 
                value="visualization"
                className="data-[state=active]:border-b-2 data-[state=active]:border-neutral-800 data-[state=active]:shadow-none rounded-none px-4 py-3 font-medium"
              >
                Visualización
              </TabsTrigger>
              <TabsTrigger 
                value="cost"
                className="data-[state=active]:border-b-2 data-[state=active]:border-neutral-800 data-[state=active]:shadow-none rounded-none px-4 py-3 font-medium"
              >
                Costos
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="analysis" className="p-4 focus-visible:outline-none focus-visible:ring-0">
            {renderAnalysisTab()}
          </TabsContent>
          
          <TabsContent value="visualization" className="p-4 focus-visible:outline-none focus-visible:ring-0">
            {renderVisualizationTab()}
          </TabsContent>
          
          <TabsContent value="cost" className="p-4 focus-visible:outline-none focus-visible:ring-0">
            {renderCostTab()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIVisualization;