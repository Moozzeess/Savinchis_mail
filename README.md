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

## Cómo Empezar

Sigue estas instrucciones para poner en marcha el proyecto en tu máquina local.

### Prerrequisitos

-   [Node.js](https://nodejs.org/) (versión 18 o superior).
-   Un servidor [MySQL](https://www.mysql.com/) en ejecución.

### 1. Instalación del Proyecto

Primero, clona el repositorio del proyecto en tu máquina local y navega hasta el directorio recién creado.

```bash
# Reemplaza <URL_DEL_REPOSITORIO> con la URL de tu repositorio Git
git clone <URL_DEL_REPOSITORIO>
cd emailcraft-lite
```

A continuación, instala todas las dependencias del proyecto utilizando `npm`.

```bash
npm install
```

### 2. Configuración de Variables de Entorno

Para que la aplicación funcione correctamente, necesita credenciales para conectarse a la base de datos y al servicio de envío de correos.

1.  Crea un archivo llamado `.env` en el directorio raíz del proyecto.
2.  Copia y pega el siguiente contenido en el archivo `.env`, reemplazando los valores de ejemplo con tus credenciales reales.

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

### 3. Configuración de la Base de Datos

1.  Asegúrate de que tu servidor MySQL esté en funcionamiento.
2.  Crea una base de datos con el nombre que especificaste en `MYSQL_DATABASE` (por ejemplo, `emailcraft_db`).
3.  Ejecuta el script de inicialización `sql/init.sql` para crear las tablas necesarias y cargar datos de ejemplo.

    ```bash
    # Reemplaza [usuario] y [nombre_basedatos] con tus credenciales.
    # Te pedirá la contraseña que especificaste en MYSQL_PASSWORD.
    mysql -u [usuario] -p [nombre_basedatos] < sql/init.sql
    ```
    *Ejemplo:* `mysql -u root -p emailcraft_db < sql/init.sql`

### 4. Ejecución de la Aplicación

Una vez que hayas configurado las variables de entorno y la base de datos, puedes iniciar el servidor de desarrollo de Next.js.

```bash
npm run dev
```

Este comando iniciará la aplicación en modo de desarrollo con `turbopack` para un rendimiento óptimo.

¡Y eso es todo! Abre [http://localhost:9002](http://localhost:9002) en tu navegador para ver la aplicación en funcionamiento.
