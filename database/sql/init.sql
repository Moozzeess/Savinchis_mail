-- -----------------------------------------------------
-- Archivo de Script para EmailCraft Lite
-- -----------------------------------------------------

-- Deshabilita la verificación de claves foráneas para evitar errores durante la eliminación de tablas.
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';


-- -----------------------------------------------------
-- Eliminar tablas existentes para empezar de cero
-- -----------------------------------------------------
DROP TABLE IF EXISTS `permisos`;
DROP TABLE IF EXISTS `remitentes`;
DROP TABLE IF EXISTS `asistentes`;
DROP TABLE IF EXISTS `eventos`;
DROP TABLE IF EXISTS `respuestas_encuesta`;
DROP TABLE IF EXISTS `encuestas`;
DROP TABLE IF EXISTS `destinatarios_campana`;
DROP TABLE IF EXISTS `campanas`;
DROP TABLE IF EXISTS `plantillas`;
DROP TABLE IF EXISTS `contactos`;


-- -----------------------------------------------------
-- Tabla `contactos`
-- Almacena la lista de todos los contactos.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contactos` (
  `id_contacto` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `nombre` VARCHAR(255) NULL,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` ENUM('suscrito', 'baja', 'pendiente') NOT NULL DEFAULT 'suscrito',
  PRIMARY KEY (`id_contacto`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `plantillas`
-- Almacena las plantillas de correo electrónico reutilizables.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `plantillas` (
  `id_plantilla` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `asunto` VARCHAR(255) NOT NULL,
  `cuerpo_html` LONGTEXT NOT NULL,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rol_creador` VARCHAR(50) NOT NULL COMMENT 'ej: it, marketing, hr',
  PRIMARY KEY (`id_plantilla`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `campanas`
-- Almacena información sobre cada campaña enviada.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `campanas` (
  `id_campana` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `asunto` VARCHAR(255) NOT NULL,
  `remitente` VARCHAR(255) NOT NULL,
  `estado` ENUM('borrador', 'enviando', 'terminada', 'pausada', 'fallida') NOT NULL DEFAULT 'borrador',
  `fecha_inicio` TIMESTAMP NULL,
  `fecha_fin` TIMESTAMP NULL,
  `rol_creador` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id_campana`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `destinatarios_campana`
-- Tabla de enlace para registrar qué contactos recibieron qué campaña.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `destinatarios_campana` (
  `id_destinatario_campana` INT NOT NULL AUTO_INCREMENT,
  `id_campana` INT NOT NULL,
  `id_contacto` INT NOT NULL,
  `estado_envio` ENUM('enviado', 'fallido', 'abierto', 'clic') NOT NULL DEFAULT 'enviado',
  `fecha_envio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_destinatario_campana`),
  INDEX `fk_campana_idx` (`id_campana` ASC) VISIBLE,
  INDEX `fk_contacto_idx` (`id_contacto` ASC) VISIBLE,
  CONSTRAINT `fk_destinatario_campana`
    FOREIGN KEY (`id_campana`)
    REFERENCES `campanas` (`id_campana`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_destinatario_contacto`
    FOREIGN KEY (`id_contacto`)
    REFERENCES `contactos` (`id_contacto`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `eventos`
-- Almacena información sobre eventos.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventos` (
  `id_evento` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `descripcion` TEXT NULL,
  `fecha_evento` DATE NOT NULL,
  `plantilla_certificado_json` JSON NULL COMMENT 'Almacena la configuración del diseño del certificado',
  PRIMARY KEY (`id_evento`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `asistentes`
-- Tabla de enlace entre contactos y eventos.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `asistentes` (
  `id_asistente` INT NOT NULL AUTO_INCREMENT,
  `id_evento` INT NOT NULL,
  `id_contacto` INT NOT NULL,
  `fecha_registro` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_asistente`),
  INDEX `fk_evento_idx` (`id_evento` ASC) VISIBLE,
  INDEX `fk_contacto_asistente_idx` (`id_contacto` ASC) VISIBLE,
  CONSTRAINT `fk_asistente_evento`
    FOREIGN KEY (`id_evento`)
    REFERENCES `eventos` (`id_evento`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_asistente_contacto`
    FOREIGN KEY (`id_contacto`)
    REFERENCES `contactos` (`id_contacto`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `encuestas`
-- Almacena la estructura de las encuestas.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `encuestas` (
  `id_encuesta` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(255) NOT NULL,
  `descripcion` TEXT NULL,
  `preguntas_json` JSON NOT NULL COMMENT 'Almacena las preguntas y tipos en formato JSON',
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_encuesta`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `respuestas_encuesta`
-- Almacena las respuestas de los contactos a las encuestas.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `respuestas_encuesta` (
  `id_respuesta` INT NOT NULL AUTO_INCREMENT,
  `id_encuesta` INT NOT NULL,
  `id_contacto` INT NOT NULL,
  `respuestas_json` JSON NOT NULL,
  `fecha_respuesta` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_respuesta`),
  INDEX `fk_encuesta_idx` (`id_encuesta` ASC) VISIBLE,
  INDEX `fk_contacto_encuesta_idx` (`id_contacto` ASC) VISIBLE,
  CONSTRAINT `fk_respuesta_encuesta`
    FOREIGN KEY (`id_encuesta`)
    REFERENCES `encuestas` (`id_encuesta`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_respuesta_contacto`
    FOREIGN KEY (`id_contacto`)
    REFERENCES `contactos` (`id_contacto`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `remitentes`
-- Almacena las cuentas de correo electrónico gestionadas por TI para envíos.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `remitentes` (
  `id_remitente` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `limite_diario` INT NOT NULL DEFAULT 10000,
  `activo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_remitente`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `permisos`
-- Almacena la configuración de permisos para cada rol.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `permisos` (
  `rol` VARCHAR(50) NOT NULL COMMENT 'it, marketing, hr',
  `permiso` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`rol`, `permiso`))
ENGINE = InnoDB;


-- Restablece las variables de entorno del SQL a sus valores originales.
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
