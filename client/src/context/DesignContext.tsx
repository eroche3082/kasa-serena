import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { analyzeImage, generateDesignSuggestions } from '@/lib/gemini';
import { useToast } from '@/hooks/use-toast';

interface DesignContextType {
  projectType: string;
  setProjectType: (type: string) => void;
  uploadedImage: File | null;
  imagePreview: string | null;
  uploadImage: (file: File) => Promise<void>;
  clearImage: () => void;
  isAnalyzing: boolean;
  analysisResult: any;
  analyzeCurrentImage: () => Promise<void>;
  selectedMaterials: Record<string, any>;
  selectedColors: Record<string, any>;
  selectedFinishes: Record<string, any>;
  selectMaterial: (category: string, material: any) => void;
  selectColor: (category: string, color: any) => void;
  selectFinish: (category: string, finish: any) => void;
  estimatedCost: number | null;
  estimatedTime: string | null;
  materialsList: any[];
  designSuggestions: string[];
  generateCostEstimate: () => Promise<void>;
  saveCurrentDesign: (name: string, description?: string) => Promise<boolean>;
}

const DesignContext = createContext<DesignContextType>({} as DesignContextType);

export const useDesign = () => useContext(DesignContext);

export const DesignProvider = ({ children }: { children: ReactNode }) => {
  const [projectType, setProjectType] = useState<string>('cocina');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, any>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, any>>({});
  const [selectedFinishes, setSelectedFinishes] = useState<Record<string, any>>({});
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
  const [materialsList, setMaterialsList] = useState<any[]>([]);
  const [designSuggestions, setDesignSuggestions] = useState<string[]>([]);
  
  const { toast } = useToast();

  const uploadImage = useCallback(async (file: File) => {
    try {
      setUploadedImage(file);
      
      // Create preview URL for the uploaded image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      toast({
        title: "Imagen cargada",
        description: "La imagen se ha cargado correctamente",
      });
      
      return previewUrl;
    } catch (error) {
      toast({
        title: "Error al cargar la imagen",
        description: "No se pudo procesar la imagen",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const clearImage = useCallback(() => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    
    setUploadedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
  }, [imagePreview]);

  const analyzeCurrentImage = useCallback(async () => {
    if (!uploadedImage) {
      toast({
        title: "No hay imagen",
        description: "Por favor, carga una imagen primero",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsAnalyzing(true);
      
      // Analyze the image using Gemini API
      const result = await analyzeImage(uploadedImage, projectType);
      setAnalysisResult(result);
      
      // Set data from analysis
      setEstimatedCost(result.estimatedCost);
      setEstimatedTime(result.estimatedTime);
      
      if (result.materialRecommendations) {
        setMaterialsList(result.materialRecommendations);
      }
      
      if (result.designSuggestions) {
        setDesignSuggestions(result.designSuggestions);
      }
      
      toast({
        title: "Análisis completado",
        description: "La IA ha analizado tu imagen correctamente",
      });
    } catch (error) {
      toast({
        title: "Error en el análisis",
        description: "No se pudo analizar la imagen",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [uploadedImage, projectType, toast]);

  const selectMaterial = useCallback((category: string, material: any) => {
    setSelectedMaterials(prev => ({
      ...prev,
      [category]: material
    }));
  }, []);

  const selectColor = useCallback((category: string, color: any) => {
    setSelectedColors(prev => ({
      ...prev,
      [category]: color
    }));
  }, []);

  const selectFinish = useCallback((category: string, finish: any) => {
    setSelectedFinishes(prev => ({
      ...prev,
      [category]: finish
    }));
  }, []);

  const generateCostEstimate = useCallback(async () => {
    try {
      // Normally this would be calculated based on selections
      // For now, we'll use a simplified model
      
      let baseCost = 0;
      
      if (projectType === 'cocina') {
        baseCost = 4500;
      } else if (projectType === 'puerta') {
        baseCost = 1200;
      } else if (projectType === 'ventana') {
        baseCost = 800;
      } else if (projectType === 'gabinete') {
        baseCost = 2500;
      }
      
      // Add costs for premium materials/finishes
      let materialMultiplier = 1.0;
      const selectedMaterialKeys = Object.keys(selectedMaterials);
      if (selectedMaterialKeys.length > 0) {
        if (selectedMaterials[selectedMaterialKeys[0]]?.premium) {
          materialMultiplier = 1.2;
        }
      }
      
      const finalCost = Math.round(baseCost * materialMultiplier);
      setEstimatedCost(finalCost);
      
      // Set estimated time based on project type
      if (projectType === 'cocina') {
        setEstimatedTime('3-4 semanas');
      } else if (projectType === 'puerta' || projectType === 'gabinete') {
        setEstimatedTime('2-3 semanas');
      } else if (projectType === 'ventana') {
        setEstimatedTime('1-2 semanas');
      }
      
      // Generate design suggestions if not yet present
      if (designSuggestions.length === 0) {
        const suggestions = await generateDesignSuggestions(projectType);
        setDesignSuggestions(suggestions);
      }
      
      return {
        cost: finalCost,
        time: estimatedTime
      };
    } catch (error) {
      toast({
        title: "Error en la estimación",
        description: "No se pudo generar la estimación de costos",
        variant: "destructive",
      });
      throw error;
    }
  }, [projectType, selectedMaterials, estimatedTime, designSuggestions, toast]);

  const saveCurrentDesign = useCallback(async (name: string, description?: string) => {
    try {
      // This would normally save to backend
      // Create a project in the backend
      const project = {
        name,
        description: description || `Proyecto de ${projectType}`,
        type: projectType,
        status: 'draft',
        imageUrl: imagePreview || ''
      };
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(project),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to save project');
      }
      
      toast({
        title: "Proyecto guardado",
        description: "Tu diseño se ha guardado correctamente",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar el proyecto",
        variant: "destructive",
      });
      return false;
    }
  }, [projectType, imagePreview, toast]);

  return (
    <DesignContext.Provider
      value={{
        projectType,
        setProjectType,
        uploadedImage,
        imagePreview,
        uploadImage,
        clearImage,
        isAnalyzing,
        analysisResult,
        analyzeCurrentImage,
        selectedMaterials,
        selectedColors,
        selectedFinishes,
        selectMaterial,
        selectColor,
        selectFinish,
        estimatedCost,
        estimatedTime,
        materialsList,
        designSuggestions,
        generateCostEstimate,
        saveCurrentDesign
      }}
    >
      {children}
    </DesignContext.Provider>
  );
};
