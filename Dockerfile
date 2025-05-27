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

# Etapa de producción
FROM nginx:alpine AS production

# Copiar configuración de nginx desde el subdirectorio
COPY task-manager-angular/nginx.conf /etc/nginx/nginx.conf

# Limpiar el directorio por defecto de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar SOLO los archivos del subdirectorio browser (CORREGIDO)
COPY --from=build /app/dist/task-manager-angular/browser/ /usr/share/nginx/html/

# Exponer puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"] 