import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import DesignStudioPage from "@/pages/DesignStudioPage";
import ProfilePage from "@/pages/ProfilePage";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import AIVisualizationDemo from "@/pages/AIVisualizationDemo";
import DesignGeneratorPage from "@/pages/DesignGeneratorPage";
import AIDesignPage from "@/pages/AIDesignPage";
import SmartContainerPage from "@/pages/SmartContainerPage";
import ModularPoolPage from "@/pages/ModularPoolPage";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

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
        <Route path="/design-studio" component={DesignStudioPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/ai-visualization" component={AIVisualizationDemo} />
        <Route path="/design-generator" component={DesignGeneratorPage} />
        <Route path="/ai-design" component={AIDesignPage} />
        <Route path="/smart-container" component={SmartContainerPage} />
        <Route path="/modular-pool" component={ModularPoolPage} />
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
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
