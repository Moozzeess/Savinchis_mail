/**
 * @fileOverview Datos de prueba para la aplicación.
 * Este archivo contiene datos de ejemplo para campañas y contactos,
 * utilizados para poblar la interfaz de usuario hasta que se conecte una base de datos real.
 */

/**
 * Datos de ejemplo para las campañas de correo electrónico.
 */
export const campaigns = [
  {
    name: "Lanzamiento de Verano",
    status: "Enviado",
    sent: "1,200",
    opens: "25%",
    clicks: "5%",
    date: "2024-07-15",
  },
  {
    name: "Promoción de Otoño",
    status: "Programado",
    sent: "1,500",
    opens: "-",
    clicks: "-",
    date: "2024-09-01",
  },
  {
    name: "Newsletter Mensual",
    status: "Borrador",
    sent: "N/A",
    opens: "-",
    clicks: "-",
    date: "-",
  },
];

/**
 * Datos de ejemplo para los contactos.
 */
export const contacts = [
  {
    email: "juan.perez@example.com",
    name: "Juan Perez",
    status: "Suscrito",
    dateAdded: "2024-07-10",
  },
  {
    email: "maria.garcia@example.com",
    name: "Maria Garcia",
    status: "Suscrito",
    dateAdded: "2024-07-09",
  },
  {
    email: "baja@example.com",
    name: "Carlos Baja",
    status: "Baja",
    dateAdded: "2024-06-20",
  },
];
