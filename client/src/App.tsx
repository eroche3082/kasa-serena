import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/features/common";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { Header, Footer } from "@/features/layout";
import { useAuth } from "@/context/AuthContext";
import { SecurityHeaders } from "@/components/security/security-headers";

// Importaciones directas para todas las páginas
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import DesignStudioPage from "@/pages/DesignStudioPage";
import ProfilePage from "@/pages/ProfilePage";
import DashboardPage from "@/pages/DashboardPage";
import AIVisualizationDemo from "@/pages/AIVisualizationDemo";
import DesignGeneratorPage from "@/pages/DesignGeneratorPage";
import AIDesignPage from "@/pages/AIDesignPage";
import SmartContainerPage from "@/pages/SmartContainerPage";
import ModularPoolPage from "@/pages/ModularPoolPage";
import QuotesPage from "@/pages/QuotesPage";
import QuoteRequestPage from "@/pages/QuoteRequestPage";
import AgentChecklistPage from "@/pages/AgentChecklistPage";
import GaleriaPage from "@/pages/GaleriaPage";
import InspirationChatPage from "@/pages/InspirationChatPage";
import AdminPage from "@/pages/AdminPage";
import SuperAdminPage from "@/pages/SuperAdminPage";
import EditorVisualPage from "@/pages/EditorVisualPage";

function Router() {
  const auth = useAuth();
  
  useEffect(() => {
    if (auth && auth.checkAuth) {
      auth.checkAuth();
    }
  }, [auth]);
  
  return (
    <>
      <Header />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/design-studio" component={DesignStudioPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/ai-visualization" component={AIVisualizationDemo} />
        <Route path="/design-generator" component={DesignGeneratorPage} />
        <Route path="/ai-design" component={AIDesignPage} />
        <Route path="/smart-container" component={SmartContainerPage} />
        <Route path="/modular-pool" component={ModularPoolPage} />
        <Route path="/cotizaciones" component={QuotesPage} />
        <Route path="/solicitar-cotizacion" component={QuoteRequestPage} />
        <Route path="/solicitar-cotizacion/:id" component={QuoteRequestPage} />
        <Route path="/galeria" component={GaleriaPage} />
        <Route path="/inspiracion" component={InspirationChatPage} />
        <Route path="/internal-map" component={AgentChecklistPage} />
        <Route path="/agent-checklist" component={AgentChecklistPage} />
        {/* Nuevas rutas para administración y editor visual */}
        <Route path="/admin" component={AdminPage} />
        <Route path="/super-admin" component={SuperAdminPage} />
        <Route path="/editor-visual" component={EditorVisualPage} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SecurityHeaders />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
