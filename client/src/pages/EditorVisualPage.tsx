import React, { useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { SEO } from '@/components/ui/seo';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import VisualEditor from '@/features/editor/VisualEditor';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Lock } from 'lucide-react';

const EditorVisualPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Verificar si el usuario tiene permisos para acceder al editor
  const hasEditPermission = isAuthenticated && user?.role === 'admin';

  // Redirigir si no tiene permisos
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Acceso restringido",
        description: "Debes iniciar sesión para acceder al editor visual.",
        variant: "destructive"
      });
      setLocation('/login');
    } else if (!hasEditPermission) {
      toast({
        title: "Permiso denegado",
        description: "No tienes permisos para acceder al editor visual.",
        variant: "destructive"
      });
      setLocation('/');
    }
  }, [isAuthenticated, hasEditPermission, toast, setLocation]);

  // Si no tiene permisos, mostrar mensaje de acceso restringido
  if (!isAuthenticated) {
    return null; // Redirigiendo a login
  }

  if (!hasEditPermission) {
    return (
      <div className="py-8">
        <SEO 
          title="Acceso restringido - Editor Visual"
          description="Acceso restringido al editor visual para administradores."
          noindex={true}
        />
        <Container>
          <Card className="max-w-md mx-auto p-6 text-center">
            <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h1 className="text-2xl font-semibold mb-4">Acceso restringido</h1>
            <p className="text-muted-foreground mb-6">
              No tienes permisos para acceder al editor visual. Esta herramienta está disponible solo para administradores.
            </p>
            <Button onClick={() => setLocation('/')}>
              Volver al inicio
            </Button>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Editor Visual - Kasa Serena"
        description="Herramienta de edición visual para personalizar el sitio web."
        noindex={true}
      />
      
      {/* Sin Container para aprovechar todo el ancho */}
      <VisualEditor />
    </div>
  );
};

export default EditorVisualPage;