import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { getUserQuotes } from '@/lib/quoteService';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Quote {
  id: number;
  userId: number;
  projectId?: number;
  status: string;
  details: {
    tipo: string;
    datos: Record<string, any>;
    imageUrl?: string;
    descripcion?: string;
    fechaSolicitud?: string;
    comentarios?: string;
  };
  totalCost?: number;
  createdAt: string;
}

interface QuoteCardProps {
  quote: Quote;
}

const QuoteCard = ({ quote }: QuoteCardProps) => {
  // Obtener la fecha de la cotización desde los detalles
  const quoteDate = quote.details.fechaSolicitud 
    ? new Date(quote.details.fechaSolicitud)
    : new Date(quote.createdAt);
  
  // Formatear la fecha relativa
  const timeAgo = formatDistanceToNow(quoteDate, { 
    addSuffix: true,
    locale: es
  });
  
  // Determinar el color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Traducir el estado al español
  const translateStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobada';
      case 'rejected': return 'Rechazada';
      case 'completed': return 'Completada';
      default: return status;
    }
  };
  
  return (
    <Card className="mb-4 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Previsualización de imagen */}
        <div className="md:col-span-1 bg-gray-100">
          {quote.details.imageUrl ? (
            <img 
              src={quote.details.imageUrl} 
              alt={quote.details.tipo || 'Diseño cotizado'} 
              className="w-full h-full object-cover"
              style={{ maxHeight: '200px' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ minHeight: '200px' }}>
              Sin imagen
            </div>
          )}
        </div>
        
        {/* Detalles de la cotización */}
        <div className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                {quote.details.tipo || 'Diseño personalizado'}
              </CardTitle>
              <Badge className={getStatusColor(quote.status)}>
                {translateStatus(quote.status)}
              </Badge>
            </div>
            <CardDescription>Solicitada {timeAgo}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium">Descripción</h4>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {quote.details.descripcion || 'Sin descripción'}
                </p>
              </div>
              
              {quote.totalCost && (
                <div>
                  <h4 className="text-sm font-medium">Presupuesto estimado</h4>
                  <p className="text-sm text-green-600 font-medium">
                    ${quote.totalCost.toLocaleString()}
                  </p>
                </div>
              )}
              
              {/* Si hay comentarios del equipo */}
              {quote.details.comentarios && (
                <div className="mt-2 p-2 bg-muted rounded-md">
                  <h4 className="text-sm font-medium">Comentarios</h4>
                  <p className="text-sm italic">{quote.details.comentarios}</p>
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export const QuotesList = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: quotes, isLoading, error } = useQuery({
    queryKey: ['/api/quotes'],
    queryFn: getUserQuotes,
  });
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Cargando tus cotizaciones...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-2 text-center">
        <p className="text-red-500">Error al cargar las cotizaciones</p>
        <p className="text-muted-foreground">Por favor, intenta nuevamente más tarde</p>
      </div>
    );
  }
  
  if (!quotes || quotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-2 text-center">
        <p className="text-lg font-medium">No tienes cotizaciones</p>
        <p className="text-muted-foreground">Genera un diseño y solicita tu primera cotización</p>
      </div>
    );
  }
  
  // Filtrar cotizaciones según la pestaña activa
  const filteredQuotes = quotes.filter((quote: Quote) => {
    if (activeTab === "all") return true;
    return quote.status === activeTab;
  });
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="approved">Aprobadas</TabsTrigger>
          <TabsTrigger value="completed">Completadas</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
          <div className="space-y-4">
            {filteredQuotes.length > 0 ? (
              filteredQuotes.map((quote: Quote) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No hay cotizaciones en esta categoría</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuotesList;