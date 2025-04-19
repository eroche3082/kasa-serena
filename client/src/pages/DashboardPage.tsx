import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  FaUser, 
  FaColumns, 
  FaFileAlt, 
  FaUserFriends, 
  FaStore, 
  FaChartBar,
  FaExclamationTriangle,
  FaPlus
} from 'react-icons/fa';

const DashboardPage = () => {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Redirect if not authenticated or not a professional
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.isProfessional)) {
      setLocation('/login?professional=true');
    }
  }, [isAuthenticated, isLoading, user, setLocation]);
  
  // Get projects
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['/api/projects/user'],
    enabled: isAuthenticated && user?.isProfessional,
  });
  
  // Get materials
  const { data: materials, isLoading: isLoadingMaterials } = useQuery({
    queryKey: ['/api/materials'],
    enabled: isAuthenticated && user?.isProfessional,
  });
  
  // Get distributors
  const { data: distributors, isLoading: isLoadingDistributors } = useQuery({
    queryKey: ['/api/distributors'],
    enabled: isAuthenticated && user?.isProfessional,
  });
  
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
  
  if (!isAuthenticated || !user?.isProfessional) {
    return null; // Will redirect
  }

  return (
    <main className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold mb-2 text-center md:text-left">
              Dashboard Profesional
            </h1>
            <p className="text-neutral-600 text-center md:text-left">
              Gestiona tus proyectos, clientes y conexiones con distribuidores
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
              <p className="text-sm text-neutral-500">Proyectos activos</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FaUserFriends className="mr-2 text-primary" /> Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-sm text-neutral-500">Clientes registrados</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FaStore className="mr-2 text-primary" /> Distribuidores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoadingDistributors ? (
                  <Skeleton className="h-9 w-12" />
                ) : (
                  distributors?.length || 0
                )}
              </div>
              <p className="text-sm text-neutral-500">Conexiones activas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FaChartBar className="mr-2 text-primary" /> Cotizaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-sm text-neutral-500">Pendientes de aprobación</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="projects">
          <TabsList className="mb-6">
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="materials">Materiales</TabsTrigger>
            <TabsTrigger value="distributors">Distribuidores</TabsTrigger>
          </TabsList>
          
          {/* Projects tab */}
          <TabsContent value="projects">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-['Playfair_Display'] font-semibold">Proyectos activos</h2>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                onClick={() => setLocation('/design-studio')}
              >
                <FaPlus /> Nuevo proyecto
              </Button>
            </div>
            
            {isLoadingProjects ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <div className="flex flex-col md:flex-row">
                      <Skeleton className="h-32 w-full md:w-48" />
                      <div className="p-6 flex-grow">
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
                {projects.map((project: any) => (
                  <Card key={project.id}>
                    <div className="flex flex-col md:flex-row">
                      {project.imageUrl ? (
                        <div className="h-32 w-full md:w-48 bg-neutral-200">
                          <img 
                            src={project.imageUrl} 
                            alt={project.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-32 w-full md:w-48 bg-neutral-200 flex items-center justify-center">
                          <span className="text-neutral-400">Sin imagen</span>
                        </div>
                      )}
                      
                      <div className="p-6 flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                          <h3 className="text-lg font-bold">{project.name}</h3>
                          <Badge className="mt-1 md:mt-0 self-start md:self-auto" variant={project.status === 'draft' ? 'warning' : 'success'}>
                            {project.status === 'draft' ? 'Borrador' : project.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-neutral-600 mb-4">
                          {project.description || `Proyecto de ${project.type}`}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-between">
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-neutral-500">
                            <div>
                              <span className="font-medium">Tipo:</span> {project.type}
                            </div>
                            <div>
                              <span className="font-medium">Fecha:</span> {new Date(project.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <div className="mt-3 sm:mt-0">
                            <Button 
                              size="sm" 
                              className="bg-primary hover:bg-primary/90 text-white"
                              onClick={() => setLocation(`/design-studio?id=${project.id}`)}
                            >
                              Gestionar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-neutral-50 rounded-lg">
                <FaFileAlt className="text-neutral-300 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No hay proyectos activos</h3>
                <p className="text-neutral-600 mb-6">
                  Crea tu primer proyecto para comenzar a trabajar
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
          
          {/* Clients tab */}
          <TabsContent value="clients">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-['Playfair_Display'] font-semibold">Clientes</h2>
              <Button variant="outline" className="flex items-center gap-2">
                <FaPlus /> Añadir cliente
              </Button>
            </div>
            
            <div className="text-center py-16 bg-neutral-50 rounded-lg">
              <FaExclamationTriangle className="text-yellow-400 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Módulo en desarrollo</h3>
              <p className="text-neutral-600 mb-6 max-w-lg mx-auto">
                El sistema de gestión de clientes estará disponible próximamente. 
                Podrás gestionar proyectos para múltiples clientes desde una interfaz centralizada.
              </p>
              <Badge variant="secondary">Próximamente</Badge>
            </div>
          </TabsContent>
          
          {/* Materials tab */}
          <TabsContent value="materials">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-['Playfair_Display'] font-semibold">Catálogo de materiales</h2>
            </div>
            
            {isLoadingMaterials ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-40 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : materials?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((material: any) => (
                  <Card key={material.id}>
                    <CardHeader>
                      <CardTitle>{material.name}</CardTitle>
                      <CardDescription className="capitalize">
                        {material.category} - {material.type}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 mb-4">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Color:</span>
                          <span>{material.color}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Acabado:</span>
                          <span>{material.finish}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Precio:</span>
                          <span>${material.price / 100}/unidad</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Disponibilidad:</span>
                          <Badge variant={material.availability === 'available' ? 'success' : 'warning'}>
                            {material.availability === 'available' ? 'Disponible' : 'Limitado'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Distribuidor:</span>
                          <span>ID: {material.distributorId}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-neutral-50 rounded-lg">
                <FaExclamationTriangle className="text-yellow-400 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No hay materiales registrados</h3>
                <p className="text-neutral-600 mb-6">
                  No hay materiales registrados en el sistema actualmente
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* Distributors tab */}
          <TabsContent value="distributors">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-['Playfair_Display'] font-semibold">Distribuidores conectados</h2>
            </div>
            
            {isLoadingDistributors ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <Skeleton className="h-40 rounded-t-lg" />
                    <CardHeader>
                      <Skeleton className="h-6 w-40 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <Skeleton className="h-8 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : distributors?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {distributors.map((distributor: any) => (
                  <Card key={distributor.id}>
                    <div className="h-40 bg-neutral-200 rounded-t-lg overflow-hidden">
                      <img 
                        src={distributor.imageUrl} 
                        alt={distributor.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle>{distributor.name}</CardTitle>
                        <Badge variant={distributor.status === 'available' ? 'success' : 'warning'}>
                          {distributor.status === 'available' ? 'Disponible' : 'Stock limitado'}
                        </Badge>
                      </div>
                      <CardDescription>{distributor.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-neutral-600 mb-4">
                        {distributor.description}
                      </p>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                        Ver inventario
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-neutral-50 rounded-lg">
                <FaExclamationTriangle className="text-yellow-400 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No hay distribuidores conectados</h3>
                <p className="text-neutral-600 mb-6">
                  No has conectado con ningún distribuidor todavía
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Conectar con distribuidores
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default DashboardPage;
