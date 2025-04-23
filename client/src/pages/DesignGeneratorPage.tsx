import { DesignGenerator } from '@/features/ai-generator';

export default function DesignGeneratorPage() {
  return (
    <main className="min-h-screen bg-neutral-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-['Didonesque'] text-4xl md:text-5xl font-light mb-6 tracking-wide uppercase">
              Generador de Diseño Visual
            </h1>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto font-['Poppins']">
              Crea diseños personalizados para tus proyectos de Kasa Serena. Simplemente ingresa tus preferencias y nuestra IA generará visualizaciones y especificaciones detalladas.
            </p>
          </div>
          
          <DesignGenerator />
        </div>
      </div>
    </main>
  );
}