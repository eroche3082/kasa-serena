# AI Generator Feature

Este módulo contiene todos los componentes y lógica relacionada con los generadores de diseño basados en IA de Kasa Serena Designs.

## Componentes
- `ChatDesignGenerator.tsx`: Interfaz conversacional para generar diseños mediante chat
- `PromptDesignGenerator.tsx`: Generador de diseños basado en prompts específicos

## Funcionalidad
Este módulo permite a los usuarios:
- Interactuar conversacionalmente con un asistente IA para generar diseños
- Crear diseños personalizados mediante prompts estructurados
- Obtener visualizaciones, descripciones y estimaciones de costo
- Refinar diseños mediante iteraciones

## Interacciones
- Utiliza la API de Gemini para generar diseños y respuestas conversacionales
- Se comunica con endpoints `/api/design-chat`, `/api/generate-design`, `/api/design-from-prompt`
- Gestiona la interfaz de usuario para la entrada y visualización de diseños