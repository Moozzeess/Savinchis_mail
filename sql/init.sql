
-- Eliminar tablas existentes para una instalación limpia
DROP TABLE IF EXISTS `asistentes`;
DROP TABLE IF EXISTS `eventos`;
DROP TABLE IF EXISTS `contactos`;
DROP TABLE IF EXISTS `plantillas`;


-- -----------------------------------------------------
-- Tabla `plantillas`
-- Almacena las plantillas de correo electrónico creadas por los usuarios.
-- -----------------------------------------------------
CREATE TABLE `plantillas` (
  `id_plantilla` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `asunto_predeterminado` VARCHAR(255) NOT NULL,
  `contenido` JSON NOT NULL,
  `tipo` VARCHAR(50) NOT NULL DEFAULT 'template', 
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_plantilla`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Tabla `contactos`
-- Almacena la información de los contactos a quienes se les envían correos.
-- -----------------------------------------------------
CREATE TABLE `contactos` (
  `id_contacto` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `nombre` VARCHAR(255) NULL,
  `fecha_agregado` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_contacto`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Tabla `eventos`
-- Almacena información sobre los eventos creados en la plataforma.
-- -----------------------------------------------------
CREATE TABLE `eventos` (
  `id_evento` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `fecha` DATE NOT NULL,
  `id_plantilla` INT NOT NULL,
  PRIMARY KEY (`id_evento`),
  INDEX `fk_eventos_plantillas_idx` (`id_plantilla` ASC),
  CONSTRAINT `fk_eventos_plantillas`
    FOREIGN KEY (`id_plantilla`)
    REFERENCES `plantillas` (`id_plantilla`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Tabla `asistentes`
-- Tabla de unión para relacionar contactos y eventos.
-- -----------------------------------------------------
CREATE TABLE `asistentes` (
  `id_asistente` INT NOT NULL AUTO_INCREMENT,
  `id_evento` INT NOT NULL,
  `id_contacto` INT NOT NULL,
  `fecha_registro` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_asistente`),
  INDEX `fk_asistentes_eventos_idx` (`id_evento` ASC),
  INDEX `fk_asistentes_contactos_idx` (`id_contacto` ASC),
  CONSTRAINT `fk_asistentes_eventos`
    FOREIGN KEY (`id_evento`)
    REFERENCES `eventos` (`id_evento`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_asistentes_contactos`
    FOREIGN KEY (`id_contacto`)
    REFERENCES `contactos` (`id_contacto`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
