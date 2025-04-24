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
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Loader2, Share, Download, Mail, MessageSquare } from 'lucide-react';
import { getUserQuotes } from '@/lib/quoteService';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import html2pdf from 'html2pdf.js';
import { useToast } from '@/hooks/use-toast';

interface Quote {
  id: number;
  userId: number;
  projectId?: number;
  status: string;
  details: {
    tipo: string;
    datos?: Record<string, any>;
    imageUrl?: string;
    descripcion?: string;
    fechaSolicitud?: string;
    comentarios?: string;
    materiales?: string;
    dimensiones?: string;
    fechaInicio?: string;
    contacto?: {
      nombre: string;
      email: string;
      telefono: string;
    };
  };
  totalCost?: number;
  createdAt: string;
}

interface QuoteCardProps {
  quote: Quote;
}

const QuoteCard = ({ quote }: QuoteCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
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
  
  // Compartir cotización por WhatsApp
  const shareViaWhatsApp = () => {
    const message = `¡Hola! Estoy interesado en mi cotización de Kasa Serena Designs para ${quote.details.tipo || 'mi diseño personalizado'} con ID #${quote.id}. ¿Podríamos discutir los detalles?`;
    const whatsappUrl = `https://wa.me/+17874567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  // Descargar cotización como PDF
  const downloadAsPdf = () => {
    const element = document.getElementById(`quote-details-${quote.id}`);
    if (!element) return;
    
    const opt = {
      margin: 0.5,
      filename: `Cotización_${quote.id}_KasaSerena.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as 'portrait' | 'landscape' }
    };
    
    setIsDialogOpen(false);
    
    toast({
      title: "Generando PDF",
      description: "Preparando tu cotización para descargar...",
    });
    
    setTimeout(() => {
      html2pdf().from(element).set(opt).save();
      
      toast({
        title: "¡PDF Listo!",
        description: "Tu cotización ha sido descargada correctamente.",
      });
    }, 500);
  };
  
  return (
    <>
      <Card className="mb-4 overflow-hidden hover:shadow-md transition-shadow">
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
                      ${(quote.totalCost / 100).toLocaleString()} USD
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
                
                {/* Opciones de acción */}
                <div className="pt-3 flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Share className="h-3.5 w-3.5" /> Ver Detalles
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={shareViaWhatsApp}
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={downloadAsPdf}
                  >
                    <Download className="h-3.5 w-3.5" /> PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
      
      {/* Diálogo de detalles completos */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de Cotización #{quote.id}</DialogTitle>
            <DialogDescription>
              Solicitud hecha el {new Date(quote.createdAt).toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </DialogDescription>
          </DialogHeader>
          
          <div id={`quote-details-${quote.id}`} className="space-y-6 p-4">
            {/* Información de la cotización para PDF */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-primary font-['Playfair_Display']">
                  Kasa Serena Designs
                </h2>
                <Badge className={getStatusColor(quote.status)}>
                  {translateStatus(quote.status)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Diseño y Construcción de Alta Calidad
              </p>
              <div className="flex justify-between mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">COTIZACIÓN #</p>
                  <p className="font-medium">{quote.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">FECHA</p>
                  <p className="font-medium">{new Date(quote.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="border-t border-muted-foreground/20 mt-4 pt-4">
                <h3 className="font-bold text-lg">{quote.details.tipo || 'Diseño Personalizado'}</h3>
              </div>
            </div>
            
            {/* Imagen del proyecto */}
            {quote.details.imageUrl && (
              <div className="mb-6">
                <img 
                  src={quote.details.imageUrl} 
                  alt={quote.details.tipo || 'Diseño cotizado'} 
                  className="w-full max-h-60 object-contain"
                />
              </div>
            )}
            
            {/* Detalles del proyecto */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Descripción del Proyecto</h4>
                <p className="text-sm text-muted-foreground">
                  {quote.details.descripcion || 'Sin descripción detallada'}
                </p>
              </div>
              
              {/* Materiales */}
              {quote.details.materiales && (
                <div>
                  <h4 className="font-medium">Materiales</h4>
                  <p className="text-sm text-muted-foreground">
                    {quote.details.materiales}
                  </p>
                </div>
              )}
              
              {/* Dimensiones */}
              {quote.details.dimensiones && (
                <div>
                  <h4 className="font-medium">Dimensiones</h4>
                  <p className="text-sm text-muted-foreground">
                    {quote.details.dimensiones}
                  </p>
                </div>
              )}
              
              {/* Fecha de inicio */}
              {quote.details.fechaInicio && (
                <div>
                  <h4 className="font-medium">Fecha estimada de inicio</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(quote.details.fechaInicio).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              {/* Contacto */}
              {quote.details.contacto && (
                <div>
                  <h4 className="font-medium">Información de contacto</h4>
                  <div className="text-sm text-muted-foreground">
                    <p>{quote.details.contacto.nombre}</p>
                    <p>{quote.details.contacto.email}</p>
                    <p>{quote.details.contacto.telefono}</p>
                  </div>
                </div>
              )}
              
              {/* Comentarios */}
              {quote.details.comentarios && (
                <div>
                  <h4 className="font-medium">Comentarios de Kasa Serena</h4>
                  <p className="text-sm text-muted-foreground italic">
                    {quote.details.comentarios}
                  </p>
                </div>
              )}
            </div>
            
            {/* Detalles de coste */}
            {quote.totalCost && (
              <div className="border-t border-muted-foreground/20 mt-6 pt-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Presupuesto Total (estimado)</h4>
                  <p className="text-lg font-bold text-green-600">
                    ${(quote.totalCost / 100).toLocaleString()} USD
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  *Este presupuesto es una estimación y puede estar sujeto a cambios dependiendo 
                  de los detalles finales del proyecto, materiales, y tiempo de ejecución.
                </p>
              </div>
            )}
            
            {/* Pie de página para PDF */}
            <div className="border-t border-muted-foreground/20 mt-6 pt-4 text-xs text-muted-foreground">
              <p>Kasa Serena Designs | +1 (787) 456-7890 | contacto@kasaserena.com</p>
              <p className="mt-1">Diseños de alta calidad para viviendas y espacios comerciales en Puerto Rico</p>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="sm:flex-1 flex items-center gap-1" 
              onClick={shareViaWhatsApp}
            >
              <MessageSquare className="h-4 w-4" /> Compartir por WhatsApp
            </Button>
            <Button 
              variant="outline" 
              className="sm:flex-1 flex items-center gap-1"
              onClick={() => {
                window.location.href = `mailto:contacto@kasaserena.com?subject=Consulta%20sobre%20Cotización%20%23${quote.id}&body=Hola,%20quisiera%20obtener%20más%20información%20sobre%20mi%20cotización%20%23${quote.id}.`;
              }}
            >
              <Mail className="h-4 w-4" /> Enviar Email
            </Button>
            <Button 
              className="sm:flex-1 flex items-center gap-1 bg-primary hover:bg-primary/90"
              onClick={downloadAsPdf}
            >
              <Download className="h-4 w-4" /> Descargar PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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