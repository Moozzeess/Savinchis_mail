<<<<<<< HEAD
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
=======
**Savinchis_mail**

La aplicación está diseñada para ayudarte a gestionar tus comunicaciones y actividades de manera eficiente. Aquí te explicamos cómo utilizar las principales funcionalidades:

Dashboard:

Al iniciar sesión, lo primero que verás será probablemente el Dashboard.
Este te ofrece una vista rápida y resumida de la actividad reciente, estadísticas clave y quizás notificaciones importantes.
Úsalo para tener una idea general del estado de tus campañas, eventos o encuestas en curso.
Historial de Contactos:

Aquí puedes acceder a las listas de contactos que has utilizado en campañas anteriores.
Puedes consultar las listas, ver cuántos contactos contenían y posiblemente descargar o reutilizar esas listas para futuras comunicaciones.
Esta sección te ayuda a mantener un registro de tu base de contactos y cómo ha sido utilizada.
Campañas:

Esta es la sección principal para crear y enviar comunicaciones masivas.
Puedes iniciar una nueva campaña, seleccionar la lista de contactos a la que deseas enviarla, elegir una plantilla (si aplica) y redactar el contenido del mensaje.
La aplicación probablemente te guiará a través de los pasos para configurar la campaña y enviarla a tu audiencia.
Una vez enviada, podrás dar seguimiento a su estado y rendimiento (por ejemplo, cuántos correos se abrieron, cuántos clics hubo, etc.).
Eventos:

Si organizas eventos, esta sección es para ti.
Puedes crear y gestionar detalles del evento, como la fecha, hora, ubicación y descripción.
Es posible que puedas registrar asistentes o importar una lista de participantes.
Una funcionalidad clave aquí parece ser la creación y gestión de certificados para los asistentes, donde podrías diseñar el certificado y asignárselo a los participantes.
Encuestas:

Para recopilar información de tu audiencia, utiliza la sección de Encuestas.
Aquí puedes diseñar tus encuestas, añadir preguntas de diferentes tipos (opción múltiple, texto libre, etc.).
Una vez diseñada, puedes distribuirla a tu audiencia (posiblemente integrándose con la funcionalidad de Campañas).
Luego, podrás ver y analizar las respuestas recibidas.
Plantillas:

Si envías mensajes o creas documentos con un formato similar frecuentemente, las Plantillas te ahorrarán tiempo.
En esta sección, puedes crear y guardar diseños reutilizables para correos electrónicos, certificados u otros documentos.
Al crear una nueva campaña o evento, podrás seleccionar una plantilla existente y simplemente adaptar el contenido.
Analíticas:

Para medir el éxito de tus actividades, consulta la sección de Analíticas.
Aquí encontrarás gráficos y datos sobre el rendimiento de tus campañas de correo, la participación en eventos o los resultados de tus encuestas.
Esta información te ayudará a entender qué funciona bien y qué podrías mejorar en futuras comunicaciones.
Buzón:

Esta sección podría ser donde recibes y gestionas las respuestas a tus comunicaciones, como respuestas a correos electrónicos o formularios de contacto.
Te permite centralizar la interacción con tu audiencia.
Configuraciones:

Aquí puedes personalizar tu experiencia con la aplicación.
Puedes actualizar tu perfil, gestionar notificaciones, configurar integraciones (si las hay) y ajustar otras preferencias.
En general, la aplicación te guía a través de flujos de trabajo intuitivos para cada funcionalidad. Simplemente navega a la sección que necesitas en el menú principal y sigue las opciones y formularios que se presenten para completar tus tareas.
>>>>>>> 991d4d91306c202c6403d9f86c9423247970c13d
