-- Este script configura la base de datos inicial para EmailCraft Lite.
-- Elimina las tablas existentes para garantizar un estado limpio y luego las recrea
-- con la estructura y relaciones necesarias para la aplicación.

-- Deshabilitar la verificación de claves foráneas temporalmente para evitar errores al eliminar tablas.
SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar tablas en orden inverso de dependencia si ya existen.
DROP TABLE IF EXISTS `permisos`;
DROP TABLE IF EXISTS `emisores_gestionados`;
DROP TABLE IF EXISTS `respuestas_encuestas`;
DROP TABLE IF EXISTS `encuestas`;
DROP TABLE IF EXISTS `asistentes`;
DROP TABLE IF EXISTS `eventos`;
DROP TABLE IF EXISTS `destinatarios_campana`;
DROP TABLE IF EXISTS `campanas`;
DROP TABLE IF EXISTS `plantillas`;
DROP TABLE IF EXISTS `contactos`;

-- Habilitar la verificación de claves foráneas nuevamente.
SET FOREIGN_KEY_CHECKS = 1;

-- Tabla para almacenar contactos/destinatarios
CREATE TABLE `contactos` (
  `id_contacto` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `nombre` VARCHAR(255),
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para almacenar plantillas de correo electrónico
CREATE TABLE `plantillas` (
  `id_plantilla` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NOT NULL,
  `asunto_predeterminado` VARCHAR(255) NOT NULL,
  `contenido` JSON NOT NULL, -- Almacena los bloques de la plantilla como JSON
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `id_rol_creador` VARCHAR(50) -- Para asociar con un rol (ej: 'marketing', 'it')
);

-- Tabla para gestionar campañas de correo
CREATE TABLE `campanas` (
  `id_campana` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NOT NULL,
  `asunto` VARCHAR(255) NOT NULL,
  `cuerpo_html` TEXT NOT NULL,
  `id_emisor` VARCHAR(255) NOT NULL, -- Email del remitente
  `estado` ENUM('Borrador', 'Enviando', 'Enviada', 'Pausada') DEFAULT 'Borrador',
  `fecha_envio` TIMESTAMP NULL,
  `id_plantilla` INT,
  FOREIGN KEY (`id_plantilla`) REFERENCES `plantillas`(`id_plantilla`) ON DELETE SET NULL
);

-- Tabla de unión para rastrear qué contactos recibieron qué campaña
CREATE TABLE `destinatarios_campana` (
  `id_destinatario_campana` INT AUTO_INCREMENT PRIMARY KEY,
  `id_campana` INT NOT NULL,
  `id_contacto` INT NOT NULL,
  `estado_entrega` ENUM('Pendiente', 'Enviado', 'Fallido', 'Rebotado') DEFAULT 'Pendiente',
  FOREIGN KEY (`id_campana`) REFERENCES `campanas`(`id_campana`) ON DELETE CASCADE,
  FOREIGN KEY (`id_contacto`) REFERENCES `contactos`(`id_contacto`) ON DELETE CASCADE
);

-- Tabla para gestionar eventos
CREATE TABLE `eventos` (
  `id_evento` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NOT NULL,
  `descripcion` TEXT,
  `fecha` DATE NOT NULL,
  `plantilla_certificado` JSON -- Almacena el diseño del certificado como JSON o una referencia
);

-- Tabla para registrar asistentes a eventos
CREATE TABLE `asistentes` (
  `id_asistente` INT AUTO_INCREMENT PRIMARY KEY,
  `id_evento` INT NOT NULL,
  `id_contacto` INT NOT NULL,
  FOREIGN KEY (`id_evento`) REFERENCES `eventos`(`id_evento`) ON DELETE CASCADE,
  FOREIGN KEY (`id_contacto`) REFERENCES `contactos`(`id_contacto`) ON DELETE CASCADE
);

-- Tabla para gestionar encuestas
CREATE TABLE `encuestas` (
  `id_encuesta` INT AUTO_INCREMENT PRIMARY KEY,
  `titulo` VARCHAR(255) NOT NULL,
  `descripcion` TEXT,
  `preguntas` JSON NOT NULL, -- Almacena las preguntas y sus tipos/opciones como JSON
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para almacenar respuestas a encuestas
CREATE TABLE `respuestas_encuestas` (
  `id_respuesta` INT AUTO_INCREMENT PRIMARY KEY,
  `id_encuesta` INT NOT NULL,
  `id_contacto` INT, -- Puede ser nulo para respuestas anónimas
  `respuestas` JSON NOT NULL, -- Almacena las respuestas del usuario como JSON
  `fecha_respuesta` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_encuesta`) REFERENCES `encuestas`(`id_encuesta`) ON DELETE CASCADE,
  FOREIGN KEY (`id_contacto`) REFERENCES `contactos`(`id_contacto`) ON DELETE SET NULL
);

-- Tabla para los remitentes que el rol de TI puede gestionar
CREATE TABLE `emisores_gestionados` (
  `email_emisor` VARCHAR(255) PRIMARY KEY,
  `nombre_descriptivo` VARCHAR(255) NOT NULL,
  `limite_diario` INT DEFAULT 10000
);

-- Tabla para gestionar permisos de roles (RBAC)
CREATE TABLE `permisos` (
  `id_permiso` INT AUTO_INCREMENT PRIMARY KEY,
  `rol` VARCHAR(50) NOT NULL,
  `permiso` VARCHAR(255) NOT NULL,
  UNIQUE(`rol`, `permiso`)
);
