import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Save, Image, TextIcon, Layout, Palette, Settings, Eye, 
  EyeOff, Edit, ChevronDown, ChevronUp, Layers, Grid, RefreshCw
} from 'lucide-react';

// Tipos para los elementos editables
export interface EditableElement {
  id: string;
  type: 'text' | 'image' | 'section' | 'component' | 'layout';
  name: string;
  content: any;
  path: string;
  editable: boolean;
  visible: boolean;
  children?: EditableElement[];
}

// Interfaz para las configuraciones globales
export interface SiteConfig {
  title: string;
  description: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  features: {
    [key: string]: boolean;
  };
}

const VisualEditor: React.FC = () => {
  // Estados
  const [elements, setElements] = useState<EditableElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<EditableElement | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    title: 'Kasa Serena',
    description: 'Plataforma de diseño arquitectónico impulsada por IA',
    theme: {
      primary: '#c8a165',
      secondary: '#2a3238',
      accent: '#e6c78f',
      background: '#ffffff',
      text: '#333333',
    },
    fonts: {
      heading: 'Didot',
      body: 'Poppins',
    },
    features: {
      designStudio: true,
      smartContainer: true,
      poolDesigner: true,
      quoteSystem: true,
      inspirationChat: true,
      visualEditor: true,
    },
  });
  
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('structure');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Cargar elementos y configuración
  useEffect(() => {
    fetchElements();
    fetchSiteConfig();
  }, []);

  // Función para cargar elementos editables
  const fetchElements = async () => {
    setIsLoading(true);
    try {
      // En una implementación real, esto obtendría datos de la API
      // Simularemos la carga por ahora
      setTimeout(() => {
        setElements([
          {
            id: '1',
            type: 'section',
            name: 'Header',
            content: {},
            path: 'features/layout/Header.tsx',
            editable: true,
            visible: true,
            children: [
              {
                id: '1-1',
                type: 'image',
                name: 'Logo',
                content: { src: '/src/assets/logo-new.png', alt: 'Kasa Serena Logo' },
                path: 'assets/logo-new.png',
                editable: true,
                visible: true
              },
              {
                id: '1-2',
                type: 'component',
                name: 'Navigation',
                content: {},
                path: 'features/layout/Navigation.tsx',
                editable: true,
                visible: true
              }
            ]
          },
          {
            id: '2',
            type: 'section',
            name: 'Hero',
            content: {
              title: 'Diseños Arquitectónicos Personalizados',
              subtitle: 'Soluciones de diseño innovadoras impulsadas por IA'
            },
            path: 'features/home/HeroSection.tsx',
            editable: true,
            visible: true
          },
          {
            id: '3',
            type: 'section',
            name: 'Servicios',
            content: {},
            path: 'features/home/ServicesSection.tsx',
            editable: true,
            visible: true
          },
          {
            id: '4',
            type: 'section',
            name: 'Materiales',
            content: {},
            path: 'features/home/MaterialsSection.tsx',
            editable: true,
            visible: true
          },
          {
            id: '5',
            type: 'section',
            name: 'Distribuidores',
            content: {},
            path: 'features/home/DistributorsSection.tsx',
            editable: true,
            visible: true
          },
          {
            id: '6',
            type: 'section',
            name: 'Footer',
            content: {},
            path: 'features/layout/Footer.tsx',
            editable: true,
            visible: true
          }
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching elements:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los elementos editables.',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  };

  // Función para cargar configuración del sitio
  const fetchSiteConfig = async () => {
    try {
      // En una implementación real, esto obtendría datos de la API
      // Por ahora usamos el estado inicial
    } catch (error) {
      console.error('Error fetching site config:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar la configuración del sitio.',
        variant: 'destructive'
      });
    }
  };

  // Actualizar elemento seleccionado
  const handleElementUpdate = (field: string, value: any) => {
    if (!selectedElement) return;

    setSelectedElement({
      ...selectedElement,
      content: {
        ...selectedElement.content,
        [field]: value
      }
    });

    // Actualizamos también en la lista completa
    setElements(prev => updateElementInList(prev, selectedElement.id, field, value));
  };

  // Función recursiva para actualizar un elemento en la lista
  const updateElementInList = (list: EditableElement[], id: string, field: string, value: any): EditableElement[] => {
    return list.map(element => {
      if (element.id === id) {
        return {
          ...element,
          content: {
            ...element.content,
            [field]: value
          }
        };
      } else if (element.children) {
        return {
          ...element,
          children: updateElementInList(element.children, id, field, value)
        };
      }
      return element;
    });
  };

  // Alternar visibilidad de un elemento
  const toggleElementVisibility = (id: string) => {
    setElements(prev => toggleVisibilityInList(prev, id));
  };

  // Función recursiva para alternar visibilidad
  const toggleVisibilityInList = (list: EditableElement[], id: string): EditableElement[] => {
    return list.map(element => {
      if (element.id === id) {
        return {
          ...element,
          visible: !element.visible
        };
      } else if (element.children) {
        return {
          ...element,
          children: toggleVisibilityInList(element.children, id)
        };
      }
      return element;
    });
  };

  // Mover elemento hacia arriba en la lista
  const moveElementUp = (id: string) => {
    setElements(prev => {
      const index = prev.findIndex(el => el.id === id);
      if (index <= 0) return prev;
      
      const newElements = [...prev];
      const temp = newElements[index];
      newElements[index] = newElements[index - 1];
      newElements[index - 1] = temp;
      
      return newElements;
    });
  };

  // Mover elemento hacia abajo en la lista
  const moveElementDown = (id: string) => {
    setElements(prev => {
      const index = prev.findIndex(el => el.id === id);
      if (index === -1 || index === prev.length - 1) return prev;
      
      const newElements = [...prev];
      const temp = newElements[index];
      newElements[index] = newElements[index + 1];
      newElements[index + 1] = temp;
      
      return newElements;
    });
  };

  // Actualizar configuración del sitio
  const updateSiteConfig = (section: keyof SiteConfig, field: string, value: any) => {
    setSiteConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  // Alternar características
  const toggleFeature = (feature: string) => {
    setSiteConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }));
  };

  // Guardar cambios
  const saveChanges = async () => {
    setIsLoading(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En una implementación real, enviaríamos los datos al servidor
      // const response = await apiRequest('POST', '/api/editor/save', {
      //   elements,
      //   siteConfig
      // });
      
      toast({
        title: 'Cambios guardados',
        description: 'Los cambios se aplicarán la próxima vez que se cargue la página.',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los cambios.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar panel de edición según el tipo de elemento
  const renderEditPanel = () => {
    if (!selectedElement) return <div className="p-4 text-center text-muted-foreground">Selecciona un elemento para editar</div>;

    switch (selectedElement.type) {
      case 'text':
        return (
          <div className="space-y-4 p-4">
            <div>
              <Label htmlFor="text-content">Contenido</Label>
              <Textarea 
                id="text-content"
                value={selectedElement.content.text || ''}
                onChange={(e) => handleElementUpdate('text', e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="font-size">Tamaño de fuente</Label>
                <Input 
                  id="font-size"
                  type="number"
                  value={selectedElement.content.fontSize || '16'}
                  onChange={(e) => handleElementUpdate('fontSize', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="text-color">Color</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="text-color"
                    type="color"
                    value={selectedElement.content.color || '#000000'}
                    onChange={(e) => handleElementUpdate('color', e.target.value)}
                    className="w-12 h-9 p-1"
                  />
                  <Input 
                    value={selectedElement.content.color || '#000000'}
                    onChange={(e) => handleElementUpdate('color', e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'image':
        return (
          <div className="space-y-4 p-4">
            <div>
              <Label htmlFor="image-src">URL de la imagen</Label>
              <Input 
                id="image-src"
                value={selectedElement.content.src || ''}
                onChange={(e) => handleElementUpdate('src', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="image-alt">Texto alternativo</Label>
              <Input 
                id="image-alt"
                value={selectedElement.content.alt || ''}
                onChange={(e) => handleElementUpdate('alt', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="image-width">Ancho</Label>
                <Input 
                  id="image-width"
                  type="number"
                  value={selectedElement.content.width || ''}
                  onChange={(e) => handleElementUpdate('width', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="image-height">Alto</Label>
                <Input 
                  id="image-height"
                  type="number"
                  value={selectedElement.content.height || ''}
                  onChange={(e) => handleElementUpdate('height', e.target.value)}
                />
              </div>
            </div>
            {selectedElement.content.src && (
              <div className="mt-4 border rounded p-2">
                <p className="text-xs text-muted-foreground mb-2">Vista previa:</p>
                <img 
                  src={selectedElement.content.src} 
                  alt={selectedElement.content.alt || 'Preview'} 
                  className="max-w-full max-h-[200px] object-contain mx-auto"
                />
              </div>
            )}
          </div>
        );
        
      case 'section':
        return (
          <div className="space-y-4 p-4">
            <div>
              <Label htmlFor="section-title">Título</Label>
              <Input 
                id="section-title"
                value={selectedElement.content.title || ''}
                onChange={(e) => handleElementUpdate('title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="section-subtitle">Subtítulo</Label>
              <Input 
                id="section-subtitle"
                value={selectedElement.content.subtitle || ''}
                onChange={(e) => handleElementUpdate('subtitle', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="section-description">Descripción</Label>
              <Textarea 
                id="section-description"
                value={selectedElement.content.description || ''}
                onChange={(e) => handleElementUpdate('description', e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="section-visible" 
                checked={selectedElement.visible}
                onCheckedChange={() => toggleElementVisibility(selectedElement.id)}
              />
              <Label htmlFor="section-visible">Visible</Label>
            </div>
          </div>
        );
        
      case 'component':
      case 'layout':
      default:
        return (
          <div className="space-y-4 p-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="element-visible" 
                checked={selectedElement.visible}
                onCheckedChange={() => toggleElementVisibility(selectedElement.id)}
              />
              <Label htmlFor="element-visible">Visible</Label>
            </div>
            <div className="text-sm text-muted-foreground p-2 border rounded">
              <p>Componente: {selectedElement.name}</p>
              <p>Ruta: {selectedElement.path}</p>
              <p className="text-xs mt-2">Nota: Algunos componentes tienen opciones de configuración limitadas en el editor visual.</p>
            </div>
          </div>
        );
    }
  };

  // Renderizar elementos en el árbol
  const renderElementTree = (elementList: EditableElement[], level = 0) => {
    return elementList.map(element => (
      <div key={element.id}>
        <div 
          className={`flex items-center py-2 px-${level * 2 + 2} hover:bg-muted cursor-pointer ${selectedElement?.id === element.id ? 'bg-muted' : ''}`}
          onClick={() => setSelectedElement(element)}
        >
          <div className="flex-1 flex items-center">
            {element.type === 'text' && <TextIcon className="w-4 h-4 mr-2" />}
            {element.type === 'image' && <Image className="w-4 h-4 mr-2" />}
            {element.type === 'section' && <Layout className="w-4 h-4 mr-2" />}
            {element.type === 'component' && <Layers className="w-4 h-4 mr-2" />}
            {element.type === 'layout' && <Grid className="w-4 h-4 mr-2" />}
            <span className={element.visible ? '' : 'text-muted-foreground line-through'}>{element.name}</span>
          </div>
          <div className="flex items-center gap-1">
            {!element.visible && <EyeOff className="w-4 h-4 text-muted-foreground" />}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                moveElementUp(element.id);
              }}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                moveElementDown(element.id);
              }}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {element.children && element.children.length > 0 && renderElementTree(element.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Barra de herramientas */}
      <div className="bg-card border-b py-2 px-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Editor Visual</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? <Edit className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {isPreviewMode ? 'Editar' : 'Vista previa'}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={saveChanges}
            disabled={isLoading}
          >
            {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar cambios
          </Button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel lateral izquierdo */}
        <div className="w-72 border-r bg-card overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="structure" className="flex-1">
                <Layout className="w-4 h-4 mr-2" />
                Estructura
              </TabsTrigger>
              <TabsTrigger value="theme" className="flex-1">
                <Palette className="w-4 h-4 mr-2" />
                Tema
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">
                <Settings className="w-4 h-4 mr-2" />
                Ajustes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="structure" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[calc(100vh-11rem)]">
                <div className="p-2">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-20">
                      <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    renderElementTree(elements)
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="theme" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[calc(100vh-11rem)]">
                <div className="p-4 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Colores</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="primary-color">Color primario</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="primary-color"
                            type="color"
                            value={siteConfig.theme.primary}
                            onChange={(e) => updateSiteConfig('theme', 'primary', e.target.value)}
                            className="w-12 h-9 p-1"
                          />
                          <Input 
                            value={siteConfig.theme.primary}
                            onChange={(e) => updateSiteConfig('theme', 'primary', e.target.value)}
                            className="font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="secondary-color">Color secundario</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="secondary-color"
                            type="color"
                            value={siteConfig.theme.secondary}
                            onChange={(e) => updateSiteConfig('theme', 'secondary', e.target.value)}
                            className="w-12 h-9 p-1"
                          />
                          <Input 
                            value={siteConfig.theme.secondary}
                            onChange={(e) => updateSiteConfig('theme', 'secondary', e.target.value)}
                            className="font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="accent-color">Color de acento</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="accent-color"
                            type="color"
                            value={siteConfig.theme.accent}
                            onChange={(e) => updateSiteConfig('theme', 'accent', e.target.value)}
                            className="w-12 h-9 p-1"
                          />
                          <Input 
                            value={siteConfig.theme.accent}
                            onChange={(e) => updateSiteConfig('theme', 'accent', e.target.value)}
                            className="font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="background-color">Color de fondo</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="background-color"
                            type="color"
                            value={siteConfig.theme.background}
                            onChange={(e) => updateSiteConfig('theme', 'background', e.target.value)}
                            className="w-12 h-9 p-1"
                          />
                          <Input 
                            value={siteConfig.theme.background}
                            onChange={(e) => updateSiteConfig('theme', 'background', e.target.value)}
                            className="font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="text-color">Color de texto</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="text-color"
                            type="color"
                            value={siteConfig.theme.text}
                            onChange={(e) => updateSiteConfig('theme', 'text', e.target.value)}
                            className="w-12 h-9 p-1"
                          />
                          <Input 
                            value={siteConfig.theme.text}
                            onChange={(e) => updateSiteConfig('theme', 'text', e.target.value)}
                            className="font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-3">Tipografía</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="heading-font">Fuente de títulos</Label>
                        <Select 
                          value={siteConfig.fonts.heading}
                          onValueChange={(value) => updateSiteConfig('fonts', 'heading', value)}
                        >
                          <SelectTrigger id="heading-font">
                            <SelectValue placeholder="Selecciona una fuente" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Didot">Didot</SelectItem>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                            <SelectItem value="Garamond">Garamond</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="body-font">Fuente de texto</Label>
                        <Select 
                          value={siteConfig.fonts.body}
                          onValueChange={(value) => updateSiteConfig('fonts', 'body', value)}
                        >
                          <SelectTrigger id="body-font">
                            <SelectValue placeholder="Selecciona una fuente" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Poppins">Poppins</SelectItem>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Arial">Arial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="settings" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[calc(100vh-11rem)]">
                <div className="p-4 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Configuración general</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="site-title">Título del sitio</Label>
                        <Input 
                          id="site-title"
                          value={siteConfig.title}
                          onChange={(e) => setSiteConfig({...siteConfig, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="site-description">Descripción del sitio</Label>
                        <Textarea 
                          id="site-description"
                          value={siteConfig.description}
                          onChange={(e) => setSiteConfig({...siteConfig, description: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-3">Características</h3>
                    <div className="space-y-3">
                      {Object.entries(siteConfig.features).map(([feature, enabled]) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Switch 
                            id={`feature-${feature}`}
                            checked={enabled}
                            onCheckedChange={() => toggleFeature(feature)}
                          />
                          <Label htmlFor={`feature-${feature}`} className="capitalize">
                            {feature.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Panel central - Editor */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {selectedElement ? (
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="bg-muted-foreground/5 py-2 px-4 border-b">
                <h3 className="text-sm font-medium">
                  Editando: {selectedElement.name} 
                  <span className="text-xs text-muted-foreground ml-2">({selectedElement.type})</span>
                </h3>
              </div>
              <ScrollArea className="flex-1">
                {renderEditPanel()}
              </ScrollArea>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center p-8">
                <Layout className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">Selecciona un elemento</h3>
                <p className="text-sm max-w-md">
                  Selecciona un elemento de la estructura para editar su contenido,
                  o cambia a las pestañas de Tema o Ajustes para modificar la apariencia global.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualEditor;