# MAPA ESTRUCTURAL EXHAUSTIVO: KASA SERENA AI

## 🧭 RUTAS DE LA APLICACIÓN

### Rutas Frontend (Cliente)
| Ruta | Archivo | Acceso | Propósito |
|------|---------|--------|-----------|
| `/` | `client/src/pages/HomePage.tsx` | Pública | Página de inicio con presentación de servicios |
| `/design-studio` | `client/src/pages/DesignStudioPage.tsx` | Pública | Estudio de diseño interactivo |
| `/profile` | `client/src/pages/ProfilePage.tsx` | Protegida | Perfil de usuario con datos personales |
| `/dashboard` | `client/src/pages/DashboardPage.tsx` | Protegida | Panel de control con proyectos y cotizaciones |
| `/login` | `client/src/pages/LoginPage.tsx` | Pública | Acceso y registro de usuarios |
| `/ai-visualization` | `client/src/pages/AIVisualizationDemo.tsx` | Pública | Demo de visualización con IA |
| `/design-generator` | `client/src/pages/DesignGeneratorPage.tsx` | Pública | Generador de diseños por parámetros |
| `/ai-design` | `client/src/pages/AIDesignPage.tsx` | Pública | Diseño con asistente conversacional de IA |
| `/smart-container` | `client/src/pages/SmartContainerPage.tsx` | Pública | Diseñador de contenedores inteligentes |
| `/modular-pool` | `client/src/pages/ModularPoolPage.tsx` | Pública | Diseñador de piscinas modulares |
| `/*` | `client/src/pages/not-found.tsx` | Pública | Página 404 cuando no se encuentra la ruta |

### Rutas Backend (API)
| Método | Endpoint | Archivo | Función | Acceso |
|--------|----------|---------|---------|--------|
| `POST` | `/api/register` | `server/routes.ts` | Registrar nuevo usuario | Pública |
| `POST` | `/api/login` | `server/routes.ts` | Iniciar sesión | Pública |
| `POST` | `/api/logout` | `server/routes.ts` | Cerrar sesión | Protegida |
| `GET` | `/api/user` | `server/routes.ts` | Obtener perfil de usuario | Protegida |
| `GET` | `/api/projects` | `server/routes.ts` | Listar todos los proyectos | Pública |
| `GET` | `/api/projects/user` | `server/routes.ts` | Proyectos del usuario actual | Protegida |
| `GET` | `/api/projects/:id` | `server/routes.ts` | Detalles de un proyecto | Pública |
| `POST` | `/api/projects` | `server/routes.ts` | Crear proyecto | Protegida |
| `PUT` | `/api/projects/:id` | `server/routes.ts` | Actualizar proyecto | Protegida |
| `DELETE` | `/api/projects/:id` | `server/routes.ts` | Eliminar proyecto | Protegida |
| `POST` | `/api/analyze-image` | `server/routes.ts` | Analizar imagen con OpenAI | Protegida |
| `POST` | `/api/generate-preview` | `server/routes.ts` | Generar vista previa de diseño | Protegida |
| `POST` | `/api/estimate-cost` | `server/routes.ts` | Estimar costos del proyecto | Protegida |
| `POST` | `/api/design-chat` | `server/routes.ts` | Chat con asistente de diseño | Pública |
| `POST` | `/api/generate-design` | `server/routes.ts` | Generar diseño con Gemini | Pública |
| `POST` | `/api/analyze-design-image` | `server/routes.ts` | Analizar imagen con Gemini | Pública |
| `POST` | `/api/design-suggestions` | `server/routes.ts` | Sugerencias de diseño | Pública |
| `POST` | `/api/design-from-prompt` | `server/routes.ts` | Generar diseño desde prompt | Pública |
| `POST` | `/api/smart-container` | `server/routes.ts` | Diseñar Smart Container | Pública |
| `POST` | `/api/pool-designer` | `server/routes.ts` | Diseñar piscina modular | Pública |
| `GET` | `/api/materials` | `server/routes.ts` | Listar materiales disponibles | Pública |
| `GET` | `/api/materials/type/:type` | `server/routes.ts` | Materiales por tipo | Pública |
| `GET` | `/api/distributors` | `server/routes.ts` | Listar distribuidores | Pública |
| `GET` | `/api/distributors/:id` | `server/routes.ts` | Detalles de distribuidor | Pública |
| `POST` | `/api/contact` | `server/routes.ts` | Enviar mensaje de contacto | Pública |
| `POST` | `/api/quotes` | `server/routes.ts` | Solicitar cotización | Protegida |
| `GET` | `/api/quotes` | `server/routes.ts` | Listar cotizaciones del usuario | Protegida |
| `POST` | `/api/convert-heic` | `server/routes.ts` | Convertir imágenes HEIC a JPEG | Pública |

