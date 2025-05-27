# 📋 Task Manager Angular

Una aplicación SPA (Single Page Application) desarrollada con Angular 19 para gestionar tareas de usuario con funcionalidades completas de CRUD, filtros avanzados y persistencia local. Optimizada para despliegue en OpenShift usando Docker.

## 🎯 Características

- ✅ **Gestión completa de tareas**: Crear, listar, editar y eliminar tareas
- 🏷️ **Prioridades**: Alta, Media, Baja
- 📊 **Estados**: Pendiente, En Progreso, Completada
- 🔍 **Filtros avanzados**: Por estado, prioridad, fecha y búsqueda de texto
- 📱 **Diseño responsivo** con Angular Material
- 💾 **Persistencia local** con localStorage
- 🐳 **Containerizado con Docker** para despliegue en OpenShift
- 🚀 **CI/CD integrado** con builds automáticos desde Git

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Angular 19, TypeScript, Angular Material
- **Estilos**: SCSS, Angular Material Design
- **Formularios**: Reactive Forms con validaciones
- **Persistencia**: localStorage
- **Contenedores**: Docker multi-stage build
- **Servidor web**: Apache httpd (Red Hat UBI8)
- **Orquestación**: OpenShift/Kubernetes
- **Build**: Angular CLI

## 📋 Requisitos Previos

- Node.js 22.x
- npm 10.x
- Angular CLI 19.x
- Docker (para contenedores)
- OpenShift CLI (oc) para despliegue
- Acceso a un cluster OpenShift

## 🚀 Instalación y Configuración Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/fmoralesjmc/prueba-spa-gux.git
cd prueba-spa-gux/task-manager-angular
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en modo desarrollo
```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

### 4. Construir para producción
```bash
ng build --configuration=production
```

## 🐳 Despliegue con Docker

### Dockerfile Multi-stage

El proyecto utiliza un Dockerfile optimizado con multi-stage build:

```dockerfile
# Etapa de construcción
FROM node:22-alpine AS build
WORKDIR /app
COPY task-manager-angular/package*.json ./
RUN npm ci
COPY task-manager-angular/ .
RUN npm run build -- --configuration=production

# Etapa de producción
FROM registry.access.redhat.com/ubi8/httpd-24 AS production
COPY --from=build /app/dist/task-manager-angular/browser/ /var/www/html/
EXPOSE 8080
```

### 1. Construcción local (opcional)
```bash
# Desde el directorio raíz del repositorio
docker build -t task-manager-angular:latest .
docker run -p 8080:8080 task-manager-angular:latest
```

## ☁️ Despliegue en OpenShift

### Método Recomendado: Source-to-Image desde Git

#### 1. Login a OpenShift
```bash
oc login --token=<your-token> --server=<openshift-server-url>
```

#### 2. Crear aplicación desde repositorio Git
```bash
oc new-app --strategy=docker --name=task-manager-docker https://github.com/fmoralesjmc/prueba-spa-gux.git
```

#### 3. Exponer la aplicación
```bash
oc expose service/task-manager-docker
```

#### 4. Verificar el despliegue
```bash
# Ver estado del build
oc logs -f buildconfig/task-manager-docker

# Ver pods
oc get pods -l app=task-manager-docker

# Obtener URL de la aplicación
oc get route task-manager-docker
```

### Solución de Problemas Comunes

#### Problema: "Application is not available"

Si la aplicación muestra este error, es probable que haya un desajuste de puertos:

```bash
# Verificar el servicio
oc describe service task-manager-docker

# Corregir el targetPort si es necesario
oc patch service task-manager-docker --type='merge' -p='{"spec":{"ports":[{"name":"80-tcp","port":80,"protocol":"TCP","targetPort":8080}]}}'
```

#### Problema: Build falla por imagen base incorrecta

Si OpenShift está forzando una imagen base incorrecta:

```bash
# Limpiar la configuración de imagen base del BuildConfig
oc patch buildconfig task-manager-docker --type='merge' -p='{"spec":{"strategy":{"dockerStrategy":{"from":null}}}}'

# Iniciar nuevo build
oc start-build task-manager-docker --follow
```

### Comandos Útiles de Gestión

```bash
# Ver estado completo
oc status

# Hacer nuevo build
oc start-build task-manager-docker

# Ver logs de la aplicación
oc logs -f deployment/task-manager-docker

