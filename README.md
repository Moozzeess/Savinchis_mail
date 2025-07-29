

Sigue estos pasos para configurar y ejecutar el proyecto en tu computadora.

### 1. Prerrequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

-   **Node.js**: Versión 18 o superior. Puedes verificar tu versión con el comando `node -v`.
-   **MySQL**: Un servidor de base de datos MySQL debe estar en ejecución. Puedes usar herramientas como Docker, XAMPP, MAMP o una instalación nativa.

### 2. Instala las Dependencias

Una vez dentro del directorio del proyecto, instala todas las dependencias necesarias usando `npm`. Este comando leerá el archivo `package.json` y descargará todas las librerías que el proyecto necesita para funcionar.

```bash
npm install
```

### 3. Configura las Variables de Entorno

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

### 4. Configura la Base de Datos

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

### 5. Ejecuta la Aplicación

Para que la aplicación funcione completamente, necesitas:
#### Ejecuta el Servidor de Desarrollo Web

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
