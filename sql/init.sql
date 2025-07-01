-- EmailCraft Lite - Database Initialization Script

-- Drop existing tables to start fresh
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS campaign_recipients;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS attendees;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS survey_responses;
DROP TABLE IF EXISTS surveys;
DROP TABLE IF EXISTS templates;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS senders;
DROP TABLE IF EXISTS permissions;
SET FOREIGN_KEY_CHECKS = 1;


-- Create 'senders' table for managed sender emails (for IT role)
CREATE TABLE senders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create 'contacts' table to store all user contacts
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    subscribed BOOLEAN DEFAULT TRUE,
    source VARCHAR(50), -- e.g., 'csv_import', 'manual', 'event_signup'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create 'templates' table for the block-based email editor
CREATE TABLE templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(255),
    content_json JSON, -- Storing the block structure as JSON
    preview_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create 'campaigns' table to track all email campaigns
CREATE TABLE campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    html_body LONGTEXT, -- To store the full HTML of the email
    sender_email VARCHAR(255) NOT NULL,
    status ENUM('DRAFT', 'SENDING', 'SENT', 'PAUSED', 'FAILED') DEFAULT 'DRAFT',
    role_owner ENUM('it', 'marketing', 'hr') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP NULL,
    total_recipients INT DEFAULT 0,
    sent_count INT DEFAULT 0,
    failed_count INT DEFAULT 0,
    duration_seconds DECIMAL(10, 2) DEFAULT 0.00
);

-- Create 'campaign_recipients' to link campaigns and contacts, and track individual status
CREATE TABLE campaign_recipients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    contact_id INT NOT NULL,
    status ENUM('QUEUED', 'SENT', 'FAILED', 'OPENED', 'CLICKED', 'BOUNCED') DEFAULT 'QUEUED',
    sent_at TIMESTAMP NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

-- Create 'events' table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    status ENUM('Próximo', 'Realizado', 'Cancelado') DEFAULT 'Próximo',
    certificate_template_json JSON -- To store the certificate design
);

-- Create 'attendees' table to link contacts to events
CREATE TABLE attendees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    contact_id INT NOT NULL,
    attended BOOLEAN DEFAULT TRUE,
    certificate_sent_at TIMESTAMP NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

-- Create 'surveys' table
CREATE TABLE surveys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    questions_json JSON, -- Storing survey questions as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create 'survey_responses' table
CREATE TABLE survey_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    survey_id INT NOT NULL,
    contact_id INT NOT NULL,
    answers_json JSON, -- Storing answers as JSON
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

-- Create 'permissions' table to manage RBAC
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('it', 'marketing', 'hr') NOT NULL,
    permission_key VARCHAR(255) NOT NULL,
    UNIQUE(role, permission_key)
);

--
-- INSERTING SAMPLE DATA
--

-- Insert managed senders for the IT role
INSERT INTO senders (name, email) VALUES
('Soporte Técnico', 'soporte@emailcraft.com'),
('Notificaciones del Sistema', 'noreply@emailcraft.com'),
('Comunicaciones Internas', 'comms@emailcraft.com');

-- Insert sample contacts
INSERT INTO contacts (email, name, subscribed, source) VALUES
('juan.perez@example.com', 'Juan Perez', TRUE, 'manual'),
('maria.garcia@example.com', 'Maria Garcia', TRUE, 'csv_import'),
('carlos.baja@example.com', 'Carlos Baja', FALSE, 'manual'),
('laura.activa@example.com', 'Laura Activa', TRUE, 'event_signup'),
('pedro.gomez@example.com', 'Pedro Gomez', TRUE, 'event_signup');

