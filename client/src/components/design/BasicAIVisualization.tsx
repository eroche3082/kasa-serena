import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaImage, FaInfoCircle, FaEye, FaPaintBrush, FaCalculator, FaSave } from 'react-icons/fa';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/context/AuthContext';
import { useDesign } from '@/context/DesignContext';

interface AIVisualizationProps {
  onSave?: (analysis: any) => void;
}

const BasicAIVisualization = ({ onSave }: AIVisualizationProps) => {
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
      
      // Simular llamada a API para demo
      setTimeout(() => {
        // URL de imagen de ejemplo
        setPreviewImage("https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80");
        
        toast({
          title: "Previsualización generada",
          description: "La IA ha generado una visualización basada en tu diseño",
        });
        setGeneratingPreview(false);
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error generando la previsualización",
        variant: "destructive",
      });
      setGeneratingPreview(false);
    }
  };
  
  return (
    <Card className="border-neutral-200 shadow-sm">
      <CardContent className="p-4">
        <div className="grid gap-6">
          <div>
            <h2 className="text-2xl font-['Didonesque'] mb-4">Visualización de IA</h2>
            <p className="mb-6 text-neutral-600">
              Utiliza la potencia de la inteligencia artificial para analizar tu diseño, 
              recibir recomendaciones personalizadas y visualizar posibles resultados.
            </p>
            
            {isAnalyzing ? (
              <div className="text-center p-8 border rounded-lg bg-neutral-50">
                <div className="animate-spin w-10 h-10 border-4 border-neutral-300 border-t-neutral-600 rounded-full mx-auto mb-4"></div>
                <p className="text-neutral-600">
                  Analizando tu imagen... Esto puede tomar unos momentos.
                </p>
              </div>
            ) : !analysisResult ? (
              <div className="text-center p-8 border rounded-lg bg-neutral-50">
                <FaInfoCircle className="text-4xl text-neutral-400 mx-auto mb-4" />
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
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Imagen Original</h3>
                    {imagePreview && (
                      <div className="border rounded-lg overflow-hidden">
                        <img 
                          src={imagePreview} 
                          alt="Imagen original" 
                          className="w-full h-auto"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Visualización AI</h3>
                    {generatingPreview ? (
                      <div className="h-64 border rounded-lg bg-neutral-50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin w-10 h-10 border-4 border-neutral-300 border-t-neutral-600 rounded-full mx-auto mb-4"></div>
                          <p className="text-neutral-600">Generando visualización...</p>
                        </div>
                      </div>
                    ) : previewImage ? (
                      <div className="border rounded-lg overflow-hidden">
                        <img 
                          src={previewImage} 
                          alt="Previsualización generada por IA" 
                          className="w-full h-auto"
                        />
                      </div>
                    ) : (
                      <div className="h-64 border rounded-lg bg-neutral-50 flex items-center justify-center">
                        <div className="text-center p-4">
                          <FaImage className="text-4xl text-neutral-400 mx-auto mb-4" />
                          <p className="text-neutral-600 mb-4">
                            Genera una visualización de IA basada en tu imagen
                          </p>
                          <Button 
                            onClick={handleGeneratePreview}
                            className="bg-neutral-700 hover:bg-neutral-800"
                          >
                            <FaEye className="mr-2" /> Generar visualización
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Análisis de diseño</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg bg-neutral-50">
                      <h4 className="font-medium mb-2">Estilo detectado</h4>
                      <p>{analysisResult.style || "Estilo moderno"}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-neutral-50">
                      <h4 className="font-medium mb-2">Materiales</h4>
                      <ul className="list-disc pl-5">
                        {(analysisResult.materialRecommendations || []).slice(0, 3).map((material: any, index: number) => (
                          <li key={index}>{material.name || material}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg bg-neutral-50">
                      <h4 className="font-medium mb-2">Estimación</h4>
                      <p>{analysisResult.estimatedCost ? `$${analysisResult.estimatedCost}` : "Pendiente"}</p>
                      <p className="text-sm text-neutral-500">{analysisResult.estimatedTime || "3-4 semanas"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    onClick={handleGeneratePreview}
                    variant="outline"
                  >
                    <FaPaintBrush className="mr-2" /> Generar nueva visualización
                  </Button>
                  
                  {isAuthenticated && previewImage && (
                    <Button 
                      onClick={() => onSave && onSave({ ...analysisResult, previewImage })}
                      className="bg-neutral-700 hover:bg-neutral-800"
                    >
                      <FaSave className="mr-2" /> Guardar diseño
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicAIVisualization;