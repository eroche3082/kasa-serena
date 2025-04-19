import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FaHome } from 'react-icons/fa';

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  fullName: z.string().optional(),
  isProfessional: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const LoginPage = () => {
  const [location, setLocation] = useLocation();
  const { login, register, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [isProfessional, setIsProfessional] = useState<boolean>(false);
  
  // Get URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const professionalParam = params.get('professional');
    
    if (professionalParam === 'true') {
      setIsProfessional(true);
      setActiveTab("register");
    }
  }, []);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/profile');
    }
  }, [isAuthenticated, setLocation]);
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullName: "",
      isProfessional: isProfessional,
    },
  });
  
  // Update isProfessional when it changes
  useEffect(() => {
    registerForm.setValue('isProfessional', isProfessional);
  }, [isProfessional, registerForm]);
  
  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.username, data.password);
      // Redirect happens automatically via useEffect
    } catch (error) {
      // Error toast is shown in the login function
      console.error("Login error:", error);
    }
  };
  
  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      await register(data);
      // Redirect happens automatically via useEffect
    } catch (error) {
      // Error toast is shown in the register function
      console.error("Registration error:", error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return null; // will redirect
  }

  return (
    <main className="pt-28 pb-16 min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="text-primary">
              <FaHome className="text-3xl" />
            </div>
            <div>
              <h1 className="text-2xl font-['Playfair_Display'] font-bold text-neutral-900 tracking-tight">
                Kasa Serena <span className="text-primary">Designs</span>
              </h1>
            </div>
          </div>
        </div>
        
        <div className="max-w-md mx-auto">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
            
            {/* Login form */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Iniciar sesión</CardTitle>
                  <CardDescription>
                    Ingresa tus credenciales para acceder a tu cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre de usuario</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ingresa tu nombre de usuario" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contraseña</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Ingresa tu contraseña" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        disabled={loginForm.formState.isSubmitting}
                      >
                        {loginForm.formState.isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="text-sm text-center text-neutral-600">
                    ¿No tienes una cuenta?{' '}
                    <button 
                      className="text-primary hover:underline" 
                      onClick={() => setActiveTab("register")}
                    >
                      Regístrate aquí
                    </button>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setLocation('/')}
                  >
                    Volver al inicio
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Register form */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Crear una cuenta</CardTitle>
                  <CardDescription>
                    Regístrate para acceder a todas las funcionalidades
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre de usuario</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Elige un nombre de usuario" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correo electrónico</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="tu@email.com" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre completo (opcional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Tu nombre completo" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contraseña</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Crea una contraseña segura" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="isProfessional"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  setIsProfessional(!!checked);
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Cuenta profesional
                              </FormLabel>
                              <p className="text-sm text-neutral-500">
                                Marca esta casilla si eres arquitecto, diseñador o contratista
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        disabled={registerForm.formState.isSubmitting}
                      >
                        {registerForm.formState.isSubmitting ? "Registrando..." : "Registrarse"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="text-sm text-center text-neutral-600">
                    ¿Ya tienes una cuenta?{' '}
                    <button 
                      className="text-primary hover:underline" 
                      onClick={() => setActiveTab("login")}
                    >
                      Inicia sesión aquí
                    </button>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setLocation('/')}
                  >
                    Volver al inicio
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
