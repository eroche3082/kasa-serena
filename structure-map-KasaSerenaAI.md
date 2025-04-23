# 📘 Mapa Estructural Completo - Kasa Serena Designs

## 📍1. Mapa de Rutas

### Frontend (Cliente)
| Ruta | Tipo | Archivo | Componente Principal | Descripción |
|------|------|---------|----------------------|-------------|
| `/` | Pública | `client/src/pages/HomePage.tsx` | `HomePage` | Página principal del sitio |
| `/design-studio` | Pública | `client/src/pages/DesignStudioPage.tsx` | `DesignStudioPage` | Estudio de diseño interactivo |
| `/profile` | Protegida | `client/src/pages/ProfilePage.tsx` | `ProfilePage` | Perfil de usuario |
| `/dashboard` | Protegida | `client/src/pages/DashboardPage.tsx` | `DashboardPage` | Panel de control del usuario |
| `/login` | Pública | `client/src/pages/LoginPage.tsx` | `LoginPage` | Página de inicio de sesión |
| `/ai-visualization` | Pública | `client/src/pages/AIVisualizationDemo.tsx` | `AIVisualizationDemo` | Demostración de visualización IA |
| `/design-generator` | Pública | `client/src/pages/DesignGeneratorPage.tsx` | `DesignGeneratorPage` | Generador de diseños básico |
| `/ai-design` | Pública | `client/src/pages/AIDesignPage.tsx` | `AIDesignPage` | Diseños generados por IA |
| `/smart-container` | Pública | `client/src/pages/SmartContainerPage.tsx` | `SmartContainerPage` | Generador de contenedores inteligentes |
| `/modular-pool` | Pública | `client/src/pages/ModularPoolPage.tsx` | `ModularPoolPage` | Diseñador de piscinas modulares |
| `/*` | Pública | `client/src/pages/not-found.tsx` | `NotFound` | Página 404 |

### Backend (API)
| Ruta | Método | Tipo | Ubicación | Descripción |
|------|--------|------|-----------|-------------|
| `/api/register` | POST | Pública | `server/routes.ts` | Registro de usuario |
| `/api/login` | POST | Pública | `server/routes.ts` | Inicio de sesión |
| `/api/logout` | POST | Protegida | `server/routes.ts` | Cierre de sesión |
| `/api/user` | GET | Protegida | `server/routes.ts` | Obtener datos del usuario actual |
| `/api/projects` | GET | Pública | `server/routes.ts` | Obtener todos los proyectos |
| `/api/projects/user` | GET | Protegida | `server/routes.ts` | Obtener proyectos del usuario autenticado |
| `/api/projects/:id` | GET | Pública | `server/routes.ts` | Obtener un proyecto específico |
| `/api/projects` | POST | Protegida | `server/routes.ts` | Crear un nuevo proyecto |
| `/api/projects/:id` | PUT | Protegida | `server/routes.ts` | Actualizar un proyecto existente |
| `/api/projects/:id` | DELETE | Protegida | `server/routes.ts` | Eliminar un proyecto |
| `/api/analyze-image` | POST | Protegida | `server/routes.ts` | Analizar imagen con IA |
| `/api/generate-preview` | POST | Protegida | `server/routes.ts` | Generar vista previa de diseño |
| `/api/estimate-cost` | POST | Protegida | `server/routes.ts` | Estimar costo de diseño |
| `/api/design-chat` | POST | Pública | `server/routes.ts` | Chat con asistente de diseño |
| `/api/generate-design` | POST | Pública | `server/routes.ts` | Generar diseño con Gemini |
| `/api/analyze-design-image` | POST | Pública | `server/routes.ts` | Analizar imagen de diseño con Gemini |
| `/api/design-suggestions` | POST | Pública | `server/routes.ts` | Obtener sugerencias de diseño |
| `/api/design-from-prompt` | POST | Pública | `server/routes.ts` | Generar diseño desde prompt |
| `/api/smart-container` | POST | Pública | `server/routes.ts` | Generar diseño de Smart Container |
| `/api/pool-designer` | POST | Pública | `server/routes.ts` | Generar diseño de piscina modular |
| `/api/materials` | GET | Pública | `server/routes.ts` | Obtener todos los materiales |
| `/api/materials/type/:type` | GET | Pública | `server/routes.ts` | Obtener materiales por tipo |
| `/api/distributors` | GET | Pública | `server/routes.ts` | Obtener todos los distribuidores |
| `/api/distributors/:id` | GET | Pública | `server/routes.ts` | Obtener un distribuidor específico |
| `/api/contact` | POST | Pública | `server/routes.ts` | Enviar mensaje de contacto |
| `/api/quotes` | POST | Protegida | `server/routes.ts` | Crear una cotización |
| `/api/quotes` | GET | Protegida | `server/routes.ts` | Obtener cotizaciones del usuario |
| `/api/convert-heic` | POST | Pública | `server/routes.ts` | Convertir imagen HEIC a JPEG |

## 📂2. Estructura de Carpetas

```
/
├── client/                      # Frontend
│   ├── src/                     # Código fuente del cliente
│   │   ├── assets/              # Recursos estáticos (imágenes, CSS)
│   │   ├── components/          # Componentes React
│   │   │   ├── design/          # Componentes relacionados con diseño
│   │   │   ├── home/            # Componentes de la página principal
│   │   │   ├── layout/          # Componentes de estructura (Header, Footer)
│   │   │   └── ui/              # Componentes de UI reutilizables (Shadcn)
│   │   ├── context/             # Contextos de React (AuthContext, DesignContext)
│   │   ├── hooks/               # Hooks personalizados
│   │   ├── lib/                 # Utilidades y servicios
│   │   └── pages/               # Páginas/rutas de la aplicación
│   ├── public/                  # Archivos públicos
│   └── index.html               # Punto de entrada HTML
│
├── server/                      # Backend
│   ├── db.ts                    # Configuración de la base de datos
│   ├── gemini.ts                # Integración con Gemini API
│   ├── openai.ts                # Integración con OpenAI
│   ├── poolDesigner.ts          # Lógica para diseño de piscinas
│   ├── routes.ts                # Definición de rutas API
│   ├── smartContainer.ts        # Lógica para Smart Containers
│   ├── storage.ts               # Capa de acceso a datos
│   └── vite.ts                  # Configuración de Vite para servidor
│
├── shared/                      # Código compartido entre cliente y servidor
│   ├── schema.ts                # Esquema de base de datos (Drizzle)
│   └── types.ts                 # Tipos compartidos
│
├── attached_assets/             # Recursos externos para el proyecto
│   ├── imágenes/                # Imágenes para la aplicación
│   └── textos/                  # Documentos de especificaciones
│
├── drizzle.config.ts            # Configuración de Drizzle ORM
├── firebase.json                # Configuración de Firebase
├── package.json                 # Dependencias y scripts
├── tailwind.config.ts           # Configuración de Tailwind CSS
├── tsconfig.json                # Configuración de TypeScript
└── vite.config.ts               # Configuración principal de Vite
```

## 🧩3. Componentes por Página

### Página Principal (`HomePage`)
- **Componentes principales:**
  - `HeroSection` - Sección principal con video de fondo (`client/src/components/home`)
  - `FeaturedProjects` - Proyectos destacados (`client/src/components/home`)
  - `ServicesList` - Lista de servicios ofrecidos (`client/src/components/home`)
  - `TestimonialSlider` - Carrusel de testimonios (`client/src/components/home`)
  - **Tipo:** Visual y presentacional

