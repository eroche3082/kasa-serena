import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';

const SelectionPanel = () => {
  const [projectType, setProjectType] = useState("cocina");
  const [activeMaterial, setActiveMaterial] = useState("");
  const [activeColor, setActiveColor] = useState("white");
  const [activeFinish, setActiveFinish] = useState("matte");

  // Get materials from API
  const { data: materialsData = [] } = useQuery({
    queryKey: ['/api/materials'],
    refetchOnWindowFocus: false
  });

  // Materials for current project type (typed safely)
  const projectMaterials = Array.isArray(materialsData) ? 
    materialsData.filter((m: any) => m.category && m.category.toLowerCase() === projectType) : 
    [];

  // Colors array
  const colors = [
    { id: 'white', name: 'Blanco', hex: '#ffffff', borderClass: 'border-neutral-300' },
    { id: 'gray', name: 'Gris', hex: '#e5e7eb' },
    { id: 'walnut', name: 'Nogal', hex: '#614023' },
    { id: 'oak', name: 'Roble', hex: '#b68d40' },
    { id: 'forest', name: 'Bosque', hex: '#2d6a4f' },
    { id: 'teal', name: 'Turquesa', hex: '#20c997' },
    { id: 'navy', name: 'Azul marino', hex: '#1e40af' },
    { id: 'indigo', name: 'Índigo', hex: '#4338ca' },
    { id: 'black', name: 'Negro', hex: '#1f2937' },
    { id: 'red', name: 'Rojo', hex: '#dc2626' }
  ];

  // Finishes array
  const finishes = [
    { id: 'matte', name: 'Mate' },
    { id: 'semi-matte', name: 'Semimate' },
    { id: 'glossy', name: 'Brillante' },
    { id: 'textured', name: 'Texturizado' }
  ];

  // Handle material change
  const handleMaterialChange = (value: string) => {
    setActiveMaterial(value);
  };

  // Handle color change
  const handleColorChange = (value: string) => {
    setActiveColor(value);
  };

  // Handle finish change
  const handleFinishChange = (value: string) => {
    setActiveFinish(value);
  };
  
  // Generate estimate handler
  const handleGenerateEstimate = () => {
    // This would normally call the generateCostEstimate function
    console.log('Generating estimate for', projectType, 'with material:', activeMaterial);
  };

  return (
    <div>
      {/* Categories tabs */}
      <Tabs defaultValue={projectType} onValueChange={setProjectType}>
        <TabsList className="flex overflow-x-auto pb-2 mb-6 border-b border-neutral-200">
          <TabsTrigger value="cocina" className="px-4 py-2 mr-2 whitespace-nowrap rounded-t-lg">
            Cocinas
          </TabsTrigger>
          <TabsTrigger value="puerta" className="px-4 py-2 mr-2 whitespace-nowrap">
            Puertas
          </TabsTrigger>
          <TabsTrigger value="ventana" className="px-4 py-2 mr-2 whitespace-nowrap">
            Ventanas
          </TabsTrigger>
          <TabsTrigger value="gabinete" className="px-4 py-2 whitespace-nowrap">
            Gabinetes
          </TabsTrigger>
        </TabsList>

        {/* Selection options for each category */}
        <TabsContent value="cocina">
          <SelectionOptions 
            materials={projectMaterials}
            colors={colors}
            finishes={finishes}
            activeMaterial={activeMaterial}
            activeColor={activeColor}
            activeFinish={activeFinish}
            handleMaterialChange={handleMaterialChange}
            handleColorChange={handleColorChange}
            handleFinishChange={handleFinishChange}
          />
        </TabsContent>
        
        <TabsContent value="puerta">
          <SelectionOptions 
            materials={projectMaterials}
            colors={colors}
            finishes={finishes}
            activeMaterial={activeMaterial}
            activeColor={activeColor}
            activeFinish={activeFinish}
            handleMaterialChange={handleMaterialChange}
            handleColorChange={handleColorChange}
            handleFinishChange={handleFinishChange}
          />
        </TabsContent>
        
        <TabsContent value="ventana">
          <SelectionOptions 
            materials={projectMaterials}
            colors={colors}
            finishes={finishes}
            activeMaterial={activeMaterial}
            activeColor={activeColor}
            activeFinish={activeFinish}
            handleMaterialChange={handleMaterialChange}
            handleColorChange={handleColorChange}
            handleFinishChange={handleFinishChange}
          />
        </TabsContent>
        
        <TabsContent value="gabinete">
          <SelectionOptions 
            materials={projectMaterials}
            colors={colors}
            finishes={finishes}
            activeMaterial={activeMaterial}
            activeColor={activeColor}
            activeFinish={activeFinish}
            handleMaterialChange={handleMaterialChange}
            handleColorChange={handleColorChange}
            handleFinishChange={handleFinishChange}
          />
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white" 
          onClick={handleGenerateEstimate}
        >
          Generar estimación
        </Button>
      </div>
    </div>
  );
};

