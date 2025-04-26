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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ShieldAlert, Shield, Settings, Users, Database, HardDrive,
  FileText, Code, RefreshCw, AlertTriangle, Terminal,
  Server, Cpu, Activity, Lock
} from 'lucide-react';

const SuperAdminPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Verificar si el usuario tiene permisos para acceder al panel
  const hasSuperAdminPermission = isAuthenticated && user?.role === 'superadmin';

  // Redirigir si no tiene permisos
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Acceso restringido",
        description: "Debes iniciar sesión para acceder al panel de superadministrador.",
        variant: "destructive"
      });
      setLocation('/login');
    } else if (!hasSuperAdminPermission) {
      toast({
        title: "Permiso denegado",
        description: "No tienes permisos para acceder al panel de superadministrador.",
        variant: "destructive"
      });
      setLocation('/');
    }
  }, [isAuthenticated, hasSuperAdminPermission, toast, setLocation]);

  // Si no tiene permisos, mostrar mensaje de acceso restringido
  if (!isAuthenticated) {
    return null; // Redirigiendo a login
  }

  if (!hasSuperAdminPermission) {
    return (
      <div className="py-8">
        <SEO 
          title="Acceso restringido - Panel de Superadministrador"
          description="Acceso restringido al panel de superadministrador."
          noindex={true}
        />
        <Container>
          <Card className="max-w-md mx-auto p-6 text-center">
            <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h1 className="text-2xl font-semibold mb-4">Acceso restringido</h1>
            <p className="text-muted-foreground mb-6">
              No tienes permisos para acceder al panel de superadministrador. Esta herramienta está disponible solo para superadministradores.
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
        title="Panel de Superadministrador - Kasa Serena"
        description="Panel de superadministrador para gestionar el sistema."
        noindex={true}
      />
      
      <Container>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-destructive" />
              <h1 className="text-3xl font-semibold">Super Admin</h1>
            </div>
            <p className="text-muted-foreground">
              Panel de administración avanzada del sistema
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-right">
              <p className="font-medium">{user?.username}</p>
              <p className="text-destructive font-semibold">Superadmin</p>
            </div>
            <Button variant="destructive" size="sm">
              <Lock className="w-4 h-4 mr-2" />
              Modo Seguro
            </Button>
          </div>
        </div>
        
        <Card className="mb-6 border-destructive/20 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              <div>
                <h2 className="text-lg font-medium mb-1">Advertencia: Panel de Sistema Crítico</h2>
                <p className="text-sm">
                  Este panel proporciona acceso a herramientas de administración avanzadas que pueden afectar la estabilidad 
                  y seguridad del sistema. Asegúrate de entender completamente las consecuencias de cualquier cambio antes de realizarlo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="system" className="space-y-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="system">
              <Server className="w-4 h-4 mr-2" />
              Sistema
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Seguridad
            </TabsTrigger>
            <TabsTrigger value="database">
              <Database className="w-4 h-4 mr-2" />
              Base de datos
            </TabsTrigger>
            <TabsTrigger value="logs">
              <Terminal className="w-4 h-4 mr-2" />
              Registros
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="system">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      Estado del sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>CPU</span>
                        <span>32%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '32%' }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>RAM</span>
                        <span>47%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '47%' }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Almacenamiento</span>
                        <span>62%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '62%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full text-xs">
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Actualizar
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      Rendimiento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm border-b pb-2">
                        <span>Tiempo de respuesta</span>
                        <span className="font-medium">120ms</span>
                      </div>
                      <div className="flex justify-between text-sm border-b pb-2">
                        <span>Solicitudes/seg</span>
                        <span className="font-medium">24.5</span>
                      </div>
                      <div className="flex justify-between text-sm border-b pb-2">
                        <span>Usuarios activos</span>
                        <span className="font-medium">43</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Carga del servidor</span>
                        <span className="font-medium">1.2</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full text-xs">
                      <Activity className="w-3 h-3 mr-1" />
                      Ver métricas detalladas
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      Servicios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <span>Servidor API</span>
                        </div>
                        <span className="text-green-500">En línea</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <span>Base de datos</span>
                        </div>
                        <span className="text-green-500">En línea</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <span>Servidor Redis</span>
                        </div>
                        <span className="text-green-500">En línea</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                          <span>Servicio de colas</span>
                        </div>
                        <span className="text-amber-500">Advertencias</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="space-x-2">
                    <Button variant="outline" className="flex-1 text-xs">
                      Reiniciar
                    </Button>
                    <Button variant="outline" className="flex-1 text-xs">
                      Detener
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Configuración del sistema</CardTitle>
                  <CardDescription>
                    Ajustes avanzados del entorno de ejecución y componentes del sistema.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-base font-medium">Entorno</Label>
                        <div className="space-y-3 mt-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="env-production">Producción</Label>
                            <Switch id="env-production" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="env-debug">Modo Debug</Label>
                            <Switch id="env-debug" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="env-maintenance">Modo Mantenimiento</Label>
                            <Switch id="env-maintenance" />
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <Label className="text-base font-medium">Caché</Label>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div className="space-y-2">
                            <Label>Tiempo de vida (TTL)</Label>
                            <div className="flex items-center space-x-2">
                              <Input type="number" defaultValue="3600" className="w-full" />
                              <span className="text-sm text-muted-foreground">seg</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Tamaño máximo</Label>
                            <div className="flex items-center space-x-2">
                              <Input type="number" defaultValue="200" className="w-full" />
                              <span className="text-sm text-muted-foreground">MB</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" className="mt-3">
                          Vaciar caché
                        </Button>
                      </div>
                      
                      <div>
                        <Label className="text-base font-medium">Variables de entorno</Label>
                        <Textarea 
                          className="font-mono text-xs h-[150px] mt-3"
                          defaultValue={`NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://user:pass@host:5432/dbname
REDIS_URL=redis://localhost:6379
SESSION_SECRET=s3cr3t_k3y
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000`}
                        />
                        <div className="flex space-x-2 mt-3">
                          <Button variant="outline">Guardar</Button>
                          <Button variant="outline">Reiniciar</Button>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <Label className="text-base font-medium">Herramientas del sistema</Label>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <Button variant="outline">Diagnosticar</Button>
                          <Button variant="outline">Optimizar</Button>
                          <Button variant="outline">Sincronizar</Button>
                          <Button variant="destructive">Reiniciar sistema</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="security">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Permisos y roles</CardTitle>
                  <CardDescription>
                    Gestión de permisos y roles de usuario en el sistema.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b">
                      <div className="flex gap-4">
                        <Input placeholder="Buscar roles..." className="w-[300px]" />
                        <Button variant="secondary">Buscar</Button>
                      </div>
                      <Button>
                        Crear nuevo rol
                      </Button>
                    </div>
                    
                    <div className="rounded-md border">
                      <div className="grid grid-cols-4 p-4 font-medium">
                        <div>Rol</div>
                        <div>Descripción</div>
                        <div>Permisos</div>
                        <div>Acciones</div>
                      </div>
                      <Separator />
                      
                      {[
                        { role: 'superadmin', description: 'Acceso completo a todas las funciones del sistema', permissions: 'Todos' },
                        { role: 'admin', description: 'Gestión de usuarios, contenido y configuración', permissions: '25/30' },
                        { role: 'distribuidor', description: 'Gestión de inventario y precios', permissions: '15/30' },
                        { role: 'cliente', description: 'Acceso a funciones básicas del sistema', permissions: '10/30' },
                      ].map((item, i) => (
                        <React.Fragment key={i}>
                          <div className="grid grid-cols-4 p-4 items-center">
                            <div className="font-medium">{item.role}</div>
                            <div className="text-muted-foreground">{item.description}</div>
                            <div>{item.permissions}</div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">Editar</Button>
                              {item.role !== 'superadmin' && (
                                <Button variant="destructive" size="sm">Eliminar</Button>
                              )}
                            </div>
                          </div>
                          {i < 3 && <Separator />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de seguridad</CardTitle>
                    <CardDescription>
                      Ajustes de seguridad y políticas del sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-base font-medium">Política de contraseñas</Label>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="password-length">Longitud mínima</Label>
                          <Input id="password-length" type="number" defaultValue="8" className="w-20" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="password-uppercase" defaultChecked />
                          <Label htmlFor="password-uppercase">Requerir mayúsculas</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="password-numbers" defaultChecked />
                          <Label htmlFor="password-numbers">Requerir números</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="password-special" defaultChecked />
                          <Label htmlFor="password-special">Requerir caracteres especiales</Label>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label className="text-base font-medium">Sesiones</Label>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="session-expiry">Expiración de sesión</Label>
                          <Input id="session-expiry" type="number" defaultValue="24" className="w-20" />
                          <span className="text-sm text-muted-foreground">horas</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="session-ip-lock" defaultChecked />
                          <Label htmlFor="session-ip-lock">Bloquear sesión a IP</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="session-concurrent" />
                          <Label htmlFor="session-concurrent">Permitir sesiones concurrentes</Label>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label className="text-base font-medium">Autenticación en dos pasos</Label>
                        <div className="flex items-center space-x-2">
                          <Switch id="2fa-enabled" defaultChecked />
                          <Label htmlFor="2fa-enabled">Activado para superadmin</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="2fa-admin" defaultChecked />
                          <Label htmlFor="2fa-admin">Activado para admin</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="2fa-users" />
                          <Label htmlFor="2fa-users">Activado para usuarios</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Guardar configuración</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Registros de seguridad</CardTitle>
                    <CardDescription>
                      Historial de eventos de seguridad del sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[380px]">
                      <div className="space-y-4">
                        {[...Array(10)].map((_, i) => (
                          <div key={i} className="border-b pb-3">
                            <div className="flex justify-between mb-1">
                              <p className="font-medium">{
                                i % 3 === 0 ? "Intento de acceso fallido" :
                                i % 3 === 1 ? "Cambio de contraseña" :
                                "Inicio de sesión exitoso"
                              }</p>
                              <p className="text-sm text-muted-foreground">
                                {`hace ${i + 1} ${i === 0 ? 'minuto' : 'minutos'}`}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {i % 3 === 0 ? "3 intentos fallidos para la cuenta admin@ejemplo.com desde 192.168.1.1" :
                               i % 3 === 1 ? "El usuario admin@ejemplo.com cambió su contraseña" :
                               "El usuario usuario@ejemplo.com inició sesión correctamente desde 192.168.1.1"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Ver todos los registros</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="database">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Administración de base de datos</CardTitle>
                  <CardDescription>
                    Herramientas avanzadas para la gestión de la base de datos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-destructive/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Conexión</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-1">
                            <div className="font-medium">Host:</div>
                            <div className="col-span-2">postgres.example.com</div>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            <div className="font-medium">Puerto:</div>
                            <div className="col-span-2">5432</div>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            <div className="font-medium">Nombre:</div>
                            <div className="col-span-2">kasaserena_prod</div>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            <div className="font-medium">Usuario:</div>
                            <div className="col-span-2">kasa_admin</div>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            <div className="font-medium">SSL:</div>
                            <div className="col-span-2">Activado</div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" className="w-full text-xs">
                          Reiniciar conexión
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Estadísticas</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-1">
                            <div className="font-medium">Tamaño:</div>
                            <div className="col-span-2">243 MB</div>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            <div className="font-medium">Tablas:</div>
                            <div className="col-span-2">24</div>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            <div className="font-medium">Índices:</div>
                            <div className="col-span-2">42</div>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            <div className="font-medium">Conexiones:</div>
                            <div className="col-span-2">5 / 100</div>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            <div className="font-medium">Uptime:</div>
                            <div className="col-span-2">14d 6h 32m</div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" className="w-full text-xs">
                          Ver detalles
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Acciones</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full text-xs">Optimizar tablas</Button>
                          <Button variant="outline" className="w-full text-xs">Crear respaldo</Button>
                          <Button variant="outline" className="w-full text-xs">Restaurar respaldo</Button>
                          <Button variant="outline" className="w-full text-xs">Vaciar cache</Button>
                          <Button variant="destructive" className="w-full text-xs">Migrar base de datos</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Consulta SQL directa</h3>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Guardar</Button>
                        <Button variant="outline" size="sm">Cargar</Button>
                        <Button size="sm">Ejecutar</Button>
                      </div>
                    </div>
                    
                    <Textarea 
                      className="font-mono text-sm h-[100px] mb-4"
                      placeholder="-- Introduce tu consulta SQL aquí"
                    />
                    
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm">Resultados</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="text-sm text-muted-foreground p-4 text-center">
                          Ejecuta una consulta para ver los resultados aquí
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="text-xs text-destructive mt-2">
                      <AlertTriangle className="w-3 h-3 inline mr-1" />
                      Advertencia: Las consultas SQL directas pueden modificar o eliminar datos. Utiliza con precaución.
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">Operaciones peligrosas</CardTitle>
                  <CardDescription>
                    Estas operaciones pueden causar daños graves al sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <div>
                        <p className="font-medium">Restablecer base de datos</p>
                        <p className="text-sm text-muted-foreground">
                          Restaura la base de datos a su estado inicial. Se perderán todos los datos.
                        </p>
                      </div>
                      <Button variant="destructive">Restablecer</Button>
                    </div>
                    
                    <div className="flex items-center justify-between pb-4 border-b">
                      <div>
                        <p className="font-medium">Eliminar todos los usuarios</p>
                        <p className="text-sm text-muted-foreground">
                          Elimina todos los usuarios excepto el superadministrador.
                        </p>
                      </div>
                      <Button variant="destructive">Eliminar</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Migrar a nueva infraestructura</p>
                        <p className="text-sm text-muted-foreground">
                          Migra toda la base de datos a un nuevo servidor. El sistema estará inaccesible durante la migración.
                        </p>
                      </div>
                      <Button variant="destructive">Migrar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="logs">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Registros del sistema</CardTitle>
                  <CardDescription>
                    Visualización y análisis de los registros del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2 items-center">
                      <Input placeholder="Buscar en registros..." className="w-[300px]" />
                      <Button variant="secondary">Buscar</Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <option value="all">Todos los niveles</option>
                        <option value="error">Error</option>
                        <option value="warn">Advertencia</option>
                        <option value="info">Información</option>
                        <option value="debug">Debug</option>
                      </select>
                      
                      <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <option value="all">Todos los componentes</option>
                        <option value="api">API</option>
                        <option value="db">Base de datos</option>
                        <option value="auth">Autenticación</option>
                        <option value="ai">Servicios IA</option>
                      </select>
                      
                      <Button variant="outline">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Card>
                    <CardContent className="p-0">
                      <div className="font-mono text-sm">
                        <div className="bg-muted p-2 flex justify-between text-xs border-b">
                          <span>Tiempo</span>
                          <span>Nivel</span>
                          <span>Componente</span>
                          <span className="flex-grow pl-4">Mensaje</span>
                        </div>
                        
                        <ScrollArea className="h-[400px]">
                          {[...Array(15)].map((_, i) => (
                            <div key={i} className={`p-2 border-b flex ${i % 4 === 0 ? 'text-destructive' : i % 4 === 1 ? 'text-amber-500' : ''}`}>
                              <span className="w-[140px] text-xs">{new Date().toISOString()}</span>
                              <span className="w-[70px] text-xs">{
                                i % 4 === 0 ? 'ERROR' : 
                                i % 4 === 1 ? 'WARN' : 
                                i % 4 === 2 ? 'INFO' : 'DEBUG'
                              }</span>
                              <span className="w-[120px] text-xs">{
                                i % 5 === 0 ? 'DB' : 
                                i % 5 === 1 ? 'API' : 
                                i % 5 === 2 ? 'AUTH' : 
                                i % 5 === 3 ? 'AI' : 'SYSTEM'
                              }</span>
                              <span className="flex-grow text-xs truncate">
                                {i % 4 === 0 
                                  ? 'Error en conexión a base de datos: timeout después de 30s' 
                                  : i % 4 === 1 
                                  ? 'Demasiados intentos de inicio de sesión fallidos para usuario admin'
                                  : i % 4 === 2
                                  ? 'Usuario user1234 inició sesión correctamente'
                                  : 'Carga de aplicación completada en 1243ms'}
                              </span>
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">
                      Mostrando 15 de 10,432 registros
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Exportar registros</Button>
                      <Button variant="outline" size="sm">Limpiar registros</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Registros de acceso</CardTitle>
                    <CardDescription>
                      Historial de accesos al sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="flex justify-between border-b pb-3">
                            <div>
                              <p className="font-medium">{`usuario${i+1}@ejemplo.com`}</p>
                              <p className="text-sm text-muted-foreground">
                                {i % 2 === 0 ? "Inicio de sesión exitoso" : "Cierre de sesión"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm">{`192.168.1.${i+1}`}</p>
                              <p className="text-xs text-muted-foreground">
                                {`hace ${i+1} ${i === 0 ? 'minuto' : 'minutos'}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Errores críticos</CardTitle>
                    <CardDescription>
                      Alertas de errores graves del sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="p-3 border rounded-md bg-destructive/5 border-destructive/20">
                            <div className="flex justify-between mb-1">
                              <h4 className="font-medium text-destructive">{
                                i === 0 ? "Error de conexión a base de datos" :
                                i === 1 ? "Fallo en servicio de AI" :
                                "Error de autenticación OAuth"
                              }</h4>
                              <p className="text-xs text-muted-foreground">
                                {`hace ${(i+1) * 2} horas`}
                              </p>
                            </div>
                            <p className="text-sm mb-2">{
                              i === 0 ? "Timeout en conexión a PostgreSQL después de 30s de espera" :
                              i === 1 ? "La API de OpenAI respondió con error 429: Rate limit exceeded" :
                              "Token de Firebase expirado o inválido"
                            }</p>
                            <div className="text-xs bg-muted p-2 rounded font-mono">
                              {i === 0 ? "Error: ConnectTimeoutError at Database.connect (/server/db.js:42:11)" :
                               i === 1 ? "Error: RateLimitError: 429 Too Many Requests at OpenAIClient.request (/server/ai.js:87:13)" :
                               "Error: FirebaseAuthError: Invalid token at verifyToken (/server/auth.js:124:9)"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Ver todos los errores</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
};

export default SuperAdminPage;