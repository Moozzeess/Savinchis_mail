
-- Activa el modo SQL tradicional para mayor consistencia.
SET SQL_MODE = "TRADITIONAL";

-- Deshabilita temporalmente la verificación de claves foráneas para evitar errores durante el drop/create.
SET FOREIGN_KEY_CHECKS = 0;

-- Elimina las tablas existentes para empezar de cero.
DROP TABLE IF EXISTS campana_destinatarios;
DROP TABLE IF EXISTS campanas;
DROP TABLE IF EXISTS asistentes;
DROP TABLE IF EXISTS eventos;
DROP TABLE IF EXISTS respuestas_encuestas;
DROP TABLE IF EXISTS encuestas;
DROP TABLE IF EXISTS plantillas;
DROP TABLE IF EXISTS contactos;
DROP TABLE IF EXISTS remitentes;
DROP TABLE IF EXISTS permisos;

-- Vuelve a habilitar la verificación de claves foráneas.
SET FOREIGN_KEY_CHECKS = 1;

-- Tabla para almacenar los remitentes de correo (ej: cuentas de marketing, soporte, etc.).
CREATE TABLE remitentes (
    id_remitente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    rol_asignado ENUM('it', 'marketing', 'hr') NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para almacenar plantillas de correo electrónico.
CREATE TABLE plantillas (
    id_plantilla INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    asunto_predeterminado VARCHAR(255),
    contenido_html JSON NOT NULL, -- Usar JSON para el editor de bloques
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla para almacenar información de los contactos.
CREATE TABLE contactos (
    id_contacto INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    nombre VARCHAR(100),
    origen VARCHAR(50), -- Ej: 'csv_import', 'manual', 'api'
    fecha_agregado DATE,
    suscrito BOOLEAN DEFAULT TRUE
);

-- Tabla para almacenar campañas de correo electrónico.
CREATE TABLE campanas (
    id_campana INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    asunto VARCHAR(255) NOT NULL,
    id_remitente INT NOT NULL,
    id_plantilla INT,
    cuerpo_html TEXT NOT NULL,
    estado ENUM('borrador', 'enviando', 'enviada', 'pausada', 'fallida') DEFAULT 'borrador',
    fecha_envio DATETIME,
    total_destinatarios INT DEFAULT 0,
    FOREIGN KEY (id_remitente) REFERENCES remitentes(id_remitente),
    FOREIGN KEY (id_plantilla) REFERENCES plantillas(id_plantilla)
);

-- Tabla de unión para asociar contactos con campañas.
CREATE TABLE campana_destinatarios (
    id_campana INT NOT NULL,
    id_contacto INT NOT NULL,
    estado_envio ENUM('pendiente', 'enviado', 'fallido', 'rebotado') DEFAULT 'pendiente',
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_campana, id_contacto),
    FOREIGN KEY (id_campana) REFERENCES campanas(id_campana) ON DELETE CASCADE,
    FOREIGN KEY (id_contacto) REFERENCES contactos(id_contacto) ON DELETE CASCADE
);

-- Tabla para almacenar eventos.
CREATE TABLE eventos (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    plantilla_certificado_id INT,
    FOREIGN KEY (plantilla_certificado_id) REFERENCES plantillas(id_plantilla)
);

-- Tabla para registrar los asistentes a un evento.
CREATE TABLE asistentes (
    id_asistente INT AUTO_INCREMENT PRIMARY KEY,
    id_evento INT NOT NULL,
    id_contacto INT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE CASCADE,
    FOREIGN KEY (id_contacto) REFERENCES contactos(id_contacto) ON DELETE CASCADE
);

-- Tabla para almacenar encuestas.
CREATE TABLE encuestas (
    id_encuesta INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    preguntas JSON NOT NULL, -- Almacena la estructura de preguntas y opciones como JSON
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para almacenar las respuestas de las encuestas.
CREATE TABLE respuestas_encuestas (
    id_respuesta INT AUTO_INCREMENT PRIMARY KEY,
    id_encuesta INT NOT NULL,
    id_contacto INT,
    respuestas JSON NOT NULL, -- Almacena las respuestas como un objeto JSON
    fecha_respuesta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_encuesta) REFERENCES encuestas(id_encuesta) ON DELETE CASCADE,
    FOREIGN KEY (id_contacto) REFERENCES contactos(id_contacto) ON DELETE SET NULL
);

-- Tabla para gestionar permisos de roles (RBAC).
CREATE TABLE permisos (
    rol ENUM('it', 'marketing', 'hr') NOT NULL,
    permiso VARCHAR(100) NOT NULL,
    PRIMARY KEY (rol, permiso)
);
