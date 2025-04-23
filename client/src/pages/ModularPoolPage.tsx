import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/common';
import { ModularPoolDesigner } from '@/features/modular-pool';

const ModularPoolPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Piscinas Modulares Personalizadas</h1>
        <p className="text-muted-foreground mt-2">
          Diseña piscinas prefabricadas de lujo para instalar directamente en tu patio o jardín
        </p>
      </div>

      <div className="grid gap-8">
        <Card className="border-0 shadow-none bg-muted/50">
          <CardHeader className="text-center pb-2">
            <CardTitle>¿Qué son las Piscinas Modulares?</CardTitle>
            <CardDescription>
              Unidades completas prefabricadas que se instalan de forma rápida y sencilla
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Las Piscinas Modulares de Kasa Serena son estructuras prefabricadas completas que se transportan 
              directamente a tu propiedad para instalación inmediata. Combinan diseño de lujo, 
              materiales premium y la practicidad de una instalación rápida sin obras prolongadas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-medium mb-2">🚚 Instalación Rápida</h3>
                <p className="text-sm text-muted-foreground">
                  Instalación en días, no meses. La piscina llega prefabricada y se coloca con grúa.
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-medium mb-2">🏆 Diseño Premium</h3>
                <p className="text-sm text-muted-foreground">
                  Materiales de alta calidad, acabados de lujo y opciones de personalización exclusivas.
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-medium mb-2">♻️ Sostenibilidad</h3>
                <p className="text-sm text-muted-foreground">
                  Sistemas de filtración eficientes, opciones de calentamiento solar y bajo consumo de agua.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <ModularPoolDesigner />

        <Card className="border-0 shadow-none bg-muted/50 mt-8">
          <CardHeader className="text-center pb-2">
            <CardTitle>Ventajas de las Piscinas Modulares</CardTitle>
            <CardDescription>
              Beneficios exclusivos de nuestro sistema prefabricado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded-full h-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" x2="9.01" y1="9" y2="9"></line>
                    <line x1="15" x2="15.01" y1="9" y2="9"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Sin Excavaciones Complejas</h3>
                  <p className="text-sm text-muted-foreground">Mínima preparación del terreno y sin necesidad de grandes excavaciones.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded-full h-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 22V8"></path>
                    <path d="m5 12 7-4 7 4"></path>
                    <path d="M5 16l7-4 7 4"></path>
                    <path d="M5 8l7-4 7 4"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Construcción Garantizada</h3>
                  <p className="text-sm text-muted-foreground">Fabricada en ambiente controlado asegura calidad y resistencia superior.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded-full h-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Ahorro de Tiempo</h3>
                  <p className="text-sm text-muted-foreground">Instalación hasta 10 veces más rápida que una piscina tradicional.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded-full h-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44"></path>
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44"></path>
                    <path d="M12 4.5A2.5 2.5 0 0 1 9.5 2h5a2.5 2.5 0 0 1 0 5h-5"></path>
                    <path d="M12 19.5a2.5 2.5 0 0 0 2.5 2.5h-5a2.5 2.5 0 0 0 2.5-2.5"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Facilidad de Transporte</h3>
                  <p className="text-sm text-muted-foreground">Se puede trasladar si te mudas o reubicarse en el mismo terreno.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModularPoolPage;