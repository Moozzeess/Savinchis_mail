

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

# --- Microsoft Graph (Client Credentials) ---
# El ID de Inquilino (Tenant) de tu Azure AD
AZURE_TENANT_ID=tu_tenant_id
# El ID de Cliente (Application ID) de tu App Registration
AZURE_CLIENT_ID=tu_client_id
# El secreto de cliente de tu App Registration
AZURE_CLIENT_SECRET=tu_client_secret
# Remitente por defecto (opcional). Si no se envía desde el cliente, se usará este valor
DEFAULT_SENDER_EMAIL=remitente@tu-dominio.com

# --- Configuración de URL base (SSR/cliente) ---
# URL pública del sitio (incluye protocolo). Usada para construir rutas absolutas en SSR
NEXT_PUBLIC_SITE_URL=http://localhost:9002
# Alternativas admitidas por el código: APP_URL o VERCEL_URL
# APP_URL=
# VERCEL_URL=
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

### 5. Configuración de Microsoft Graph (Opcional pero recomendado)

Para habilitar el envío de correos electrónicos a través de Microsoft Graph, sigue estos pasos adicionales:

1. **Registra una aplicación en Azure AD**
   - Ve a [Azure Portal](https://portal.azure.com/)
   - Navega a "Azure Active Directory" > "Registros de aplicaciones" > "Nuevo registro"
   - Configura los permisos necesarios:
     - `Mail.Send` (permiso de aplicación)
     - `User.Read` (permiso delegado)
   - Genera un secreto de cliente y copia los valores necesarios al archivo `.env`

2. **Configura los permisos de correo**
   - Asegúrate de que la cuenta especificada en `GRAPH_USER_MAIL` tenga permisos para enviar correos
   - Si usas una cuenta compartida o de servicio, configura los permisos de buzón correspondientes

3. **Prueba la conexión**
   ```bash
   # Verifica la configuración de Graph
   npm run test:graph
   ```

### 6. Ejecuta la Aplicación

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

### 7. (Opcional) Usar la API externa de Mailing (Papalote)

La aplicación ahora puede enviar correos usando una API externa ya existente (Papalote Events). Esto permite reutilizar su endpoint `POST /mailing/send` para envíos individuales por destinatario.

- Documentación OpenAPI: https://events.papalote.org.mx/api-json
- Endpoint que se consume: `POST https://events.papalote.org.mx/mailing/send`

Para activarlo, agrega estas variables al archivo `.env`:

```env
# Activa el uso de la API externa
USE_EXTERNAL_MAILING_API=true

# Base de la API externa (opcional, por defecto usa https://events.papalote.org.mx)
MAILING_API_BASE=https://events.papalote.org.mx

# Correo remitente por defecto si no se envía desde el cliente
DEFAULT_SENDER_EMAIL=remitente@tu-dominio.com
```

Cuando `USE_EXTERNAL_MAILING_API=true`:
- `POST /api/campaigns/test` y `POST /api/campaigns/send` enviarán a través de la API externa.
- El backend construye `recipients` con `email`, `name` y `templateData` por contacto para soportar variables de plantilla (`{{name}}`, etc.).
- Si la API externa devuelve error, la respuesta incluirá `details` con los errores por destinatario.

Cuando `USE_EXTERNAL_MAILING_API` no está activa o es `false`:
- Se mantiene el flujo existente vía Microsoft Graph (`src/lib/graph-email.ts`).

Archivos involucrados:
- `src/lib/mailing-api.ts` (cliente para la API externa)
- `src/app/api/campaigns/test/route.ts` (soporte condicional)
- `src/app/api/campaigns/send/route.ts` (soporte condicional)
