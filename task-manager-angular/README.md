# 📋 Task Manager Angular

Una aplicación SPA (Single Page Application) desarrollada con Angular 19 para gestionar tareas de usuario con funcionalidades completas de CRUD, filtros avanzados y persistencia local.

## 🎯 Características

- ✅ **Gestión completa de tareas**: Crear, listar, editar y eliminar tareas
- 🏷️ **Prioridades**: Alta, Media, Baja
- 📊 **Estados**: Pendiente, En Progreso, Completada
- 🔍 **Filtros avanzados**: Por estado, prioridad, fecha y búsqueda de texto
- 📱 **Diseño responsivo** con Angular Material
- 💾 **Persistencia local** con localStorage
- 🚀 **Optimizado para producción** con Docker y OpenShift

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Angular 19, TypeScript, Angular Material
- **Estilos**: SCSS, Angular Material Design
- **Formularios**: Reactive Forms con validaciones
- **Persistencia**: localStorage
- **Contenedores**: Docker con Nginx
- **Orquestación**: OpenShift/Kubernetes
- **Build**: Angular CLI

## 📋 Requisitos Previos

- Node.js 22.x
- npm 10.x
- Angular CLI 19.x
- Docker (para contenedores)
- OpenShift CLI (oc) para despliegue

## 🚀 Instalación y Configuración Local

### 1. Clonar el repositorio
\`\`\`bash
git clone <repository-url>
cd task-manager-angular
\`\`\`

### 2. Instalar dependencias
\`\`\`bash
npm install
\`\`\`

### 3. Ejecutar en modo desarrollo
\`\`\`bash
ng serve
\`\`\`

La aplicación estará disponible en `http://localhost:4200`

### 4. Ejecutar tests
\`\`\`bash
# Tests unitarios
ng test

# Tests e2e
ng e2e
\`\`\`

### 5. Construir para producción
\`\`\`bash
ng build --configuration=production
\`\`\`

## 🐳 Despliegue con Docker

### 1. Construir imagen Docker

Usar el script `docker-build.sh` que se encarga de verificar Docker, limpiar cache y construir la imagen:

```bash
./scripts/docker-build.sh
```

O manualmente:

```bash
docker build -t task-manager-angular:latest .
```

### 2. Ejecutar contenedor
```bash
docker run -p 8080:80 task-manager-angular:latest
```

La aplicación estará disponible en `http://localhost:8080`

## ☁️ Despliegue en OpenShift

### Opción 1: Script automatizado
\`\`\`bash
./scripts/build-and-deploy.sh
\`\`\`

### Opción 2: Comandos manuales

#### 1. Construir y subir imagen
\`\`\`bash
# Construir imagen
docker build -t task-manager-angular:latest .

# Etiquetar para registro de OpenShift
docker tag task-manager-angular:latest <your-registry>/task-manager-angular:latest

# Subir al registro
docker push <your-registry>/task-manager-angular:latest
\`\`\`

#### 2. Aplicar manifiestos
\`\`\`bash
# Crear namespace (opcional)
oc new-project task-manager

# Aplicar manifiestos
oc apply -f openshift/deployment.yaml
oc apply -f openshift/service.yaml
oc apply -f openshift/route.yaml
\`\`\`

#### 3. Verificar despliegue
\`\`\`bash
# Verificar estado del deployment
oc rollout status deployment/task-manager-angular

# Ver pods
oc get pods -l app=task-manager-angular

# Obtener URL de la aplicación
oc get route task-manager-angular-route
\`\`\`

## 📁 Estructura del Proyecto

\`\`\`
task-manager-angular/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── task-list/          # Componente principal de lista
│   │   │   ├── task-form/          # Formulario de tareas
│   │   │   └── task-item/          # Item individual de tarea
│   │   ├── models/
│   │   │   └── task.model.ts       # Interfaces y tipos
│   │   ├── services/
│   │   │   └── task.service.ts     # Servicio de gestión de tareas
│   │   ├── app.component.*         # Componente raíz
│   │   └── app.config.ts           # Configuración de la app
│   ├── styles.scss                 # Estilos globales
│   └── index.html                  # HTML principal
├── openshift/
│   ├── deployment.yaml             # Deployment de OpenShift
│   ├── service.yaml                # Service de OpenShift
│   └── route.yaml                  # Route de OpenShift
├── scripts/
│   └── build-and-deploy.sh         # Script de despliegue
├── Dockerfile                      # Configuración Docker
├── nginx.conf                      # Configuración Nginx
└── README.md                       # Este archivo
\`\`\`

## 🎮 Uso de la Aplicación

### Crear una nueva tarea
1. Hacer clic en "Nueva Tarea"
2. Completar el formulario:
   - **Título**: Nombre de la tarea (3-100 caracteres)
   - **Descripción**: Descripción detallada (10-500 caracteres)
   - **Prioridad**: Alta, Media o Baja
   - **Fecha límite**: Fecha de vencimiento
3. Hacer clic en "Crear Tarea"

### Gestionar tareas existentes
- **Editar**: Hacer clic en el menú (⋮) y seleccionar "Editar"
- **Eliminar**: Hacer clic en el menú (⋮) y seleccionar "Eliminar"
- **Cambiar estado**: Usar los botones de estado en cada tarea

### Filtrar y buscar
- **Búsqueda**: Escribir en el campo de búsqueda para filtrar por título o descripción
- **Estado**: Filtrar por Pendiente, En Progreso, Completada o Todas
- **Prioridad**: Filtrar por Alta, Media, Baja o Todas
- **Ordenar**: Por fecha límite, fecha de creación, prioridad o título
- **Limpiar filtros**: Botón "Limpiar" para resetear todos los filtros

## 🔧 Configuración Avanzada

### Variables de entorno
- `NODE_ENV`: Entorno de ejecución (development/production)

### Configuración de Nginx
El archivo `nginx.conf` incluye:
- Configuración para SPA (fallback a index.html)
- Compresión gzip
- Cache de archivos estáticos
- Headers de seguridad
- Health check endpoint

### Recursos de OpenShift
- **CPU**: 50m request, 100m limit
- **Memoria**: 64Mi request, 128Mi limit
- **Replicas**: 2 por defecto
- **Health checks**: Liveness y readiness probes

## 🐛 Solución de Problemas

### La aplicación muestra "Welcome to nginx!" en lugar de la app de tareas

Este problema ocurre si Docker está usando una capa de cache de una construcción anterior donde los archivos no se copiaron correctamente. Para solucionarlo:

1.  **Limpiar el cache de Docker**: Ejecuta `docker system prune -a -f` para limpiar todo el cache.
2.  **Reconstruir la imagen**: Usa el script `./scripts/docker-build.sh` que incluye un paso de limpieza de cache, o reconstruye manualmente con `docker build --no-cache -t task-manager-angular:latest .`
3.  **Verificar el Dockerfile**: Asegúrate que la línea `COPY --from=build /app/dist/task-manager-angular/browser/ /usr/share/nginx/html/` esté correcta para copiar los archivos desde el subdirectorio `browser`.

### La aplicación no carga
1. Verificar que el puerto esté disponible
2. Revisar logs del contenedor: `docker logs <container-id>`

### Problemas de persistencia
- Los datos se almacenan en localStorage del navegador
- Limpiar cache del navegador si hay problemas
- Los datos persisten entre sesiones del mismo navegador

### Errores de despliegue en OpenShift
1. Verificar permisos del usuario
2. Revisar logs: `oc logs deployment/task-manager-angular`
3. Verificar que la imagen esté disponible en el registro

## 📈 Mejoras Futuras

- [ ] Backend API REST
- [ ] Base de datos persistente
- [ ] Autenticación de usuarios
- [ ] Notificaciones push
- [ ] Modo offline con Service Workers
- [ ] Tests e2e automatizados
- [ ] CI/CD pipeline

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autor

Desarrollado como parte del arquetipo de aplicación SPA con Angular para despliegue en OpenShift.

---

⭐ Si este proyecto te fue útil, ¡no olvides darle una estrella!
