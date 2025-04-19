import { Button } from '@/components/ui/button';
import { FaSwimmingPool, FaArrowRight } from 'react-icons/fa';
import { FaSolarPanel, FaChevronRight } from 'react-icons/fa';
import { MdOutlineHome } from 'react-icons/md';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const ComingSoonCard = ({ 
  icon, 
  title, 
  description, 
  date 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  date: string;
}) => {
  return (
    <div className="group bg-neutral-800 rounded-xl p-6 shadow-lg transition-all hover:shadow-xl">
      <div className="text-primary text-3xl mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 font-['Playfair_Display']">{title}</h3>
      <p className="text-neutral-400 mb-6">{description}</p>
      <div className="flex items-center justify-between">
        <a href="#" className="text-primary hover:underline text-sm group-hover:underline flex items-center">
          Más información <FaArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
        </a>
        <span className="text-xs text-neutral-500">{date}</span>
      </div>
    </div>
  );
};

const ComingSoonSection = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  
  const handleNotifyMe = () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu correo electrónico",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would call an API endpoint
    toast({
      title: "¡Gracias!",
      description: "Te notificaremos cuando lancemos nuevos servicios"
    });
    
    setEmail('');
  };
  
  const upcomingServices = [
    {
      icon: <FaSwimmingPool />,
      title: "Piscinas personalizadas",
      description: "Diseños adaptados a tu espacio y estilo de vida, con opciones ecológicas y de bajo mantenimiento.",
      date: "Q3 2023"
    },
    {
      icon: <MdOutlineHome />,
      title: "Containers inteligentes",
      description: "Soluciones habitacionales prefabricadas con diseño modular y sostenible para viviendas u oficinas.",
      date: "Q4 2023"
    },
    {
      icon: <FaSolarPanel />,
      title: "Energía renovable",
      description: "Integración de sistemas solares y soluciones energéticas sostenibles en tus proyectos de diseño.",
      date: "Q1 2024"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-neutral-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-primary bg-opacity-20 text-primary rounded-full text-sm font-medium mb-4">
            Próximamente
          </span>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold mb-4">
            Expandiendo nuestro horizonte
          </h2>
          <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
            Estamos desarrollando nuevas categorías para transformar más espacios con nuestro enfoque de diseño inteligente.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {upcomingServices.map((service, index) => (
            <ComingSoonCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              date={service.date}
            />
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            variant="outline" 
            className="px-6 py-3 border border-white hover:bg-white/10 text-white"
            onClick={handleNotifyMe}
          >
            Notificarme sobre nuevos servicios
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ComingSoonSection;
