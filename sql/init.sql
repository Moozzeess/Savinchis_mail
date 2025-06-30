-- sql/init.sql

-- Eliminar tablas si existen para un inicio limpio
DROP TABLE IF EXISTS `attendees`;
DROP TABLE IF EXISTS `surveys`;
DROP TABLE IF EXISTS `events`;
DROP TABLE IF EXISTS `order_data_online`;
DROP TABLE IF EXISTS `order_data`;
DROP TABLE IF EXISTS `vips`;
DROP TABLE IF EXISTS `contacts`;

-- Tabla de Contactos
CREATE TABLE `contacts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `name` VARCHAR(255),
  `subscribed` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de VIPs (ejemplo para consultas SQL)
CREATE TABLE `vips` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE
);

-- Tabla de Datos de Órdenes (simulando datos de visitas)
CREATE TABLE `order_data` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `Ds_Merchant_Order` VARCHAR(255) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL,
  `nombre_completo` VARCHAR(255),
  `fecha_visita` VARCHAR(20) -- Formato 'DD/MM/YYYY'
);

-- Tabla de Datos de Órdenes Online (complementaria)
CREATE TABLE `order_data_online` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `Ds_Order` VARCHAR(255) NOT NULL,
  `Ds_ErrorCode` VARCHAR(10),
  `Ds_ErrorMessage` VARCHAR(255)
);

-- Tabla de Eventos
CREATE TABLE `events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `date` VARCHAR(20) NOT NULL,
  `status` VARCHAR(50),
  `attendees` INT
);

-- Tabla de Encuestas
CREATE TABLE `surveys` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `responses` INT
);

-- Tabla de Asistentes a Eventos
CREATE TABLE `attendees` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255),
  UNIQUE KEY `event_attendee` (`event_id`,`email`)
);

-- --- Inserción de Datos de Ejemplo ---

-- Contactos
INSERT INTO `contacts` (`email`, `name`, `subscribed`) VALUES
('juan.perez@example.com', 'Juan Perez', TRUE),
('maria.garcia@example.com', 'Maria Garcia', TRUE),
('baja@example.com', 'Carlos Baja', FALSE),
('test@example.com', 'Test User', TRUE);

-- VIPs
INSERT INTO `vips` (`email`) VALUES
('vip1@example.com'),
('vip2@example.com');

-- Datos de Visitas (para la opción 'Fecha de Visita')
INSERT INTO `order_data` (`Ds_Merchant_Order`, `email`, `nombre_completo`, `fecha_visita`) VALUES
('ORD001', 'visitante1@example.com', 'Ana Torres', '15/09/2024'),
('ORD002', 'visitante2@example.com', 'Luis Gomez', '15/09/2024');

INSERT INTO `order_data_online` (`Ds_Order`, `Ds_ErrorCode`, `Ds_ErrorMessage`) VALUES
('ORD001', '00', 'completed'),
('ORD002', '00', 'completed');

-- Eventos
INSERT INTO `events` (`id`, `name`, `date`, `status`, `attendees`) VALUES
(1, 'Taller de Marketing Digital', '2024-08-15', 'Realizado', 75),
(2, 'Conferencia de Liderazgo', '2024-09-05', 'Próximo', 120),
(3, 'Webinar de Nuevas Tecnologías', '2024-07-20', 'Realizado', 250);

-- Encuestas
INSERT INTO `surveys` (`id`, `name`, `description`, `responses`) VALUES
(1, 'Feedback de Producto de TI', 'Encuesta para recopilar opiniones sobre nuestro último software.', 150),
(2, 'Satisfacción del Cliente Tech', 'Mide la satisfacción general de nuestros clientes con el soporte técnico.', 278),
(3, 'Interés en Nuevos Cursos', 'Sondeo sobre posibles nuevos cursos de desarrollo y TI.', 45);

-- Asistentes a Eventos (para la generación de certificados)
INSERT INTO `attendees` (`event_id`, `email`, `name`) VALUES
(1, 'asistente1@taller.com', 'Elena Rivas'),
(1, 'asistente2@taller.com', 'Pedro Luna'),
(3, 'asistente3@webinar.com', 'Sofia Castro');
