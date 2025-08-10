# 🐾 Finder Pet

Una aplicación moderna para encontrar mascotas perdidas y reportar mascotas encontradas, construida con las mejores tecnologías web.

## 🚀 Tecnologías Utilizadas

### **Frontend Core**

- **Vite + React + TypeScript** → Configuración base con tipado estricto
- **React Router** → Navegación y rutas protegidas
- **TanStack Query (React Query)** → Fetching y cache de datos

### **Styling & UI**

- **Tailwind CSS** → Base de estilos y theming
- **shadcn/ui** → Componentes accesibles y personalizables

### **Form Handling & Validation**

- **React Hook Form + Zod** → Formularios con validación tipada

### **Data & Tables**

- **TanStack Table** → Tablas avanzadas para panel admin

### **Maps & Dates**

- **Leaflet** → Mapas con ubicación de mascotas
- **date-fns** → Manejo de fechas y horas

### **Testing**

- **Jest** → Testing unitario y de integración
- **React Testing Library** → Testing de componentes
- **jest-environment-jsdom** → Simulación de DOM
- **MSW (Mock Service Worker)** → Mock de API de Supabase en tests

### **Tooling**

- **ESLint + Prettier** → Estilo de código consistente
- **Husky + lint-staged** → Validaciones pre-commit

### **Deployment & Backend**

- **Vercel** → Hosting frontend
- **Supabase Cloud** → Backend y base de datos

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd finder-pet

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa de la build

# Testing
npm run test         # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run test:coverage # Tests con cobertura
npm run test:ci      # Tests para CI/CD

# Linting y Formateo
npm run lint         # Verificar linting
npm run lint:fix     # Corregir errores de linting
npm run format       # Formatear código
npm run format:check # Verificar formato
```

## 🧪 Testing

El proyecto incluye una configuración completa de testing:

### **Componentes**

```bash
# Test de componentes individuales
npm run test src/components/__tests__/Button.test.tsx
```

### **API Integration**

```bash
# Test de integración con API
npm run test src/__tests__/api.test.ts
```

### **Cobertura**

```bash
# Generar reporte de cobertura
npm run test:coverage
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   ├── ui/              # Componentes shadcn/ui
│   └── __tests__/       # Tests de componentes
├── lib/
│   ├── utils.ts         # Utilidades shadcn/ui
│   └── query-client.ts  # Configuración React Query
├── mocks/
│   ├── handlers.ts      # MSW handlers
│   ├── server.ts        # MSW server config
│   └── browser.ts       # MSW browser config
├── __tests__/           # Tests de integración
├── setupTests.ts        # Configuración de tests
└── App.tsx              # Componente principal
```

## 🔧 Configuración

### **TypeScript**

- Configurado con alias de importación (`@/*` → `./src/*`)
- Tipado estricto habilitado
- Configuración separada para tests

### **Tailwind CSS**

- Configurado con tema oscuro/claro
- Variables CSS personalizadas
- Componentes shadcn/ui integrados

### **ESLint + Prettier**

- Reglas optimizadas para React + TypeScript
- Integración con shadcn/ui
- Formateo automático en pre-commit

### **Husky + lint-staged**

- Validaciones automáticas en pre-commit
- Linting y formateo de archivos modificados
- Prevención de commits con errores

## 🚀 Deployment

### **Vercel (Frontend)**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### **Supabase (Backend)**

```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar proyecto
supabase init

# Iniciar localmente
supabase start

# Deploy
supabase db push
```

## 📝 Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Vercel
VITE_VERCEL_URL=your_vercel_url
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio.

---

**Desarrollado con ❤️ para ayudar a encontrar mascotas perdidas**
