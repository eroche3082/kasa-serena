import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { FaCheckCircle, FaColumns } from 'react-icons/fa';

const ProfessionalDashboardSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-neutral-100 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold mb-6">
              Para profesionales del diseño
            </h2>
            <p className="text-lg text-neutral-600 mb-6">
              Potencia tu trabajo como arquitecto, diseñador o contratista con nuestro dashboard profesional.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="text-primary mt-1 mr-4">
                  <FaCheckCircle className="text-xl" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Gestión de múltiples proyectos</h3>
                  <p className="text-neutral-600">
                    Organiza y supervisa todos tus proyectos de clientes desde una interfaz centralizada.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-primary mt-1 mr-4">
                  <FaCheckCircle className="text-xl" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Herramientas de diseño avanzadas</h3>
                  <p className="text-neutral-600">
                    Accede a funcionalidades exclusivas de análisis, visualización y estimación para profesionales.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-primary mt-1 mr-4">
                  <FaCheckCircle className="text-xl" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Conexión directa con proveedores</h3>
                  <p className="text-neutral-600">
                    Consulta inventario en tiempo real y realiza pedidos directamente desde la plataforma.
                  </p>
                </div>
              </div>
            </div>
            
            <Link href="/login?professional=true">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6">
                Crear cuenta profesional
              </Button>
            </Link>
          </div>
          
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary opacity-10 rounded-full"></div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary opacity-10 rounded-full"></div>
            
            <div className="relative bg-white shadow-xl rounded-xl overflow-hidden">
              <div className="p-4 bg-neutral-800 text-white flex items-center">
                <FaColumns className="mr-2" />
                <span>Dashboard Profesional</span>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1581093196277-9f608732013c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Dashboard profesional de Kasa Serena" 
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalDashboardSection;
