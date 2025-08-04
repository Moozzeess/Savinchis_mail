
-- Eliminar tablas existentes para una instalación limpia
DROP TABLE IF EXISTS `envios_campana`;
DROP TABLE IF EXISTS `campaigns`;
DROP TABLE IF EXISTS `contactos_lista`;
DROP TABLE IF EXISTS `listas_contactos`;
DROP TABLE IF EXISTS `envios_campana`;
DROP TABLE IF EXISTS `campanas`;
DROP TABLE IF EXISTS `contactos`;
DROP TABLE IF EXISTS `plantillas`;

-- -----------------------------------------------------
-- Tabla `plantillas`
-- Almacena las plantillas de correo electrónico creadas por los usuarios.
-- -----------------------------------------------------
CREATE TABLE `plantillas` (
  `id_plantilla` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `asunto_predeterminado` VARCHAR(255) DEFAULT NULL,
  `contenido` TEXT,
  `fecha_creacion` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `categoria` VARCHAR(255) NOT NULL DEFAULT 'Otro',
  `tipo` VARCHAR(50) NOT NULL DEFAULT 'template',
  PRIMARY KEY (`id_plantilla`),
  KEY `idx_fecha_creacion` (`fecha_creacion` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Almacena las plantillas de correo con un editor de bloques.';
  `fecha_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_plantilla`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Tabla `contactos`
-- Almacena la información de contacto de los destinatarios.
-- -----------------------------------------------------
CREATE TABLE `contactos` (
  `id_contacto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `empresa` varchar(100) DEFAULT NULL,
  `puesto` varchar(100) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `estado` enum('activo','inactivo','baja') NOT NULL DEFAULT 'activo',
  `datos_adicionales` json DEFAULT NULL,
  PRIMARY KEY (`id_contacto`),
  UNIQUE KEY `uk_email` (`email`),
  KEY `idx_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Almacena la información de contacto de los destinatarios';

-- -----------------------------------------------------
-- Tabla `listas_contactos`
-- Almacena las listas de contactos creadas por los usuarios.
-- -----------------------------------------------------
CREATE TABLE `listas_contactos` (
  `id_lista` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `estado` enum('activa','inactiva','eliminada') NOT NULL DEFAULT 'activa',
  `total_contactos` int NOT NULL DEFAULT '0',
  `datos_adicionales` json DEFAULT NULL,
  PRIMARY KEY (`id_lista`),
  KEY `idx_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Almacena las listas de contactos creadas por los usuarios';

-- -----------------------------------------------------
-- Tabla `contactos_lista`
-- Relación muchos a muchos entre contactos y listas.
-- -----------------------------------------------------
CREATE TABLE `contactos_lista` (
  `id_contacto` int NOT NULL,
  `id_lista` int NOT NULL,
  `fecha_insercion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('activo','inactivo','baja') NOT NULL DEFAULT 'activo',
  `datos_adicionales` json DEFAULT NULL,
  PRIMARY KEY (`id_contacto`,`id_lista`),
  KEY `idx_lista` (`id_lista`),
  CONSTRAINT `fk_cl_contacto` FOREIGN KEY (`id_contacto`) REFERENCES `contactos` (`id_contacto`) ON DELETE CASCADE,
  CONSTRAINT `fk_cl_lista` FOREIGN KEY (`id_lista`) REFERENCES `listas_contactos` (`id_lista`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Relación entre contactos y listas';

-- -----------------------------------------------------
-- Tabla `campañas`
-- Almacena la información de las campañas de correo electrónico.
-- -----------------------------------------------------
CREATE TABLE `campaigns` (
  `id_campaign` int NOT NULL AUTO_INCREMENT,
  `nombre_campaign` varchar(255) NOT NULL,
  `descripcion` text,
  `id_plantilla` int DEFAULT NULL,
  `asunto` varchar(255) NOT NULL,
  `contenido` text,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fecha_envio` datetime DEFAULT NULL,
  `estado` enum('borrador','programada','en_progreso','completada','pausada','cancelada') NOT NULL DEFAULT 'borrador',
  `id_lista_contactos` int DEFAULT NULL,
  `nombre_lista_contactos` varchar(255) DEFAULT NULL,
  `descripcion_lista_contactos` text,
  `total_contactos` int NOT NULL DEFAULT '0',
  `datos_adicionales` json DEFAULT NULL,
  PRIMARY KEY (`id_campaign`),
  KEY `idx_estado` (`estado`),
  KEY `idx_fecha_envio` (`fecha_envio`),
  KEY `fk_campaign_plantilla_idx` (`id_plantilla`),
  KEY `fk_campaign_lista_idx` (`id_lista_contactos`),
  CONSTRAINT `fk_campaign_plantilla` FOREIGN KEY (`id_plantilla`) REFERENCES `plantillas` (`id_plantilla`) ON DELETE SET NULL,
  CONSTRAINT `fk_campaign_lista` FOREIGN KEY (`id_lista_contactos`) REFERENCES `listas_contactos` (`id_lista`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Almacena la información de las campañas de correo electrónico';

-- -----------------------------------------------------
-- Tabla `envios_campana`
-- Almacena el registro de envíos individuales de una campaña.
-- -----------------------------------------------------
CREATE TABLE `envios_campana` (
  `id_envio` bigint NOT NULL AUTO_INCREMENT,
  `id_campana` int NOT NULL,
  `id_contacto` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `fecha_envio` datetime DEFAULT NULL,
  `estado` enum('pendiente','enviado','entregado','fallido','rebotado') NOT NULL DEFAULT 'pendiente',
  `intentos` tinyint NOT NULL DEFAULT '0',
  `error` text,
  `fecha_entrega` datetime DEFAULT NULL,
  `fecha_apertura` datetime DEFAULT NULL,
  `ip_apertura` varchar(45) DEFAULT NULL,
  `user_agent_apertura` text,
  `fecha_click` datetime DEFAULT NULL,
  `url_click` text,
  `ip_click` varchar(45) DEFAULT NULL,
  `user_agent_click` text,
  `token_seguimiento` varchar(100) NOT NULL,
  `datos_adicionales` json DEFAULT NULL,
  PRIMARY KEY (`id_envio`),
  UNIQUE KEY `uk_token_seguimiento` (`token_seguimiento`),
  KEY `idx_campana` (`id_campana`),
  KEY `idx_contacto` (`id_contacto`),
  KEY `idx_estado` (`estado`),
  KEY `idx_token` (`token_seguimiento`),
  CONSTRAINT `fk_ec_campana` FOREIGN KEY (`id_campana`) REFERENCES `campaigns` (`id_campaign`) ON DELETE CASCADE,
  CONSTRAINT `fk_ec_contacto` FOREIGN KEY (`id_contacto`) REFERENCES `contactos` (`id_contacto`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Registro de envíos individuales de una campaña';

-- Trigger para actualizar el contador de contactos en listas
DELIMITER //
CREATE TRIGGER after_contacto_lista_insert
AFTER INSERT ON contactos_lista
FOR EACH ROW
BEGIN
    UPDATE listas_contactos 
    SET total_contactos = (
        SELECT COUNT(*) 
        FROM contactos_lista 
        WHERE id_lista = NEW.id_lista 
        AND estado = 'activo'
    )
    WHERE id_lista = NEW.id_lista;
END//

CREATE TRIGGER after_contacto_lista_update
AFTER UPDATE ON contactos_lista
FOR EACH ROW
BEGIN
    IF OLD.estado != NEW.estado OR OLD.id_lista != NEW.id_lista THEN
        -- Actualizar la lista anterior si cambió de lista
        IF OLD.id_lista != NEW.id_lista OR (OLD.estado = 'activo' AND NEW.estado != 'activo') THEN
            UPDATE listas_contactos 
            SET total_contactos = (
                SELECT COUNT(*) 
                FROM contactos_lista 
                WHERE id_lista = OLD.id_lista 
                AND estado = 'activo'
            )
            WHERE id_lista = OLD.id_lista;
        END IF;
        
        -- Actualizar la nueva lista
        IF NEW.estado = 'activo' THEN
            UPDATE listas_contactos 
            SET total_contactos = (
                SELECT COUNT(*) 
                FROM contactos_lista 
                WHERE id_lista = NEW.id_lista 
                AND estado = 'activo'
            )
            WHERE id_lista = NEW.id_lista;
        END IF;
    END IF;
END//

CREATE TRIGGER after_contacto_lista_delete
AFTER DELETE ON contactos_lista
FOR EACH ROW
BEGIN
    UPDATE listas_contactos 
    SET total_contactos = (
        SELECT COUNT(*) 
        FROM contactos_lista 
        WHERE id_lista = OLD.id_lista 
        AND estado = 'activo'
    )
    WHERE id_lista = OLD.id_lista;
END//
DELIMITER ;
