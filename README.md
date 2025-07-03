
# EmailCraft Lite

EmailCraft Lite es una potente plataforma de marketing por correo electrónico de código abierto, construida con Next.js. Está diseñada para ayudarte a gestionar, enviar y analizar campañas de correo de manera eficiente, con características como un editor visual de plantillas, control de acceso basado en roles y análisis detallado del rendimiento.

## Características Principales

-   **Panel de Control**: Obtén una visión general rápida de la actividad reciente, estadísticas clave y notificaciones importantes al iniciar sesión.
-   **Campañas y Envíos**: Crea y envía campañas de correo masivo. Importa destinatarios desde archivos (CSV, Excel), consultas SQL (solo para el rol de TI) o entrada manual. Monitorea el progreso de tus envíos en tiempo real.
-   **Editor Visual de Plantillas**: Construye plantillas de correo electrónico atractivas y responsivas con un intuitivo editor de bloques de arrastrar y soltar. ¡No se requiere HTML!
-   **Gestión de Eventos y Certificados**: Organiza eventos, gestiona asistentes y diseña certificados de asistencia personalizados.
-   **Encuestas**: Crea encuestas personalizadas o impórtalas desde fuentes externas como Google Forms usando IA para recopilar feedback valioso de tu audiencia.
-   **Análisis Avanzado**: Profundiza en el rendimiento de tus campañas con gráficos, embudos de conversión e información predictiva para entender qué funciona mejor.
-   **Control de Acceso Basado en Roles (RBAC)**: Roles predefinidos (TI, Marketing, RRHH) con permisos granulares. El rol de TI puede gestionar los permisos para otros roles.
-   **Diseño Moderno y Responsivo**: Una interfaz de usuario limpia construida con ShadCN UI y Tailwind CSS, con una barra lateral colapsable para una experiencia de usuario óptima.

## Pila Tecnológica

-   **Framework**: [Next.js](https://nextjs.org/) (con App Router)
-   **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
-   **IA**: [Genkit](https://firebase.google.com/docs/genkit)
-   **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
-   **Componentes UI**: [ShadCN UI](https://ui.shadcn.com/)
-   **Base de Datos**: [MySQL](https://www.mysql.com/)
-   **Envío de Correos**: [Microsoft Graph API](https://developer.microsoft.com/en-us/graph)

## Cómo Empezar: Guía de Instalación Local

Sigue estos pasos para configurar y ejecutar el proyecto en tu computadora.

### 1. Prerrequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

-   **Node.js**: Versión 18 o superior. Puedes verificar tu versión con el comando `node -v`.
-   **MySQL**: Un servidor de base de datos MySQL debe estar en ejecución. Puedes usar herramientas como Docker, XAMPP, MAMP o una instalación nativa.

### 2. Clona el Repositorio

Abre tu terminal, navega al directorio donde deseas guardar el proyecto y clona el repositorio.

```bash
# Reemplaza <URL_DEL_REPOSITORIO> con la URL de tu repositorio Git
git clone <URL_DEL_REPOSITORIO>

# Navega al directorio del proyecto
cd emailcraft-lite
```

### 3. Instala las Dependencias

Una vez dentro del directorio del proyecto, instala todas las dependencias necesarias usando `npm`. Este comando leerá el archivo `package.json` y descargará todas las librerías que el proyecto necesita para funcionar.

```bash
npm install
```

### 4. Configura las Variables de Entorno

La aplicación necesita credenciales para funcionar. Crea un archivo para almacenarlas de forma segura.

1.  En la raíz del proyecto, crea un nuevo archivo llamado `.env`.
2.  Copia y pega el siguiente contenido en el archivo `.env`.
3.  **Reemplaza los valores de ejemplo** con tus credenciales reales.

```env
# --- Base de Datos MySQL ---
# El host donde se ejecuta tu servidor MySQL (normalmente localhost)
MYSQL_HOST=localhost
# El puerto de tu servidor MySQL (el predeterminado es 3306)
MYSQL_PORT=3306
# El nombre de usuario para acceder a la base de datos
MYSQL_USER=root
# La contraseña para el usuario de la base de datos
MYSQL_PASSWORD=tu_contraseña_secreta
# El nombre de la base de datos que usará la aplicación
MYSQL_DATABASE=emailcraft_db

# --- API de Microsoft Graph (para enviar correos) ---
# El ID de Cliente (Aplicación) de tu registro de aplicación en Azure AD
GRAPH_CLIENT_ID=tu_client_id
# El ID de Inquilino (Directorio) de tu Azure AD
GRAPH_TENANT_ID=tu_tenant_id
# El secreto de cliente generado para tu aplicación en Azure AD
GRAPH_CLIENT_SECRET=tu_client_secret
# La cuenta de correo desde la cual se enviarán los correos
GRAPH_USER_MAIL=correo_remitente@tu_dominio.com
```

### 5. Configura la Base de Datos

Ahora, vamos a preparar la base de datos para que la aplicación pueda conectarse y almacenar datos.

1.  **Asegúrate de que tu servidor MySQL esté en ejecución.**
2.  **Crea la base de datos.** Puedes usar un cliente de MySQL o la línea de comandos. El nombre debe coincidir con el que pusiste en `MYSQL_DATABASE`.

    ```sql
    CREATE DATABASE emailcraft_db;
    ```
3.  **Ejecuta el script de inicialización.** Este comando creará las tablas necesarias y cargará datos de ejemplo. Ejecútalo desde la raíz de tu proyecto.

    ```bash
    # Te pedirá la contraseña que especificaste en MYSQL_PASSWORD.
    mysql -u [usuario] -p [nombre_basedatos] < sql/init.sql
    ```
    -   `[usuario]`: Reemplázalo con el valor de tu `MYSQL_USER`.
    -   `[nombre_basedatos]`: Reemplázalo con el valor de tu `MYSQL_DATABASE`.

    *Ejemplo de comando:*
    ```bash
    mysql -u root -p emailcraft_db < sql/init.sql
    ```

### 6. Ejecuta la Aplicación

Para que la aplicación funcione completamente, necesitas ejecutar dos procesos en terminales separadas: el servidor de desarrollo de Next.js (la aplicación web) y el servidor de desarrollo de Genkit (para las funcionalidades de IA).

#### a) Ejecuta el Servidor de Desarrollo Web

Este comando inicia la aplicación principal en modo de desarrollo. Next.js compilará el proyecto y lo servirá localmente con "Fast Refresh", lo que significa que los cambios que hagas en el código se reflejarán en el navegador casi al instante.

En tu terminal, desde la raíz del proyecto, ejecuta:

```bash
npm run dev
```

Una vez que se inicie, verás un mensaje en la terminal indicando que el servidor está listo, generalmente en la siguiente dirección:

```
✓ Listo en XXms
- Local:   http://localhost:9002
```

**¡Eso es todo para la parte web!** Abre [http://localhost:9002](http://localhost:9002) en tu navegador para ver la aplicación en funcionamiento.

#### b) Ejecuta los Servicios de IA (Genkit)

Para probar las funcionalidades que dependen de inteligencia artificial (como la importación de encuestas), necesitas iniciar el servidor de desarrollo de Genkit.

Abre una **segunda terminal** en la raíz del proyecto y ejecuta:

```bash
npm run genkit:watch
```
Este comando:
-   Inicia el entorno de desarrollo de Genkit.
-   Vigila los archivos en el directorio `src/ai/` por cambios y los recarga automáticamente, lo cual es muy útil para el desarrollo.

Con ambos servidores (Next.js y Genkit) en ejecución, tendrás acceso a todas las características de la aplicación.