## 🧱 ESTRUCTURA DE CARPETAS

```
/
├── client/                      # Frontend de la aplicación
│   ├── src/                     # Código fuente React/TypeScript
│   │   ├── assets/              # Recursos estáticos (imágenes, CSS)
│   │   ├── components/          # Componentes React reutilizables
│   │   │   ├── design/          # Generadores de diseño y componentes IA
│   │   │   ├── home/            # Componentes de la página principal
│   │   │   ├── layout/          # Estructura común (Header, Footer)
│   │   │   └── ui/              # Componentes UI base (Shadcn)
│   │   ├── context/             # Contextos globales React
│   │   ├── hooks/               # Hooks personalizados
│   │   ├── lib/                 # Utilidades y servicios cliente
│   │   │   ├── gemini.ts        # Cliente para Gemini API
│   │   │   ├── openai.ts        # Cliente para OpenAI API
│   │   │   ├── firebase.ts      # Configuración Firebase
│   │   │   ├── queryClient.ts   # Cliente React Query
│   │   │   └── utils.ts         # Funciones auxiliares
│   │   └── pages/               # Páginas/rutas de la aplicación
│   ├── public/                  # Archivos públicos estáticos
│   └── index.html               # Punto de entrada HTML
│
├── server/                      # Backend Express/Node.js
│   ├── db.ts                    # Configuración Neon PostgreSQL
│   ├── gemini.ts                # Implementación Gemini API
│   ├── openai.ts                # Implementación OpenAI API
│   ├── index.ts                 # Punto de entrada del servidor
│   ├── poolDesigner.ts          # Lógica de diseño de piscinas
│   ├── routes.ts                # Definición de rutas API Express
│   ├── smartContainer.ts        # Lógica de diseño de contenedores
│   ├── storage.ts               # Capa de acceso a datos (DAO)
│   └── vite.ts                  # Configuración Vite para servidor
│
├── shared/                      # Código compartido cliente/servidor
│   ├── schema.ts                # Esquema de base de datos (Drizzle)
│   └── types.ts                 # Interfaces y tipos TypeScript
│
├── docs/                        # Documentación del proyecto
│   └── structure-map-KasaSerenaAI.md # Mapa estructural actual
│
├── attached_assets/             # Recursos de branding y diseño
├── drizzle.config.ts            # Configuración ORM Drizzle
├── firebase.json                # Configuración Firebase
├── package.json                 # Dependencias y scripts
├── tailwind.config.ts           # Configuración Tailwind CSS
├── theme.json                   # Tema visual de la aplicación
└── vite.config.ts               # Configuración principal de Vite
```

## 💡 COMPONENTES CLAVE

### Componentes de Diseño e IA
| Componente | Ubicación | Función |
|------------|-----------|---------|
| `ChatDesignGenerator` | `client/src/components/design/ChatDesignGenerator.tsx` | Interfaz conversacional para diseño con IA |
| `PromptDesignGenerator` | `client/src/components/design/PromptDesignGenerator.tsx` | Generación de diseños por prompt |
| `SmartContainerGenerator` | `client/src/components/design/SmartContainerGenerator.tsx` | Diseño de contenedores inteligentes |
| `ModularPoolDesigner` | `client/src/components/design/ModularPoolDesigner.tsx` | Diseño de piscinas modulares |
| `AIVisualization` | `client/src/components/design/AIVisualization.tsx` | Visualización de análisis de imágenes |
| `ImageUploader` | `client/src/components/design/ImageUploader.tsx` | Carga de imágenes para análisis |

