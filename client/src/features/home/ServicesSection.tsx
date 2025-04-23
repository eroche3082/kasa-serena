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
      title: "DISEÑOS CON IA",
      features: [
        "Diseños Personalizados generados con IA.",
        "Visualización instantánea de tus ideas.",
        "Materiales y estimaciones de tiempo automáticas."
      ],
      link: "/design-generator"
    },
    {
      image: woodenWindowImg,
      title: "CONTENEDORES INTELIGENTES",
      features: [
        "Espacios modulares personalizables.",
        "Soluciones sostenibles y energéticamente eficientes.",
        "Diseños innovadores para múltiples usos."
      ],
      link: "/smart-container"
    },
    {
      image: kitchenWoodenImg,
      title: "PISCINAS MODULARES",
      features: [
        "Diseños a medida para cualquier espacio.",
        "Acabados exclusivos y materiales de alta calidad.",
        "Soluciones eficientes adaptadas a tu entorno."
      ],
      link: "/modular-pool"
    }
  ];

  return (
    <section id="servicios" className="py-20">
      <div className="container mx-auto px-4">
        <div className="w-full border-t border-neutral-300 mb-10"></div>
        <div className="text-center mb-6">
          <h2 className="font-['Didonesque'] text-3xl md:text-4xl font-light mb-6 tracking-wide uppercase">KASA SERENA DESIGNS - SOLUCIONES INNOVADORAS PARA TU ESPACIO</h2>
          <p className="text-lg text-neutral-600 max-w-4xl mx-auto font-['Poppins']">
            Transformamos tu visión en realidad mediante tecnología de IA, diseño modular y soluciones personalizadas para cada proyecto.
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
          <Link href="/design-generator" className="inline-block bg-neutral-700 hover:bg-neutral-800 text-white py-3 px-6 text-center tracking-wide">
            Comienza tu diseño
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
