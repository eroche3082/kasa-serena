import { Link } from 'wouter';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  FaCoins, 
  FaCalendarAlt, 
  FaClipboardList, 
  FaTruckLoading,
  FaCheck,
  FaArrowRight
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

const EstimatorSection = () => {
  const [materials, setMaterials] = useState([]);
  
  // Fetch materials data
  const { data: materialsData } = useQuery({
    queryKey: ['/api/materials'],
    refetchOnWindowFocus: false
  });
  
  useEffect(() => {
    if (materialsData) {
      setMaterials(materialsData);
    }
  }, [materialsData]);

  return (
    <section id="estimador" className="py-16 md:py-24 bg-neutral-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold mb-4">Estimador inteligente</h2>
          <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
            Obtén un presupuesto preliminar y detalles sobre tu proyecto en minutos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Cost estimate card */}
          <div className="bg-neutral-800 rounded-xl p-6 shadow-xl">
            <div className="text-primary text-3xl mb-4">
              <FaCoins />
            </div>
            <h3 className="text-xl font-bold mb-3">Costo estimado</h3>
            <div className="text-3xl font-bold mb-2 font-['Playfair_Display']">$4,250 - $5,800</div>
            <p className="text-neutral-400 text-sm mb-4">Basado en tus selecciones actuales</p>
            <Link href="/design-studio" className="text-primary hover:underline text-sm flex items-center">
              Ver desglose <FaArrowRight className="ml-1" />
            </Link>
          </div>
          
          {/* Delivery time card */}
          <div className="bg-neutral-800 rounded-xl p-6 shadow-xl">
            <div className="text-primary text-3xl mb-4">
              <FaCalendarAlt />
            </div>
            <h3 className="text-xl font-bold mb-3">Tiempo de entrega</h3>
            <div className="text-3xl font-bold mb-2 font-['Playfair_Display']">3-4 semanas</div>
            <p className="text-neutral-400 text-sm mb-4">Incluye fabricación e instalación</p>
            <Link href="/design-studio" className="text-primary hover:underline text-sm flex items-center">
              Ver cronograma <FaArrowRight className="ml-1" />
            </Link>
          </div>
          
          {/* Materials list card */}
          <div className="bg-neutral-800 rounded-xl p-6 shadow-xl">
            <div className="text-primary text-3xl mb-4">
              <FaClipboardList />
            </div>
            <h3 className="text-xl font-bold mb-3">Materiales requeridos</h3>
            <ul className="text-neutral-300 space-y-2 mb-4 text-sm">
              <li className="flex items-start">
                <FaCheck className="text-primary mt-1 mr-2" />
                <span>12 m² de laminado blanco mate</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-primary mt-1 mr-2" />
                <span>8 herrajes de acero inoxidable</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-primary mt-1 mr-2" />
                <span>2 m² de encimera de cuarzo</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-primary mt-1 mr-2" />
                <span>4 tiradores modelo Línea</span>
              </li>
            </ul>
            <Link href="/design-studio" className="text-primary hover:underline text-sm flex items-center">
              Ver lista completa <FaArrowRight className="ml-1" />
            </Link>
          </div>
          
          {/* Availability status card */}
          <div className="bg-neutral-800 rounded-xl p-6 shadow-xl">
            <div className="text-primary text-3xl mb-4">
              <FaTruckLoading />
            </div>
            <h3 className="text-xl font-bold mb-3">Disponibilidad</h3>
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Laminado blanco</span>
                  <span className="text-xs text-green-400">En stock</span>
                </div>
                <Progress value={85} className="h-2 bg-neutral-700">
                  <div className="h-full bg-green-500 rounded-full"></div>
                </Progress>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Herrajes inox</span>
                  <span className="text-xs text-green-400">En stock</span>
                </div>
                <Progress value={90} className="h-2 bg-neutral-700">
                  <div className="h-full bg-green-500 rounded-full"></div>
                </Progress>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Cuarzo</span>
                  <span className="text-xs text-yellow-400">Limitado</span>
                </div>
                <Progress value={45} className="h-2 bg-neutral-700">
                  <div className="h-full bg-yellow-500 rounded-full"></div>
                </Progress>
              </div>
            </div>
            <Link href="#socios" className="text-primary hover:underline text-sm flex items-center">
              Verificar con proveedores <FaArrowRight className="ml-1" />
            </Link>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="#contacto">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6">
              Solicitar cotización formal
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EstimatorSection;
