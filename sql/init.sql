-- EmailCraft Lite - Script de Inicialización de Base de Datos
-- Versión: 1.0
-- Descripción: Este script crea las tablas necesarias para la aplicación
-- y las puebla con datos de ejemplo para un entorno de desarrollo.

-- Eliminar tablas existentes en orden inverso para evitar problemas de claves foráneas.
DROP TABLE IF EXISTS `asistentes`;
DROP TABLE IF EXISTS `plantillas`;
DROP TABLE IF EXISTS `eventos`;
DROP TABLE IF EXISTS `contactos`;

-- =============================================
-- Tabla: contactos
-- Almacena la información de los contactos a los que se envían correos.
-- =============================================
CREATE TABLE `contactos` (
  `id_contacto` INT PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `suscrito` BOOLEAN DEFAULT TRUE,
  `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) COMMENT='Tabla para almacenar los contactos de correo.';

-- =============================================
-- Tabla: eventos
-- Almacena información sobre los eventos organizados.
-- =============================================
CREATE TABLE `eventos` (
  `id_evento` INT PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `descripcion` TEXT,
  `fecha` DATE NOT NULL,
  `estado` VARCHAR(50) DEFAULT 'Próximo'
) COMMENT='Tabla para gestionar eventos.';

-- =============================================
-- Tabla: asistentes
-- Tabla de unión para la relación muchos a muchos entre contactos y eventos.
-- =============================================
CREATE TABLE `asistentes` (
  `id_asistente` INT PRIMARY KEY AUTO_INCREMENT,
  `id_evento` INT,
  `id_contacto` INT,
  FOREIGN KEY (`id_evento`) REFERENCES `eventos`(`id_evento`) ON DELETE CASCADE,
  FOREIGN KEY (`id_contacto`) REFERENCES `contactos`(`id_contacto`) ON DELETE CASCADE
) COMMENT='Tabla de unión para los asistentes a los eventos.';

-- =============================================
-- Tabla: plantillas
-- Almacena las plantillas de correo electrónico creadas por los usuarios.
-- =============================================
CREATE TABLE `plantillas` (
  `id_plantilla` INT PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `asunto_predeterminado` VARCHAR(255),
  `contenido` JSON,
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) COMMENT='Almacena las plantillas de correo con un editor de bloques.';


-- =============================================
-- Inserción de Datos de Ejemplo
-- =============================================

-- Insertar contactos de ejemplo
INSERT INTO `contactos` (`nombre`, `email`, `suscrito`) VALUES
('Juan Pérez', 'juan.perez@example.com', TRUE),
('Ana López', 'ana.lopez@example.com', TRUE),
('Carlos García', 'carlos.garcia@example.com', FALSE),
('Laura Martínez', 'laura.martinez@example.com', TRUE),
('Miguel Rodríguez', 'miguel.rodriguez@example.com', TRUE);

-- Insertar eventos de ejemplo
INSERT INTO `eventos` (`nombre`, `descripcion`, `fecha`, `estado`) VALUES
('Taller de Marketing Digital', 'Un taller intensivo sobre las últimas tendencias en marketing digital.', '2024-08-15', 'Realizado'),
('Conferencia Anual de Tecnología', 'El evento más grande del año sobre innovación tecnológica.', '2024-09-05', 'Próximo'),
('Webinar de Liderazgo', 'Aprende a liderar equipos de alto rendimiento.', '2024-07-20', 'Realizado');

-- Vincular contactos a eventos como asistentes
INSERT INTO `asistentes` (`id_evento`, `id_contacto`) VALUES
(1, 1), -- Juan asistió al Taller de Marketing
(1, 2), -- Ana asistió al Taller de Marketing
(2, 4), -- Laura asistirá a la Conferencia de Tecnología
(3, 1), -- Juan asistió al Webinar
(3, 5); -- Miguel asistió al Webinar

-- Insertar una plantilla de bienvenida de ejemplo
INSERT INTO `plantillas` (`nombre`, `asunto_predeterminado`, `contenido`) VALUES
('Plantilla de Bienvenida', '¡Bienvenido a nuestra comunidad!', '
[
  {
    "id": "intro_text",
    "type": "text",
    "content": {
      "text": "¡Hola {{contact.name}}!",
      "color": "#333333",
      "fontSize": 24,
      "lineHeight": 1.4,
      "fontWeight": "bold",
      "textAlign": "center"
    }
  },
  {
    "id": "welcome_image",
    "type": "image",
    "content": {
      "src": "https://placehold.co/600x200.png",
      "alt": "Banner de Bienvenida",
      "width": 100,
      "align": "center"
    }
  },
  {
    "id": "body_text",
    "type": "text",
    "content": {
      "text": "Gracias por unirte a nosotros. Estamos muy contentos de tenerte a bordo. Aquí encontrarás contenido exclusivo, noticias y mucho más. Si tienes alguna pregunta, no dudes en contactarnos.",
      "color": "#555555",
      "fontSize": 16,
      "lineHeight": 1.6,
      "fontWeight": "normal",
      "textAlign": "left"
    }
  },
  {
    "id": "main_button",
    "type": "button",
    "content": {
      "text": "Explorar Ahora",
      "href": "https://example.com",
      "backgroundColor": "#159A9C",
      "color": "#FFFFFF",
      "textAlign": "center",
      "borderRadius": 8
    }
  }
]
');

-- Fin del script de inicialización
SELECT 'Base de datos inicializada con éxito.' AS 'Estado';
