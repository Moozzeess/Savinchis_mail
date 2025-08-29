-- Trigger para actualizar el contador de contactos cuando se inserta un nuevo contacto en una lista
DELIMITER //
CREATE TRIGGER after_contacto_lista_insert
AFTER INSERT ON contactos_lista
FOR EACH ROW
BEGIN
    UPDATE listas_contactos 
    SET total_contactos = (
        SELECT COUNT(DISTINCT id_contacto) 
        FROM contactos_lista 
        WHERE id_lista = NEW.id_lista
    )
    WHERE id_lista = NEW.id_lista;
END//

-- Trigger para actualizar el contador de contactos cuando se elimina un contacto de una lista
DELIMITER //
CREATE TRIGGER after_contacto_lista_delete
AFTER DELETE ON contactos_lista
FOR EACH ROW
BEGIN
    UPDATE listas_contactos 
    SET total_contactos = (
        SELECT COUNT(DISTINCT id_contacto) 
        FROM contactos_lista 
        WHERE id_lista = OLD.id_lista
    )
    WHERE id_lista = OLD.id_lista;
END//

-- Actualizar el contador para las listas existentes
UPDATE listas_contactos lc
SET total_contactos = (
    SELECT COUNT(DISTINCT id_contacto) 
    FROM contactos_lista cl 
    WHERE cl.id_lista = lc.id_lista
);
