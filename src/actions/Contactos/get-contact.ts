import * as XLSX from 'xlsx';
import mysql from 'mysql2/promise';

// Utilidad para validar correos electrónicos
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

interface ContactSummary {
  total: number;
  validEmails: number;
  invalidEmails: number;
  duplicates: number;
  sampleEmails: string[];
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
): Promise<{ success: boolean; message: string; contacts?: { nombre: string; email: string }[]; summary?: ContactSummary }> {
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
    const contacts: { nombre_completo: string; email: string }[] = [];
    const allEmails: string[] = [];
    const invalidEmailsSet: Set<string> = new Set();
    const seenEmails: Set<string> = new Set();
    let duplicatesCount = 0;

    for (const row of rows) {
      const nombre_completo = String(row[nameCol] || '').trim();
      const email = String(row[emailCol] || '').trim();
      allEmails.push(email); // Para contar duplicados y totales

      if (!email || !isValidEmail(email)) {
        invalidEmailsSet.add(email); // Recopilar correos inválidos
        continue;
      }

      if (seenEmails.has(email)) {
        duplicatesCount++;
      } else {
        seenEmails.add(email);
        // Solo añadir contactos válidos y únicos a la lista final
        if (nombre_completo) {
          contacts.push({ nombre_completo, email });
        } else {
          contacts.push({ nombre_completo: email, email }); // Usar email como nombre si no hay nombre
        }
      }
    }

    const totalValidEmails = contacts.length;
    const totalInvalidEmails = invalidEmailsSet.size;
    const totalContacts = allEmails.length;

    const summary = {
      total: totalContacts,
      validEmails: totalValidEmails,
      invalidEmails: totalInvalidEmails,
      duplicates: duplicatesCount,
      sampleEmails: contacts.slice(0, 5).map(c => c.email)
    };

    if (contacts.length === 0 && totalValidEmails === 0 && totalInvalidEmails === 0) {
      return { success: false, message: 'No se encontraron contactos válidos en el archivo.' };
    }

    return {
      success: true,
      message: 'Se ha validado y resumido correctamente la lista cargada.',
      contacts: contacts.map(c => ({
        nombre: c.nombre_completo,
        email: c.email
      })),
      summary,
    };
  } catch (error) {
    return { success: false, message: 'Error procesando el archivo: ' + (error as Error).message };
  }
}