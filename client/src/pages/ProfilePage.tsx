import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FaUser, FaEdit, FaTrash, FaPlus, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface Project {
  id: number;
  name: string;
  type: string;
  description?: string;
  status: string;
  imageUrl?: string;
  createdAt: string;
}

const ProfilePage = () => {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, isLoading, setLocation]);
  
  // Get user projects
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['/api/projects/user'],
    enabled: isAuthenticated,
  });
  
  // Get user quotes
  const { data: quotes, isLoading: isLoadingQuotes } = useQuery({
    queryKey: ['/api/quotes'],
    enabled: isAuthenticated
  });
  
  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };
  
  if (isLoading) {
    return (
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <Skeleton className="w-12 h-12 rounded-full" />
          </div>
          <Skeleton className="h-8 w-40 mx-auto mt-4" />
          <Skeleton className="h-4 w-60 mx-auto mt-2" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <main className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        {/* User header */}
        <div className="flex flex-col items-center mb-8">
          <Avatar className="w-20 h-20 mb-4">
            <AvatarFallback className="bg-primary text-white text-xl">
              {user?.fullName?.charAt(0) || user?.username?.charAt(0) || <FaUser />}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="font-['Playfair_Display'] text-3xl font-bold mb-1">
            {user?.fullName || user?.username}
          </h1>
          
          <p className="text-neutral-600 mb-4">{user?.email}</p>
          
          {user?.isProfessional && (
            <Badge className="mb-4 bg-primary">Cuenta Profesional</Badge>
          )}
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Cerrar sesión
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Proyectos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {isLoadingProjects ? (
                  <Skeleton className="h-9 w-12" />
                ) : (
                  projects?.length || 0
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Cotizaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {isLoadingQuotes ? (
                  <Skeleton className="h-9 w-12" />
                ) : (
                  quotes?.length || 0
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge 
                variant={user?.isProfessional ? "default" : "secondary"}
                className={user?.isProfessional ? "bg-primary" : ""}
              >
                {user?.isProfessional ? "Profesional" : "Cliente"}
              </Badge>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3 xl:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Acciones rápidas</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => setLocation('/design-studio')}
              >
                Nuevo proyecto
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="projects">
          <TabsList className="mb-6">
            <TabsTrigger value="projects">Mis proyectos</TabsTrigger>
            <TabsTrigger value="quotes">Cotizaciones</TabsTrigger>
            {user?.isProfessional && (
              <TabsTrigger value="clients">Clientes</TabsTrigger>
            )}
          </TabsList>
          
          {/* Projects tab */}
          <TabsContent value="projects">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-['Playfair_Display'] font-semibold">Mis proyectos</h2>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                onClick={() => setLocation('/design-studio')}
              >
                <FaPlus /> Nuevo proyecto
              </Button>
            </div>
            
            {isLoadingProjects ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <Skeleton className="h-40 rounded-t-lg" />
                    <CardHeader>
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : projects?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project: Project) => (
                  <Card key={project.id}>
                    {project.imageUrl ? (
                      <div className="h-40 bg-neutral-200 rounded-t-lg overflow-hidden">
                        <img 
                          src={project.imageUrl} 
                          alt={project.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-40 bg-neutral-200 rounded-t-lg flex items-center justify-center">
                        <span className="text-neutral-400 text-lg">Sin imagen</span>
                      </div>
                    )}
                    
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription className="capitalize">
                        {project.type} - {project.status === 'draft' ? 'Borrador' : project.status}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-neutral-600 mb-4">
                        {project.description || `Proyecto de ${project.type}`}
                      </p>
                      
                      <div className="text-xs text-neutral-500">
                        Creado: {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => setLocation(`/design-studio?id=${project.id}`)}
                      >
                        <FaEdit className="text-xs" /> Editar
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-destructive hover:text-destructive flex items-center gap-1"
                      >
                        <FaTrash className="text-xs" /> Eliminar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-neutral-50 rounded-lg">
                <FaFileAlt className="text-neutral-300 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No tienes proyectos aún</h3>
                <p className="text-neutral-600 mb-6">
                  Comienza por crear un proyecto nuevo en nuestro estudio de diseño
                </p>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={() => setLocation('/design-studio')}
                >
                  Crear primer proyecto
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Quotes tab */}
          <TabsContent value="quotes">
            <h2 className="text-2xl font-['Playfair_Display'] font-semibold mb-6">Mis cotizaciones</h2>
            
            {isLoadingQuotes ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-60" />
                      <Skeleton className="h-4 w-40" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : quotes?.length > 0 ? (
              <div className="space-y-4">
                {quotes.map((quote: any) => (
                  <Card key={quote.id}>
                    <CardHeader>
                      <CardTitle>Cotización #{quote.id}</CardTitle>
                      <CardDescription>
                        {quote.projectId ? `Para proyecto #${quote.projectId}` : 'Cotización directa'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between mb-2">
                        <span className="text-neutral-600">Estado:</span>
                        <Badge variant={quote.status === 'pending' ? 'warning' : 'success'}>
                          {quote.status === 'pending' ? 'Pendiente' : 'Aprobada'}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between mb-2">
                        <span className="text-neutral-600">Costo total:</span>
                        <span className="font-medium">${quote.totalCost?.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Fecha de solicitud:</span>
                        <span>{new Date(quote.createdAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        onClick={() => setLocation(`/quotes/${quote.id}`)}
                      >
                        Ver detalles
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-neutral-50 rounded-lg">
                <FaFileAlt className="text-neutral-300 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No tienes cotizaciones aún</h3>
                <p className="text-neutral-600 mb-6">
                  Cuando solicites una cotización para tus proyectos, aparecerán aquí
                </p>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={() => setLocation('/#contacto')}
                >
                  Solicitar cotización
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Clients tab (professionals only) */}
          {user?.isProfessional && (
            <TabsContent value="clients">
              <h2 className="text-2xl font-['Playfair_Display'] font-semibold mb-6">Mis clientes</h2>
              <div className="text-center py-12 bg-neutral-50 rounded-lg">
                <FaUser className="text-neutral-300 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Funcionalidad próximamente</h3>
                <p className="text-neutral-600 mb-6">
                  La gestión de clientes estará disponible en la próxima actualización
                </p>
                <Button 
                  variant="outline"
                  onClick={() => setLocation('/dashboard')}
                >
                  Ir al dashboard profesional
                </Button>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </main>
  );
};

export default ProfilePage;
