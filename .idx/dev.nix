# Para aprender más sobre cómo usar Nix para configurar tu entorno
# mira: https://firebase.google.com/docs/studio/customize-workspace
{pkgs}: {
  # Qué canal de nixpkgs usar.
  channel = "stable-24.11"; # o "unstable"
  # Usa https://search.nixos.org/packages para encontrar paquetes
  packages = [
    pkgs.nodejs_20 # Agrega Node.js versión 20 a los paquetes instalados.
    pkgs.zulu # Agrega Zulu (una distribución de OpenJDK) a los paquetes instalados.
  ];
  # Establece variables de entorno en el espacio de trabajo.
  env = {}; # En este caso, no se establecen variables de entorno adicionales.
  # Esto añade un observador de archivos para iniciar los emuladores de firebase. Los emuladores solo se iniciarán si
  # se escribe un archivo firebase.json en el directorio del usuario.
  services.firebase.emulators = {
    detect = true; # Habilita la detección automática de los emuladores de Firebase.
    projectId = "demo-app"; # Establece el ID del proyecto de Firebase para los emuladores.
    services = ["auth" "firestore"]; # Especifica los servicios de Firebase que se emularán (autenticación y Firestore).
  };
  idx = { # Contiene configuraciones específicas de IDX.
    # Busca las extensiones que quieras en https://open-vsx.org/ y usa "publisher.id"
    extensions = [
      # "vscodevim.vim" # Ejemplo de extensión de VS Code comentada.
    ];
    workspace = { # Contiene configuraciones del espacio de trabajo.
      onCreate = { # Define acciones que se realizarán al crear el espacio de trabajo.
        default.openFiles = [ # Especifica una lista de archivos que se abrirán por defecto al iniciar el espacio de trabajo.
          "src/app/page.tsx" # Abre el archivo page.tsx al iniciar.
        ];
      };
    };
    # Habilita las previsualizaciones y personaliza la configuración.
    previews = {
      enable = true; # Habilita las previsualizaciones.
      previews = { # Contiene configuraciones específicas de las previsualizaciones.
        web = { # Configura la previsualización web.
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"]; # El comando para iniciar la aplicación web.
          manager = "web"; # Indica que el gestor de la previsualización es "web".
        };
      };
    };
  };
}
