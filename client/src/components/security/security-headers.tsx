import React, { useEffect } from 'react';

/**
 * Componente para establecer cabeceras de seguridad en el cliente
 * Nota: Esto es complementario a las cabeceras HTTP que deben configurarse en el servidor
 */
export function SecurityHeaders() {
  useEffect(() => {
    // Establecer meta tag para Content Security Policy (CSP)
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://storage.googleapis.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "img-src 'self' data: https://*; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "connect-src 'self' https://api.openai.com https://*.googleapis.com https://*.firebase.com https://*.stripe.com; " +
      "frame-src 'self' https://*.stripe.com;";
    
    document.head.appendChild(cspMeta);
    
    // Establecer meta tag para X-Frame-Options
    const xfoMeta = document.createElement('meta');
    xfoMeta.httpEquiv = 'X-Frame-Options';
    xfoMeta.content = 'SAMEORIGIN';
    document.head.appendChild(xfoMeta);
    
    // Establecer meta tag para X-XSS-Protection
    const xxpMeta = document.createElement('meta');
    xxpMeta.httpEquiv = 'X-XSS-Protection';
    xxpMeta.content = '1; mode=block';
    document.head.appendChild(xxpMeta);
    
    // Establecer meta tag para X-Content-Type-Options
    const xctoMeta = document.createElement('meta');
    xctoMeta.httpEquiv = 'X-Content-Type-Options';
    xctoMeta.content = 'nosniff';
    document.head.appendChild(xctoMeta);
    
    // Establecer meta tag para Referrer-Policy
    const refMeta = document.createElement('meta');
    refMeta.name = 'referrer';
    refMeta.content = 'strict-origin-when-cross-origin';
    document.head.appendChild(refMeta);

    // Limpieza
    return () => {
      document.head.removeChild(cspMeta);
      document.head.removeChild(xfoMeta);
      document.head.removeChild(xxpMeta);
      document.head.removeChild(xctoMeta);
      document.head.removeChild(refMeta);
    };
  }, []);

  return null; // Este componente no renderiza nada visualmente
}

export default SecurityHeaders;