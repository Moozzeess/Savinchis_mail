import mysql from 'mysql2/promise';

/**
 * @function getDbConnection
 * @description Establece y retorna una conexión a la base de datos MySQL utilizando las variables de entorno.
 * @returns {Promise<mysql.Connection>} Una promesa que resuelve con un objeto de conexión a la base de datos.
 * @throws {Error} Si alguna de las variables de entorno de la base de datos (MYSQL_HOST, MYSQL_USER, MYSQL_DATABASE) no está configurada.
 * @async
 */
export async function getDbConnection(): Promise<mysql.Connection> {
  const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT } = process.env;
  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
    throw new Error('Faltan las variables de entorno de la base de datos. Por favor, configúralas.');
  }

  // Parsea el puerto a un entero, usando 3306 como valor predeterminado si MYSQL_PORT no está definido.
  const port = MYSQL_PORT ? parseInt(MYSQL_PORT, 10) : 3306;

  return await mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    port: port
  });
}