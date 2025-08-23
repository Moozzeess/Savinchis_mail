-- Drop existing tables if they exist
DROP TABLE IF EXISTS evento_asistentes;
DROP TABLE IF EXISTS evento_plantillas;
DROP TABLE IF EXISTS eventos;

-- Create eventos table
CREATE TABLE eventos (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo_evento VARCHAR(100),
    ubicacion VARCHAR(255),
    fecha_hora_inicio DATETIME NOT NULL,
    fecha_hora_fin DATETIME,
    capacidad INT,
    estado ENUM('borrador', 'programado', 'en_curso', 'completado', 'cancelado') DEFAULT 'borrador',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create tabla para los tipos de plantillas de eventos
CREATE TABLE evento_plantillas (
    id_plantilla_evento INT AUTO_INCREMENT PRIMARY KEY,
    id_evento INT NOT NULL,
    tipo_plantilla ENUM('invitacion', 'recordatorio', 'confirmacion', 'certificado') NOT NULL,
    id_plantilla INT NOT NULL,
    fecha_envio_programado DATETIME,
    estado ENUM('pendiente', 'programado', 'enviado', 'fallido') DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE CASCADE,
    FOREIGN KEY (id_plantilla) REFERENCES plantillas(id_plantilla)
);

-- Create tabla para el seguimiento de asistentes
CREATE TABLE evento_asistentes (
    id_asistente_evento INT AUTO_INCREMENT PRIMARY KEY,
    id_evento INT NOT NULL,
    id_contacto INT NOT NULL,
    confirmado BOOLEAN DEFAULT FALSE,
    asistio BOOLEAN DEFAULT FALSE,
    fecha_confirmacion TIMESTAMP NULL,
    certificado_enviado BOOLEAN DEFAULT FALSE,
    fecha_envio_certificado TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_evento_contacto (id_evento, id_contacto),
    FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE CASCADE,
    FOREIGN KEY (id_contacto) REFERENCES contactos(id_contacto)
);

-- Add indexes for better performance
CREATE INDEX idx_evento_plantilla_tipo ON evento_plantillas(id_evento, tipo_plantilla);
CREATE INDEX idx_evento_asistente_estado ON evento_asistentes(id_evento, confirmado, asistio);
