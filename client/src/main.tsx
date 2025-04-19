import { createRoot } from "react-dom/client";
import App from "./App";
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
