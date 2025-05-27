#!/bin/bash

# Script para construir la imagen Docker de la aplicación
set -e

# Variables
APP_NAME="task-manager-angular"
IMAGE_TAG="latest"

echo "🐳 Iniciando proceso de construcción Docker..."

# Verificar si Docker está ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está ejecutándose."
    echo "📋 Por favor, inicia Docker Desktop y ejecuta este script nuevamente."
    echo ""
    echo "💡 Pasos para iniciar Docker:"
    echo "   1. Abre Docker Desktop"
    echo "   2. Espera a que aparezca el ícono de Docker en la barra de menú"
    echo "   3. Ejecuta este script nuevamente"
    exit 1
fi

echo "✅ Docker está ejecutándose correctamente"

# Construir la imagen
echo "📦 Construyendo imagen Docker..."
docker build -t ${APP_NAME}:${IMAGE_TAG} .

if [ $? -eq 0 ]; then
    echo "✅ Imagen construida exitosamente: ${APP_NAME}:${IMAGE_TAG}"
    
    # Mostrar información de la imagen
    echo "📊 Información de la imagen:"
    docker images ${APP_NAME}:${IMAGE_TAG}
    
    echo ""
    echo "🚀 Para ejecutar la aplicación:"
    echo "   docker run -p 8080:80 ${APP_NAME}:${IMAGE_TAG}"
    echo ""
    echo "🌐 La aplicación estará disponible en: http://localhost:8080"
else
    echo "❌ Error al construir la imagen Docker"
    exit 1
fi 