# Scripts de Base de Datos

Este directorio contiene los scripts SQL necesarios para inicializar y configurar la base de datos MySQL para la aplicación EmailCraft Lite.

## `init.sql`

Este script realiza las siguientes acciones:
1.  **Elimina las tablas existentes** para asegurar un entorno limpio.
2.  **Crea todas las tablas necesarias** para la aplicación, incluyendo `contacts`, `events`, `surveys`, `attendees`, entre otras.
3.  **Inserta datos de ejemplo** en las tablas para que la aplicación sea funcional y se pueda probar desde el primer momento.

### Cómo Usarlo

Para inicializar tu base de datos, puedes usar un cliente de MySQL para ejecutar el script.

**Usando el cliente de línea de comandos `mysql`:**

1.  Asegúrate de tener un servidor MySQL en funcionamiento y una base de datos creada.
2.  Desde tu terminal, navega al directorio raíz de este proyecto.
3.  Ejecuta el siguiente comando, reemplazando `[usuario]`, `[contraseña]` y `[nombre_bd]` con tus credenciales y el nombre de tu base de datos:

    ```bash
    mysql -u [usuario] -p[contraseña] [nombre_bd] < sql/init.sql
    ```

    **Nota:** No hay espacio entre `-p` y la contraseña.

**Ejemplo:**

Si tu usuario es `root`, tu contraseña es `password`, y tu base de datos se llama `emailcraft_db`, el comando sería:

```bash
mysql -u root -ppassword emailcraft_db < sql/init.sql
```

Después de ejecutar el script, tu base de datos estará lista para ser utilizada por la aplicación. Asegúrate de que las credenciales en tu archivo `.env` coincidan con las de tu base de datos.
