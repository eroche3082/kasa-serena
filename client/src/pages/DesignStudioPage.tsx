import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useDesign } from '@/context/DesignContext';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { 
  FaCloudUploadAlt, 
  FaMagic, 
  FaEdit, 
  FaCoins, 
  FaCalendarAlt, 
  FaClipboardList, 
  FaSave,
  FaArrowLeft,
  FaRobot
} from 'react-icons/fa';
import ImageUploader from '@/components/design/ImageUploader';
import AIVisualization from '@/components/design/AIVisualization';
import SelectionPanel from '@/components/design/SelectionPanel';
import ChatAssistant from '@/components/design/ChatAssistant';

const DesignStudioPage = () => {
  const [location, setLocation] = useLocation();
  const { 
    projectType, 
    setProjectType, 
    uploadedImage,
    imagePreview,
    analyzeCurrentImage,
    isAnalyzing,
    analysisResult,
    estimatedCost,
    estimatedTime,
    materialsList,
    designSuggestions,
    generateCostEstimate,
    saveCurrentDesign
  } = useDesign();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  const [activeStep, setActiveStep] = useState<string>('upload');
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState<boolean>(false);
  
  // Check URL for project type parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type');
    
    if (typeParam && ['cocina', 'puerta', 'ventana', 'gabinete'].includes(typeParam)) {
      setProjectType(typeParam);
    }
  }, [setProjectType]);
  
  // Automatically advance to next step when analysis is complete
  useEffect(() => {
    if (analysisResult && activeStep === 'upload') {
      setActiveStep('design');
    }
  }, [analysisResult, activeStep]);
  
  // Auto-generate cost estimate if we have analysis and are on the costing step
  useEffect(() => {
    if (analysisResult && activeStep === 'costing' && estimatedCost === null) {
      generateCostEstimate();
    }
  }, [activeStep, analysisResult, estimatedCost, generateCostEstimate]);
  
  const handleSaveProject = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión para guardar",
        description: "Necesitas iniciar sesión para guardar tu proyecto",
        variant: "destructive",
      });
      setLocation('/login');
      return;
    }
    
    if (!projectName) {
      toast({
        title: "Nombre requerido",
        description: "Por favor, ingresa un nombre para tu proyecto",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const success = await saveCurrentDesign(projectName, projectDescription);
      
      if (success) {
        setIsSaveDialogOpen(false);
        toast({
          title: "Proyecto guardado",
          description: "Tu proyecto ha sido guardado exitosamente",
        });
        
        // Redirect to profile page after short delay
        setTimeout(() => {
          setLocation('/profile');
        }, 1500);
      }
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar el proyecto",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold mb-2">
              Estudio de Diseño
            </h1>
            <p className="text-neutral-600">
              Diseña tu espacio personalizado con nuestra plataforma interactiva de diseño inteligente
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setLocation('/')}
              className="flex items-center gap-2"
            >
              <FaArrowLeft className="text-sm" /> Volver al inicio
            </Button>
            
            {uploadedImage && (
              <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2">
                    <FaSave /> Guardar proyecto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Guardar proyecto</DialogTitle>
                    <DialogDescription>
                      Ingresa un nombre y descripción para guardar tu proyecto de diseño.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-name">Nombre del proyecto</Label>
                      <Input 
                        id="project-name" 
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="ej. Cocina Casa Marina"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="project-description">Descripción (opcional)</Label>
                      <Textarea 
                        id="project-description"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="Describe brevemente tu proyecto..."
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsSaveDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleSaveProject}
                      className="bg-primary hover:bg-primary/90 text-white"
                      disabled={isSaving}
                    >
                      {isSaving ? "Guardando..." : "Guardar proyecto"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar - Steps */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Pasos de diseño</CardTitle>
                <CardDescription>
                  Sigue estos pasos para completar tu proyecto
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="space-y-1">
                  <li>
                    <Button 
                      variant={activeStep === 'upload' ? 'default' : 'ghost'} 
                      className={`w-full justify-start text-left h-auto py-3 px-4 ${
                        activeStep === 'upload' ? 'bg-primary text-white' : ''
                      }`}
                      onClick={() => setActiveStep('upload')}
                    >
                      <FaCloudUploadAlt className="mr-2" />
                      <div>
                        <div className="font-medium">1. Carga tu espacio</div>
                        <div className="text-xs opacity-90">Sube una foto de tu espacio actual</div>
                      </div>
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant={activeStep === 'design' ? 'default' : 'ghost'} 
                      className={`w-full justify-start text-left h-auto py-3 px-4 ${
                        activeStep === 'design' ? 'bg-primary text-white' : ''
                      }`}
                      onClick={() => {
                        if (uploadedImage) setActiveStep('design');
                      }}
                      disabled={!uploadedImage}
                    >
                      <FaEdit className="mr-2" />
                      <div>
                        <div className="font-medium">2. Personaliza tu diseño</div>
                        <div className="text-xs opacity-90">Selecciona materiales, colores y acabados</div>
                      </div>
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant={activeStep === 'costing' ? 'default' : 'ghost'} 
                      className={`w-full justify-start text-left h-auto py-3 px-4 ${
                        activeStep === 'costing' ? 'bg-primary text-white' : ''
                      }`}
                      onClick={() => {
                        if (uploadedImage) setActiveStep('costing');
                      }}
                      disabled={!uploadedImage}
                    >
                      <FaCoins className="mr-2" />
                      <div>
                        <div className="font-medium">3. Revisa tu estimación</div>
                        <div className="text-xs opacity-90">Costos, tiempo y materiales requeridos</div>
                      </div>
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant={activeStep === 'assistant' ? 'default' : 'ghost'} 
                      className={`w-full justify-start text-left h-auto py-3 px-4 ${
                        activeStep === 'assistant' ? 'bg-primary text-white' : ''
                      }`}
                      onClick={() => setActiveStep('assistant')}
                    >
                      <FaRobot className="mr-2" />
                      <div>
                        <div className="font-medium">4. Asistente virtual</div>
                        <div className="text-xs opacity-90">Resuelve tus dudas con nuestro asistente IA</div>
                      </div>
                    </Button>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Project info card - shown when an image is uploaded */}
            {uploadedImage && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Tu proyecto</CardTitle>
                  <CardDescription>
                    {projectType === 'cocina' && 'Diseño de cocina personalizada'}
                    {projectType === 'puerta' && 'Diseño de puerta personalizada'}
                    {projectType === 'ventana' && 'Diseño de ventana personalizada'}
                    {projectType === 'gabinete' && 'Diseño de gabinete personalizado'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {imagePreview && (
                    <div className="mb-4">
                      <img 
                        src={imagePreview} 
                        alt="Imagen del proyecto" 
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  )}
                  
                  {estimatedCost && (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Costo estimado:</span>
                        <span className="font-medium">${estimatedCost.toLocaleString()}</span>
                      </div>
                      
                      {estimatedTime && (
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Tiempo estimado:</span>
                          <span className="font-medium">{estimatedTime}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Tipo de proyecto:</span>
                        <span className="font-medium capitalize">{projectType}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeStep === 'upload' && 'Carga y análisis de imagen'}
                  {activeStep === 'design' && 'Personaliza tu diseño'}
                  {activeStep === 'costing' && 'Estimación de costos y materiales'}
                  {activeStep === 'assistant' && 'Asistente virtual de diseño'}
                </CardTitle>
                <CardDescription>
                  {activeStep === 'upload' && 'Sube una foto de tu espacio para que nuestra IA la analice'}
                  {activeStep === 'design' && 'Selecciona los materiales, colores y acabados que prefieras'}
                  {activeStep === 'costing' && 'Revisa los costos estimados, tiempos de entrega y materiales requeridos'}
                  {activeStep === 'assistant' && 'Realiza preguntas sobre tu diseño, materiales o proceso de instalación'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Upload and Analysis Step */}
                {activeStep === 'upload' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <FaCloudUploadAlt className="text-primary mr-2" /> 
                        Carga tu imagen
                      </h3>
                      <ImageUploader />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <FaMagic className="text-primary mr-2" /> 
                        Visualización
                      </h3>
                      <AIVisualization />
                      
                      {uploadedImage && !isAnalyzing && !analysisResult && (
                        <div className="mt-4">
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90 text-white"
                            onClick={analyzeCurrentImage}
                          >
                            Analizar imagen con IA
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Design Step */}
                {activeStep === 'design' && (
                  <div>
                    <SelectionPanel />
                    
                    <div className="mt-6 flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => setActiveStep('upload')}
                      >
                        Anterior
                      </Button>
                      <Button 
                        className="bg-primary hover:bg-primary/90 text-white"
                        onClick={() => setActiveStep('costing')}
                      >
                        Continuar
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Costing Step */}
                {activeStep === 'costing' && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {/* Cost card */}
                      <div className="bg-neutral-100 rounded-xl p-6">
                        <div className="text-primary text-3xl mb-4">
                          <FaCoins />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Costo estimado</h3>
                        <div className="text-3xl font-bold mb-2 font-['Playfair_Display']">
                          ${estimatedCost ? estimatedCost.toLocaleString() : '---'}
                        </div>
                        <p className="text-neutral-600 text-sm">
                          Basado en tus selecciones actuales
                        </p>
                      </div>
                      
                      {/* Time card */}
                      <div className="bg-neutral-100 rounded-xl p-6">
                        <div className="text-primary text-3xl mb-4">
                          <FaCalendarAlt />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Tiempo de entrega</h3>
                        <div className="text-3xl font-bold mb-2 font-['Playfair_Display']">
                          {estimatedTime || '---'}
                        </div>
                        <p className="text-neutral-600 text-sm">
                          Incluye fabricación e instalación
                        </p>
                      </div>
                      
                      {/* Materials card */}
                      <div className="bg-neutral-100 rounded-xl p-6">
                        <div className="text-primary text-3xl mb-4">
                          <FaClipboardList />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Materiales requeridos</h3>
                        {materialsList && materialsList.length > 0 ? (
                          <ul className="text-neutral-600 space-y-1 text-sm">
                            {materialsList.map((material, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span>
                                  {material.area 
                                    ? `${material.name} (${material.area})` 
                                    : material.quantity 
                                      ? `${material.name} (${material.quantity} unidades)` 
                                      : material.name}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-neutral-600 text-sm">
                            Genera una estimación para ver los materiales
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {designSuggestions && designSuggestions.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-xl font-bold mb-4">Sugerencias de diseño</h3>
                        <ul className="space-y-2">
                          {designSuggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start bg-neutral-50 p-3 rounded-lg">
                              <span className="text-primary text-lg mr-2">•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="mt-6 flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => setActiveStep('design')}
                      >
                        Anterior
                      </Button>
                      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-primary hover:bg-primary/90 text-white">
                            Guardar proyecto
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </div>
                  </div>
                )}
                
                {/* Assistant Step */}
                {activeStep === 'assistant' && (
                  <div>
                    <p className="mb-4 text-neutral-600">
                      Nuestro asistente virtual puede responder tus preguntas sobre materiales, medidas, diseño o cualquier duda que tengas sobre tu proyecto.
                    </p>
                    
                    <ChatAssistant />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DesignStudioPage;