interface SelectionOptionsProps {
  materials: any[];
  colors: any[];
  finishes: any[];
  activeMaterial: string;
  activeColor: string;
  activeFinish: string;
  handleMaterialChange: (value: string) => void;
  handleColorChange: (value: string) => void;
  handleFinishChange: (value: string) => void;
}

const SelectionOptions = ({
  materials,
  colors,
  finishes,
  activeMaterial,
  activeColor,
  activeFinish,
  handleMaterialChange,
  handleColorChange,
  handleFinishChange
}: SelectionOptionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Materials */}
      <div className="border border-neutral-200 rounded-lg p-4">
        <h4 className="font-medium mb-3">Materiales</h4>
        <RadioGroup value={activeMaterial} onValueChange={handleMaterialChange} className="space-y-2">
          {materials.length > 0 ? (
            materials.map((material) => (
              <div key={material.id} className="flex items-center">
                <RadioGroupItem value={material.name} id={`material-${material.id}`} />
                <Label htmlFor={`material-${material.id}`} className="ml-2">
                  {material.name}
                </Label>
              </div>
            ))
          ) : (
            // Fallback options if API doesn't return data
            <>
              <div className="flex items-center">
                <RadioGroupItem value="Madera natural" id="material-wood" />
                <Label htmlFor="material-wood" className="ml-2">
                  Madera natural
                </Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="MDF laminado" id="material-mdf" />
                <Label htmlFor="material-mdf" className="ml-2">
                  MDF laminado
                </Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="Acrílico de alto brillo" id="material-acrylic" />
                <Label htmlFor="material-acrylic" className="ml-2">
                  Acrílico de alto brillo
                </Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="Combinado" id="material-combo" />
                <Label htmlFor="material-combo" className="ml-2">
                  Combinado
                </Label>
              </div>
            </>
          )}
        </RadioGroup>
      </div>
      
      {/* Colors */}
      <div className="border border-neutral-200 rounded-lg p-4">
        <h4 className="font-medium mb-3">Colores</h4>
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color) => (
            <div 
              key={color.id}
              className={`w-8 h-8 rounded-full cursor-pointer ${
                color.id === 'white' ? 'border border-neutral-300' : ''
              } ${activeColor === color.id ? 'ring-2 ring-primary' : ''}`}
              style={{ backgroundColor: color.hex }}
              onClick={() => handleColorChange(color.id)}
              title={color.name}
            />
          ))}
        </div>
        <div className="mt-3">
          <button className="text-sm text-primary hover:underline">
            Más colores <span className="ml-1">›</span>
          </button>
        </div>
      </div>
      
      {/* Finishes */}
      <div className="border border-neutral-200 rounded-lg p-4">
        <h4 className="font-medium mb-3">Acabados</h4>
        <RadioGroup value={activeFinish} onValueChange={handleFinishChange} className="space-y-2">
          {finishes.map((finish) => (
            <div key={finish.id} className="flex items-center">
              <RadioGroupItem value={finish.id} id={`finish-${finish.id}`} />
              <Label htmlFor={`finish-${finish.id}`} className="ml-2">
                {finish.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default SelectionPanel;
