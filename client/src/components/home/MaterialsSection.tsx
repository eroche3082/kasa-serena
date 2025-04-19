import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const MaterialsSection = () => {
  return (
    <section id="materiales" className="py-16 bg-[#eae8df]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="font-serif text-3xl font-light mb-6 tracking-wide">Variedad de Materiales</h2>
            <p className="text-neutral-700 mb-8">
              Creemos que la calidad de los materiales es clave para crear puertas, gabinetes y cocinas que no solo luzcan espectaculares, sino que también sean duraderos y funcionales. Trabajamos con una variedad de materiales de primera calidad, cuidadosamente seleccionados para adaptarse a tus necesidades y preferencias.
            </p>
            <Link href="/materiales">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Explorar materiales
              </Button>
            </Link>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="grid grid-cols-3 gap-4 relative">
              <div className="col-span-2 row-span-2">
                <div className="bg-gray-200 h-64 rounded-md overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Mármol blanco" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <div className="bg-gray-300 h-32 rounded-md overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1658055200845-bc7a4fa9d7f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                    alt="Madera oscura" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <div className="bg-gray-400 h-28 rounded-md overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1596825205240-3b010027ad4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                    alt="Granito oscuro" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="bg-gray-500 h-32 rounded-md overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1623498306061-0a6811bd86c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                    alt="Acero inoxidable" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MaterialsSection;