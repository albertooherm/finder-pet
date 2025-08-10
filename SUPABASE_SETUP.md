# 🗄️ Configuración de Supabase para Finder Pet

## 📋 Pasos para Configurar Supabase

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota la URL del proyecto y la anon key

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 3. Ejecutar Migraciones

#### Opción A: Usando Supabase CLI (Recomendado)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar Supabase en el proyecto
supabase init

# Conectar al proyecto remoto
supabase link --project-ref tu-project-ref

# Ejecutar migraciones
supabase db push
```

#### Opción B: Usando SQL Editor

1. Ve al SQL Editor en tu dashboard de Supabase
2. Copia y pega el contenido de `supabase/migrations/001_create_profiles_table.sql`
3. Ejecuta el script

### 4. Configurar Autenticación

#### Habilitar Proveedores de Auth

1. Ve a **Authentication > Providers** en tu dashboard
2. Habilita **Email** y **Google**
3. Para Google OAuth:
   - Ve a [Google Cloud Console](https://console.cloud.google.com)
   - Crea un proyecto y habilita Google+ API
   - Crea credenciales OAuth 2.0
   - Agrega las URLs de redirección:
     - `https://tu-proyecto.supabase.co/auth/v1/callback`
     - `http://localhost:5173/auth/callback` (desarrollo)

#### Configurar URLs de Redirección

En **Authentication > URL Configuration**:
- Site URL: `http://localhost:5173` (desarrollo)
- Redirect URLs: 
  - `http://localhost:5173/auth/callback`
  - `https://tu-dominio.com/auth/callback` (producción)

### 5. Configurar Storage

El bucket `avatars` se crea automáticamente con las migraciones, pero puedes verificar:

1. Ve a **Storage** en tu dashboard
2. Verifica que existe el bucket `avatars`
3. Las políticas de acceso ya están configuradas

### 6. Verificar Configuración

1. Ejecuta el proyecto: `npm run dev`
2. Intenta registrarte con email/password
3. Intenta iniciar sesión con Google
4. Verifica que se crea el perfil automáticamente

## 🔐 Políticas de Seguridad (RLS)

### Profiles Table

- **SELECT**: Usuarios pueden ver su propio perfil, admins pueden ver todos
- **UPDATE**: Solo el dueño del perfil o admins
- **INSERT**: Automático al crear usuario (trigger)

### Storage (Avatars)

- **SELECT**: Público (lectura de avatares)
- **INSERT/UPDATE/DELETE**: Solo el dueño del archivo

## 🚀 Funcionalidades Implementadas

### ✅ Autenticación
- [x] Registro con email/password
- [x] Inicio de sesión con email/password
- [x] OAuth con Google
- [x] Recuperación de contraseña
- [x] Cierre de sesión

### ✅ Perfiles de Usuario
- [x] Creación automática de perfil al registrarse
- [x] Edición de perfil (nombre, ciudad, rol)
- [x] Subida de avatar
- [x] Roles: adoptante, publicador, admin

### ✅ Seguridad
- [x] Row Level Security (RLS)
- [x] Políticas de acceso granulares
- [x] Validación de datos con Zod
- [x] Manejo de errores

## 🧪 Testing

Para probar la funcionalidad:

```bash
# Ejecutar tests
npm run test

# Tests específicos de autenticación
npm run test src/__tests__/auth.test.ts
```

## 📝 Notas Importantes

1. **Variables de Entorno**: Nunca subas `.env.local` al repositorio
2. **Migraciones**: Siempre ejecuta las migraciones en orden
3. **RLS**: Las políticas están configuradas para máxima seguridad
4. **Storage**: Los avatares se almacenan en el bucket `avatars`
5. **Triggers**: Los perfiles se crean automáticamente al registrarse

## 🔧 Troubleshooting

### Error: "Missing Supabase environment variables"
- Verifica que `.env.local` existe y tiene las variables correctas
- Reinicia el servidor de desarrollo

### Error: "Policy violation"
- Verifica que las políticas RLS están configuradas correctamente
- Ejecuta las migraciones nuevamente

### Error: "Storage bucket not found"
- Verifica que el bucket `avatars` existe
- Ejecuta la migración de storage

### Error: "OAuth redirect mismatch"
- Verifica las URLs de redirección en Supabase
- Asegúrate de que coincidan con tu configuración local