### Componentes de Layout
| Componente | Ubicación | Función |
|------------|-----------|---------|
| `Header` | `client/src/components/layout/Header.tsx` | Barra de navegación principal |
| `Footer` | `client/src/components/layout/Footer.tsx` | Pie de página con información de contacto |
| `MobileMenu` | `client/src/components/layout/MobileMenu.tsx` | Menú responsive para móviles |

### Componentes de Autenticación
| Componente | Ubicación | Función |
|------------|-----------|---------|
| `LoginForm` | `client/src/components/auth/LoginForm.tsx` | Formulario de inicio de sesión |
| `RegisterForm` | `client/src/components/auth/RegisterForm.tsx` | Formulario de registro |
| `AuthProvider` | `client/src/context/AuthContext.tsx` | Proveedor de estado de autenticación |

### Componentes UI Base
| Componente | Ubicación | Función |
|------------|-----------|---------|
| `Button`, `Card`, etc. | `client/src/components/ui/` | Componentes base de Shadcn UI |
| `Toaster` | `client/src/components/ui/toaster.tsx` | Sistema de notificaciones |
| `SelectionPanel` | `client/src/components/design/SelectionPanel.tsx` | Panel de selección de parámetros |

## 🔌 SERVICIOS EXTERNOS Y APIs

### Firebase
- **Configuración:** `client/src/lib/firebase.ts`
- **Componentes que lo usan:** `AuthContext`, `ProfilePage`
- **Funcionalidad:** Autenticación de usuarios
- **Variables requeridas:** `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_APP_ID`

### Gemini AI (Google)
- **Configuración:** `server/gemini.ts`
- **Componentes que lo usan:** 
  - `ChatDesignGenerator`
  - `SmartContainerGenerator`
  - `ModularPoolDesigner`
- **Funcionalidad:** Generación de diseños y chat asistido
- **Endpoints API:** `/api/generate-design`, `/api/design-chat`, `/api/design-from-prompt`

### OpenAI
- **Configuración:** `server/openai.ts`
- **Componentes que lo usan:** `AIVisualization`
- **Funcionalidad:** Análisis de imágenes y estimación de costos
- **Endpoints API:** `/api/analyze-image`, `/api/generate-preview`
- **Variables requeridas:** `OPENAI_API_KEY`

### PostgreSQL (Neon)
- **Configuración:** `server/db.ts`
- **Componentes que lo usan:** Toda la aplicación a través de `storage.ts`
- **Funcionalidad:** Almacenamiento principal de datos
- **Variables requeridas:** `DATABASE_URL`, conjunto PGXXXX

### Stripe (Planificado)
- **Variables disponibles:** `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLIC_KEY`
- **Estado:** Configurado pero no implementado completamente

## 🔐 SISTEMA DE LOGIN

### Método de Autenticación
- **Tipo:** Autenticación basada en sesiones (Express Session)
- **Archivo principal:** `server/routes.ts` (backend), `client/src/context/AuthContext.tsx` (frontend)
- **Almacenamiento:** Memoria de sesión + PostgreSQL para usuarios

### Contexto de Autenticación
- **Ubicación:** `client/src/context/AuthContext.tsx`
- **Hook de acceso:** `useAuth` importable desde el contexto
- **Estado disponible:**
  - `user`: Objeto con datos del usuario (id, username, email, role, etc.)
  - `isAuthenticated`: Boolean que indica si hay sesión activa
  - `isLoading`: Estado de carga para operaciones de auth

### Funciones Disponibles
- `login(username, password)`: Inicia sesión
- `register(userData)`: Registra nuevo usuario
- `logout()`: Cierra sesión
- `checkAuth()`: Verifica estado de sesión

### Protección de Rutas
- **Backend:** Middleware `requireAuth` en `server/routes.ts`
- **Frontend:** Comprobación de `isAuthenticated` en componentes que requieren sesión

## 📁 ARCHIVOS CRÍTICOS

| Archivo | Propósito |
|---------|-----------|
| `client/src/App.tsx` | Define las rutas del frontend y estructura de la aplicación |
| `client/src/main.tsx` | Punto de entrada principal de React |
| `server/index.ts` | Punto de entrada del servidor Express |
| `server/routes.ts` | Define todos los endpoints API del backend |
| `server/db.ts` | Configuración de conexión a PostgreSQL con Drizzle |
| `server/storage.ts` | Implementa todas las operaciones CRUD |
| `server/gemini.ts` | Integración con la API de Gemini Flash para generación IA |
| `server/openai.ts` | Integración con OpenAI para análisis de imágenes |
| `server/smartContainer.ts` | Lógica específica para generador de contenedores |
| `server/poolDesigner.ts` | Lógica específica para diseñador de piscinas |
| `shared/schema.ts` | Define el esquema de la base de datos y tipos |
| `shared/types.ts` | Interfaces compartidas entre cliente y servidor |
| `drizzle.config.ts` | Configuración de Drizzle ORM para la base de datos |
| `vite.config.ts` | Configuración principal de Vite para bundling |
| `tailwind.config.ts` | Configuración de Tailwind CSS |
| `theme.json` | Definición del tema visual principal |

## 📍 DIAGNÓSTICO VISUAL ACTUAL

### Página por Defecto
- **Ruta inicial:** `/` (HomePage)
- **Estilo visual:** Minimalista elegante con tonos beige/dorados
- **Inspiración:** Diseño basado en kasaserena.com

### Elementos Visuales Principales
- **Tipografía:** Didonesque para títulos, Poppins para texto
- **Paleta de colores:** Neutros cálidos (beige, marrón), acentos dorados
- **Componentes destacados:** 
  - Header transparente con efecto de blur al hacer scroll
  - Hero section con video o imagen elegante
  - Tarjetas de proyectos con efecto hover suave
  - Formularios con validación en tiempo real

### Responsividad
- **Diseño mobile-first** con adaptaciones para diversos tamaños de pantalla
- **MobileMenu** para navegación en dispositivos pequeños
- **Grid responsivo** para galería de proyectos y servicios

## 📌 SUGERENCIAS Y MEJORAS ESTRUCTURALES

### Arquitectura y Organización
- **Feature Folders:** Reorganizar por funcionalidad en lugar de tipo de componente
  - `/features/smart-container/` en lugar de distribuir en múltiples carpetas
- **Estado Global:** Implementar Zustand como reemplazo de múltiples contextos
- **Caching:** Optimizar uso de React Query para mejorar rendimiento

### Seguridad
- **Protección de Rutas:** Implementar rate limiting en endpoints públicos de IA
- **Validación:** Mejorar validación Zod en endpoints que procesan archivos
- **CSRF:** Agregar tokens de protección para formularios sensibles
- **Roles:** Implementar sistema formal de roles (admin/cliente/diseñador)

### UX/UI
- **Design System:** Crear catálogo formal de componentes con Storybook
- **Feedback Visual:** Mejorar estados de carga y errores en operaciones lentas
- **Accesibilidad:** Implementar atributos ARIA y mejorar contraste
- **i18n:** Implementar sistema completo de internacionalización español/inglés

### Performance
- **Code Splitting:** Implementar lazy loading para páginas grandes
- **Optimización de Imágenes:** Agregar sistema de carga progresiva
- **Precarga:** Implementar prefetching para rutas probables

Este documento proporciona un mapa completo de la plataforma Kasa Serena Designs, detallando su estructura, componentes y flujos de trabajo para facilitar el mantenimiento y desarrollo.