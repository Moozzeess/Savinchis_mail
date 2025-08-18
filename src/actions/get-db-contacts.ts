'use server';

import mysql from 'mysql2/promise';

interface DatabaseConnection {
  serverType: string;
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
  query: string;
}

interface ContactSummary {
  total: number;
  validEmails: number;
  invalidEmails: number;
  duplicates: number;
  sampleEmails: string[];
}

interface Contact {
    nombre_completo: string;
    email: string;
}

// Utilidad para validar correos electrónicos
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\\.[^\s@]+$/.test(email);
}

/**
 * Establece y retorna una conexión a la base de datos MySQL.
 * Se reutiliza la función de conexión de new-campaign-action.
 */
async function getDbConnection(dbConfig: { host: string; user: string; password?: string; database: string; port?: number }) {
  const { host, user, password, database, port } = dbConfig;
  if (!host || !user || !database) {
    throw new Error('Faltan las credenciales de conexión a la base de datos.');
  }
  return await mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database,
    port: port,
    namedPlaceholders: true
  });
}

/**
 * Conecta a una base de datos externa, ejecuta una consulta y extrae contactos.
 * Realiza validación de correos y proporciona un resumen de contactos.
 * @param connectionData Datos de conexión a la base de datos.
 * @param emailColumn Nombre de la columna que contiene el correo electrónico.
 * @param nameColumn Nombre de la columna que contiene el nombre completo.
 * @returns Objeto con éxito, mensaje, contactos y resumen.
 */
export async function getDbContacts(
  connectionData: DatabaseConnection,
  emailColumn: string,
  nameColumn: string
): Promise<{ success: boolean; message: string; contacts?: Contact[]; summary?: ContactSummary }> {
  let connection;
  try {
    // Solo se soporta MySQL por ahora, se podría extender para otros tipos de DB
    if (connectionData.serverType !== 'mysql') {
      return { success: false, message: 'Tipo de base de datos no soportado (solo MySQL por ahora).' };
    }

    const dbConfig = {
      host: connectionData.host,
      user: connectionData.username,
      password: connectionData.password,
      database: connectionData.database,
      port: connectionData.port ? parseInt(connectionData.port, 10) : 3306,
    };

    connection = await getDbConnection(dbConfig);
    
    // Ejecutar la consulta SQL
    const [rows] = await connection.execute(connectionData.query);

    if (!Array.isArray(rows) || rows.length === 0) {
      return { success: false, message: 'La consulta no devolvió resultados o los resultados no son válidos.' };
    }

    const contacts: Contact[] = [];
    const allEmails: string[] = [];
    const invalidEmailsSet: Set<string> = new Set();
    const seenEmails: Set<string> = new Set();
    let duplicatesCount = 0;

    for (const row of rows as any[]) {
      const email = String(row[emailColumn] || '').trim();
      const nombre_completo = String(row[nameColumn] || '').trim();
      
      allEmails.push(email);

      if (!email || !isValidEmail(email)) {
        invalidEmailsSet.add(email);
        continue;
      }

      if (seenEmails.has(email)) {
        duplicatesCount++;
      } else {
        seenEmails.add(email);
        contacts.push({ 
          email, 
          nombre_completo: nombre_completo || email // Usa el email como nombre si no se proporciona nombre
        });
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

    if (totalValidEmails === 0 && totalInvalidEmails === 0) {
      return { success: false, message: 'No se encontraron contactos válidos en la base de datos con la consulta proporcionada.' };
    }

    return {
      success: true,
      message: 'Conexión exitosa y contactos extraídos correctamente.',
      contacts,
      summary,
    };

  } catch (error) {
    console.error('Error en getDbContacts:', error);
    return { success: false, message: 'Error al conectar o ejecutar la consulta en la base de datos: ' + (error as Error).message };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
