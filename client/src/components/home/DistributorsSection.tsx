import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Distributor {
  id: number;
  name: string;
  location: string;
  description: string;
  status: string;
  imageUrl: string;
  contactInfo: {
    phone: string;
    email: string;
  };
}

const DistributorCard = ({ distributor }: { distributor: Distributor }) => {
  return (
    <div className="bg-neutral-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-40 bg-neutral-200 relative">
        <img 
          src={distributor.imageUrl} 
          alt={distributor.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-bold text-xl">{distributor.name}</h3>
          <Badge variant={distributor.status === 'available' ? 'success' : 'warning'}>
            {distributor.status === 'available' ? 'Disponible' : 'Stock limitado'}
          </Badge>
        </div>
        <p className="text-neutral-600 mb-4">{distributor.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-neutral-500">
            <FaMapMarkerAlt className="mr-1" />
            <span>{distributor.location}</span>
          </div>
          <Link href={`/distributor/${distributor.id}`} className="text-primary hover:underline text-sm">
            Ver inventario
          </Link>
        </div>
      </div>
    </div>
  );
};

const DistributorsSection = () => {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  
  // Fetch distributors data
  const { data: distributorsData, isLoading } = useQuery({
    queryKey: ['/api/distributors'],
    refetchOnWindowFocus: false
  });
  
  useEffect(() => {
    if (distributorsData) {
      setDistributors(distributorsData);
    }
  }, [distributorsData]);

  return (
    <section id="socios" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold mb-4">Distribuidores locales</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Trabajamos con los mejores proveedores de materiales en Puerto Rico para garantizar calidad y disponibilidad.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-neutral-100 rounded-xl overflow-hidden shadow-sm">
                <Skeleton className="h-40 w-full" />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {distributors.map((distributor) => (
              <DistributorCard key={distributor.id} distributor={distributor} />
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link href="/distributors" className="text-primary hover:underline inline-flex items-center font-medium">
            Ver todos los distribuidores <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DistributorsSection;
