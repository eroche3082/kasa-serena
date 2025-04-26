import React, { useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { SEO } from '@/components/ui/seo';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { 
  Card, CardHeader, CardTitle, CardDescription, 
  CardContent, CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ShieldAlert, Settings, Users, Database, 
  FileText, ImageIcon, PanelLeft, Cpu, Code,
  RefreshCw, Package, MessagesSquare, Settings2
} from 'lucide-react';

const AdminPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Verificar si el usuario tiene permisos para acceder al panel
  const hasAdminPermission = isAuthenticated && user?.role === 'admin';

  // Redirigir si no tiene permisos
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Acceso restringido",
        description: "Debes iniciar sesión para acceder al panel de administración.",
        variant: "destructive"
      });
      setLocation('/login');
    } else if (!hasAdminPermission) {
      toast({
        title: "Permiso denegado",
        description: "No tienes permisos para acceder al panel de administración.",
        variant: "destructive"
      });
      setLocation('/');
    }
  }, [isAuthenticated, hasAdminPermission, toast, setLocation]);

  // Si no tiene permisos, mostrar mensaje de acceso restringido
  if (!isAuthenticated) {
    return null; // Redirigiendo a login
  }

  if (!hasAdminPermission) {
    return (
      <div className="py-8">
        <SEO 
          title="Acceso restringido - Panel de Administración"
          description="Acceso restringido al panel de administración."
        />
        <Container>
          <Card className="max-w-md mx-auto p-6 text-center">
            <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h1 className="text-2xl font-semibold mb-4">Acceso restringido</h1>
            <p className="text-muted-foreground mb-6">
              No tienes permisos para acceder al panel de administración. Esta herramienta está disponible solo para administradores.
            </p>
            <Button onClick={() => setLocation('/')}>
              Volver al inicio
            </Button>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <SEO 
        title="Panel de Administración - Kasa Serena"
        description="Panel de administración para gestionar el sitio web."
      />
      
      <Container>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Panel de Administración</h1>
            <p className="text-muted-foreground">
              Gestiona usuarios, contenido y configuración del sitio.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm text-right">
              <p className="font-medium">{user?.username}</p>
              <p className="text-muted-foreground">{user?.role}</p>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="dashboard">
              <PanelLeft className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText className="w-4 h-4 mr-2" />
              Contenido
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Usuarios activos hoy
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+24</div>
                  <p className="text-xs text-muted-foreground">
                    +15% desde ayer
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Proyectos generados
                  </CardTitle>
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">132</div>
                  <p className="text-xs text-muted-foreground">
                    +22% desde la semana pasada
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mensajes del chatbot
                  </CardTitle>
                  <MessagesSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">845</div>
                  <p className="text-xs text-muted-foreground">
                    +12% desde ayer
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 mt-4 grid-cols-1 md:grid-cols-3">
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Actividad reciente</CardTitle>
                  <CardDescription>
                    Últimas acciones realizadas en la plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[350px]">
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex justify-between items-start pb-4 border-b">
                          <div>
                            <p className="font-medium">Usuario_{i+1}</p>
                            <p className="text-sm text-muted-foreground">
                              {i % 2 === 0 
                                ? "Creó un nuevo diseño de cocina" 
                                : "Utilizó el chat de asistencia"}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Hace {i+1} {i === 0 ? 'hora' : 'horas'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Estado del sistema</CardTitle>
                  <CardDescription>
                    Recursos y servicios
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span>API de OpenAI</span>
                      </div>
                      <span className="text-xs text-muted-foreground">100%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span>Base de datos</span>
                      </div>
                      <span className="text-xs text-muted-foreground">100%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span>Firebase Auth</span>
                      </div>
                      <span className="text-xs text-muted-foreground">100%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                        <span>Almacenamiento</span>
                      </div>
                      <span className="text-xs text-muted-foreground">85%</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Verificar estado
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de usuarios</CardTitle>
                <CardDescription>
                  Administra los usuarios registrados en la plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <div className="flex gap-4">
                      <Input 
                        placeholder="Buscar usuarios..." 
                        className="w-[300px]"
                      />
                      <Button variant="secondary">Buscar</Button>
                    </div>
                    <Button>
                      Añadir usuario
                    </Button>
                  </div>
                  
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 p-4 font-medium">
                      <div>Usuario</div>
                      <div>Correo</div>
                      <div>Rol</div>
                      <div>Estado</div>
                      <div>Acciones</div>
                    </div>
                    <Separator />
                    
                    {[...Array(5)].map((_, i) => (
                      <React.Fragment key={i}>
                        <div className="grid grid-cols-5 p-4 items-center">
                          <div className="font-medium">Usuario_{i+1}</div>
                          <div className="text-muted-foreground">usuario{i+1}@example.com</div>
                          <div>{i === 0 ? "Admin" : i === 1 ? "Distribuidor" : "Cliente"}</div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${i !== 3 ? "bg-green-500" : "bg-muted"}`}></div>
                              <span>{i !== 3 ? "Activo" : "Inactivo"}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">Editar</Button>
                            <Button variant="destructive" size="sm">Eliminar</Button>
                          </div>
                        </div>
                        {i < 4 && <Separator />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Mostrando 5 de 24 usuarios
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" disabled>Anterior</Button>
                  <Button variant="outline" size="sm">Siguiente</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de contenido</CardTitle>
                <CardDescription>
                  Administra las imágenes, textos y páginas del sitio.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="media">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="media">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Multimedia
                    </TabsTrigger>
                    <TabsTrigger value="pages">
                      <FileText className="w-4 h-4 mr-2" />
                      Páginas
                    </TabsTrigger>
                    <TabsTrigger value="ai">
                      <Code className="w-4 h-4 mr-2" />
                      Modelos IA
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="media" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Biblioteca de imágenes</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {[...Array(9)].map((_, i) => (
                            <div key={i} className="aspect-square bg-muted rounded-md flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-muted-foreground" />
                            </div>
                          ))}
                        </div>
                        <Button className="w-full mt-4">
                          Subir imagen
                        </Button>
                      </div>
                      
                      <div>
                        <Label>Tipos de archivos permitidos</Label>
                        <div className="space-y-2 mt-2">
                          {['JPG', 'PNG', 'SVG', 'HEIC', 'WEBP'].map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Switch id={`allow-${type}`} defaultChecked />
                              <Label htmlFor={`allow-${type}`}>{type}</Label>
                            </div>
                          ))}
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <Label>Tamaño máximo de archivo</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Input type="number" defaultValue="10" className="w-20" />
                          <span>MB</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pages" className="mt-4">
                    <div className="rounded-md border">
                      <div className="grid grid-cols-4 p-4 font-medium">
                        <div>Título</div>
                        <div>URL</div>
                        <div>Estado</div>
                        <div>Acciones</div>
                      </div>
                      <Separator />
                      
                      {['Inicio', 'Diseño de Estudio', 'Smart Container', 'Piscinas Modulares'].map((page, i) => (
                        <React.Fragment key={i}>
                          <div className="grid grid-cols-4 p-4 items-center">
                            <div className="font-medium">{page}</div>
                            <div className="text-muted-foreground">/{page.toLowerCase().replace(/\s+/g, '-')}</div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span>Publicada</span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">Editar</Button>
                              <Button variant="outline" size="sm">Ver</Button>
                            </div>
                          </div>
                          {i < 3 && <Separator />}
                        </React.Fragment>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="ai" className="mt-4">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">OpenAI</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Modelo para chat</Label>
                                <Select defaultValue="gpt-4o">
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar modelo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Modelo para imágenes</Label>
                                <Select defaultValue="dall-e-3">
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar modelo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
                                    <SelectItem value="dall-e-2">DALL-E 2</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Switch id="openai-enabled" defaultChecked />
                                <Label htmlFor="openai-enabled">Activado</Label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Gemini</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Modelo</Label>
                                <Select defaultValue="gemini-pro">
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar modelo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                                    <SelectItem value="gemini-flash">Gemini Flash</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Temperatura</Label>
                                <Input type="number" defaultValue="0.7" min="0" max="1" step="0.1" />
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Switch id="gemini-enabled" defaultChecked />
                                <Label htmlFor="gemini-enabled">Activado</Label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Cuotas y límites</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label>Solicitudes por día</Label>
                                <Input type="number" defaultValue="100" />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Tokens máximos por solicitud</Label>
                                <Input type="number" defaultValue="4000" />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Imágenes por día</Label>
                                <Input type="number" defaultValue="50" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del sistema</CardTitle>
                <CardDescription>
                  Configura los aspectos técnicos de la plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="general">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">
                      <Settings2 className="w-4 h-4 mr-2" />
                      General
                    </TabsTrigger>
                    <TabsTrigger value="database">
                      <Database className="w-4 h-4 mr-2" />
                      Base de datos
                    </TabsTrigger>
                    <TabsTrigger value="api">
                      <Package className="w-4 h-4 mr-2" />
                      Integraciones
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general" className="mt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nombre del sitio</Label>
                          <Input defaultValue="Kasa Serena Designs" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>URL del sitio</Label>
                          <Input defaultValue="https://kasaserena.design" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Descripción del sitio</Label>
                        <Textarea defaultValue="Plataforma de diseño arquitectónico impulsada por IA en Puerto Rico." />
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-2">
                        <Label>Zona horaria</Label>
                        <Select defaultValue="america-puerto_rico">
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar zona horaria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="america-puerto_rico">America/Puerto Rico</SelectItem>
                            <SelectItem value="america-new_york">America/New York</SelectItem>
                            <SelectItem value="america-los_angeles">America/Los Angeles</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Idioma predeterminado</Label>
                        <Select defaultValue="es">
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar idioma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="en">Inglés</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-4 mt-4">
                        <div className="flex items-center space-x-2">
                          <Switch id="maintenance-mode" />
                          <Label htmlFor="maintenance-mode">Modo de mantenimiento</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch id="debug-mode" />
                          <Label htmlFor="debug-mode">Modo de depuración</Label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="database" className="mt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Estado de la base de datos</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between">
                                <span>Estado:</span>
                                <span className="font-medium text-green-500">Conectado</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tipo:</span>
                                <span className="font-medium">PostgreSQL</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Versión:</span>
                                <span className="font-medium">15.4</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tamaño:</span>
                                <span className="font-medium">154 MB</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="outline" className="w-full">
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Verificar conexión
                            </Button>
                          </CardFooter>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Acciones</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <Button variant="outline" className="w-full">
                                Generar respaldo
                              </Button>
                              <Button variant="outline" className="w-full">
                                Restaurar respaldo
                              </Button>
                              <Button variant="outline" className="w-full">
                                Optimizar tablas
                              </Button>
                              <Button variant="destructive" className="w-full">
                                Reiniciar base de datos
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Estadísticas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-muted rounded-md">
                              <p className="text-3xl font-bold">5</p>
                              <p className="text-sm text-muted-foreground">Tablas</p>
                            </div>
                            <div className="text-center p-4 bg-muted rounded-md">
                              <p className="text-3xl font-bold">24</p>
                              <p className="text-sm text-muted-foreground">Usuarios</p>
                            </div>
                            <div className="text-center p-4 bg-muted rounded-md">
                              <p className="text-3xl font-bold">132</p>
                              <p className="text-sm text-muted-foreground">Proyectos</p>
                            </div>
                            <div className="text-center p-4 bg-muted rounded-md">
                              <p className="text-3xl font-bold">87</p>
                              <p className="text-sm text-muted-foreground">Diseños</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="api" className="mt-4">
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Claves API</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>OpenAI API Key</Label>
                                <Input type="password" value="•••••••••••••••••••••••••••" readOnly />
                              </div>
                              <div className="space-y-2">
                                <Label>Estado</Label>
                                <div className="flex items-center space-x-2 h-10">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <span>Verificada</span>
                                </div>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Firebase API Key</Label>
                                <Input type="password" value="•••••••••••••••••••••••••••" readOnly />
                              </div>
                              <div className="space-y-2">
                                <Label>Estado</Label>
                                <div className="flex items-center space-x-2 h-10">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <span>Verificada</span>
                                </div>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Stripe API Key</Label>
                                <Input type="password" value="•••••••••••••••••••••••••••" readOnly />
                              </div>
                              <div className="space-y-2">
                                <Label>Estado</Label>
                                <div className="flex items-center space-x-2 h-10">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <span>Verificada</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full">
                            Actualizar claves API
                          </Button>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Webhooks</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between pb-4 border-b">
                              <div>
                                <p className="font-medium">Notificaciones por email</p>
                                <p className="text-sm text-muted-foreground">
                                  Envía correos cuando un usuario crea un nuevo diseño
                                </p>
                              </div>
                              <Switch />
                            </div>
                            
                            <div className="flex items-center justify-between pb-4 border-b">
                              <div>
                                <p className="font-medium">Stripe Checkout</p>
                                <p className="text-sm text-muted-foreground">
                                  Procesa pagos cuando se completa una cotización
                                </p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            
                            <div className="flex items-center justify-between pb-4">
                              <div>
                                <p className="font-medium">Notificaciones de Firebase</p>
                                <p className="text-sm text-muted-foreground">
                                  Envía notificaciones push a los usuarios
                                </p>
                              </div>
                              <Switch />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Guardar cambios</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
};

export default AdminPage;