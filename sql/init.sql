-- SQL PARA INICIALIZAR LA BASE DE DATOS DE EMAILCRAFT LITE --

-- Se desactivan las verificaciones de claves foráneas para evitar errores al eliminar tablas en un orden específico.
SET FOREIGN_KEY_CHECKS = 0;

-- Elimina las tablas existentes para empezar desde cero.
-- Esto asegura que el script se pueda ejecutar múltiples veces sin errores de "tabla ya existe".
DROP TABLE IF EXISTS destinatarios_campana;
DROP TABLE IF EXISTS campanas;
DROP TABLE IF EXISTS asistentes;
DROP TABLE IF EXISTS eventos;
DROP TABLE IF EXISTS respuestas_encuesta;
DROP TABLE IF EXISTS encuestas;
DROP TABLE IF EXISTS plantillas;
DROP TABLE IF EXISTS contactos;
DROP TABLE IF EXISTS remitentes;
DROP TABLE IF EXISTS permisos;

-- Se reactivan las verificaciones de claves foráneas.
SET FOREIGN_KEY_CHECKS = 1;

-- CREACIÓN DE TABLAS --

-- Tabla de Contactos
CREATE TABLE `contactos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `nombre` VARCHAR(255),
  `estado` ENUM('suscrito', 'baja', 'pendiente') DEFAULT 'suscrito',
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Plantillas de Correo
CREATE TABLE `plantillas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NOT NULL,
  `descripcion` TEXT,
  `contenido` JSON, -- Almacena la estructura de bloques del editor visual
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Campañas
CREATE TABLE `campanas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NOT NULL,
  `asunto` VARCHAR(255) NOT NULL,
  `cuerpo_html` LONGTEXT,
  `plantilla_id` INT,
  `email_remitente` VARCHAR(255) NOT NULL,
  `estado` ENUM('borrador', 'enviando', 'enviada', 'pausada', 'fallida') DEFAULT 'borrador',
  `enviado_en` TIMESTAMP,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`plantilla_id`) REFERENCES `plantillas`(`id`) ON DELETE SET NULL
);

-- Tabla de Destinatarios por Campaña (Tabla intermedia)
CREATE TABLE `destinatarios_campana` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `campana_id` INT NOT NULL,
  `contacto_id` INT NOT NULL,
  `estado` ENUM('pendiente', 'enviado', 'fallido', 'rebotado') DEFAULT 'pendiente',
  `enviado_en` TIMESTAMP,
  FOREIGN KEY (`campana_id`) REFERENCES `campanas`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`contacto_id`) REFERENCES `contactos`(`id`) ON DELETE CASCADE
);

-- Tabla de Eventos
CREATE TABLE `eventos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NOT NULL,
  `descripcion` TEXT,
  `fecha_evento` DATE NOT NULL,
  `plantilla_certificado_id` INT,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`plantilla_certificado_id`) REFERENCES `plantillas`(`id`) ON DELETE SET NULL
);

-- Tabla de Asistentes a Eventos (Tabla intermedia)
CREATE TABLE `asistentes` (
  `evento_id` INT NOT NULL,
  `contacto_id` INT NOT NULL,
  PRIMARY KEY (`evento_id`, `contacto_id`),
  FOREIGN KEY (`evento_id`) REFERENCES `eventos`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`contacto_id`) REFERENCES `contactos`(`id`) ON DELETE CASCADE
);

-- Tabla de Encuestas
CREATE TABLE `encuestas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NOT NULL,
  `descripcion` TEXT,
  `preguntas` JSON, -- Almacena la estructura de preguntas y opciones
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Respuestas de Encuestas
CREATE TABLE `respuestas_encuesta` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `encuesta_id` INT NOT NULL,
  `contacto_id` INT, -- Puede ser nulo para respuestas anónimas
  `respuestas` JSON, -- Almacena las respuestas del usuario
  `enviado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`encuesta_id`) REFERENCES `encuestas`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`contacto_id`) REFERENCES `contactos`(`id`) ON DELETE SET NULL
);

-- Tabla de Remitentes (para el rol de TI)
CREATE TABLE `remitentes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `nombre` VARCHAR(255) NOT NULL
);

-- Tabla de Permisos (para RBAC)
CREATE TABLE `permisos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `rol` VARCHAR(50) NOT NULL,
  `permiso` VARCHAR(255) NOT NULL,
  UNIQUE (`rol`, `permiso`)
);
