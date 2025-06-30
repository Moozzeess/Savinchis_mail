# EmailCraft Lite

EmailCraft Lite es una potente plataforma de marketing por correo electrónico de código abierto, construida con Next.js, para gestionar, enviar y analizar campañas de correo electrónico de manera eficiente. La aplicación cuenta con un sistema de control de acceso basado en roles (RBAC), un editor de plantillas visual, y un panel de análisis de rendimiento detallado.

## Características Principales

- **Control de Acceso Basado en Roles (RBAC):** Roles predefinidos (TI, Marketing, RH) con permisos granulares. El rol de TI puede gestionar los permisos de otros roles.
- **Editor de Plantillas Visual:** Crea plantillas de correo electrónico dinámicas y atractivas con un editor de bloques de arrastrar y soltar, sin necesidad de escribir HTML.
- **Gestión de Campañas:** Envía correos masivos a destinatarios obtenidos desde archivos (CSV, Excel), consultas SQL (solo TI) o bases de datos internas.
- **Panel de Rendimiento Avanzado:** Analiza métricas clave con gráficos, embudos de conversión, análisis por segmentos y perspectivas predictivas.
- **Gestión de Eventos y Certificados:** Crea eventos y diseña certificados de asistencia personalizados para los participantes.
- **Diseño Moderno y Adaptable:** Interfaz de usuario construida con ShadCN UI y Tailwind CSS, incluyendo una barra lateral colapsable para una mejor experiencia.

## Stack Tecnológico

- **Framework:** [Next.js](https://nextjs.org/) (con App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes de UI:** [ShadCN UI](https://ui.shadcn.com/)
- **Base de Datos:** [MySQL](https://www.mysql.com/)
- **Envío de Correos:** [Microsoft Graph API](https://developer.microsoft.com/en-us/graph)

## Primeros Pasos

Sigue estas instrucciones para poner en marcha el proyecto en tu entorno local.

### Prerrequisitos

- [Node.js](https://nodejs.org/) (v18 o superior)
- Un servidor de [MySQL](https://www.mysql.com/) en funcionamiento.

### Instalación

1.  Clona el repositorio:
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_DIRECTORIO>
    ```

2.  Instala las dependencias del proyecto:
    ```bash
    npm install
    ```

### Configuración de Variables de Entorno

1.  Crea un archivo llamado `.env` en la raíz del proyecto.
2.  Añade las credenciales necesarias para la conexión a la base de datos MySQL y la API de Microsoft Graph:

    ```env
    # MySQL Database
    MYSQL_HOST=localhost
    MYSQL_PORT=3306
    MYSQL_USER=root
    MYSQL_PASSWORD=tu_contraseña
    MYSQL_DATABASE=emailcraft_db

    # Microsoft Graph API (para envío de correos)
    GRAPH_CLIENT_ID=tu_client_id
    GRAPH_TENANT_ID=tu_tenant_id
    GRAPH_CLIENT_SECRET=tu_client_secret
    GRAPH_USER_MAIL=correo_desde_el_que_se_envia@ejemplo.com
    ```

### Configuración de la Base de Datos

1.  Asegúrate de que tu servidor MySQL esté en ejecución y crea una base de datos (por ejemplo, `emailcraft_db`).
2.  Ejecuta el script de inicialización para crear las tablas y cargar los datos de ejemplo. Consulta las instrucciones detalladas en `sql/README.md`.

    ```bash
    # Reemplaza con tus credenciales
    mysql -u [usuario] -p[contraseña] [nombre_bd] < sql/init.sql
    ```

### Iniciar la Aplicación

Una vez que hayas configurado las variables de entorno y la base de datos, inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:9002](http://localhost:9002) en tu navegador para ver la aplicación.
