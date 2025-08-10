#!/bin/bash

echo "🔍 Ejecutando verificaciones de calidad..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Función para mostrar errores
show_error() {
    echo "❌ $1"
    exit 1
}

# Función para mostrar éxito
show_success() {
    echo "✅ $1"
}

echo "📝 Verificando TypeScript..."
if npm run typecheck; then
    show_success "TypeScript check completado"
else
    show_error "TypeScript check falló"
fi

echo "🧪 Ejecutando tests con coverage..."
if npm run test:coverage; then
    show_success "Tests con coverage completados"
else
    show_error "Tests fallaron"
fi

echo "🎉 ¡Todas las verificaciones de calidad pasaron exitosamente!"
