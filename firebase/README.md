# Directorio de Configuración de Firebase

Este directorio está destinado a contener archivos de configuración relacionados con los servicios de Firebase que no necesiten estar en la raíz del proyecto.

## Propósito

El objetivo principal de este directorio es mantener el proyecto organizado. Mientras que algunos archivos de configuración de Firebase **deben** estar en el directorio raíz para ser detectados por las herramientas de Firebase, otros pueden ser agrupados aquí para mayor claridad.

### Archivos en la Raíz

Archivos como `apphosting.yaml` o `firebase.json` deben permanecer en el directorio raíz del proyecto. Estos archivos son leídos directamente por Firebase CLI y los servicios de Firebase Hosting durante los despliegues y la configuración. Moverlos de la raíz impedirá que funcionen correctamente.

### Archivos en este Directorio

Este directorio puede ser útil para almacenar:
-   Reglas de seguridad de Firestore (`firestore.rules`) o índices (`firestore.indexes.json`), si se utilizan.
-   Scripts de configuración auxiliares o archivos de datos relacionados con Firebase.

**En resumen: no muevas `apphosting.yaml` o `firebase.json` aquí. Usa este directorio para otros archivos de Firebase que no tengan requisitos de ubicación estrictos.**
