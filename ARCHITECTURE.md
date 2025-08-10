# 🏗️ Arquitectura del Proyecto Finder Pet

## 📋 Resumen de la Arquitectura

Finder Pet utiliza una **Arquitectura Limpia (Clean Architecture)** combinada con **Zustand** para gestión de estado y **React Query** para manejo de datos del servidor.

## 🎯 Principios de Arquitectura

### **Clean Architecture (Arquitectura Limpia)**
- **Separación de responsabilidades** clara
- **Independencia de frameworks** externos
- **Testabilidad** en todas las capas
- **Mantenibilidad** y escalabilidad

### **Patrones Utilizados**
- **Repository Pattern** → Abstracción de acceso a datos
- **Use Case Pattern** → Lógica de negocio
- **Dependency Injection** → Inversión de dependencias
- **Observer Pattern** → React Query y Zustand

## 🏛️ Estructura de Capas

```
src/
├── domain/                    # 🎯 Capa de Dominio (Core)
│   ├── entities/             # Entidades de negocio
│   ├── repositories/         # Interfaces de repositorios
│   └── usecases/            # Casos de uso
├── infrastructure/           # 🔧 Capa de Infraestructura
│   ├── repositories/        # Implementaciones de repositorios
│   ├── stores/             # Stores de Zustand
│   └── hooks/              # Hooks de React Query
├── presentation/            # 🎨 Capa de Presentación
│   ├── components/         # Componentes React
│   ├── pages/             # Páginas
│   └── contexts/          # Contextos (si es necesario)
└── shared/                 # 🔄 Código Compartido
    ├── lib/               # Utilidades
    ├── types/             # Tipos compartidos
    └── constants/         # Constantes
```

## 🎯 Capa de Dominio

### **Entities (Entidades)**
```typescript
// src/domain/entities/User.ts
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  id: string;
  role: 'adoptante' | 'publicador' | 'admin';
  name: string;
  city: string;
  avatar_url?: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}
```

### **Repository Interfaces**
```typescript
// src/domain/repositories/AuthRepository.ts
export interface AuthRepository {
  signIn(email: string, password: string): Promise<User>;
  signUp(email: string, password: string, name: string, city: string): Promise<User>;
  getProfile(userId: string): Promise<Profile>;
  updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile>;
  // ... más métodos
}
```

### **Use Cases**
```typescript
// src/domain/usecases/auth/AuthUseCases.ts
export class AuthUseCases {
  constructor(private authRepository: AuthRepository) {}

  async signIn(email: string, password: string): Promise<User> {
    return this.authRepository.signIn(email, password);
  }
  
  // ... más casos de uso
}
```

## 🔧 Capa de Infraestructura

### **Repository Implementations**
```typescript
// src/infrastructure/repositories/SupabaseAuthRepository.ts
export class SupabaseAuthRepository implements AuthRepository {
  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return this.mapToUser(data.user);
  }
  
  // ... implementación de todos los métodos
}
```

### **Zustand Stores**
```typescript
// src/infrastructure/stores/authStore.ts
export const useAuthStore = create<AuthStore>((set, get) => ({
  // State
  user: null,
  profile: null,
  loading: true,
  error: null,

  // Actions
  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const user = await authUseCases.signIn(email, password);
      set({ user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  // ... más acciones
}));
```

### **React Query Hooks**
```typescript
// src/infrastructure/hooks/useAuth.ts
export const useSignIn = () => {
  const { signIn } = useAuthStore();
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
  });
};

export const useProfile = (userId: string | null) => {
  const { getProfile } = useAuthStore();

  return useQuery({
    queryKey: authKeys.profile(userId!),
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
  });
};
```

## 🎨 Capa de Presentación

### **Componentes**
```typescript
// src/components/auth/LoginForm.tsx
export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignUp }) => {
  const { error, clearError } = useAuthStore();
  const signInMutation = useSignIn();
  
  const onSubmit = async (data: LoginFormData) => {
    clearError();
    try {
      await signInMutation.mutateAsync({ 
        email: data.email, 
        password: data.password 
      });
    } catch (error) {
      // Error handled by store
    }
  };
  
  // ... render logic
};
```

## 🔄 Flujo de Datos

```
1. Component (UI) 
   ↓
2. React Query Hook (useSignIn)
   ↓
3. Zustand Store (useAuthStore.signIn)
   ↓
4. Use Case (AuthUseCases.signIn)
   ↓
5. Repository (SupabaseAuthRepository.signIn)
   ↓
6. External API (Supabase)
```

## 🧪 Testing Strategy

### **Unit Tests**
- **Use Cases** → Lógica de negocio
- **Repositories** → Acceso a datos
- **Stores** → Gestión de estado

### **Integration Tests**
- **React Query Hooks** → Integración con API
- **Component Integration** → Flujo completo

### **E2E Tests**
- **User Flows** → Flujos de usuario completos

## 📊 Ventajas de esta Arquitectura

### ✅ **Separación de Responsabilidades**
- Cada capa tiene una responsabilidad específica
- Fácil de entender y mantener

### ✅ **Testabilidad**
- Cada capa puede ser testeada independientemente
- Mocks y stubs fáciles de implementar

### ✅ **Escalabilidad**
- Fácil agregar nuevas funcionalidades
- Cambios aislados en cada capa

### ✅ **Mantenibilidad**
- Código organizado y predecible
- Refactoring seguro

### ✅ **Independencia de Frameworks**
- Lógica de negocio independiente de React/Supabase
- Fácil cambiar tecnologías

## 🚀 Beneficios de las Tecnologías

### **Zustand**
- ✅ Estado global simple y eficiente
- ✅ TypeScript nativo
- ✅ Sin boilerplate
- ✅ DevTools integradas

### **React Query**
- ✅ Cache inteligente
- ✅ Sincronización automática
- ✅ Estados de carga/error
- ✅ Optimistic updates

### **Clean Architecture**
- ✅ Código limpio y organizado
- ✅ Fácil de testear
- ✅ Independencia de frameworks
- ✅ Escalabilidad

## 📝 Convenciones de Código

### **Naming**
- **Entities**: PascalCase (`User`, `Profile`)
- **Repositories**: PascalCase + Repository (`AuthRepository`)
- **Use Cases**: PascalCase + UseCases (`AuthUseCases`)
- **Stores**: camelCase + Store (`useAuthStore`)
- **Hooks**: camelCase + use (`useSignIn`)

### **File Structure**
- **One class/interface per file**
- **Index files for exports**
- **Consistent folder structure**

### **TypeScript**
- **Strict mode enabled**
- **Interface over type when possible**
- **Generic types for reusability**

## 🔧 Configuración

### **Dependencies**
```json
{
  "zustand": "^4.4.0",
  "@tanstack/react-query": "^5.0.0",
  "@supabase/supabase-js": "^2.0.0"
}
```

### **Environment Variables**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Esta arquitectura proporciona una base sólida y escalable para el desarrollo de Finder Pet, siguiendo las mejores prácticas de Clean Architecture y las tecnologías modernas de React. 🏗️✨
