# Modular Pool Feature

Este módulo contiene todos los componentes y lógica relacionada con el Diseñador de Piscinas Modulares de Kasa Serena Designs.

## Componentes
- `ModularPoolDesigner.tsx`: Generador principal de diseños de piscinas modulares prefabricadas

## Funcionalidad
Este módulo permite a los usuarios diseñar piscinas modulares personalizadas configurando:
- Forma de la piscina (rectangular, cuadrada, circular, infinity)
- Dimensiones y tamaño
- Profundidad
- Tipo de vidrio/acrílico
- Acabados y materiales
- Características adicionales
- Estilo arquitectónico
- Entorno de instalación

## Interacciones
- Utiliza la API de Gemini para generar diseños visuales
- Se comunica con el endpoint `/api/pool-designer` del backend
- Muestra resultados visuales, materiales y tiempos estimados de instalación