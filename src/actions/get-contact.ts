import * as XLSX from 'xlsx';
import mysql from 'mysql2/promise';

// Utilidad para validar correos electrónicos
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Procesa un archivo Excel para extraer contactos validados.
 * @param fileBuffer Buffer del archivo Excel.
 * @param nameCol Nombre de la columna que contiene el nombre.
 * @param emailCol Nombre de la columna que contiene el correo.
 * @returns Un objeto con la lista de contactos y un mensaje de validación.
 */
export async function getContactsFromExcel(
  fileBuffer: Buffer,
  nameCol: string,
  emailCol: string
): Promise<{ success: boolean; message: string; contacts?: { nombre: string; email: string }[] }> {
  try {
    // Leer el archivo Excel
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

    
    // Validar que existan las columnas requeridas
    if (rows.length === 0) {
      return { success: false, message: 'El archivo está vacío.' };
    }
    if (!(nameCol in rows[0]) || !(emailCol in rows[0])) {
      return { success: false, message: 'No se encontraron las columnas especificadas.' };
    }

    // Extraer y validar contactos
    const contacts = [];
    for (const row of rows) {
      const nombre = String(row[nameCol] || '').trim();
      const email = String(row[emailCol] || '').trim();

      if (nombre && email && isValidEmail(email)) {
        contacts.push({ nombre, email });
      }
    }

    if (contacts.length === 0) {
      return { success: false, message: 'No se encontraron contactos válidos en el archivo.' };
    }

    return {
      success: true,
      message: 'Se ha validado correctamente la lista cargada.',
      contacts,
    };
  } catch (error) {
    return { success: false, message: 'Error procesando el archivo: ' + (error as Error).message };
  }
}