### Estudio de Diseño (`DesignStudioPage`)
- **Componentes principales:**
  - `DesignCanvas` - Área de diseño interactivo (`client/src/components/design`)
  - `ToolsPanel` - Panel de herramientas de diseño (`client/src/components/design`)
  - `MaterialSelector` - Selector de materiales (`client/src/components/design`)
  - **Tipo:** Funcional e interactivo

### Panel de Control (`DashboardPage`)
- **Componentes principales:**
  - `ProjectsList` - Lista de proyectos del usuario (`client/src/components/dashboard`)
  - `QuotesList` - Lista de cotizaciones (`client/src/components/dashboard`)
  - `ProgressSummary` - Resumen de progreso (`client/src/components/dashboard`)
  - **Tipo:** Funcional

### AI Visualization Demo (`AIVisualizationDemo`)
- **Componentes principales:**
  - `AIVisualization` - Componente de visualización IA (`client/src/components/design/AIVisualization.tsx`)
  - `ImageUploader` - Carga de imágenes (`client/src/components/design/ImageUploader.tsx`)
  - `BasicAIVisualization` - Versión básica (`client/src/components/design/BasicAIVisualization.tsx`)
  - **Tipo:** Funcional e interactivo

### Generador de Diseños (`DesignGeneratorPage`)
- **Componentes principales:**
  - `DesignGenerator` - Generador principal (`client/src/components/design/DesignGenerator.tsx`)
  - `SelectionPanel` - Panel de selección (`client/src/components/design/SelectionPanel.tsx`)
  - **Tipo:** Funcional

### Diseños AI (`AIDesignPage`)
- **Componentes principales:**
  - `ChatDesignGenerator` - Interfaz conversacional (`client/src/components/design/ChatDesignGenerator.tsx`)
  - `PromptDesignGenerator` - Interfaz basada en prompts (`client/src/components/design/PromptDesignGenerator.tsx`)
  - `ChatAssistant` - Asistente de chat (`client/src/components/design/ChatAssistant.tsx`)
  - **Tipo:** Funcional e interactivo

### Smart Container (`SmartContainerPage`)
- **Componentes principales:**
  - `SmartContainerGenerator` - Generador de contenedores (`client/src/components/design/SmartContainerGenerator.tsx`) 
  - **Tipo:** Funcional e interactivo

### Modular Pool (`ModularPoolPage`)
- **Componentes principales:**
  - `ModularPoolDesigner` - Diseñador de piscinas (`client/src/components/design/ModularPoolDesigner.tsx`)
  - **Tipo:** Funcional e interactivo

### Login (`LoginPage`)
- **Componentes principales:**
  - `LoginForm` - Formulario de inicio de sesión (`client/src/components/auth`)
  - `RegisterForm` - Formulario de registro (`client/src/components/auth`)
  - **Tipo:** Funcional

## 🔌4. APIs y Servicios Activos

