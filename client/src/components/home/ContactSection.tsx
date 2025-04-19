import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebookF, FaInstagram, FaPinterest } from 'react-icons/fa';
import { SiHouzz } from 'react-icons/si';
import { insertMessageSchema } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

// Extend the schema for client-side validation
const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  email: z.string().email({
    message: "Correo electrónico inválido",
  }),
  subject: z.string().min(3, {
    message: "El asunto debe tener al menos 3 caracteres",
  }),
  message: z.string().min(10, {
    message: "El mensaje debe tener al menos 10 caracteres",
  }),
  subscribed: z.boolean().default(false),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      subscribed: false
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest('POST', '/api/contact', data);
      
      toast({
        title: "Mensaje enviado",
        description: "Gracias por contactarnos. Te responderemos pronto.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold mb-6">Contacta con nosotros</h2>
            <p className="text-lg text-neutral-600 mb-8">
              Estamos aquí para responder a tus preguntas y ayudarte a transformar tu espacio con diseños inteligentes.
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asunto</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensaje</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={5}
                          className="resize-none" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subscribed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Suscribirme al boletín de novedades y ofertas especiales
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="px-8 py-3 bg-primary hover:bg-primary/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                </Button>
              </form>
            </Form>
          </div>
          
          <div>
            <div className="bg-neutral-100 rounded-xl p-8 mb-8">
              <h3 className="text-xl font-bold mb-6">Información de contacto</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="text-primary mt-1 mr-4">
                    <FaMapMarkerAlt className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Oficina y showroom</h4>
                    <p className="text-neutral-600">Calle Marina 250, San Juan, Puerto Rico 00901</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-primary mt-1 mr-4">
                    <FaPhone className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Teléfono</h4>
                    <p className="text-neutral-600">(787) 555-0123</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-primary mt-1 mr-4">
                    <FaEnvelope className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Correo electrónico</h4>
                    <p className="text-neutral-600">info@kasaserenadesigns.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-primary mt-1 mr-4">
                    <FaClock className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Horario</h4>
                    <p className="text-neutral-600">Lunes a viernes: 9:00 AM - 6:00 PM</p>
                    <p className="text-neutral-600">Sábados: 9:00 AM - 1:00 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="font-medium mb-3">Síguenos</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-neutral-600 hover:text-primary transition-colors">
                    <FaFacebookF className="text-xl" />
                  </a>
                  <a href="#" className="text-neutral-600 hover:text-primary transition-colors">
                    <FaInstagram className="text-xl" />
                  </a>
                  <a href="#" className="text-neutral-600 hover:text-primary transition-colors">
                    <FaPinterest className="text-xl" />
                  </a>
                  <a href="#" className="text-neutral-600 hover:text-primary transition-colors">
                    <SiHouzz className="text-xl" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-100 rounded-xl overflow-hidden h-64 relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30429.134682466893!2d-66.11544!3d18.46554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c036f3671e6ed2d%3A0x68f523db3584a846!2sSan%20Juan%2C%20Puerto%20Rico!5e0!3m2!1sen!2sus!4v1697045881267!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
