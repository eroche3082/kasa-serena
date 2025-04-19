import { Link } from 'wouter';
import { 
  FaKitchenSet, 
  FaDoorOpen, 
  FaWindowMaximize, 
  FaArrowRight 
} from 'react-icons/fa6';
import { RiArchiveDrawerFill } from 'react-icons/ri';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const ServiceCard = ({ icon, title, description, link }: ServiceCardProps) => {
  return (
    <div className="group bg-neutral-100 rounded-xl p-6 transition-all hover:shadow-lg">
      <div className="mb-5 text-primary text-3xl">
        {icon}
      </div>
      <h3 className="font-['Playfair_Display'] text-xl font-bold mb-3">{title}</h3>
      <p className="text-neutral-600 mb-4">{description}</p>
      <Link href={link} className="inline-flex items-center text-primary group-hover:underline">
        Ver opciones <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

const ServicesSection = () => {
  const services = [
    {
      icon: <FaKitchenSet />,
      title: "Cocinas",
      description: "Diseños personalizados que combinan funcionalidad y elegancia para el corazón de tu hogar.",
      link: "/design-studio?type=cocina"
    },
    {
      icon: <FaDoorOpen />,
      title: "Puertas",
      description: "Entradas que hacen una declaración, combinando seguridad y diseño arquitectónico.",
      link: "/design-studio?type=puerta"
    },
    {
      icon: <FaWindowMaximize />,
      title: "Ventanas",
      description: "Soluciones que maximizan la luz natural y complementan la arquitectura de tu espacio.",
      link: "/design-studio?type=ventana"
    },
    {
      icon: <RiArchiveDrawerFill />,
      title: "Gabinetes",
      description: "Almacenamiento a medida que optimiza el espacio con un diseño elegante y funcional.",
      link: "/design-studio?type=gabinete"
    }
  ];

  return (
    <section id="servicios" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold mb-4">Nuestros servicios</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Diseñamos y construimos espacios personalizados que combinan estética, funcionalidad e innovación.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              link={service.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