-- Insert sample templates (using JSON for content)
INSERT INTO templates (name, description, subject, content_json, preview_image_url) VALUES
('Newsletter Mensual', 'Plantilla estándar para el boletín informativo.', 'Novedades de este mes', '[{"id": "block1", "type": "text", "content": {"text": "Hola [[contact.name]], aquí están las noticias..."}}, {"id": "block2", "type": "image", "content": {"src": "https://placehold.co/600x300.png", "alt": "Noticias"}}, {"id": "block3", "type": "button", "content": {"text": "Leer Más", "href": "https://example.com/news"}}]', 'https://placehold.co/600x400.png'),
('Anuncio de Producto', 'Plantilla para anunciar nuevos productos.', '¡Nuevo producto disponible!', '[{"id": "block1", "type": "image", "content": {"src": "https://placehold.co/600x400.png", "alt": "Nuevo producto"}}, {"id": "block2", "type": "text", "content": {"text": "Te presentamos nuestro increíble nuevo producto..."}}, {"id": "block3", "type": "button", "content": {"text": "Comprar Ahora", "href": "https://example.com/product"}}]', 'https://placehold.co/600x400.png');

-- Insert sample events
INSERT INTO events (name, description, event_date, status) VALUES
('Taller de Marketing Digital', 'Un taller intensivo sobre estrategias de marketing.', '2024-08-15', 'Realizado'),
('Conferencia de Liderazgo', 'Conferencia anual sobre liderazgo y gestión.', '2024-09-05', 'Próximo');

-- Insert sample attendees
INSERT INTO attendees (event_id, contact_id) VALUES
(1, 1), (1, 2), (2, 4);

-- Insert sample surveys
INSERT INTO surveys (title, description, questions_json) VALUES
('Feedback de Producto de TI', 'Opiniones sobre nuestro último software.', '[{"id": "q1", "text": "¿Qué tan satisfecho estás?", "type": "multiple-choice", "options": [{"value": "Muy satisfecho"}, {"value": "Satisfecho"}]}, {"id": "q2", "text": "Comentarios adicionales", "type": "textarea"}]'),
('Satisfacción del Cliente Tech', 'Mide la satisfacción general con el soporte técnico.', '[{"id": "q1", "text": "¿Resolvimos tu problema?", "type": "multiple-choice", "options": [{"value": "Sí"}, {"value": "No"}]}]');

-- Insert sample campaigns
INSERT INTO campaigns (name, subject, html_body, sender_email, status, role_owner, sent_at, total_recipients, sent_count) VALUES
('Lanzamiento Nuevo Producto', '¡Nuestro nuevo producto ya está aquí!', '<h1>Mira esto</h1>', 'marketing@emailcraft.com', 'SENT', 'marketing', '2024-07-18 10:00:00', 15000, 15000),
('Encuesta de Satisfacción Q3 (TI)', 'Tu opinión nos importa', '<p>Por favor, completa esta encuesta.</p>', 'soporte@emailcraft.com', 'SENT', 'it', '2024-07-20 11:00:00', 5000, 5000),
('Contrataciones Abiertas', '¡Únete a nuestro equipo!', '<p>Estamos contratando.</p>', 'rh@emailcraft.com', 'SENT', 'hr', '2024-07-15 09:00:00', 500, 500),
('Aviso de Mantenimiento', 'Mantenimiento programado de servidores', '<p>Habrá un corte de servicio.</p>', 'noreply@emailcraft.com', 'SENT', 'it', '2024-07-21 14:00:00', 4000, 4000);

-- Insert RBAC permissions
-- Marketing Role Permissions
INSERT INTO permissions (role, permission_key) VALUES
('marketing', 'dashboard:view'),
('marketing', 'campaign:send'),
('marketing', 'campaign:view'),
('marketing', 'mailbox:view'),
('marketing', 'contacts:view'),
('marketing', 'templates:view'),
('marketing', 'surveys:view'),
('marketing', 'performance:view'),
('marketing', 'performance:view_main_metrics'),
('marketing', 'performance:view_charts'),
('marketing', 'performance:view_funnel'),
('marketing', 'performance:view_segments'),
('marketing', 'performance:view_predictions');

-- HR Role Permissions
INSERT INTO permissions (role, permission_key) VALUES
('hr', 'dashboard:view'),
('hr', 'campaign:send'),
('hr', 'campaign:view'),
('hr', 'mailbox:view'),
('hr', 'contacts:view'),
('hr', 'events:view');
