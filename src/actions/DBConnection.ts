'use server';


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

   // Validación más detallada
   const missingVars = [];
   if (!MYSQL_HOST) missingVars.push('MYSQL_HOST');
   if (!MYSQL_USER) missingVars.push('MYSQL_USER');
   if (!MYSQL_DATABASE) missingVars.push('MYSQL_DATABASE');
   
   if (missingVars.length > 0) {
     throw new Error(`Faltan las siguientes variables de entorno: ${missingVars.join(', ')}`);
   }
 
   const port = MYSQL_PORT ? parseInt(MYSQL_PORT, 10) : 3306;
 
   try {
     const connection = await mysql.createConnection({
       host: MYSQL_HOST,
       user: MYSQL_USER,
       password: MYSQL_PASSWORD,
       database: MYSQL_DATABASE,
       port: port,
       // Opciones adicionales útiles
       connectTimeout: 10000, // 10 segundos de timeout
       supportBigNumbers: true,
       bigNumberStrings: true
     });
     
     console.log('Conexión a la base de datos establecida correctamente');
     return connection;
   } catch (error) {
     console.error('Error al conectar a la base de datos:', error);
     throw new Error(`No se pudo conectar a la base de datos: ${(error as Error).message}`);
   }
}