import html2pdf from "html2pdf.js";

/**
 * Genera un PDF para un Smart Container diseñado
 * @param containerData Datos del Smart Container generado
 */
export function generateSmartContainerPDF(containerData: {
  image: string;
  title: string;
  description: string;
  materials: string[];
  estimatedTime: string;
}) {
  // Crear un elemento temporal para el PDF
  const element = document.createElement("div");
  element.style.padding = "20px";
  element.style.fontFamily = "Arial, sans-serif";
  
  // Construir el contenido HTML del PDF
  element.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="/Logo-Kasa-Serena.png" width="180px" style="margin-bottom: 10px;" />
      <h1 style="color: #876A44; margin: 10px 0;">${containerData.title}</h1>
      <p style="color: #666; font-style: italic;">Generado: ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <img src="${containerData.image}" style="max-width: 100%; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
    </div>
    
    <div style="margin: 20px 0;">
      <h2 style="color: #876A44; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px;">Descripción Arquitectónica</h2>
      <p style="line-height: 1.6;">${containerData.description}</p>
    </div>
    
    <div style="margin: 20px 0;">
      <h2 style="color: #876A44; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px;">Características Técnicas</h2>
      <ul style="padding-left: 20px;">
        ${containerData.materials.map(m => `<li style="margin-bottom: 8px;">${m}</li>`).join("")}
      </ul>
    </div>
    
    <div style="margin: 20px 0;">
      <h2 style="color: #876A44; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px;">Tiempo Estimado de Instalación</h2>
      <p style="font-weight: bold;">${containerData.estimatedTime}</p>
    </div>
    
    <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
      <p>Este documento fue generado automáticamente por Kasa Serena Designs.</p>
      <p>Para más información, contáctenos al +1 (XXX) XXX-XXXX o visite <a href="https://kasaserena.com">kasaserena.com</a></p>
    </div>
  `;

  // Opciones para el PDF
  const options = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename: "SmartContainer-KasaSerena.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as "portrait" }
  };

  // Generar y descargar el PDF
  html2pdf().from(element).set(options).save();
}

/**
 * Genera un PDF para un diseño genérico
 * @param designData Datos del diseño generado
 */
export function generateDesignPDF(designData: {
  image: string;
  title: string;
  description: string;
  materials: string[];
  estimatedTime: string;
  type: string;
}) {
  // Crear un elemento temporal para el PDF
  const element = document.createElement("div");
  element.style.padding = "20px";
  element.style.fontFamily = "Arial, sans-serif";
  
  // Construir el contenido HTML del PDF
  element.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="/Logo-Kasa-Serena.png" width="180px" style="margin-bottom: 10px;" />
      <h1 style="color: #876A44; margin: 10px 0;">${designData.title}</h1>
      <p style="color: #666; font-style: italic;">Generado: ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <img src="${designData.image}" style="max-width: 100%; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
    </div>
    
    <div style="margin: 20px 0;">
      <h2 style="color: #876A44; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px;">Descripción del Diseño</h2>
      <p style="line-height: 1.6;">${designData.description}</p>
    </div>
    
    <div style="margin: 20px 0;">
      <h2 style="color: #876A44; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px;">Materiales</h2>
      <ul style="padding-left: 20px;">
        ${designData.materials.map(m => `<li style="margin-bottom: 8px;">${m}</li>`).join("")}
      </ul>
    </div>
    
    <div style="margin: 20px 0;">
      <h2 style="color: #876A44; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px;">Tiempo Estimado de Producción</h2>
      <p style="font-weight: bold;">${designData.estimatedTime}</p>
    </div>
    
    <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
      <p>Este documento fue generado automáticamente por Kasa Serena Designs.</p>
      <p>Para cotizar este diseño, contáctenos al +1 (XXX) XXX-XXXX o visite <a href="https://kasaserena.com">kasaserena.com</a></p>
    </div>
  `;

  // Opciones para el PDF
  const options = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename: `${designData.type.replace(/\s+/g, '-')}-KasaSerena.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as "portrait" }
  };

  // Generar y descargar el PDF
  html2pdf().from(element).set(options).save();
}

/**
 * Crea una URL para compartir vía WhatsApp con la información del diseño
 */
export function createWhatsAppShareLink(description: string, projectType: string) {
  const contactNumber = "1XXXXXXXXXX"; // Reemplazar con número real
  const message = `Hola, me gustaría cotizar este diseño de ${projectType} de Kasa Serena: ${description}`;
  
  return `https://wa.me/${contactNumber}?text=${encodeURIComponent(message)}`;
}