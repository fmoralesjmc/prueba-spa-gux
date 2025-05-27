# Etapa de construcción - VERSIÓN PARA REPOSITORIO
FROM node:22-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias desde el subdirectorio
COPY task-manager-angular/package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente desde el subdirectorio
COPY task-manager-angular/ .

# Construir la aplicación
RUN npm run build -- --configuration=production

# Etapa de producción - Usar imagen compatible con OpenShift
FROM registry.access.redhat.com/ubi8/httpd-24 AS production

# Copiar SOLO los archivos del subdirectorio browser
COPY --from=build /app/dist/task-manager-angular/browser/ /var/www/html/

# Exponer puerto 8080 (puerto por defecto de httpd en OpenShift)
EXPOSE 8080

# El comando por defecto ya está configurado en la imagen base 