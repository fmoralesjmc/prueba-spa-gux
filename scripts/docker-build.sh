#!/bin/bash

# Script para construir la imagen Docker de la aplicación Angular

echo "🐳 Iniciando proceso de construcción Docker..."

# Verificar si Docker está ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está ejecutándose"
    echo "Por favor, inicia Docker Desktop y vuelve a intentar"
    echo ""
    echo "En macOS:"
    echo "1. Abre Docker Desktop desde Applications"
    echo "2. Espera a que aparezca el ícono de Docker en la barra de menú"
    echo "3. Vuelve a ejecutar este script"
    exit 1
fi

echo "✅ Docker está ejecutándose correctamente"

# Limpiar cache de Docker para evitar problemas
echo "🧹 Limpiando cache de Docker..."
docker builder prune -f > /dev/null 2>&1

echo "📦 Construyendo imagen Docker..."
if docker build -t task-manager-angular:latest .; then
    echo "✅ Imagen construida exitosamente: task-manager-angular:latest"
    
    echo "📊 Información de la imagen:"
    docker images task-manager-angular:latest
    
    echo ""
    echo "🚀 Para ejecutar la aplicación:"
    echo "   docker run -p 8080:80 task-manager-angular:latest"
    echo ""
    echo "🌐 La aplicación estará disponible en: http://localhost:8080"
else
    echo "❌ Error al construir la imagen Docker"
    exit 1
fi 