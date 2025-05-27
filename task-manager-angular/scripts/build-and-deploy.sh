#!/bin/bash

# Script para construir y desplegar la aplicación en OpenShift
set -e

# Variables
APP_NAME="task-manager-angular"
IMAGE_TAG="latest"
NAMESPACE="default"

echo "🚀 Iniciando proceso de construcción y despliegue..."

# 1. Construir la imagen Docker
echo "📦 Construyendo imagen Docker..."
docker build -t ${APP_NAME}:${IMAGE_TAG} .

# 2. Etiquetar para el registro de OpenShift (ajustar según tu registro)
echo "🏷️  Etiquetando imagen para OpenShift..."
# docker tag ${APP_NAME}:${IMAGE_TAG} your-registry/${NAMESPACE}/${APP_NAME}:${IMAGE_TAG}

# 3. Subir imagen al registro (descomentar cuando tengas acceso al registro)
# echo "⬆️  Subiendo imagen al registro..."
# docker push your-registry/${NAMESPACE}/${APP_NAME}:${IMAGE_TAG}

# 4. Aplicar manifiestos de OpenShift
echo "🔧 Aplicando manifiestos de OpenShift..."
oc apply -f openshift/deployment.yaml -n ${NAMESPACE}
oc apply -f openshift/service.yaml -n ${NAMESPACE}
oc apply -f openshift/route.yaml -n ${NAMESPACE}

# 5. Esperar a que el despliegue esté listo
echo "⏳ Esperando a que el despliegue esté listo..."
oc rollout status deployment/${APP_NAME} -n ${NAMESPACE}

# 6. Obtener la URL de la aplicación
echo "🌐 Obteniendo URL de la aplicación..."
ROUTE_URL=$(oc get route ${APP_NAME}-route -n ${NAMESPACE} -o jsonpath='{.spec.host}')

echo "✅ Despliegue completado exitosamente!"
echo "🔗 URL de la aplicación: https://${ROUTE_URL}"

# 7. Mostrar estado de los pods
echo "📊 Estado de los pods:"
oc get pods -l app=${APP_NAME} -n ${NAMESPACE} 