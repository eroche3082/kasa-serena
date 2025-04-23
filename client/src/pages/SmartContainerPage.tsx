import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/common';
import { SmartContainerGenerator } from '@/features/smart-container';

const SmartContainerPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Smart Containers Personalizados</h1>
        <p className="text-muted-foreground mt-2">
          Diseña espacios modulares inteligentes y sostenibles con tecnología avanzada
        </p>
      </div>

      <div className="grid gap-8">
        <Card className="border-0 shadow-none bg-muted/50">
          <CardHeader className="text-center pb-2">
            <CardTitle>¿Qué son los Smart Containers?</CardTitle>
            <CardDescription>
              Espacios modulares personalizables con tecnología integrada y energía renovable
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Los Smart Containers de Kasa Serena son la solución perfecta para quienes buscan espacios 
              modulares sostenibles, autónomos y controlables mediante tecnología inteligente. 
              Adaptables a cualquier uso - desde una casa minimalista hasta un espacio comercial.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-medium mb-2">🌿 Sostenibles</h3>
                <p className="text-sm text-muted-foreground">
                  Energía 100% renovable, materiales eco-amigables y sistemas de captación de agua.
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-medium mb-2">🔌 Inteligentes</h3>
                <p className="text-sm text-muted-foreground">
                  Control total desde tu smartphone, sensores ambientales y seguridad avanzada.
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-medium mb-2">🛠️ Personalizables</h3>
                <p className="text-sm text-muted-foreground">
                  Adaptables a cualquier necesidad, modulares y con infinitas posibilidades de diseño.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <SmartContainerGenerator />

        <Card className="border-0 shadow-none bg-muted/50 mt-8">
          <CardHeader className="text-center pb-2">
            <CardTitle>Beneficios de un Smart Container</CardTitle>
            <CardDescription>
              Ventajas de los espacios modulares inteligentes de Kasa Serena
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded-full h-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
                    <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
                    <circle cx="12" cy="12" r="2"></circle>
                    <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
                    <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Control Remoto</h3>
                  <p className="text-sm text-muted-foreground">Gestiona iluminación, clima, seguridad y energía desde cualquier lugar.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded-full h-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
                    <path d="M12 3v1"></path>
                    <path d="M12 20v1"></path>
                    <path d="M3 12h1"></path>
                    <path d="M20 12h1"></path>
                    <path d="M18.364 5.636l-.707.707"></path>
                    <path d="M6.343 17.657l-.707.707"></path>
                    <path d="M5.636 5.636l.707.707"></path>
                    <path d="M17.657 17.657l.707.707"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Energía Renovable</h3>
                  <p className="text-sm text-muted-foreground">Autosuficiente con paneles solares, almacenamiento en baterías y bajo consumo.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded-full h-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M2 20h.01"></path>
                    <path d="M7 20v-4"></path>
                    <path d="M12 20v-8"></path>
                    <path d="M17 20V8"></path>
                    <path d="M22 4v16"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Monitoreo Constante</h3>
                  <p className="text-sm text-muted-foreground">Sensores ambientales que optimizan el consumo energético y el confort.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded-full h-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Movilidad Total</h3>
                  <p className="text-sm text-muted-foreground">Instala tu Smart Container donde desees, sin depender de conexiones externas.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SmartContainerPage;