# Escalar la aplicación
oc scale deployment task-manager-docker --replicas=2

# Ver todas las rutas
oc get routes
```

## 📁 Estructura del Proyecto

```
prueba-spa-gux/
├── task-manager-angular/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── task-list/          # Componente principal de lista
│   │   │   │   ├── task-form/          # Formulario de tareas
│   │   │   │   └── task-item/          # Item individual de tarea
│   │   │   ├── models/
│   │   │   │   └── task.model.ts       # Interfaces y tipos
│   │   │   ├── services/
│   │   │   │   └── task.service.ts     # Servicio de gestión de tareas
│   │   │   ├── app.component.*         # Componente raíz
│   │   │   └── app.config.ts           # Configuración de la app
│   │   ├── styles.scss                 # Estilos globales
│   │   └── index.html                  # HTML principal
│   ├── package.json                    # Dependencias del proyecto
│   └── README.md                       # Este archivo
├── Dockerfile                          # Configuración Docker multi-stage
└── .git/                              # Repositorio Git
```

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

## 🔧 Configuración Técnica

### Imagen Base
- **Construcción**: `node:22-alpine` para build
- **Producción**: `registry.access.redhat.com/ubi8/httpd-24`
- **Puerto**: 8080 (estándar OpenShift)
- **Servidor web**: Apache httpd

### Recursos de OpenShift
- **CPU**: Configuración automática por OpenShift
- **Memoria**: Configuración automática por OpenShift
- **Replicas**: 1 por defecto (escalable)
- **Health checks**: Automáticos con httpd

### CI/CD Automático
- **Trigger**: Cambios en el repositorio Git
- **Build**: Automático en OpenShift
- **Deploy**: Automático tras build exitoso
- **Rollback**: Disponible con `oc rollout undo`

## 🐛 Solución de Problemas

### Build falla en OpenShift

1. **Verificar logs del build**:
   ```bash
   oc logs -f buildconfig/task-manager-docker
   ```

2. **Problema común**: Estructura de archivos incorrecta
   - Asegúrate que el Dockerfile esté en la raíz del repositorio
   - Verifica que las rutas en el Dockerfile sean correctas

3. **Limpiar y reconstruir**:
   ```bash
   oc delete buildconfig task-manager-docker
   oc new-app --strategy=docker --name=task-manager-docker https://github.com/fmoralesjmc/prueba-spa-gux.git
   ```

### Aplicación no responde

1. **Verificar pods**:
   ```bash
   oc get pods -l app=task-manager-docker
   oc logs <pod-name>
   ```

2. **Verificar servicio**:
   ```bash
   oc describe service task-manager-docker
   ```

3. **Probar conectividad**:
   ```bash
   oc port-forward <pod-name> 8080:8080
   curl http://localhost:8080
   ```

### Problemas de persistencia
- Los datos se almacenan en localStorage del navegador
- Limpiar cache del navegador si hay problemas
- Los datos persisten entre sesiones del mismo navegador

## 🚀 Actualizaciones y Mantenimiento

### Actualizar la aplicación
1. Hacer cambios en el código
2. Commit y push al repositorio:
   ```bash
   git add .
   git commit -m "Descripción de cambios"
   git push origin main
   ```
3. OpenShift detectará automáticamente los cambios y iniciará un nuevo build

### Monitoreo
```bash
# Ver estado general
oc status

# Monitorear builds
oc get builds --watch

# Ver métricas de pods
oc top pods
```

## 📈 Mejoras Futuras

- [ ] Backend API REST
- [ ] Base de datos persistente
- [ ] Autenticación de usuarios
- [ ] Notificaciones push
- [ ] Modo offline con Service Workers
- [ ] Tests e2e automatizados
- [ ] Pipeline de CI/CD más avanzado

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autor

Desarrollado como parte del arquetipo de aplicación SPA con Angular para despliegue en OpenShift usando Docker.

---

⭐ Si este proyecto te fue útil, ¡no olvides darle una estrella!

## 🔗 Enlaces Útiles

- **Aplicación en producción**: http://task-manager-docker-fmoralesjmc7-dev.apps.rm2.thpm.p1.openshiftapps.com
- **Repositorio Git**: https://github.com/fmoralesjmc/prueba-spa-gux
- **Documentación Angular**: https://angular.io/docs
- **Documentación OpenShift**: https://docs.openshift.com/
