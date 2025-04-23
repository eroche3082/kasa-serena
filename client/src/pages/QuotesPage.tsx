import QuotesList from '@/features/quotes/QuotesList';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'wouter';

export const QuotesPage = () => {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  
  if (isLoading) {
    return <div className="container mx-auto py-8 px-4 flex items-center justify-center">
      <p>Cargando...</p>
    </div>;
  }
  
  if (!user) {
    navigate("/login");
    return null;
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mis Cotizaciones</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona y revisa el estado de todas tus solicitudes de cotización
        </p>
      </div>
      
      <div className="mt-8">
        <QuotesList />
      </div>
    </div>
  );
};

export default QuotesPage;