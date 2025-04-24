import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { apiRequest } from '@/lib/queryClient';

// Definir tipo para las fases
interface Phase {
  id: number;
  name: string;
  completed: boolean;
  items: {
    name: string;
    completed: boolean;
  }[];
}

// Tipo para endpoints activos
interface Endpoint {
  path: string;
  method: string;
  description: string;
  protected: boolean;
  roles: string[];
  active: boolean;
}

const AgentChecklist = () => {
  // Estado inicial de las fases
  const [phases, setPhases] = useState<Phase[]>([
    {
      id: 1,
      name: "Reorganización por Feature Folders",
      completed: true,
      items: [
        { name: "Reestructurar componentes en carpetas por funcionalidad", completed: true },
        { name: "Limpiar archivos duplicados", completed: true },
        { name: "Actualizar importaciones en todas las páginas", completed: true },
        { name: "Verificar que HomePage funcione sin errores", completed: true }
      ]
    },
    {
      id: 2,
      name: "Sistema de Autenticación y Roles",
      completed: true,
      items: [
        { name: "Implementar roles: cliente, diseñador, admin", completed: true },
        { name: "Proteger rutas sensibles", completed: true },
        { name: "Agregar verificación de sesión y redirección", completed: true },
        { name: "Añadir selector de rol en formulario de registro", completed: true },
        { name: "Proteger endpoints sensibles", completed: true }
      ]
    },
    {
      id: 3,
      name: "Interfaz Visual de Navegación y HomePage",
      completed: true,
      items: [
        { name: "Diseño de Hero Section, Servicios, Contacto", completed: true },
        { name: "Integrar video de fondo y assets", completed: true },
        { name: "Asegurar diseño mobile responsive", completed: true },
        { name: "Conectar secciones a sus páginas respectivas", completed: true }
      ]
    },
    {
      id: 4,
      name: "Generador Visual con IA",
      completed: false,
      items: [
        { name: "Conectar PromptDesignGenerator con Gemini API", completed: true },
        { name: "Mostrar render de diseño, descripción, materiales y tiempos", completed: true },
        { name: "Permitir generación desde parámetros y conversacional", completed: false },
        { name: "Habilitar descarga o cotización directa", completed: false }
      ]
    },
    {
      id: 5,
      name: "Smart Containers (Diseño Inteligente)",
      completed: false,
      items: [
        { name: "Activar módulo SmartContainerPage", completed: true },
        { name: "Formulario para tipo de uso, fachada, energía, tamaño, tech", completed: true },
        { name: "Conectar a /api/smart-container y mostrar resultados", completed: true },
        { name: "Integrar opción de cotización", completed: false }
      ]
    },
    {
      id: 6,
      name: "Piscinas Modulares",
      completed: false,
      items: [
        { name: "Activar página /modular-pool", completed: true },
        { name: "Inputs: medidas, profundidad, vidrio, acabados, entorno", completed: true },
        { name: "Generar imagen IA y descripción", completed: true },
        { name: "Integrar opción de cotización automática", completed: false }
      ]
    },
    {
      id: 7,
      name: "Chat AI de Diseño",
      completed: false,
      items: [
        { name: "Activar ChatDesignGenerator.tsx", completed: false },
        { name: "Conectar a /api/design-chat", completed: false },
        { name: "Respuestas dinámicas contextualizadas", completed: false },
        { name: "Posibilidad de enviar imágenes y obtener sugerencias", completed: false }
      ]
    },
    {
      id: 8,
      name: "Dashboard de Usuario",
      completed: false,
      items: [
        { name: "Mostrar proyectos y cotizaciones del usuario", completed: false },
        { name: "Permitir descargar imágenes generadas", completed: false },
        { name: "Sección para feedback o solicitud de ajustes", completed: false },
        { name: "Protección por sesión y rol", completed: true }
      ]
    },
    {
      id: 9,
      name: "Cotización y Contacto",
      completed: true,
      items: [
        { name: "Implementar formulario de cotización completo", completed: true },
        { name: "Integración con WhatsApp para compartir cotizaciones", completed: true },
        { name: "Exportación a PDF de cotizaciones", completed: true },
        { name: "Visualización de cotizaciones en Dashboard", completed: true }
      ]
    },
    {
      id: 10,
      name: "Seguridad, Deploy y Optimización",
      completed: false,
      items: [
        { name: "Prefetch de rutas", completed: false },
        { name: "SEO dinámico (title/meta por página)", completed: false },
        { name: "Optimización de imágenes", completed: false },
        { name: "Firebase deploy con dominio en producción", completed: false },
        { name: "Activar logs y alertas", completed: false }
      ]
    }
  ]);

  // Endpoints activos
  const [endpoints, setEndpoints] = useState<Endpoint[]>([
    { path: "/api/login", method: "POST", description: "Iniciar sesión", protected: false, roles: [], active: true },
    { path: "/api/register", method: "POST", description: "Registrar usuario", protected: false, roles: [], active: true },
    { path: "/api/logout", method: "POST", description: "Cerrar sesión", protected: true, roles: ["cliente", "diseñador", "admin"], active: true },
    { path: "/api/user", method: "GET", description: "Obtener usuario actual", protected: true, roles: ["cliente", "diseñador", "admin"], active: true },
    { path: "/api/smart-container", method: "POST", description: "Generar diseño de Smart Container", protected: true, roles: ["cliente", "diseñador", "admin"], active: true },
    { path: "/api/modular-pool", method: "POST", description: "Generar diseño de Piscina Modular", protected: true, roles: ["cliente", "diseñador", "admin"], active: true },
    { path: "/api/design-generator", method: "POST", description: "Generar diseño personalizado", protected: true, roles: ["cliente", "diseñador", "admin"], active: true },
    { path: "/api/design-chat", method: "POST", description: "Chat con asistente de diseño", protected: true, roles: ["diseñador", "admin"], active: false },
    { path: "/api/materials", method: "GET", description: "Obtener materiales", protected: true, roles: ["cliente", "diseñador", "admin"], active: true },
    { path: "/api/materials", method: "POST", description: "Crear material", protected: true, roles: ["admin"], active: true },
    { path: "/api/distributors", method: "GET", description: "Obtener distribuidores", protected: true, roles: ["cliente", "diseñador", "admin"], active: true },
    { path: "/api/projects", method: "GET", description: "Obtener proyectos", protected: true, roles: ["diseñador", "admin"], active: true },
    { path: "/api/projects", method: "POST", description: "Crear proyecto", protected: true, roles: ["diseñador", "admin"], active: true },
    { path: "/api/quotes", method: "POST", description: "Solicitar cotización", protected: true, roles: ["cliente", "diseñador", "admin"], active: true },
    { path: "/api/quotes", method: "GET", description: "Obtener cotizaciones", protected: true, roles: ["cliente", "diseñador", "admin"], active: true },
    { path: "/api/contact", method: "POST", description: "Enviar mensaje de contacto", protected: false, roles: [], active: true },
    { path: "/api/image-analysis", method: "POST", description: "Analizar imagen", protected: true, roles: ["diseñador", "admin"], active: true },
    { path: "/api/upload-heic", method: "POST", description: "Convertir imagen HEIC", protected: true, roles: ["cliente", "diseñador", "admin"], active: true },
  ]);

  // Componentes UI activos
  const [uiComponents, setUiComponents] = useState([
    { name: "HomePage", path: "/", active: true },
    { name: "Login/Register", path: "/login", active: true },
    { name: "Smart Container Generator", path: "/smart-container", active: true },
    { name: "Modular Pool Designer", path: "/modular-pool", active: true },
    { name: "AI Design Generator", path: "/design-generator", active: true },
    { name: "Chat AI de Diseño", path: "/design-chat", active: false },
    { name: "Dashboard de Usuario", path: "/dashboard", active: true },
    { name: "Perfil de Usuario", path: "/profile", active: true },
    { name: "Cotización", path: "/solicitar-cotizacion", active: true },
    { name: "Mis Cotizaciones", path: "/cotizaciones", active: true },
    { name: "Contacto", path: "/contacto", active: true },
    { name: "Admin Panel", path: "/admin", active: false },
  ]);

  // Verificar estado de endpoints
  const { data: serverStatus, isLoading } = useQuery({
    queryKey: ['/api/health-check'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/health-check');
        return await response.json();
      } catch (error) {
        console.error('Error al verificar estado del servidor:', error);
        return { status: 'error' };
      }
    },
    retry: 1
  });

  // Calcular progreso total
  const calculateProgress = () => {
    const completedPhases = phases.filter(phase => phase.completed).length;
    return (completedPhases / phases.length) * 100;
  };

  // Actualizar estado de fase al marcar/desmarcar items
  const updatePhaseStatus = (phaseId: number) => {
    setPhases(prevPhases => 
      prevPhases.map(phase => {
        if (phase.id === phaseId) {
          const allItemsCompleted = phase.items.every(item => item.completed);
          return { ...phase, completed: allItemsCompleted };
        }
        return phase;
      })
    );
  };

  // Manejar cambio en checkbox de item
  const handleItemChange = (phaseId: number, itemName: string, checked: boolean) => {
    setPhases(prevPhases => 
      prevPhases.map(phase => {
        if (phase.id === phaseId) {
          const updatedItems = phase.items.map(item => 
            item.name === itemName ? { ...item, completed: checked } : item
          );
          return { ...phase, items: updatedItems };
        }
        return phase;
      })
    );

    updatePhaseStatus(phaseId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Kasa Serena - Mapa de Implementación</h1>
      
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Progreso General</span>
              <Badge variant={calculateProgress() === 100 ? "success" : "secondary"}>
                {Math.round(calculateProgress())}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-secondary rounded-full h-4">
              <div 
                className="bg-primary h-4 rounded-full transition-all duration-500"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Estado del Servidor</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full mr-2 ${serverStatus?.status === 'ok' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{serverStatus?.status === 'ok' ? 'Servidor activo' : 'Servidor inactivo'}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sesión y Autenticación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <span>Sistema de autenticación activo</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <span>Control de roles implementado</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <span>Middleware de protección activo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Fases de Implementación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {phases.map((phase) => (
                <div key={phase.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Fase {phase.id}: {phase.name}
                    </h3>
                    <Badge variant={phase.completed ? "success" : "outline"}>
                      {phase.completed ? "Completado" : "Pendiente"}
                    </Badge>
                  </div>
                  <div className="ml-6 space-y-2">
                    {phase.items.map((item) => (
                      <div key={item.name} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${phase.id}-${item.name}`}
                          checked={item.completed}
                          onCheckedChange={(checked) => 
                            handleItemChange(phase.id, item.name, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={`${phase.id}-${item.name}`}
                          className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {item.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  {phase.id < phases.length && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Endpoints Activos</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left pb-2">Ruta</th>
                  <th className="text-left pb-2">Método</th>
                  <th className="text-left pb-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map((endpoint, index) => (
                  <tr key={`${endpoint.path}-${endpoint.method}`} className="border-t">
                    <td className="py-2">{endpoint.path}</td>
                    <td className="py-2">{endpoint.method}</td>
                    <td className="py-2">
                      <Badge variant={endpoint.active ? "success" : "outline"} className="text-xs">
                        {endpoint.active ? "Activo" : "Pendiente"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Componentes UI</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left pb-2">Componente</th>
                  <th className="text-left pb-2">Ruta</th>
                  <th className="text-left pb-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {uiComponents.map((component, index) => (
                  <tr key={component.path} className="border-t">
                    <td className="py-2">{component.name}</td>
                    <td className="py-2">{component.path}</td>
                    <td className="py-2">
                      <Badge variant={component.active ? "success" : "outline"} className="text-xs">
                        {component.active ? "Activo" : "Pendiente"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentChecklist;