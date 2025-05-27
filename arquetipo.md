🎯 Objetivo General
Desarrollar una aplicación SPA con Angular (v15+) que permita gestionar tareas de
usuario (crear, listar, editar, eliminar), y desplegarla correctamente en un entorno de
contenedores en OpenShift.
📌 Requisitos
1. Aplicación: Gestor de Tareas
Desarrollar una aplicación que permita:
● Crear una tarea con título, descripción, prioridad (alta/media/baja), y fecha límite.
● Listar todas las tareas con estado (pendiente, en progreso, completada).
● Editar y eliminar tareas.
● Cambiar estado de una tarea.
● Almacenar las tareas en el frontend (puede usarse localStorage/mock, no requiere
backend real).
2. Angular
● Usar Angular v15+ (CLI, TypeScript).
● Estructura modular con separación en components, services, models, etc.
● Aplicar buenas prácticas con Reactive Forms.
● Usar Angular Material o TailwindCSS para la UI.
● Aplicar buenas prácticas de performance (trackBy, lazy loading si aplica).
● Aplicar algún mecanismo de guardado persistente (localStorage o IndexedDB).
3. Docker y OpenShift
● Crear un archivo Dockerfile listo para producción:
○ Compilar el proyecto (ng build --configuration=production)
○ Servir con Nginx o HTTP-server
● Instrucciones claras para desplegar en OpenShift:
○ Crear una imagen Docker
○ Crear un Deployment y un Service en OpenShift
○ Exponer con un Route o Ingress
📝 Entregables (5)
1. Carpeta del proyecto Angular (task-manager-angular/)
2. Dockerfile funcional y optimizado
3. Manifiestos YAML u OpenShift CLI (oc) necesarios para el despliegue
4. Enlace al proyecto corriendo en OpenShift (si aplica, o captura de pantalla)
5. README.md que incluya:
○ Tecnologías usadas
○ Pasos para correr local y desplegar en OpenShift