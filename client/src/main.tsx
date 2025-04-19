import { createRoot } from "react-dom/client";
import App from "./App";
// Importar Poppins
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
// Importar estilos principales
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { DesignProvider } from "./context/DesignContext";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <DesignProvider>
      <App />
    </DesignProvider>
  </AuthProvider>
);
