# 🎯 Guía de Calidad del Código

## 📋 Sistema de Calidad Implementado

Finder Pet utiliza un sistema de calidad robusto que se ejecuta automáticamente antes de cada commit y push.

## 🔧 Configuración Actual

### **Pre-commit Hook**
- ✅ **lint-staged** → Lint y format automático de archivos modificados
- ✅ **ESLint** → Verificación de código
- ✅ **Prettier** → Formateo automático

### **Pre-push Hook**
- ✅ **TypeScript Check** → Verificación de tipos
- ✅ **Tests con Coverage** → Mínimo 80% de cobertura
- ✅ **Lint completo** → Verificación de todo el proyecto

## 🚀 Comandos Disponibles

### **Calidad Básica**
```bash
npm run lint          # Verificar linting
npm run lint:fix      # Corregir errores de linting
npm run format        # Formatear código
npm run typecheck     # Verificar tipos TypeScript
```

### **Testing**
```bash
npm run test          # Ejecutar tests
npm run test:watch    # Tests en modo watch
npm run test:coverage # Tests con coverage (80% mínimo)
npm run test:ci       # Tests para CI/CD
```

### **Calidad Completa**
```bash
npm run quality:check # Verificación completa (TypeScript + Tests)
npm run quality:fix   # Corregir formato y linting
```

## 📊 Cobertura de Tests Requerida

- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

## 🔄 Flujo de Trabajo

### **1. Desarrollo Local**
```bash
# Hacer cambios en el código
git add .
git commit -m "feat: nueva funcionalidad"
# ✅ Pre-commit ejecuta automáticamente:
#   - lint-staged (lint + format)
```

### **2. Push a Repositorio**
```bash
git push origin main
# ✅ Pre-push ejecuta automáticamente:
#   - TypeScript check
#   - Tests con coverage 80%
#   - Lint completo
```

## ⚠️ Errores Comunes y Soluciones

### **Error: Coverage insuficiente**
```bash
# Solución: Agregar más tests
npm run test:coverage  # Ver qué archivos necesitan tests
# Crear tests para archivos con baja cobertura
```

### **Error: TypeScript errors**
```bash
# Solución: Corregir tipos
npm run typecheck     # Ver errores específicos
# Corregir tipos en el código
```

### **Error: Lint errors**
```bash
# Solución: Corregir código
npm run lint:fix      # Corregir automáticamente
# O corregir manualmente los errores
```

## 🧪 Estructura de Tests

```
src/
├── __tests__/           # Tests principales
│   ├── auth.test.ts     # Tests de autenticación
│   ├── store.test.ts    # Tests de Zustand store
│   ├── components.test.tsx # Tests de componentes
│   ├── repository.test.ts  # Tests de repositorios
│   └── usecases.test.ts    # Tests de casos de uso
├── components/
│   └── __tests__/       # Tests específicos de componentes
└── mocks/               # Mocks para tests
```

## 📝 Convenciones de Testing

### **Naming**
- **Archivos**: `*.test.ts` o `*.test.tsx`
- **Describe**: `describe('ComponentName', () => {})`
- **Tests**: `it('should do something', () => {})`

### **Estructura AAA**
```typescript
it('should do something', () => {
  // Arrange - Preparar
  const mockData = { id: 1, name: 'Test' };
  
  // Act - Ejecutar
  const result = someFunction(mockData);
  
  // Assert - Verificar
  expect(result).toBe(expectedValue);
});
```

## 🔧 Configuración de Jest

```javascript
// jest.config.js
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

## 🚨 Troubleshooting

### **Problema: Tests no ejecutan**
```bash
# Verificar configuración
npm run test -- --verbose
# Verificar que todos los mocks estén correctos
```

### **Problema: Coverage no se genera**
```bash
# Limpiar cache
npm run test -- --clearCache
# Verificar configuración de coverage
```

### **Problema: Hooks no funcionan**
```bash
# Reinstalar husky
npm run prepare
# Verificar permisos
chmod +x .husky/*
```

## 📈 Métricas de Calidad

### **Objetivos**
- ✅ **0 errores de linting**
- ✅ **0 errores de TypeScript**
- ✅ **80%+ cobertura de tests**
- ✅ **Todos los tests pasando**

### **Monitoreo**
```bash
# Ver métricas actuales
npm run quality:check

# Ver coverage detallado
npm run test:coverage
# Abrir coverage/lcov-report/index.html
```

## 🎯 Mejores Prácticas

### **Antes de Commit**
1. ✅ Ejecutar `npm run quality:check`
2. ✅ Verificar que todos los tests pasen
3. ✅ Verificar que el coverage sea ≥80%
4. ✅ Corregir cualquier error de linting

### **Antes de Push**
1. ✅ Ejecutar `npm run quality:check`
2. ✅ Verificar que el código esté formateado
3. ✅ Verificar que no haya errores de TypeScript

### **Desarrollo Continuo**
1. ✅ Escribir tests junto con el código
2. ✅ Mantener coverage alto
3. ✅ Seguir convenciones de linting
4. ✅ Usar TypeScript estrictamente

---

**¡Recuerda: La calidad del código es responsabilidad de todos! 🚀**
