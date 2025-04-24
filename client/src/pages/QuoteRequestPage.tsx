import { useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import QuoteRequestForm from '@/features/quotes/QuoteRequestForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export const QuoteRequestPage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const [, params] = useRoute<{ id: string }>('/solicitar-cotizacion/:id');
  
  // Extraer parámetros de URL
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const projectId = params?.id || urlParams.get('project_id') || undefined;
  const projectType = urlParams.get('type') || undefined;
  
  // Consultar detalles del proyecto si se proporciona un ID
  const { data: projectData, isLoading: isProjectLoading } = useQuery({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
  });
  
  // Redireccionar si no está autenticado
  useEffect(() => {
    if (!isAuthLoading && !user) {
      setLocation('/login?redirect=' + encodeURIComponent(location));
    }
  }, [isAuthLoading, user, setLocation, location]);
  
  if (isAuthLoading || (projectId && isProjectLoading)) {
    return (
      <div className="container mx-auto py-28 px-4 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>Cargando...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Redirigido por useEffect
  }
  
  // Preparar detalles del proyecto
  let projectDetails;
  if (projectData) {
    projectDetails = {
      materials: typeof projectData.materialsList === 'object' ? 
        Object.values(projectData.materialsList || {}).join(', ') : 
        (projectData.materialsList?.toString() || ''),
      dimensions: projectData.dimensions || '',
      imageUrl: projectData.imageUrl || '',
    };
  }
  
  return (
    <div className="container mx-auto py-28 px-4">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="flex items-center mb-4" 
          onClick={() => setLocation(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        
        <h1 className="text-3xl font-['Playfair_Display'] font-bold text-center mb-2">
          Solicitar Cotización
        </h1>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto">
          Completa el formulario para recibir un presupuesto detallado de tu proyecto. 
          Nuestros expertos revisarán tu solicitud y te contactarán en breve.
        </p>
      </div>
      
      <div className="mt-8">
        <QuoteRequestForm 
          projectId={projectId} 
          projectType={projectType || (projectData && typeof projectData === 'object' && 'type' in projectData ? projectData.type as string : undefined)} 
          projectDetails={projectDetails}
        />
      </div>
    </div>
  );
};

export default QuoteRequestPage;