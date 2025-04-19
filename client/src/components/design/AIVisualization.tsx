import { useEffect, useState } from 'react';
import { FaWandMagicSparkles, FaSpinner } from 'react-icons/fa6';
import { useDesign } from '@/context/DesignContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AIVisualization = () => {
  const { 
    imagePreview, 
    analysisResult, 
    isAnalyzing, 
    analyzeCurrentImage,
    designSuggestions
  } = useDesign();
  
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Function to simulate visualization generation
  const generateVisualization = async () => {
    if (!imagePreview || isGenerating) return;
    
    setIsGenerating(true);
    
    // In a real implementation, this would call the AI to generate visualization
    // For now we'll just simulate a delay
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };
  
  useEffect(() => {
    // If we have an analysis result but haven't generated visualization yet
    if (analysisResult && !isGenerating) {
      generateVisualization();
    }
  }, [analysisResult]);

  return (
    <div>
      {!imagePreview ? (
        <div className="flex justify-center items-center bg-neutral-200 rounded-lg" style={{ height: '240px' }}>
          <div className="text-center text-neutral-500">
            <FaWandMagicSparkles className="text-5xl mb-3 mx-auto" />
            <p>Sube una foto para ver la visualización</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden">
            {isGenerating ? (
              <div className="flex justify-center items-center bg-neutral-200 rounded-lg" style={{ height: '240px' }}>
                <div className="text-center">
                  <FaSpinner className="text-primary text-3xl mb-2 animate-spin mx-auto" />
                  <p className="text-neutral-800">Generando visualización...</p>
                </div>
              </div>
            ) : (
              <>
                {/* In a real app, this would be the AI-generated visualization */}
                {/* For now, we'll just show the original image with a filter for demonstration */}
                <img 
                  src={imagePreview} 
                  alt="Visualización de diseño" 
                  className="w-full h-auto rounded-lg"
                  style={{ filter: 'saturate(1.3) brightness(1.1)' }}
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-primary text-white">IA Visualización</Badge>
                </div>
              </>
            )}
          </div>
          
          {analysisResult && !isGenerating && (
            <div>
              <h4 className="font-medium text-lg mb-2">Sugerencias de diseño</h4>
              <ul className="space-y-1 text-sm">
                {designSuggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {imagePreview && !analysisResult && !isAnalyzing && (
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white"
              onClick={analyzeCurrentImage}
            >
              Analizar con IA
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AIVisualization;
