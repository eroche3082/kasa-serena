import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from '@/hooks/use-toast';
import { 
  FaUser, 
  FaColumns, 
  FaFileAlt, 
  FaUserFriends, 
  FaStore, 
  FaChartBar,
  FaExclamationTriangle,
  FaPlus,
  FaPencilAlt,
  FaTrash,
  FaEye,
  FaFileInvoiceDollar
} from 'react-icons/fa';

// Tipo para los proyectos
interface Project {
  id: number;
  userId: number;
  name: string;
  description?: string;
  type: string;
  status: string;
  cost?: number;
  estimatedDeliveryTime?: string;
  imageUrl?: string;
  aiAnalysis?: any;
  materialsList?: any;
  createdAt: string;
  updatedAt: string;
}

// Componente de tarjeta de proyecto
const ProjectCard = ({ project, onEdit, onDelete, onView }: { 
  project: Project, 
  onEdit: (id: number) => void,
  onDelete: (id: number) => void,
  onView: (id: number, type: string) => void
}) => {
  // Traducir el tipo de proyecto
  const getProjectTypeName = (type: string) => {
    switch (type) {
      case 'contenedor': return 'Contenedor Inteligente';
      case 'piscina': return 'Piscina Modular';
      case 'cocina': return 'Cocina';
      case 'puerta': return 'Puerta';
      case 'ventana': return 'Ventana';
      case 'gabinete': return 'Gabinete';
      case 'oficina': return 'Oficina/Espacio Creativo';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Estado de proyecto traducido
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Borrador</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">En Progreso</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 bg-neutral-100 rounded-l-lg overflow-hidden">
          {project.imageUrl ? (
            <img 
              src={project.imageUrl} 
              alt={project.name} 
              className="w-full h-full object-cover aspect-square"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400 aspect-square">
              <FaFileAlt className="w-12 h-12" />
            </div>
          )}
        </div>
        
        <div className="md:col-span-3 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
            <h3 className="text-lg font-bold">{project.name}</h3>
            {getStatusBadge(project.status)}
          </div>
          
          <div className="mt-2 space-y-2">
            <div className="flex items-center text-sm text-neutral-600">
              <span className="font-medium mr-2">Tipo:</span> 
              {getProjectTypeName(project.type)}
            </div>
            
            <div className="flex items-center text-sm text-neutral-600">
              <span className="font-medium mr-2">Fecha:</span> 
              {new Date(project.createdAt).toLocaleDateString()}
            </div>
            
            {project.description && (
              <div className="text-sm text-neutral-600 mt-2">
                <span className="font-medium">Descripción:</span>
                <p className="mt-1 line-clamp-2">{project.description}</p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mt-4">
              <Button 
                size="sm" 
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => onView(project.id, project.type)}
              >
                <FaEye className="w-3 h-3" /> Ver
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => onEdit(project.id)}
              >
                <FaPencilAlt className="w-3 h-3" /> Editar
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onDelete(project.id)}
              >
                <FaTrash className="w-3 h-3" /> Eliminar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const DashboardPage = () => {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, isLoading, setLocation]);
  
  // Get projects
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['/api/projects/user'],
    enabled: isAuthenticated,
  });
  
  // Get quotes
  const { data: quotes, isLoading: isLoadingQuotes } = useQuery({
    queryKey: ['/api/quotes'],
    enabled: isAuthenticated,
  });
  
  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: number) => {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el proyecto');
      }
      
      return projectId;
    },
    onSuccess: () => {
      // Invalidate projects query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/projects/user'] });
      
      toast({
        title: "Proyecto eliminado",
        description: "El proyecto se ha eliminado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `No se pudo eliminar el proyecto: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Handle edit project
  const handleEditProject = (projectId: number) => {
    // Redirigir según el tipo de proyecto
    const project = projects?.find((p: Project) => p.id === projectId);
    
    if (project) {
      switch (project.type) {
        case 'contenedor':
          setLocation(`/smart-container?id=${projectId}`);
          break;
        case 'piscina':
          setLocation(`/modular-pool?id=${projectId}`);
          break;
        default:
          setLocation(`/design-studio?id=${projectId}`);
          break;
      }
    }
  };
  
  // Handle view project details
  const handleViewProject = (projectId: number, type: string) => {
    // Redirigir según el tipo de proyecto
    switch (type) {
      case 'contenedor':
        setLocation(`/smart-container?id=${projectId}&view=true`);
        break;
      case 'piscina':
        setLocation(`/modular-pool?id=${projectId}&view=true`);
        break;
      default:
        setLocation(`/design-studio?id=${projectId}&view=true`);
        break;
    }
  };
  
  // Handle delete project
  const handleDeleteClick = (projectId: number) => {
    setDeleteProjectId(projectId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (deleteProjectId) {
      deleteProjectMutation.mutate(deleteProjectId);
    }
    setIsDeleteDialogOpen(false);
  };
  
  if (isLoading) {
    return (
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-64 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <main className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold mb-2 text-center md:text-left">
              Mi Dashboard
            </h1>
            <p className="text-neutral-600 text-center md:text-left">
              Gestiona tus proyectos, diseños y cotizaciones
            </p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarFallback className="bg-primary text-white">
                {user?.fullName?.charAt(0) || user?.username?.charAt(0) || <FaUser />}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user?.fullName || user?.username}</div>
              <div className="text-xs text-neutral-500">{user?.email}</div>
            </div>
          </div>
        </div>
        
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FaFileAlt className="mr-2 text-primary" /> Proyectos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoadingProjects ? (
                  <Skeleton className="h-9 w-12" />
                ) : (
                  projects?.length || 0
                )}
              </div>
              <p className="text-sm text-neutral-500">Proyectos guardados</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FaFileInvoiceDollar className="mr-2 text-primary" /> Cotizaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoadingQuotes ? (
                  <Skeleton className="h-9 w-12" />
                ) : (
                  quotes?.length || 0
                )}
              </div>
              <p className="text-sm text-neutral-500">Cotizaciones solicitadas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FaChartBar className="mr-2 text-primary" /> Estado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoadingQuotes ? (
                  <Skeleton className="h-9 w-12" />
                ) : (
                  quotes?.filter((q: any) => q.status === 'approved').length || 0
                )}
              </div>
              <p className="text-sm text-neutral-500">Cotizaciones aprobadas</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="projects">
          <TabsList className="mb-6">
            <TabsTrigger value="projects">Mis Proyectos</TabsTrigger>
            <TabsTrigger value="quotes">Mis Cotizaciones</TabsTrigger>
          </TabsList>
          
          {/* Projects tab */}
          <TabsContent value="projects">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-['Playfair_Display'] font-semibold">Mis Proyectos</h2>
              <div className="flex space-x-2">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                  onClick={() => setLocation('/design-generator')}
                >
                  <FaPlus /> Nuevo Diseño
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                  onClick={() => setLocation('/smart-container')}
                >
                  <FaPlus /> Contenedor
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                  onClick={() => setLocation('/modular-pool')}
                >
                  <FaPlus /> Piscina
                </Button>
              </div>
            </div>
            
            {isLoadingProjects ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <div className="p-4">
                      <Skeleton className="h-32 w-full" />
                      <div className="mt-4">
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-32 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : projects?.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project: Project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onEdit={handleEditProject}
                    onDelete={handleDeleteClick}
                    onView={handleViewProject}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-neutral-50 rounded-lg">
                <FaFileAlt className="text-neutral-300 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No tienes proyectos guardados</h3>
                <p className="text-neutral-600 mb-6">
                  Crea tu primer proyecto para comenzar a visualizar tus diseños personalizados
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white"
                    onClick={() => setLocation('/design-generator')}
                  >
                    Crear diseño personalizado
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setLocation('/smart-container')}
                  >
                    Diseñar Contenedor Inteligente
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Quotes tab */}
          <TabsContent value="quotes">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-['Playfair_Display'] font-semibold">Mis Cotizaciones</h2>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setLocation('/cotizaciones')}
              >
                Ver todas las cotizaciones
              </Button>
            </div>
            
            {isLoadingQuotes ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <div className="p-4">
                      <Skeleton className="h-24 w-full" />
                      <div className="mt-4">
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-32 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : quotes?.length > 0 ? (
              <div className="space-y-4">
                {quotes.slice(0, 3).map((quote: any) => (
                  <Card key={quote.id} className="hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-1 bg-neutral-100 rounded-l-lg overflow-hidden">
                        {quote.details?.imageUrl ? (
                          <img 
                            src={quote.details.imageUrl} 
                            alt={quote.details.tipo || 'Diseño cotizado'} 
                            className="w-full h-full object-cover aspect-video"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400 aspect-video">
                            <FaFileInvoiceDollar className="w-12 h-12" />
                          </div>
                        )}
                      </div>
                      
                      <div className="md:col-span-3 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                          <h3 className="text-lg font-bold">{quote.details.tipo || 'Cotización de diseño'}</h3>
                          <Badge className={
                            quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            quote.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            quote.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-blue-100 text-blue-800'
                          }>
                            {quote.status === 'pending' ? 'Pendiente' : 
                             quote.status === 'approved' ? 'Aprobada' : 
                             quote.status === 'rejected' ? 'Rechazada' : 
                             'Completada'}
                          </Badge>
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-sm text-neutral-600">
                            {quote.details.descripcion || 'Sin descripción'}
                          </p>
                          
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-neutral-500 mt-2">
                            <div>
                              <span className="font-medium">Fecha:</span> {new Date(quote.createdAt).toLocaleDateString()}
                            </div>
                            {quote.totalCost && (
                              <div>
                                <span className="font-medium">Presupuesto:</span> ${(quote.totalCost / 100).toFixed(2)}
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-3">
                            <Button 
                              size="sm" 
                              className="bg-primary hover:bg-primary/90 text-white"
                              onClick={() => setLocation(`/cotizaciones?id=${quote.id}`)}
                            >
                              Ver detalles
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {quotes.length > 3 && (
                  <div className="text-center mt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setLocation('/cotizaciones')}
                    >
                      Ver todas las cotizaciones ({quotes.length})
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-neutral-50 rounded-lg">
                <FaFileInvoiceDollar className="text-neutral-300 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No tienes cotizaciones</h3>
                <p className="text-neutral-600 mb-6">
                  Crea un diseño y solicita una cotización para recibir un presupuesto personalizado
                </p>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={() => setLocation('/design-generator')}
                >
                  Crear diseño para cotizar
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Delete confirmation dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El proyecto será eliminado permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  );
};

export default DashboardPage;