### Integración con Firebase
- **Configuración:** `client/src/lib/firebase.ts`
- **Uso:** Autenticación y almacenamiento
- **Métodos API:** No se usa directamente API REST, sino SDK
- **Páginas que lo utilizan:** `LoginPage`, `ProfilePage`
- **Variables de entorno requeridas:** 
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_APP_ID`

### Integración con Gemini
- **Configuración:** `server/gemini.ts`
- **Uso:** Generación y análisis de diseños con IA
- **Métodos API:** Múltiples funciones para análisis de imágenes, generación de diseños y chat
- **Páginas que lo utilizan:** `AIDesignPage`, `SmartContainerPage`, `ModularPoolPage`
- **Rutas API:** 
  - `/api/generate-design` (POST)
  - `/api/analyze-design-image` (POST)
  - `/api/design-suggestions` (POST)
  - `/api/design-chat` (POST)
  - `/api/design-from-prompt` (POST)

### Integración con OpenAI
- **Configuración:** `server/openai.ts`
- **Uso:** Análisis de imágenes y generación de diseños
- **Métodos API:** Funciones para análisis de imágenes y generación
- **Páginas que lo utilizan:** `AIVisualizationDemo`
- **Rutas API:**
  - `/api/analyze-image` (POST)
  - `/api/generate-preview` (POST)
  - `/api/estimate-cost` (POST)
- **Variables de entorno requeridas:**
  - `OPENAI_API_KEY`

### Integración con Stripe
- **Configuración:** No implementada directamente pero planificada
- **Variables de entorno disponibles:**
  - `STRIPE_SECRET_KEY`
  - `VITE_STRIPE_PUBLIC_KEY`

### Base de Datos PostgreSQL
- **Configuración:** `server/db.ts`
- **Uso:** Almacenamiento principal de datos
- **Esquema:** `shared/schema.ts`
- **Variables de entorno requeridas:**
  - `DATABASE_URL`, `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT`

## 🧠5. Sistema de Autenticación

### Método de Autenticación
- **Tipo:** Autenticación basada en cookies de sesión
- **Implementación:** Express Session + Passport (local)
- **Archivos principales:**
  - Frontend: `client/src/context/AuthContext.tsx`
  - Backend: `server/routes.ts` (endpoints de autenticación)

### Contexto de Autenticación
- **Ubicación:** `client/src/context/AuthContext.tsx`
- **Métodos disponibles:**
  - `login(username, password)`: Inicio de sesión
  - `register(userData)`: Registro de usuario
  - `logout()`: Cerrar sesión
  - `checkAuth()`: Verificar estado de autenticación
- **Estado disponible:**
  - `user`: Objeto del usuario actual
  - `isAuthenticated`: Booleano que indica si está autenticado
  - `isLoading`: Estado de carga

### Protección de Rutas
- **Backend:** Middleware `requireAuth` en `server/routes.ts`
- **Frontend:** No hay protección estricta, se comprueba `isAuthenticated` en componentes

## 📁6. Archivos Críticos

| Archivo | Descripción | Función |
|---------|-------------|---------|
| `client/src/App.tsx` | Punto de entrada de la aplicación | Define las rutas y estructura principal |
| `client/src/context/AuthContext.tsx` | Contexto de autenticación | Maneja el estado de autenticación |
| `server/routes.ts` | Rutas de API | Define todos los endpoints del backend |
| `server/db.ts` | Conexión a base de datos | Configura conexión a PostgreSQL con Drizzle |
| `server/storage.ts` | Capa de almacenamiento | Implementa acceso a datos con interfaces |
| `shared/schema.ts` | Esquema de datos | Define tablas de base de datos y tipos |
| `server/gemini.ts` | Integración Gemini | Implementa funciones para IA generativa |
| `server/openai.ts` | Integración OpenAI | Implementa funciones para análisis de imágenes |
| `server/poolDesigner.ts` | Diseñador de piscinas | Lógica específica para piscinas modulares |
| `server/smartContainer.ts` | Generador de contenedores | Lógica específica para contenedores inteligentes |
| `drizzle.config.ts` | Configuración Drizzle ORM | Configura la conexión a la base de datos |
| `vite.config.ts` | Configuración Vite | Configuración principal de bundling y desarrollo |

## 👁️7. Diagnóstico Visual

### Pantalla por Defecto
- La pantalla principal es `HomePage`, definida en la ruta `/`
- Incluye una sección hero con video de fondo o imagen de banner
- Paleta de colores basada en tonos neutros y dorados, siguiendo el estilo kasaserena.com

### Componentes que Cargan Primero
1. `Header` - Barra de navegación principal (transparente con efecto blur al scroll)
2. `HeroSection` - Video/imagen principal con mensaje de bienvenida
3. `FeaturedProjects` - Muestras de proyectos destacados
4. `Footer` - Información de contacto y enlaces

### Elementos UI Destacados
- **Tipografía:**
  - Títulos: Didonesque (elegante, serif)
  - Texto: Poppins (sans-serif, limpio)
- **Colores:**
  - Primario: Beige/dorado
  - Secundario: Neutros, marrones cálidos
  - Acentos: Dorado
- **Elementos interactivos:**
  - Botones con efecto hover suave
  - Animaciones sutiles en transiciones
  - Tarjetas de diseño con sombras suaves

## 📌8. Sugerencias de Mejora

### Reorganización de Código
- **Implementar Feature Folders**: Reorganizar componentes por funcionalidad en lugar de por tipo
  - Ejemplo: `/features/design-generator/`, `/features/auth/`, etc.
- **Mejorar consistencia de nombres**: Establecer convenciones claras (PascalCase para componentes, camelCase para servicios)
- **Optimizar importaciones**: Usar alias de ruta más consistentes para evitar imports relativos complejos

### Herramientas a Implementar
- **Estado global**: Implementar Zustand para manejo de estado global en lugar de múltiples contextos
- **Validación de formularios**: Mejorar uso de Zod para validación en formularios del lado cliente
- **Manejo de archivos**: Implementar un servicio dedicado para gestión de archivos y conversiones
- **Internacionalización**: Implementar i18n para soporte completo de español/inglés

### Mejoras Visuales y UX
- **Design System documentado**: Crear un catálogo de componentes UI con Storybook
- **Esquemas de color temáticos**: Implementar cambio de tema (claro/oscuro)
- **Optimización móvil**: Mejorar la experiencia en dispositivos pequeños
- **Accesibilidad**: Implementar atributos ARIA y mejorar la accesibilidad general

## 📍9. Ubicación Ideal para Nuevos Features

### Nuevas Páginas
- **Ubicación**: `client/src/pages/`
- **Proceso**:
  1. Crear nuevo archivo `NuevaFeaturePage.tsx`
  2. Agregar la ruta en `App.tsx`
  3. Actualizar navegación en `Header.tsx` si es necesario

### Nuevos Componentes
- **Componentes de diseño**: `client/src/components/design/`
- **Componentes de UI general**: `client/src/components/ui/`
- **Componentes de página específica**: Crear carpeta dedicada en `components/` si no existe

### Nuevos Servicios o APIs
- **Integraciones de servicios**: `client/src/lib/`
- **Hooks personalizados**: `client/src/hooks/`
- **Contextos**: `client/src/context/`

### Nuevos Endpoints
- **Ubicación**: `server/routes.ts`
- **Proceso**:
  1. Agregar la función de handler en `routes.ts`
  2. Implementar lógica específica en archivo dedicado si es complejo
  3. Actualizar almacenamiento en `storage.ts` si es necesario
  4. Para nuevos modelos, actualizar `shared/schema.ts`

## 🔒10. Validación de Seguridad

### Validación en Rutas Backend
- Se implementa middleware `requireAuth` para rutas protegidas
- Validación de entradas con Zod para esquemas de datos
- La autenticación se basa en sesiones con cookies

### Verificación de Tokens
- No se usan JWT tokens, sino sesiones gestionadas por Express
- La verificación ocurre a través de `req.session.userId`
- `checkAuth()` en el contexto de autenticación verifica la sesión

### Rutas Públicas vs. Protegidas
- **Rutas que deberían ser protegidas pero son públicas:**
  - `/api/design-from-prompt` - Debería requerir autenticación para evitar abuso
  - `/api/design-chat` - Debería tener límites por usuario/sesión
  - `/api/smart-container` y `/api/pool-designer` - Podrían beneficiarse de protección para usuarios registrados
- **Problemas de seguridad potenciales:**
  - No hay rate limiting en API endpoints públicos
  - No hay protección CSRF en formularios
  - No hay comprobación de roles para acciones administrativas

### Recomendaciones de Seguridad
- Implementar rate limiting en endpoints públicos
- Agregar tokens CSRF en formularios
- Mejorar validación de entradas en endpoints que reciben archivos
- Implementar sistema de roles más robusto para administradores