import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { queryClient } from '@/lib/query-client';
import { useAuthStore } from '@/infrastructure/stores/authStore';
import { AuthPage } from '@/pages/AuthPage';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function AppContent() {
  const { user, loading, initialize } = useAuthStore();

  // Initialize auth on mount
  React.useEffect(() => {
    initialize();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<ProfileForm />} />
      </Routes>
    </Router>
  );
}

function Dashboard() {
  const { user, profile, signOut } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">
                  🐾 Finder Pet - Dashboard
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  ¡Bienvenido, {profile?.name || user.email}!
                </CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => window.location.href = '/profile'}>
                  Mi Perfil
                </Button>
                <Button variant="destructive" onClick={signOut}>
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </CardHeader>
              <CardContent>
                <Tabs defaultValue="libraries" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="libraries">Librerías</TabsTrigger>
                    <TabsTrigger value="components">Componentes</TabsTrigger>
                    <TabsTrigger value="features">Características</TabsTrigger>
                  </TabsList>

                  <TabsContent value="libraries" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            ✅ Vite + React + TypeScript
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Configuración base con tipado estricto
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            ✅ React Router
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Navegación y rutas protegidas
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            ✅ TanStack Query
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Fetching y cache de datos
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            ✅ Tailwind CSS
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Base de estilos y theming
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            ✅ shadcn/ui
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Componentes accesibles y personalizables
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            ✅ React Hook Form + Zod
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Formularios con validación tipada
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            ✅ TanStack Table
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Tablas avanzadas para panel admin
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">✅ Leaflet</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Mapas con ubicación de mascotas
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">✅ date-fns</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Manejo de fechas y horas
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="components" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Componentes shadcn/ui disponibles:
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="default">Button</Button>
                          <Button variant="secondary">Secondary</Button>
                          <Button variant="outline">Outline</Button>
                          <Button variant="destructive">Destructive</Button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Input con validación:
                        </h3>
                        <Input
                          placeholder="Escribe algo aquí..."
                          className="max-w-sm"
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Fecha actual (date-fns):
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", {
                            locale: es,
                          })}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="features" className="space-y-4">
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            🚀 Características Implementadas
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm">
                            <li>
                              • Configuración completa de TypeScript con alias
                              de importación (@/*)
                            </li>
                            <li>
                              • Tailwind CSS configurado con tema oscuro/claro
                            </li>
                            <li>• React Query con configuración optimizada</li>
                            <li>• React Router para navegación</li>
                            <li>• Componentes shadcn/ui listos para usar</li>
                            <li>• React Hook Form + Zod para formularios</li>
                            <li>• TanStack Table para tablas avanzadas</li>
                            <li>• Leaflet para mapas interactivos</li>
                            <li>• date-fns para manejo de fechas</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <div className="text-center">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                          ¡Comenzar a desarrollar! 🎉
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
