export interface DesignParams {
  tipo: string;        // 'puerta', 'ventana', 'gabinete', 'piscina'
  material: string;    // 'madera natural', 'aluminio negro', 'vidrio templado'
  color: string;       // 'blanco', 'negro mate', 'turquesa'
  estilo: string;      // 'moderno', 'minimalista', 'rústico', 'industrial'
  medidas: string;     // '120x80 cm', '2.4m alto x 1.2m ancho'
  extra?: string;      // 'con panel solar integrado', 'resistente a humedad', etc.
}

export const casaSerenaDesignPrompt = ({
  tipo,
  material,
  color,
  estilo,
  medidas,
  extra,
}: DesignParams): string => `
You are an expert visual architectural designer using AI.

Please generate a **high-quality AI image** of a **${tipo}** with the following attributes:
- **Material:** ${material}
- **Color:** ${color}
- **Style:** ${estilo}
- **Dimensions:** ${medidas}
${extra ? `- **Extra features:** ${extra}` : ""}

The design should be modern, clean and detailed. Center the object in the frame with realistic lighting and textures. Output format should be a **square, high-resolution render**.

Return only:
1. [Image]
2. Short description of the design and potential installation tips
3. Materials needed (estimated list)
4. Estimated production time
`;

export interface DesignResult {
  imageUrl: string;
  description: string;
  materials: string[];
  estimatedTime: string;
}