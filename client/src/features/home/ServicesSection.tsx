import { Link } from 'wouter';
import { 
  FaKitchenSet, 
  FaDoorOpen, 
  FaWindowMaximize, 
  FaArrowRight,
  FaCheck
} from 'react-icons/fa6';
import { RiArchiveDrawerFill } from 'react-icons/ri';
// Importar imágenes correctamente desde la ruta exacta
import woodenDoorImg from '../../assets/images/wooden-door-1.jpg';
import woodenWindowImg from '../../assets/images/wooden-window-1.jpg';
import kitchenWoodenImg from '../../assets/images/kitchen-wooden-3.jpg';

interface ServiceCardProps {
  image: string;
  title: string;
  features: string[];
  link: string;
}

const ServiceCard = ({ image, title, features, link }: ServiceCardProps) => {
  return (
    <div className="group bg-white rounded border border-neutral-200 overflow-hidden transition-all hover:shadow-lg">
      <div className="h-56 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
      </div>
      <div className="p-5">
        <h3 className="font-['Didonesque'] text-xl font-semibold uppercase mb-4 tracking-wide">{title}</h3>
        <ul className="space-y-2 mb-5 font-['Poppins']">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <FaCheck className="text-primary mt-1 mr-2 flex-shrink-0" />
              <span className="text-neutral-700">{feature}</span>
            </li>
          ))}
        </ul>
        <Link href={link} className="inline-flex items-center text-primary group-hover:underline font-medium font-['Poppins']">
          Ver más <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

const ServicesSection = () => {
  const services = [
    {
      image: woodenDoorImg,
      title: "PUERTAS DE ENSUEÑO",
      features: [
        "Diseños Personalizados: Cada puerta es única, adaptada a tus gustos y necesidades.",
        "Calidad Garantizada: Materiales duraderos que resisten el paso del tiempo.",
        "Estilo Atemporal: Diseños que complementan cualquier ambiente, ya sea moderno o clásico."
      ],
      link: "/design-studio?type=puerta"
    },
    {
      image: woodenWindowImg,
      title: "VENTANAS QUE INSPIRAN",
      features: [
        "Diseño Personalizado: Cada ventana se adapta a tus necesidades estéticas y funcionales.",
        "Estilo Atemporal: Ventanas que complementan cualquier estilo arquitectónico.",
        "Durabilidad Garantizada: Materiales resistentes que aseguran un producto de larga vida útil."
      ],
      link: "/design-studio?type=ventana"
    },
    {
      image: kitchenWoodenImg,
      title: "COCINAS QUE CAUTIVAN",
      features: [
        "Cocinas Modernas: Líneas limpias, colores neutros y electrodomésticos integrados.",
        "Cocinas Rústicas: Estilo acogedor con madera desgastada, tonos tierra y materiales naturales.",
        "Cocinas Industriales: Acabados metálicos, colores oscuros y combinaciones de madera y acero."
      ],
      link: "/design-studio?type=cocina"
    }
  ];

  return (
    <section id="servicios" className="py-20">
      <div className="container mx-auto px-4">
        <div className="w-full border-t border-neutral-300 mb-10"></div>
        <div className="text-center mb-6">
          <h2 className="font-['Didonesque'] text-3xl md:text-4xl font-light mb-6 tracking-wide uppercase">EN KASA SERENA, DISEÑAMOS Y CONSTRUIMOS COCINAS, PUERTAS, Y VENTANAS PERSONALIZADAS</h2>
          <p className="text-lg text-neutral-600 max-w-4xl mx-auto font-['Poppins']">
            TENEMOS MÁS DE 20 AÑOS DE EXPERIENCIA. CREAMOS ESPACIOS ÚNICOS QUE COMBINAN ELEGANCIA, FUNCIONALIDAD Y DURABILIDAD.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              image={service.image}
              title={service.title}
              features={service.features}
              link={service.link}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/design-studio" className="inline-block bg-neutral-700 hover:bg-neutral-800 text-white py-3 px-6 text-center tracking-wide">
            Conoce más
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
