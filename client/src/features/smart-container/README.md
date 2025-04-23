# Smart Container Feature

Este módulo contiene todos los componentes y lógica relacionada con el Smart Container Designer de Kasa Serena Designs.

## Componentes
- `SmartContainerGenerator.tsx`: Generador principal de diseños de contenedores inteligentes

## Funcionalidad
Este módulo permite a los usuarios diseñar contenedores prefabricados inteligentes personalizando:
- Tipo de uso (casa, oficina, spa, etc.)
- Tamaño del contenedor
- Tipo de energía
- Acabados de fachada
- Características tecnológicas
- Extras opcionales

## Interacciones
- Utiliza la API de Gemini para generar diseños visuales
- Se comunica con el endpoint `/api/smart-container` del backend
- Muestra resultados visuales y especificaciones técnicas