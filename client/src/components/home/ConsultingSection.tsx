import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import familyKitchenImg from '../../assets/images/family-kitchen-1.jpg';

const ConsultingSection = () => {
  return (
    <section id="asesoria" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src={familyKitchenImg} 
              alt="Cocina moderna diseñada por Kasa Serena" 
              className="rounded-md w-full h-auto object-cover shadow-lg"
            />
          </div>
          
          <div>
            <h2 className="font-serif text-3xl uppercase text-center font-light mb-6 tracking-wide">Asesoría Integral en Renovaciones</h2>
            <div className="w-12 h-0.5 bg-primary mx-auto mb-8"></div>
            <p className="text-neutral-700 mb-8 text-center">
              Sabemos que cada proyecto de renovación es único. Por eso, brindamos un servicio integral que incluye asesoría personalizada desde la planificación hasta la instalación final. Nuestro equipo de expertos te guiará en la selección de los productos adecuados para crear espacios que reflejen tu estilo y necesidades.
            </p>
            <div className="flex justify-center">
              <Link href="/contacto">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Solicitar asesoría
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultingSection;