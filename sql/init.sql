
-- Eliminar tablas existentes para una instalación limpia
DROP TABLE IF EXISTS `resumen_envios_campana`;
DROP TABLE IF EXISTS `envios_campana`;
DROP TABLE IF EXISTS `recurrencias_campana`;
DROP TABLE IF EXISTS `contactos_lista`;
DROP TABLE IF EXISTS `campaigns`;
DROP TABLE IF EXISTS `listas_contactos`;
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

-- -----------------------------------------------------
-- Tabla `contactos`
-- Almacena la información de contacto de los destinatarios.
-- -----------------------------------------------------
CREATE TABLE `contactos` (
  `id_contacto` int NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(100) NOT NULL,
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
-- Tabla `campaigns`
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
  `datos_adicionales` json DEFAULT NULL,
  PRIMARY KEY (`id_campaign`),
  KEY `idx_estado` (`estado`),
  KEY `idx_fecha_envio` (`fecha_envio`),
  KEY `fk_campaign_plantill-idx` (`id_plantilla`),
  KEY `fk_campaign_list-idx` (`id_lista_contactos`),
  CONSTRAINT `fk_campaign_plantilla` FOREIGN KEY (`id_plantilla`) REFERENCES `plantillas` (`id_plantilla`) ON DELETE SET NULL,
  CONSTRAINT `fk_campaign_lista` FOREIGN KEY (`id_lista_contactos`) REFERENCES `listas_contactos` (`id_lista`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Almacena la información de las campañas de correo electrónico';

-- -----------------------------------------------------
-- Tabla `recurrencias_campana`
-- Configuración de recurrencia para campañas.
-- -----------------------------------------------------
CREATE TABLE `recurrencias_campana` (
  `id_recurrencia` INT NOT NULL AUTO_INCREMENT,
  `id_campaign` INT NOT NULL,
  `tipo_recurrencia` ENUM('diaria', 'semanal', 'mensual', 'anual') NOT NULL,
  `intervalo` INT DEFAULT 1, -- Por ejemplo, cada 2 días, cada 3 semanas
  `dias_semana` VARCHAR(15) DEFAULT NULL, -- Ejemplo: "LU,MA,MI" para semanal
  `dia_mes` INT DEFAULT NULL, -- Para recurrencia mensual (ej. día 15)
  `fech-inicio` DATE NOT NULL,
  `fecha_fin` DATE DEFAULT NULL,
  `veces_enviadas` INT DEFAULT 0,
  `ultima_ejecucion` DATETIME DEFAULT NULL,
  `proxima_ejecucion` DATETIME DEFAULT NULL,
  `estado` ENUM('activa','inactiva','finalizada') NOT NULL DEFAULT 'activa',
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_recurrencia`),
  KEY `fk_rc_campaign_idx` (`id_campaign`),
  CONSTRAINT `fk_rc_campaign` FOREIGN KEY (`id_campaign`) REFERENCES `campaigns` (`id_campaign`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Configuración de recurrencia para campañas';

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

-- -----------------------------------------------------
-- Tabla `resumen_envios_campana`
-- Almacena el resumen de los envíos de campañas.
-- -----------------------------------------------------
CREATE TABLE `resumen_envios_campana` (
  `id_resumen` INT NOT NULL AUTO_INCREMENT,
  `id_campaign` INT NOT NULL,
  `id_lista_contactos` INT DEFAULT NULL,
  `fecha_resumen` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `total_enviados` INT NOT NULL DEFAULT 0,
  `total_entregados` INT NOT NULL DEFAULT 0,
  `total_abiertos` INT NOT NULL DEFAULT 0,
  `total_clicks` INT NOT NULL DEFAULT 0,
  `total_rebotados` INT NOT NULL DEFAULT 0,
  `total_fallidos` INT NOT NULL DEFAULT 0,
  `total_quejas` INT NOT NULL DEFAULT 0,
  `datos_adicionales` JSON DEFAULT NULL,
  PRIMARY KEY (`id_resumen`),
  KEY `idx_resumen_campaign` (`id_campaign`),
  KEY `idx_resumen_lista` (`id_lista_contactos`),
  CONSTRAINT `fk_resumen_campaign` FOREIGN KEY (`id_campaign`) REFERENCES `campaigns` (`id_campaign`) ON DELETE CASCADE,
  CONSTRAINT `fk_resumen_lista` FOREIGN KEY (`id_lista_contactos`) REFERENCES `listas_contactos` (`id_lista`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Resumen de los envíos de campañas';

-- Trigger para actualizar el contador de contactos en listas
DELIMITER //

-- Eliminar triggers existentes si existen
DROP TRIGGER IF EXISTS after_contacto_list_insert//
DROP TRIGGER IF EXISTS after_contacto_lista_update//
DROP TRIGGER IF EXISTS after_contacto_lista_delete//

-- Trigger para inserciones
CREATE TRIGGER after_contacto_list_insert
AFTER INSERT ON contactos_lista
FOR EACH ROW
BEGIN
    -- Actualizar la lista con el nuevo conteo de contactos únicos activos
    UPDATE listas_contactos 
    SET 
        total_contactos = (
            SELECT COUNT(DISTINCT id_contacto)
            FROM contactos_lista 
            WHERE id_lista = NEW.id_lista 
            AND estado = 'activo'
        ),
        fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id_lista = NEW.id_lista;
END//

-- Trigger para actualizaciones
CREATE TRIGGER after_contacto_lista_update
AFTER UPDATE ON contactos_lista
FOR EACH ROW
BEGIN
    DECLARE old_list_id INT;
    DECLARE new_list_id INT;
    
    SET old_list_id = OLD.id_lista;
    SET new_list_id = NEW.id_lista;
    
    -- Si cambió la lista o el estado, actualizar ambas listas si son diferentes
    IF OLD.estado != NEW.estado OR old_list_id != new_list_id THEN
        -- Actualizar la lista anterior si es diferente de la nueva
        IF old_list_id != new_list_id OR (OLD.estado = 'activo' AND NEW.estado != 'activo') THEN
            UPDATE listas_contactos 
            SET 
                total_contactos = (
                    SELECT COUNT(DISTINCT id_contacto)
                    FROM contactos_lista 
                    WHERE id_lista = old_list_id 
                    AND estado = 'activo'
                ),
                fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id_lista = old_list_id;
        END IF;
        
        -- Actualizar la nueva lista si el nuevo estado es activo
        IF new_list_id != old_list_id OR NEW.estado = 'activo' THEN
            UPDATE listas_contactos 
            SET 
                total_contactos = (
                    SELECT COUNT(DISTINCT id_contacto)
                    FROM contactos_lista 
                    WHERE id_lista = new_list_id 
                    AND estado = 'activo'
                ),
                fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id_lista = new_list_id;
        END IF;
    END IF;
END//

-- Trigger para eliminaciones
CREATE TRIGGER after_contacto_lista_delete
AFTER DELETE ON contactos_lista
FOR EACH ROW
BEGIN
    UPDATE listas_contactos 
    SET 
        total_contactos = (
            SELECT COUNT(DISTINCT id_contacto)
            FROM contactos_lista 
            WHERE id_lista = OLD.id_lista 
            AND estado = 'activo'
        ),
        fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id_lista = OLD.id_lista;
END//

-- Actualizar contadores para listas existentes
UPDATE listas_contactos lc
SET 
    total_contactos = (
        SELECT COUNT(DISTINCT id_contacto)
        FROM contactos_lista cl 
        WHERE cl.id_lista = lc.id_lista
        AND cl.estado = 'activo'
    ),
    fecha_actualizacion = CURRENT_TIMESTAMP
WHERE total_contactos != (
    SELECT COUNT(DISTINCT id_contacto)
    FROM contactos_lista cl 
    WHERE cl.id_lista = lc.id_lista
    AND cl.estado = 'activo'
) OR total_contactos IS NULL//

DELIMITER ;
